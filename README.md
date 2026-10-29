# ONEBID — Complete Full-Stack Bidding Platform

A production-oriented online bidding platform designed for the Ethiopian market, featuring both **Lowest-Unique-Bid Competitions** and **Standard Highest-Bid Auctions**, built from scratch with Next.js (App Router), TypeScript, Tailwind CSS, and Supabase.

---

## 🎨 Visual Identity & Mood Board

The design system is built around an editorial, high-contrast black, white, and orange identity inspired by Swiss/editorial design:

- **Primary Black**: `#111111`
- **Secondary Black**: `#1B1B1B`
- **Primary Orange**: `#FF5A1F`
- **Deep Orange**: `#E94B16`
- **White**: `#FFFFFF`
- **Light Background**: `#F5F5F3`
- **Border Gray**: `#E5E5E5`
- **Secondary Text**: `#686868`
- **Typography**: Inter (sans-serif), bold editorial headings, mono numerical values for prices and timestamps.
- **Graphic Elements**: SVG halftone dot patterns, clean grids, spacious high-contrast sections.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide React icons, Radix UI primitives.
- **Backend / Database**: Supabase PostgreSQL with custom transactional functions and Row-Level Security (RLS).
- **Authentication**: Phone number + password authentication (with Ethiopian `+251` normalization).
- **Security & Authorization**: Single authoritative administrator role enforced server-side and within database functions.
- **State & Arithmetic**: Integer minor units (cents) for exact monetary calculations (`100 = 1.00 ETB`) without floating-point inaccuracies.
- **Testing**: Automated unit tests and integration tests via Vitest (24/24 tests passing).

---

## 📂 Project Structure

```
onebid/
├── src/
│   ├── app/
│   │   ├── (public)/          # Public website routes
│   │   │   ├── bids/          # Live bids catalog & [slug] detail page
│   │   │   ├── upcoming/      # Scheduled auction releases
│   │   │   ├── completed/     # Past and finalized events
│   │   │   ├── winners/       # Hall of verified winners
│   │   │   ├── how-it-works/  # Game-theory rules and user guide
│   │   │   ├── faq/           # Interactive accordion FAQ
│   │   │   ├── contact/       # Support desk & contact form
│   │   │   ├── terms/         # Legal terms & conditions
│   │   │   └── privacy/       # Data privacy policy
│   │   ├── (auth)/            # Phone-based authentication
│   │   │   ├── login/         # Phone + password login
│   │   │   ├── register/      # Full registration with terms agreement
│   │   │   └── forgot-password/ # Account recovery instructions
│   │   ├── dashboard/         # Registered user dashboard
│   │   │   ├── bids/          # Active & won bids
│   │   │   ├── wallet/        # Available / reserved balances
│   │   │   ├── wallet/top-up/ # Manual top-up request form
│   │   │   ├── transactions/  # Immutable double-entry ledger
│   │   │   ├── notifications/ # Real-time alerts
│   │   │   └── profile/       # Profile details & password update
│   │   └── admin/             # Single authorized administrator console
│   │       ├── bids/          # Auction management & creation
│   │       ├── top-ups/       # Atomic approve / reject queue
│   │       ├── results/       # Event finalization & winner arbitration engine
│   │       ├── users/         # User accounts & suspension controls
│   │       ├── categories/    # Product categories management
│   │       ├── bid-history/   # Live bid stream & audit logs
│   │       ├── content/       # Homepage copy & payment instructions
│   │       ├── faqs/          # FAQ management
│   │       ├── settings/      # System settings & feature flags
│   │       └── audit-logs/    # Security audit trail
│   ├── components/
│   │   ├── layout/            # Navbar with mobile drawer, Footer with halftone dots
│   │   ├── public/            # BiddingCard, CountdownTimer, BidForm
│   │   └── ui/                # Accessible Radix/Tailwind components
│   ├── lib/
│   │   ├── services/          # Server & client data services
│   │   ├── supabase/          # SSR browser and server client setup
│   │   ├── validations/       # Zod validation schemas
│   │   └── utils.ts           # Currency, phone, and time utilities
│   └── types/                 # Complete TypeScript definitions
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql  # Core tables, constraints, indexes
│   │   ├── 002_rls_policies.sql    # Row-Level Security policies
│   │   ├── 003_functions.sql       # Atomic PL/pgSQL functions
│   │   └── 004_seed_data.sql       # Ethiopian demo auctions & settings
│   └── scripts/
│       └── provision-admin.ts      # Server-side single administrator provisioning
└── tests/
    └── unit/                  # Vitest automated test suite
```

---

## ⚡ Quick Start & Local Development

### 1. Install Dependencies
```bash
cd onebid
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

NEXT_PUBLIC_APP_NAME=ONEBID
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_CURRENCY=ETB

ENABLE_REAL_MONEY_BIDDING=false
ENABLE_SETTLEMENT=false
```

### 3. Apply Database Migrations
Execute the migrations in your Supabase project (via SQL Editor or Supabase CLI):
1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_rls_policies.sql`
3. `supabase/migrations/003_functions.sql`
4. `supabase/migrations/004_seed_data.sql`

### 4. Run Automated Tests
```bash
npm test
# Or: npx vitest run
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Administrator Setup Procedure

The platform enforces **exactly one administrator**:
1. Register the admin user account using their Ethiopian phone number (e.g. `+251911999999`) via `/register`.
2. Run the server-side provisioning script:
   ```bash
   npx tsx supabase/scripts/provision-admin.ts +251911999999 "ONEBID Root Admin"
   ```
3. Once provisioned, the `provision_admin` function locks automatically and rejects further elevation attempts.
4. Log in at `/login` to access `/admin`.

---

## ⚖️ Legal & Regulatory Safeguards

- **Demonstration Mode Active**: Real-money bidding and direct settlement are disabled by default until official licenses are granted by Ethiopian authorities.
- **Auditable Ledger**: Every top-up, bid entry fee, and refund creates an immutable row in `wallet_ledger_entries`.
- **Atomic Operations**: Top-up approval updates the wallet and creates the ledger entry within a single PostgreSQL transaction (`approve_top_up_request`).
