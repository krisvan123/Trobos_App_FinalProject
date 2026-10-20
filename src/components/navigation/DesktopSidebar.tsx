"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Clock,
  Car,
  ShieldCheck,
  HelpCircle,
  Bell,
  User,
  Zap,
  LogOut,
  Settings,
} from "lucide-react";
import { useTrobosStore } from "@/store/useTrobosStore";
import { cn } from "@/lib/utils";
import { LogoutConfirmModal } from "@/components/common/LogoutConfirmModal";

export const DesktopSidebar: React.FC = () => {
  const pathname = usePathname();
  const startBooking = useTrobosStore((s) => s.startBooking);
  const user = useTrobosStore((s) => s.user);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const mainLinks = [
    { href: "/app", label: "Beranda", icon: Home },
    { href: "/app/trips", label: "Riwayat", icon: Clock },
    { href: "/app/safety", label: "Keamanan", icon: ShieldCheck },
    { href: "/app/vehicles", label: "Kendaraan", icon: Car },
    { href: "/app/notifications", label: "Notifikasi", icon: Bell },
    { href: "/app/profile", label: "Profil", icon: User },
    { href: "/app/help", label: "Bantuan", icon: HelpCircle },
  ];

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-[calc(100vh-4rem)] sticky top-16 shrink-0 justify-between p-4 overflow-y-auto transition-colors">
        <div className="space-y-4">
          {/* User Snapshot */}
          <Link
            href="/app/profile"
            className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 transition group"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-[#FF4D00] transition-colors">
                {user.name}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.phone}</p>
            </div>
          </Link>

          {/* Quick CTA */}
          <button
            onClick={() => startBooking()}
            className="w-full bg-[#FF4D00] hover:bg-[#E64500] text-white p-3 rounded-xl shadow-sm font-bold text-xs flex items-center justify-center gap-2 transition active:scale-[0.99]"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>MINTA BANTUAN</span>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {mainLinks.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors",
                    isActive
                      ? "bg-slate-900 dark:bg-slate-800 text-white"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-[#FF4D00]" : "text-slate-400 dark:text-slate-500")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions: Logout */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Keluar</span>
          </button>

          <div className="text-[10px] text-slate-400 dark:text-slate-500 text-center">
            Trobos Mobility • v1.2 Prototype
          </div>
        </div>
      </aside>

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
};
