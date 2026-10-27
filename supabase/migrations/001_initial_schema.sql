-- ============================================================
-- ONEBID — Initial Database Schema
-- Migration 001: Core tables, constraints, indexes, RLS
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLE 1: profiles
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL CHECK (char_length(full_name) >= 2 AND char_length(full_name) <= 200),
  phone_number TEXT NOT NULL,
  avatar_url TEXT,
  account_status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (account_status IN ('ACTIVE', 'SUSPENDED', 'DEACTIVATED')),
  suspension_reason TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Unique constraint on normalized phone number
CREATE UNIQUE INDEX idx_profiles_phone_number ON public.profiles (phone_number);
CREATE INDEX idx_profiles_account_status ON public.profiles (account_status);
CREATE INDEX idx_profiles_created_at ON public.profiles (created_at DESC);

-- ============================================================
-- TABLE 2: categories
-- ============================================================
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 100),
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_path TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_categories_slug ON public.categories (slug);
CREATE INDEX idx_categories_display_order ON public.categories (display_order);

-- ============================================================
-- TABLE 3: bidding_items
-- ============================================================
CREATE TABLE public.bidding_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL CHECK (char_length(title) >= 3 AND char_length(title) <= 300),
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT CHECK (char_length(short_description) <= 500),
  full_description TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  starting_price BIGINT NOT NULL DEFAULT 0 CHECK (starting_price >= 0),
  minimum_bid BIGINT NOT NULL DEFAULT 1 CHECK (minimum_bid > 0),
  maximum_bid BIGINT CHECK (maximum_bid IS NULL OR maximum_bid >= minimum_bid),
  bid_increment BIGINT CHECK (bid_increment IS NULL OR bid_increment > 0),
  participation_cost BIGINT NOT NULL DEFAULT 0 CHECK (participation_cost >= 0),
  bidding_mode TEXT NOT NULL DEFAULT 'HIGHEST_BID' CHECK (bidding_mode IN ('HIGHEST_BID', 'LOWEST_UNIQUE_BID')),
  currency TEXT NOT NULL DEFAULT 'ETB',
  opening_date TIMESTAMPTZ NOT NULL,
  closing_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ACTIVE', 'PAUSED', 'CLOSED', 'FINALIZED', 'CANCELLED', 'ARCHIVED')),
  terms_and_conditions TEXT,
  max_bids_per_user INTEGER CHECK (max_bids_per_user IS NULL OR max_bids_per_user > 0),
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT valid_dates CHECK (closing_date > opening_date)
);

CREATE INDEX idx_bidding_items_slug ON public.bidding_items (slug);
CREATE INDEX idx_bidding_items_status ON public.bidding_items (status);
CREATE INDEX idx_bidding_items_category ON public.bidding_items (category_id);
CREATE INDEX idx_bidding_items_opening ON public.bidding_items (opening_date);
CREATE INDEX idx_bidding_items_closing ON public.bidding_items (closing_date);
CREATE INDEX idx_bidding_items_mode ON public.bidding_items (bidding_mode);

-- ============================================================
-- TABLE 4: bidding_item_images
-- ============================================================
CREATE TABLE public.bidding_item_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bidding_item_id UUID NOT NULL REFERENCES public.bidding_items(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_item_images_item ON public.bidding_item_images (bidding_item_id);

-- ============================================================
-- TABLE 5: bids
-- ============================================================
CREATE TABLE public.bids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bidding_item_id UUID NOT NULL REFERENCES public.bidding_items(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  bid_amount BIGINT NOT NULL CHECK (bid_amount > 0),
  currency TEXT NOT NULL DEFAULT 'ETB',
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'WON', 'LOST', 'CANCELLED', 'REFUNDED')),
  idempotency_key TEXT,
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_idempotency UNIQUE (idempotency_key)
);

CREATE INDEX idx_bids_item ON public.bids (bidding_item_id);
CREATE INDEX idx_bids_user ON public.bids (user_id);
CREATE INDEX idx_bids_amount ON public.bids (bid_amount);
CREATE INDEX idx_bids_status ON public.bids (status);
CREATE INDEX idx_bids_created ON public.bids (created_at DESC);

-- ============================================================
-- TABLE 6: wallets
-- ============================================================
CREATE TABLE public.wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE RESTRICT,
  currency TEXT NOT NULL DEFAULT 'ETB',
  available_balance BIGINT NOT NULL DEFAULT 0 CHECK (available_balance >= 0),
  reserved_balance BIGINT NOT NULL DEFAULT 0 CHECK (reserved_balance >= 0),
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'FROZEN', 'CLOSED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_wallets_user ON public.wallets (user_id);

