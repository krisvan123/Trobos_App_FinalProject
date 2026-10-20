"use client";

import React, { useState } from "react";
import { useTrobosStore } from "@/store/useTrobosStore";
import {
  ShieldCheck,
  PhoneCall,
  Radio,
  FileCheck2,
  Lock,
  CheckCircle,
  AlertTriangle,
  Truck,
  Info,
} from "lucide-react";

export default function SafetyCenterPage() {
  const user = useTrobosStore((s) => s.user);
  const [sosActivated, setSosActivated] = useState(false);

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto w-full space-y-6 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Pusat Keamanan & Proteksi Evakuasi
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Contoh fitur keselamatan dan penanganan insiden untuk prototipe akademik.
        </p>
      </div>

      {/* Prototype Transparent Insurance Notice */}
      <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">Transparansi Prototipe Akademik:</span>
          <p className="text-[11px] mt-0.5 text-amber-800 dark:text-amber-300/90 leading-relaxed">
            Program proteksi asuransi komprehensif dalam tahap konfirmasi polis prototype Venture Creation. Nilai pertanggungan dan skema perlindungan disimulasikan sesuai standar industri towing modern.
          </p>
        </div>
      </div>

      {/* SOS Alert Bar */}
      <div className="rounded-2xl p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-red-900 dark:text-red-300">
            Mobil Mogok di Titik Berbahaya?
          </div>
          <div className="text-[11px] text-red-700 dark:text-red-400">
            Jika membutuhkan bantuan darurat nyata, hubungi layanan darurat resmi setempat.
          </div>
        </div>
        <button
          onClick={() => setSosActivated(true)}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shrink-0 transition"
        >
          Bantuan Darurat
        </button>
      </div>

      {/* 4 Pillars of Safety */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Towing Operator Verification */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Truck className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Operator Derek Bersertifikat Resmi
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Prototipe menampilkan ilustrasi operator towing. Belum ada mitra maupun sertifikasi yang diverifikasi sistem.
          </p>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1 pt-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Data Armada Contoh</span>
          </div>
        </div>

        {/* Insurance */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Asuransi Derek All-Risk Rp 1 Miliar
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Skema asuransi ini adalah contoh akademik, bukan polis aktif atau penawaran pertanggungan.
          </p>
          <div className="text-[11px] text-blue-700 dark:text-blue-400 font-semibold flex items-center gap-1 pt-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Ilustrasi — Belum Aktif</span>
          </div>
        </div>

        {/* Real-time Tracking */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-[#FF4D00] flex items-center justify-center">
            <Radio className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Pelacakan GPS Simultan
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Lihat ilustrasi perjalanan penumpang dan mobil pada peta. Belum ada transmisi GPS unit sebenarnya.
          </p>
          <div className="text-[11px] text-orange-700 dark:text-orange-400 font-semibold flex items-center gap-1 pt-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Visualisasi Tracking Demo</span>
          </div>
        </div>

        {/* Handover PIN & Inspection */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Kode PIN & Checklist Inspeksi Fisik
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            PIN dan checklist adalah bagian simulasi. Pemeriksaan operator belum terintegrasi dengan backend.
          </p>
          <div className="text-[11px] text-indigo-700 dark:text-indigo-400 font-semibold flex items-center gap-1 pt-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Protokol Verifikasi 5 Sudut</span>
          </div>
        </div>
      </div>

      {/* Workshop Partnerships */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between text-xs">
        <div>
          <div className="text-slate-500 dark:text-slate-400 font-medium">Contoh Tujuan Bengkel</div>
          <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
            Honda Autoland, Toyota Auto2000, & Astra Otoservice 24 Jam
          </div>
          <div className="text-slate-500 dark:text-slate-400">Nama bengkel hanya contoh — belum terkonfirmasi sebagai rekanan.</div>
        </div>
        <div className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 font-semibold text-[11px] shrink-0">
          Contoh Bengkel
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between text-xs">
        <div>
          <div className="text-slate-500 dark:text-slate-400 font-medium">Kontak Darurat Terdaftar</div>
          <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
            {user.emergencyContact.name} ({user.emergencyContact.relation})
          </div>
          <div className="text-slate-500 dark:text-slate-400 font-mono">{user.emergencyContact.phone}</div>
        </div>
        <div className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 font-semibold text-[11px]">
          Siaga Otomatis
        </div>
      </div>

      {/* SOS Modal */}
      {sosActivated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 text-slate-900 dark:text-slate-100 text-center shadow-xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Pusat Tanggap Darurat Mobil Mogok
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              TROBOS belum mengoperasikan call center. Anda dapat mencoba menghubungi nomor darurat resmi 112 jika layanan tersedia di wilayah Anda.
            </p>
            <div className="space-y-2 pt-2">
              <a
                href="tel:112"
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" /> Hubungi 112 (Polisi / Ambulans)
              </a>
              <button
                onClick={() => setSosActivated(false)}
                className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
