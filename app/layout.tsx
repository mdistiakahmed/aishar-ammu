import type { Metadata } from "next";
import { Fraunces, Hind_Siliguri } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import { LanguageProvider } from "@/components/language-provider";
import "./globals.css";

const hind = Hind_Siliguri({
  variable: "--font-hind",
  subsets: ["latin", "bengali"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Aishar Ammu · আয়শার আম্মু",
  description: "Pregnancy, mother and baby care — গর্ভাবস্থা, মা ও শিশুর যত্ন",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="bn"
      data-locale="bn"
      className={`${hind.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <LanguageProvider>
          <AppShell>{children}</AppShell>
        </LanguageProvider>
      </body>
    </html>
  );
}
