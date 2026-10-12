"use client";

import React, { useEffect } from "react";
import { useTrobosStore } from "@/store/useTrobosStore";
import { Radio, ShieldCheck } from "lucide-react";

export const FindingTandemModal: React.FC = () => {
  const resetToIdle = useTrobosStore((s) => s.resetToIdle);
  const assignTandem = useTrobosStore((s) => s.assignTandem);

  useEffect(() => {
    const timer = setTimeout(() => {
      assignTandem();
    }, 3500);
    return () => clearTimeout(timer);
  }, [assignTandem]);

  return (
    <div className="fixed inset-x-0 bottom-0 sm:bottom-6 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40 w-full sm:max-w-md px-3 sm:px-4 pb-6 pt-2">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 text-slate-900 dark:text-slate-100 shadow-xl text-center">
        {/* Simple, gentle icon */}
        <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 flex items-center justify-center mx-auto mb-3 text-[#FF4D00]">
          <Radio className="w-7 h-7 animate-pulse" />
        </div>

        <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
          Mencari Unit Rescue & Tandem...
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
          Menghubungkan armada pengantar penumpang dan driver pengurus mobil terdekat di sekitar lokasi Anda.
        </p>

        {/* Clean ETA Pill */}
        <div className="my-4 py-2.5 px-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Estimasi Kedatangan</span>
          <span className="font-bold text-slate-900 dark:text-white">2–4 Menit</span>
        </div>

        {/* Safety Indicator */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Polis asuransi perlindungan derek otomatis aktif</span>
        </div>

        {/* Cancel Button */}
        <button
          type="button"
          onClick={resetToIdle}
          className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-xs font-semibold transition"
        >
          Batalkan Permintaan
        </button>
      </div>
    </div>
  );
};
