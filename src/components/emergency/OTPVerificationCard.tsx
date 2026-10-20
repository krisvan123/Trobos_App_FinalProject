"use client";

import React from "react";
import { useTrobosStore } from "@/store/useTrobosStore";
import { ArrowRight, CarFront, CheckCircle2, LockKeyhole, ShieldCheck, Truck } from "lucide-react";

export function OTPVerificationCard() {
  const trip=useTrobosStore(s=>s.currentTrip);
  const verify=useTrobosStore(s=>s.verifyOtp);
  if(!trip)return null;
  const isTandem=trip.serviceType==="TANDEM";
  return (
    <div className="fixed inset-x-0 bottom-0 sm:bottom-6 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40 w-full sm:max-w-md px-3 sm:px-4 pb-6 pt-2">
      <section className="trobos-journey-card tr-flow-stage">
        <div className="trobos-sheet-handle"/>
        <span className="tr-flow-eyebrow"><CheckCircle2 size={16}/> ARMADA TIBA · DEMO</span>
        <div className="tr-flow-heading"><div>
          <h2>Saatnya verifikasi.</h2>
          <p>{isTandem ? "Driver simulasi sudah tiba untuk membawa mobilmu." : "Unit rescue simulasi sudah tiba untuk mengangkut mobilmu."}</p>
        </div><span className="tr-flow-heading-icon">{isTandem ? <CarFront size={22}/> : <Truck size={22}/>}</span></div>
        <div className="tr-flow-otp">
          <span><LockKeyhole size={15}/> KODE PIN CONTOH</span>
          <strong aria-label={"PIN demo "+trip.otpCode}>{trip.otpCode}</strong>
          <small>Kode ini hanya ilustrasi dan bukan autentikasi keamanan sungguhan.</small>
        </div>
        <div className="tr-flow-note"><ShieldCheck size={17}/> Tahap berikutnya adalah checklist inspeksi mobil sebelum animasi perjalanan dimulai.</div>
        <button type="button" onClick={()=>verify(trip.otpCode)} className="tr-flow-primary">
          Lanjut ke inspeksi mobil <ArrowRight size={18}/>
        </button>
      </section>
    </div>
  );
}
