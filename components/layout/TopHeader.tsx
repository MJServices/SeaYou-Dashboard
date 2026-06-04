"use client";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { logoutAction } from "@/lib/auth-actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  title: string;
  onSearch?: (q: string) => void;
  onToggleMobile?: () => void;
  onToggleCollapsed?: () => void;
  email?: string;
};

export function TopHeader({ title, onSearch, onToggleMobile, onToggleCollapsed, email: emailProp }: Props) {
  const t = useTranslations("Header");
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string || "fr";
  
  const [userEmail, setUserEmail] = useState(emailProp || "admin@seayou.com");

  useEffect(() => {
    try {
      const cookies = document.cookie.split("; ");
      const sessionCookie = cookies.find((row) => row.startsWith("admin_session="));
      if (sessionCookie) {
        const token = sessionCookie.split("=")[1];
        const parts = token.split(".");
        if (parts.length > 0) {
          const payload = JSON.parse(atob(parts[0]));
          if (payload.email) {
            setUserEmail(payload.email);
          }
        }
      }
    } catch (e) {
      // Ignore errors parsing cookie
    }
  }, []);

  const handleLogout = async () => {
    await logoutAction();
    router.push(`/${locale}/login`);
    router.refresh();
  };

  const initials = userEmail.substring(0, 2).toUpperCase();

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full bg-[#ffcc66]">
      <div className="mx-auto flex h-16 max-w-full items-center justify-between gap-4 px-4 sm:px-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Button className="md:hidden" variant="secondary" onClick={onToggleMobile}>{t("menu")}</Button>
          <Button className="hidden md:inline-flex" variant="secondary" onClick={onToggleCollapsed}>{t("collapse")}</Button>
        </div>
        <h1 className="text-[20px] font-semibold text-[#363636] sm:text-[24px]">{title}</h1>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-11 w-[240px] items-center gap-2 rounded-lg border border-[#d9d9d9] bg-white px-3 sm:w-[320px]">
            <Image src="/assets/figma/search-1.svg" alt="search" width={24} height={24} />
            <Input className="h-10 border-0 bg-transparent p-0 text-[#363636] placeholder:text-[#737373]" placeholder={t("searchPlaceholder")} onChange={(e) => onSearch?.(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 sm:gap-3 focus:outline-none cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-black/5">
                  <div className="h-8 w-8 rounded-full bg-white/40 flex items-center justify-center font-bold text-[#363636] border border-black/10 text-xs">
                    {initials}
                  </div>
                  <span className="hidden text-[16px] font-medium text-[#363636] sm:inline">{userEmail}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-1 border border-[#d9d9d9] bg-white rounded-xl shadow-lg p-1.5">
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:bg-red-50 focus:bg-red-50 hover:text-red-700 cursor-pointer rounded-lg font-medium py-2 px-3">
                  {locale === "en" ? "Sign Out" : "Se déconnecter"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}