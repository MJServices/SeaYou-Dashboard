"use server";

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { signSession } from "./session";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);

const ALLOWED_EMAILS = ["contact@seayou-app.com", "minhaj.freelancerr@gmail.com"];

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
        const userExists = usersData.users.some(u => u.email === email);
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
      secure: process.env.NODE_ENV === "production",
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
