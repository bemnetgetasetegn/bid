// ============================================================================
// ONEBID Platform - Comprehensive TypeScript Type Definitions
// Matches PostgreSQL Schema (001_initial_schema.sql)
// All monetary values are BIGINT (minor units / cents). 100 = 1.00 ETB
// ============================================================================

export type AccountStatus = 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED' | 'BANNED' | 'PENDING_VERIFICATION';

export type BiddingMode = 'HIGHEST_BID' | 'LOWEST_UNIQUE_BID';

export type BiddingItemStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'SCHEDULED'
  | 'ACTIVE'
  | 'PAUSED'
  | 'CLOSED'
  | 'ENDED'
  | 'FINALIZED'
  | 'SETTLED'
  | 'CANCELLED'
  | 'ARCHIVED';

export type BidStatus = 'ACTIVE' | 'OUTBID' | 'WON' | 'LOST' | 'REFUNDED' | 'CANCELLED';

export type WalletStatus = 'ACTIVE' | 'FROZEN' | 'CLOSED';

export type WalletLedgerEntryType =
  | 'TOP_UP'
  | 'TOP_UP_CREDIT'
  | 'BID_PLACEMENT'
  | 'BID_RESERVATION'
  | 'BID_DEBIT'
  | 'BID_REFUND'
  | 'WINNING_DEDUCTION'
  | 'ADMIN_ADJUSTMENT'
  | 'ADMIN_CREDIT'
  | 'ADMIN_DEBIT'
  | 'REVERSAL'
  | 'PARTICIPATION_FEE'
  | 'PROMOTIONAL_CREDIT';

export type TopUpRequestStatus =
  | 'PENDING_VERIFICATION'
  | 'APPROVED'
  | 'REJECTED'
  | 'NEEDS_MORE_INFORMATION';

export type NotificationType =
  | 'TOP_UP_SUBMITTED'
  | 'TOP_UP_APPROVED'
  | 'TOP_UP_REJECTED'
  | 'TOP_UP_NEEDS_INFO'
  | 'BID_PLACED'
  | 'BID_RECORDED'
  | 'BID_OUTBID'
  | 'BID_WON'
  | 'BID_LOST'
  | 'ITEM_STARTING'
  | 'ITEM_ENDING'
  | 'EVENT_CLOSING_SOON'
  | 'ITEM_ENDED'
  | 'EVENT_COMPLETED'
  | 'WINNER_ANNOUNCEMENT'
  | 'WALLET_CREDITED'
  | 'WALLET_DEBITED'
  | 'ACCOUNT_SUSPENDED'
  | 'ACCOUNT_REACTIVATED'
  | 'ACCOUNT_UPDATE'
  | 'SYSTEM'
  | 'SYSTEM_ANNOUNCEMENT';

export type EventResultStatus = 'WINNER_DETERMINED' | 'NO_WINNER' | 'CANCELLED' | 'UNDER_REVIEW' | 'PENDING' | 'SETTLED' | 'DISPUTED';

export type PaymentMethod = 'TELEBIRR' | 'CBE_BIRR' | 'COMMERCIAL_BANK' | 'AWASH_BANK' | 'ABYSSINIA_BANK';

// --- Core Models ---

export interface Profile {
  id: string;
  full_name: string;
  phone_number?: string;
  phone?: string;
  avatar_url?: string | null;
  account_status?: AccountStatus;
  suspension_reason?: string | null;
  is_admin?: boolean;
  last_login_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_path?: string | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BiddingItemImage {
  id: string;
  bidding_item_id: string;
  storage_path: string;
  image_url?: string;
  alt_text?: string | null;
  display_order: number;
  created_at?: string;
}

export interface BiddingItem {
  id: string;
  title: string;
  slug: string;
  short_description?: string | null;
  full_description?: string | null;
  description?: string;
  category_id?: string;
  categories?: Category;
  starting_price: number; // minor units
  minimum_bid: number; // minor units
  maximum_bid?: number | null; // minor units
  bid_increment?: number | null; // minor units
  participation_cost?: number; // minor units
  bid_cost: number; // minor units alias
  current_highest_bid?: number; // minor units
  total_bids?: number;
  bidding_mode: BiddingMode;
  currency?: string;
  opening_date: string;
  closing_date: string;
  status: BiddingItemStatus;
  terms_and_conditions?: string | null;
  max_bids_per_user?: number | null;
  is_demo?: boolean;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  images?: BiddingItemImage[];
}

export interface Bid {
  id: string;
  bidding_item_id: string;
  user_id: string;
  bid_amount: number; // minor units
  currency?: string;
  status: BidStatus;
  idempotency_key?: string | null;
  is_demo?: boolean;
  created_at: string;
  user?: Profile;
  bidding_item?: BiddingItem;
}

export interface Wallet {
  id: string;
  user_id: string;
  currency?: string;
  available_balance: number; // minor units
  reserved_balance: number; // minor units
  total_deposited?: number;
  total_withdrawn?: number;
  status?: WalletStatus;
  created_at?: string;
  updated_at?: string;
}

export interface WalletLedgerEntry {
  id: string;
  wallet_id: string;
  user_id: string;
  entry_type: WalletLedgerEntryType;
  amount: number; // minor units (positive credit, negative debit)
  currency?: string;
  balance_after?: number;
  running_balance?: number;
  reference_type?: string | null;
  reference_id?: string | null;
  description: string;
  is_demo?: boolean;
  created_by?: string;
  created_at: string;
}

export interface TopUpRequest {
  id: string;
  user_id: string;
  amount: number; // minor units
  currency?: string;
  payment_method: string;
  transaction_id: string;
  additional_information?: string | null;
  status: TopUpRequestStatus;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  review_note?: string | null;
  rejection_reason?: string | null;
  is_demo?: boolean;
  created_at: string;
  updated_at?: string;
  user?: {
    full_name: string;
    phone?: string;
    phone_number?: string;
  };
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type?: NotificationType;
  notification_type?: NotificationType;
  read_at?: string | null;
  is_read?: boolean;
  data?: any;
  created_at: string;
}

export interface EventResult {
  id: string;
  bidding_item_id: string;
  winner_user_id?: string | null;
  winning_bid_id?: string | null;
  result_status: EventResultStatus;
  result_details?: any;
  is_demo?: boolean;
  finalized_at: string;
  created_at?: string;
  winner?: Profile;
  winning_bid?: Bid;
}

export interface WebsiteSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  setting_type: string;
  description?: string;
  is_public: boolean;
  updated_at?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  display_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AuditLog {
  id: string;
  actor_user_id?: string | null;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  old_values?: any;
  new_values?: any;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at: string;
}

export interface DashboardStats {
  total_users: number;
  active_users: number;
  total_items: number;
  active_items: number;
  upcoming_items: number;
  completed_items: number;
  total_bids: number;
  total_volume: number;
  pending_top_ups: number;
  pending_top_ups_amount?: number;
  approved_top_ups_total: number;
}
