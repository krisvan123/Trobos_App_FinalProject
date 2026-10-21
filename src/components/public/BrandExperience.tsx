"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Check, MapPin, Moon,
  Navigation2, Route, ShieldCheck, Sun, Truck, Zap
} from "lucide-react";
import { useTrobosStore } from "@/store/useTrobosStore";

export function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" aria-label="TROBOS — Beranda" className="tr-brand">
      <span className="tr-brand-symbol"><Zap size={compact ? 18 : 21} strokeWidth={2.7}/></span>
      <span className="tr-brand-word">TROBOS<span className="tr-brand-dot">.</span></span>
    </Link>
  );
}

export function PublicHeader({ minimal = false }: { minimal?: boolean }) {
  const theme = useTrobosStore(s => s.theme);
  const toggleTheme = useTrobosStore(s => s.toggleTheme);
  return (
    <header className="tr-public-header">
      <div className="tr-header-inner">
        <BrandLockup/>
        <nav aria-label="Navigasi halaman depan" className="tr-header-actions">
          {!minimal && <a href="#cara-kerja" className="tr-header-link tr-header-about">Cara kerja</a>}
          <button type="button" className="tr-theme-toggle" onClick={toggleTheme}
            aria-label={theme === "dark" ? "Aktifkan light mode" : "Aktifkan dark mode"}
            title={theme === "dark" ? "Light mode" : "Dark mode"}>
            {theme === "dark" ? <Sun size={18}/> : <Moon size={18}/>}
          </button>
          {minimal
            ? <Link className="tr-header-link" href="/"><ArrowLeft size={16}/> Beranda</Link>
            : <>
              <Link className="tr-header-link" href="/login">Masuk</Link>
              <Link className="tr-header-primary" href="/app">Pesan bantuan <ArrowUpRight size={16}/></Link>
            </>
          }
        </nav>
      </div>
    </header>
  );
}

export function JourneyVisual() {
  return (
    <div className="tr-auth-visual" aria-label="Ilustrasi konsep TROBOS">
      <div className="tr-auth-visual-top">
        <span className="tr-kicker"><span className="tr-status-light"/> TROBOS / MOBILITY CONCEPT</span>
        <h2>Terus bergerak.<br/><em>Tanpa kehilangan arah.</em></h2>
        <p>Perjalanan penumpang dan penanganan kendaraan, dipantau dalam satu pengalaman digital.</p>
      </div>
      <div className="tr-mini-map" aria-hidden="true">
        <svg viewBox="0 0 560 310" preserveAspectRatio="xMidYMid slice" role="presentation">
          <defs>
            <pattern id="tr-roads" width="76" height="76" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
              <path d="M0 38h76M38 0v76" fill="none" stroke="currentColor" strokeWidth="11"/>
              <path d="M0 38h76M38 0v76" fill="none" stroke="#728A97" strokeOpacity=".22" strokeWidth="1.4"/>
            </pattern>
            <linearGradient id="tr-route-tint" x1="0" x2="1"><stop stopColor="#447DA2"/><stop offset="1" stopColor="#D58E69"/></linearGradient>
          </defs>
          <rect width="560" height="310" fill="url(#tr-roads)" opacity=".25"/>
          <path d="M80 252 146 252 146 196 239 196 239 121 328 121 328 64 479 64"
            stroke="#447DA2" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M80 252 146 252 146 196 239 196 239 229 408 229 408 143 494 143"
            stroke="#D58E69" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="10 8"/>
          <circle cx="80" cy="252" r="13" fill="#253D50" stroke="#F1F4F3" strokeWidth="4"/>
          <circle cx="479" cy="64" r="10" fill="#447DA2" stroke="#F1F4F3" strokeWidth="4"/>
          <circle cx="494" cy="143" r="10" fill="#D58E69" stroke="#F1F4F3" strokeWidth="4"/>
          <rect x="308" y="98" width="40" height="40" rx="12" fill="#447DA2" stroke="#F4F5F4" strokeWidth="3"/>
          <rect x="388" y="207" width="40" height="40" rx="12" fill="#D58E69" stroke="#F4F5F4" strokeWidth="3"/>
        </svg>
        <div className="tr-mini-map-card">
          <span className="tr-mini-icon"><Navigation2 size={18}/></span>
          <div><small>CONCEPT TRACKING</small><strong>2 jalur · 1 aplikasi</strong></div>
          <Check size={17}/>
        </div>
      </div>
      <div className="tr-auth-visual-bottom">
        <span><Route size={17}/> Peta interaktif</span>
        <span><Truck size={17}/> Rescue & Tandem</span>
        <span><ShieldCheck size={17}/> Demo transparan</span>
      </div>
    </div>
  );
}

export function AuthFrame({ title, subtitle, eyebrow, children }: {
  title: string;
  subtitle: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <main className="tr-public tr-auth-page">
      <PublicHeader minimal/>
      <div className="tr-auth-layout">
        <div className="tr-auth-aside"><JourneyVisual/></div>
        <div className="tr-auth-side">
          <div className="tr-auth-card">
            <span className="tr-kicker"><span className="tr-status-light"/> {eyebrow}</span>
            <h1>{title}</h1>
            <p className="tr-auth-subtitle">{subtitle}</p>
            {children}
          </div>
          <div className="tr-auth-foot"><MapPin size={14}/> Dibuat untuk mobilitas perkotaan · Mode prototipe</div>
        </div>
      </div>
    </main>
  );
}

export function AuthSubmit({ busy, children }: { busy?: boolean; children: React.ReactNode }) {
  return <button type="submit" disabled={busy} className="tr-public-primary tr-auth-submit">
    <span>{children}</span><ArrowRight size={19}/>
  </button>;
}
