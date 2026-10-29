/**
 * ONEBID — Server-side Initial Administrator Provisioning Script
 * Run this script to establish the ONE authorized administrator account.
 * 
 * Usage:
 * npx tsx supabase/scripts/provision-admin.ts <phone_number> <full_name>
 * Example:
 * npx tsx supabase/scripts/provision-admin.ts +251911999999 "ONEBID Root Admin"
 */

import { createClient } from "@supabase/supabase-js";

async function provisionAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.");
    process.exit(1);
  }

  const phone = process.argv[2] || "+251911999999";
  const fullName = process.argv[3] || "ONEBID Root Admin";

  console.log(`[ONEBID] Initializing single administrator provisioning for: ${phone} (${fullName})`);

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // 1. Verify if an administrator already exists
  const { data: existingAdmin, error: checkError } = await supabase
    .from("profiles")
    .select("id, full_name, phone_number")
    .eq("is_admin", true);

  if (existingAdmin && existingAdmin.length > 0) {
    console.error(`[ONEBID SECURITY] An administrator already exists: ${existingAdmin[0].phone_number}. Provisioning aborted.`);
    process.exit(1);
  }

  // 2. Check if the user profile exists
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("phone_number", phone)
    .single();

  if (!profile) {
    console.log(`[ONEBID] User with phone ${phone} does not exist yet. Please register the user account in Supabase Auth first, then re-run this script.`);
    process.exit(1);
  }

  // 3. Elevate user to administrator via the secure PostgreSQL function
  const { data, error: rpcError } = await supabase.rpc("provision_admin", {
    p_user_id: profile.id,
  });

  if (rpcError) {
    console.error(`[ONEBID] Provisioning failed: ${rpcError.message}`);
    process.exit(1);
  }

  console.log(`[ONEBID SUCCESS] Successfully provisioned ${phone} as the ONE authorized administrator.`);
}

provisionAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
