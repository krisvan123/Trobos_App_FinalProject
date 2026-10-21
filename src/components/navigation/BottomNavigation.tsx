"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Clock3, CarFront, ShieldCheck, UserRound } from "lucide-react";
import { useTrobosStore } from "@/store/useTrobosStore";

const links = [
  {href:"/app",label:"Beranda",icon:House},
  {href:"/app/trips",label:"Aktivitas",icon:Clock3},
  {href:"/app/vehicles",label:"Kendaraan",icon:CarFront},
  {href:"/app/safety",label:"Keamanan",icon:ShieldCheck},
  {href:"/app/profile",label:"Akun",icon:UserRound},
];

export function BottomNavigation() {
  const pathname = usePathname();
  const currentTrip = useTrobosStore(s => s.currentTrip);
  return (
    <nav aria-label="Navigasi aplikasi" className="trobos-bottom-nav">
      <div className="trobos-bottom-nav-inner">
        {links.map(({href,label,icon:Icon}) => {
          const visibleLabel = href === "/app" ? (currentTrip && currentTrip.status !== "REQUESTED" && currentTrip.status !== "IDLE" ? "Tracking" : "Pesan") : label;
          return <Link key={href} href={href} aria-label={visibleLabel}
            aria-current={pathname === href ? "page" : undefined}
            className={"trobos-bottom-link " + (pathname === href ? "is-active" : "")}>
            <span className="trobos-bottom-link-icon"><Icon size={21} strokeWidth={pathname === href ? 2.4 : 1.7}/>
              {href === "/app" && currentTrip && currentTrip.status !== "COMPLETED" &&
                <i className="trobos-active-notice" aria-label="Perjalanan berlangsung"/>}
            </span>
            <span>{visibleLabel}</span>
          </Link>;
        })}
      </div>
    </nav>
  );
}
