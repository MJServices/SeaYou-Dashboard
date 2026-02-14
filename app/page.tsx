export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { UserRow } from "@/components/table/UserTable";
import { DashboardClient } from "./DashboardClient";
import { subDays } from "date-fns";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default async function Home() {
  const now = new Date();
  const thirtyDaysAgo = subDays(now, 30).toISOString();
  const sixtyDaysAgo = subDays(now, 60).toISOString();

  const [
    { count: totalUsers },
    { count: totalUsersPrev },
    { count: activeUsers },
    { count: activeUsersPrev },
    { count: bottlesSent },
    { count: bottlesSentPrev },
    { count: premiumUsers },
    { count: premiumUsersPrev },
    { data: usersData },
    { data: sentBottlesData },
  ] = await Promise.all([
    // Current totals/active
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .lt("created_at", thirtyDaysAgo),

    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)
      .lt("created_at", thirtyDaysAgo),

    supabase.from("sent_bottles").select("*", { count: "exact", head: true }),
    supabase
      .from("sent_bottles")
      .select("*", { count: "exact", head: true })
      .lt("created_at", thirtyDaysAgo),

    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .in("tier", ["premium", "elite"]),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .in("tier", ["premium", "elite"])
      .lt("created_at", thirtyDaysAgo),

    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000),
    supabase.from("sent_bottles").select("sender_id"),
  ]);

  const allSentBottles =
    (sentBottlesData as { sender_id: string }[] | null) || [];
  const bottleCounts = allSentBottles.reduce(
    (acc, b) => {
      acc[b.sender_id] = (acc[b.sender_id] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Debugging log for bottles count
  const { error: bottlesError } = await supabase
    .from("sent_bottles")
    .select("id", { count: "exact", head: true });
  if (bottlesError) {
    console.error("Supabase Error (sent_bottles):", bottlesError);
  }

  // Fallback for bottles count: if sent_bottles table is not accessible, sum from profiles
  let finalBottles = bottlesSent || 0;
  if (finalBottles === 0) {
    const { data: profilesWithBottles } = (await supabase
      .from("profiles")
      .select("total_bottles_sent")) as {
      data: { total_bottles_sent: number | null }[] | null;
    };
    finalBottles =
      profilesWithBottles?.reduce(
        (acc, p) => acc + (p.total_bottles_sent || 0),
        0,
      ) || 0;
  }

  const calculateTrend = (curr: number | null, prev: number | null) => {
    const c = curr || 0;
    const p = prev || 0;
    if (p === 0) return c > 0 ? 100 : 0;
    return Math.round(((c - p) / p) * 100);
  };

  const stats = {
    total: {
      value: totalUsers || 0,
      trend: calculateTrend(totalUsers, totalUsersPrev),
    },
    active: {
      value: activeUsers || 0,
      trend: calculateTrend(activeUsers, activeUsersPrev),
    },
    bottles: {
      value: finalBottles,
      trend: calculateTrend(finalBottles, bottlesSentPrev),
    },
    premium: {
      value: premiumUsers || 0,
      trend: calculateTrend(premiumUsers, premiumUsersPrev),
    },
  };

  const profiles = usersData as Profile[] | null;

  const rows: UserRow[] =
    (usersData as any[])?.map((user) => ({
      id: user.id.substring(0, 8),
      name: user.full_name || "Unknown",
      email: user.email,
      lastActive: user.last_active ? new Date(user.last_active) : new Date(),
      // Use manually aggregated count, fallback to profiles column
      bottles: bottleCounts[user.id] ?? user.total_bottles_sent ?? 0,
      type: (user.tier === "premium" || user.tier === "elite"
        ? "Premium"
        : "Basic") as "Basic" | "Premium",
    })) || [];

  return <DashboardClient stats={stats} initialUsers={rows} />;
}
