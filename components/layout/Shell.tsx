"use client";
import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";

type Props = {
  title: string;
  onHeaderSearch?: (q: string) => void;
  children: React.ReactNode;
};

export function Shell({ title, onHeaderSearch, children }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <TopHeader
        title={title}
        onSearch={onHeaderSearch}
        onToggleMobile={() => setMobileOpen((v) => !v)}
        onToggleCollapsed={() => setCollapsed((v) => !v)}
      />
      <div className={`grid pt-16 ${collapsed ? "md:grid-cols-[80px_1fr]" : "md:grid-cols-[256px_1fr]"}`}>
        <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <main className="px-6 py-4">{children}</main>
      </div>
    </div>
  );
}