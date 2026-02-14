export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";
import { UsersClient } from "./UsersClient";
import { UserRow } from "@/components/table/UserTable";
import { Database } from "@/types/supabase";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default async function UsersPage() {
  const [{ data: profilesData }, { data: sentBottlesData }] = await Promise.all(
    [
      supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("sent_bottles").select("sender_id"),
    ],
  );

  const profiles = profilesData as Profile[] | null;
  const allSentBottles =
    (sentBottlesData as { sender_id: string }[] | null) || [];

  const bottleCounts = allSentBottles.reduce(
    (acc, b) => {
      acc[b.sender_id] = (acc[b.sender_id] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const users: UserRow[] =
    profiles?.map((user) => ({
      id: user.id.substring(0, 8),
      name: user.full_name || "Unknown",
      email: user.email,
      lastActive: user.last_active ? new Date(user.last_active) : new Date(),
      bottles: bottleCounts[user.id] ?? user.total_bottles_sent ?? 0,
      type: (user.tier === "premium" || user.tier === "elite"
        ? "Premium"
        : "Basic") as "Basic" | "Premium",
    })) || [];

  return <UsersClient initialUsers={users} />;
}
