"use client";

import React from "react";
import Link from "next/link";
import { useTrobosStore } from "@/store/useTrobosStore";
import { InteractiveMap } from "@/components/map/InteractiveMap";
import { BookingPlanner } from "@/components/booking/BookingPlanner";
import { BookingEntryHandler } from "@/components/booking/BookingEntryHandler";
import { EmergencyBookingSheet } from "@/components/emergency/EmergencyBookingSheet";
import { FindingTandemModal } from "@/components/emergency/FindingTandemModal";
import { TandemFoundCard } from "@/components/emergency/TandemFoundCard";
import { OTPVerificationCard } from "@/components/emergency/OTPVerificationCard";
import { VehicleHandoverModal } from "@/components/emergency/VehicleHandoverModal";
import { DualJourneyTracker } from "@/components/emergency/DualJourneyTracker";
import { TripCompletedModal } from "@/components/emergency/TripCompletedModal";

import { DriverChatModal } from "@/components/emergency/DriverChatModal";
import { ArrowRight, Bell, Bike, CarFront, ChevronRight, MapPin, Moon, Navigation, RotateCcw, ShieldCheck, Sun, UserRound } from "lucide-react";

const phaseLabel: Record<string,string> = {
  SEARCHING_TANDEM: "Mencari armada contoh",
  TANDEM_ASSIGNED: "Armada ditemukan",
  TANDEM_APPROACHING: "Unit menuju penjemputan",
  TANDEM_ARRIVED: "Unit tiba di titik bantuan",
  VERIFICATION: "Verifikasi PIN demo",
  VEHICLE_HANDOVER: "Pemeriksaan kendaraan",
  TRIP_STARTED: "Dua perjalanan berlangsung",
  USER_ARRIVED: "Penumpang tiba",
  VEHICLE_ARRIVED: "Kendaraan tiba",
  COMPLETED: "Simulasi selesai",
};

