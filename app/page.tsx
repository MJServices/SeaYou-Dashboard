import Image from "next/image";
import { Shell } from "@/components/layout/Shell";
import { StatCard } from "@/components/cards/StatCard";
import { UserTable, UserRow } from "@/components/table/UserTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const rows: UserRow[] = [
    { id: "#100000A", name: "Alex John", email: "alexjohn19@gmail.com", lastActive: new Date(Date.now() - 2 * 60 * 1000), bottles: 23, type: "Basic" },
    { id: "#100000B", name: "Mary James", email: "maryjames91@gmail.com", lastActive: new Date(Date.now() - 12 * 60 * 1000), bottles: 10, type: "Premium" },
    { id: "#100000C", name: "Tom Hardy", email: "tomhardy22@gmail.com", lastActive: new Date(Date.now() - 60 * 60 * 1000), bottles: 18, type: "Basic" },
  ];
  return (
    <Shell title="Dashboard">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Total Users" value="4,800" trendIcon="/assets/figma/trending-up.svg" trendText="+2% (compared to last month)" />
              <StatCard title="Active Users" value="805" trendIcon="/assets/figma/trending-down.svg" trendText="-1% (compared to last month)" />
              <StatCard title="Bottles Sent" value="5,108" trendIcon="/assets/figma/trending-up.svg" trendText="+9% (compared to last month)" />
              <StatCard title="Premium Users" value="200" trendIcon="/assets/figma/trending-down.svg" trendText="-3% (compared to last month)" />
      </section>

      <section className="mt-6">
        <div className="flex items-center justify-between">
                <h2 className="text-[24px] font-semibold text-[#363636]">Users</h2>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-[320px] items-center gap-2 rounded-lg border border-[#d9d9d9] px-3">
                    <Image src="/assets/figma/search-2.svg" alt="search" width={24} height={24} />
                    <Input className="h-10 border-0 p-0 text-[#363636]" placeholder="Search for users" />
                  </div>
                  <Button variant="secondary" className="h-11 gap-2 rounded-lg border border-[#d9d9d9] bg-white text-[#737373]">
                    <Image src="/assets/figma/filter.svg" alt="filter" width={20} height={20} />
                    Filter
                  </Button>
                </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-6">
            <span className="text-[16px] font-medium text-[#363636]">From: Jan 12, 2025</span>
            <span className="text-[16px] font-medium text-[#363636]">To: Feb 12, 2025</span>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg bg-[#363636] px-4 py-3 text-white">
            <Image src="/assets/figma/share.svg" alt="share" width={20} height={20} />
            Export
          </button>
        </div>

        <div className="mt-4">
          <UserTable rows={rows} />
        </div>
      </section>
    </Shell>
  );
}
