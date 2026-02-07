"use client";

import Image from "next/image";
import { Shell } from "@/components/layout/Shell";
import { StatCard } from "@/components/cards/StatCard";
import { UserTable, UserRow } from "@/components/table/UserTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { format, subDays } from "date-fns";
import { FilterSheet } from "@/components/sheets/FilterSheet";
import { UserProfileSheet } from "@/components/sheets/UserProfileSheet";

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

  const fromDate = format(subDays(new Date(), 30), "MMM d, yyyy");
  const toDate = format(new Date(), "MMM d, yyyy");

  const filteredUsers = useMemo(() => {
    return initialUsers.filter((u) => {
      const matchesSearch = [u.name, u.email, u.id].some((field) =>
        field.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      const matchesType = filterType === "All" || u.type === filterType;
      const matchesBottles =
        bottlesMin === undefined || u.bottles >= bottlesMin;
      return matchesSearch && matchesType && matchesBottles;
    });
  }, [searchQuery, initialUsers, filterType, bottlesMin]);

  function exportCsv() {
    const header = [
      "ID Number",
      "Name",
      "Email Address",
      "Last Active",
      "Bottles Sent",
      "Type",
    ];
    const rows = filteredUsers.map((r) => [
      r.id,
      r.name,
      r.email,
      r.lastActive.toISOString(),
      String(r.bottles),
      r.type,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-dashboard-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const getTrendProps = (trend: number, value: number) => {
    const isUp = trend >= 0;
    // If trend is 0 but value > 0, it means we have data now but none before (if trend calc handles it)
    return {
      trendIcon: (isUp
        ? "/assets/figma/trending-up.svg"
        : "/assets/figma/trending-down.svg") as any,
      trendText: `${isUp ? "+" : ""}${trend}% (compared to last month)`,
    };
  };

  return (
    <Shell title="Dashboard" onHeaderSearch={setSearchQuery}>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.total.value.toLocaleString()}
          {...getTrendProps(stats.total.trend, stats.total.value)}
        />
        <StatCard
          title="Active Users"
          value={stats.active.value.toLocaleString()}
          {...getTrendProps(stats.active.trend, stats.active.value)}
        />
        <StatCard
          title="Bottles Sent"
          value={stats.bottles.value.toLocaleString()}
          {...getTrendProps(stats.bottles.trend, stats.bottles.value)}
        />
        <StatCard
          title="Premium Users"
          value={stats.premium.value.toLocaleString()}
          {...getTrendProps(stats.premium.trend, stats.premium.value)}
        />
      </section>

      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[24px] font-semibold text-[#363636]">Users</h2>
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
                placeholder="Search for users"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
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
              Filter
            </Button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-6">
            <span className="text-[16px] font-medium text-[#363636]">
              From: {fromDate}
            </span>
            <span className="text-[16px] font-medium text-[#363636]">
              To: {toDate}
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
            Export
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

      <FilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
        type={filterType}
        setType={setFilterType}
        bottlesMin={bottlesMin}
        setBottlesMin={setBottlesMin}
      />

      <UserProfileSheet
        userEmail={selectedUserEmail}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </Shell>
  );
}
