"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Clock3, CarFront, ShieldCheck, CircleHelp, Bell, UserRound, Zap, LogOut, Sun, Moon } from "lucide-react";
import { useTrobosStore } from "@/store/useTrobosStore";
import { LogoutConfirmModal } from "@/components/common/LogoutConfirmModal";

const sections = [
  {href: "/app", label: "Beranda", icon: House},
  {href: "/app/trips", label: "Riwayat", icon: Clock3},
  {href: "/app/vehicles", label: "Kendaraan", icon: CarFront},
  {href: "/app/safety", label: "Keamanan", icon: ShieldCheck},
  {href: "/app/notifications", label: "Notifikasi", icon: Bell},
  {href: "/app/profile", label: "Akun", icon: UserRound},
  {href: "/app/help", label: "Bantuan", icon: CircleHelp},
];

export function DesktopSidebar() {
  const pathname = usePathname();
  const theme = useTrobosStore(s => s.theme);
  const toggleTheme = useTrobosStore(s => s.toggleTheme);
  const [logoutOpen, setLogoutOpen] = useState(false);
  return (
    <>
      <aside className="trobos-desktop-rail" aria-label="Navigasi utama desktop">
        <Link href="/app" aria-label="TROBOS Beranda" className="trobos-rail-logo"><Zap size={22} strokeWidth={2.8}/></Link>
        <nav aria-label="Menu aplikasi">
          {sections.map(({href,label,icon:Icon}) => (
            <Link key={href} href={href} aria-label={label} title={label}
              aria-current={pathname === href ? "page" : undefined}
              className={"trobos-rail-link " + (pathname === href ? "is-active" : "")}>
              <Icon size={20} strokeWidth={1.85}/>
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="trobos-rail-end">
          <button type="button" className="trobos-rail-link" onClick={toggleTheme}
            title={theme === "dark" ? "Mode terang" : "Mode gelap"} aria-label="Ganti tema">
            {theme === "dark" ? <Sun size={20}/> : <Moon size={20}/>}
          </button>
          <button type="button" onClick={() => setLogoutOpen(true)} className="trobos-rail-link"
            title="Keluar" aria-label="Keluar"><LogOut size={20}/></button>
        </div>
      </aside>
      <LogoutConfirmModal isOpen={logoutOpen} onClose={() => setLogoutOpen(false)}/>
    </>
  );
}
