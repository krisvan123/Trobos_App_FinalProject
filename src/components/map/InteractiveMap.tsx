"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Crosshair, MapPin, Truck, Users } from "lucide-react";
import { useTrobosStore } from "@/store/useTrobosStore";
import type { LocationPoint, TripStatus } from "@/types/trobos";
import { MOCK_LOCATIONS } from "@/lib/mockData";

interface InteractiveMapProps {
  status?: TripStatus;
  userProgress?: number;
  carProgress?: number;
  origin?: LocationPoint;
  passengerDestination?: LocationPoint;
  carDestination?: LocationPoint;
  originName?: string;
  destinationName?: string;
  className?: string;
}

type MapsWindow = Window & { google?: { maps: any }; __trobosMapsPromise?: Promise<void> };
const googleKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

function loadGoogleMaps(): Promise<void> {
  const w = window as MapsWindow;
  if (w.google?.maps?.Map) return Promise.resolve();
  if (w.__trobosMapsPromise) return w.__trobosMapsPromise;
  w.__trobosMapsPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=" + encodeURIComponent(googleKey) + "&v=weekly&loading=async";
    script.async = true;
    script.onload = () => w.google?.maps?.Map ? resolve() : reject(new Error("Google Maps unavailable"));
    script.onerror = () => reject(new Error("Google Maps script could not load"));
    document.head.appendChild(script);
  }).catch((error) => {
    w.__trobosMapsPromise = undefined;
    throw error;
  });
  return w.__trobosMapsPromise;
}

function interpolate(a: LocationPoint, b: LocationPoint, percent: number) {
  const progress = Math.max(0, Math.min(percent / 100, 1));
  return { lat: a.lat + (b.lat - a.lat) * progress, lng: a.lng + (b.lng - a.lng) * progress };
}

/**
 * Actual map tiles from Google Maps (when configured) or OpenStreetMap.
 * Vehicle positions and straight connector lines are deliberately labelled
 * demo illustrations, NOT live GPS telemetry or turn-by-turn directions.
 */
