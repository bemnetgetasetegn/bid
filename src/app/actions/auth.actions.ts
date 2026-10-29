"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { formatPhone } from "@/lib/utils";

function getAdminClient() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined.");
  }
  return createSupabaseClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function phoneToEmail(normalizedPhone: string): string {
  const digits = normalizedPhone.replace(/[^0-9]/g, "");
  return `${digits}@onebid.et`;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    phone?: string;
    fullName?: string;
    isAdmin?: boolean;
  };
}

export async function signUpAction(data: {
  phone: string;
  password: string;
  fullName: string;
}): Promise<AuthResponse> {
  try {
    const normalizedPhone = formatPhone(data.phone);
    if (!normalizedPhone.startsWith("+251") || normalizedPhone.length < 12) {
      return {
        success: false,
        error: "Please enter a valid Ethiopian phone number (e.g., 0911234567 or +251911234567).",
      };
    }

    if (!data.password || data.password.length < 8) {
      return {
        success: false,
        error: "Password must be at least 8 characters long.",
      };
    }

    const emailAlias = phoneToEmail(normalizedPhone);
    const adminClient = getAdminClient();

    // 1. Check if user already exists
    const { data: existingProfiles } = await adminClient
      .from("profiles")
      .select("id, phone_number")
      .eq("phone_number", normalizedPhone.replace(/^\+/, ""))
      .limit(1);

    if (existingProfiles && existingProfiles.length > 0) {
      return {
        success: false,
        error: "An account with this phone number already exists. Please sign in instead.",
      };
    }

    // 2. Create user with admin privileges (bypasses phone SMS provider requirement)
    const { data: createData, error: createError } = await adminClient.auth.admin.createUser({
      phone: normalizedPhone,
      email: emailAlias,
      password: data.password,
      phone_confirm: true,
      email_confirm: true,
      user_metadata: {
        full_name: data.fullName.trim(),
        phone_number: normalizedPhone,
      },
    });

    if (createError) {
      if (createError.message.includes("already registered") || createError.message.includes("unique")) {
        return {
          success: false,
          error: "An account with this phone number already exists. Please sign in instead.",
        };
      }
      return {
        success: false,
        error: createError.message || "Failed to create account.",
      };
    }

    // 3. Automatically sign in the user via SSR server client to establish session cookies
    const ssrClient = await createClient();
    const { data: signInData, error: signInError } = await ssrClient.auth.signInWithPassword({
      email: emailAlias,
      password: data.password,
    });

    if (signInError) {
      // Even if session cookie establishment had an issue, account is created
      return {
        success: true,
        user: {
          id: createData.user.id,
          phone: normalizedPhone,
          fullName: data.fullName,
        },
      };
    }

    return {
      success: true,
      user: {
        id: signInData.user.id,
        phone: normalizedPhone,
        fullName: data.fullName,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "An unexpected error occurred during registration.",
    };
  }
}

export async function signInAction(data: {
  phone: string;
  password: string;
}): Promise<AuthResponse> {
  try {
    const normalizedPhone = formatPhone(data.phone);
    if (!normalizedPhone.startsWith("+251") || normalizedPhone.length < 12) {
      return {
        success: false,
        error: "Please enter a valid Ethiopian phone number (e.g., 0911234567 or +251911234567).",
      };
    }

    const emailAlias = phoneToEmail(normalizedPhone);
    const ssrClient = await createClient();

    // Authenticate using the internal phone-backed email credential
    const { data: signInData, error: signInError } = await ssrClient.auth.signInWithPassword({
      email: emailAlias,
      password: data.password,
    });

    if (signInError || !signInData.user) {
      return {
        success: false,
        error: "Invalid phone number or password. Please verify and try again.",
      };
    }

    // Fetch profile to check if user is admin
    const { data: profile } = await ssrClient
      .from("profiles")
      .select("is_admin, full_name, account_status")
      .eq("id", signInData.user.id)
      .single();

    if (profile?.account_status === "SUSPENDED") {
      await ssrClient.auth.signOut();
      return {
        success: false,
        error: "Your account has been suspended. Please contact support.",
      };
    }

    return {
      success: true,
      user: {
        id: signInData.user.id,
        phone: normalizedPhone,
        fullName: profile?.full_name || signInData.user.user_metadata?.full_name,
        isAdmin: !!profile?.is_admin,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "An unexpected error occurred during sign in.",
    };
  }
}

export async function signOutAction(): Promise<{ success: boolean }> {
  try {
    const ssrClient = await createClient();
    await ssrClient.auth.signOut();
    return { success: true };
  } catch {
    return { success: false };
  }
}
