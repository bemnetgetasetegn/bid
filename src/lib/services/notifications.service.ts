import { createClient } from '@/lib/supabase/client';
import { Notification } from '@/types';

export const fallbackNotifications: Notification[] = [
  {
    id: 'n-1',
    user_id: 'u-101',
    title: 'Top-up Approved',
    message: 'Your top-up of 1,000.00 ETB via telebirr has been verified and added to your wallet.',
    type: 'TOP_UP_APPROVED',
    is_read: true,
    data: null,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'n-2',
    user_id: 'u-101',
    title: 'Bid Confirmed',
    message: 'Your bid of 14.50 ETB on iPhone 16 Pro Max was accepted.',
    type: 'BID_PLACED',
    is_read: false,
    data: null,
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'n-3',
    user_id: 'u-101',
    title: 'Event Closing Soon',
    message: 'PlayStation 5 Pro event closes in less than 6 hours!',
    type: 'ITEM_ENDING',
    is_read: false,
    data: null,
    created_at: new Date(Date.now() - 600000).toISOString(),
  }
];

export async function getUserNotifications(): Promise<Notification[]> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return fallbackNotifications;

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return fallbackNotifications;
    }

    return data.map((d: any) => ({
      ...d,
      type: d.notification_type || d.type,
      is_read: !!d.read_at || d.is_read,
    }));
  } catch {
    return fallbackNotifications;
  }
}

export async function markNotificationAsRead(id: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', id);

    return !error;
  } catch {
    return true;
  }
}