export default function HomePage() {
  const [resetOpen, setResetOpen] = React.useState(false);
  const trip = useTrobosStore(s => s.currentTrip);
  const status = trip?.status || "IDLE";
  const planning = status === "IDLE" || status === "REQUESTED";
  const pickup = useTrobosStore(s => s.pickupLocation);
  const destination = useTrobosStore(s => s.selectedDestination);
  const selectedWorkshop = useTrobosStore(s => s.selectedWorkshop);
  const serviceType = useTrobosStore(s => s.serviceType);
  const theme = useTrobosStore(s => s.theme);
  const toggleTheme = useTrobosStore(s => s.toggleTheme);
  const reset = useTrobosStore(s => s.resetToIdle);
  const setArrived = useTrobosStore(s => s.setArrived);
  const isChatOpen = useTrobosStore(s => s.isChatOpen);
  const setChatOpen = useTrobosStore(s => s.setChatOpen);
  const transport = trip?.passengerTransport;
  const isMotor = transport?.type === "MOTOR";

  return (
    <div className={"trobos-home tr-experience-home " + (planning ? "tr-experience-planning" : "tr-experience-tracking")}>
      {planning ? (
        <BookingPlanner/>
      ) : (
        <div className="tr-experience-map">
          <InteractiveMap
            status={status}
            origin={trip?.origin || pickup}
            passengerDestination={trip?.destination || destination}
            carDestination={trip?.carDestination || (serviceType === "MECHANIC" ? selectedWorkshop : destination)}
            passengerKind={isMotor ? "bike" : "car"}
            carKind={(trip?.serviceType || serviceType) === "TANDEM" ? "car" : "tow"}
            userProgress={trip?.userProgressPercent ?? 0}
            carProgress={trip?.carProgressPercent ?? 0}
          />
        </div>
      )}

      {!planning && (
        <>
          <div className="tr-experience-map-top" aria-label="Detail perjalanan">
            <div className="tr-experience-trip-status">
              <span><span className="trobos-status-dot"/> LIVE ANIMATION · DEMO</span>
              <strong>{phaseLabel[status] || "Perjalanan demo"}</strong>
              <small><MapPin size={12}/>{trip?.origin.name}</small>
            </div>
            <div className="tr-experience-map-actions">
              <button type="button" onClick={toggleTheme} className="tr-experience-map-button"
                aria-label={theme === "dark" ? "Mode terang" : "Mode gelap"}>
                {theme === "dark" ? <Sun size={19}/> : <Moon size={19}/>}
              </button>
              <Link href="/app/notifications" className="tr-experience-map-button" aria-label="Notifikasi"><Bell size={18}/></Link>
              <Link href="/app/profile" className="tr-experience-map-button" aria-label="Profil"><UserRound size={18}/></Link>
              <button type="button" className="tr-experience-map-button tr-presenter-reset-trigger"
                title="Ulangi demo" aria-label="Ulangi demo dari awal"
                aria-expanded={resetOpen} onClick={() => setResetOpen(open => !open)}><RotateCcw size={18}/></button>
              {resetOpen && <div className="tr-presenter-reset" role="alertdialog"
                aria-label="Konfirmasi mengulang simulasi" aria-describedby="tr-presenter-reset-desc">
                <strong>Ulangi simulasi?</strong>
                <p id="tr-presenter-reset-desc">Perjalanan yang sedang ditampilkan akan dihentikan. Kamu bisa memilih Tandem atau Rescue lagi tanpa menghapus riwayat demo.</p>
                <div>
                  <button type="button" onClick={() => setResetOpen(false)}>Lanjutkan</button>
                  <button type="button" onClick={() => { reset(); setResetOpen(false); }}>Mulai ulang <ArrowRight size={15}/></button>
                </div>
              </div>}
            </div>
          </div>
          <div className="tr-experience-route-badge" aria-label="Rute tujuan">
            <div><span className="tr-experience-route-icon"><Navigation size={16}/></span><div><small>MENUJU</small><strong>{trip?.destination.name}</strong></div></div>
            <ChevronRight size={15}/>
          </div>
          <p className="tr-experience-map-disclaimer"><ShieldCheck size={12}/> Peta asli · kendaraan simulasi</p>
        </>
      )}

      <div className="trobos-flow-layer tr-experience-flow">
        {status === "REQUESTED" && <EmergencyBookingSheet isOpen onClose={reset}/>}
        {status === "SEARCHING_TANDEM" && <FindingTandemModal/>}
        {status === "TANDEM_ASSIGNED" && <TandemFoundCard/>}
        {status === "TANDEM_APPROACHING" && (
          <div className="trobos-rescue-hud tr-experience-approach">
            <div className="trobos-hud-top">
              <span className="trobos-hud-symbol">{isMotor ? <Bike size={24}/> : <CarFront size={24}/>}</span>
              <div><span className="trobos-overline">ARMADA MENUJU PICKUP · DEMO</span>
                <h2>{isMotor ? "Motor" : "Mobil penumpang"} sedang menuju lokasi</h2>
                <p>Ikuti posisi kendaraan di peta sampai tiba di titik jemput.</p>
              </div>
              <span className="trobos-hud-pulse"/>
            </div>
            <div className="trobos-hud-route"><MapPin size={17}/><span>{trip?.origin.name}</span></div>
            <div className="tr-approach-progress"><div className="tr-approach-progress-bar"/></div>
            <button type="button" className="tr-trip-skip-approach" onClick={setArrived}>
              Lewati animasi penjemputan <span>Skip <ArrowRight size={15}/></span>
            </button>
            <p className="trobos-legal-note">Animasi penjemputan berjalan otomatis dan bukan pergerakan driver sungguhan.</p>
          </div>
        )}
        {(status === "TANDEM_ARRIVED" || status === "VERIFICATION") && <OTPVerificationCard/>}
        {status === "VEHICLE_HANDOVER" && <VehicleHandoverModal/>}
        {(status === "TRIP_STARTED" || status === "USER_ARRIVED" || status === "VEHICLE_ARRIVED") && <DualJourneyTracker/>}
        {status === "COMPLETED" && <TripCompletedModal/>}
      </div>
      <BookingEntryHandler/>
      <DriverChatModal isOpen={isChatOpen} onClose={()=>setChatOpen(false)}/>
    </div>
  );
}