-- ============================================================
-- TABLE 7: wallet_ledger_entries
-- ============================================================
CREATE TABLE public.wallet_ledger_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  entry_type TEXT NOT NULL CHECK (entry_type IN (
    'TOP_UP_CREDIT', 'BID_RESERVATION', 'BID_DEBIT', 'BID_REFUND',
    'ADMIN_ADJUSTMENT', 'REVERSAL', 'PARTICIPATION_FEE'
  )),
  amount BIGINT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'ETB',
  running_balance BIGINT,
  reference_type TEXT,
  reference_id UUID,
  description TEXT,
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ledger_wallet ON public.wallet_ledger_entries (wallet_id);
CREATE INDEX idx_ledger_user ON public.wallet_ledger_entries (user_id);
CREATE INDEX idx_ledger_type ON public.wallet_ledger_entries (entry_type);
CREATE INDEX idx_ledger_ref ON public.wallet_ledger_entries (reference_type, reference_id);
CREATE INDEX idx_ledger_created ON public.wallet_ledger_entries (created_at DESC);

-- ============================================================
-- TABLE 8: top_up_requests
-- ============================================================
CREATE TABLE public.top_up_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  amount BIGINT NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'ETB',
  payment_method TEXT NOT NULL CHECK (char_length(payment_method) >= 1),
  transaction_id TEXT NOT NULL CHECK (char_length(transaction_id) >= 1),
  additional_information TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING_VERIFICATION' CHECK (status IN (
    'PENDING_VERIFICATION', 'APPROVED', 'REJECTED', 'NEEDS_MORE_INFORMATION'
  )),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  review_note TEXT,
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_topups_user ON public.top_up_requests (user_id);
CREATE INDEX idx_topups_status ON public.top_up_requests (status);
CREATE INDEX idx_topups_txn ON public.top_up_requests (transaction_id);
CREATE INDEX idx_topups_created ON public.top_up_requests (created_at DESC);

-- ============================================================
-- TABLE 9: notifications
-- ============================================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT NOT NULL CHECK (notification_type IN (
    'TOP_UP_SUBMITTED', 'TOP_UP_APPROVED', 'TOP_UP_REJECTED',
    'BID_RECORDED', 'EVENT_CLOSING_SOON', 'EVENT_COMPLETED',
    'WINNER_ANNOUNCEMENT', 'ACCOUNT_UPDATE', 'SYSTEM'
  )),
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user ON public.notifications (user_id);
CREATE INDEX idx_notifications_read ON public.notifications (user_id, read_at);
CREATE INDEX idx_notifications_created ON public.notifications (created_at DESC);

-- ============================================================
-- TABLE 10: event_results
-- ============================================================
CREATE TABLE public.event_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bidding_item_id UUID NOT NULL UNIQUE REFERENCES public.bidding_items(id) ON DELETE RESTRICT,
  winner_user_id UUID REFERENCES auth.users(id),
  winning_bid_id UUID REFERENCES public.bids(id),
  result_status TEXT NOT NULL CHECK (result_status IN ('WINNER_DETERMINED', 'NO_WINNER', 'CANCELLED', 'UNDER_REVIEW')),
  result_details JSONB,
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  finalized_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_results_item ON public.event_results (bidding_item_id);
CREATE INDEX idx_results_winner ON public.event_results (winner_user_id);

-- ============================================================
-- TABLE 11: website_settings
-- ============================================================
CREATE TABLE public.website_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL DEFAULT '{}',
  setting_type TEXT NOT NULL DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json', 'html')),
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- TABLE 12: faqs
-- ============================================================
CREATE TABLE public.faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_faqs_order ON public.faqs (display_order);

-- ============================================================
-- TABLE 13: audit_logs
-- ============================================================
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_actor ON public.audit_logs (actor_user_id);
CREATE INDEX idx_audit_action ON public.audit_logs (action);
CREATE INDEX idx_audit_entity ON public.audit_logs (entity_type, entity_id);
CREATE INDEX idx_audit_created ON public.audit_logs (created_at DESC);

-- ============================================================
-- UPDATED_AT trigger function
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.bidding_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.wallets
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.top_up_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.website_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- Auto-create profile & wallet on user signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone_number)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone_number', '')
  );

  INSERT INTO public.wallets (user_id, currency)
  VALUES (NEW.id, 'ETB');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
