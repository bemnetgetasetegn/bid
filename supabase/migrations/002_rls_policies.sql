-- ============================================================
-- ONEBID — Row Level Security Policies
-- Migration 002: RLS + security policies
-- ============================================================

-- ============================================================
-- Enable RLS on all tables
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bidding_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bidding_item_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.top_up_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Helper: check if current user is admin
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================
-- PROFILES policies
-- ============================================================
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Admin can view all profiles
CREATE POLICY "Admin can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- Users can update their own profile (limited fields via app)
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND is_admin = (SELECT p.is_admin FROM public.profiles p WHERE p.id = auth.uid())
    AND account_status = (SELECT p.account_status FROM public.profiles p WHERE p.id = auth.uid())
  );

-- Admin can update any profile
CREATE POLICY "Admin can update any profile"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

-- Profiles are created by trigger (SECURITY DEFINER), no direct insert needed
CREATE POLICY "Service role can insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- CATEGORIES policies
-- ============================================================
-- Anyone can read active categories
CREATE POLICY "Anyone can view active categories"
  ON public.categories FOR SELECT
  USING (is_active = TRUE);

-- Admin can read all categories
CREATE POLICY "Admin can view all categories"
  ON public.categories FOR SELECT
  USING (public.is_admin());

-- Admin can manage categories
CREATE POLICY "Admin can insert categories"
  ON public.categories FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update categories"
  ON public.categories FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admin can delete categories"
  ON public.categories FOR DELETE
  USING (public.is_admin());

-- ============================================================
-- BIDDING_ITEMS policies
-- ============================================================
-- Anyone can view published/active items
CREATE POLICY "Anyone can view published items"
  ON public.bidding_items FOR SELECT
  USING (status IN ('PUBLISHED', 'ACTIVE', 'CLOSED', 'FINALIZED'));

-- Admin can view all items
CREATE POLICY "Admin can view all items"
  ON public.bidding_items FOR SELECT
  USING (public.is_admin());

-- Admin can manage items
CREATE POLICY "Admin can insert items"
  ON public.bidding_items FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update items"
  ON public.bidding_items FOR UPDATE
  USING (public.is_admin());

-- ============================================================
-- BIDDING_ITEM_IMAGES policies
-- ============================================================
-- Anyone can view images of published items
CREATE POLICY "Anyone can view item images"
  ON public.bidding_item_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bidding_items
      WHERE id = bidding_item_id
      AND status IN ('PUBLISHED', 'ACTIVE', 'CLOSED', 'FINALIZED')
    )
  );

-- Admin can view all images
CREATE POLICY "Admin can view all images"
  ON public.bidding_item_images FOR SELECT
  USING (public.is_admin());

-- Admin can manage images
CREATE POLICY "Admin can insert images"
  ON public.bidding_item_images FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update images"
  ON public.bidding_item_images FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admin can delete images"
  ON public.bidding_item_images FOR DELETE
  USING (public.is_admin());

-- ============================================================
-- BIDS policies
-- ============================================================
-- Users can view their own bids
CREATE POLICY "Users can view own bids"
  ON public.bids FOR SELECT
  USING (auth.uid() = user_id);

-- Admin can view all bids
CREATE POLICY "Admin can view all bids"
  ON public.bids FOR SELECT
  USING (public.is_admin());

-- Bids are inserted via server function, allow authenticated insert
CREATE POLICY "Authenticated users can insert bids"
  ON public.bids FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- No update or delete on bids
-- (bids are immutable once created, status changes via server functions)

-- ============================================================
-- WALLETS policies
-- ============================================================
-- Users can view their own wallet
CREATE POLICY "Users can view own wallet"
  ON public.wallets FOR SELECT
  USING (auth.uid() = user_id);

-- Admin can view all wallets
CREATE POLICY "Admin can view all wallets"
  ON public.wallets FOR SELECT
  USING (public.is_admin());

-- No direct insert/update/delete from client
-- Wallet changes happen through server-side functions

-- ============================================================
-- WALLET_LEDGER_ENTRIES policies
-- ============================================================
-- Users can view their own ledger entries
CREATE POLICY "Users can view own ledger"
  ON public.wallet_ledger_entries FOR SELECT
  USING (auth.uid() = user_id);

-- Admin can view all ledger entries
CREATE POLICY "Admin can view all ledger entries"
  ON public.wallet_ledger_entries FOR SELECT
  USING (public.is_admin());

-- No direct insert/update/delete from client

-- ============================================================
-- TOP_UP_REQUESTS policies
-- ============================================================
-- Users can view their own requests
CREATE POLICY "Users can view own top-ups"
  ON public.top_up_requests FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create requests
CREATE POLICY "Users can insert top-ups"
  ON public.top_up_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admin can view all requests
CREATE POLICY "Admin can view all top-ups"
  ON public.top_up_requests FOR SELECT
  USING (public.is_admin());

-- Admin can update request status
CREATE POLICY "Admin can update top-ups"
  ON public.top_up_requests FOR UPDATE
  USING (public.is_admin());

-- ============================================================
-- NOTIFICATIONS policies
-- ============================================================
-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Users can mark their own notifications as read
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admin can manage notifications
CREATE POLICY "Admin can manage notifications"
  ON public.notifications FOR ALL
  USING (public.is_admin());

-- ============================================================
-- EVENT_RESULTS policies
-- ============================================================
-- Anyone can view finalized results
CREATE POLICY "Anyone can view event results"
  ON public.event_results FOR SELECT
  USING (TRUE);

-- Admin can manage results
CREATE POLICY "Admin can insert results"
  ON public.event_results FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update results"
  ON public.event_results FOR UPDATE
  USING (public.is_admin());

-- ============================================================
-- WEBSITE_SETTINGS policies
-- ============================================================
-- Anyone can read public settings
CREATE POLICY "Anyone can view public settings"
  ON public.website_settings FOR SELECT
  USING (is_public = TRUE);

-- Admin can manage all settings
CREATE POLICY "Admin can manage settings"
  ON public.website_settings FOR ALL
  USING (public.is_admin());

-- ============================================================
-- FAQS policies
-- ============================================================
-- Anyone can read published FAQs
CREATE POLICY "Anyone can view published FAQs"
  ON public.faqs FOR SELECT
  USING (is_published = TRUE);

-- Admin can manage FAQs
CREATE POLICY "Admin can manage FAQs"
  ON public.faqs FOR ALL
  USING (public.is_admin());

-- ============================================================
-- AUDIT_LOGS policies
-- ============================================================
-- Only admin can view audit logs
CREATE POLICY "Admin can view audit logs"
  ON public.audit_logs FOR SELECT
  USING (public.is_admin());

-- Audit logs are inserted via server functions only
-- No client-side insert/update/delete
