"use client";

import React, { useState } from "react";
import { useTrobosStore } from "@/store/useTrobosStore";
import type { TripStatus } from "@/types/trobos";
import { ChevronDown, ChevronUp, Play, RotateCcw, Sparkles, Square, X } from "lucide-react";

const phases: { status: TripStatus; label: string }[] = [
  {status:"IDLE",label:"Beranda"},
  {status:"REQUESTED",label:"Form pemesanan"},
  {status:"SEARCHING_TANDEM",label:"Mencari unit"},
  {status:"TANDEM_ASSIGNED",label:"Armada ditemukan"},
  {status:"TANDEM_APPROACHING",label:"Motor menuju pickup"},
  {status:"TANDEM_ARRIVED",label:"Unit tiba"},
  {status:"VEHICLE_HANDOVER",label:"Inspeksi mobil"},
  {status:"TRIP_STARTED",label:"Dua kendaraan bergerak"},
  {status:"USER_ARRIVED",label:"Penumpang tiba"},
  {status:"COMPLETED",label:"Perjalanan selesai"},
];

export function DemoController() {
  const [open,setOpen] = useState(false);
  const currentTrip = useTrobosStore(s => s.currentTrip);
  const playing = useTrobosStore(s => s.isDemoRunning);
  const run = useTrobosStore(s => s.runAutoSimulation);
  const stop = useTrobosStore(s => s.stopAutoSimulation);
  const jump = useTrobosStore(s => s.jumpToState);
  const reset = useTrobosStore(s => s.resetToIdle);
  const currentStatus = currentTrip?.status || "IDLE";

  return (
    <aside className="trobos-studio" aria-label="Pengendali simulasi lanjutan">
      {open && (
        <div className="trobos-studio-panel">
          <div className="trobos-studio-top">
            <div><span className="trobos-overline">DEVELOPER PREVIEW</span><h2>Demo Studio</h2></div>
            <button onClick={()=>setOpen(false)} aria-label="Tutup demo studio"><X size={19}/></button>
          </div>
          <p>Pratinjau alur perjalanan dengan data ilustrasi. Tidak menghubungkan armada sungguhan.</p>
          <button onClick={playing?stop:run} className="trobos-studio-play">
            {playing?<Square size={16}/>:<Play size={16} fill="currentColor"/>}
            {playing?"Hentikan simulasi":"Putar semua tahap"}
          </button>
          <div className="trobos-studio-phase-head">
            <span>Lompat ke tahap</span>
            <button onClick={reset}><RotateCcw size={15}/> Reset</button>
          </div>
          <div className="trobos-studio-phases">
            {phases.map(({status,label},i)=>(
              <button key={status} type="button" onClick={()=>jump(status)} aria-current={currentStatus===status?"step":undefined}
                className={"trobos-studio-phase "+(currentStatus===status?"is-active":"")}>
                <span>{String(i).padStart(2,"0")}</span>{label}
              </button>
            ))}
          </div>
        </div>
      )}
      <button type="button" onClick={()=>setOpen(!open)} className="trobos-studio-trigger" aria-expanded={open}>
        <Sparkles size={17}/> Demo Studio {open?<ChevronDown size={15}/>:<ChevronUp size={15}/>}
      </button>
    </aside>
  );
}
