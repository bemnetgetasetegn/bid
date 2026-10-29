import { createClient } from '@/lib/supabase/client';
import { DashboardStats, TopUpRequest, AuditLog, Profile, BiddingItem } from '@/types';
import { fallbackItems } from './bidding.service';

export const fallbackAdminStats: DashboardStats = {
  total_users: 1420,
  active_users: 1285,
  total_items: 24,
  active_items: 8,
  upcoming_items: 6,
  completed_items: 10,
  total_bids: 8490,
  total_volume: 84900000, // 849,000 ETB
  pending_top_ups: 3,
  pending_top_ups_amount: 450000, // 4,500.00 ETB
  approved_top_ups_total: 125000000,
};

export const fallbackTopUps: TopUpRequest[] = [
  {
    id: 'req-001',
    user_id: 'u-101',
    amount: 150000, // 1,500.00 ETB
    currency: 'ETB',
    payment_method: 'TELEBIRR',
    transaction_id: 'TBR98217340',
    additional_information: 'Sender phone: +251911456789. Account: Abebe Kebede',
    status: 'PENDING_VERIFICATION',
    rejection_reason: null,
    is_demo: true,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
    user: {
      full_name: 'Abebe Kebede',
      phone: '+251911456789',
    }
  },
  {
    id: 'req-002',
    user_id: 'u-102',
    amount: 200000, // 2,000.00 ETB
    currency: 'ETB',
    payment_method: 'CBE_BIRR',
    transaction_id: 'CBE66190284',
    additional_information: 'Branch: Bole Medhanealem',
    status: 'PENDING_VERIFICATION',
    rejection_reason: null,
    is_demo: true,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    updated_at: new Date(Date.now() - 7200000).toISOString(),
    user: {
      full_name: 'Sara Hailu',
      phone: '+251922334455',
    }
  },
  {
    id: 'req-003',
    user_id: 'u-103',
    amount: 100000, // 1,000.00 ETB
    currency: 'ETB',
    payment_method: 'AWASH_BANK',
    transaction_id: 'AWB00192837',
    additional_information: 'Deposit slip attached',
    status: 'PENDING_VERIFICATION',
    rejection_reason: null,
    is_demo: true,
    created_at: new Date(Date.now() - 14400000).toISOString(),
    updated_at: new Date(Date.now() - 14400000).toISOString(),
    user: {
      full_name: 'Dawit Yohannes',
      phone: '+251933556677',
    }
  },
  {
    id: 'req-004',
    user_id: 'u-104',
    amount: 50000, // 500.00 ETB
    currency: 'ETB',
    payment_method: 'TELEBIRR',
    transaction_id: 'TBR88392011',
    additional_information: 'Sender phone: +251944667788',
    status: 'APPROVED',
    rejection_reason: null,
    is_demo: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 82800000).toISOString(),
    user: {
      full_name: 'Tigist Alemu',
      phone: '+251944667788',
    }
  }
];

export async function getAdminStats(): Promise<DashboardStats> {
  try {
    const supabase = createClient();
    const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: itemsCount } = await supabase.from('bidding_items').select('*', { count: 'exact', head: true });
    const { count: pendingTopups } = await supabase.from('top_up_requests').select('*', { count: 'exact', head: true }).eq('status', 'PENDING_VERIFICATION');

    if (usersCount === null || usersCount === undefined) {
      return fallbackAdminStats;
    }

    return {
      ...fallbackAdminStats,
      total_users: usersCount || fallbackAdminStats.total_users,
      total_items: itemsCount || fallbackAdminStats.total_items,
      pending_top_ups: pendingTopups || 0,
    };
  } catch {
    return fallbackAdminStats;
  }
}

export async function getTopUpRequests(status?: string): Promise<TopUpRequest[]> {
  try {
    const supabase = createClient();
    let query = supabase.from('top_up_requests').select('*, profiles(full_name, phone_number)').order('created_at', { ascending: false });
    if (status) {
      query = query.eq('status', status);
    }
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      if (status) return fallbackTopUps.filter(r => r.status === status);
      return fallbackTopUps;
    }

    return data.map((d: any) => ({
      ...d,
      user: {
        full_name: d.profiles?.full_name || 'Participant',
        phone: d.profiles?.phone_number || '',
      }
    }));
  } catch {
    if (status) return fallbackTopUps.filter(r => r.status === status);
    return fallbackTopUps;
  }
}

export async function approveTopUp(requestId: string, note?: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: 'Admin authentication required' };

    const { data, error } = await supabase.rpc('approve_top_up_request', {
      p_request_id: requestId,
      p_admin_id: user.id,
      p_review_note: note || 'Verified and approved by administrator',
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Top-up approved and wallet balance credited atomically!' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Approval failed' };
  }
}

export async function rejectTopUp(requestId: string, reason: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: 'Admin authentication required' };

    const { data, error } = await supabase.rpc('reject_top_up_request', {
      p_request_id: requestId,
      p_admin_id: user.id,
      p_review_note: reason,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Top-up rejected.' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Rejection failed' };
  }
}

export async function finalizeEventAction(itemId: string): Promise<{ success: boolean; message: string; result?: any }> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: 'Admin authentication required' };

    const { data, error } = await supabase.rpc('finalize_event', {
      p_item_id: itemId,
      p_admin_id: user.id,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: 'Event successfully finalized and winner determined!',
      result: data,
    };
  } catch (err: any) {
    return { success: false, message: err.message || 'Finalization failed' };
  }
}
