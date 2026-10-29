# ONEBID — Hosting, Security & Deployment Guide

This document provides complete instructions for deploying the ONEBID bidding platform to production environments (Vercel, Supabase, and Custom Domains).

---

## 1. Prerequisites & Required Accounts

1. **Supabase Cloud Account**: [https://supabase.com](https://supabase.com)
2. **Vercel Account**: [https://vercel.com](https://vercel.com) (or any Node.js hosting platform)
3. **SMS Gateway Provider** (for live Ethiopian SMS verification):
   - Twilio / MessageBird / Ethio Telecom SMS Gateway
4. **Domain & DNS**: `onebid.et` or custom subdomain.

---

## 2. Supabase Backend Initialization

### A. Create Project
1. Log in to your Supabase Dashboard and create a new project named `onebid-prod`.
2. Select your closest database region (e.g., Frankfurt/EU or Middle East for optimal latency to Ethiopia).
3. Record your:
   - Project URL (`https://<project-ref>.supabase.co`)
   - `anon` Public Key
   - `service_role` Secret Key

### B. Execute Database Migrations (In Order)
Navigate to the **SQL Editor** in your Supabase dashboard and run each migration sequentially from the `supabase/migrations/` directory:

1. **`001_initial_schema.sql`**:
   - Enables `uuid-ossp` and `pgcrypto`.
   - Creates `profiles`, `categories`, `bidding_items`, `bidding_item_images`, `bids`, `wallets`, `wallet_ledger_entries`, `top_up_requests`, `notifications`, `event_results`, `website_settings`, `faqs`, and `audit_logs`.
   - Attaches `handle_new_user()` trigger to automatically create profile and wallet on signup.
   
2. **`002_rls_policies.sql`**:
   - Enables Row Level Security (RLS) on all 13 tables.
   - Defines strict policies for user data isolation, admin access control, and ledger immutability.

3. **`003_functions.sql`**:
   - Installs atomic PostgreSQL functions:
     - `approve_top_up_request()`: Atomically credits wallet balance, writes ledger entry, updates status, and logs audit.
     - `reject_top_up_request()`: Rejects invalid transaction ID with audit note.
     - `submit_bid()`: Validates bid parameters, deducts entry fee, and records bid atomically.
     - `finalize_event()`: Executes Lowest-Unique-Bid or Highest-Bid algorithm and settles winners.
     - `provision_admin()`: Server-side one-time elevation of the single platform administrator.

4. **`004_seed_data.sql`**:
   - Seeds initial categories, demonstration auctions (smartphones, computers, vehicles), FAQs, and payment instructions.

---

## 3. Storage Bucket Configuration

1. In Supabase Dashboard, navigate to **Storage**.
2. Create a new public bucket: `onebid-assets`.
3. Add an RLS policy for `onebid-assets`:
   - **Public Read**: Anyone can read (`SELECT`).
   - **Admin Upload**: Only authenticated users where `public.is_admin() = true` can `INSERT` and `DELETE`.

---

## 4. Single Administrator Provisioning

The platform enforces exactly one administrator identity without public admin registration pages.

1. Navigate to `/register` on your deployment or staging environment and register the user using their official Ethiopian phone number:
   ```
   Phone: +251911999999
   Name: ONEBID Root Admin
   ```
2. Run the provisioning script from your secure terminal:
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=your_secret_key NEXT_PUBLIC_SUPABASE_URL=your_project_url npx tsx supabase/scripts/provision-admin.ts +251911999999 "ONEBID Root Admin"
   ```
3. The script calls `public.provision_admin(p_user_id)` and locks. Any subsequent calls are rejected with:
   `"An administrator already exists. Use a controlled process to change administrators."`

---

## 5. Vercel Production Deployment

### Option A: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Option B: GitHub Git Integration
1. Push this repository to GitHub.
2. In Vercel, click **New Project** and import the repository.
3. Configure the **Build & Development Settings**:
   - Framework Preset: `Next.js`
   - Root Directory: `onebid`
   - Build Command: `next build`
   - Output Directory: `.next`

### Environment Variables on Vercel:
Add the following in **Project Settings > Environment Variables**:

| Variable | Value | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` | Supabase API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJh...` | Public publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJh...` | Private service role key |
| `NEXT_PUBLIC_APP_NAME` | `ONEBID` | Platform name |
| `NEXT_PUBLIC_DEMO_MODE` | `true` | Pilot flag (keep true until licensing) |
| `NEXT_PUBLIC_CURRENCY` | `ETB` | Currency code |
| `ENABLE_REAL_MONEY_BIDDING` | `false` | Regulatory gate |
| `ENABLE_SETTLEMENT` | `false` | Regulatory gate |

---

## 6. Pre-Launch Operational Checklist

- [x] All 27 Next.js static and dynamic routes compile cleanly (`npm run build`).
- [x] All 24 unit and integration tests pass (`npm test`).
- [x] Row Level Security (RLS) is enabled on all tables.
- [x] Integer minor units arithmetic verified for wallet calculations (`100 = 1.00 ETB`).
- [x] Lowest-Unique-Bid collision elimination algorithm verified.
- [x] Single administrator account provisioned via server-side script.
- [x] Demo mode notice clearly visible across all public and dashboard pages.
- [x] Legal compliance notice displayed on homepage, terms, and footer.
- [ ] Connect live telebirr Merchant API credentials upon National Bank of Ethiopia licensing confirmation.
- [ ] Connect verified Ethiopian bulk SMS provider for live OTP verification.
