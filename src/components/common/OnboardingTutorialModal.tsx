"use client";

import React, { useState } from "react";
import { useTrobosStore } from "@/store/useTrobosStore";
import {
  Bike,
  Car,
  ShieldCheck,
  Navigation,
  KeyRound,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
} from "lucide-react";

interface OnboardingTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingTutorialModal: React.FC<OnboardingTutorialModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState(0);
  const setHasSeenTutorial = useTrobosStore((s) => s.setHasSeenTutorial);

  if (!isOpen) return null;

  const slides = [
    {
      badge: "Layanan Darurat Mobilitas",
      title: "Selamat Datang di Trobos",
      subtitle: "Solusi penyelamat saat Anda terjebak kemacetan parah atau kendala di jalan.",
      icon: <Sparkles className="w-8 h-8 text-[#FF4D00]" />,
      illustration: (
        <div className="p-4 bg-orange-50 dark:bg-orange-950/40 rounded-2xl border border-orange-200 dark:border-orange-800/60 flex items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-orange-800 flex items-center justify-center text-[#FF4D00] shadow-sm">
            <span className="font-black text-lg">T</span>
          </div>
          <div className="text-left text-xs">
            <div className="font-bold text-slate-900 dark:text-white">Kejar Waktu Tanpa Panik</div>
            <div className="text-slate-600 dark:text-slate-400">Rapat penting, ujian, pesawat, atau kondisi darurat</div>
          </div>
        </div>
      ),
      points: [
        "Tidak perlu meninggalkan mobil Anda di tengah kemacetan",
        "Satu ketukan langsung menghubungkan tim penolong",
      ],
    },
    {
      badge: "Inovasi Layanan Tandem",
      title: "Satu Pesanan, Dua Pengemudi",
      subtitle: "Rider dan Driver datang bersamaan ke titik kemacetan Anda.",
      icon: <Bike className="w-8 h-8 text-sky-600" />,
      illustration: (
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-sky-50 dark:bg-sky-950/40 rounded-xl border border-sky-200 dark:border-sky-800 text-left">
            <div className="flex items-center gap-1.5 text-sky-700 dark:text-sky-300 font-bold text-xs">
              <Bike className="w-4 h-4" /> Rider Motor
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
              Membawa Anda menembus macet menuju tujuan dengan cepat.
            </div>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-left">
            <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-bold text-xs">
              <Car className="w-4 h-4" /> Driver Mobil
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
              Mengemudikan mobil Anda menyusul ke tujuan dengan aman.
            </div>
          </div>
        </div>
      ),
      points: [
        "Anda tiba tepat waktu tanpa stres mengemudi",
        "Mobil diserahterimakan kembali di lobi tujuan",
      ],
    },
    {
      badge: "Langkah Praktis",
      title: "Minta Bantuan Dalam 2 Ketukan",
      subtitle: "Tekan tombol utama, pilih tujuan, dan konfirmasi armada.",
      icon: <Navigation className="w-8 h-8 text-emerald-600" />,
      illustration: (
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-left text-xs">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#FF4D00] text-white flex items-center justify-center font-bold text-[10px]">1</div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Tekan tombol “MINTA BANTUAN”</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center font-bold text-[10px]">2</div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Pilih tujuan & armada pengganti penumpang</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">3</div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Pilih metode pembayaran (GoPay, OVO, Kartu)</span>
          </div>
        </div>
      ),
      points: [
        "Bisa pesan untuk 1 orang (motor) atau rombongan (mobil/van)",
        "Tersedia opsi derek & bengkel jika mobil mengalami kendala mesin",
      ],
    },
    {
      badge: "Transparansi Peta",
      title: "Pelacakan Ganda Real-Time",
      subtitle: "Pantau posisi motor Anda dan mobil Anda secara terpisah.",
      icon: <Navigation className="w-8 h-8 text-[#FF4D00]" />,
      illustration: (
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-left text-xs">
          <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-sky-700 dark:text-sky-300">Anda (Motor)</span>
            <span className="font-mono text-emerald-600 font-bold">~18 Menit (Tiba Cepat)</span>
          </div>
          <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-amber-700 dark:text-amber-300">Mobil Anda (Driver)</span>
            <span className="font-mono text-slate-600 dark:text-slate-400 font-bold">~31 Menit (Menyusul)</span>
          </div>
        </div>
      ),
      points: [
        "Fitur chat langsung dengan Rider dan Driver di aplikasi",
        "Peta interaktif dapat digeser (drag) dan diperbesar (zoom)",
      ],
    },
    {
      badge: "Keamanan Terjamin",
      title: "Verifikasi PIN & Proteksi",
      subtitle: "Kunci mobil hanya diserahkan dengan kode PIN 4-digit unik.",
      icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />,
      illustration: (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-left space-y-1.5 text-xs">
          <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-300">
            <KeyRound className="w-4 h-4 text-emerald-600" />
            <span>Kode PIN Unik Handover (Contoh: 4821)</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-[11px]">
            Driver wajib mencocokkan PIN di aplikasi dan mencatat foto inspeksi fisik bodi mobil sebelum berangkat.
          </p>
        </div>
      ),
      points: [
        "Driver terverifikasi SIM A & lolos uji kompetensi",
        "Tombol SOS darurat terhubung ke Call Center 24 Jam",
      ],
    },
  ];

  const currentSlide = slides[step];
  const isLast = step === slides.length - 1;

  const handleFinish = () => {
    setHasSeenTutorial(true);
    onClose();
  };

  const handleNext = () => {
    if (isLast) {
      handleFinish();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 text-slate-900 dark:text-white shadow-modal relative space-y-4">
        {/* Close / Skip button */}
        <button
          onClick={handleFinish}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Tutup Tutorial"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Badge */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-100 text-[#FF4D00] dark:bg-orange-950/70 dark:text-orange-400">
            {currentSlide.badge} • Langkah {step + 1} dari {slides.length}
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
            {currentSlide.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            {currentSlide.subtitle}
          </p>
        </div>

        {/* Visual Illustration */}
        <div className="my-2">{currentSlide.illustration}</div>

        {/* Key Points */}
        <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
          {currentSlide.points.map((pt, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>{pt}</span>
            </div>
          ))}
        </div>

        {/* Dots progress indicator */}
        <div className="flex items-center justify-center gap-1.5 pt-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`h-2 rounded-full transition-all ${
                i === step
                  ? "w-6 bg-[#FF4D00]"
                  : "w-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"
              }`}
              aria-label={`Ke slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {step > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 px-2 py-1"
            >
              Lewati Tutorial
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            className="flex-1 max-w-[200px] ml-auto py-3 rounded-xl bg-[#FF4D00] hover:bg-[#E64500] text-white text-xs font-black shadow-sm transition active:scale-[0.99] flex items-center justify-center gap-1.5"
          >
            <span>{isLast ? "Mulai Gunakan Trobos" : "Lanjut"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
