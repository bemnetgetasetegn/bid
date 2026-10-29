import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[match[1]] = value.trim();
  }
}

const url = (env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log('[ONEBID] Initializing Admin & Demo Users...');

  // 1. Root Admin
  const adminPhone = '+251911999999';
  const adminEmail = `${adminPhone.replace(/[^0-9]/g, '')}@onebid.et`;
  const adminPass = 'Admin@1234';

  let { data: adminAuth, error: aErr } = await supabase.auth.admin.createUser({
    phone: adminPhone,
    email: adminEmail,
    password: adminPass,
    phone_confirm: true,
    email_confirm: true,
    user_metadata: { full_name: 'ONEBID Root Admin', phone_number: adminPhone },
  });

  let adminId = adminAuth?.user?.id;
  if (aErr) {
    console.log('[Admin exists/skipped]:', aErr.message);
    const { data: users } = await supabase.auth.admin.listUsers();
    const existing = users?.users?.find(u => u.email === adminEmail || u.phone === adminPhone);
    if (existing) adminId = existing.id;
  }

  if (adminId) {
    // Elevate admin
    await supabase.from('profiles').update({ is_admin: true }).eq('id', adminId);
    console.log('[SUCCESS] Root Admin provisioned with is_admin = true (ID:', adminId, ')');
  }

  // 2. Demo User
  const userPhone = '+251911234567';
  const userEmail = `${userPhone.replace(/[^0-9]/g, '')}@onebid.et`;
  const userPass = 'DemoPass123!';

  let { data: userAuth, error: uErr } = await supabase.auth.admin.createUser({
    phone: userPhone,
    email: userEmail,
    password: userPass,
    phone_confirm: true,
    email_confirm: true,
    user_metadata: { full_name: 'Abebe Kebede', phone_number: userPhone },
  });

  let userId = userAuth?.user?.id;
  if (uErr) {
    console.log('[Demo User exists/skipped]:', uErr.message);
    const { data: users } = await supabase.auth.admin.listUsers();
    const existing = users?.users?.find(u => u.email === userEmail || u.phone === userPhone);
    if (existing) userId = existing.id;
  }

  if (userId) {
    // Top up wallet with 50,000 cents (500 ETB)
    await supabase.from('wallets').update({ available_balance: 50000 }).eq('user_id', userId);
    console.log('[SUCCESS] Demo User ready with 500.00 ETB available balance (ID:', userId, ')');
  }

  console.log('\n[ONEBID READY]');
  console.log('Admin Login: Phone 0911999999 / Password Admin@1234');
  console.log('Demo User: Phone 0911234567 / Password DemoPass123!');
}

main().catch(console.error);
