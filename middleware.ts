import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n/config";
import { verifySession } from "./lib/session";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localeDetection: false,
});

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Exclude static resources and assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Determine current locale from URL
  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0] === "en" || segments[0] === "fr" ? segments[0] : defaultLocale;

  // Check session cookie
  const sessionCookie = request.cookies.get("admin_session")?.value;
  const email = sessionCookie ? await verifySession(sessionCookie) : null;
  const isAuthenticated = !!email;

  // Check if trying to access login page
  const isLoginPage =
    (segments.length === 1 && segments[0] === "login") ||
    (segments.length === 2 && (segments[0] === "en" || segments[0] === "fr") && segments[1] === "login");

  if (isAuthenticated) {
    // If authenticated and trying to access login page, redirect to dashboard root
    if (isLoginPage) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  } else {
    // If not authenticated and trying to access protected page, redirect to login page
    if (!isLoginPage) {
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
  }

  // Let intlMiddleware handle the localized paths
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(fr|en)/:path*"],
};

