"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Crosshair, Layers3, MapPin, Navigation2, Route } from "lucide-react";
import { useTrobosStore } from "@/store/useTrobosStore";
import type { LocationPoint, TripStatus } from "@/types/trobos";
import { MOCK_LOCATIONS } from "@/lib/mockData";
import { vehicleSvg, waypointSvg, routeBearing, type MovingVehicle, type Waypoint } from "@/lib/mapVehicleIcons";

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
  passengerKind?: "bike" | "car";
}

type Position = { lat: number; lng: number };
type MapSystem = "google" | "leaflet";
type MapGlobal = Window & { google?: { maps: any }; L?: any; __trobosGoogle?: Promise<void>; __trobosLeaflet?: Promise<void> };
const googleKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
const cartoKey = process.env.NEXT_PUBLIC_CARTO_BASEMAPS_API_KEY || "";
// OSM's standard raster tiles work without a key for modest demo traffic.
// CARTO now requires a separate key, including for its dark-mode raster style.
const OSM_TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>';
const PASSENGER = "#367EAB";
const TOWING = "#C27651";
const roadStyle = [
  { elementType: "geometry", stylers: [{ color: "#172534" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#9BAAB8" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#172534" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#324759" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#4B6173" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0B1825" }] },
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
];

function loadScript(globalName: "__trobosGoogle" | "__trobosLeaflet", url: string, verify: () => boolean) {
  const w = window as MapGlobal;
  if (verify()) return Promise.resolve();
  if (w[globalName]) return w[globalName]!;
  const promise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.onload = () => verify() ? resolve() : reject(new Error("Pustaka peta tidak siap"));
    script.onerror = () => reject(new Error("Peta tidak dapat dimuat"));
    document.head.appendChild(script);
  }).catch((error) => {
    w[globalName] = undefined;
    throw error;
  });
  w[globalName] = promise;
  return promise;
}
function loadMapEngine(useGoogle: boolean) {
  const w = window as MapGlobal;
  if (useGoogle) return loadScript(
    "__trobosGoogle",
    "https://maps.googleapis.com/maps/api/js?key=" + encodeURIComponent(googleKey) + "&v=weekly",
    () => Boolean(w.google?.maps?.Map)
  );
  if (!document.querySelector('link[data-trobos-leaflet]')) {
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    style.setAttribute("data-trobos-leaflet", "true");
    document.head.appendChild(style);
  }
  return loadScript(
    "__trobosLeaflet",
    "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
    () => Boolean(w.L?.map)
  );
}
function interpolate(points: Position[], percent: number): Position {
  if (!points.length) return { lat: -6.2155, lng: 106.8217 };
  if (points.length === 1) return points[0];
  // Length-weighted interpolation gives visually even travel speed along bends.
  const segmentLengths = points.slice(1).map((p, i) =>
    Math.hypot(p.lat - points[i].lat, (p.lng - points[i].lng) * Math.cos(p.lat * Math.PI / 180))
  );
  const length = segmentLengths.reduce((sum, value) => sum + value, 0);
  let remaining = Math.max(0, Math.min(100, percent)) / 100 * length;
  for (let index = 0; index < segmentLengths.length; index++) {
    if (remaining <= segmentLengths[index] || index === segmentLengths.length - 1) {
      const t = segmentLengths[index] ? Math.min(1, remaining / segmentLengths[index]) : 0;
      return { lat: points[index].lat + (points[index + 1].lat - points[index].lat) * t,
        lng: points[index].lng + (points[index + 1].lng - points[index].lng) * t };
    }
    remaining -= segmentLengths[index];
  }
  return points[points.length - 1];
}
function setVehicleHeading(marker: any, kind: MovingVehicle, bearing: number, system: MapSystem) {
  if (!marker) return;
  // SVG vehicles face north at zero degrees. Rotate their inner graphics only
  // so the marker badge stays correctly anchored on the road.
  if (system === "google") {
    const heading = Math.round(bearing / 6) * 6;
    if (marker.__trobosBearing === heading) return;
    marker.__trobosBearing = heading;
    const maps = (window as MapGlobal).google?.maps;
    if (maps) marker.setIcon(googleSvgIcon(maps, vehicleSvg(kind, heading), 54));
  } else {
    const rotator = marker.getElement?.()?.querySelector?.("[data-vehicle-heading]") as SVGGElement | null;
    if (rotator) rotator.setAttribute("transform", "rotate(" + Math.round(bearing) + " 32 32)");
  }
}
function moveVehicle(marker: any, route: Position[], progress: number, kind: MovingVehicle, system: MapSystem) {
  if (!marker || !route.length) return;
  const position = interpolate(route, progress);
  const toward = interpolate(route, Math.min(100, progress + 0.55));
  const behind = interpolate(route, Math.max(0, progress - 0.55));
  if (system === "google") marker.setPosition(position);
  else marker.setLatLng([position.lat, position.lng]);
  setVehicleHeading(marker, kind, routeBearing(behind, toward), system);
}
function guidePath(a: Position, b: Position): Position[] {
  // Offline illustration only: Google Directions replaces this with road geometry when configured.
  const midLat = a.lat + (b.lat - a.lat) * 0.44;
  const midLng = a.lng + (b.lng - a.lng) * 0.52;
  return [a, { lat: midLat, lng: a.lng }, { lat: midLat, lng: midLng },
    { lat: b.lat, lng: midLng }, b];
}
function demoApproach(origin: Position): Position[] {
  return guidePath({ lat: origin.lat + 0.009, lng: origin.lng + 0.008 }, origin);
}
function googleSvgIcon(maps: any, svg: string, size: number) {
  return {
    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
    scaledSize: new maps.Size(size,size),
    anchor: new maps.Point(size/2,size/2),
  };
}
function createGoogleMarker(maps: any, map: any, point: Position, title: string, kind: Waypoint | MovingVehicle) {
  const moving = kind === "bike" || kind === "car" || kind === "tow";
  return new maps.Marker({
    map, title, position: point, zIndex: moving ? 30 : 10,
    icon: googleSvgIcon(maps, moving ? vehicleSvg(kind) : waypointSvg(kind), moving ? 54 : 48),
  });
}
function googlePath(map: any, maps: any, coords: Position[], color: string) {
  return new maps.Polyline({ map, path: coords, strokeColor: color, strokeOpacity: 0.92, strokeWeight: 5 });
}
const knownDemoPoints: Position[] = [
  MOCK_LOCATIONS.current, ...MOCK_LOCATIONS.destinations, ...MOCK_LOCATIONS.workshops,
];

function isPublicDemoPoint(point: Position): boolean {
  return knownDemoPoints.some(existing =>
    Math.abs(existing.lat - point.lat) < 0.000001 && Math.abs(existing.lng - point.lng) < 0.000001
  );
}

async function routeFromOsrmDemo(start: Position, end: Position): Promise<Position[]> {
  // No GPS or custom coordinates are sent to a third-party routing provider.
  // This free demo endpoint is used only for preset public Jakarta examples;
  // it is not suitable for a commercial or emergency dispatch service.
  if (!isPublicDemoPoint(start) || !isPublicDemoPoint(end)) throw new Error("Hanya lokasi demo");
  const cacheKey = "trobos-road-demo-v1:" + [start.lat,start.lng,end.lat,end.lng].join(",");
  try {
    const cached = window.sessionStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached) as Position[];
  } catch { /* session storage unavailable */ }
  const url = "https://router.project-osrm.org/route/v1/driving/" +
    start.lng + "," + start.lat + ";" + end.lng + "," + end.lat +
    "?overview=full&geometries=geojson";
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 6000);
  try {
    const response = await fetch(url, { signal: controller.signal, cache: "force-cache" });
    if (!response.ok) throw new Error("Demo route unavailable");
    const payload = await response.json();
    const coords = payload?.routes?.[0]?.geometry?.coordinates;
    if (!Array.isArray(coords) || coords.length < 2 || coords.length > 10000) throw new Error("Demo geometry invalid");
    const path: Position[] = coords.map(([lng, lat]: [number,number]) => ({lat,lng}));
    try { window.sessionStorage.setItem(cacheKey, JSON.stringify(path)); } catch { /* optional cache */ }
    return path;
  } finally { window.clearTimeout(timeout); }
}

