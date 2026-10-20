"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Truck,
  Car,
  Navigation,
  CheckCircle,
  MapPin,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  Wrench,
  Phone,
  MessageSquare,
  Sun,
  Moon,
  Clock,
  Check,
  X,
  PhoneCall,
  Send,
} from "lucide-react";
import { formatRupiah } from "@/lib/formatters";
import { useTrobosStore } from "@/store/useTrobosStore";

export default function DriverDashboardPage() {
  const theme = useTrobosStore((s) => s.theme);
  const toggleTheme = useTrobosStore((s) => s.toggleTheme);

  const [isOnline, setIsOnline] = useState(true);
  const [hasIncoming, setHasIncoming] = useState(true);
  const [driverState, setDriverState] = useState<
    "IDLE" | "ACCEPTED" | "ARRIVED" | "IN_TRANSIT" | "COMPLETED"
  >("IDLE");

  const [earningsToday, setEarningsToday] = useState(550000);
  const [tripsCompleted, setTripsCompleted] = useState(4);

  // Driver verification & inspection state
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [pinVerified, setPinVerified] = useState(false);
  const [checklist, setChecklist] = useState({
    front: false,
    rear: false,
    sides: false,
    interior: false,
    keyHandover: false,
  });

  // Communication modals
  const [isDriverChatOpen, setIsDriverChatOpen] = useState(false);
  const [isDriverCallOpen, setIsDriverCallOpen] = useState(false);
  const [driverChatMessages, setDriverChatMessages] = useState<{ sender: "driver" | "user"; text: string; time: string }[]>([
    { sender: "user", text: "Halo pak driver, posisi sudah di mana ya? Mobil kami di bahu jalan Sudirman.", time: "14:02" },
    { sender: "driver", text: "Halo kak Andi, saya sudah dekat sekitar 500 meter lagi, mohon nyalakan lampu hazard ya kak.", time: "14:03" },
  ]);
  const [chatInputText, setChatInputText] = useState("");

  const handleSendDriverMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputText.trim()) return;
    const newMsg = { sender: "driver" as const, text: chatInputText.trim(), time: "Baru saja" };
    setDriverChatMessages((prev) => [...prev, newMsg]);
    setChatInputText("");

    setTimeout(() => {
      setDriverChatMessages((prev) => [
        ...prev,
        { sender: "user", text: "Baik pak, hazard sudah menyala. Terima kasih!", time: "Baru saja" },
      ]);
    }, 1200);
  };

  const handleAccept = () => {
    setHasIncoming(false);
    setDriverState("ACCEPTED");
  };

  const handleDecline = () => {
    setHasIncoming(false);
  };

  const handleArrived = () => {
    setDriverState("ARRIVED");
  };

  const handleVerifyPin = () => {
    if (pinInput === "4821") {
      setPinVerified(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleStartTransit = () => {
    setDriverState("IN_TRANSIT");
  };

  const handleComplete = () => {
    setDriverState("COMPLETED");
    setEarningsToday((e) => e + 110000);
    setTripsCompleted((t) => t + 1);
  };

  const handleReset = () => {
    setDriverState("IDLE");
    setHasIncoming(true);
    setPinInput("");
    setPinVerified(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/app"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Mode Pengguna</span>
          </Link>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
          <div className="flex items-center gap-1.5">
            <span className="text-base font-black tracking-tight text-slate-900 dark:text-white">
              Trobos Towing Operator
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Online / Offline Toggle */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-bold text-xs transition ${
              isOnline
                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800"
                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
              }`}
            />
            <span>{isOnline ? "TOWING SIAGA" : "OFFLINE"}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 space-y-4">
        {/* Earnings Summary */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Pendapatan Hari Ini</div>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
              {formatRupiah(earningsToday)}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Evakuasi Selesai</div>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
              {tripsCompleted} Unit
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Rating Driver</div>
            <div className="text-lg font-black text-amber-500 mt-0.5">
              ★ 4.96
            </div>
          </div>
        </div>

        {/* Radar indicator when online & idle */}
        {isOnline && !hasIncoming && driverState === "IDLE" && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                <Truck className="w-6 h-6" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Mencari Pesanan Evakuasi Sekitar
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Radius pemantauan 5 km di Sudirman - SCBD - Thamrin
              </p>
            </div>
            <button
              type="button"
              onClick={() => setHasIncoming(true)}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition"
            >
              Simulasikan Permintaan Masuk
            </button>
          </div>
        )}

        {/* INCOMING BREAKDOWN RESCUE ORDER POPUP */}
        {isOnline && hasIncoming && driverState === "IDLE" && (
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-[#FF4D00] shadow-xl space-y-3.5 animate-slide-up">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D00] animate-pulse" />
                <span className="text-xs font-black text-[#FF4D00] uppercase">
                  Permintaan Derek Masuk!
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                Jarak Jemput: ~800m (3 mnt)
              </span>
            </div>

            <div className="flex justify-between items-baseline">
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Bagi Hasil Driver Towing</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">Rp 110.000</div>
              </div>
              <div className="text-right text-xs">
                <div className="font-bold text-slate-900 dark:text-white">Honda Civic RS Turbo</div>
                <div className="text-slate-500 dark:text-slate-400 font-mono">B 1234 XYZ</div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Kendala Mobil:</span>
                <span className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Mesin Mati Total
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 pt-1 border-t border-slate-200 dark:border-slate-700">
                <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>Titik Mogok: <strong>Jl. Sudirman Kav. 28 (Bahu Jalan)</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <Wrench className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400 shrink-0" />
                <span>Tujuan Evakuasi: <strong>Bengkel Resmi Honda Autoland SCBD</strong></span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleDecline}
                className="py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                Tolak
              </button>
              <button
                type="button"
                onClick={handleAccept}
                className="py-3 rounded-xl bg-[#FF4D00] hover:bg-[#E64400] text-white font-black text-xs shadow-sm transition"
              >
                Terima Tugas Evakuasi
              </button>
            </div>
          </div>
        )}

        {/* STAGE 1: ACCEPTED - HEADING TO PICKUP */}
        {driverState === "ACCEPTED" && (
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-800">
                  Tahap 1: Menuju Titik Mogok
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white mt-1 flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-orange-600" />
                  <span>Jl. Sudirman Kav. 28</span>
                </h3>
              </div>
              <span className="text-sm font-black text-[#FF4D00]">ETA 3 mnt</span>
            </div>

            {/* Customer Snapshot */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">Andi Pratama (Pengguna)</div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px]">Honda Civic RS • B 1234 XYZ</div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsDriverChatOpen(true)}
                  className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 transition"
                  title="Chat Pengguna"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsDriverCallOpen(true)}
                  className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition"
                  title="Telepon Pengguna"
                >
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Arahkan armada flatbed ke bahu jalan Sudirman Kav. 28. Partner pengantar penumpang meluncur terpisah.
            </p>

            <button
              onClick={handleArrived}
              className="w-full py-3.5 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs transition shadow-sm"
            >
              Saya Sudah Tiba di Depan Mobil Mogok
            </button>
          </div>
        )}

        {/* STAGE 2: ARRIVED - PIN & INSPECTION */}
        {driverState === "ARRIVED" && (
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                Tahap 2: Verifikasi PIN & Serah Terima
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-white mt-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Pencocokan PIN & Inspeksi 5 Sudut</span>
              </h3>
            </div>

            {/* PIN Verification Section */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Minta 4 Digit PIN dari Pengguna:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setPinInput("4821");
                    setPinVerified(true);
                  }}
                  className="text-[10px] text-sky-600 dark:text-sky-400 font-bold hover:underline"
                >
                  Quick Fill Demo (4821)
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Ketik 4821"
                  className="flex-1 px-3.5 py-2.5 text-center font-mono font-bold tracking-widest text-base rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-[#FF4D00]"
                />
                <button
                  type="button"
                  onClick={handleVerifyPin}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs"
                >
                  Verifikasi
                </button>
              </div>

              {pinVerified && (
                <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <Check className="w-4 h-4" /> PIN Cocok! Identitas pengguna terkonfirmasi.
                </div>
              )}

              {pinError && (
                <div className="text-xs font-semibold text-red-600 flex items-center gap-1">
                  <X className="w-4 h-4" /> PIN salah. Coba PIN demo "4821".
                </div>
              )}
            </div>

            {/* Checklist items */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Checklist Serah Terima Bodi & Kunci:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { key: "front", label: "Bodi Depan & Mesin" },
                  { key: "rear", label: "Bodi Belakang" },
                  { key: "sides", label: "Bodi Samping Kiri & Kanan" },
                  { key: "keyHandover", label: "Kunci Kontak Diterima" },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 font-semibold flex items-center gap-2"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleStartTransit}
              disabled={!pinVerified || !Object.values(checklist).every(Boolean)}
              className={`w-full py-3.5 rounded-2xl font-bold text-xs shadow-sm transition ${
                pinVerified
                  ? "bg-[#FF4D00] hover:bg-[#E64400] text-white active:scale-[0.99]"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
              }`}
            >
              {pinVerified
                ? "Mobil Aman di Flatbed, Mulai Perjalanan ke Bengkel"
                : "Masukkan & Verifikasi PIN Terlebih Dahulu"}
            </button>
          </div>
        )}

        {/* STAGE 3: IN TRANSIT */}
        {driverState === "IN_TRANSIT" && (
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-full border border-sky-200 dark:border-sky-800">
                  Tahap 3: Perjalanan Derek
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white mt-1 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#FF4D00]" />
                  <span>Menuju Bengkel Honda Autoland SCBD</span>
                </h3>
              </div>
              <span className="text-sm font-black text-sky-600">8 mnt lagi</span>
            </div>

            {/* Live GPS simulated widget */}
            <div className="p-4 rounded-2xl bg-slate-950 text-white space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Navigasi GPS Aktif</span>
                <span className="font-mono text-emerald-400 font-bold">42 km/jam</span>
              </div>
              <div className="text-sm font-bold flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#FF4D00]" />
                <span>300 meter: Belok Kanan ke Jl. Jend. Sudirman Pintu SCBD</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                <div className="bg-[#FF4D00] h-full rounded-full w-2/3" />
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Mobil pengguna terlindungi asuransi all-risk Rp 1 Miliar. Pertahankan kecepatan aman di bawah 50 km/jam.
            </p>

            <button
              onClick={handleComplete}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm"
            >
              Tiba di Bengkel & Serahkan Mobil ke Teknisi
            </button>
          </div>
        )}

        {/* STAGE 4: COMPLETED */}
        {driverState === "COMPLETED" && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm space-y-4 animate-scale-in">
            <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Evakuasi Sukses Diselesaikan!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Mobil Honda Civic RS diterima dengan baik oleh kepala bengkel di Honda Autoland SCBD.
              </p>
            </div>

            {/* Income Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Tarif Tugas Towing</span>
                <span className="font-bold text-slate-900 dark:text-white">Rp 110.000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Tip dari Pengguna</span>
                <span className="font-bold text-emerald-600">+Rp 15.000</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-sm">
                <span>Total Ditambahkan ke Saldo</span>
                <span className="text-[#FF4D00]">Rp 125.000</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3.5 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition shadow-sm"
            >
              Kembali Siaga untuk Misi Berikutnya
            </button>
          </div>
        )}
      </main>

      {/* Driver Simulated Chat Modal */}
      {isDriverChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-sm flex flex-col h-[480px] shadow-modal overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Chat Pengguna (Andi Pratama)</h4>
                <p className="text-[10px] text-emerald-600">Online • Honda Civic B 1234 XYZ</p>
              </div>
              <button
                type="button"
                onClick={() => setIsDriverChatOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-2.5 text-xs">
              {driverChatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${
                    msg.sender === "driver" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-2xl max-w-[80%] ${
                      msg.sender === "driver"
                        ? "bg-[#FF4D00] text-white rounded-br-xs"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5">{msg.time}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendDriverMessage} className="p-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                value={chatInputText}
                onChange={(e) => setChatInputText(e.target.value)}
                placeholder="Balas pesan pengguna..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-[#FF4D00] text-white hover:bg-[#E64400]"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Driver Simulated Call Modal */}
      {isDriverCallOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-slate-900 text-white rounded-3xl p-6 w-full max-w-xs text-center space-y-4 shadow-modal">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center animate-pulse">
              <PhoneCall className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-bold">Andi Pratama</h4>
              <p className="text-xs text-slate-400 mt-0.5">Menghubungkan suara darurat VoIP...</p>
            </div>
            <p className="text-[11px] text-slate-400">
              Panggilan gratis terlindungi enkripsi end-to-end Trobos.
            </p>
            <button
              type="button"
              onClick={() => setIsDriverCallOpen(false)}
              className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
            >
              Akhiri Panggilan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
