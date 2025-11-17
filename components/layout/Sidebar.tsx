"use client";
import Link from "next/link";
import Image from "next/image";

const items = [
  { href: "/", label: "Dashboard" },
  { href: "/users", label: "Users" },
];

export function Sidebar({ collapsed, mobileOpen, onClose }: { collapsed?: boolean; mobileOpen?: boolean; onClose?: () => void }) {
  const content = (
    <div className="flex min-h-screen flex-col border-r border-[#e5e5e5] bg-white">
      <div className="px-6 py-6">
        <div className="flex items-center gap-2">
          <Image src="/assets/figma/trending-up.svg" alt="logo" width={24} height={24} />
          {!collapsed && <span className="text-[#363636] text-lg font-semibold">SeaYou Admin</span>}
        </div>
      </div>
      <nav className="px-2">
        {items.map((i) => (
          <Link key={i.href} href={i.href} className="block rounded-lg px-4 py-2 text-[#363636] hover:bg-[#f5f5f5]">
            {collapsed ? <span className="sr-only">{i.label}</span> : i.label}
          </Link>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      <aside className={`hidden md:flex ${collapsed ? "md:w-20" : "md:w-64"} sticky top-0`}>{content}</aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={onClose} />
          <div className="relative h-full w-[256px] bg-white shadow-lg">
            <div className="flex items-center justify-between px-4 py-4 border-b border-[#e5e5e5]">
              <div className="flex items-center gap-2">
                <Image src="/assets/figma/trending-up.svg" alt="logo" width={24} height={24} />
                <span className="text-[#363636] text-lg font-semibold">SeaYou Admin</span>
              </div>
              <button className="rounded-lg border border-[#d9d9d9] px-3 py-1 text-[#363636]" onClick={onClose}>Close</button>
            </div>
            <nav className="px-2 py-2">
              {items.map((i) => (
                <Link key={i.href} href={i.href} className="block rounded-lg px-4 py-2 text-[#363636] hover:bg-[#f5f5f5]" onClick={onClose}>
                  {i.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}