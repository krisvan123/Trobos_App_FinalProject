"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTrobosStore } from "@/store/useTrobosStore";
import { Navbar } from "@/components/navigation/Navbar";
import { DesktopSidebar } from "@/components/navigation/DesktopSidebar";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { DemoController } from "@/components/demo/DemoController";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(!Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return;
    let mounted = true;
    fetch("/api/auth", { cache: "no-store" }).then(async (response) => {
      const data = await response.json().catch(() => ({}));
      if (!mounted) return;
      if (!response.ok || !data.authenticated) {
        router.replace("/login");
        return;
      }
      useTrobosStore.getState().login(data.user?.email, data.user?.name);
      setAuthorized(true);
    }).catch(() => {
      if (mounted) router.replace("/login");
    });
    return () => { mounted = false; };
  }, [router]);
  if (!authorized) return <div className="min-h-screen grid place-items-center bg-slate-50 text-slate-700 text-sm font-semibold">Memverifikasi sesi akun...</div>;
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Academic prototype transparency */}
      <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2 text-center text-xs font-semibold">Prototipe akademik — armada, tracking, pembayaran, dan asuransi merupakan simulasi.</div>
      {/* Top Header */}
      <Navbar />

      {/* Main Container */}
      <div className="flex flex-1 relative max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <DesktopSidebar />

        {/* Content Area */}
        <main className="flex-1 flex flex-col relative w-full overflow-hidden pb-16 md:pb-0">
          {children}
        </main>
      </div>

      {/* Discreet Simulation Controller */}
      <DemoController />

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
