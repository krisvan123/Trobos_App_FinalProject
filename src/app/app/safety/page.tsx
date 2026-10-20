"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, ClipboardCheck, MapPin,
  PhoneCall, ShieldCheck, Truck, Wrench, LockKeyhole } from "lucide-react";
import { useTrobosStore } from "@/store/useTrobosStore";

const points=[
  {icon:Truck,title:"Operator & armada",text:"Identitas, rating dan posisi armada yang tampil di TROBOS adalah data simulasi. Belum ada mitra derek atau pengemudi terverifikasi."},
  {icon:Wrench,title:"Bengkel tujuan",text:"Bengkel yang direkomendasikan merupakan contoh koordinat. Kedekatan dihitung sebagai jarak geografis, bukan ETA, jam buka, atau ketersediaan layanan."},
  {icon:LockKeyhole,title:"PIN dan inspeksi",text:"Verifikasi PIN dan checklist serah terima adalah bagian alur demo. Bukan prosedur keamanan yang terhubung ke operator nyata."},
  {icon:ShieldCheck,title:"Asuransi dan biaya",text:"Belum ada polis perlindungan, cakupan asuransi, pembayaran, atau tagihan yang aktif melalui TROBOS."},
];

export default function SafetyPage() {
  const trip=useTrobosStore(s=>s.currentTrip);
  return <main className="tr-secondary-page">
    <header className="tr-secondary-intro"><span className="tr-new-eyebrow"><ShieldCheck size={15}/> TRUST & TRANSPARENCY</span>
      <h1>Keamanan & batasan demo.</h1>
      <p>TROBOS adalah prototype akademik. Halaman ini menjelaskan fungsi yang sudah disimulasikan dan apa yang belum menjadi layanan sungguhan.</p>
    </header>
    <div className="tr-secondary-notice"><AlertTriangle size={23}/><div>
      <strong>Jangan gunakan TROBOS untuk meminta pertolongan darurat nyata.</strong>
      <p>Apabila berada di lokasi berbahaya, utamakan keselamatan dan hubungi layanan darurat resmi setempat. Di Indonesia, 112 dapat digunakan di wilayah yang mendukung layanannya.</p>
      <a href="tel:112" className="tr-secondary-phone"><PhoneCall size={17}/> Hubungi 112 (jika tersedia)</a>
    </div></div>
    <section className="tr-secondary-card-grid" aria-label="Fitur yang masih disimulasikan">
      {points.map(({icon:Icon,title,text})=><article className="tr-secondary-card" key={title}>
        <span className="tr-secondary-icon"><Icon size={21}/></span><h2>{title}</h2><p>{text}</p>
        <span className="tr-secondary-tag">BELUM AKTIF / ILUSTRASI</span>
      </article>)}
    </section>
    <section className="tr-secondary-card tr-secondary-wide">
      <div><span className="tr-new-eyebrow"><MapPin size={15}/> PERJALANAN DEMO</span><h2>Status saat ini</h2>
        <p>{trip?trip.origin.name+" → "+trip.destination.name:"Belum ada pemesanan demo yang aktif."}</p>
        <p>Posisi kendaraan pada peta adalah animasi; pembaruan bukan berasal dari perangkat GPS driver.</p>
      </div><Link href="/app">Kembali ke aplikasi <ArrowRight size={17}/></Link>
    </section>
  </main>;
}
