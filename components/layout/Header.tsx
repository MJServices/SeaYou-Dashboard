"use client";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Header({ title, onSearch, onToggleMobile, onToggleCollapsed, collapsed }: { title: string; onSearch?: (q: string) => void; onToggleMobile?: () => void; onToggleCollapsed?: () => void; collapsed?: boolean }) {
  return (
    <header className="w-full">
      <div className="bg-[#ffcc66] px-4 py-2 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button className="md:hidden" variant="secondary" onClick={onToggleMobile}>Menu</Button>
            <Button className="hidden md:inline-flex" variant="secondary" onClick={onToggleCollapsed}>{collapsed ? "Expand" : "Collapse"}</Button>
          </div>
          <span className="text-[#363636] text-sm font-medium">SeaYou Admin</span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 bg-white px-4 py-3 sm:px-6 sm:py-4">
        <h1 className="text-[20px] font-semibold text-[#363636] sm:text-[24px]">{title}</h1>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-10 w-[200px] items-center gap-2 rounded-lg border border-[#d9d9d9] px-3 sm:h-11 sm:w-[320px]">
            <Image src="/assets/figma/search-1.svg" alt="search" width={24} height={24} />
            <Input className="h-9 border-0 p-0 text-[#363636] sm:h-10" placeholder="Search for anything" onChange={(e) => onSearch?.(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 rounded-full bg-[#e5e5e5]" />
            <span className="hidden text-[16px] font-medium text-[#363636] sm:inline">admin@seayou.com</span>
          </div>
        </div>
      </div>
    </header>
  );
}