async function routeFromGoogle(start: Position, end: Position): Promise<Position[]> {
  // Routes Library supersedes legacy DirectionsService, which cannot be enabled
  // for new Google Cloud projects. Google route requests require enabled billing.
  const maps = (window as MapGlobal).google!.maps;
  const { Route } = await maps.importLibrary("routes");
  const result = await Route.computeRoutes({
    origin: start, destination: end, travelMode: "DRIVING", fields: ["path"],
  });
  const raw = result?.routes?.[0]?.path;
  if (!Array.isArray(raw) || raw.length < 2) throw new Error("Rute jalan belum tersedia");
  return raw.map((point: any) => ({
    lat: typeof point.lat === "function" ? point.lat() : point.lat,
    lng: typeof point.lng === "function" ? point.lng() : point.lng,
  }));
}
function fitPointsGoogle(map: any, maps: any, points: Position[]) {
  const bounds = new maps.LatLngBounds();
  points.forEach(point => bounds.extend(point));
  const left = window.innerWidth >= 1024 ? 470 : window.innerWidth >= 768 ? 385 : 48;
  map.fitBounds(bounds, { top: 95, right: 48, bottom: window.innerWidth < 768 ? 220 : 90, left });
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  status = "IDLE", userProgress = 0, carProgress = 0,
  origin = MOCK_LOCATIONS.current,
  passengerDestination = MOCK_LOCATIONS.destinations[0],
  carDestination = MOCK_LOCATIONS.workshops[0],
  className = "",
  passengerKind = "bike",
}) => {
  const theme = useTrobosStore(s => s.theme);
  const setPickupLocation = useTrobosStore(s => s.setPickupLocation);
  const setArrived = useTrobosStore(s => s.setArrived);
  const updateLiveProgress = useTrobosStore(s => s.updateLiveProgress);
  const userArrivedAtDest = useTrobosStore(s => s.userArrivedAtDest);
  const carArrivedAtDest = useTrobosStore(s => s.carArrivedAtDest);
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<{ pickup?: any; destination?: any; workshop?: any; rider?: any; towing?: any }>({});
  const routesRef = useRef<{ passenger: Position[]; towing: Position[]; approach: Position[] }>({ passenger: [], towing: [], approach: [] });
  const layersRef = useRef<any[]>([]);
  const tileRef = useRef<any>(null);
  const engineRef = useRef<MapSystem | null>(null);
  const [engine, setEngine] = useState<MapSystem | null>(null);
  const [message, setMessage] = useState("");
  const [follow, setFollow] = useState(false);
  const followRef = useRef(false);
  useEffect(() => { followRef.current = follow; }, [follow]);
  const [routeMode, setRouteMode] = useState<"roads" | "illustration">("illustration");
  const [recenterId, setRecenterId] = useState(0);
  const dark = theme === "dark";
  const google = Boolean(googleKey);
  const tripRunning = status === "TRIP_STARTED" || status === "USER_ARRIVED" || status === "VEHICLE_ARRIVED" || status === "COMPLETED";
  const approaching = status === "TANDEM_APPROACHING";
  const fallbackFrame = useMemo(() => {
    const offset = 0.023;
    const bbox = [origin.lng - offset, origin.lat - offset, origin.lng + offset, origin.lat + offset].join(",");
    return "https://www.openstreetmap.org/export/embed.html?bbox=" + encodeURIComponent(bbox) + "&layer=mapnik&marker=" +
      encodeURIComponent(origin.lat + "," + origin.lng);
  }, [origin.lat, origin.lng]);

  useEffect(() => {
    let cancelled = false;
    const objects: any[] = [];
    const cleanup = () => {
      objects.forEach(object => { try { object.setMap?.(null); object.remove?.(); } catch { /* map was destroyed */ } });
      Object.values(markersRef.current).forEach(marker => {
        try { marker?.setMap?.(null); marker?.remove?.(); } catch { /* already detached */ }
      });
      try { mapRef.current?.remove?.(); } catch { /* map already detached */ }
      mapRef.current = null;
      tileRef.current = null;
      markersRef.current = {};
      layersRef.current = [];
      engineRef.current = null;
    };
    async function setup() {
      setMessage("");
      setEngine(null);
      try {
        await loadMapEngine(google);
        if (cancelled || !hostRef.current) return;
        const w = window as MapGlobal;
        const originPos = { lat: origin.lat, lng: origin.lng };
        const passengerPos = { lat: passengerDestination.lat, lng: passengerDestination.lng };
        const carPos = { lat: carDestination.lat, lng: carDestination.lng };
        const mapSystem: MapSystem = google ? "google" : "leaflet";
        engineRef.current = mapSystem;
        let map: any;
        if (google) {
          const maps = w.google!.maps;
          map = new maps.Map(hostRef.current, {
            center: originPos, zoom: 13,
            styles: dark ? roadStyle : [
              { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
              { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
            ],
            clickableIcons: false, streetViewControl: false, mapTypeControl: false,
            fullscreenControl: false, zoomControl: false, gestureHandling: "greedy",
          });
          mapRef.current = map;
          markersRef.current.pickup = createGoogleMarker(maps, map, originPos, "Titik bantuan", "pickup");
          markersRef.current.destination = createGoogleMarker(maps, map, passengerPos, "Tujuan penumpang", "passenger");
          markersRef.current.workshop = createGoogleMarker(maps, map, carPos, "Tujuan mobil", "workshop");
          markersRef.current.rider = createGoogleMarker(maps, map, originPos, "Armada penumpang simulasi", passengerKind);
          markersRef.current.towing = createGoogleMarker(maps, map, originPos, "Towing simulasi", "tow");
          const resolveRoad = (end: Position) => routeFromGoogle(originPos, end).catch(() => guidePath(originPos, end));
          const [passengerRoute, towingRoute, approachRoute] = await Promise.all([
            resolveRoad(passengerPos),
            resolveRoad(carPos),
            routeFromGoogle(demoApproach(originPos)[0], originPos).catch(() => demoApproach(originPos)),
          ]);
          if (cancelled) return;
          routesRef.current = { passenger: passengerRoute, towing: towingRoute, approach: approachRoute };
          setRouteMode(passengerRoute.length > 5 && towingRoute.length > 5 ? "roads" : "illustration");
          objects.push(googlePath(map, maps, passengerRoute, PASSENGER));
          objects.push(googlePath(map, maps, towingRoute, TOWING));
          fitPointsGoogle(map, maps, [originPos, passengerPos, carPos]);
        } else {
          const L = w.L!;
          map = L.map(hostRef.current, { zoomControl: false, attributionControl: true, preferCanvas: true });
          mapRef.current = map;
          // Keyless default: real OSM street tiles. Dark appearance is a CSS
          // filter on the raster tiles ONLY, leaving vehicle markers colorful.
          // A separately configured CARTO key enables native CARTO dark/light.
          const osMtiles = () => L.tileLayer(OSM_TILE_URL, {
            maxZoom: 19,
            attribution: OSM_ATTRIBUTION,
            className: "trobos-osm-tiles",
          });
          const cartoUrl = dark
            ? "https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
            : "https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png";
          let tileLayer = cartoKey
            ? L.tileLayer(cartoUrl + "?key=" + encodeURIComponent(cartoKey), {
                maxZoom: 19,
                attribution: OSM_ATTRIBUTION + " &copy; CARTO",
                className: "trobos-carto-tiles",
              })
            : osMtiles();
          tileRef.current = tileLayer.addTo(map);
          if (cartoKey) {
            // An invalid/expired key must NEVER leave an entire viewport
            // covered by "API KEY REQUIRED" watermark tiles.
            let switchedToOsm = false;
            tileLayer.on("tileerror", () => {
              if (cancelled || switchedToOsm || !mapRef.current) return;
              switchedToOsm = true;
              map.removeLayer(tileLayer);
              tileLayer = osMtiles();
              tileRef.current = tileLayer.addTo(map);
              setMessage("Gaya peta CARTO tidak tersedia. Menggunakan OpenStreetMap sebagai cadangan.");
            });
          }
          const icon = (kind: Waypoint | MovingVehicle) => {
            const moving = kind === "bike" || kind === "car" || kind === "tow";
            const size = moving ? 54 : 48;
            return L.divIcon({
              html: moving ? vehicleSvg(kind) : waypointSvg(kind),
              className: "trobos-marker-shell tr-vector-marker",
              iconSize: [size,size], iconAnchor: [size/2,size/2],
            });
          };
          markersRef.current.pickup = L.marker([origin.lat, origin.lng], { icon: icon("pickup"), zIndexOffset: 100 }).addTo(map);
          markersRef.current.destination = L.marker([passengerDestination.lat, passengerDestination.lng], { icon: icon("passenger"), zIndexOffset: 100 }).addTo(map);
          markersRef.current.workshop = L.marker([carDestination.lat, carDestination.lng], { icon: icon("workshop"), zIndexOffset: 100 }).addTo(map);
          markersRef.current.rider = L.marker([origin.lat, origin.lng], { icon: icon(passengerKind), zIndexOffset: 120 });
          markersRef.current.towing = L.marker([origin.lat, origin.lng], { icon: icon("tow"), zIndexOffset: 125 });
          let passengerRoute = guidePath(originPos, passengerPos);
          let towingRoute = guidePath(originPos, carPos);
          const approachRoute = demoApproach(originPos);
          // Respect the OSRM demo server's <=1 request/second guidance.
          // Only public fixture coordinates are allowed; never forward browser GPS.
          if (isPublicDemoPoint(originPos)) {
            try {
              passengerRoute = await routeFromOsrmDemo(originPos, passengerPos);
              await new Promise(resolve => window.setTimeout(resolve, 1100));
              towingRoute = await routeFromOsrmDemo(originPos, carPos);
            } catch { /* Show an explicitly labelled illustrative route instead. */ }
          }
          if (cancelled) return;
          routesRef.current = { passenger: passengerRoute, towing: towingRoute, approach: approachRoute };
          const pLayer = L.polyline(passengerRoute.map(p => [p.lat, p.lng]), { color: PASSENGER, weight: 5, opacity: 0.85 }).addTo(map);
          const cLayer = L.polyline(towingRoute.map(p => [p.lat, p.lng]), { color: TOWING, weight: 5, opacity: 0.85 }).addTo(map);
          layersRef.current = [pLayer, cLayer];
          map.fitBounds(L.latLngBounds([[origin.lat,origin.lng],[passengerDestination.lat,passengerDestination.lng],[carDestination.lat,carDestination.lng]]).pad(.12), {
            animate: false,
            paddingTopLeft: [window.innerWidth >= 1024 ? 420 : window.innerWidth >= 768 ? 350 : 28, 100],
            paddingBottomRight: [40, window.innerWidth < 768 ? 220 : 30],
          });
          L.control.zoom({ position: "bottomright" }).addTo(map);
          setRouteMode(passengerRoute.length > 5 && towingRoute.length > 5 ? "roads" : "illustration");
          // Prevent partial tile layout after the flex container finishes animating.
          window.setTimeout(() => { if (!cancelled) map.invalidateSize(); }, 150);
        }
        if (!cancelled) setEngine(mapSystem);
      } catch (error) {
        if (!cancelled) {
          cleanup();
          setEngine(null);
          setMessage(error instanceof Error ? error.message : "Peta tidak tersedia");
        }
      }
    }
    void setup();
    return () => { cancelled = true; cleanup(); };
  }, [google, dark, origin.lat, origin.lng, passengerDestination.lat, passengerDestination.lng, carDestination.lat, carDestination.lng, passengerKind]);

  useEffect(() => {
    if (!engine || !mapRef.current) return;
    const markers = markersRef.current;
    const route = routesRef.current;
    const show = (marker: any, visible: boolean) => {
      if (!marker) return;
      if (engine === "google") marker.setVisible(visible);
      else if (visible) { if (!mapRef.current?.hasLayer(marker)) marker.addTo(mapRef.current); }
      else if (mapRef.current?.hasLayer(marker)) mapRef.current.removeLayer(marker);
    };
    show(markers.rider, approaching || tripRunning);
    show(markers.towing, tripRunning);
    moveVehicle(markers.rider, approaching ? route.approach : route.passenger,
      approaching ? 0 : userProgress, passengerKind, engine);
    moveVehicle(markers.towing, route.towing, carProgress, "tow", engine);
  }, [engine, approaching, tripRunning, userProgress, carProgress, passengerKind]);

  useEffect(() => {
    if (!engine || (!tripRunning && !approaching)) return;
    let frame = 0;
    let last = 0;
    let lastPan = 0;
    const start = performance.now();
    const fromUser = userProgress;
    const fromCar = carProgress;
    const currentStatus = status;
    const update = (now: number) => {
      const elapsed = now - start;
      if (currentStatus === "TANDEM_APPROACHING") {
        const approachPercent = Math.min(100, elapsed / 14500 * 100);
        const marker = markersRef.current.rider;
        if (marker) {
          const pos = interpolate(routesRef.current.approach, approachPercent);
          if (engineRef.current) moveVehicle(marker, routesRef.current.approach, approachPercent, passengerKind, engineRef.current);
          if (followRef.current && mapRef.current && now - lastPan > 1800) {
            mapRef.current.panTo(engineRef.current === "google" ? pos : [pos.lat,pos.lng]);
            lastPan = now;
          }
        }
        if (approachPercent === 100) { setArrived(); return; }
      } else if (currentStatus === "TRIP_STARTED" || currentStatus === "USER_ARRIVED") {
        const up = currentStatus === "USER_ARRIVED" ? 100 : Math.min(100, fromUser + elapsed / 38000 * 100);
        const cp = Math.min(100, fromCar + elapsed / 55000 * 100);
        if (followRef.current && mapRef.current && now - lastPan > 1800) {
          const location = interpolate(routesRef.current.passenger, up);
          mapRef.current.panTo(engineRef.current === "google" ? location : [location.lat, location.lng]);
          lastPan = now;
        }
        if (now - last > 300) {
          updateLiveProgress(Math.round(up), Math.round(cp), Math.ceil((100 - up) / 100 * 2), Math.ceil((100 - cp) / 100 * 3));
          last = now;
        }
        if (up >= 100 && currentStatus === "TRIP_STARTED") { userArrivedAtDest(); return; }
        if (cp >= 100 && currentStatus === "USER_ARRIVED") { carArrivedAtDest(); return; }
      } else return;
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
    // Current progress is sampled only when the trip phase changes, not on every animation tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine, status, setArrived, updateLiveProgress, userArrivedAtDest, carArrivedAtDest, passengerKind]);

  useEffect(() => {
    if (!engine || !mapRef.current) return;
    const map = mapRef.current;
    if (engine === "google") {
      fitPointsGoogle(map, (window as MapGlobal).google!.maps,
        [origin, passengerDestination, carDestination]);
    } else {
      const L = (window as MapGlobal).L!;
      map.fitBounds(L.latLngBounds([
        [origin.lat,origin.lng], [passengerDestination.lat,passengerDestination.lng],
        [carDestination.lat,carDestination.lng],
      ]).pad(.12), {
        paddingTopLeft: [window.innerWidth >= 1024 ? 420 : window.innerWidth >= 768 ? 350 : 28, 95],
        paddingBottomRight: [40, window.innerWidth < 768 ? 220 : 30],
      });
    }
  }, [recenterId, engine, origin, passengerDestination, carDestination]);

  const requestLocation = () => {
    if (!navigator.geolocation) { setMessage("GPS tidak tersedia pada browser ini."); return; }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPickupLocation({
          name: "Lokasi Saya", address: coords.latitude.toFixed(5) + ", " + coords.longitude.toFixed(5),
          lat: coords.latitude, lng: coords.longitude,
        });
        setMessage("Lokasi telah diperbarui. Berikan izin lokasi hanya jika Anda menghendakinya.");
      },
      () => setMessage("Lokasi tidak diizinkan atau belum tersedia. Contoh Jakarta tetap digunakan."),
      { timeout: 12000, enableHighAccuracy: false, maximumAge: 60000 }
    );
  };

  return (
    <div className={"trobos-live-map relative w-full h-full min-h-[360px] overflow-hidden bg-[#DDE5E7] dark:bg-[#15212D] " + className}>
      <div ref={hostRef} className="absolute inset-0 z-0" aria-label="Peta interaktif TROBOS" />
      {!engine && (
        <iframe title="Peta OpenStreetMap cadangan" src={fallbackFrame}
          className="absolute inset-0 w-full h-full border-0" loading="lazy" />
      )}
      <div className="absolute z-10 left-4 bottom-[min(22rem,45%)] lg:bottom-5 pointer-events-none max-w-[260px]">
        <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/90 dark:bg-[#192633]/95 text-[#334251] dark:text-[#E5EDF2] text-[11px] font-semibold shadow-lg backdrop-blur-xl border border-white/65 dark:border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4C9B81]"/>
          {engine === "google" ? "Google Maps" : "OpenStreetMap"} · {routeMode === "roads" ? (engine === "google" ? "Routes API" : "OSRM demo") : "Rute ilustrasi"}
        </span>
        {message && <p role="status" className="mt-2 rounded-xl px-3 py-2 bg-white/95 dark:bg-[#192633]/95 text-xs text-slate-700 dark:text-slate-200">{message}</p>}
      </div>
      <div className="absolute z-20 top-[92px] right-4 lg:top-5 flex flex-col gap-2">
        <button type="button" onClick={() => setRecenterId(x => x + 1)}
          className="trobos-map-control" aria-label="Tampilkan seluruh rute" title="Tampilkan seluruh rute">
          <Layers3 size={19}/>
        </button>
        <button type="button" onClick={requestLocation} disabled={status !== "IDLE"}
          className="trobos-map-control disabled:opacity-40" aria-label="Gunakan lokasi perangkat" title="Gunakan GPS">
          <Crosshair size={19}/>
        </button>
        {(approaching || tripRunning) && <button type="button" onClick={() => setFollow(!follow)}
          className={"trobos-map-control " + (follow ? "text-[#C27651] ring-2 ring-[#C27651]/40" : "")}
          aria-pressed={follow} aria-label="Ikuti kendaraan animasi">
          <Navigation2 size={19}/>
        </button>}
      </div>
      <div className="absolute z-10 right-4 bottom-[min(22rem,45%)] lg:bottom-5 hidden sm:flex items-center gap-2 text-xs text-white/95">
        <span className="rounded-full bg-[#367EAB] px-2.5 py-1.5 shadow-sm">● Penumpang</span>
        <span className="rounded-full bg-[#C27651] px-2.5 py-1.5 shadow-sm">● Mobil</span>
      </div>
      <div className="sr-only"><MapPin/><Route/>Tracking dan rute adalah simulasi. Tidak ada GPS driver sungguhan.</div>
    </div>
  );
};
