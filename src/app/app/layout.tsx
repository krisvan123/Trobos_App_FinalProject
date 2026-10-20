"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTrobosStore } from "@/store/useTrobosStore";
import { Navbar } from "@/components/navigation/Navbar";
import { DesktopSidebar } from "@/components/navigation/DesktopSidebar";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { DemoController } from "@/components/demo/DemoController";

export default function AppLayout({children}: {children: React.ReactNode}) {
  const router = useRouter();
  const pathname = usePathname();
  const home = pathname === "/app";
  const theme = useTrobosStore(s => s.theme);
  const [authorized, setAuthorized] = useState(!Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return;
    let mounted = true;
    fetch("/api/auth", { cache: "no-store" }).then(async response => {
      const data = await response.json().catch(() => ({}));
      if (!mounted) return;
      if (!response.ok || !data.authenticated) { router.replace("/login"); return; }
      useTrobosStore.getState().login(data.user?.email, data.user?.name);
      setAuthorized(true);
    }).catch(() => { if (mounted) router.replace("/login"); });
    return () => { mounted = false; };
  }, [router]);

  if (!authorized) return (
    <div className="min-h-[100dvh] grid place-items-center bg-[#F4F5F4] dark:bg-[#0F1822] text-[#273744] dark:text-white text-sm font-semibold">
      Memverifikasi sesi akun...
    </div>
  );

  return (
    <div className="trobos-shell">
      <div className="trobos-prototype-bar">
        <span className="trobos-prototype-pulse"/>
        TROBOS CONCEPT PREVIEW
        <span className="hidden sm:inline">· Peta asli, kendaraan & perjalanan adalah simulasi</span>
      </div>
      {!home && <Navbar />}
      <div className={"trobos-workspace " + (home ? "trobos-map-workspace" : "trobos-page-workspace")}>
        <DesktopSidebar/>
        <main className={"trobos-main " + (home ? "trobos-main-map" : "trobos-main-pages")}>
          {children}
        </main>
      </div>
      <DemoController/>
      <BottomNavigation/>
    </div>
  );
}
