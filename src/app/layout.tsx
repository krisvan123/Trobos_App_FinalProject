import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trobos — Terobos Macet, Selamatkan Waktu",
  description:
    "Layanan evakuasi mobilitas darurat dengan sistem Tandem: Rider motor membawa Anda menembus macet, Driver membawa mobil Anda sampai ke tujuan dengan aman.",
  keywords: [
    "Trobos",
    "Emergency Mobility",
    "Tandem Ride",
    "Anti Macet Jakarta",
    "Jasa Supir Mobil",
    "Ojek Darurat",
  ],
  authors: [{ name: "Trobos Mobility Team" }],
  openGraph: {
    title: "Trobos — Terobos Macet, Selamatkan Waktu",
    description: "Satu Ketukan. Dua Pengemudi. Satu Tujuan.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0A0F1D",
};

import { ThemeInitializer } from "@/components/common/ThemeInitializer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-orange-500 selection:text-white transition-colors">
        <ThemeInitializer />
        {children}
      </body>
    </html>
  );
}
