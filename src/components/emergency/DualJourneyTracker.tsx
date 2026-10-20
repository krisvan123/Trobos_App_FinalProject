"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTrobosStore } from "@/store/useTrobosStore";
import { Bike, CarFront, ChevronDown, Check, CircleHelp, FastForward, MessageCircle, Route, Share2, Truck, Users } from "lucide-react";

export function DualJourneyTracker() {
  const currentTrip = useTrobosStore(s => s.currentTrip);
  const setChatOpen = useTrobosStore(s => s.setChatOpen);
  const skipPassenger = useTrobosStore(s => s.userArrivedAtDest);
  const skipCar = useTrobosStore(s => s.carArrivedAtDest);
  const mapFocus = useTrobosStore(s => s.mapFocus);
  const setMapFocus = useTrobosStore(s => s.setMapFocus);
  const [notice, setNotice] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  if (!currentTrip) return null;
  const p = Math.min(100, Math.max(0, currentTrip.userProgressPercent ?? 0));
  const c = Math.min(100, Math.max(0, currentTrip.carProgressPercent ?? 0));
  const passengerDone = currentTrip.status === "USER_ARRIVED" || currentTrip.status === "COMPLETED" || p === 100;
  const carDone = currentTrip.status === "VEHICLE_ARRIVED" || currentTrip.status === "COMPLETED" || c === 100;
  const transport = currentTrip.passengerTransport;
  const isTandem = currentTrip.serviceType === "TANDEM";

  return (
    <div className="fixed inset-x-0 bottom-0 sm:bottom-6 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40 w-full sm:max-w-md px-3 sm:px-4 pb-6 pt-2">
      <section className="trobos-journey-card" aria-label="Simulasi dua perjalanan">
        <div className="trobos-sheet-handle" aria-hidden="true"/>
        <div className="trobos-sheet-top">
          <div>
            <span className="trobos-sheet-eyebrow"><span className="trobos-status-dot"/> LIVE ANIMATION · DEMO</span>
            <h2>Perjalanan berlangsung.</h2>
            <p>Ketuk kendaraan untuk mengikuti posisinya di peta.</p>
          </div>
          <span className="trobos-stage-icon"><Route size={23}/></span>
        </div>
        <div className="trobos-journey-rows">
          <button type="button" onClick={() => setMapFocus("passenger")}
            aria-pressed={mapFocus === "passenger"}
            aria-label="Fokuskan peta ke kendaraan penumpang"
            className={"trobos-journey-row trobos-focus-row " + (mapFocus === "passenger" ? "is-following" : "")}>
            <div className="trobos-journey-symbol sky">{transport.type === "MOTOR" ? <Bike size={22}/> : <CarFront size={22}/>}</div>
            <div className="trobos-journey-info">
              <div className="trobos-journey-title"><strong>Anda & penumpang</strong><span>{mapFocus === "passenger" ? "● Ikuti" : passengerDone ? "Tiba" : p + "%"}</span></div>
              <p>{currentTrip.destination.name}</p>
              <div className="trobos-progress-track"><i style={{width:p + "%",background:"#367EAB"}}/></div>
            </div>
          </button>
          <button type="button" onClick={() => setMapFocus("tow")}
            aria-pressed={mapFocus === "tow"}
            aria-label={isTandem ? "Fokuskan peta ke mobil pelanggan" : "Fokuskan peta ke kendaraan towing"}
            className={"trobos-journey-row trobos-focus-row " + (mapFocus === "tow" ? "is-following" : "")}>
            <div className="trobos-journey-symbol copper">{isTandem ? <CarFront size={22}/> : <Truck size={22}/>}</div>
            <div className="trobos-journey-info">
              <div className="trobos-journey-title"><strong>{isTandem ? "Mobil & driver" : "Mobil & towing"}</strong><span>{mapFocus === "tow" ? "● Ikuti" : carDone ? "Tiba" : c + "%"}</span></div>
              <p>{currentTrip.carDestination.name}</p>
              <div className="trobos-progress-track"><i style={{width:c + "%",background:"#C27651"}}/></div>
            </div>
          </button>
        </div>
        <div className="tr-trip-skip-grid" role="group" aria-label="Kontrol lewati animasi perjalanan">
          <button type="button" onClick={() => {
            skipPassenger();
            if (!carDone) setMapFocus("tow");
          }} disabled={passengerDone}
            aria-label="Lewati animasi perjalanan penumpang sampai tujuan">
            {passengerDone ? <Check size={16}/> : <FastForward size={16}/>}
            <span>{passengerDone ? "Penumpang tiba" : "Skip penumpang"}</span>
          </button>
          <button type="button" onClick={() => {
            skipCar();
            if (!passengerDone) setMapFocus("passenger");
          }} disabled={carDone}
            aria-label={isTandem ? "Lewati animasi mobil pelanggan sampai tujuan" : "Lewati animasi towing hingga bengkel"}>
            {carDone ? <Check size={16}/> : <FastForward size={16}/>}
            <span>{carDone ? (isTandem ? "Mobil tiba" : "Derek tiba") : (isTandem ? "Skip mobil" : "Skip derek")}</span>
          </button>
        </div>
        <div className="trobos-journey-meta">
          <span><Users size={15}/> {currentTrip.passengerCount} penumpang</span>
          <span><Check size={15}/> Status demo</span>
        </div>
        <button type="button" className="tr-journey-expand" aria-expanded={detailsOpen}
          onClick={()=>setDetailsOpen(open=>!open)}>
          <span>{detailsOpen ? "Sembunyikan opsi" : "Chat, bantuan & info perjalanan"}</span>
          <ChevronDown size={16} className={detailsOpen ? "rotate-180" : ""}/>
        </button>
        {detailsOpen && (
          <div className="tr-journey-extra">
            {notice && <p role="status" className="trobos-stage-notice">{notice}</p>}
            <div className="trobos-stage-actions">
              <button type="button" onClick={() => setChatOpen(true)}><MessageCircle size={17}/> Chat demo</button>
              <button type="button" onClick={() => setNotice("Live tracking belum tersedia karena posisi kendaraan merupakan animasi demo.")}><Share2 size={17}/> Bagikan</button>
              <Link href="/app/help"><CircleHelp size={17}/> Bantuan</Link>
            </div>
            <p className="trobos-legal-note">Progres bergerak otomatis dan tidak berasal dari GPS driver sungguhan. Kamu bisa melewati animasi masing-masing kendaraan tanpa menghentikan kendaraan lainnya.</p>
          </div>
        )}
      </section>
    </div>
  );
}
