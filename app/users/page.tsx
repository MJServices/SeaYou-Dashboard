"use client";
import Image from "next/image";
import { Shell } from "@/components/layout/Shell";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { UserTable, UserRow } from "@/components/table/UserTable";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { ExportSheet } from "@/components/sheets/ExportSheet";
import { FilterSheet } from "@/components/sheets/FilterSheet";

const initialRows: UserRow[] = [
  { id: "#100000A", name: "Alex John", email: "alexjohn19@gmail.com", lastActive: new Date(Date.now() - 2 * 60 * 1000), bottles: 23, type: "Basic" },
  { id: "#100000B", name: "Mary James", email: "maryjames91@gmail.com", lastActive: new Date(Date.now() - 12 * 60 * 1000), bottles: 10, type: "Premium" },
  { id: "#100000C", name: "Tom Hardy", email: "tomhardy22@gmail.com", lastActive: new Date(Date.now() - 60 * 60 * 1000), bottles: 18, type: "Basic" },
  { id: "#100000D", name: "Jane Doe", email: "jdoe@mail.com", lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), bottles: 45, type: "Premium" },
];

export default function UsersPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"All" | "Basic" | "Premium">("All");
  const [from, setFrom] = useState<Date | undefined>();
  const [to, setTo] = useState<Date | undefined>();
  const [bottlesMin, setBottlesMin] = useState<number | undefined>();
  const [exportOpen, setExportOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    return initialRows.filter((r) => {
      const matchesQuery = [r.id, r.name, r.email].some((s) => s.toLowerCase().includes(query.toLowerCase()));
      const matchesType = type === "All" ? true : r.type === type;
      const afterFrom = from ? r.lastActive >= from : true;
      const beforeTo = to ? r.lastActive <= to : true;
      const meetsBottles = bottlesMin !== undefined ? r.bottles >= bottlesMin : true;
      return matchesQuery && matchesType && afterFrom && beforeTo && meetsBottles;
    });
  }, [query, type, from, to, bottlesMin]);

  function exportCsv() {
    const header = ["ID Number", "Name", "Email Address", "Last Active", "Bottles Sent", "Type"]; 
    const rows = filtered.map((r) => [r.id, r.name, r.email, r.lastActive.toISOString(), String(r.bottles), r.type]);
    const csv = [header, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Shell title="Users" onHeaderSearch={setQuery}>
      <div className="flex items-center justify-between">
              <div className="flex h-11 w-[320px] items-center gap-2 rounded-lg border border-[#d9d9d9] px-3">
                <Image src="/assets/figma/search-2.svg" alt="search" width={24} height={24} />
                <Input className="h-10 border-0 p-0 text-[#363636]" placeholder="Search for users" onChange={(e) => setQuery(e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" className="h-11 gap-2 rounded-lg border border-[#d9d9d9] bg-white text-[#737373]">
                      <Image src="/assets/figma/filter.svg" alt="filter" width={20} height={20} />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[200px]">
                    <DropdownMenuItem onClick={() => setType("All")}>Type: All</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setType("Basic")}>Type: Basic</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setType("Premium")}>Type: Premium</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterOpen(true)}>Advanced…</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button className="inline-flex items-center gap-2 rounded-lg bg-[#363636] px-4 py-3 text-white" onClick={() => setExportOpen(true)}>
                  <Image src="/assets/figma/share.svg" alt="share" width={20} height={20} />
                  Export
                </Button>
              </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-6">
                <Popover>
                  <PopoverTrigger className="text-[16px] font-medium text-[#363636]">From: {from ? from.toLocaleDateString() : "Select"}</PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Calendar mode="single" selected={from} onSelect={setFrom} />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger className="text-[16px] font-medium text-[#363636]">To: {to ? to.toLocaleDateString() : "Select"}</PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Calendar mode="single" selected={to} onSelect={setTo} />
                  </PopoverContent>
                </Popover>
              </div>
              <Button className="inline-flex items-center gap-2 rounded-lg bg-[#363636] px-4 py-3 text-white" onClick={() => setExportOpen(true)}>
                <Image src="/assets/figma/share.svg" alt="share" width={20} height={20} />
                Export
              </Button>
            </div>
      <div className="mt-4">
        <UserTable rows={filtered} />
      </div>
      <ExportSheet open={exportOpen} onOpenChange={setExportOpen} onConfirm={() => { setExportOpen(false); exportCsv(); }} />
      <FilterSheet open={filterOpen} onOpenChange={setFilterOpen} type={type} setType={setType} bottlesMin={bottlesMin} setBottlesMin={setBottlesMin} />
    </Shell>
  );
}