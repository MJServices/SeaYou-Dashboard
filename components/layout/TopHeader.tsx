"use client";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  onSearch?: (q: string) => void;
  onToggleMobile?: () => void;
  onToggleCollapsed?: () => void;
  email?: string;
};

export function TopHeader({ title, onSearch, onToggleMobile, onToggleCollapsed, email = "admin@seayou.com" }: Props) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full bg-[#ffcc66]">
      <div className="mx-auto flex h-16 max-w-full items-center justify-between gap-4 px-4 sm:px-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Button className="md:hidden" variant="secondary" onClick={onToggleMobile}>Menu</Button>
          <Button className="hidden md:inline-flex" variant="secondary" onClick={onToggleCollapsed}>Collapse</Button>
        </div>
        <h1 className="text-[20px] font-semibold text-[#363636] sm:text-[24px]">{title}</h1>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-11 w-[240px] items-center gap-2 rounded-lg border border-[#d9d9d9] bg-white px-3 sm:w-[320px]">
            <Image src="/assets/figma/search-1.svg" alt="search" width={24} height={24} />
            <Input className="h-10 border-0 bg-transparent p-0 text-[#363636] placeholder:text-[#737373]" placeholder="Search for anything" onChange={(e) => onSearch?.(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 rounded-full bg-[#e5e5e5]" />
            <span className="hidden text-[16px] font-medium text-[#363636] sm:inline">{email}</span>
          </div>
        </div>
      </div>
    </header>
  );
}