export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  status = "IDLE",
  userProgress = 0,
  carProgress = 0,
  origin = MOCK_LOCATIONS.current,
  passengerDestination = MOCK_LOCATIONS.destinations[0],
  carDestination = MOCK_LOCATIONS.workshops[0],
  className = "",
}) => {
  const setPickupLocation = useTrobosStore((s) => s.setPickupLocation);
  const [error, setError] = useState<string | null>(null);
  const [mapsReady, setMapsReady] = useState(false);
  const divRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const elementsRef = useRef<any[]>([]);
  const active = status === "TRIP_STARTED" || status === "USER_ARRIVED" || status === "VEHICLE_ARRIVED" || status === "COMPLETED";

  const draw = useCallback(() => {
    if (!mapRef.current) return;
    const maps = (window as MapsWindow).google?.maps;
    if (!maps) return;
    elementsRef.current.forEach((item) => item.setMap(null));
    const elements: any[] = [];
    const center = { lat: origin.lat, lng: origin.lng };
    const pickup = new maps.Marker({ map: mapRef.current, position: center, title: "Titik bantuan", label: "A" });
    elements.push(pickup);
    const passenger = new maps.Marker({
      map: mapRef.current,
      position: { lat: passengerDestination.lat, lng: passengerDestination.lng },
      title: "Tujuan penumpang", label: "P",
    });
    elements.push(passenger);
    const car = new maps.Marker({
      map: mapRef.current,
      position: { lat: carDestination.lat, lng: carDestination.lng },
      title: "Tujuan mobil", label: "M",
    });
    elements.push(car);

    if (active) {
      elements.push(new maps.Marker({
        map: mapRef.current, position: interpolate(origin, passengerDestination, userProgress),
        title: "Posisi kendaraan penumpang (simulasi)", label: "1",
        icon: { path: maps.SymbolPath.CIRCLE, scale: 13, fillColor: "#0284C7", fillOpacity: 1, strokeWeight: 2, strokeColor: "#ffffff" },
      }));
      elements.push(new maps.Marker({
        map: mapRef.current, position: interpolate(origin, carDestination, carProgress),
        title: "Posisi towing (simulasi)", label: "2",
        icon: { path: maps.SymbolPath.CIRCLE, scale: 13, fillColor: "#FF4D00", fillOpacity: 1, strokeWeight: 2, strokeColor: "#ffffff" },
      }));
      for (const [end,color] of [[passengerDestination,"#0284C7"],[carDestination,"#FF4D00"]] as const) {
        elements.push(new maps.Polyline({
          map: mapRef.current, path: [center,{lat:end.lat,lng:end.lng}], strokeColor: color,
          strokeOpacity: 0, icons: [{icon:{path:"M 0,-1 0,1",strokeOpacity:.8,scale:3},offset:"0",repeat:"14px"}],
        }));
      }
    }
    elementsRef.current = elements;
  }, [origin.lat, origin.lng, passengerDestination.lat, passengerDestination.lng, carDestination.lat, carDestination.lng, active, userProgress, carProgress]);

  useEffect(() => {
    if (!googleKey || !divRef.current) return;
    let cancelled = false;
    loadGoogleMaps().then(() => {
      if (cancelled || !divRef.current) return;
      const maps = (window as MapsWindow).google?.maps;
      if (!maps) return;
      mapRef.current = new maps.Map(divRef.current, {
        center: { lat: origin.lat, lng: origin.lng },
        zoom: 13, streetViewControl: false, fullscreenControl: false, mapTypeControl: false,
      });
      setMapsReady(true);
    }).catch(() => { if (!cancelled) setError("Google Maps gagal dimuat. Periksa API key, billing, dan domain yang diizinkan."); });
    return () => {
      cancelled = true;
      elementsRef.current.forEach(item => item.setMap(null));
      elementsRef.current = [];
      mapRef.current = null;
    };
  }, [origin.lat, origin.lng]);

  useEffect(() => { if (mapsReady) draw(); }, [mapsReady, draw]);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Browser tidak mendukung GPS.");
      return;
    }
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const point: LocationPoint = {
          name: "Lokasi GPS Saya",
          address: position.coords.latitude.toFixed(5) + ", " + position.coords.longitude.toFixed(5),
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setPickupLocation(point);
        mapRef.current?.panTo({ lat: point.lat, lng: point.lng });
      },
      () => setError("Izin lokasi ditolak atau GPS tidak tersedia. Lokasi demo tetap digunakan."),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  };

  const delta = 0.025;
  const url = "https://www.openstreetmap.org/export/embed.html?bbox=" +
    [origin.lng - delta, origin.lat - delta, origin.lng + delta, origin.lat + delta].map(encodeURIComponent).join("%2C") +
    "&layer=mapnik&marker=" + encodeURIComponent(origin.lat + "," + origin.lng);

  return (
    <div className={"relative w-full h-full min-h-[340px] bg-slate-100 dark:bg-slate-800 " + className}>
      {googleKey && !error ? (
        <div ref={divRef} className="absolute inset-0" aria-label="Peta Google Maps" />
      ) : (
        <iframe title="Peta OpenStreetMap interaktif (cadangan)" src={url} loading="lazy" className="absolute inset-0 w-full h-full border-0" />
      )}
      <div className="absolute top-3 left-3 z-10 max-w-[235px] p-2.5 rounded-xl bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm text-[11px] pointer-events-none space-y-1">
        <div className="font-extrabold flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#FF4D00]" />
          {googleKey && !error ? "Google Maps" : "OpenStreetMap"}
        </div>
        <p className="text-slate-600 dark:text-slate-300">
          Peta jalan asli. Marker, jalur dan kemajuan unit adalah simulasi, bukan pelacakan GPS langsung.
        </p>
        {active && googleKey && !error && (
          <div className="flex items-center gap-3 font-semibold">
            <span className="text-sky-600 flex gap-1 items-center"><Users className="w-3 h-3" /> Penumpang</span>
            <span className="text-orange-600 flex gap-1 items-center"><Truck className="w-3 h-3" /> Towing</span>
          </div>
        )}
        {!googleKey && <p className="text-orange-600">Tambahkan Google Maps API key untuk mengaktifkan Google Maps.</p>}
        {error && <p className="text-red-600">{error}</p>}
      </div>
      <button
        type="button"
        onClick={requestLocation}
        disabled={status !== "IDLE"}
        className="absolute right-3 top-3 z-10 p-3 rounded-xl bg-white dark:bg-slate-900 shadow-lg text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 disabled:opacity-50"
        aria-label="Gunakan lokasi perangkat sebagai titik penjemputan"
        title={status === "IDLE" ? "Gunakan GPS saya" : "Lokasi terkunci selama pemesanan"}
      >
        <Crosshair className="w-5 h-5" />
      </button>
    </div>
  );
};
