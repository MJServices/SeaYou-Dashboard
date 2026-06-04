"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { useRouter, useParams } from "next/navigation";
import { loginAction } from "@/lib/auth-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LoginPage() {
  const t = useTranslations("Login");
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string || "fr";

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setError(t("errorRequired"));
      return;
    }

    startTransition(async () => {
      const result = await loginAction(formData);
      if (result.success) {
        // Force refresh and redirect to locale dashboard root
        router.push(`/${locale}`);
        router.refresh();
      } else {
        if (result.errorType === "unauthorized") {
          setError(t("errorUnauthorized"));
        } else if (result.errorType === "invalid_credentials") {
          setError(t("errorInvalid"));
        } else if (result.errorType === "required") {
          setError(t("errorRequired"));
        } else {
          setError(result.errorMessage || t("errorInvalid"));
        }
      }
    });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070913] px-4 py-12 font-sans antialiased">
      {/* Decorative background glows */}
      <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-[#ffcc66]/8 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[700px] w-[700px] rounded-full bg-[#5c7cff]/8 blur-[150px] pointer-events-none" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-white/[0.12] hover:shadow-[#ffcc66]/5">
        <div className="flex flex-col items-center text-center">
          {/* Logo with clean styling */}
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-tr from-[#ffcc66]/20 to-[#ffcc66]/5 p-3 ring-1 ring-white/10">
            <Image
              src="/assets/figma/trending-up.svg"
              alt="logo"
              width={32}
              height={32}
              className="brightness-125"
            />
          </div>
          <h2 className="text-[28px] font-bold tracking-tight text-white">
            {t("title")}
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-400">
            {t("subtitle")}
          </p>
        </div>

        {/* Error Message with smooth collapse-in styling */}
        {error && (
          <div className="mt-6 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200 animate-in fade-in slide-in-from-top-1">
            <div className="flex gap-2 items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              {t("emailLabel")}
            </label>
            <div className="mt-1.5 relative">
              <Input
                type="email"
                name="email"
                disabled={isPending}
                required
                className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 text-white placeholder:text-slate-500 focus:border-[#ffcc66] focus:bg-white/[0.04] focus:ring-1 focus:ring-[#ffcc66]/20 transition-all duration-200 outline-none"
                placeholder={t("emailPlaceholder")}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              {t("passwordLabel")}
            </label>
            <div className="mt-1.5 relative">
              <Input
                type="password"
                name="password"
                disabled={isPending}
                required
                className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 text-white placeholder:text-slate-500 focus:border-[#ffcc66] focus:bg-white/[0.04] focus:ring-1 focus:ring-[#ffcc66]/20 transition-all duration-200 outline-none"
                placeholder={t("passwordPlaceholder")}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-[#ffcc66] font-semibold text-slate-900 transition-all duration-300 hover:bg-[#ffb84d] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 hover:shadow-lg hover:shadow-[#ffcc66]/10"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
                <span>{t("buttonLoading")}</span>
              </div>
            ) : (
              t("button")
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
