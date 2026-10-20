"use client";

import React, { useEffect } from "react";
import { useTrobosStore } from "@/store/useTrobosStore";
import { RadioTower, Search, Truck, Bike, X } from "lucide-react";

export function FindingTandemModal() {
  const resetToIdle = useTrobosStore(s => s.resetToIdle);
  const assignTandem = useTrobosStore(s => s.assignTandem);
  useEffect(() => {
    const timer = window.setTimeout(assignTandem, 3500);
    return () => window.clearTimeout(timer);
  }, [assignTandem]);

  return (
    <div className="fixed inset-x-0 bottom-0 sm:bottom-6 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40 w-full sm:max-w-md px-3 sm:px-4 pb-6 pt-2">
      <section className="trobos-journey-card" aria-live="polite">
        <div className="trobos-sheet-handle" aria-hidden="true"/>
        <div className="trobos-search-visual">
          <div className="trobos-radar-ring one"/><div className="trobos-radar-ring two"/>
          <div className="trobos-radar-center"><Search size={25}/></div>
          <span className="trobos-search-bike"><Bike size={17}/></span>
          <span className="trobos-search-truck"><Truck size={17}/></span>
        </div>
        <div className="trobos-search-copy">
          <span className="trobos-sheet-eyebrow"><RadioTower size={13}/> DISPATCH SIMULATION</span>
          <h2>Mencari unit terbaik.</h2>
          <p>Kami sedang memperagakan pencarian motor penjemput dan armada untuk mobil Anda.</p>
          <div className="trobos-search-loader"><i/><i/><i/></div>
        </div>
        <div className="trobos-journey-meta">
          <span><Bike size={15}/> Penjemput</span><span><Truck size={15}/> Rescue</span>
        </div>
        <button type="button" onClick={resetToIdle} className="trobos-cancel-search"><X size={16}/> Batalkan simulasi</button>
        <p className="trobos-legal-note">Tidak ada permintaan yang dikirim kepada driver sungguhan.</p>
      </section>
    </div>
  );
}
