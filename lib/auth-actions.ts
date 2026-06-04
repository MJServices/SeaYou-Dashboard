"use server";

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { signSession } from "./session";

const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let client: any = null;
let adminClient: any = null;

const supabase = new Proxy({} as any, {
  get(target, prop) {
    if (!client) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";
      client = createClient(url, anonKey);
    }
    return client[prop];
  }
});

const supabaseAdmin = new Proxy({} as any, {
  get(target, prop) {
    if (!adminClient) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      adminClient = createClient(url, serviceKey || anonKey);
    }
    return adminClient[prop];
  }
});

const ALLOWED_EMAILS = ["contactpro.seayou@gmail.com", "minhaj.freelancerr@gmail.com"];

export async function loginAction(formData: FormData) {
  const emailInput = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!emailInput || !password) {
    return { success: false, errorType: "required" };
  }

  const email = emailInput.toLowerCase().trim();

  // 1. Check if email is allowed
  if (!ALLOWED_EMAILS.includes(email)) {
    return { success: false, errorType: "unauthorized" };
  }

  try {
    // 2. Check if user exists in Supabase Auth
    if (supabaseServiceKey) {
      const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (!listError && usersData) {
        const userExists = usersData.users.some((u: any) => u.email === email);
        if (!userExists) {
          // Auto-create user for allowed emails if they don't exist yet
          const { error: createError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
          });

          if (createError) {
            console.error("Auto-create error:", createError);
            return { 
              success: false, 
              errorType: "system_error", 
              errorMessage: createError.message 
            };
          }
        }
      }
    }

    // 3. Authenticate user password with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error("Sign in error:", authError);
      return { success: false, errorType: "invalid_credentials" };
    }

    // 4. Create cryptographically signed session token
    const token = await signSession(email);

    // 5. Store session token in HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: false, // Set to false to support production builds deployed without HTTPS (e.g. VPS testing)
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return { success: true };
  } catch (err: any) {
    console.error("Login action crash:", err);
    return { success: false, errorType: "system_error", errorMessage: err.message };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return { success: true };
}
