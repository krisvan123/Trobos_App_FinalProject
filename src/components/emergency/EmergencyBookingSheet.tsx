"use client";

import React, { useState } from "react";
import { BottomSheet } from "@/components/common/BottomSheet";
import { useTrobosStore } from "@/store/useTrobosStore";
import { ArrowRight, Bike, CarFront, Check, MapPin, ShieldCheck, Truck, Users, Wrench } from "lucide-react";
import { calculateDemoFare } from "@/lib/pricing";
import { formatRupiah } from "@/lib/formatters";
import { nearestDemoWorkshop } from "@/lib/workshopRecommendation";
import { WORKSHOP_DESTINATIONS, getPassengerTransportOption } from "@/lib/mockData";

interface Props { isOpen: boolean; onClose: () => void }

export function EmergencyBookingSheet({ isOpen, onClose }: Props) {
  const currentTrip = useTrobosStore(s => s.currentTrip);
  const pickup = useTrobosStore(s => s.pickupLocation);
  const destination = useTrobosStore(s => s.selectedDestination);
  const serviceType = useTrobosStore(s => s.serviceType);
  const passengerCount = useTrobosStore(s => s.passengerCount);
  const vehicles = useTrobosStore(s => s.vehicles);
  const activeVehicleId = useTrobosStore(s => s.activeVehicleId);
  const selectedProblemId = useTrobosStore(s => s.selectedProblemId);
  const confirmBooking = useTrobosStore(s => s.confirmBooking);
  const returnToBooking = useTrobosStore(s => s.returnToBooking);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const chosenVehicle = vehicles.find(v => v.id === activeVehicleId);
  const workshop = nearestDemoWorkshop(destination, WORKSHOP_DESTINATIONS) || WORKSHOP_DESTINATIONS[0];
  const carDestination = serviceType === "MECHANIC" ? workshop : destination;
  const passengerTransport = getPassengerTransportOption(passengerCount);
  const estimate = calculateDemoFare({
    serviceType, origin: pickup, passengerDestination: destination, carDestination, passengerCount,
  });
  const remoteMode = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  async function confirm() {
    if (submitting || !currentTrip) return;
    setError("");
    // The booking always progresses as a local simulation, including for guests.
    confirmBooking();
    if (!remoteMode) return;
    try {
      const identity = await fetch("/api/auth", { cache: "no-store" });
      const session = await identity.json().catch(() => ({}));
      if (!identity.ok || !session.authenticated) return;
      setSubmitting(true);
      const trip = useTrobosStore.getState().currentTrip;
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trip }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || "Riwayat demo belum dapat disimpan.");
      }
    } catch (reason) {
      // A failed optional archive write must not prevent the guest experience.
      setError(reason instanceof Error ? reason.message : "Riwayat demo tidak tersimpan.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} mode="map"
      title="Konfirmasi perjalanan" subtitle="Periksa detail sebelum memulai simulasi."
      className="tr-review-sheet" maxHeight="max-h-[94dvh]">
      <div className="tr-review-content">
        <div className="tr-review-progress"><span className="tr-review-progress-current"/> <span/> <span/></div>
        <div className="tr-review-kicker"><ShieldCheck size={15}/> HANYA SIMULASI · TANPA PEMBAYARAN</div>
        <div className="tr-review-service-line">
          <span className="tr-review-service-icon">{serviceType === "MECHANIC" ? <Truck size={23}/> : <Bike size={23}/>}</span>
          <div><small>LAYANAN DIPILIH</small><strong>{serviceType === "MECHANIC" ? "Derek & Rescue" : "Tandem Ride"}</strong></div>
          <span className="tr-review-ready"><Check size={15}/> Siap</span>
        </div>
        <div className="tr-review-section-label">RENCANA RUTE</div>
        <div className="tr-review-route">
          <div className="tr-review-route-item">
            <span className="tr-review-origin-dot"/>
            <div><small>TITIK BANTUAN</small><strong>{pickup.name}</strong><p>{pickup.address}</p></div>
          </div>
          <div className="tr-review-route-item">
            <span className="tr-review-destination-dot"/>
            <div><small>TUJUAN PENUMPANG</small><strong>{destination.name}</strong><p>{destination.address}</p></div>
          </div>
          {serviceType === "MECHANIC" && (
            <div className="tr-review-route-item">
              <span className="tr-review-workshop-dot"/>
              <div><small>BENGKEL CONTOH TERDEKAT</small><strong>{workshop.name}</strong><p>Dipilih dari contoh lokasi berdasarkan jarak garis lurus.</p></div>
            </div>
          )}
        </div>
        <div className="tr-review-section-label">RINGKASAN ARMADA</div>
        <div className="tr-review-facts">
          <div><span><Users size={17}/></span><div><small>PENUMPANG</small><strong>{passengerCount} orang · {passengerTransport.type === "MOTOR" ? "Motor" : "Mobil pengganti"}</strong></div></div>
          <div><span><CarFront size={17}/></span><div><small>MOBIL PELANGGAN</small><strong>{chosenVehicle ? chosenVehicle.brand + " " + chosenVehicle.model : "Mobil demo"}</strong></div></div>
          <div><span><MapPin size={17}/></span><div><small>KENDARAAN KEDUA</small><strong>{serviceType === "MECHANIC" ? "Towing menuju bengkel contoh" : "Driver membawa mobil ke tujuan"}</strong></div></div>
        </div>
        <div className="tr-review-amount"><div><small>ESTIMASI DEMO</small><strong>{formatRupiah(estimate.totalFare)}</strong></div><span>± {estimate.distanceKm} km*</span></div>
        <p className="tr-review-disclaimer"><ShieldCheck size={16}/> Peta jalan menggunakan penyedia asli yang tersedia; posisi kendaraan, tarif, dan ETA adalah ilustrasi. Tidak ada permintaan driver atau pembayaran sungguhan. *Jarak bukan pengukuran rute aktual.</p>
        {error && <p role="status" className="tr-review-notice">{error} Simulasi tetap berjalan.</p>}
        <button type="button" className="tr-review-confirm" onClick={confirm} disabled={submitting || !currentTrip}>
          <span>{submitting ? "Menyimpan arsip demo..." : "Konfirmasi & buka tracking"}</span><ArrowRight size={19}/>
        </button>
        <button type="button" className="tr-review-edit" onClick={onClose}>Ubah detail perjalanan</button>
      </div>
    </BottomSheet>
  );
}
