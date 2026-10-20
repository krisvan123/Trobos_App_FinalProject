"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Zap,
  ShieldCheck,
  Bike,
  Car,
  Truck,
  Users,
  ChevronRight,
  AlertTriangle,
  CircleDot,
  BatteryWarning,
  Flame,
  KeyRound,
  ShieldAlert,
  Wrench,
  CheckCircle2,
  PhoneCall,
  Clock,
  ArrowRight,
  HelpCircle,
  Plus,
  Minus,
} from "lucide-react";
import { BREAKDOWN_PROBLEMS, getPassengerTransportOption, FAQS } from "@/lib/mockData";

export default function LandingPage() {
  const [passengerCount, setPassengerCount] = useState(2);
  const recommendedTransport = getPassengerTransportOption(passengerCount);

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-orange-500 selection:text-white flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#FF4D00] flex items-center justify-center shadow-sm">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-slate-900">
                TROBOS
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-orange-100 text-[#FF4D00]">
                RESCUE
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 transition"
            >
              Masuk
            </Link>
            <Link
              href="/app"
              className="px-4 sm:px-5 py-2.5 rounded-xl bg-[#FF4D00] hover:bg-[#E64400] text-white text-xs sm:text-sm font-bold shadow-sm transition active:scale-95 flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Minta Bantuan</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="bg-amber-50 border-b border-amber-200 text-amber-950 text-center px-4 py-2 text-xs font-semibold">Prototipe akademik TROBOS: driver, GPS, pembayaran, dan asuransi masih dalam mode simulasi.</div>
      {/* HERO SECTION */}
      <section className="pt-12 pb-16 px-4 sm:px-6 max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-5 text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#FF4D00] text-xs font-bold uppercase tracking-wide">
            <Truck className="w-3.5 h-3.5" />
            <span>Layanan Evakuasi & Penyelamatan Mobil Mogok Terpadu</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Mobil Mogok? <br />
            <span className="text-[#FF4D00]">Tenang.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
            Kami bantu evakuasi mobil Anda ke bengkel rekanan terpercaya, sekaligus mengantarkan Anda dan seluruh rombongan langsung ke tempat tujuan.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
            <Link
              href="/app"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#FF4D00] hover:bg-[#E64400] text-white font-black text-base shadow-elevated transition active:scale-95 flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 fill-white" />
              <span>MINTA BANTUAN SEKARANG</span>
            </Link>

            <a
              href="#cara-kerja"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center gap-1.5 transition"
            >
              <span>Alur Penyelamatan</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Trust Metrics */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-center lg:justify-start gap-8 text-xs text-slate-500">
            <div>
              <div className="text-xl font-black text-slate-900">Simulasi</div>
              <div>Respon Siaga</div>
            </div>
            <div>
              <div className="text-xl font-black text-emerald-600">Konsep</div>
              <div>Towing Flatbed Resmi</div>
            </div>
            <div>
              <div className="text-xl font-black text-blue-600">Belum Aktif</div>
              <div>Asuransi All-Risk</div>
            </div>
          </div>
        </div>

        {/* HERO VISUAL: DUAL SOLUTION DIAGRAM */}
        <div className="flex-1 w-full max-w-md">
          <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6 shadow-sm space-y-3.5">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Satu Panggilan, Dua Solusi Sekaligus
            </div>

            {/* Condition: Car Broken Down */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-red-600 uppercase">Kondisi Darurat</div>
                <div className="text-sm font-bold text-slate-900">Mobil Mogok di Jalan</div>
                <div className="text-xs text-slate-500">Mesin mati, aki drop, atau ban bocor</div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>

            {/* Trobos Rescue Dispatched */}
            <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-[#FF4D00] uppercase">Unit Rescue Trobos Meluncur</div>
                <div className="text-sm font-bold text-slate-900">Truk Towing + Armada Penumpang</div>
                <div className="text-xs text-slate-600">Datang bersamaan ke titik mobil Anda</div>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-white border border-orange-200/80 shrink-0">
                <Truck className="w-4 h-4 text-[#FF4D00]" />
                <Car className="w-4 h-4 text-slate-700" />
              </div>
            </div>

            {/* Dual Branches */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-sky-50 border border-sky-100">
                <div className="text-[10px] font-bold text-sky-700 uppercase">1. Penumpang Anda</div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">Diantar ke Tujuan</div>
                <div className="text-[11px] text-sky-600 mt-1">Armada disesuaikan jumlah orang</div>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100">
                <div className="text-[10px] font-bold text-amber-700 uppercase">2. Mobil Mogok</div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">Dievakuasi Towing</div>
                <div className="text-[11px] text-amber-700 mt-1">Diderek ke bengkel rekanan</div>
              </div>
            </div>

            {/* Outcome */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-emerald-700 uppercase">Hasil Akhir</div>
                <div className="text-sm font-bold text-slate-900">Semua Sampai dengan Selamat</div>
                <div className="text-xs text-slate-600">Anda tidak tertahan, mobil ditangani mekanik</div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE PASSENGER VEHICLE CALCULATOR PREVIEW */}
      <section className="py-14 px-4 sm:px-6 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF4D00] bg-orange-950/80 px-3 py-1 rounded-full border border-orange-500/30">
              Prinsip Desain Produk Dinamis
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Kendaraan Pengganti Disesuaikan dengan Jumlah Penumpang
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Trobos tidak memaksakan motor untuk semua situasi. Kami menghitung jumlah orang di dalam mobil mogok Anda dan mengirim armada yang tepat.
            </p>
          </div>

          <div className="p-6 bg-slate-800/80 border border-slate-700 rounded-3xl max-w-xl mx-auto space-y-5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#FF4D00]" />
                <span>Berapa orang yang perlu diantar?</span>
              </div>

              {/* Stepper */}
              <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => setPassengerCount(Math.max(1, passengerCount - 1))}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center font-bold text-white transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-mono font-black text-base text-[#FF4D00]">
                  {passengerCount}
                </span>
                <button
                  type="button"
                  onClick={() => setPassengerCount(Math.min(8, passengerCount + 1))}
                  className="w-8 h-8 rounded-lg bg-[#FF4D00] hover:bg-[#E64400] flex items-center justify-center font-bold text-white transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Dynamic result card */}
            <div className="p-4 bg-slate-900 border border-slate-700 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-[#FF4D00] shrink-0">
                {recommendedTransport.type === "MOTOR" ? (
                  <Bike className="w-6 h-6" />
                ) : (
                  <Car className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">
                    {recommendedTransport.recommendedFor}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Kapasitas: {recommendedTransport.capacityLabel}
                  </span>
                </div>
                <div className="text-base font-black text-white mt-0.5">
                  {recommendedTransport.title}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {recommendedTransport.description}
                </div>
              </div>
            </div>

            <div className="text-center pt-1">
              <Link
                href="/app"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#FF4D00] hover:text-orange-400 transition"
              >
                <span>Buka aplikasi untuk pesan langsung</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: COMMON BREAKDOWN PROBLEMS WE HANDLE */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto w-full space-y-10">
        <div className="text-center max-w-xl mx-auto">
          <div className="text-xs font-bold text-[#FF4D00] uppercase tracking-wider">
            Cakupan Penyelamatan
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            Kendala Mobil yang Kami Tangani
          </h2>
          <p className="text-sm text-slate-600 mt-1.5">
            Mulai dari mesin mati hingga kecelakaan ringan, tim rescue Trobos siap siaga 24 jam.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {BREAKDOWN_PROBLEMS.map((problem) => (
            <div
              key={problem.id}
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition shadow-subtle space-y-2"
            >
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF4D00] flex items-center justify-center">
                {problem.id === "engine_failure" && <AlertTriangle className="w-4 h-4" />}
                {problem.id === "flat_tire" && <CircleDot className="w-4 h-4" />}
                {problem.id === "battery_dead" && <BatteryWarning className="w-4 h-4" />}
                {problem.id === "overheat" && <Flame className="w-4 h-4" />}
                {problem.id === "starter_failure" && <KeyRound className="w-4 h-4" />}
                {problem.id === "minor_accident" && <ShieldAlert className="w-4 h-4" />}
                {problem.id === "unknown" && <HelpCircle className="w-4 h-4" />}
              </div>
              <h3 className="text-sm font-bold text-slate-900">{problem.label}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}

          {/* Plus Bengkel Rekanan */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center mb-2">
                <Wrench className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Bengkel Rekanan Resmi</h3>
              <p className="text-xs text-slate-500 mt-1">
                Langsung terhubung dengan Honda, Toyota, dan Astra Otoservice terdekat.
              </p>
            </div>
            <div className="text-[11px] font-bold text-emerald-700 mt-2">
              Prioritas Layanan
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: 5 STEPS HOW IT WORKS */}
      <section id="cara-kerja" className="py-16 px-4 sm:px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-xl mx-auto">
            <div className="text-xs font-bold text-[#FF4D00] uppercase tracking-wider">
              Alur Layanan
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
              Bagaimana Trobos Menyelamatkan Anda
            </h2>
            <p className="text-sm text-slate-600 mt-1.5">
              Dari saat mobil mogok hingga tiba di bengkel dan destinasi tanpa repot.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
              <span className="text-2xl font-black text-slate-300">01</span>
              <h3 className="text-base font-bold text-slate-900">Pilih Kendala & Penumpang</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tentukan masalah mobil Anda dan masukkan berapa orang yang perlu diantar. Sistem otomatis merekomendasikan armada pengganti.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
              <span className="text-2xl font-black text-slate-300">02</span>
              <h3 className="text-base font-bold text-slate-900">Unit Rescue Datang</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Truk towing gendong flatbed dan armada penjemput penumpang meluncur bersamaan ke lokasi mogok Anda dalam hitungan menit.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
              <span className="text-2xl font-black text-slate-300">03</span>
              <h3 className="text-base font-bold text-slate-900">Inspeksi & Serah Terima</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Verifikasi kode PIN 4-digit, periksa bodi mobil secara transparan, dan mobil dinaikkan aman dengan proteksi asuransi Rp 1 Miliar.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
              <span className="text-2xl font-black text-slate-300">04</span>
              <h3 className="text-base font-bold text-slate-900">Evakuasi Serentak</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Anda melanjutkan perjalanan ke tujuan tanpa tertahan, sementara mobil diderek menuju bengkel rekanan pilihan Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: FAQS */}
      <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center space-y-1">
          <div className="text-xs font-bold text-[#FF4D00] uppercase tracking-wider">
            Pertanyaan Umum
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5"
            >
              <h3 className="text-sm font-bold text-slate-900">{faq.q}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-14 px-4 sm:px-6 bg-slate-900 text-white text-center">
        <div className="max-w-xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Mobil Anda Mogok Sekarang?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Mobil mogok? Tenang. Kami bantu evakuasi mobil dan mengantarkan Anda ke tujuan.
          </p>
          <div className="pt-2">
            <Link
              href="/app"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#FF4D00] hover:bg-[#E64400] text-white font-black text-sm tracking-wide shadow-lg transition active:scale-95"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>MINTA BANTUAN SEKARANG</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-slate-200 text-slate-500 text-xs text-center">
        © 2026 Trobos Rescue Indonesia • Layanan Evakuasi Mobil Mogok & Pengantaran Penumpang Terpadu.
      </footer>
    </div>
  );
}
