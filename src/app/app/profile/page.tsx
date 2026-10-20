"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTrobosStore } from "@/store/useTrobosStore";
import {
  User,
  Car,
  ShieldCheck,
  PhoneCall,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  CheckCircle2,
  Phone,
  Mail,
  Shield,
  X,
  Sun,
  Moon,
  BookOpen,
} from "lucide-react";
import { LogoutConfirmModal } from "@/components/common/LogoutConfirmModal";

export default function ProfilePage() {
  const user = useTrobosStore((s) => s.user);
  const vehicles = useTrobosStore((s) => s.vehicles);
  const theme = useTrobosStore((s) => s.theme);
  const toggleTheme = useTrobosStore((s) => s.toggleTheme);
  const setTutorialOpen = useTrobosStore((s) => s.setTutorialOpen);

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Settings State
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  return (
    <div className="p-4 sm:p-8 max-w-xl mx-auto w-full space-y-6 text-slate-900 dark:text-slate-100">
      {/* Header: User Profile Overview */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card flex items-center gap-4">
        <div className="w-16 h-16 shrink-0 grid place-items-center rounded-full bg-[#D58E69]/15 text-[#C27651] border border-[#D58E69]/25">
          <User className="w-8 h-8"/>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black text-slate-900 dark:text-white truncate">{user.name}</h1>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3 h-3 text-slate-400" /> Profil Demo
            </span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">{user.phone || "Tidak disetel (demo)"}</div>
          <div className="text-xs text-slate-400 dark:text-slate-500 truncate">{user.email || "Mode tamu"}</div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2">
        <p className="text-xs font-semibold text-slate-900 dark:text-white">Akun tidak wajib untuk simulasi</p>
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          Semua alur pemesanan dan tracking demo dapat dicoba sebagai tamu. Login hanya diperlukan bila
          kamu ingin memakai fitur penyimpanan akun saat backend Supabase diaktifkan.
        </p>
        <Link href="/login" className="inline-flex mt-1 text-xs font-bold text-[#C27651]">Lihat opsi masuk akun →</Link>
      </div>
      {/* SECTION 1: ACCOUNT */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">
          ACCOUNT
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 shadow-card">
          <button
            type="button"
            onClick={() => setIsPersonalInfoOpen(true)}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition text-slate-800 dark:text-slate-200 text-left"
          >
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">Personal Information</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-xs text-slate-500 dark:text-slate-400">Lengkap</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>

      {/* SECTION 2: VEHICLE */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">
          VEHICLE
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 shadow-card">
          <Link
            href="/app/vehicles"
            className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition text-slate-800 dark:text-slate-200"
          >
            <div className="flex items-center gap-3">
              <Car className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">My Vehicle</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                {vehicles.length} Mobil Terdaftar
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </Link>
        </div>
      </div>

      {/* SECTION 3: SAFETY */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">
          SAFETY
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 shadow-card">
          <Link
            href="/app/safety"
            className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition text-slate-800 dark:text-slate-200"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">Safety Center</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                Proteksi Demo (Tidak Aktif)
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </Link>

          <Link
            href="/app/safety"
            className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition text-slate-800 dark:text-slate-200"
          >
            <div className="flex items-center gap-3">
              <PhoneCall className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">Emergency Contact</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
                {user.emergencyContact.name}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </Link>
        </div>
      </div>

      {/* SECTION 4: APP & PREFERENCES */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">
          APP & PREFERENCES
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 shadow-card">
          {/* Theme Quick Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition text-slate-800 dark:text-slate-200 text-left"
          >
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-500" />
              )}
              <span className="text-xs font-bold text-slate-900 dark:text-white">Tema Tampilan</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                {theme === "dark" ? "Mode Gelap (Dark)" : "Mode Terang (Light)"}
              </span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          {/* Tutorial Replay */}
          <button
            type="button"
            onClick={() => setTutorialOpen(true)}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition text-slate-800 dark:text-slate-200 text-left"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">Panduan Aplikasi (Tutorial)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <Link
            href="/app/notifications"
            className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition text-slate-800 dark:text-slate-200"
          >
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">Notifications</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>

          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition text-slate-800 dark:text-slate-200 text-left"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">Settings</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <Link
            href="/app/help"
            className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition text-slate-800 dark:text-slate-200"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">Help Center</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400">Siaga 24 Jam</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </Link>
        </div>
      </div>

      {/* BOTTOM: KELUAR */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setIsLogoutModalOpen(true)}
          className="w-full py-3.5 rounded-2xl border border-red-200 dark:border-red-900 bg-white dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 font-bold text-xs flex items-center justify-center gap-2 transition shadow-subtle"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar</span>
        </button>
      </div>

      {/* Personal Information Modal */}
      {isPersonalInfoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 text-slate-900 dark:text-slate-100 shadow-modal relative space-y-4">
            <button
              onClick={() => setIsPersonalInfoOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Personal Information
            </h3>

            <div className="space-y-3 text-xs bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Nama Lengkap</span>
                <span className="font-bold text-slate-900 dark:text-white">{user.name}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Nomor Telepon</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{user.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Email</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{user.email}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Status Kependudukan</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">Profil Demo — Belum Terverifikasi</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPersonalInfoOpen(false)}
              className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 text-slate-900 dark:text-slate-100 shadow-modal relative space-y-4">
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              App Settings
            </h3>

            <div className="space-y-3 text-xs bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Notifikasi Push</div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px]">Preferensi tampilan demo (tanpa push sungguhan)</div>
                </div>
                <input
                  type="checkbox"
                  checked={pushEnabled}
                  onChange={(e) => setPushEnabled(e.target.checked)}
                  className="accent-[#FF4D00] w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Peringatan SMS Darurat</div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px]">Pengaturan demo (SMS tidak terkirim)</div>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="accent-[#FF4D00] w-4 h-4 cursor-pointer"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs"
            >
              Simpan & Tutup
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
}
