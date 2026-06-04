import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

let client: any = null;

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn(
    "Warning: Missing env.NEXT_PUBLIC_SUPABASE_URL or env.NEXT_PUBLIC_SUPABASE_ANON_KEY during compilation."
  );
}

export const supabase = new Proxy({} as any, {
  get(target, prop) {
    if (!client) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";
      client = createClient<Database>(url, anonKey);
    }
    return client[prop];
  }
});
