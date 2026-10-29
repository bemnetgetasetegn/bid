-- ============================================================
-- ONEBID — Server-side PostgreSQL Functions
-- Migration 003: Atomic wallet, top-up, and bidding operations
-- ============================================================

-- ============================================================
-- FUNCTION: approve_top_up_request
-- Atomic operation: approve top-up and credit wallet
-- ============================================================
CREATE OR REPLACE FUNCTION public.approve_top_up_request(
  p_request_id UUID,
  p_admin_id UUID,
  p_review_note TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_request RECORD;
  v_wallet RECORD;
  v_new_balance BIGINT;
  v_ledger_id UUID;
BEGIN
  -- Verify admin
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_admin_id AND is_admin = TRUE) THEN
    RAISE EXCEPTION 'Unauthorized: not an administrator';
  END IF;

  -- Lock the request row
  SELECT * INTO v_request
  FROM public.top_up_requests
  WHERE id = p_request_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Top-up request not found';
  END IF;

  -- Prevent duplicate approval
  IF v_request.status != 'PENDING_VERIFICATION' AND v_request.status != 'NEEDS_MORE_INFORMATION' THEN
    RAISE EXCEPTION 'Request has already been processed (status: %)', v_request.status;
  END IF;

  -- Lock the wallet
  SELECT * INTO v_wallet
  FROM public.wallets
  WHERE user_id = v_request.user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Wallet not found for user';
  END IF;

  IF v_wallet.status != 'ACTIVE' THEN
    RAISE EXCEPTION 'Wallet is not active (status: %)', v_wallet.status;
  END IF;

  -- Calculate new balance
  v_new_balance := v_wallet.available_balance + v_request.amount;

  -- Update wallet balance
  UPDATE public.wallets
  SET available_balance = v_new_balance,
      updated_at = now()
  WHERE id = v_wallet.id;

  -- Create ledger entry
  INSERT INTO public.wallet_ledger_entries (
    wallet_id, user_id, entry_type, amount, currency,
    running_balance, reference_type, reference_id,
    description, is_demo, created_by
  ) VALUES (
    v_wallet.id, v_request.user_id, 'TOP_UP_CREDIT', v_request.amount,
    v_request.currency, v_new_balance, 'top_up_request', v_request.id,
    'Top-up approved: ' || v_request.payment_method || ' / ' || v_request.transaction_id,
    v_request.is_demo, p_admin_id
  )
  RETURNING id INTO v_ledger_id;

  -- Update request status
  UPDATE public.top_up_requests
  SET status = 'APPROVED',
      reviewed_by = p_admin_id,
      reviewed_at = now(),
      review_note = p_review_note,
      updated_at = now()
  WHERE id = p_request_id;

  -- Create notification for user
  INSERT INTO public.notifications (
    user_id, title, message, notification_type
  ) VALUES (
    v_request.user_id,
    'Top-up Approved',
    'Your top-up request of ' || (v_request.amount / 100.0)::TEXT || ' ' || v_request.currency || ' has been approved and credited to your wallet.',
    'TOP_UP_APPROVED'
  );

  -- Audit log
  INSERT INTO public.audit_logs (
    actor_user_id, action, entity_type, entity_id,
    new_values
  ) VALUES (
    p_admin_id, 'APPROVE_TOP_UP', 'top_up_request', p_request_id,
    jsonb_build_object(
      'amount', v_request.amount,
      'currency', v_request.currency,
      'new_balance', v_new_balance,
      'ledger_entry_id', v_ledger_id
    )
  );

  RETURN jsonb_build_object(
    'success', TRUE,
    'new_balance', v_new_balance,
    'ledger_entry_id', v_ledger_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FUNCTION: reject_top_up_request
-- ============================================================
CREATE OR REPLACE FUNCTION public.reject_top_up_request(
  p_request_id UUID,
  p_admin_id UUID,
  p_review_note TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_request RECORD;
BEGIN
  -- Verify admin
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_admin_id AND is_admin = TRUE) THEN
    RAISE EXCEPTION 'Unauthorized: not an administrator';
  END IF;

  -- Lock the request
  SELECT * INTO v_request
  FROM public.top_up_requests
  WHERE id = p_request_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Top-up request not found';
  END IF;

  IF v_request.status NOT IN ('PENDING_VERIFICATION', 'NEEDS_MORE_INFORMATION') THEN
    RAISE EXCEPTION 'Request has already been processed (status: %)', v_request.status;
  END IF;

  -- Update request
  UPDATE public.top_up_requests
  SET status = 'REJECTED',
      reviewed_by = p_admin_id,
      reviewed_at = now(),
      review_note = p_review_note,
      updated_at = now()
  WHERE id = p_request_id;

  -- Notify user
  INSERT INTO public.notifications (
    user_id, title, message, notification_type
  ) VALUES (
    v_request.user_id,
    'Top-up Rejected',
    'Your top-up request of ' || (v_request.amount / 100.0)::TEXT || ' ' || v_request.currency || ' was not approved.' ||
    CASE WHEN p_review_note IS NOT NULL THEN ' Note: ' || p_review_note ELSE '' END,
    'TOP_UP_REJECTED'
  );

  -- Audit log
  INSERT INTO public.audit_logs (
    actor_user_id, action, entity_type, entity_id,
    new_values
  ) VALUES (
    p_admin_id, 'REJECT_TOP_UP', 'top_up_request', p_request_id,
    jsonb_build_object('reason', COALESCE(p_review_note, 'No reason provided'))
  );

  RETURN jsonb_build_object('success', TRUE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FUNCTION: submit_bid
-- Atomic bid submission with validation
-- ============================================================
CREATE OR REPLACE FUNCTION public.submit_bid(
  p_user_id UUID,
  p_item_id UUID,
  p_bid_amount BIGINT,
  p_idempotency_key TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_item RECORD;
  v_profile RECORD;
  v_wallet RECORD;
  v_existing_bids INTEGER;
  v_bid_id UUID;
BEGIN
  -- Verify user profile
  SELECT * INTO v_profile
  FROM public.profiles
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;

  IF v_profile.account_status != 'ACTIVE' THEN
    RAISE EXCEPTION 'Account is not active (status: %)', v_profile.account_status;
  END IF;

  -- Lock and verify item
  SELECT * INTO v_item
  FROM public.bidding_items
  WHERE id = p_item_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Bidding item not found';
  END IF;

  -- Verify event is open
  IF v_item.status NOT IN ('PUBLISHED', 'ACTIVE') THEN
    RAISE EXCEPTION 'Event is not accepting bids (status: %)', v_item.status;
  END IF;

  IF now() < v_item.opening_date THEN
    RAISE EXCEPTION 'Event has not opened yet';
  END IF;

  IF now() > v_item.closing_date THEN
    RAISE EXCEPTION 'Event has closed';
  END IF;

  -- Validate bid amount
  IF p_bid_amount < v_item.minimum_bid THEN
    RAISE EXCEPTION 'Bid amount % is below minimum %', p_bid_amount, v_item.minimum_bid;
  END IF;

  IF v_item.maximum_bid IS NOT NULL AND p_bid_amount > v_item.maximum_bid THEN
    RAISE EXCEPTION 'Bid amount % exceeds maximum %', p_bid_amount, v_item.maximum_bid;
  END IF;

  -- Check bid increment
  IF v_item.bid_increment IS NOT NULL AND v_item.bidding_mode = 'HIGHEST_BID' THEN
    IF (p_bid_amount - v_item.minimum_bid) % v_item.bid_increment != 0 THEN
      RAISE EXCEPTION 'Bid amount must be a valid increment from minimum bid';
    END IF;
  END IF;

  -- Check max bids per user
  IF v_item.max_bids_per_user IS NOT NULL THEN
    SELECT COUNT(*) INTO v_existing_bids
    FROM public.bids
    WHERE bidding_item_id = p_item_id
    AND user_id = p_user_id
    AND status = 'ACTIVE';

    IF v_existing_bids >= v_item.max_bids_per_user THEN
      RAISE EXCEPTION 'Maximum bids per user reached (%)', v_item.max_bids_per_user;
    END IF;
  END IF;

  -- Check idempotency
  IF p_idempotency_key IS NOT NULL THEN
    IF EXISTS (SELECT 1 FROM public.bids WHERE idempotency_key = p_idempotency_key) THEN
      -- Return existing bid
      SELECT id INTO v_bid_id FROM public.bids WHERE idempotency_key = p_idempotency_key;
      RETURN jsonb_build_object('success', TRUE, 'bid_id', v_bid_id, 'duplicate', TRUE);
    END IF;
  END IF;

  -- Handle participation cost if set
  IF v_item.participation_cost > 0 THEN
    SELECT * INTO v_wallet
    FROM public.wallets
    WHERE user_id = p_user_id
    FOR UPDATE;

    IF NOT FOUND OR v_wallet.status != 'ACTIVE' THEN
      RAISE EXCEPTION 'Active wallet required for participation';
    END IF;

    IF v_wallet.available_balance < v_item.participation_cost THEN
      RAISE EXCEPTION 'Insufficient wallet balance for participation cost';
    END IF;

    -- Debit participation cost
    UPDATE public.wallets
    SET available_balance = available_balance - v_item.participation_cost,
        updated_at = now()
    WHERE id = v_wallet.id;

    -- Ledger entry for participation fee
    INSERT INTO public.wallet_ledger_entries (
      wallet_id, user_id, entry_type, amount, currency,
      running_balance, reference_type, reference_id,
      description, is_demo, created_by
    ) VALUES (
      v_wallet.id, p_user_id, 'PARTICIPATION_FEE',
      -v_item.participation_cost, v_item.currency,
      v_wallet.available_balance - v_item.participation_cost,
      'bidding_item', p_item_id,
      'Participation fee for: ' || v_item.title,
      v_item.is_demo, p_user_id
    );
  END IF;

  -- Insert bid
  INSERT INTO public.bids (
    bidding_item_id, user_id, bid_amount, currency,
    idempotency_key, is_demo
  ) VALUES (
    p_item_id, p_user_id, p_bid_amount, v_item.currency,
    p_idempotency_key, v_item.is_demo
  )
  RETURNING id INTO v_bid_id;

  -- Update item status to ACTIVE if it was PUBLISHED
  IF v_item.status = 'PUBLISHED' THEN
    UPDATE public.bidding_items
    SET status = 'ACTIVE'
    WHERE id = p_item_id;
  END IF;

  -- Notification
  INSERT INTO public.notifications (
    user_id, title, message, notification_type
  ) VALUES (
    p_user_id,
    'Bid Recorded',
    'Your bid of ' || (p_bid_amount / 100.0)::TEXT || ' ' || v_item.currency || ' on "' || v_item.title || '" has been recorded.',
    'BID_RECORDED'
  );

  RETURN jsonb_build_object(
    'success', TRUE,
    'bid_id', v_bid_id,
    'duplicate', FALSE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FUNCTION: finalize_event
-- Determines winner based on bidding mode
-- ============================================================
CREATE OR REPLACE FUNCTION public.finalize_event(
  p_item_id UUID,
  p_admin_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_item RECORD;
  v_winning_bid RECORD;
  v_result_status TEXT;
  v_result_details JSONB;
  v_result_id UUID;
BEGIN
  -- Verify admin
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_admin_id AND is_admin = TRUE) THEN
    RAISE EXCEPTION 'Unauthorized: not an administrator';
  END IF;

  -- Lock and get item
  SELECT * INTO v_item
  FROM public.bidding_items
  WHERE id = p_item_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Bidding item not found';
  END IF;

  -- Check item has closed
  IF now() < v_item.closing_date THEN
    RAISE EXCEPTION 'Event has not closed yet';
  END IF;

  -- Prevent duplicate finalization
  IF v_item.status = 'FINALIZED' THEN
    RAISE EXCEPTION 'Event has already been finalized';
  END IF;

  IF EXISTS (SELECT 1 FROM public.event_results WHERE bidding_item_id = p_item_id) THEN
    RAISE EXCEPTION 'Result already exists for this event';
  END IF;

  -- Determine winner based on bidding mode
  IF v_item.bidding_mode = 'HIGHEST_BID' THEN
    -- Highest bid wins (first submitted if tie)
    SELECT * INTO v_winning_bid
    FROM public.bids
    WHERE bidding_item_id = p_item_id
    AND status = 'ACTIVE'
    ORDER BY bid_amount DESC, created_at ASC
    LIMIT 1;

  ELSIF v_item.bidding_mode = 'LOWEST_UNIQUE_BID' THEN
    -- Lowest unique bid wins
    SELECT b.* INTO v_winning_bid
    FROM public.bids b
    WHERE b.bidding_item_id = p_item_id
    AND b.status = 'ACTIVE'
    AND b.bid_amount IN (
      SELECT bid_amount
      FROM public.bids
      WHERE bidding_item_id = p_item_id
      AND status = 'ACTIVE'
      GROUP BY bid_amount
      HAVING COUNT(*) = 1
    )
    ORDER BY b.bid_amount ASC, b.created_at ASC
    LIMIT 1;
  END IF;

  IF v_winning_bid.id IS NOT NULL THEN
    v_result_status := 'WINNER_DETERMINED';

    -- Get total bid count and unique count for details
    SELECT jsonb_build_object(
      'total_bids', (SELECT COUNT(*) FROM public.bids WHERE bidding_item_id = p_item_id AND status = 'ACTIVE'),
      'unique_participants', (SELECT COUNT(DISTINCT user_id) FROM public.bids WHERE bidding_item_id = p_item_id AND status = 'ACTIVE'),
      'winning_amount', v_winning_bid.bid_amount,
      'bidding_mode', v_item.bidding_mode
    ) INTO v_result_details;

    -- Mark winning bid
    UPDATE public.bids SET status = 'WON' WHERE id = v_winning_bid.id;

    -- Mark other bids as lost
    UPDATE public.bids SET status = 'LOST'
    WHERE bidding_item_id = p_item_id AND id != v_winning_bid.id AND status = 'ACTIVE';

    -- Notify winner
    INSERT INTO public.notifications (
      user_id, title, message, notification_type
    ) VALUES (
      v_winning_bid.user_id,
      'Congratulations! You Won!',
      'You are the winner of "' || v_item.title || '" with a bid of ' || (v_winning_bid.bid_amount / 100.0)::TEXT || ' ' || v_item.currency || '!',
      'WINNER_ANNOUNCEMENT'
    );
  ELSE
    v_result_status := 'NO_WINNER';
    v_result_details := jsonb_build_object(
      'total_bids', (SELECT COUNT(*) FROM public.bids WHERE bidding_item_id = p_item_id AND status = 'ACTIVE'),
      'reason', 'No eligible winning bid found',
      'bidding_mode', v_item.bidding_mode
    );

    -- Mark all bids as lost
    UPDATE public.bids SET status = 'LOST'
    WHERE bidding_item_id = p_item_id AND status = 'ACTIVE';
  END IF;

  -- Create event result
  INSERT INTO public.event_results (
    bidding_item_id, winner_user_id, winning_bid_id,
    result_status, result_details, is_demo
  ) VALUES (
    p_item_id,
    v_winning_bid.user_id,
    v_winning_bid.id,
    v_result_status,
    v_result_details,
    v_item.is_demo
  )
  RETURNING id INTO v_result_id;

  -- Update item status
  UPDATE public.bidding_items
  SET status = 'FINALIZED',
      updated_at = now()
  WHERE id = p_item_id;

  -- Audit log
  INSERT INTO public.audit_logs (
    actor_user_id, action, entity_type, entity_id,
    new_values
  ) VALUES (
    p_admin_id, 'FINALIZE_EVENT', 'bidding_item', p_item_id,
    jsonb_build_object(
      'result_id', v_result_id,
      'result_status', v_result_status,
      'winner_user_id', v_winning_bid.user_id,
      'winning_bid_id', v_winning_bid.id
    )
  );

  RETURN jsonb_build_object(
    'success', TRUE,
    'result_id', v_result_id,
    'result_status', v_result_status,
    'winner_user_id', v_winning_bid.user_id,
    'winning_amount', v_winning_bid.bid_amount
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FUNCTION: provision_admin
-- One-time admin setup (callable only by service role)
-- ============================================================
CREATE OR REPLACE FUNCTION public.provision_admin(
  p_user_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_admin_count INTEGER;
BEGIN
  -- Check if admin already exists
  SELECT COUNT(*) INTO v_admin_count
  FROM public.profiles
  WHERE is_admin = TRUE;

  IF v_admin_count > 0 THEN
    RAISE EXCEPTION 'An administrator already exists. Use a controlled process to change administrators.';
  END IF;

  -- Set the user as admin
  UPDATE public.profiles
  SET is_admin = TRUE,
      updated_at = now()
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;

  -- Audit log
  INSERT INTO public.audit_logs (
    actor_user_id, action, entity_type, entity_id,
    new_values
  ) VALUES (
    p_user_id, 'PROVISION_ADMIN', 'profile', p_user_id,
    jsonb_build_object('admin_provisioned', TRUE)
  );

  RETURN jsonb_build_object('success', TRUE, 'admin_id', p_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Revoke direct execution from public; only service_role can call
REVOKE EXECUTE ON FUNCTION public.provision_admin(UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.provision_admin(UUID) FROM authenticated;
-- Note: service_role bypass RLS and can call this function directly
