"use client";

import React, { useState } from "react";
import { BottomSheet } from "@/components/common/BottomSheet";
import { useTrobosStore } from "@/store/useTrobosStore";
import {
  MOCK_LOCATIONS,
  BREAKDOWN_PROBLEMS,
  getPassengerTransportOption,
} from "@/lib/mockData";
import { BreakdownProblemId, PaymentMethod, ServiceType } from "@/types/trobos";
import { formatRupiah } from "@/lib/formatters";
import { calculateDemoFare } from "@/lib/pricing";
import {
  MapPin,
  Car,
  Truck,
  Bike,
  Users,
  Check,
  ShieldCheck,
  AlertTriangle,
  CircleDot,
  BatteryWarning,
  Flame,
  KeyRound,
  ShieldAlert,
  HelpCircle,
  Plus,
  Minus,
  Wrench,
  ChevronDown,
  ChevronUp,
  Zap,
  Info,
  CreditCard,
  Wallet,
  Camera,
  Trash2,
  Upload,
} from "lucide-react";

interface EmergencyBookingSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyBookingSheet: React.FC<EmergencyBookingSheetProps> = ({
  isOpen,
  onClose,
}) => {
  const currentTrip = useTrobosStore((s) => s.currentTrip);
  const pickupLocation = useTrobosStore((s) => s.pickupLocation);
  const selectedDestination = useTrobosStore((s) => s.selectedDestination);
  const setSelectedDestination = useTrobosStore((s) => s.setSelectedDestination);
  const selectedWorkshop = useTrobosStore((s) => s.selectedWorkshop);
  const setSelectedWorkshop = useTrobosStore((s) => s.setSelectedWorkshop);
  const carDestinationType = useTrobosStore((s) => s.carDestinationType);
  const setCarDestinationType = useTrobosStore((s) => s.setCarDestinationType);
  const selectedProblemId = useTrobosStore((s) => s.selectedProblemId);
  const setSelectedProblemId = useTrobosStore((s) => s.setSelectedProblemId);
  const passengerCount = useTrobosStore((s) => s.passengerCount);
  const setPassengerCount = useTrobosStore((s) => s.setPassengerCount);
  const vehicles = useTrobosStore((s) => s.vehicles);
  const activeVehicleId = useTrobosStore((s) => s.activeVehicleId);
  const setActiveVehicleId = useTrobosStore((s) => s.setActiveVehicleId);
  const serviceType = useTrobosStore((s) => s.serviceType);
  const setServiceType = useTrobosStore((s) => s.setServiceType);
  const paymentMethod = useTrobosStore((s) => s.paymentMethod);
  const setPaymentMethod = useTrobosStore((s) => s.setPaymentMethod);
  const damagePhotoUrl = useTrobosStore((s) => s.damagePhotoUrl);
  const setDamagePhoto = useTrobosStore((s) => s.setDamagePhoto);
  const confirmBooking = useTrobosStore((s) => s.confirmBooking);
  const returnToBooking = useTrobosStore((s) => s.returnToBooking);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [showBreakdown, setShowBreakdown] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const activeVehicle =
    vehicles.find((v) => v.id === activeVehicleId) || vehicles[0];

  const passengerTransport = getPassengerTransportOption(passengerCount);
  const estimatedFare = calculateDemoFare({
    serviceType,
    origin: pickupLocation,
    passengerDestination: selectedDestination,
    carDestination: serviceType === "MECHANIC" && carDestinationType === "WORKSHOP" ? selectedWorkshop : selectedDestination,
    passengerCount,
  });

  const handleConfirm = async () => {
    if (submitting) return;
    setSubmitError("");
    const remoteMode = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    confirmBooking();
    if (!remoteMode) return;
    // Saving a demo record is optional. Guests may explore the full booking
    // and tracking flow without creating an account.
    try {
      const identity = await fetch("/api/auth", { cache: "no-store" });
      const session = await identity.json().catch(() => ({}));
      if (!identity.ok || !session.authenticated) return;
    } catch { return; }
    const trip = useTrobosStore.getState().currentTrip;
    if (!trip) return;
    setSubmitting(true);
    try {
      const response = await fetch("/api/trips", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trip }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Gagal menyimpan permintaan demo");
      }
    } catch (reason) {
      returnToBooking();
      setSubmitError(reason instanceof Error ? reason.message : "Koneksi gagal. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Harap unggah berkas gambar (JPG, PNG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Ukuran foto maksimal 5 MB.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setDamagePhoto(previewUrl, file.name);
  };

  const getProblemIcon = (id: BreakdownProblemId) => {
    switch (id) {
      case "engine_failure":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "flat_tire":
        return <CircleDot className="w-4 h-4 text-amber-600" />;
      case "battery_dead":
        return <BatteryWarning className="w-4 h-4 text-orange-600" />;
      case "overheat":
        return <Flame className="w-4 h-4 text-rose-600" />;
      case "starter_failure":
        return <KeyRound className="w-4 h-4 text-yellow-600" />;
      case "minor_accident":
        return <ShieldAlert className="w-4 h-4 text-purple-600" />;
      default:
        return <HelpCircle className="w-4 h-4 text-slate-600" />;
    }
  };

  const paymentOptions: { id: PaymentMethod; label: string; desc: string; icon: React.ReactNode }[] = [
    { id: "GOPAY", label: "GoPay", desc: "Metode demo — tanpa pembayaran", icon: <Wallet className="w-4 h-4 text-sky-600" /> },
    { id: "OVO", label: "OVO", desc: "Metode demo — tanpa pembayaran", icon: <Wallet className="w-4 h-4 text-purple-600" /> },
    { id: "QRIS", label: "QRIS Instan", desc: "BCA / Mandiri / ShopeePay", icon: <Zap className="w-4 h-4 text-emerald-600" /> },
    { id: "CARD", label: "Kartu Debit/Kredit", desc: "Visa / Mastercard", icon: <CreditCard className="w-4 h-4 text-blue-600" /> },
    { id: "CASH", label: "Tunai", desc: "Bayar langsung ke pengemudi", icon: <Users className="w-4 h-4 text-slate-600" /> },
  ];

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      mode="map"
      title="Atur perjalanan TROBOS"
      subtitle="Pilih layanan, tujuan dan kendaraan untuk simulasi."
      maxHeight="max-h-[92vh]"
    >
      <div className="space-y-4 pb-8 text-slate-900 dark:text-white">
        {/* 1. SERVICE TYPE SWITCHER: Tandem (Primary) vs Mechanic (Secondary) */}
        <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl flex border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setServiceType("TANDEM")}
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${
              serviceType === "TANDEM"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Bike className="w-4 h-4 text-[#FF4D00]" />
            <span>Tandem Macet (Rider + Driver)</span>
          </button>

          <button
            type="button"
            onClick={() => setServiceType("MECHANIC")}
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${
              serviceType === "MECHANIC"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Truck className="w-4 h-4 text-orange-600" />
            <span>Bantuan Derek & Bengkel</span>
          </button>
        </div>

        {/* Informative Explanation of Selected Service */}
        <div className="p-3.5 rounded-2xl bg-orange-50/80 dark:bg-orange-950/30 border border-orange-200/80 dark:border-orange-900/50 flex items-start gap-2.5 text-xs">
          <Info className="w-4 h-4 text-[#FF4D00] shrink-0 mt-0.5" />
          <div className="text-orange-950 dark:text-orange-200 leading-relaxed font-medium">
            {serviceType === "TANDEM" ? (
              <span>
                <strong className="text-[#FF4D00]">Sistem Tandem:</strong> 1 Rider motor membawa Anda menembus macet menuju tujuan, sementara 1 Driver mobil mengemudikan mobil Anda menyusul ke tujuan yang sama.
              </span>
            ) : (
              <span>
                <strong className="text-orange-600">Derek & Pengantaran:</strong> Truk towing flatbed menderek mobil Anda ke bengkel rekanan resmi, sementara armada pengganti mengantarkan seluruh rombongan ke tujuan.
              </span>
            )}
          </div>
        </div>

        {/* 2. Registered Vehicle Selection */}
        <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 flex items-center justify-between shadow-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Mobil Anda</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {activeVehicle.brand} {activeVehicle.model}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                  {activeVehicle.plate}
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Kendaraan Demo
                </span>
              </div>
            </div>
          </div>
          {vehicles.length > 1 && (
            <button
              type="button"
              onClick={() => {
                const nextIndex =
                  (vehicles.findIndex((v) => v.id === activeVehicleId) + 1) %
                  vehicles.length;
                setActiveVehicleId(vehicles[nextIndex].id);
              }}
              className="text-xs font-semibold text-[#FF4D00] hover:text-[#E64400] px-2.5 py-1.5 rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/50 transition"
            >
              Ganti
            </button>
          )}
        </div>

        {/* 3. Passenger Count Stepper & Dynamic Transport Recommendation */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#FF4D00]" />
                <span>Berapa orang yang perlu diantar?</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Kendaraan pengganti disesuaikan secara dinamis dengan jumlah penumpang
              </div>
            </div>

            {/* Stepper Control */}
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <button
                type="button"
                onClick={() => setPassengerCount(passengerCount - 1)}
                disabled={passengerCount <= 1}
                aria-label="Kurangi penumpang"
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-200 font-bold transition"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 text-center font-black text-sm text-slate-900 dark:text-white font-mono">
                {passengerCount}
              </span>
              <button
                type="button"
                onClick={() => setPassengerCount(passengerCount + 1)}
                disabled={passengerCount >= 8}
                aria-label="Tambah penumpang"
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white font-bold transition"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* DYNAMIC VEHICLE RECOMMENDATION BOX */}
          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700/80 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Rekomendasi Armada Penumpang
              </span>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                Kapasitas: {passengerTransport.capacityLabel}
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 flex items-center justify-center text-[#FF4D00] shrink-0">
                {passengerTransport.type === "MOTOR" ? (
                  <Bike className="w-5 h-5" />
                ) : (
                  <Car className="w-5 h-5" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-black text-slate-900 dark:text-white">
                  {passengerTransport.title}
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1">
                  {passengerTransport.description}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Problem & Damage Photo Submission (if Mechanic selected or optional condition report) */}
        {serviceType === "MECHANIC" && (
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  <span>Apa Kendala Mobil Anda?</span>
                </label>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Pilih 1 masalah</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {BREAKDOWN_PROBLEMS.map((problem) => {
                  const isSelected = selectedProblemId === problem.id;
                  return (
                    <button
                      key={problem.id}
                      type="button"
                      onClick={() => setSelectedProblemId(problem.id)}
                      className={`p-2.5 rounded-xl text-left border transition-all flex items-start gap-2.5 ${
                        isSelected
                          ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                      }`}
                    >
                      <div className="p-1 rounded-lg bg-white/80 dark:bg-slate-900/80 shrink-0 mt-0.5">
                        {getProblemIcon(problem.id)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold leading-tight">{problem.label}</div>
                        <div
                          className={`text-[10px] line-clamp-1 mt-0.5 ${
                            isSelected ? "text-slate-300 dark:text-slate-600" : "text-slate-400 dark:text-slate-400"
                          }`}
                        >
                          {problem.description}
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Damage Photo Upload Box */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#FF4D00]" />
                  <span>Foto Kerusakan / Kendala Fisik (Opsional)</span>
                </span>
                <span className="text-[10px] text-slate-400">Maks. 5 MB</span>
              </div>

              {damagePhotoUrl ? (
                <div className="flex items-center gap-3 p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <img
                    src={damagePhotoUrl}
                    alt="Foto Kerusakan"
                    className="w-14 h-14 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0 text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                      Foto dipilih untuk pratinjau
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      Belum dikirim ke tim mekanik (demo)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDamagePhoto(null)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition"
                    title="Hapus Foto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-[#FF4D00] transition cursor-pointer bg-white dark:bg-slate-900">
                    <Upload className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Klik untuk unggah foto bagian mobil yang rusak
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      Membantu operator derek menyiapkan alat yang sesuai
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {photoError && (
                    <p className="text-[11px] text-red-600 mt-1">{photoError}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. Origin & Dual Destination Routing */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 space-y-3">
          {/* Pickup / Origin */}
          <div className="flex items-start gap-3">
            <div className="mt-1 flex flex-col items-center">
              <div className="w-3.5 h-3.5 rounded-full bg-[#FF4D00] ring-4 ring-orange-100 dark:ring-orange-950" />
              <div className="w-0.5 h-6 bg-slate-300 dark:bg-slate-600 my-0.5" />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-[10px] font-bold text-[#FF4D00] uppercase tracking-wide">
                Titik Penjemputan Anda
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {pickupLocation.name}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {pickupLocation.address}
              </div>
            </div>
          </div>

          {/* Destination */}
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 ring-4 ring-emerald-100 dark:ring-emerald-950 flex items-center justify-center">
                <MapPin className="w-2 h-2 text-white" />
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                Tujuan Penumpang ({passengerTransport.type === "MOTOR" ? "Motor" : "Mobil"})
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {selectedDestination.name}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {selectedDestination.address}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Destination Chips for Passengers */}
        <div>
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
            Pilih Lokasi Tujuan Anda:
          </div>
          <div className="grid grid-cols-2 gap-2">
            {MOCK_LOCATIONS.destinations.map((dest) => {
              const isSelected = selectedDestination.name === dest.name;
              return (
                <button
                  key={dest.name}
                  type="button"
                  onClick={() => setSelectedDestination(dest)}
                  className={`p-2.5 rounded-xl text-left border transition-all text-xs flex items-center justify-between ${
                    isSelected
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  <div className="truncate pr-1">
                    <div className="font-bold truncate">{dest.name.split("/")[0]}</div>
                    <div className={`text-[10px] truncate ${isSelected ? "text-slate-300 dark:text-slate-600" : "text-slate-400"}`}>
                      {dest.areaTag}
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-orange-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {serviceType === "MECHANIC" && (
          <div className="p-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold">Tujuan Mobil Mogok</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button type="button" onClick={() => setCarDestinationType("WORKSHOP")}
                className={carDestinationType === "WORKSHOP" ? "border-2 border-[#FF4D00] rounded-xl p-2 font-semibold" : "border border-slate-300 rounded-xl p-2"}>
                Bengkel Contoh
              </button>
              <button type="button" onClick={() => setCarDestinationType("SAME_AS_PASSENGER")}
                className={carDestinationType === "SAME_AS_PASSENGER" ? "border-2 border-[#FF4D00] rounded-xl p-2 font-semibold" : "border border-slate-300 rounded-xl p-2"}>
                Sama dengan Penumpang
              </button>
            </div>
            {carDestinationType === "WORKSHOP" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {MOCK_LOCATIONS.workshops.map((workshop) => (
                  <button key={workshop.name} type="button" onClick={() => setSelectedWorkshop(workshop)}
                    className={selectedWorkshop.name === workshop.name
                      ? "rounded-xl border-2 border-[#FF4D00] bg-orange-50 dark:bg-slate-800 p-3 text-left text-xs font-semibold"
                      : "rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-left text-xs"}>
                    {workshop.name}
                  </button>
                ))}
              </div>
            )}
            <p className="text-[11px] text-slate-500">Bengkel adalah contoh, belum ada kemitraan resmi yang diverifikasi.</p>
          </div>
        )}
        {/* 6. Payment Method Selection (User testing request #12) */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-[#FF4D00]" />
              <span>Metode Pembayaran (Demo)</span>
            </span>
            <span className="text-[10px] text-slate-400">Pilihan Terpilih</span>
          </div>

          <div className="space-y-1.5 pt-1">
            {paymentOptions.map((opt) => {
              const isSelected = paymentMethod === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPaymentMethod(opt.id)}
                  className={`w-full p-2.5 rounded-xl border text-xs flex items-center justify-between transition ${
                    isSelected
                      ? "bg-white dark:bg-slate-900 border-[#FF4D00] ring-1 ring-[#FF4D00] shadow-sm"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      {opt.icon}
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-slate-900 dark:text-white">{opt.label}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{opt.desc}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#FF4D00] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 7. Fare Summary Card */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Estimasi Biaya Demo
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white">
                {formatRupiah(estimatedFare.totalFare)}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
            >
              <span>{showBreakdown ? "Sembunyikan" : "Rincian"}</span>
              {showBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {showBreakdown && (
            <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              {serviceType === "TANDEM" ? (
                <>
                  <div className="flex justify-between">
                    <span>Tarif Dasar Tandem</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{formatRupiah(estimatedFare.baseFare)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Layanan Penyelamatan (Rider + Driver)</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{formatRupiah(estimatedFare.emergencyService)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Jarak Perkiraan ({estimatedFare.distanceKm} km)</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{formatRupiah(estimatedFare.distanceFare)}</span>
                  </div>
                  <div className="flex justify-between text-orange-600 dark:text-orange-400 font-medium">
                    <span>Lonjakan Jam Sibuk / Kemacetan</span>
                    <span>+{formatRupiah(estimatedFare.surgeFare)}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span>Evakuasi Derek Towing Flatbed</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{formatRupiah(estimatedFare.towingFare)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Armada Pengantar Penumpang ({passengerTransport.title})</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{formatRupiah(estimatedFare.baseFare)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Layanan Siaga & Inspeksi Bodi</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{formatRupiah(estimatedFare.emergencyService)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Jarak Perkiraan ({estimatedFare.distanceKm} km)</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{formatRupiah(estimatedFare.distanceFare)}</span>
                  </div>
                </>
              )}
              <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium pt-1.5 flex items-center gap-1 border-t border-slate-200 dark:border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Asuransi tidak aktif dalam prototipe ini.</span>
              </div>
            </div>
          )}
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400">Tarif dan ETA adalah ilustrasi dari perkiraan jarak geografis, bukan harga atau lalu lintas aktual. Tidak ada pembayaran dalam demo.</p>
        {/* 8. Action Buttons (DOMINANT CTA: MINTA BANTUAN) */}
        {submitError && <p role="alert" className="rounded-xl bg-red-50 p-3 text-xs text-red-700">{submitError}</p>}
        <div className="pt-2 space-y-2">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className="w-full py-4 rounded-2xl bg-[#FF4D00] hover:bg-[#E64400] active:scale-[0.99] text-white font-black text-base shadow-elevated transition flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5 fill-white" />
            <span>{submitting ? "Menyimpan permintaan demo..." : "SIMULASIKAN PERMINTAAN"}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-xs font-semibold transition"
          >
            Batal
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};
