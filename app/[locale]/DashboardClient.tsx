"use client";

import Image from "next/image";
import { Shell } from "@/components/layout/Shell";
import { StatCard } from "@/components/cards/StatCard";
import { UserTable, UserRow } from "@/components/table/UserTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState, useEffect, useRef } from "react";
import { format, subDays } from "date-fns";
import { FilterSheet } from "@/components/sheets/FilterSheet";
import { UserProfileSheet } from "@/components/sheets/UserProfileSheet";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabase";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type DashboardStats = {
  total: { value: number; trend: number };
  active: { value: number; trend: number };
  bottles: { value: number; trend: number };
  premium: { value: number; trend: number };
};

type Props = {
  stats: DashboardStats;
  initialUsers: UserRow[];
};

export function DashboardClient({ stats, initialUsers }: Props) {
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(
    null,
  );
  const [filterType, setFilterType] = useState<"All" | "Basic" | "Premium">(
    "All",
  );
  const [bottlesMin, setBottlesMin] = useState<number | undefined>();
  const [gender, setGender] = useState<string[]>([]);
  const [minAge, setMinAge] = useState<number | undefined>();
  const [maxAge, setMaxAge] = useState<number | undefined>();
  const [city, setCity] = useState("");
  const [department, setDepartment] = useState("");
  const [sortBy, setSortBy] = useState<"none" | "gender" | "age" | "department" | "createdAt">("none");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const realtimeChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Helper: check if a raw profile row has a completed profile
  function isProfileComplete(user: any): boolean {
    return !!(user.full_name && user.gender && user.age);
  }

  // Helper: convert a raw supabase profile row to a UserRow
  function toUserRow(user: any): UserRow {
    return {
      id: user.id.substring(0, 8),
      name: user.full_name || "Unknown",
      email: user.email,
      lastActive: user.last_active ? new Date(user.last_active) : new Date(),
      bottles: user.total_bottles_sent ?? 0,
      type: (user.tier === "premium" || user.tier === "elite"
        ? "Premium"
        : "Basic") as "Basic" | "Premium",
      gender: user.gender,
      age: user.age,
      city: user.city,
      department: user.department,
      createdAt: user.created_at ? new Date(user.created_at) : new Date(),
      fullId: user.id,
    };
  }

  useEffect(() => {
    setMounted(true);
    setFromDate(format(subDays(new Date(), 30), "MMM d, yyyy"));
    setToDate(format(new Date(), "MMM d, yyyy"));
  }, []);

  // Real-time subscription: listen for profile inserts, updates, and deletes
  useEffect(() => {
    const channel = supabase
      .channel("dashboard-profiles-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "profiles" },
        (payload: RealtimePostgresChangesPayload<Record<string, any>>) => {
          const newUser = payload.new as any;
          // Only add to list if the profile is complete
          if (!isProfileComplete(newUser)) return;
          setUsers((prev) => {
            // Avoid duplicates
            if (prev.some((u) => u.fullId === newUser.id)) return prev;
            return [toUserRow(newUser), ...prev];
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles" },
        (payload: RealtimePostgresChangesPayload<Record<string, any>>) => {
          const updated = payload.new as any;
          setUsers((prev) => {
            // If profile became incomplete, remove from list
            if (!isProfileComplete(updated)) {
              return prev.filter((u) => u.fullId !== updated.id);
            }
            // If not in list yet (profile just became complete), add it
            const exists = prev.some((u) => u.fullId === updated.id);
            if (!exists) {
              return [toUserRow(updated), ...prev];
            }
            // Update existing entry
            return prev.map((u) =>
              u.fullId === updated.id ? toUserRow(updated) : u
            );
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "profiles" },
        (payload: RealtimePostgresChangesPayload<Record<string, any>>) => {
          const deleted = payload.old as any;
          setUsers((prev) => prev.filter((u) => u.fullId !== deleted.id));
        }
      )
      .subscribe();

    realtimeChannelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredUsers = useMemo(() => {
    let filteredList = users.filter((u) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || [u.name, u.email, u.id, u.fullId, u.city].some((field) =>
        field?.toLowerCase().includes(q),
      );
      const matchesType = filterType === "All" || u.type === filterType;
      const matchesGender = gender.length === 0 ? true : (u.gender && gender.includes(u.gender));
      const matchesBottles =
        bottlesMin === undefined || u.bottles >= bottlesMin;

      const meetsMinAge = minAge !== undefined ? (u.age ?? 0) >= minAge : true;
      const meetsMaxAge = maxAge !== undefined ? (u.age ?? 0) <= maxAge : true;
      const matchesCity = !city || u.city?.toLowerCase().includes(city.toLowerCase());
      const matchesDept = !department || u.department?.toLowerCase().includes(department.toLowerCase());

      return (
        matchesSearch && 
        matchesType && 
        matchesGender && 
        matchesBottles &&
        meetsMinAge &&
        meetsMaxAge &&
        matchesCity &&
        matchesDept
      );
    });
    
    // Sort
    if (sortBy !== "none") {
      filteredList.sort((a: UserRow, b: UserRow) => {
        let cmp = 0;
        if (sortBy === "age") {
          cmp = (a.age ?? 0) - (b.age ?? 0);
        } else if (sortBy === "gender") {
          cmp = (a.gender || "").localeCompare(b.gender || "");
        } else if (sortBy === "department") {
          cmp = (a.department || "").localeCompare(b.department || "");
        } else if (sortBy === "createdAt") {
          cmp = a.createdAt.getTime() - b.createdAt.getTime();
        }
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    
    return filteredList;
  }, [searchQuery, users, filterType, gender, bottlesMin, minAge, maxAge, city, department, sortBy, sortDir]);

  function exportCsv() {
    const header = [
      "ID Number",
      "Name",
      "Email Address",
      "Created At",
      "Last Active",
      "Bottles Sent",
      "Gender",
      "Type",
    ];
    const rows = filteredUsers.map((r: UserRow) => [
      r.id,
      r.name,
      r.email,
      r.createdAt.toISOString(),
      r.lastActive.toISOString(),
      String(r.bottles),
      r.gender || "-",
      r.type,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell: any) => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-dashboard-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const t = useTranslations("Dashboard");

  const getTrendProps = (trend: number, value: number) => {
    const isUp = trend >= 0;
    return {
      trendIcon: (isUp
        ? "/assets/figma/trending-up.svg"
        : "/assets/figma/trending-down.svg") as any,
      trendText: t("trendText", { isUp: String(isUp), trend }),
    };
  };

  return (
    <Shell title={t("title")} onHeaderSearch={setSearchQuery}>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("totalUsers")}
          value={stats.total.value.toLocaleString()}
          {...getTrendProps(stats.total.trend, stats.total.value)}
        />
        <StatCard
          title={t("activeUsers")}
          value={stats.active.value.toLocaleString()}
          {...getTrendProps(stats.active.trend, stats.active.value)}
        />
        <StatCard
          title={t("bottlesSent")}
          value={stats.bottles.value.toLocaleString()}
          {...getTrendProps(stats.bottles.trend, stats.bottles.value)}
        />
        <StatCard
          title={t("premiumUsers")}
          value={stats.premium.value.toLocaleString()}
          {...getTrendProps(stats.premium.trend, stats.premium.value)}
        />
      </section>

      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[24px] font-semibold text-[#363636]">
            {t("users")}
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-[320px] items-center gap-2 rounded-lg border border-[#d9d9d9] px-3">
              <Image
                src="/assets/figma/search-2.svg"
                alt="search"
                width={24}
                height={24}
              />
              <Input
                className="h-10 border-0 p-0 text-[#363636]"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {mounted ? (
              <Button
                onClick={() => setFilterOpen(true)}
                variant="secondary"
                className="h-11 gap-2 rounded-lg border border-[#d9d9d9] bg-white text-[#737373]"
              >
                <Image
                  src="/assets/figma/filter.svg"
                  alt="filter"
                  width={20}
                  height={20}
                />
                {t("filter")}
              </Button>
            ) : (
              <Button
                variant="secondary"
                className="h-11 gap-2 rounded-lg border border-[#d9d9d9] bg-white text-[#737373]"
              >
                <Image
                  src="/assets/figma/filter.svg"
                  alt="filter"
                  width={20}
                  height={20}
                />
                {t("filter")}
              </Button>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-6">
            <span className="text-[16px] font-medium text-[#363636]">
              {t("from")}: {fromDate}
            </span>
            <span className="text-[16px] font-medium text-[#363636]">
              {t("to")}: {toDate}
            </span>
          </div>
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-2 rounded-lg bg-[#363636] px-4 py-3 text-white transition-opacity hover:opacity-90"
          >
            <Image
              src="/assets/figma/share.svg"
              alt="share"
              width={20}
              height={20}
            />
            {t("export")}
          </button>
        </div>

        <div className="mt-4">
          <UserTable
            rows={filteredUsers}
            onRowClick={(r) => {
              setSelectedUserEmail(r.email);
              setDetailOpen(true);
            }}
          />
        </div>
      </section>

      {mounted && (
        <>
          <FilterSheet
            open={filterOpen}
            onOpenChange={setFilterOpen}
            type={filterType}
            setType={setFilterType}
            gender={gender}
            setGender={setGender}
            bottlesMin={bottlesMin}
            setBottlesMin={setBottlesMin}
            minAge={minAge}
            setMinAge={setMinAge}
            maxAge={maxAge}
            setMaxAge={setMaxAge}
            city={city}
            setCity={setCity}
            department={department}
            setDepartment={setDepartment}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortDir={sortDir}
            setSortDir={setSortDir}
          />

          <UserProfileSheet
            key={selectedUserEmail || "empty"}
            userEmail={selectedUserEmail}
            open={detailOpen}
            onOpenChange={setDetailOpen}
            onUserDeleted={(deletedEmail: string) => {
              setUsers((prev) => prev.filter((u) => u.email !== deletedEmail));
            }}
          />
        </>
      )}
    </Shell>
  );
}
