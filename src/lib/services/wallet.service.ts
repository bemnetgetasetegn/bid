import { createClient } from '@/lib/supabase/client';
import { Wallet, WalletLedgerEntry, TopUpRequest } from '@/types';

export const fallbackWallet: Wallet = {
  id: 'w1000000-0000-0000-0000-000000000001',
  user_id: 'u1000000-0000-0000-0000-000000000001',
  currency: 'ETB',
  available_balance: 150000, // 1,500.00 ETB
  reserved_balance: 25000,   // 250.00 ETB
  total_deposited: 200000,
  total_withdrawn: 0,
  status: 'ACTIVE',
  created_at: new Date(Date.now() - 604800000).toISOString(),
  updated_at: new Date().toISOString(),
};

export const fallbackLedger: WalletLedgerEntry[] = [
  {
    id: 'l1',
    wallet_id: 'w1000000-0000-0000-0000-000000000001',
    user_id: 'u1000000-0000-0000-0000-000000000001',
    entry_type: 'TOP_UP',
    amount: 100000, // +1,000.00 ETB
    balance_after: 100000,
    reference_type: 'top_up_request',
    reference_id: 'req-1',
    description: 'telebirr Top-Up (Txn: TBR983210492)',
    is_demo: true,
    created_at: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    id: 'l2',
    wallet_id: 'w1000000-0000-0000-0000-000000000001',
    user_id: 'u1000000-0000-0000-0000-000000000001',
    entry_type: 'BID_PLACEMENT',
    amount: -5000, // -50.00 ETB fee
    balance_after: 95000,
    reference_type: 'bidding_item',
    reference_id: 'b1000000-0000-0000-0000-000000000001',
    description: 'Participation fee for iPhone 16 Pro Max',
    is_demo: true,
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'l3',
    wallet_id: 'w1000000-0000-0000-0000-000000000001',
    user_id: 'u1000000-0000-0000-0000-000000000001',
    entry_type: 'TOP_UP',
    amount: 80000, // +800.00 ETB
    balance_after: 175000,
    reference_type: 'top_up_request',
    reference_id: 'req-2',
    description: 'CBE Birr Top-Up (Txn: CBE771928340)',
    is_demo: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  }
];

export async function getUserWallet(): Promise<Wallet> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return fallbackWallet;

    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      return fallbackWallet;
    }

    return {
      ...data,
      total_deposited: data.total_deposited || data.available_balance,
      total_withdrawn: 0,
    };
  } catch {
    return fallbackWallet;
  }
}

export async function getWalletTransactions(): Promise<WalletLedgerEntry[]> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return fallbackLedger;

    const { data, error } = await supabase
      .from('wallet_ledger_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return fallbackLedger;
    }

    return data.map((d: any) => ({
      ...d,
      balance_after: d.running_balance || d.balance_after || 0,
    }));
  } catch {
    return fallbackLedger;
  }
}

export async function submitTopUpRequest(data: {
  amount: number; // minor units
  payment_method: string;
  transaction_id: string;
  additional_information?: string;
}): Promise<{ success: boolean; message: string; request_id?: string }> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, message: 'Please log in to submit a top-up request.' };
    }

    const { data: request, error } = await supabase
      .from('top_up_requests')
      .insert({
        user_id: user.id,
        amount: data.amount,
        currency: 'ETB',
        payment_method: data.payment_method,
        transaction_id: data.transaction_id.trim(),
        additional_information: data.additional_information,
        status: 'PENDING_VERIFICATION',
        is_demo: true,
      })
      .select()
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    // Also insert a notification for user
    await supabase.from('notifications').insert({
      user_id: user.id,
      title: 'Top-up Request Submitted',
      message: `Your top-up request for ${(data.amount / 100).toFixed(2)} ETB has been submitted for administrator review.`,
      notification_type: 'TOP_UP_SUBMITTED',
    });

    return {
      success: true,
      message: 'Top-up request submitted successfully! It will be verified shortly.',
      request_id: request.id,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Failed to submit top-up request',
    };
  }
}
