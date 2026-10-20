"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTrobosStore } from "@/store/useTrobosStore";
import { ArrowRight, Bike, CarFront, Check, CircleHelp, MessageCircle, Route, Share2, Truck, Users } from "lucide-react";

export function DualJourneyTracker() {
  const currentTrip = useTrobosStore(s => s.currentTrip);
  const userArrivedAtDest = useTrobosStore(s => s.userArrivedAtDest);
  const carArrivedAtDest = useTrobosStore(s => s.carArrivedAtDest);
  const setChatOpen = useTrobosStore(s => s.setChatOpen);
  const [notice, setNotice] = useState("");
  if (!currentTrip) return null;
  const p = Math.min(100, Math.max(0, currentTrip.userProgressPercent ?? 0));
  const c = Math.min(100, Math.max(0, currentTrip.carProgressPercent ?? 0));
  const passengerDone = currentTrip.status === "USER_ARRIVED" || p === 100;
  const transport = currentTrip.passengerTransport;

  return (
    <div className="fixed inset-x-0 bottom-0 sm:bottom-6 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40 w-full sm:max-w-md px-3 sm:px-4 pb-6 pt-2">
      <section className="trobos-journey-card" aria-label="Simulasi dua perjalanan">
        <div className="trobos-sheet-handle" aria-hidden="true"/>
        <div className="trobos-sheet-top">
          <div>
            <span className="trobos-sheet-eyebrow"><span className="trobos-status-dot"/> LIVE ANIMATION · DEMO</span>
            <h2>Dua perjalanan.<br/><em>Satu tujuan.</em></h2>
            <p>Amati penumpang dan kendaraan bergerak secara terpisah.</p>
          </div>
          <span className="trobos-stage-icon"><Route size={23}/></span>
        </div>
        <div className="trobos-journey-rows">
          <div className="trobos-journey-row">
            <div className="trobos-journey-symbol sky">{transport.type === "MOTOR" ? <Bike size={22}/> : <CarFront size={22}/>}</div>
            <div className="trobos-journey-info">
              <div className="trobos-journey-title"><strong>Anda & penumpang</strong><span>{passengerDone ? "Tiba" : p + "%"}</span></div>
              <p>{currentTrip.destination.name}</p>
              <div className="trobos-progress-track"><i style={{width:p + "%",background:"#367EAB"}}/></div>
            </div>
          </div>
          <div className="trobos-journey-row">
            <div className="trobos-journey-symbol copper"><Truck size={22}/></div>
            <div className="trobos-journey-info">
              <div className="trobos-journey-title"><strong>Mobil & towing</strong><span>{c === 100 ? "Tiba" : c + "%"}</span></div>
              <p>{currentTrip.carDestination.name}</p>
              <div className="trobos-progress-track"><i style={{width:c + "%",background:"#C27651"}}/></div>
            </div>
          </div>
        </div>
        <div className="trobos-journey-meta">
          <span><Users size={15}/> {currentTrip.passengerCount} penumpang</span>
          <span><Check size={15}/> PIN & inspeksi demo</span>
        </div>
        {notice && <p role="status" className="trobos-stage-notice">{notice}</p>}
        <div className="trobos-stage-actions">
          <button type="button" onClick={() => setChatOpen(true)}><MessageCircle size={17}/> Chat demo</button>
          <button type="button" onClick={() => setNotice("Tautan live tracking belum tersedia: kendaraan di peta adalah animasi demo.")}><Share2 size={17}/> Bagikan</button>
          <Link href="/app/help"><CircleHelp size={17}/> Bantuan</Link>
        </div>
        {currentTrip.status === "TRIP_STARTED" && (
          <button type="button" onClick={userArrivedAtDest} className="trobos-stage-continue">
            Tandai penumpang tiba <ArrowRight size={18}/>
          </button>
        )}
        {currentTrip.status === "USER_ARRIVED" && (
          <button type="button" onClick={carArrivedAtDest} className="trobos-stage-continue">
            Tandai mobil tiba <ArrowRight size={18}/>
          </button>
        )}
        <p className="trobos-legal-note">Peta dan progres bergerak otomatis untuk demonstrasi; tidak terhubung dengan driver sungguhan.</p>
      </section>
    </div>
  );
}
