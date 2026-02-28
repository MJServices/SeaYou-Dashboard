"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = locale === "en" ? "fr" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLocale}
      className="bg-white border-[#d9d9d9] text-[#363636] font-semibold uppercase"
    >
      {locale === "en" ? "FR" : "EN"}
    </Button>
  );
}
