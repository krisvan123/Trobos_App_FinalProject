"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, Bike, CarFront, Check, ChevronDown,
  CircleHelp, Clock3, LocateFixed, MapPin, Minus, Moon, Plus,
  Route, ShieldCheck, Sun, Truck, Users, Wrench, Zap,
} from "lucide-react";
import { useTrobosStore } from "@/store/useTrobosStore";
import { BREAKDOWN_PROBLEMS, DEMO_PICKUP_POINTS, MOCK_LOCATIONS, WORKSHOP_DESTINATIONS, getPassengerTransportOption } from "@/lib/mockData";
import { rankDemoWorkshops } from "@/lib/workshopRecommendation";
import { calculateDemoFare } from "@/lib/pricing";
import { formatRupiah } from "@/lib/formatters";

export function BookingPlanner() {
  const serviceType = useTrobosStore(s => s.serviceType);
  const setServiceType = useTrobosStore(s => s.setServiceType);
  const pickup = useTrobosStore(s => s.pickupLocation);
  const setPickup = useTrobosStore(s => s.setPickupLocation);
  const destination = useTrobosStore(s => s.selectedDestination);
  const setDestination = useTrobosStore(s => s.setSelectedDestination);
  const passengerCount = useTrobosStore(s => s.passengerCount);
  const setPassengerCount = useTrobosStore(s => s.setPassengerCount);
  const selectedProblemId = useTrobosStore(s => s.selectedProblemId);
  const setSelectedProblemId = useTrobosStore(s => s.setSelectedProblemId);
  const vehicles = useTrobosStore(s => s.vehicles);
  const activeVehicleId = useTrobosStore(s => s.activeVehicleId);
  const setActiveVehicleId = useTrobosStore(s => s.setActiveVehicleId);
  const startBooking = useTrobosStore(s => s.startBooking);
  const setTutorialOpen = useTrobosStore(s => s.setTutorialOpen);
  const theme = useTrobosStore(s => s.theme);
  const toggleTheme = useTrobosStore(s => s.toggleTheme);
  const [locationNotice, setLocationNotice] = useState("");

  const ranked = rankDemoWorkshops(destination, WORKSHOP_DESTINATIONS);
  const workshop = ranked[0]?.workshop || WORKSHOP_DESTINATIONS[0];
  const transport = getPassengerTransportOption(passengerCount);
  const estimatedFare = calculateDemoFare({
    serviceType, origin: pickup, passengerDestination: destination,
    carDestination: serviceType === "MECHANIC" ? workshop : destination, passengerCount,
  });
  const pickupPreset = DEMO_PICKUP_POINTS.some(p => p.name === pickup.name);

  const requestDeviceLocation = () => {
    if (!navigator.geolocation) {
      setLocationNotice("Browser ini tidak mendukung akses lokasi."); return;
    }
    setLocationNotice("Menunggu persetujuan lokasi...");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPickup({
          name: "Lokasi perangkat (demo)",
          address: coords.latitude.toFixed(5) + ", " + coords.longitude.toFixed(5),
          lat: coords.latitude, lng: coords.longitude,
        });
        setLocationNotice("Titik GPS dipilih. Rute dari titik ini dapat ditampilkan sebagai ilustrasi.");
      },
      () => setLocationNotice("Akses lokasi tidak tersedia. Silakan pilih titik contoh Jakarta."),
      { timeout: 12000, maximumAge: 60000, enableHighAccuracy: false },
    );
  };

  return (
    <div className="tr-new-planner">
      <div className="tr-new-planner-header">
        <Link href="/" className="tr-new-wordmark" aria-label="Kembali ke halaman TROBOS">
          <span><Zap size={18} strokeWidth={2.8}/></span> TROBOS<b>.</b>
        </Link>
        <div className="tr-new-planner-tools">
          <span className="tr-new-guest"><span className="trobos-status-dot"/> DEMO MODE</span>
          <button type="button" onClick={toggleTheme} className="tr-new-icon-button"
            aria-label={theme === "dark" ? "Aktifkan mode terang" : "Aktifkan mode gelap"}>
            {theme === "dark" ? <Sun size={19}/> : <Moon size={19}/>}
          </button>
          <Link href="/app/profile" className="tr-new-icon-button tr-new-profile-link" aria-label="Profil">Akun <ArrowUpRight size={15}/></Link>
        </div>
      </div>
      <div className="tr-new-planner-grid">
        <section className="tr-new-form-panel" aria-labelledby="tr-new-title">
          <div className="tr-new-intro">
            <div className="tr-new-eyebrow"><span className="tr-new-line"/> YOUR NEXT MOVE, SIMPLIFIED</div>
            <h1 id="tr-new-title">Perjalanan tak harus <em>berhenti.</em></h1>
            <p>Atur bantuan kendaraan dan tujuanmu terlebih dahulu. Setelah konfirmasi, kamu bisa mengikuti simulasi di peta.</p>
          </div>

          <div className="tr-new-form-body">
            <div className="tr-new-section-title"><span>01</span><h2>Pilih layanan</h2></div>
            <div className="tr-new-service-grid" role="group" aria-label="Pilih jenis layanan">
              <button type="button" onClick={() => setServiceType("TANDEM")}
                aria-pressed={serviceType === "TANDEM"}
                className={"tr-new-service " + (serviceType === "TANDEM" ? "is-selected" : "")}>
                <span className="tr-new-service-icon"><Bike size={25}/></span>
                <span><strong>Tandem</strong><small>Penumpang lanjut, driver mengantar mobilmu</small></span>
                <span className="tr-new-service-check"><Check size={13}/></span>
              </button>
              <button type="button" onClick={() => setServiceType("MECHANIC")}
                aria-pressed={serviceType === "MECHANIC"}
                className={"tr-new-service " + (serviceType === "MECHANIC" ? "is-selected" : "")}>
                <span className="tr-new-service-icon"><Truck size={25}/></span>
                <span><strong>Derek & Rescue</strong><small>Mobil ke bengkel, penumpang tetap lanjut</small></span>
                <span className="tr-new-service-check"><Check size={13}/></span>
              </button>
            </div>

            <div className="tr-new-section-title"><span>02</span><h2>Tentukan perjalanan</h2></div>
            <div className="tr-new-route-inputs">
              <span className="tr-new-route-track" aria-hidden="true"><i/><b/><i/></span>
              <div className="tr-new-route-field">
                <label htmlFor="tr-new-origin">Titik bantuan / penjemputan</label>
                <select id="tr-new-origin" value={pickupPreset ? pickup.name : "__gps"}
                  onChange={e => {
                    const found=DEMO_PICKUP_POINTS.find(p=>p.name===e.target.value);
                    if(found) {setPickup(found);setLocationNotice("");}
                  }}>
                  {!pickupPreset && <option value="__gps">{pickup.name}</option>}
                  {DEMO_PICKUP_POINTS.map(item => <option key={item.name} value={item.name}>{item.name}</option>)}
                </select>
                <small>{pickup.address}</small>
              </div>
              <div className="tr-new-route-field">
                <label htmlFor="tr-new-destination">Tujuan penumpang</label>
                <select id="tr-new-destination" value={destination.name}
                  onChange={e => {
                    const found=MOCK_LOCATIONS.destinations.find(p=>p.name===e.target.value);
                    if(found)setDestination(found);
                  }}>
                  {MOCK_LOCATIONS.destinations.map(item => <option key={item.name} value={item.name}>{item.name}</option>)}
                </select>
                <small>{destination.address}</small>
              </div>
            </div>
            <button type="button" onClick={requestDeviceLocation} className="tr-new-location-action">
              <LocateFixed size={16}/> Gunakan lokasi perangkat <ArrowRight size={15}/>
            </button>
            {locationNotice && <p className="tr-new-info-message" role="status">{locationNotice}</p>}

            {serviceType === "MECHANIC" && (
              <div className="tr-new-workshop">
                <span className="tr-new-workshop-icon"><Wrench size={19}/></span>
                <div>
                  <span className="tr-new-mini-label">BENGKEL CONTOH TERDEKAT DARI TUJUAN</span>
                  <strong>{workshop.name}</strong>
                  <small>± {ranked[0]?.distanceKm.toFixed(1) ?? "—"} km garis lurus dari tujuan penumpang. Belum diverifikasi atau dicek jam bukanya.</small>
                </div>
              </div>
            )}

            <div className="tr-new-section-title"><span>03</span><h2>Detail penumpang & kendaraan</h2></div>
            <div className="tr-new-details-grid">
              <div className="tr-new-detail">
                <label>Jumlah penumpang</label>
                <div className="tr-new-counter">
                  <button type="button" onClick={()=>setPassengerCount(passengerCount-1)} disabled={passengerCount<=1} aria-label="Kurangi penumpang"><Minus size={17}/></button>
                  <strong>{passengerCount}</strong>
                  <button type="button" onClick={()=>setPassengerCount(passengerCount+1)} disabled={passengerCount>=8} aria-label="Tambah penumpang"><Plus size={17}/></button>
                </div>
                <small>{transport.title}</small>
              </div>
              <div className="tr-new-detail">
                <label htmlFor="tr-new-vehicle">Mobil yang dibantu</label>
                <div className="tr-new-select-wrap"><CarFront size={17}/><select id="tr-new-vehicle" value={activeVehicleId} onChange={e=>setActiveVehicleId(e.target.value)}>
                  {vehicles.map(v=><option key={v.id} value={v.id}>{v.brand} {v.model}</option>)}
                </select><ChevronDown size={16}/></div>
                <small>Data kendaraan contoh</small>
              </div>
            </div>
            {serviceType === "MECHANIC" && (
              <div className="tr-new-detail tr-new-problem">
                <label htmlFor="tr-new-problem">Kendala kendaraan</label>
                <div className="tr-new-select-wrap"><Wrench size={17}/>
                  <select id="tr-new-problem" value={selectedProblemId} onChange={e=>setSelectedProblemId(e.target.value as typeof selectedProblemId)}>
                    {BREAKDOWN_PROBLEMS.map(problem=><option key={problem.id} value={problem.id}>{problem.label}</option>)}
                  </select><ChevronDown size={16}/>
                </div>
              </div>
            )}
          </div>
          <div className="tr-new-booking-footer">
            <div className="tr-new-fare-row"><div><small>ESTIMASI BIAYA DEMO</small><strong>{formatRupiah(estimatedFare.totalFare)}</strong></div><span><Route size={15}/> ± {estimatedFare.distanceKm} km*</span></div>
            <button type="button" className="tr-new-booking-cta" onClick={()=>startBooking()}>
              Lanjut ke ringkasan <ArrowRight size={20}/>
            </button>
            <p><ShieldCheck size={14}/> Tidak ada pembayaran atau layanan darurat nyata. *Estimasi bukan jarak jalan aktual.</p>
          </div>
        </section>

        <aside className="tr-new-visual" aria-label="Gambaran perjalanan TROBOS">
          <div className="tr-new-visual-top"><span><span className="trobos-status-dot"/> TROBOS EXPERIENCE</span><span>JAKARTA · 2026</span></div>
          <div className="tr-new-visual-body">
            <div className="tr-new-visual-caption"><span className="tr-new-eyebrow">ONE APP. TWO JOURNEYS.</span><h2>Dua perjalanan.<br/><em>Satu kendali.</em></h2><p>Penumpang melanjutkan aktivitasnya. Kendaraan ditangani secara terpisah. Semuanya terlihat dalam satu alur.</p></div>
            <div className="tr-new-visual-map">
              <svg viewBox="0 0 480 330" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
                <defs><pattern id="tr-grid-pattern" width="54" height="54" patternUnits="userSpaceOnUse" patternTransform="rotate(-16)"><path d="M27 0V54M0 27H54" fill="none" stroke="currentColor" strokeWidth="8" opacity=".22"/></pattern></defs>
                <rect width="480" height="330" fill="url(#tr-grid-pattern)"/>
                <path d="M61 264L118 264L118 210L222 210L222 128L318 128L318 59L425 59" fill="none" stroke="#8BBBD3" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M61 264L118 264L118 210L222 210L222 254L365 254L365 157L427 157" fill="none" stroke="#DE9D7A" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="12 10"/>
                <circle cx="61" cy="264" r="12" fill="#192C39" stroke="#ECF2F2" strokeWidth="5"/><circle cx="425" cy="59" r="11" fill="#8BBBD3" stroke="#ECF2F2" strokeWidth="4"/><circle cx="427" cy="157" r="11" fill="#DE9D7A" stroke="#ECF2F2" strokeWidth="4"/>
                <circle cx="222" cy="210" r="24" fill="#294A5D" stroke="#F1F5F4" strokeWidth="4"/><path d="M222 196L215 213L222 210L229 213Z" fill="#FFF9F4"/>
                <circle cx="365" cy="254" r="21" fill="#C47B59" stroke="#F1F5F4" strokeWidth="4"/><rect x="357" y="244" width="16" height="20" rx="5" fill="#F8F6F0"/><rect x="359" y="247" width="12" height="8" rx="2" fill="#567483"/>
              </svg>
              <div className="tr-new-map-legend"><span><i/> Penumpang</span><span><i/> {serviceType === "TANDEM" ? "Mobil pelanggan" : "Derek & mobil"}</span></div>
            </div>
            <div className="tr-new-preview-card">
              <div className="tr-new-preview-icon"><MapPin size={21}/></div>
              <div><small>RENCANA PERJALANAN</small><strong>{destination.name}</strong><span>{serviceType === "MECHANIC" ? "Mobil menuju bengkel contoh terdekat" : "Mobil menyusul ke tujuan yang sama"}</span></div>
              <Check size={18}/>
            </div>
          </div>
          <div className="tr-new-visual-bottom"><button type="button" onClick={()=>setTutorialOpen(true)}><CircleHelp size={17}/> Bagaimana TROBOS bekerja?</button><Link href="/app/trips"><Clock3 size={16}/> Riwayat demo</Link></div>
        </aside>
      </div>
    </div>
  );
}
