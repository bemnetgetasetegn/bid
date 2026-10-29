-- ============================================================
-- ONEBID — Development Seed Data
-- Migration 004: Categories, Demo Items, Settings, FAQs
-- Note: All monetary amounts are in minor units (100 = 1.00 ETB)
-- ============================================================

-- 1. Insert Categories
INSERT INTO public.categories (id, name, slug, description, display_order, is_active)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Smartphones', 'smartphones', 'Latest flagship smartphones, iPhones, and Android devices', 1, TRUE),
  ('c1000000-0000-0000-0000-000000000002', 'Computers', 'computers', 'High performance laptops, MacBooks, and desktop workstations', 2, TRUE),
  ('c1000000-0000-0000-0000-000000000003', 'Electronics', 'electronics', 'Smart TVs, cameras, audio equipment, and wearable tech', 3, TRUE),
  ('c1000000-0000-0000-0000-000000000004', 'Gaming', 'gaming', 'PlayStation 5, Xbox Series X, Nintendo Switch, and gaming rigs', 4, TRUE),
  ('c1000000-0000-0000-0000-000000000005', 'Vehicles', 'vehicles', 'Cars, motorbikes, and premium city transportation', 5, TRUE),
  ('c1000000-0000-0000-0000-000000000006', 'Home & Lifestyle', 'home-lifestyle', 'Luxury watches, home appliances, and lifestyle goods', 6, TRUE),
  ('c1000000-0000-0000-0000-000000000007', 'Other Products', 'other-products', 'Special promotional assets, gift certificates, and accessories', 7, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Bidding Items
-- Note: opening_date and closing_date are dynamically set around now() for live demonstration
INSERT INTO public.bidding_items (
  id, title, slug, short_description, full_description, category_id,
  starting_price, minimum_bid, maximum_bid, bid_increment, participation_cost,
  bidding_mode, currency, opening_date, closing_date, status, is_demo, terms_and_conditions
) VALUES
  (
    'b1000000-0000-0000-0000-000000000001',
    'iPhone 16 Pro Max 256GB Desert Titanium',
    'iphone-16-pro-max-desert-titanium',
    'Brand new sealed iPhone 16 Pro Max with A18 Pro chip and 48MP camera system.',
    'Experience the revolutionary iPhone 16 Pro Max in Desert Titanium with 256GB storage. Features the A18 Pro chip, 48MP Fusion camera, titanium design, and exceptional battery life. Comes brand new in factory sealed packaging with 1-year global warranty.',
    'c1000000-0000-0000-0000-000000000001',
    10000,   -- Starting 100.00 ETB
    100,     -- Min bid 1.00 ETB
    500000,  -- Max bid 5,000.00 ETB
    100,     -- Increment 1.00 ETB
    5000,    -- 50.00 ETB participation fee
    'LOWEST_UNIQUE_BID',
    'ETB',
    now() - interval '2 days',
    now() + interval '3 days 14 hours',
    'ACTIVE',
    TRUE,
    'The participant with the lowest unique bid at event close wins the right to purchase the iPhone 16 Pro Max at their submitted bid price. Uniqueness is evaluated automatically upon closing.'
  ),
  (
    'b1000000-0000-0000-0000-000000000002',
    'MacBook Pro 16" M3 Max 36GB / 1TB Space Black',
    'macbook-pro-16-m3-max',
    'Flagship Apple MacBook Pro 16-inch with M3 Max 14-core CPU and 30-core GPU.',
    'The ultimate pro laptop. Featuring Liquid Retina XDR display, up to 22 hours of battery life, three Thunderbolt 4 ports, HDMI port, SDXC card slot, and MagSafe 3 charging. Perfect for creative professionals, developers, and power users.',
    'c1000000-0000-0000-0000-000000000002',
    50000,   -- Starting 500.00 ETB
    500,     -- Min bid 5.00 ETB
    1000000, -- Max bid 10,000.00 ETB
    500,     -- Increment 5.00 ETB
    10000,   -- 100.00 ETB participation fee
    'HIGHEST_BID',
    'ETB',
    now() - interval '1 day',
    now() + interval '1 day 8 hours',
    'ACTIVE',
    TRUE,
    'Standard auction rules apply. The highest eligible bidder when the countdown expires wins the item at the final bid amount.'
  ),
  (
    'b1000000-0000-0000-0000-000000000003',
    'PlayStation 5 Pro Console 2TB Digital Edition',
    'playstation-5-pro-2tb',
    'Sony PS5 Pro with advanced ray tracing, PlayStation Spectral Super Resolution (PSSR), and 2TB SSD.',
    'Step up your gaming experience with the PlayStation 5 Pro. Equipped with a custom 2TB ultra-high speed SSD, enhanced GPU performance with 67% more compute units, and AI-driven upscaling for crisp 4K gaming at 60+ FPS.',
    'c1000000-0000-0000-0000-000000000004',
    2000,    -- Starting 20.00 ETB
    50,      -- Min bid 0.50 ETB
    300000,  -- Max bid 3,000.00 ETB
    50,      -- Increment 0.50 ETB
    2500,    -- 25.00 ETB fee
    'LOWEST_UNIQUE_BID',
    'ETB',
    now() - interval '3 days',
    now() + interval '5 hours 20 minutes',
    'ACTIVE',
    TRUE,
    'Lowest unique bid competition. Each player submits secret bids. The lowest amount with exactly 1 submission takes the console!'
  ),
  (
    'b1000000-0000-0000-0000-000000000004',
    'Toyota BZ4X Electric SUV 2024 (Zero Km)',
    'toyota-bz4x-electric-suv-2024',
    'Brand new 2024 Toyota bZ4X all-electric SUV, panoramic roof, 500km range.',
    'ONEBID grand event! The cutting-edge Toyota bZ4X electric vehicle, finished in metallic silver with dual-motor AWD, advanced Toyota Safety Sense 3.0, 12.3-inch multimedia touchscreen, and full factory warranty.',
    'c1000000-0000-0000-0000-000000000005',
    100000,  -- Starting 1,000.00 ETB
    1000,    -- Min bid 10.00 ETB
    2000000, -- Max bid 20,000.00 ETB
    1000,    -- Increment 10.00 ETB
    25000,   -- 250.00 ETB fee
    'LOWEST_UNIQUE_BID',
    'ETB',
    now() + interval '2 days',
    now() + interval '12 days',
    'PUBLISHED',
    TRUE,
    'Special event with strictly monitored lowest-unique-bid verification. All participants must hold verified accounts.'
  ),
  (
    'b1000000-0000-0000-0000-000000000005',
    'Samsung 65" OLED 4K S90D Smart TV (2024)',
    'samsung-65-oled-4k-s90d',
    'Neural Quantum Processor 4K, Dolby Atmos, 144Hz refresh rate, LaserSlim design.',
    'Pure blacks, vibrant colors, and deep contrast powered by QD-OLED technology. Ideal for movies, sports, and low-latency gaming.',
    'c1000000-0000-0000-0000-000000000003',
    5000,
    100,
    400000,
    100,
    3000,
    'HIGHEST_BID',
    'ETB',
    now() + interval '1 day',
    now() + interval '6 days',
    'PUBLISHED',
    TRUE,
    'Standard auction rules apply.'
  ),
  (
    'b1000000-0000-0000-0000-000000000006',
    'DJI Mini 4 Pro Fly More Combo Plus',
    'dji-mini-4-pro-fly-more-combo',
    'Omnidirectional obstacle sensing, 4K/60fps HDR video, 45-min flight time.',
    'Completed demo event. Finalized with lowest unique bid.',
    'c1000000-0000-0000-0000-000000000003',
    3000,
    50,
    200000,
    50,
    2000,
    'LOWEST_UNIQUE_BID',
    'ETB',
    now() - interval '10 days',
    now() - interval '2 days',
    'FINALIZED',
    TRUE,
    'Lowest unique bid competition finalized.'
  )
ON CONFLICT (slug) DO NOTHING;

-- 3. Add Item Images
INSERT INTO public.bidding_item_images (bidding_item_id, storage_path, alt_text, display_order)
VALUES
  ('b1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800', 'iPhone 16 Pro Max', 0),
  ('b1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800', 'MacBook Pro 16', 0),
  ('b1000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=800', 'PlayStation 5 Pro', 0),
  ('b1000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800', 'Toyota Electric SUV', 0),
  ('b1000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=800', 'Samsung OLED 65 Smart TV', 0),
  ('b1000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=800', 'DJI Mini 4 Pro', 0)
ON CONFLICT DO NOTHING;

-- 4. Insert Default Website Settings
INSERT INTO public.website_settings (setting_key, setting_value, setting_type, description, is_public)
VALUES
  ('site_name', '"ONEBID"', 'string', 'Official Platform Name', TRUE),
  ('site_tagline', '"Your Next Big Win Starts With One Bid."', 'string', 'Hero Headline', TRUE),
  ('site_description', '"Discover exciting bidding opportunities on technology, electronics, lifestyle products, and more."', 'string', 'Hero Subheading', TRUE),
  ('demo_mode', 'true', 'boolean', 'Demonstration mode active indicator', TRUE),
  ('currency_code', '"ETB"', 'string', 'Platform Currency Code', TRUE),
  ('support_phone', '"+251 91 123 4567"', 'string', 'Customer Support Telephone', TRUE),
  ('support_email', '"support@onebid.et"', 'string', 'Customer Support Email', TRUE),
  ('payment_instructions', '{"telebirr": "Transfer to telebirr merchant code 882011 or phone 0911234567. Include your ONEBID account phone as the transaction reference.", "cbe_birr": "Transfer to CBE Birr account 100023456789. Enter transaction ID after sending.", "awash": "Awash Bank Account: 01320492834700 (OneBid Ethiopia PLC)"}', 'json', 'Manual Top-up Instructions', TRUE)
ON CONFLICT (setting_key) DO NOTHING;

-- 5. Insert FAQs
INSERT INTO public.faqs (question, answer, category, display_order, is_published)
VALUES
  (
    'What is ONEBID and how does it work?',
    'ONEBID is a modern bidding platform designed in Ethiopia that gives participants the opportunity to win high-value items such as smartphones, laptops, electronics, and vehicles at a fraction of their retail price through transparent, competitive bidding.',
    'General',
    1,
    TRUE
  ),
  (
    'What is a Lowest Unique Bid competition?',
    'In a Lowest Unique Bid event, the winner is the participant who submits a bid amount that is completely unique (no other participant submitted the exact same amount) AND is the lowest among all unique entries. If two or more people bid 14.50 ETB, that amount is eliminated from winning because it is not unique!',
    'Bidding Rules',
    2,
    TRUE
  ),
  (
    'What is a Standard Highest Bid auction?',
    'In a Standard Highest Bid auction, participants compete by placing incrementally higher bids. When the countdown timer expires, the participant who holds the highest eligible bid wins the auction.',
    'Bidding Rules',
    3,
    TRUE
  ),
  (
    'How do I deposit funds into my ONEBID wallet?',
    'You can top up your wallet manually using telebirr, CBE Birr, or Awash Bank. After completing your bank or mobile transfer, go to your Dashboard > Wallet > Top Up, enter the exact amount and the Transaction Reference ID. Our team will verify and credit your balance within minutes.',
    'Wallet & Payments',
    4,
    TRUE
  ),
  (
    'Is real-money bidding currently live?',
    'The platform is currently operating in Demonstration Mode with simulated balances while legal regulatory approvals and direct payment gateway integrations are being finalized in accordance with Ethiopian commerce regulations.',
    'Legality & Security',
    5,
    TRUE
  ),
  (
    'What happens if I win an event?',
    'Once an event countdown finishes, our secure backend engine finalizes the results and notifies the winner instantly. You will see the event in your "My Bids" won tab, and our operations team will coordinate item pickup or delivery in Addis Ababa.',
    'Winning & Delivery',
    6,
    TRUE
  )
ON CONFLICT DO NOTHING;
