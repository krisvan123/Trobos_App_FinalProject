"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTrobosStore } from "@/store/useTrobosStore";
import { Navbar } from "@/components/navigation/Navbar";
import { DesktopSidebar } from "@/components/navigation/DesktopSidebar";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { DemoController } from "@/components/demo/DemoController";

export default function AppLayout({children}: {children: React.ReactNode}) {
  const pathname = usePathname();
  const home = pathname === "/app";
  const theme = useTrobosStore(s => s.theme);


  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Demo access remains guest-first; signed-in users can still save their
  // prototype data through Supabase when the backend is configured.
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
