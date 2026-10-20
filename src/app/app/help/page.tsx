"use client";

import React, {useState} from "react";
import Link from "next/link";
import {AlertTriangle, ArrowRight, BookOpen, ChevronDown, HelpCircle, PhoneCall} from "lucide-react";
import {FAQS} from "@/lib/mockData";
import {useTrobosStore} from "@/store/useTrobosStore";

export default function HelpPage(){
  const [expanded,setExpanded]=useState<number|null>(0);
  const openTutorial=useTrobosStore(s=>s.setTutorialOpen);
  return <main className="tr-secondary-page">
    <header className="tr-secondary-intro"><span className="tr-new-eyebrow"><HelpCircle size={15}/> HELP CENTER</span>
      <h1>Ada yang ingin diketahui?</h1><p>Panduan menggunakan fitur demo TROBOS, memahami perjalanan dua kendaraan, dan membaca status tracking.</p>
    </header>
    <div className="tr-secondary-guide">
      <div><span className="tr-secondary-icon"><BookOpen size={21}/></span><h2>Baru pertama kali mencoba?</h2>
        <p>Lihat panduan interaktif untuk mengenal booking, pencarian armada, PIN, dan perjalanan.</p>
      </div><button type="button" onClick={()=>openTutorial(true)}>Buka panduan <ArrowRight size={17}/></button>
    </div>
    <section className="tr-secondary-faq" aria-label="Pertanyaan umum">
      <h2>Pertanyaan umum</h2>
      {FAQS.map((item,i)=><div key={i} className="tr-secondary-faq-item">
        <button type="button" onClick={()=>setExpanded(expanded===i?null:i)} aria-expanded={expanded===i}>
          <span>{item.q}</span><ChevronDown size={18} className={expanded===i?"rotate-180":""}/>
        </button>
        {expanded===i&&<p>{item.a}</p>}
      </div>)}
    </section>
    <div className="tr-secondary-notice tr-secondary-notice-soft"><AlertTriangle size={19}/>
      <div><strong>Tidak ada call center atau operator nyata.</strong><p>Untuk masalah di jalan sungguhan, cari operator resmi setempat atau hubungi nomor darurat yang tersedia sesuai situasi.</p>
        <a href="tel:112" className="tr-secondary-phone"><PhoneCall size={16}/> 112 (jika tersedia)</a>
      </div>
    </div>
    <Link href="/app" className="tr-secondary-back">Kembali ke pemesanan <ArrowRight size={17}/></Link>
  </main>;
}
