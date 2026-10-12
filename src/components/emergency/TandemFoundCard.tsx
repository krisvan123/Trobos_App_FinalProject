"use client";

import React from "react";
import { useTrobosStore } from "@/store/useTrobosStore";
import {
  Star,
  ShieldCheck,
  Bike,
  Car,
  Truck,
  Phone,
  MessageSquare,
  Navigation,
  Wrench,
} from "lucide-react";

export const TandemFoundCard: React.FC = () => {
  const currentTrip = useTrobosStore((s) => s.currentTrip);
  const setApproaching = useTrobosStore((s) => s.setApproaching);
  const setChatOpen = useTrobosStore((s) => s.setChatOpen);

  if (!currentTrip) return null;

  const towing = currentTrip.towingUnit;
  const transport = currentTrip.passengerTransport;
  const problem = currentTrip.problem;

  return (
    <div className="fixed inset-x-0 bottom-0 sm:bottom-6 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40 w-full sm:max-w-md px-3 sm:px-4 pb-6 pt-2">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 text-slate-900 dark:text-slate-100 space-y-4 max-h-[82vh] overflow-y-auto overscroll-contain">
        {/* Heading + ETA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              Unit Rescue Siaga
            </span>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Bantuan Ditemukan
            </h2>
            <div className="text-xs text-slate-500 dark:text-slate-400">Armada menuju titik penjemputan Anda</div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">ETA Tiba</span>
            <span className="text-base font-black text-[#FF4D00]">3 menit</span>
          </div>
        </div>

        {/* Breakdown Problem & Vehicle Summary */}
        <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
          <div>
            <span className="text-slate-400 dark:text-slate-400 block text-[10px]">Mobil Mogok ({problem.label})</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {currentTrip.vehicle.brand} {currentTrip.vehicle.model}
            </span>
          </div>
          <div className="text-right">
            <span className="font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 block">
              {currentTrip.vehicle.plate}
            </span>
          </div>
        </div>

        {/* Dual Assigned Units: Towing Operator & Passenger Escort */}
        <div className="grid grid-cols-2 gap-2.5 pt-0.5">
          {/* Unit 1: Truk Towing Flatbed */}
          <div className="p-3 rounded-xl bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200/80 dark:border-orange-800">
            <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-orange-800 dark:text-orange-300">
              <Truck className="w-3 h-3 text-[#FF4D00]" />
              <span>Unit Penanganan Mobil</span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-1 truncate">
              {towing.operatorName}
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium truncate">
              {towing.truckModel.split(" ")[0]} ({towing.plate})
            </div>
            <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{towing.operatorRating} Rating</span>
            </div>
          </div>

          {/* Unit 2: Kendaraan Pengantar Penumpang */}
          <div className="p-3 rounded-xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-800">
            <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-sky-800 dark:text-sky-300">
              {transport.type === "MOTOR" ? (
                <Bike className="w-3 h-3 text-sky-600 dark:text-sky-400" />
              ) : (
                <Car className="w-3 h-3 text-sky-600 dark:text-sky-400" />
              )}
              <span>Antar Penumpang</span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-1 truncate">
              {transport.driverName}
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium truncate">
              {transport.title.split("(")[0]}
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400 font-semibold mt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>SIM Verified</span>
            </div>
          </div>
        </div>

        {/* Evacuation Target Notice */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-2">
          <Wrench className="w-4 h-4 text-slate-700 dark:text-slate-300 shrink-0" />
          <span className="truncate">
            Tujuan Evakuasi Mobil: <strong>{currentTrip.carDestination.name.split("/")[0]}</strong>
          </span>
        </div>

        {/* Safety Indicators */}
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2">
          <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Armada Resmi Terverifikasi</span>
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Asuransi Rp 1 Miliar</span>
          </span>
        </div>

        {/* Actions: Primary CTA + Call + Chat */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={setApproaching}
            className="w-full py-3.5 rounded-xl bg-[#FF4D00] hover:bg-[#E64500] text-white font-black text-xs tracking-wide shadow-sm transition active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <Navigation className="w-4 h-4 fill-white" />
            <span>Lacak Unit Rescue</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:${towing.operatorPhone}`}
              className="py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Telepon Driver</span>
            </a>
            <button
              type="button"
              onClick={() => setChatOpen(true)}
              className="py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <MessageSquare className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>Chat Live Driver</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
