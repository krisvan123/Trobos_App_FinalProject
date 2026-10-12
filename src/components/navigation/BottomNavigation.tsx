"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Clock, ShieldCheck, User } from "lucide-react";
import { useTrobosStore } from "@/store/useTrobosStore";
import { cn } from "@/lib/utils";

export const BottomNavigation: React.FC = () => {
  const pathname = usePathname();
  const currentTrip = useTrobosStore((s) => s.currentTrip);

  const navItems = [
    { href: "/app", label: "Home", icon: Home },
    { href: "/app/trips", label: "Trips", icon: Clock },
    { href: "/app/safety", label: "Safety", icon: ShieldCheck },
    { href: "/app/profile", label: "Profile", icon: User },
  ];

  const isTripActive =
    currentTrip &&
    currentTrip.status !== "IDLE" &&
    currentTrip.status !== "COMPLETED";

  return (
    <nav
      aria-label="Navigasi Bawah"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-sm md:hidden pb-safe transition-colors"
    >
      <div className="flex items-center justify-around px-2 py-1.5 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-colors min-w-[64px]",
                isActive
                  ? "text-[#FF4D00] font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium"
              )}
            >
              <div className="relative">
                <Icon className={cn("w-5 h-5", isActive ? "stroke-[2.2]" : "stroke-[1.7]")} />
                {item.label === "Home" && isTripActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#FF4D00]" />
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
