"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useTrobosStore } from "@/store/useTrobosStore";
import { InteractiveMap } from "@/components/map/InteractiveMap";
import { EmergencyButton } from "@/components/common/EmergencyButton";
import { EmergencyBookingSheet } from "@/components/emergency/EmergencyBookingSheet";
import { FindingTandemModal } from "@/components/emergency/FindingTandemModal";
import { TandemFoundCard } from "@/components/emergency/TandemFoundCard";
import { OTPVerificationCard } from "@/components/emergency/OTPVerificationCard";
import { VehicleHandoverModal } from "@/components/emergency/VehicleHandoverModal";
import { DualJourneyTracker } from "@/components/emergency/DualJourneyTracker";
import { TripCompletedModal } from "@/components/emergency/TripCompletedModal";
import { OnboardingTutorialModal } from "@/components/common/OnboardingTutorialModal";
import { DriverChatModal } from "@/components/emergency/DriverChatModal";
import { MOCK_LOCATIONS } from "@/lib/mockData";
import {
  MapPin,
  ShieldCheck,
  Clock,
  HelpCircle,
  Navigation,
  Truck,
  Users,
  BookOpen,
} from "lucide-react";

export default function HomePage() {
  const user = useTrobosStore((s) => s.user);
  const currentTrip = useTrobosStore((s) => s.currentTrip);
  const startBooking = useTrobosStore((s) => s.startBooking);
  const resetToIdle = useTrobosStore((s) => s.resetToIdle);
  const setArrived = useTrobosStore((s) => s.setArrived);

  const isTutorialOpen = useTrobosStore((s) => s.isTutorialOpen);
  const setTutorialOpen = useTrobosStore((s) => s.setTutorialOpen);
  const hasSeenTutorial = useTrobosStore((s) => s.hasSeenTutorial);
  const isChatOpen = useTrobosStore((s) => s.isChatOpen);
  const setChatOpen = useTrobosStore((s) => s.setChatOpen);


  // Automatically show tutorial on very first entry for user testing clarity
  useEffect(() => {
    if (!hasSeenTutorial) {
      const timer = setTimeout(() => {
        setTutorialOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [hasSeenTutorial, setTutorialOpen]);

  const status = currentTrip?.status || "IDLE";

  const handleOpenBooking = () => {
    startBooking();
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* 1. Main Clean Urban Map */}
      <div className="absolute inset-0 z-0">
        <InteractiveMap
          status={status}
          userProgress={currentTrip?.userProgressPercent || 0}
          carProgress={currentTrip?.carProgressPercent || 0}
          originName={currentTrip?.origin.name || MOCK_LOCATIONS.current.name}
          destinationName={
            currentTrip?.destination.name || MOCK_LOCATIONS.destinations[0].name
          }
        />
      </div>

      {/* 2. Top Bar: Trobos Logo + User Breakdown Location + Profile Access */}
      <div className="relative z-20 p-3 sm:p-4 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-card flex items-center justify-between gap-3 transition-colors">
          {/* Trobos Brand Mark */}
          <Link href="/app" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-[#FF4D00] flex items-center justify-center shadow-subtle">
              <span className="text-white font-black text-xs">T</span>
            </div>
            <span className="text-sm font-black tracking-tight text-slate-900 dark:text-white hidden xs:inline">
              TROBOS
            </span>
          </Link>

          {/* User Breakdown Location */}
          <div className="flex-1 min-w-0 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200">
            <MapPin className="w-3.5 h-3.5 text-red-600 dark:text-red-400 shrink-0" />
            <span className="truncate font-medium text-[11px] sm:text-xs">
              {MOCK_LOCATIONS.current.name}
            </span>
          </div>

          {/* Profile / Account Access */}
          <Link
            href="/app/profile"
            className="flex items-center gap-1.5 shrink-0 pl-1 pr-1.5 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Profil Akun"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden sm:inline truncate max-w-[80px]">
              {user.name.split(" ")[0]}
            </span>
          </Link>
        </div>
      </div>

      {/* 3. Bottom Area: DOMINANT EMERGENCY CTA + 3 Actions Only (When IDLE) */}
      {status === "IDLE" && (
        <div className="mt-auto relative z-20 p-4 sm:p-6 pb-20 md:pb-6 pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-elevated space-y-3.5 transition-colors">
            {/* Dominant Primary CTA Header */}
            <div>
              <EmergencyButton onClick={handleOpenBooking} />
              <p className="text-xs text-slate-600 dark:text-slate-300 text-center font-medium mt-2.5">
                Mobil mogok? Tenang. Kami bantu evakuasi mobil dan mengantarkan Anda ke tujuan.
              </p>
            </div>

            {/* Feature preview chips */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <Truck className="w-4 h-4 text-[#FF4D00] shrink-0" />
                <span className="text-[11px] font-semibold">Truk Towing Gendong</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-[11px] font-semibold">Armada Penumpang Dinamis</span>
              </div>
            </div>

            {/* Educational Tutorial Quick Action */}
            <button
              type="button"
              onClick={() => setTutorialOpen(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-900/40 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <BookOpen className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Panduan & Cara Kerja Tandem</span>
            </button>

            {/* Useful secondary actions: Riwayat, Keamanan, Bantuan */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2">
              <Link
                href="/app/trips"
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition text-center flex flex-col items-center gap-1 group"
              >
                <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Riwayat</span>
              </Link>

              <Link
                href="/app/safety"
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition text-center flex flex-col items-center gap-1 group"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 transition-colors" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Keamanan</span>
              </Link>

              <Link
                href="/app/help"
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition text-center flex flex-col items-center gap-1 group"
              >
                <HelpCircle className="w-4 h-4 text-sky-600 dark:text-sky-400 group-hover:text-sky-700 transition-colors" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Bantuan</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 4. Active Emergency Flow Overlays */}
      {status === "REQUESTED" && (
        <EmergencyBookingSheet
          isOpen={true}
          onClose={resetToIdle}
        />
      )}

      {status === "SEARCHING_TANDEM" && <FindingTandemModal />}

      {status === "TANDEM_ASSIGNED" && <TandemFoundCard />}

      {/* Approaching HUD */}
      {status === "TANDEM_APPROACHING" && (
        <div className="fixed inset-x-0 bottom-0 sm:bottom-6 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40 w-full sm:max-w-md px-3 sm:px-4 pb-6 pt-2">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 text-slate-900 dark:text-slate-100 space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D00] animate-pulse" />
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Unit Rescue Menuju Lokasi Anda
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Towing Flatbed & Armada Penjemput
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 dark:text-slate-400 font-bold uppercase block">ETA</span>
                <span className="text-lg font-black text-[#FF4D00]">02:41</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-medium">
                <span>✓</span>
                <span>Permintaan evakuasi diterima</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-medium">
                <span>✓</span>
                <span>Armada derek & penjemput meluncur bersamaan</span>
              </div>
              <div className="flex items-center gap-2 text-[#FF4D00] font-bold">
                <Navigation className="w-3.5 h-3.5 animate-spin" />
                <span>Mendekati titik mogok Anda (Sudirman Kav. 28)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={setArrived}
              className="w-full py-3.5 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs transition shadow-sm"
            >
              Tandai: Unit Rescue Telah Sampai di Depan Anda
            </button>
          </div>
        </div>
      )}

      {(status === "TANDEM_ARRIVED" || status === "VERIFICATION") && (
        <OTPVerificationCard />
      )}

      {status === "VEHICLE_HANDOVER" && <VehicleHandoverModal />}

      {(status === "TRIP_STARTED" ||
        status === "USER_ARRIVED" ||
        status === "VEHICLE_ARRIVED") && <DualJourneyTracker />}

      {status === "COMPLETED" && <TripCompletedModal />}

      {/* 5. Global Interactive Modals: Onboarding Tutorial & Driver Chat */}
      <OnboardingTutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setTutorialOpen(false)}
      />

      <DriverChatModal
        isOpen={isChatOpen}
        onClose={() => setChatOpen(false)}
      />
    </div>
  );
}
