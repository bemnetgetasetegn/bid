import { createClient } from '@/lib/supabase/client';
import { BiddingItem, Bid, EventResult } from '@/types';

export const fallbackItems: BiddingItem[] = [
  {
    id: 'b1000000-0000-0000-0000-000000000001',
    title: 'iPhone 16 Pro Max 256GB Desert Titanium',
    slug: 'iphone-16-pro-max-desert-titanium',
    short_description: 'Brand new sealed iPhone 16 Pro Max with A18 Pro chip and 48MP camera system.',
    description: 'Experience the revolutionary iPhone 16 Pro Max in Desert Titanium with 256GB storage. Features the A18 Pro chip, 48MP Fusion camera, titanium design, and exceptional battery life.',
    category_id: 'c1000000-0000-0000-0000-000000000001',
    starting_price: 10000,
    minimum_bid: 100,
    maximum_bid: 500000,
    bid_increment: 100,
    bid_cost: 5000,
    current_highest_bid: 12400,
    total_bids: 48,
    bidding_mode: 'LOWEST_UNIQUE_BID',
    currency: 'ETB',
    opening_date: new Date(Date.now() - 172800000).toISOString(),
    closing_date: new Date(Date.now() + 295200000).toISOString(),
    status: 'ACTIVE',
    terms_and_conditions: 'Lowest unique bid competition. The lowest non-matching bid wins.',
    is_demo: true,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-1',
        bidding_item_id: 'b1000000-0000-0000-0000-000000000001',
        storage_path: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800',
        alt_text: 'iPhone 16 Pro Max',
        display_order: 0,
        created_at: new Date().toISOString(),
      }
    ]
  },
  {
    id: 'b1000000-0000-0000-0000-000000000002',
    title: 'MacBook Pro 16" M3 Max 36GB / 1TB Space Black',
    slug: 'macbook-pro-16-m3-max',
    short_description: 'Flagship Apple MacBook Pro 16-inch with M3 Max 14-core CPU and 30-core GPU.',
    description: 'The ultimate pro laptop. Featuring Liquid Retina XDR display, up to 22 hours of battery life, three Thunderbolt 4 ports, HDMI port, SDXC card slot, and MagSafe 3 charging.',
    category_id: 'c1000000-0000-0000-0000-000000000002',
    starting_price: 50000,
    minimum_bid: 500,
    maximum_bid: 1000000,
    bid_increment: 500,
    bid_cost: 10000,
    current_highest_bid: 85500,
    total_bids: 62,
    bidding_mode: 'HIGHEST_BID',
    currency: 'ETB',
    opening_date: new Date(Date.now() - 86400000).toISOString(),
    closing_date: new Date(Date.now() + 115200000).toISOString(),
    status: 'ACTIVE',
    terms_and_conditions: 'Standard auction rules apply. The highest eligible bidder wins.',
    is_demo: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-2',
        bidding_item_id: 'b1000000-0000-0000-0000-000000000002',
        storage_path: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800',
        alt_text: 'MacBook Pro 16',
        display_order: 0,
        created_at: new Date().toISOString(),
      }
    ]
  },
  {
    id: 'b1000000-0000-0000-0000-000000000003',
    title: 'PlayStation 5 Pro Console 2TB Digital Edition',
    slug: 'playstation-5-pro-2tb',
    short_description: 'Sony PS5 Pro with advanced ray tracing and 2TB SSD.',
    description: 'Equipped with a custom 2TB ultra-high speed SSD and enhanced GPU performance with 67% more compute units.',
    category_id: 'c1000000-0000-0000-0000-000000000004',
    starting_price: 2000,
    minimum_bid: 50,
    maximum_bid: 300000,
    bid_increment: 50,
    bid_cost: 2500,
    current_highest_bid: 4350,
    total_bids: 91,
    bidding_mode: 'LOWEST_UNIQUE_BID',
    currency: 'ETB',
    opening_date: new Date(Date.now() - 259200000).toISOString(),
    closing_date: new Date(Date.now() + 19200000).toISOString(),
    status: 'ACTIVE',
    terms_and_conditions: 'Lowest unique bid competition.',
    is_demo: true,
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-3',
        bidding_item_id: 'b1000000-0000-0000-0000-000000000003',
        storage_path: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=800',
        alt_text: 'PlayStation 5 Pro',
        display_order: 0,
        created_at: new Date().toISOString(),
      }
    ]
  },
  {
    id: 'b1000000-0000-0000-0000-000000000004',
    title: 'Toyota BZ4X Electric SUV 2024 (Zero Km)',
    slug: 'toyota-bz4x-electric-suv-2024',
    short_description: 'Brand new 2024 Toyota bZ4X all-electric SUV, panoramic roof, 500km range.',
    description: 'ONEBID premier vehicle event. Dual-motor AWD, Toyota Safety Sense 3.0, and fast charging.',
    category_id: 'c1000000-0000-0000-0000-000000000005',
    starting_price: 100000,
    minimum_bid: 1000,
    maximum_bid: 2000000,
    bid_increment: 1000,
    bid_cost: 25000,
    current_highest_bid: 0,
    total_bids: 0,
    bidding_mode: 'LOWEST_UNIQUE_BID',
    currency: 'ETB',
    opening_date: new Date(Date.now() + 172800000).toISOString(),
    closing_date: new Date(Date.now() + 1036800000).toISOString(),
    status: 'SCHEDULED',
    terms_and_conditions: 'Upcoming lowest unique bid event for premium vehicle.',
    is_demo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-4',
        bidding_item_id: 'b1000000-0000-0000-0000-000000000004',
        storage_path: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800',
        alt_text: 'Toyota BZ4X Electric SUV',
        display_order: 0,
        created_at: new Date().toISOString(),
      }
    ]
  },
  {
    id: 'b1000000-0000-0000-0000-000000000006',
    title: 'DJI Mini 4 Pro Fly More Combo Plus',
    slug: 'dji-mini-4-pro-fly-more-combo',
    short_description: 'Omnidirectional obstacle sensing, 4K/60fps HDR video, 45-min flight time.',
    description: 'Completed lowest-unique-bid event. Finalized and verified.',
    category_id: 'c1000000-0000-0000-0000-000000000003',
    starting_price: 3000,
    minimum_bid: 50,
    maximum_bid: 200000,
    bid_increment: 50,
    bid_cost: 2000,
    current_highest_bid: 31250,
    total_bids: 134,
    bidding_mode: 'LOWEST_UNIQUE_BID',
    currency: 'ETB',
    opening_date: new Date(Date.now() - 864000000).toISOString(),
    closing_date: new Date(Date.now() - 172800000).toISOString(),
    status: 'SETTLED',
    terms_and_conditions: 'Completed event.',
    is_demo: true,
    created_at: new Date(Date.now() - 864000000).toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-6',
        bidding_item_id: 'b1000000-0000-0000-0000-000000000006',
        storage_path: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=800',
        alt_text: 'DJI Mini 4 Pro Drone',
        display_order: 0,
        created_at: new Date().toISOString(),
      }
    ]
  }
];

