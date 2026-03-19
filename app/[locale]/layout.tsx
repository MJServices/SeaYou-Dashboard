import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SeaYou Admin",
  description: "SeaYou admin panel",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${montserrat.variable} font-sans antialiased`} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages} now={new Date(1773945000000)}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
