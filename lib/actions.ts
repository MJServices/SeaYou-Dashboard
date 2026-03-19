"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Use service role key if available for administrative tasks
const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);

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