export async function getBiddingItems(filter?: {
  status?: string;
  category?: string;
  bidding_mode?: string;
}): Promise<BiddingItem[]> {
  try {
    const supabase = createClient();
    let query = supabase
      .from('bidding_items')
      .select('*, bidding_item_images(*), categories(*)');

    if (filter?.status) {
      if (filter.status === 'ACTIVE') {
        query = query.in('status', ['ACTIVE', 'PUBLISHED']);
      } else if (filter.status === 'UPCOMING') {
        query = query.eq('status', 'SCHEDULED');
      } else if (filter.status === 'COMPLETED') {
        query = query.in('status', ['ENDED', 'SETTLED', 'FINALIZED']);
      } else {
        query = query.eq('status', filter.status);
      }
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return filterFallback(fallbackItems, filter);
    }

    return data.map((item: any) => ({
      ...item,
      bid_cost: item.participation_cost || item.bid_cost || 0,
      description: item.full_description || item.description || '',
      images: item.bidding_item_images || [],
    }));
  } catch {
    return filterFallback(fallbackItems, filter);
  }
}

function filterFallback(items: BiddingItem[], filter?: any): BiddingItem[] {
  let result = [...items];
  if (filter?.status) {
    if (filter.status === 'ACTIVE') {
      result = result.filter(i => i.status === 'ACTIVE' || i.status === 'PUBLISHED');
    } else if (filter.status === 'UPCOMING') {
      result = result.filter(i => i.status === 'SCHEDULED' || new Date(i.opening_date) > new Date());
    } else if (filter.status === 'COMPLETED') {
      result = result.filter(i => i.status === 'SETTLED' || i.status === 'ENDED' || i.status === 'FINALIZED');
    }
  }
  if (filter?.category) {
    result = result.filter(i => i.category_id === filter.category);
  }
  return result;
}

export async function getBiddingItemBySlug(slug: string): Promise<BiddingItem | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('bidding_items')
      .select('*, bidding_item_images(*), categories(*)')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      const found = fallbackItems.find(i => i.slug === slug);
      return found || null;
    }

    return {
      ...data,
      bid_cost: data.participation_cost || data.bid_cost || 0,
      description: data.full_description || data.description || '',
      images: data.bidding_item_images || [],
    };
  } catch {
    const found = fallbackItems.find(i => i.slug === slug);
    return found || null;
  }
}

export async function submitBidAction(
  itemId: string,
  bidAmount: number,
  idempotencyKey?: string
): Promise<{ success: boolean; message: string; bid_id?: string }> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: 'Please log in to place a bid' };
    }

    // Call atomic submit_bid database function
    const { data, error } = await supabase.rpc('submit_bid', {
      p_user_id: user.id,
      p_item_id: itemId,
      p_bid_amount: bidAmount,
      p_idempotency_key: idempotencyKey || `${user.id}-${itemId}-${Date.now()}`,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: 'Bid successfully recorded!',
      bid_id: data?.bid_id,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Failed to submit bid',
    };
  }
}
