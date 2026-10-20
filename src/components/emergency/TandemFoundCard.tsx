"use client";

import React from "react";
import { useTrobosStore } from "@/store/useTrobosStore";
import { ArrowRight, Bike, Check, MessageCircle, Star, Truck } from "lucide-react";

export function TandemFoundCard() {
  const trip = useTrobosStore(s => s.currentTrip);
  const setApproaching = useTrobosStore(s => s.setApproaching);
  const setChatOpen = useTrobosStore(s => s.setChatOpen);
  if (!trip) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 sm:bottom-6 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40 w-full sm:max-w-md px-3 sm:px-4 pb-6 pt-2">
      <section className="trobos-journey-card">
        <div className="trobos-sheet-handle" aria-hidden="true"/>
        <div className="trobos-sheet-top">
          <div>
            <span className="trobos-sheet-eyebrow"><Check size={15}/> UNITS MATCHED · DEMO</span>
            <h2>Armada ditemukan.</h2>
            <p>Dua unit simulasi siap menuju titik bantuanmu.</p>
          </div>
          <span className="trobos-stage-icon"><Check size={24}/></span>
        </div>
        <div className="trobos-journey-rows">
          <div className="trobos-journey-row">
            <div className="trobos-journey-symbol copper"><Truck size={23}/></div>
            <div className="trobos-journey-info">
              <div className="trobos-journey-title"><strong>{trip.towingUnit.truckModel}</strong><span>Demo</span></div>
              <p>{trip.towingUnit.operatorName} · {trip.towingUnit.plate}</p>
            </div>
          </div>
          <div className="trobos-journey-row">
            <div className="trobos-journey-symbol sky"><Bike size={23}/></div>
            <div className="trobos-journey-info">
              <div className="trobos-journey-title"><strong>{trip.passengerTransport.title}</strong><span>Demo</span></div>
              <p>{trip.passengerTransport.driverName} · {trip.passengerTransport.plate}</p>
            </div>
          </div>
        </div>
        <div className="trobos-journey-meta"><span><Star size={15}/> Profil contoh</span><span>Tanpa dispatch nyata</span></div>
        <button type="button" onClick={setApproaching} className="trobos-primary-action">
          <span>Lacak motor menuju pickup</span><ArrowRight size={19}/>
        </button>
        <button type="button" onClick={() => setChatOpen(true)} className="trobos-stage-continue">
          <MessageCircle size={17}/> Buka chat simulasi
        </button>
      </section>
    </div>
  );
}
