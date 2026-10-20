"use client";

import React, { useState } from "react";
import { useTrobosStore } from "@/store/useTrobosStore";
import { ArrowRight, CarFront, Check, CheckCircle2, MapPin, Star, Truck } from "lucide-react";
import { formatRupiah } from "@/lib/formatters";

export function TripCompletedModal() {
  const trip=useTrobosStore(s=>s.currentTrip);
  const complete=useTrobosStore(s=>s.completeTrip);
  const reset=useTrobosStore(s=>s.resetToIdle);
  const [rating,setRating]=useState(5);
  if(!trip)return null;
  const isTandem=trip.serviceType==="TANDEM";
  const finish=()=>{complete(rating,["Demo selesai"]);reset();};
  return (
    <div className="tr-flow-completion-overlay">
      <section className="tr-flow-completion" role="dialog" aria-modal="true" aria-labelledby="tr-complete-title">
        <span className="tr-flow-complete-icon"><CheckCircle2 size={33}/></span>
        <span className="tr-flow-eyebrow">DEMO COMPLETED · TROBOS</span>
        <h2 id="tr-complete-title">Dua perjalanan.<br/><em>Selesai.</em></h2>
        <p>Simulasi tiba di tujuan telah selesai. Tidak ada perjalanan, penanganan kendaraan, atau transaksi sungguhan.</p>
        <div className="tr-flow-complete-facts">
          <div><MapPin size={18}/><div><small>PENUMPANG TIBA DI</small><strong>{trip.destination.name}</strong></div><Check size={17}/></div>
          <div>{isTandem?<CarFront size={18}/>:<Truck size={18}/>}<div><small>{isTandem?"MOBIL MENUJU":"BENGKEL CONTOH"}</small><strong>{trip.carDestination.name}</strong></div><Check size={17}/></div>
        </div>
        <div className="tr-flow-complete-fare"><span>Estimasi tarif contoh</span><strong>{formatRupiah(trip.fare.totalFare)}</strong></div>
        <div className="tr-flow-rating">
          <span>Bagaimana pengalaman mencoba demonya?</span>
          <div role="group" aria-label="Beri rating simulasi">
            {[1,2,3,4,5].map(value=>(
              <button key={value} type="button" onClick={()=>setRating(value)}
                aria-label={value+" dari 5 bintang"} aria-pressed={rating===value}>
                <Star size={24} fill={value<=rating?"currentColor":"none"}/>
              </button>
            ))}
          </div>
        </div>
        <button type="button" className="tr-flow-primary" onClick={finish}>Kembali ke beranda <ArrowRight size={18}/></button>
        <small>TROBOS / CONCEPT EXPERIENCE · DATA & ARMADA DEMO</small>
      </section>
    </div>
  );
}
