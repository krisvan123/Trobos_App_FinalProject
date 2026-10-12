"use client";

import React from "react";
import { useTrobosStore } from "@/store/useTrobosStore";
import {
  Car,
  Truck,
  ShieldCheck,
  Check,
  Fuel,
  ArrowRight,
  AlertTriangle,
  Wrench,
} from "lucide-react";

export const VehicleHandoverModal: React.FC = () => {
  const currentTrip = useTrobosStore((s) => s.currentTrip);
  const toggleChecklistItem = useTrobosStore((s) => s.toggleChecklistItem);
  const setHandoverFuel = useTrobosStore((s) => s.setHandoverFuel);
  const confirmVehicleHandover = useTrobosStore((s) => s.confirmVehicleHandover);

  if (!currentTrip) return null;

  const handover = currentTrip.handover;
  const vehicle = currentTrip.vehicle;
  const towing = currentTrip.towingUnit;
  const problem = currentTrip.problem;

  const points = [
    { key: "front" as const, label: "Bodi Depan" },
    { key: "rear" as const, label: "Bodi Belakang" },
    { key: "left" as const, label: "Sisi Kiri" },
    { key: "right" as const, label: "Sisi Kanan" },
    { key: "interior" as const, label: "Kabin & Odometer" },
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 sm:bottom-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40 w-full sm:max-w-md px-3 sm:px-4 pb-6 pt-2">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 text-slate-900 dark:text-slate-100 max-h-[85vh] overflow-y-auto overscroll-contain space-y-4">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/60 text-[#FF4D00] dark:text-orange-400 text-[10px] font-bold uppercase mb-1 border border-orange-200 dark:border-orange-800">
            <Truck className="w-3 h-3" />
            <span>Tahap Serah Terima & Inspeksi</span>
          </div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
            Inspeksi Mobil & Handover
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pemeriksaan kondisi bodi dan kendala mobil sebelum diserahkan ke driver / truk gendong.
          </p>
        </div>

        {/* 1. Vehicle & Breakdown Symptom Card */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300">
                <Car className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white">
                  {vehicle.brand} {vehicle.model}
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px]">{vehicle.color} • {vehicle.year}</div>
              </div>
            </div>
            <div className="font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
              {vehicle.plate}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Kendala Terdaftar:</span>
            <span className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{problem.label}</span>
            </span>
          </div>
        </div>

        {/* 2. Towing Operator & Workshop Destination */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400 block">Operator Towing</span>
            <div className="font-bold text-slate-900 dark:text-white mt-0.5">{towing.operatorName}</div>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Flatbed Certified
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400 block">Tujuan Evakuasi</span>
            <div className="font-bold text-slate-900 dark:text-white mt-0.5 truncate">
              {currentTrip.carDestination.name.split("/")[0]}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
              <Wrench className="w-3 h-3 text-slate-400 dark:text-slate-400" /> Bengkel Rekanan
            </div>
          </div>
        </div>

        {/* 3. Physical Condition Checklist & Fuel */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-200">Checklist Kondisi Bodi</span>
            <span className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1">
              <Fuel className="w-3 h-3 text-amber-600 dark:text-amber-400" /> BBM: <strong>{handover.fuelRecorded}%</strong>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-xs">
            {points.map((p) => {
              const isChecked = handover[p.key];
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => toggleChecklistItem(p.key)}
                  className={`p-2 rounded-xl border text-center transition flex items-center justify-center gap-1.5 ${
                    isChecked
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 font-semibold"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  <Check className={`w-3.5 h-3.5 ${isChecked ? "text-emerald-600 dark:text-emerald-400" : "text-slate-300 dark:text-slate-600"}`} />
                  <span className="text-[11px]">{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Safety Guarantee */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Polis asuransi all-risk Rp 1 Miliar aktif begitu mobil diserahkan ke tim Trobos.</span>
        </div>

        {/* Primary CTA */}
        <button
          type="button"
          onClick={confirmVehicleHandover}
          className="w-full py-3.5 rounded-xl bg-[#FF4D00] hover:bg-[#E64500] text-white font-black text-xs tracking-wide shadow-sm transition active:scale-[0.99] flex items-center justify-center gap-2"
        >
          <span>Mulai Evakuasi & Berangkat</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
