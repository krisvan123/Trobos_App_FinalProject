"use client";

import React from "react";
import Link from "next/link";
import { Zap, Bell, Shield, Car, Sun, Moon, BookOpen } from "lucide-react";
import { useTrobosStore } from "@/store/useTrobosStore";
import { StatusBadge } from "@/components/common/StatusBadge";

export const Navbar: React.FC = () => {
  const user = useTrobosStore((s) => s.user);
  const currentTrip = useTrobosStore((s) => s.currentTrip);
  const notifications = useTrobosStore((s) => s.notifications);
  const theme = useTrobosStore((s) => s.theme);
  const toggleTheme = useTrobosStore((s) => s.toggleTheme);
  const setTutorialOpen = useTrobosStore((s) => s.setTutorialOpen);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/app" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FF4D00] flex items-center justify-center shadow-sm">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              TROBOS
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-950 text-[#FF4D00] dark:text-orange-400">
              RESCUE
            </span>
          </div>
        </Link>

        {/* Center Active Trip Status Badge */}
        {currentTrip && currentTrip.status !== "IDLE" && (
          <div className="hidden md:block">
            <StatusBadge status={currentTrip.status} size="sm" />
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Driver Mode Preview Link */}
          <Link
            href="/driver"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
          >
            <Car className="w-3.5 h-3.5 text-[#FF4D00]" />
            <span className="hidden sm:inline">Mode Driver</span>
            <span className="sm:hidden">Driver</span>
          </Link>

          {/* Tutorial / Onboarding Replay Button */}
          <button
            type="button"
            onClick={() => setTutorialOpen(true)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Panduan Layanan Trobos"
            aria-label="Panduan Layanan Trobos"
          >
            <BookOpen className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </button>

          {/* Theme Switcher Toggle (Light / Dark) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={theme === "dark" ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
            aria-label="Toggle Dark Mode"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Safety Quick Link */}
          <Link
            href="/app/safety"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Pusat Keamanan"
            aria-label="Pusat Keamanan"
          >
            <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </Link>

          {/* Notifications */}
          <Link
            href="/app/notifications"
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Notifikasi"
            aria-label="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF4D00]" />
            )}
          </Link>

          {/* User Profile Shortcut */}
          <Link
            href="/app/profile"
            className="p-1 rounded-full hover:ring-2 hover:ring-slate-200 dark:hover:ring-slate-700 transition"
            title="Profil Akun"
            aria-label="Profil Akun"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
          </Link>
        </div>
      </div>
    </header>
  );
};
