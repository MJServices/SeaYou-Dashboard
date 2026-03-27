"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Use service role key if available for administrative tasks
const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);

export async function blockUserAction(userId: string) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return { success: false, error: "Service role key missing. Administrative blocking not possible." };
  }

  try {
    // 1. Update Auth record to ban the user (prevents login/refresh)
    const { error: authError } = await supabase.auth.admin.updateUserById(
      userId,
      { ban_duration: '876000h' } // 100 years
    );

    if (authError) throw authError;

    // 2. Global Sign Out (terminates current sessions immediately)
    // Note: Some versions of supabase-js support admin.signOut(userId, scope)
    await supabase.auth.admin.signOut(userId, 'global').catch(e => {
        console.warn("Global sign out failed or unsupported, ban will take effect on next refresh:", e);
    });

    // 3. Update DB profile for UI list filtering
    const { error } = await supabase
      .from("profiles")
      .update({ is_active: false })
      .eq("id", userId);

    if (error) throw error;

    revalidatePath("/[locale]/users", "page");
    revalidatePath("/[locale]", "page");
    
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function unblockUserAction(userId: string) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return { success: false, error: "Service role key missing. Administrative unblocking not possible." };
  }

  try {
    // 1. Remove ban in Auth
    const { error: authError } = await supabase.auth.admin.updateUserById(
      userId,
      { ban_duration: '0s' } 
    );

    if (authError) throw authError;

    // 2. Update DB profile
    const { error } = await supabase
      .from("profiles")
      .update({ is_active: true })
      .eq("id", userId);

    if (error) throw error;

    revalidatePath("/[locale]/users", "page");
    revalidatePath("/[locale]", "page");
    
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteUserAction(userId: string) {
  if (!supabaseServiceKey) {
    return { success: false, error: "Service role key missing. Administrative deletion not possible." };
  }

  try {
    // Order matters to avoid constraint violations during cleanup itself
    const tablesToCleanup = [
      { name: "fantasy_reports", column: "reporter_id" },
      { name: "messages", column: "sender_id" },
      { name: "bottle_delivery_queue", column: "sender_id" },
      { name: "bottle_delivery_queue", column: "recipient_id" },
      { name: "received_bottles", column: "receiver_id" },
      { name: "received_bottles", column: "sender_id" },
      { name: "sent_bottles", column: "sender_id" },
      { name: "sent_bottles", column: "receiver_id" },
      { name: "sent_bottles", column: "matched_recipient_id" },
      { name: "conversations", column: "user_a_id" },
      { name: "conversations", column: "user_b_id" },
      { name: "conversations", column: "last_sender_id" },
      { name: "fantasies", column: "user_id" },
      { name: "profiles", column: "id" }
    ];

    for (const table of tablesToCleanup) {
      await supabase
        .from(table.name)
        .delete()
        .eq(table.column, userId);
    }

    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      return { success: false, error: `Auth Error: ${error.message}` };
    }

    revalidatePath("/[locale]/users", "page");
    revalidatePath("/[locale]", "page");
    
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
