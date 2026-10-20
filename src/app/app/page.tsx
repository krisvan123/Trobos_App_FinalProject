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
import { MOCK_LOCATIONS, DEMO_PICKUP_POINTS, WORKSHOP_DESTINATIONS } from "@/lib/mockData";
import { nearestDemoWorkshop, rankDemoWorkshops } from "@/lib/workshopRecommendation";
import { JourneyVisual } from "@/components/public/BrandExperience";
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
  const setPickup = useTrobosStore(s => s.setPickupLocation);
  const selectedDestination = useTrobosStore(s => s.selectedDestination);
  const selectedWorkshop = useTrobosStore(s => s.selectedWorkshop);
  const setDestination = useTrobosStore(s => s.setSelectedDestination);
  const serviceType = useTrobosStore(s => s.serviceType);
  const setServiceType = useTrobosStore(s => s.setServiceType);
  const passengerCount = useTrobosStore(s => s.passengerCount);
  const startBooking = useTrobosStore(s => s.startBooking);
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
  const planning = status === "IDLE" || status === "REQUESTED";
  const nearestWorkshop = nearestDemoWorkshop(selectedDestination, WORKSHOP_DESTINATIONS) || selectedWorkshop;
  const nearestWorkshopDistance = rankDemoWorkshops(selectedDestination, WORKSHOP_DESTINATIONS)[0]?.distanceKm;
  const [locationNotice, setLocationNotice] = React.useState("");
  const useMyLocation = () => {
    if (!navigator.geolocation) { setLocationNotice("Browser ini tidak mendukung GPS."); return; }
    setLocationNotice("Meminta izin lokasi perangkat...");
    navigator.geolocation.getCurrentPosition(({coords}) => {
      setPickup({
        name:"Lokasi perangkat saya (demo)",
        address:coords.latitude.toFixed(5)+", "+coords.longitude.toFixed(5),
        lat:coords.latitude,lng:coords.longitude,
      });
      setLocationNotice("Lokasi GPS dipilih. Rute demo bisa berupa ilustrasi untuk lokasi khusus.");
    },()=>setLocationNotice("GPS tidak tersedia atau izin ditolak. Pilih salah satu titik contoh."),
    {timeout:12000,maximumAge:60000,enableHighAccuracy:false});
  };
  const estimatedFare = calculateDemoFare({
    origin: pickup, passengerDestination: selectedDestination,
    carDestination: serviceType === "MECHANIC" ? nearestWorkshop : selectedDestination,
    serviceType, passengerCount,
  });

  return (
    <div className={"trobos-home " + (planning ? "tr-before-booking" : "tr-after-booking")} aria-label="Beranda aplikasi TROBOS">
      {planning ? (
        <div className="tr-planning-backdrop">
          <div className="tr-planning-microcopy"><span>01 / SIAPKAN PERJALANAN</span><span>TROBOS · MOBILITY CONCEPT</span></div>
          <JourneyVisual/>
          <p>Setelah kamu mengonfirmasi permintaan demo, layar ini beralih ke peta dan tracking perjalanan.</p>
        </div>
      ) : <div className="trobos-map-stage">
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
      </div>}

      {!planning && <div className="trobos-floating-header">
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
      </div>}

      {planning && <aside className="trobos-command-panel" aria-label="Panel pemesanan">
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

          {planning ? (
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
                    <label htmlFor="tr-pickup">Titik bantuan · pilih lokasi</label>
                    <select id="tr-pickup" value={DEMO_PICKUP_POINTS.some(p=>p.name===pickup.name) ? pickup.name : ""}
                      onChange={event=>{
                        const next=DEMO_PICKUP_POINTS.find(p=>p.name===event.target.value);
                        if(next){setPickup(next);setLocationNotice("");}
                      }}>
                      {!DEMO_PICKUP_POINTS.some(p=>p.name===pickup.name) && <option value="">Lokasi perangkat saya</option>}
                      {DEMO_PICKUP_POINTS.map(point=><option key={point.name} value={point.name}>{point.name}</option>)}
                    </select>
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

              <div className="tr-planner-gps">
                <button type="button" onClick={useMyLocation}><MapPin size={15}/> Gunakan lokasi perangkat</button>
                <span>Titik contoh Jakarta · GPS atas izinmu</span>
              </div>
              {locationNotice && <p role="status" className="tr-location-notice">{locationNotice}</p>}
              {serviceType === "MECHANIC" && (
                <div className="tr-planner-workshop">
                  <span><Truck size={17}/> BENGKEL CONTOH TERDEKAT DARI TUJUAN</span>
                  <strong>{nearestWorkshop.name}</strong>
                  <small>± {nearestWorkshopDistance?.toFixed(1) || "—"} km jarak geografis · Bukan bengkel yang telah diverifikasi</small>
                </div>
              )}
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
              <button type="button" className="trobos-preview-action" onClick={() => setTutorialOpen(true)}>
                <Route size={18}/> Bagaimana tracking bekerja? <ArrowRight size={17}/>
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
      </aside>}

      {!planning && <div className="tr-tracking-summary" aria-live="polite">
        <span className="tr-tracking-live"><span className="trobos-status-dot"/> TRACKING · SIMULASI</span>
        <strong>{activeLabels[status] || "Perjalanan demo"}</strong>
        <small>{currentTrip?.origin.name} → {currentTrip?.destination.name}</small>
      </div>}

      {!planning && <div className="trobos-map-context">
        <span><span className="trobos-context-light"/> CITY MOBILITY · JAKARTA</span>
        <span className="hidden sm:inline">01 <span className="opacity-40">/</span> 02 ROUTES</span>
      </div>}

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
            <div className="tr-approach-progress"><div className="tr-approach-progress-bar"/></div>
            <p className="trobos-legal-note">Pantau motor yang bergerak menuju penjemputan. Tahap berikutnya dimulai setelah animasi berakhir.</p>
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
