"use client";

import React from "react";
import { useTrobosStore } from "@/store/useTrobosStore";
import { AlertTriangle, ArrowRight, CarFront, Check, ClipboardCheck, Fuel, ShieldCheck, Truck } from "lucide-react";

const checks=[
  {key:"front" as const,label:"Bodi depan"},
  {key:"rear" as const,label:"Bodi belakang"},
  {key:"left" as const,label:"Sisi kiri"},
  {key:"right" as const,label:"Sisi kanan"},
  {key:"interior" as const,label:"Kabin & odometer"},
];

export function VehicleHandoverModal() {
  const trip=useTrobosStore(s=>s.currentTrip);
  const toggle=useTrobosStore(s=>s.toggleChecklistItem);
  const setFuel=useTrobosStore(s=>s.setHandoverFuel);
  const submit=useTrobosStore(s=>s.confirmVehicleHandover);
  if(!trip)return null;
  const handover=trip.handover;
  const checked=checks.filter(item=>handover[item.key]).length;
  const canContinue=checked===checks.length && handover.problemConfirmed;
  const isTandem=trip.serviceType==="TANDEM";
  return (
    <div className="fixed inset-x-0 bottom-0 sm:bottom-6 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40 w-full sm:max-w-md px-3 sm:px-4 pb-6 pt-2">
      <section className="trobos-journey-card tr-flow-stage tr-flow-handover">
        <div className="trobos-sheet-handle"/>
        <span className="tr-flow-eyebrow"><ClipboardCheck size={15}/> INSPEKSI KENDARAAN · DEMO</span>
        <div className="tr-flow-heading"><div>
          <h2>Periksa mobilmu.</h2><p>Lengkapi pemeriksaan simulasi sebelum melanjutkan dua perjalanan.</p>
        </div><span className="tr-flow-heading-icon"><CarFront size={24}/></span></div>
        <div className="tr-flow-car">
          <div className="tr-flow-car-icon"><CarFront size={24}/></div>
          <div><strong>{trip.vehicle.brand} {trip.vehicle.model}</strong><small>{trip.vehicle.color} · {trip.vehicle.year}</small></div>
          <span>{trip.vehicle.plate}</span>
        </div>
        <div className="tr-flow-dest">
          {isTandem ? <CarFront size={18}/> : <Truck size={18}/>}
          <div><small>{isTandem?"DRIVER MEMBAWA MOBIL KE":"TOWING KE BENGKEL CONTOH"}</small><strong>{trip.carDestination.name}</strong></div>
        </div>
        <div className="tr-flow-check-header"><strong>Checklist kondisi</strong><span>{checked} dari {checks.length} selesai</span></div>
        <div className="tr-flow-check-progress"><i style={{width:checked/checks.length*100+"%"}}/></div>
        <div className="tr-flow-check-grid">
          {checks.map(item=>(
            <button type="button" key={item.key} onClick={()=>toggle(item.key)}
              aria-pressed={handover[item.key]}
              className={"tr-flow-check-item "+(handover[item.key]?"is-checked":"")}>
              <span><Check size={15}/></span>{item.label}
            </button>
          ))}
        </div>
        <div className="tr-flow-fuel"><div><Fuel size={17}/><label htmlFor="tr-flow-fuel">BBM tercatat</label><strong>{handover.fuelRecorded}%</strong></div>
          <input type="range" id="tr-flow-fuel" min={0} max={100} value={handover.fuelRecorded} onChange={e=>setFuel(Number(e.target.value))}/>
        </div>
        <button type="button" onClick={()=>toggle("problemConfirmed")} aria-pressed={handover.problemConfirmed}
          className={"tr-flow-consent "+(handover.problemConfirmed?"is-checked":"")}>
          <span><Check size={15}/></span>
          <span>Saya memahami inspeksi ini hanya simulasi, tidak ada serah terima kepada operator nyata.</span>
        </button>
        <div className="tr-flow-note"><ShieldCheck size={17}/> Tidak ada operator atau polis asuransi aktif dalam prototipe.</div>
        <button type="button" onClick={submit} disabled={!canContinue} className="tr-flow-primary">
          {canContinue ? "Mulai perjalanan demo" : "Lengkapi checklist dahulu"}<ArrowRight size={18}/>
        </button>
      </section>
    </div>
  );
}
