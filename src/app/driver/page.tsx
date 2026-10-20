"use client";

import React, {useState} from "react";
import Link from "next/link";
import { useTrobosStore } from "@/store/useTrobosStore";
import { ArrowLeft, ArrowRight, Bike, CarFront, CheckCircle2, ChevronRight, ClipboardCheck,
  Clock3, MapPin, MessageCircle, Moon, Navigation2, RadioTower, Route, Send, ShieldCheck, Sun, Truck, Wrench } from "lucide-react";
import {formatRupiah} from "@/lib/formatters";

const stateLabel: Record<string,string> = {
  REQUESTED:"Menunggu konfirmasi pelanggan", SEARCHING_TANDEM:"Mencari armada demo",
  TANDEM_ASSIGNED:"Armada contoh ditemukan", TANDEM_APPROACHING:"Menuju penjemputan",
  TANDEM_ARRIVED:"Tiba di titik bantuan",VERIFICATION:"Menunggu PIN demo",
  VEHICLE_HANDOVER:"Inspeksi kendaraan",TRIP_STARTED:"Perjalanan berlangsung",
  USER_ARRIVED:"Penumpang telah tiba",VEHICLE_ARRIVED:"Mobil telah tiba",COMPLETED:"Perjalanan selesai",
};

export default function DriverPage() {
  const trip=useTrobosStore(s=>s.currentTrip);
  const theme=useTrobosStore(s=>s.theme);
  const toggleTheme=useTrobosStore(s=>s.toggleTheme);
  const assign=useTrobosStore(s=>s.assignTandem);
  const approach=useTrobosStore(s=>s.setApproaching);
  const arrive=useTrobosStore(s=>s.setArrived);
  const carArrived=useTrobosStore(s=>s.carArrivedAtDest);
  const chat=useTrobosStore(s=>s.chatMessages);
  const send=useTrobosStore(s=>s.sendDriverDemoMessage);
  const [message,setMessage]=useState("");
  const mechanic=trip?.serviceType==="MECHANIC";
  const active=trip&&trip.status!=="REQUESTED"&&trip.status!=="COMPLETED"&&trip.status!=="CANCELLED";
  const canReach=trip?.status==="TANDEM_APPROACHING";
  const canFinish=trip&&(trip.status==="TRIP_STARTED"||trip.status==="USER_ARRIVED")&&trip.carProgressPercent<100;

  return <main className="tr-operator-page">
    <header className="tr-operator-header">
      <Link href="/app" className="tr-operator-back"><ArrowLeft size={17}/> Tampilan pelanggan</Link>
      <span className="tr-operator-brand"><span>TR</span> TROBOS <b>/ OPERATOR DEMO</b></span>
      <button type="button" className="tr-operator-theme" onClick={toggleTheme} aria-label="Ganti tema">{theme==="dark"?<Sun size={18}/>:<Moon size={18}/>}</button>
    </header>
    <div className="tr-operator-container">
      <div className="tr-operator-title">
        <div><span className="tr-new-eyebrow"><span className="trobos-status-dot"/> SIMULASI LOKAL, BUKAN DISPATCH NYATA</span>
          <h1>Operator workspace.</h1>
          <p>Pantau pesanan yang sama dengan halaman pelanggan pada browser ini. Tidak ada armada, penghasilan, atau panggilan telepon sungguhan.</p></div>
        <div className="tr-operator-mode"><RadioTower size={19}/><span>DEMO TERHUBUNG<br/><strong>STATE BROWSER</strong></span></div>
      </div>
      {!trip || trip.status==="REQUESTED" ? <section className="tr-operator-empty">
        <span><Truck size={35}/></span><h2>Belum ada pesanan terkonfirmasi.</h2>
        <p>Buka mode pelanggan, pilih titik bantuan dan tujuan, lalu konfirmasi simulasi. Pesanan tersebut akan muncul di halaman operator ini.</p>
        <Link href="/app">Buat booking demo <ArrowRight size={17}/></Link>
      </section> : <div className="tr-operator-grid">
        <section className="tr-operator-card tr-operator-main">
          <div className="tr-operator-card-head"><span><span className="trobos-status-dot"/> PESANAN AKTIF / {trip.id}</span><span>{mechanic?"DEREK & RESCUE":"TANDEM"}</span></div>
          <div className="tr-operator-status">
            <span className="tr-operator-status-icon">{mechanic?<Truck size={25}/>:<CarFront size={25}/>}</span>
            <div><small>STATUS BERSAMA</small><h2>{stateLabel[trip.status]||trip.status}</h2><p>Perubahan tahap demo terlihat di halaman pelanggan.</p></div>
          </div>
          <div className="tr-operator-route">
            <div><MapPin size={18}/><div><small>TITIK BANTUAN</small><strong>{trip.origin.name}</strong><span>{trip.origin.address}</span></div></div>
            <div><Navigation2 size={18}/><div><small>TUJUAN PENUMPANG</small><strong>{trip.destination.name}</strong><span>{trip.destination.address}</span></div></div>
            <div>{mechanic?<Wrench size={18}/>:<CarFront size={18}/>}<div><small>{mechanic?"BENGKEL CONTOH":"TUJUAN MOBIL"}</small><strong>{trip.carDestination.name}</strong><span>{trip.carDestination.address}</span></div></div>
          </div>
          <div className="tr-operator-facts">
            <div><small>ARMADA PENUMPANG</small><strong>{trip.passengerTransport.title}</strong></div>
            <div><small>MOBIL PELANGGAN</small><strong>{trip.vehicle.brand} {trip.vehicle.model}</strong></div>
            <div><small>ESTIMASI DEMO</small><strong>{formatRupiah(trip.fare.totalFare)}</strong></div>
          </div>
          <div className="tr-operator-action">
            {trip.status==="SEARCHING_TANDEM" && <button type="button" onClick={assign}>Temukan armada contoh <ArrowRight size={18}/></button>}
            {trip.status==="TANDEM_ASSIGNED" && <button type="button" onClick={approach}>Mulai penjemputan demo <ArrowRight size={18}/></button>}
            {canReach && <button type="button" onClick={arrive}>Tandai unit tiba di pickup <ArrowRight size={18}/></button>}
            {canFinish && <button type="button" onClick={carArrived}>Tandai mobil/towing tiba <CheckCircle2 size={18}/></button>}
            {trip.status==="VEHICLE_HANDOVER" && <p><ClipboardCheck size={16}/> Pemeriksaan kendaraan dilakukan dari halaman pelanggan agar tahap penyerahan tetap konsisten.</p>}
            {trip.status==="TANDEM_ARRIVED" && <p><ShieldCheck size={16}/> Tunggu verifikasi PIN simulasi pada halaman pelanggan.</p>}
            {trip.status==="USER_ARRIVED" && trip.carProgressPercent===100 && <p><CheckCircle2 size={16}/> Kedua kendaraan sudah tiba.</p>}
            {trip.status==="VEHICLE_ARRIVED" && <p><Clock3 size={16}/> Mobil sudah tiba. Penumpang tetap melanjutkan perjalanan.</p>}
            {trip.status==="COMPLETED" && <p><CheckCircle2 size={16}/> Simulasi telah selesai. Buka halaman pelanggan untuk mengulang.</p>}
          </div>
          <Link href="/app" className="tr-operator-return"><Route size={17}/> Lihat peta perjalanan <ChevronRight size={17}/></Link>
        </section>
        <aside className="tr-operator-side">
          <section className="tr-operator-card">
            <div className="tr-operator-card-head"><span>STATUS DUA KENDARAAN</span><span>SIMULASI</span></div>
            <div className="tr-operator-progress-list">
              <div><span><Bike size={17}/> Penumpang <strong>{trip.userProgressPercent}%</strong></span><i><b style={{width:trip.userProgressPercent+"%"}}/></i></div>
              <div><span>{mechanic?<Truck size={17}/>:<CarFront size={17}/>} {mechanic?"Derek ke bengkel":"Mobil pelanggan"} <strong>{trip.carProgressPercent}%</strong></span><i><b style={{width:trip.carProgressPercent+"%"}}/></i></div>
            </div>
            <p className="tr-operator-muted">Progres disinkronkan melalui state demo browser. Belum ada koneksi GPS lintas perangkat.</p>
          </section>
          <section className="tr-operator-card">
            <div className="tr-operator-card-head"><span><MessageCircle size={15}/> CHAT PERJALANAN</span><span>LOKAL</span></div>
            <div className="tr-operator-chat" aria-live="polite">
              {chat.filter(item=>item.sender!=="system").slice(-8).map(item=><div key={item.id} className={"tr-operator-message "+(item.sender==="driver"?"is-driver":"")}><small>{item.senderName}</small><p>{item.text}</p></div>)}
            </div>
            {active && <form onSubmit={event=>{event.preventDefault();if(!message.trim())return;send(message.trim());setMessage("");}} className="tr-operator-chat-form">
              <label className="sr-only" htmlFor="tr-operator-message">Pesan simulasi</label>
              <input id="tr-operator-message" maxLength={300} value={message} onChange={event=>setMessage(event.target.value)} placeholder="Balas pelanggan (demo)"/>
              <button type="submit" aria-label="Kirim pesan demo"><Send size={17}/></button>
            </form>}
            <p className="tr-operator-muted">Pesan hanya tersimpan di browser ini, bukan dikirim ke driver nyata.</p>
          </section>
        </aside>
      </div>}
    </div>
  </main>;
}
