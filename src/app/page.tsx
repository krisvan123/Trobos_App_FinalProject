"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Bike, CarFront, Check, ChevronRight, Clock3, MapPin, Navigation2, Route, ShieldCheck, Truck, Users, Zap } from "lucide-react";
import { InteractiveMap } from "@/components/map/InteractiveMap";
import { PublicHeader } from "@/components/public/BrandExperience";
import { BREAKDOWN_PROBLEMS, FAQS, getPassengerTransportOption } from "@/lib/mockData";

const steps = [
  {number:"01",title:"Tentukan titik bantuan",description:"Pilih layanan rescue atau tandem, lokasi, dan tujuan perjalanan.",icon:MapPin},
  {number:"02",title:"Simulasi pencarian unit",description:"Lihat antarmuka dispatch dan kendaraan yang mendekati titik jemput.",icon:Truck},
  {number:"03",title:"Ikuti dua rute",description:"Pantau penumpang dan mobil di jalan yang berbeda lewat peta interaktif.",icon:Route},
];

export default function LandingPage() {
  const [passengerCount, setPassengerCount] = useState(2);
  const transport = getPassengerTransportOption(passengerCount);
  return (
    <main className="tr-public tr-landing">
      <PublicHeader/>
      <div className="tr-prototype-ribbon"><span className="tr-status-light"/> EXPERIENCE PREVIEW <span>·</span> TROBOS masih prototipe akademik, bukan layanan darurat aktif.</div>
      <section className="tr-hero">
        <div className="tr-hero-copy">
          <span className="tr-kicker"><span className="tr-status-light"/> A NEW WAY TO KEEP MOVING</span>
          <h1>Kamu tetap jalan.<br/><em>Mobil tetap tertangani.</em></h1>
          <p>Bayangkan perjalanan yang tidak berhenti saat kendaraan membutuhkan bantuan. TROBOS menyatukan perjalanan penumpang dan penanganan mobil dalam satu pengalaman digital.</p>
          <div className="tr-hero-booking" aria-label="Mulai pemesanan bantuan demo">
            <span className="tr-hero-booking-label">PILIH BANTUAN · SIMULASI</span>
            <div className="tr-hero-booking-options">
              <Link href="/app?service=TANDEM" className="tr-hero-booking-option">
                <span className="tr-hero-booking-icon"><Bike size={22}/></span>
                <span><strong>Pesan Tandem</strong><small>Penumpang lanjut, mobil diantar driver</small></span>
                <ArrowUpRight size={20}/>
              </Link>
              <Link href="/app?service=MECHANIC" className="tr-hero-booking-option">
                <span className="tr-hero-booking-icon"><Truck size={22}/></span>
                <span><strong>Pesan Derek & Rescue</strong><small>Mobil ke bengkel, penumpang lanjut</small></span>
                <ArrowUpRight size={20}/>
              </Link>
            </div>
            <p>Pilih layanan untuk mengatur titik bantuan dan tujuan. Peta tracking baru muncul setelah konfirmasi.</p>
          </div>
          <div className="tr-hero-actions">
            <a href="#cara-kerja" className="tr-secondary-link">Lihat cara kerja <ChevronRight size={18}/></a>
          </div>
          <div className="tr-hero-trust">
            <span><Check size={16}/> Peta interaktif asli</span>
            <span><Check size={16}/> Simulasi dua kendaraan</span>
            <span><Check size={16}/> Tanpa transaksi nyata</span>
          </div>
        </div>
        <div className="tr-hero-map-shell">
          <div className="tr-hero-map" aria-label="Pratinjau peta TROBOS Jakarta">
            <InteractiveMap className="tr-landing-preview-map"/>
          </div>
          <div className="tr-map-floating-top">
            <span><span className="tr-status-light"/> TROBOS / LIVE PREVIEW</span>
            <strong>Jakarta, Indonesia</strong>
          </div>
          <div className="tr-map-floating-bottom">
            <div className="tr-map-float-service"><span className="tr-floating-symbol"><Navigation2 size={19}/></span><div><small>PERJALANAN PENUMPANG</small><strong>Menuju tujuanmu</strong></div><span className="tr-floating-dot sky"/></div>
            <div className="tr-map-float-service"><span className="tr-floating-symbol tow"><Truck size={19}/></span><div><small>RESCUE KENDARAAN</small><strong>Menuju bengkel contoh</strong></div><span className="tr-floating-dot copper"/></div>
            <p>Peta jalan asli · rute dan armada adalah ilustrasi demo.</p>
          </div>
        </div>
        <div className="tr-hero-index">JAKARTA · URBAN MOBILITY / 2026</div>
      </section>

      <section className="tr-feature-band" aria-label="Konsep layanan TROBOS">
        <div><span className="tr-feature-index">01 / TANGGAP</span><h2>Bergerak tanpa menunggu.</h2><p>Konsep rescue dan kendaraan penumpang dalam satu proses.</p></div>
        <div><span className="tr-feature-index">02 / MONITOR</span><h2>Dua rute, satu layar.</h2><p>Visualisasi pergerakan kendaraan dengan jalur yang jelas.</p></div>
        <div><span className="tr-feature-index">03 / CONTROL</span><h2>Setiap langkah terlihat.</h2><p>Status perjalanan dan inspeksi demo terhubung dalam satu alur.</p></div>
      </section>

      <section id="cara-kerja" className="tr-marketing-section tr-process">
        <div className="tr-section-intro"><span className="tr-kicker">HOW IT WORKS</span><h2>Satu pengalaman.<br/><em>Tiga langkah sederhana.</em></h2><p>TROBOS dirancang untuk tetap mudah digunakan ketika pengguna perlu membuat keputusan cepat. Berikut alur simulasi aplikasi.</p></div>
        <div className="tr-process-grid">
          {steps.map(({number,title,description,icon:Icon})=>(
            <article key={number} className="tr-process-card">
              <div className="tr-process-head"><span>{number}</span><span className="tr-process-icon"><Icon size={21}/></span></div>
              <h3>{title}</h3><p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="tr-marketing-section tr-passengers">
        <div className="tr-section-intro"><span className="tr-kicker">THOUGHTFUL BY DESIGN</span><h2>Armada sesuai kebutuhan.<br/><em>Bukan satu solusi untuk semua.</em></h2><p>Jumlah penumpang memengaruhi rekomendasi kendaraan pengganti dalam model simulasi.</p></div>
        <div className="tr-passenger-widget">
          <div className="tr-passenger-heading">
            <div><span className="tr-kicker">SIMULATOR</span><h3>Berapa orang ikut perjalanan?</h3></div>
            <div className="tr-stepper">
              <button type="button" aria-label="Kurangi penumpang" disabled={passengerCount<=1}
                onClick={()=>setPassengerCount(Math.max(1,passengerCount-1))}>−</button>
              <strong aria-live="polite">{passengerCount}</strong>
              <button type="button" aria-label="Tambah penumpang" disabled={passengerCount>=8}
                onClick={()=>setPassengerCount(Math.min(8,passengerCount+1))}>+</button>
            </div>
          </div>
          <div className="tr-passenger-answer">
            <span className="tr-answer-icon">{transport.type==="MOTOR" ? <Bike size={27}/> : <CarFront size={27}/>}</span>
            <div><small>REKOMENDASI DEMO</small><strong>{transport.title}</strong><span>{transport.description}</span></div>
            <ChevronRight size={19}/>
          </div>
          <Link href="/app?service=TANDEM" className="tr-passenger-cta">Mulai pesan Tandem <ArrowRight size={17}/></Link>
        </div>
      </section>

      <section className="tr-marketing-section tr-usecases">
        <div className="tr-section-intro"><span className="tr-kicker">BUILT FOR THE UNEXPECTED</span><h2>Saat mobil perlu perhatian,<br/><em>rencana tetap berjalan.</em></h2><p>Contoh kendala yang bisa dipilih dalam simulasi TROBOS.</p></div>
        <div className="tr-usecase-grid">
          {BREAKDOWN_PROBLEMS.slice(0,6).map(item=>(
            <div className="tr-usecase-card" key={item.id}>
              <span><ShieldCheck size={20}/></span>
              <h3>{item.label}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="tr-marketing-section tr-faq">
        <div className="tr-section-intro"><span className="tr-kicker">QUESTIONS & ANSWERS</span><h2>Kenali konsepnya<br/><em>sebelum mencoba.</em></h2><p>Fitur perjalanan dalam aplikasi masih berupa prototipe. Tidak ada polis asuransi atau mitra kendaraan yang beroperasi melalui demo ini.</p></div>
        <div className="tr-faq-items">
          {FAQS.slice(0,5).map((faq,i)=>(
            <details key={i} className="tr-faq-row">
              <summary><span>{faq.q}</span><ChevronRight size={20}/></summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="tr-landing-last">
        <div><span className="tr-kicker">MOVE WITH TROBOS</span><h2>Pengalaman mobilitas<br/>yang lebih menyatu.</h2><p>Jelajahi konsep TROBOS langsung lewat peta dan simulasi perjalanannya.</p></div>
        <Link href="/app" className="tr-public-primary">Mulai pemesanan demo <ArrowUpRight size={18}/></Link>
      </section>
      <footer className="tr-public-footer"><span>© 2026 TROBOS / MOBILITY CONCEPT</span><span>Dirancang untuk demonstrasi · Bukan layanan rescue aktif</span><Link href="/login">Masuk <ArrowRight size={15}/></Link></footer>
    </main>
  );
}
