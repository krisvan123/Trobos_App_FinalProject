"use client";

import React from "react";
import Link from "next/link";
import { useTrobosStore } from "@/store/useTrobosStore";
import { InteractiveMap } from "@/components/map/InteractiveMap";
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
import { formatRupiah } from "@/lib/formatters";
import { calculateDemoFare } from "@/lib/pricing";
import {
  ArrowRight, ArrowUpRight, Bell, Bike, CarFront, Check, ChevronDown,
  CircleHelp, Clock3, MapPin, Moon, Navigation, Route, ShieldCheck,
  Sparkles, Sun, Truck, UserRound, Users, Zap
} from "lucide-react";

const activeLabels: Record<string, string> = {
  REQUESTED: "Mengatur permintaan",
  SEARCHING_TANDEM: "Mencari armada demo",
  TANDEM_ASSIGNED: "Armada simulasi ditemukan",
  TANDEM_APPROACHING: "Motor menuju lokasi",
  TANDEM_ARRIVED: "Unit tiba di penjemputan",
  VERIFICATION: "Verifikasi PIN demo",
  VEHICLE_HANDOVER: "Inspeksi kendaraan",
  TRIP_STARTED: "Dua perjalanan berlangsung",
  USER_ARRIVED: "Penumpang sudah tiba",
  VEHICLE_ARRIVED: "Mobil sudah tiba",
  COMPLETED: "Perjalanan selesai",
};

