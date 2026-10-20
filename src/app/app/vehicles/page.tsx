"use client";

import React, { useState } from "react";
import { useTrobosStore } from "@/store/useTrobosStore";
import { Vehicle } from "@/types/trobos";
import {
  Car,
  Plus,
  ShieldCheck,
  Fuel,
  Check,
  X,
  Truck,
} from "lucide-react";

export default function VehiclesPage() {
  const vehicles = useTrobosStore((s) => s.vehicles);
  const activeVehicleId = useTrobosStore((s) => s.activeVehicleId);
  const setActiveVehicleId = useTrobosStore((s) => s.setActiveVehicleId);
  const addVehicle = useTrobosStore((s) => s.addVehicle);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    brand: "Toyota",
    model: "Fortuner VRZ",
    year: 2023,
    color: "Hitam",
    plate: "B 9999 PRO",
    fuelLevel: 75,
    type: "SUV" as const,
    transmission: "Automatic" as const,
  });

  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    const newVeh: Vehicle = {
      id: `veh_${Date.now()}`,
      brand: formData.brand,
      model: formData.model,
      year: Number(formData.year),
      color: formData.color,
      plate: formData.plate.toUpperCase(),
      fuelLevel: Number(formData.fuelLevel),
      stnkVerified: false,
      type: formData.type,
      transmission: formData.transmission,
    };
    addVehicle(newVeh);
    setIsAddModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto w-full space-y-6 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Kendaraan Terdaftar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Daftar kendaraan contoh untuk menjalankan simulasi Tandem dan Derek & Rescue. Belum ada verifikasi atau operator sungguhan.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Mobil</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {vehicles.map((v) => {
          const isActive = v.id === activeVehicleId;
          return (
            <div
              key={v.id}
              onClick={() => setActiveVehicleId(v.id)}
              className={`rounded-2xl p-4 border transition cursor-pointer relative shadow-sm ${
                isActive
                  ? "bg-white dark:bg-slate-900 border-[#C27651] ring-1 ring-[#C27651]"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              {isActive && (
                <span className="absolute top-3.5 right-3.5 px-2 py-0.5 rounded-full bg-[#C27651]/10 dark:bg-[#C27651]/15 text-[#C27651] dark:text-[#DE9D7A] border border-[#C27651]/30 dark:border-[#C27651]/35 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Check className="w-3 h-3" /> Mobil Utama
                </span>
              )}

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {v.brand} {v.model}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {v.color} • {v.year}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Plat Polisi</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    {v.plate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Transmisi</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{v.transmission}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Level BBM</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Fuel className="w-3 h-3" /> {v.fuelLevel}%
                  </span>
                </div>
                <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700 flex justify-between text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Data STNK & proteksi belum diverifikasi
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-5 text-slate-900 dark:text-slate-100 shadow-xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
              Daftarkan Kendaraan Baru
            </h3>

            <form onSubmit={handleSaveVehicle} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1">Merek</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1">Model</label>
                  <input
                    type="text"
                    required
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1">Plat Polisi</label>
                  <input
                    type="text"
                    required
                    value={formData.plate}
                    onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-slate-900 dark:text-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1">Tahun</label>
                  <input
                    type="number"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold hover:bg-slate-800"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
