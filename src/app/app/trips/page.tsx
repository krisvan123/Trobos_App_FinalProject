"use client";

import React, { useState } from "react";
import { useTrobosStore } from "@/store/useTrobosStore";
import { TripHistoryItem } from "@/types/trobos";
import { formatRupiah, formatDateIndo, formatDistance } from "@/lib/formatters";
import {
  Clock,
  Car,
  Bike,
  Truck,
  Star,
  Receipt,
  ChevronRight,
  X,
  AlertTriangle,
  Wrench,
} from "lucide-react";

export default function TripsPage() {
  const tripHistory = useTrobosStore((s) => s.tripHistory);
  const [selectedTrip, setSelectedTrip] = useState<TripHistoryItem | null>(null);
  const [filter, setFilter] = useState<"All" | "Completed" | "Cancelled">("All");

  const filteredTrips = tripHistory.filter((t) => {
    if (filter === "Completed") return t.status === "Completed";
    if (filter === "Cancelled") return t.status === "Cancelled";
    return true;
  });

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto w-full space-y-6 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Riwayat Penyelamatan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Daftar evakuasi mobil dan pengantaran penumpang Anda.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
          {(["All", "Completed", "Cancelled"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                filter === tab
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {tab === "All" ? "Semua" : tab === "Completed" ? "Selesai" : "Batal"}
            </button>
          ))}
        </div>
      </div>

      {/* Trips List */}
      {filteredTrips.length === 0 ? (
        <div className="p-10 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-subtle">
          <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2.5" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Belum ada riwayat penyelamatan
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Laporan evakuasi mobil mogok Trobos Anda akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              onClick={() => setSelectedTrip(trip)}
              className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 transition cursor-pointer shadow-sm group"
            >
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {trip.id}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {formatDateIndo(trip.date)}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="font-semibold text-red-600 dark:text-red-400 flex items-center gap-1 text-[11px]">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{trip.problemLabel || "Mesin Mati"}</span>
                  </span>
                </div>
                <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold text-[11px] bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                  <span>Evakuasi Berhasil</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200" />
                </div>
              </div>

              {/* Route snippet */}
              <div className="py-2.5 flex items-center justify-between text-xs">
                <div className="space-y-1.5 overflow-hidden pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">Mogok: {trip.origin}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">Tujuan Penumpang: {trip.destination}</span>
                  </div>
                  {trip.carDestination && (
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
                      <Wrench className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">Bengkel Derek: {trip.carDestination.split("/")[0]}</span>
                    </div>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <div className="text-base font-black text-slate-900 dark:text-white">
                    {formatRupiah(trip.fare)}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    {formatDistance(trip.distanceKm)} • {trip.vehiclePlate}
                  </div>
                </div>
              </div>

              {/* Personnel Footer */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    {trip.passengerTransportType === "MOTOR" ? (
                      <Bike className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                    ) : (
                      <Car className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                    )}
                    <span>{trip.riderName}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Truck className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                    <span>{trip.driverName}</span>
                  </span>
                </div>
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{trip.rating}.0</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Detail */}
      {selectedTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-5 text-slate-900 dark:text-slate-100 shadow-xl relative">
            <button
              onClick={() => setSelectedTrip(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <Receipt className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Rincian Evakuasi #{selectedTrip.id}
              </h3>
            </div>

            <div className="space-y-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Waktu</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{formatDateIndo(selectedTrip.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Kendala Mobil</span>
                <span className="font-bold text-red-600 dark:text-red-400">{selectedTrip.problemLabel || "Mesin Mati"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Penumpang</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedTrip.passengerCount || 1} Orang</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Jarak Tempuh</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{formatDistance(selectedTrip.distanceKm)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Mobil Dievakuasi</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedTrip.vehiclePlate}</span>
              </div>
              {selectedTrip.carDestination && (
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Bengkel Rekanan</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[170px]">{selectedTrip.carDestination.split("/")[0]}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Armada Penumpang</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedTrip.riderName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Unit Towing</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedTrip.driverName}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-sm">
                <span>Total Biaya</span>
                <span className="text-[#FF4D00]">{formatRupiah(selectedTrip.fare)}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedTrip(null)}
              className="mt-4 w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