export default function HomePage() {
  const user = useTrobosStore(s => s.user);
  const currentTrip = useTrobosStore(s => s.currentTrip);
  const pickup = useTrobosStore(s => s.pickupLocation);
  const selectedDestination = useTrobosStore(s => s.selectedDestination);
  const selectedWorkshop = useTrobosStore(s => s.selectedWorkshop);
  const setDestination = useTrobosStore(s => s.setSelectedDestination);
  const serviceType = useTrobosStore(s => s.serviceType);
  const setServiceType = useTrobosStore(s => s.setServiceType);
  const passengerCount = useTrobosStore(s => s.passengerCount);
  const startBooking = useTrobosStore(s => s.startBooking);
  const previewJourney = useTrobosStore(s => s.jumpToState);
  const reset = useTrobosStore(s => s.resetToIdle);
  const setArrived = useTrobosStore(s => s.setArrived);
  const theme = useTrobosStore(s => s.theme);
  const toggleTheme = useTrobosStore(s => s.toggleTheme);
  const isTutorialOpen = useTrobosStore(s => s.isTutorialOpen);
  const setTutorialOpen = useTrobosStore(s => s.setTutorialOpen);
  const isChatOpen = useTrobosStore(s => s.isChatOpen);
  const setChatOpen = useTrobosStore(s => s.setChatOpen);
  const status = currentTrip?.status || "IDLE";
  const idle = status === "IDLE";
  const estimatedFare = calculateDemoFare({
    origin: pickup, passengerDestination: selectedDestination,
    carDestination: serviceType === "MECHANIC" ? selectedWorkshop : selectedDestination,
    serviceType, passengerCount,
  });

  return (
    <div className="trobos-home" aria-label="Beranda aplikasi TROBOS">
      <div className="trobos-map-stage">
        <InteractiveMap
          status={status}
          origin={currentTrip?.origin || pickup}
          passengerDestination={currentTrip?.destination || selectedDestination}
          carDestination={currentTrip?.carDestination || (serviceType === "MECHANIC" ? selectedWorkshop : selectedDestination)}
          passengerKind={currentTrip?.passengerTransport.type === "MOTOR" ? "bike" : "car"}
          carKind={(currentTrip?.serviceType || serviceType) === "TANDEM" ? "car" : "tow"}
          userProgress={currentTrip?.userProgressPercent ?? 0}
          carProgress={currentTrip?.carProgressPercent ?? 0}
        />
      </div>

      <div className="trobos-floating-header">
        <div className="trobos-location-glass">
          <span className="trobos-location-symbol"><Navigation size={17}/></span>
          <div className="min-w-0">
            <span className="trobos-label">LOKASI PENJEMPUTAN</span>
            <span className="trobos-location-value">{pickup.name}</span>
          </div>
          <ChevronDown size={16} className="shrink-0 opacity-50"/>
        </div>
        <div className="trobos-float-actions">
          <button type="button" onClick={toggleTheme} className="trobos-circle-btn"
            title={theme === "dark" ? "Gunakan mode terang" : "Gunakan mode gelap"}
            aria-label={theme === "dark" ? "Gunakan mode terang" : "Gunakan mode gelap"}>
            {theme === "dark" ? <Sun size={19}/> : <Moon size={19}/>}
          </button>
          <Link href="/app/notifications" className="trobos-circle-btn" aria-label="Notifikasi"><Bell size={18}/></Link>
          <Link href="/app/profile" className="trobos-circle-btn" aria-label="Akun"><UserRound size={18}/></Link>
        </div>
      </div>

      <aside className="trobos-command-panel" aria-label="Panel pemesanan">
        <div className="trobos-panel-grip" aria-hidden="true"/>
        <div className="trobos-panel-content">
          <div className="trobos-panel-head">
            <div>
              <span className="trobos-overline"><span className="trobos-status-dot"/> PERSONAL MOBILITY, REIMAGINED</span>
              <h1>Perjalananmu.<br/><span>Tetap berjalan.</span></h1>
              <p>Mobil perlu bantuan? Kamu tetap bisa sampai tujuan.</p>
            </div>
            <div className="trobos-brand-seal" aria-hidden="true"><Zap size={21} strokeWidth={2.6}/></div>
          </div>

          <div className="trobos-panel-divider"/>

          {idle ? (
            <>
              <div className="trobos-section-heading">
                <span>Pilih layanan</span>
                <span>01 / 02</span>
              </div>
              <div className="trobos-service-toggle" role="group" aria-label="Pilih layanan">
                <button type="button" aria-pressed={serviceType === "MECHANIC"} onClick={() => setServiceType("MECHANIC")}
                  className={"trobos-service-option " + (serviceType === "MECHANIC" ? "is-active" : "")}>
                  <Truck size={20} strokeWidth={1.8}/>
                  <strong>Derek & Rescue</strong>
                  <small>Mobil mogok</small>
                </button>
                <button type="button" aria-pressed={serviceType === "TANDEM"} onClick={() => setServiceType("TANDEM")}
                  className={"trobos-service-option " + (serviceType === "TANDEM" ? "is-active" : "")}>
                  <Bike size={20} strokeWidth={1.8}/>
                  <strong>Tandem Ride</strong>
                  <small>Tembus macet</small>
                </button>
              </div>

              <div className="trobos-section-heading trobos-route-title">
                <span>Rute perjalanan</span>
                <span>JAKARTA · DEMO</span>
              </div>
              <div className="trobos-route-card">
                <div className="trobos-route-rail"><i/><span/><i/></div>
                <div className="trobos-route-fields">
                  <div className="trobos-route-field">
                    <label>Titik bantuan</label>
                    <p>{pickup.name}</p>
                  </div>
                  <div className="trobos-route-field">
                    <label htmlFor="trobos-destination">Tujuan penumpang</label>
                    <select id="trobos-destination" value={selectedDestination.name}
                      onChange={e => {
                        const destination = MOCK_LOCATIONS.destinations.find(item => item.name === e.target.value);
                        if (destination) setDestination(destination);
                      }}>
                      {MOCK_LOCATIONS.destinations.map(destination => (
                        <option key={destination.name} value={destination.name}>{destination.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="trobos-fare-preview">
                <div>
                  <small>Estimasi perjalanan demo</small>
                  <strong>{formatRupiah(estimatedFare.totalFare)}</strong>
                </div>
                <span><Route size={15}/> ± {estimatedFare.distanceKm} km</span>
              </div>

              <button type="button" className="trobos-primary-action" onClick={() => startBooking()}>
                <span><Zap size={18} fill="currentColor"/> Atur Bantuan Sekarang</span>
                <span className="trobos-primary-arrow"><ArrowRight size={20}/></span>
              </button>
              <button type="button" className="trobos-preview-action" onClick={() => previewJourney("TRIP_STARTED")}>
                <Route size={18}/> Lihat animasi dua kendaraan <ArrowRight size={17}/>
              </button>
              <p className="trobos-legal-note">
                <ShieldCheck size={14}/> Prototipe akademik · tanpa pemesanan atau pembayaran nyata
              </p>
            </>
          ) : (
            <div className="trobos-active-panel">
              <span className="trobos-section-heading"><span>PERJALANAN SIMULASI</span><span>LIVE PREVIEW</span></span>
              <div className="trobos-active-badge"><span className="trobos-status-dot"/>{activeLabels[status] || "Status perjalanan"}</div>
              <div className="trobos-active-route">
                <div><span className="trobos-step-icon"><MapPin size={16}/></span><div><small>Dari</small><strong>{currentTrip?.origin.name}</strong></div></div>
                <div><span className="trobos-step-icon destination"><Navigation size={16}/></span><div><small>Menuju</small><strong>{currentTrip?.destination.name}</strong></div></div>
              </div>
              <div className="trobos-mini-progress">
                <span><Users size={15}/> Penumpang</span>
                <strong>{currentTrip?.userProgressPercent ?? 0}%</strong>
                <div className="trobos-progress-track"><i style={{width: (currentTrip?.userProgressPercent ?? 0) + "%", background: "#367EAB"}}/></div>
                <span><Truck size={15}/> Mobil</span>
                <strong>{currentTrip?.carProgressPercent ?? 0}%</strong>
                <div className="trobos-progress-track"><i style={{width: (currentTrip?.carProgressPercent ?? 0) + "%", background: "#C27651"}}/></div>
              </div>
              <p className="trobos-legal-note"><ShieldCheck size={14}/> Posisi kendaraan dianimasikan sebagai simulasi, bukan GPS langsung.</p>
            </div>
          )}

          <div className="trobos-panel-footer">
            <button type="button" onClick={() => setTutorialOpen(true)}><CircleHelp size={16}/> Cara kerja</button>
            <Link href="/app/trips"><Clock3 size={16}/> Riwayat</Link>
            <Link href="/app/safety"><ShieldCheck size={16}/> Keamanan</Link>
          </div>
        </div>
      </aside>

      <div className="trobos-map-context">
        <span><span className="trobos-context-light"/> CITY MOBILITY · JAKARTA</span>
        <span className="hidden sm:inline">01 <span className="opacity-40">/</span> 02 ROUTES</span>
      </div>

      <div className="trobos-flow-layer">
        {status === "REQUESTED" && <EmergencyBookingSheet isOpen onClose={reset} />}
        {status === "SEARCHING_TANDEM" && <FindingTandemModal />}
        {status === "TANDEM_ASSIGNED" && <TandemFoundCard />}
        {status === "TANDEM_APPROACHING" && (
          <div className="trobos-rescue-hud">
            <div className="trobos-hud-top"><div className="trobos-hud-symbol"><Bike size={23}/></div>
              <div><span className="trobos-overline">TRACKING ANIMATION</span>
                <h2>Motor sedang menuju lokasi</h2>
                <p>Ikuti pergerakan marker motor di peta.</p>
              </div>
              <span className="trobos-hud-pulse"/>
            </div>
            <div className="trobos-hud-route"><MapPin size={18}/><span>{pickup.name}</span><Check size={16}/></div>
            <button type="button" onClick={setArrived} className="trobos-primary-action">
              <span>Konfirmasi unit telah tiba</span><ArrowRight size={19}/>
            </button>
            <p className="trobos-legal-note">Motor otomatis tiba setelah animasi contoh selesai.</p>
          </div>
        )}
        {(status === "TANDEM_ARRIVED" || status === "VERIFICATION") && <OTPVerificationCard />}
        {status === "VEHICLE_HANDOVER" && <VehicleHandoverModal />}
        {(status === "TRIP_STARTED" || status === "USER_ARRIVED" || status === "VEHICLE_ARRIVED") && <DualJourneyTracker />}
        {status === "COMPLETED" && <TripCompletedModal />}
      </div>

      <OnboardingTutorialModal isOpen={isTutorialOpen} onClose={() => setTutorialOpen(false)}/>
      <DriverChatModal isOpen={isChatOpen} onClose={() => setChatOpen(false)}/>
    </div>
  );
}
