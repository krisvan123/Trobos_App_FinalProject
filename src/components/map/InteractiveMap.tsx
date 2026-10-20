"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Crosshair, Layers3, MapPin, Navigation2, Route } from "lucide-react";
import { useTrobosStore } from "@/store/useTrobosStore";
import type { LocationPoint, TripStatus } from "@/types/trobos";
import { MOCK_LOCATIONS, DEMO_PICKUP_POINTS, WORKSHOP_DESTINATIONS } from "@/lib/mockData";
import { vehicleSvg, waypointSvg, type MovingVehicle, type Waypoint } from "@/lib/mapVehicleIcons";
import { prepareRoute, sampleRoute, sampleHeading, type PreparedRoute } from "@/lib/routeMotion";

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
  carKind?: "tow" | "car";
  selectionMode?: "pickup" | "destination";
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
function moveVehicle(marker: any, route: PreparedRoute, progress: number, kind: MovingVehicle, system: MapSystem) {
  if (!marker || !route.points.length) return;
  const position = sampleRoute(route, progress);
  if (system === "google") marker.setPosition(position);
  else marker.setLatLng([position.lat, position.lng]);
  setVehicleHeading(marker, kind, sampleHeading(route, progress), system);
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
function googlePath(map: any, maps: any, coords: Position[], color: string, dashed = false) {
  // Passenger is solid blue. Towing/customer-car is dashed copper,
  // so even temporarily shared roads remain visually distinguishable.
  return new maps.Polyline({
    map, path: coords, strokeColor: color,
    strokeOpacity: dashed ? 0.20 : 0.92, strokeWeight: dashed ? 6 : 5,
    icons: dashed ? [{
      icon: { path: "M 0,-1 0,1", strokeOpacity: 1, strokeColor: color, strokeWeight: 3, scale: 4 },
      offset: "0", repeat: "24px",
    }] : undefined,
  });
}
const knownDemoPoints: Position[] = [
  MOCK_LOCATIONS.current, ...DEMO_PICKUP_POINTS, ...MOCK_LOCATIONS.destinations,
  ...WORKSHOP_DESTINATIONS, ...MOCK_LOCATIONS.workshops,
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
  const cacheKey = "trobos-road-demo-v2:" + [start.lat,start.lng,end.lat,end.lng].join(",");
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
function isPreviewMap(host: HTMLElement | null): boolean {
  return Boolean(host?.closest(".tr-hero-map"));
}
function mapPadding(host: HTMLElement | null) {
  const preview = isPreviewMap(host);
  const phone = window.innerWidth < 768;
  const tablet = window.innerWidth < 1024;
  if (preview) return { top: 85, right: 22, bottom: 165, left: 22 };
  // Map-first tracking has no permanently docked left booking panel.
  // Reserve only enough space for the compact tracking card.
  if (host?.closest(".tr-experience-map")) {
    return { top: phone ? 170 : 160, right: phone ? 22 : 58,
      bottom: phone ? 260 : 105, left: phone ? 30 : tablet ? 260 : 405 };
  }
  return { top: 95, right: 48, bottom: phone ? 220 : 90, left: phone ? 48 : tablet ? 385 : 470 };
}
function fitPointsGoogle(map: any, maps: any, points: Position[], host: HTMLElement | null) {
  const bounds = new maps.LatLngBounds();
  points.forEach(point => bounds.extend(point));
  map.fitBounds(bounds, mapPadding(host));
}
function fitPointsLeaflet(map: any, L: any, points: Position[], host: HTMLElement | null, animate: boolean) {
  const padding = mapPadding(host);
  map.fitBounds(L.latLngBounds(points.map(point => [point.lat, point.lng])).pad(.12), {
    animate,
    paddingTopLeft: [padding.left, padding.top],
    paddingBottomRight: [padding.right, padding.bottom],
  });
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  status = "IDLE", userProgress = 0, carProgress = 0,
  origin = MOCK_LOCATIONS.current,
  passengerDestination = MOCK_LOCATIONS.destinations[0],
  carDestination = MOCK_LOCATIONS.workshops[0],
  className = "",
  passengerKind = "bike",
  carKind = "tow",
  selectionMode,
}) => {
  const theme = useTrobosStore(s => s.theme);
  const setPickupLocation = useTrobosStore(s => s.setPickupLocation);
  const setSelectedDestination = useTrobosStore(s => s.setSelectedDestination);
  const setArrived = useTrobosStore(s => s.setArrived);
  const updateLiveProgress = useTrobosStore(s => s.updateLiveProgress);
  const userArrivedAtDest = useTrobosStore(s => s.userArrivedAtDest);
  const carArrivedAtDest = useTrobosStore(s => s.carArrivedAtDest);
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<{ pickup?: any; destination?: any; workshop?: any; rider?: any; towing?: any }>({});
  const routesRef = useRef<{ passenger: PreparedRoute; towing: PreparedRoute; approach: PreparedRoute }>({
    passenger: prepareRoute([]), towing: prepareRoute([]), approach: prepareRoute([]),
  });
  const layersRef = useRef<any[]>([]);
  const tileRef = useRef<any>(null);
  const engineRef = useRef<MapSystem | null>(null);
  const [engine, setEngine] = useState<MapSystem | null>(null);
  const [message, setMessage] = useState("");
  const followTarget = useTrobosStore(s => s.mapFocus);
  const setFollowTarget = useTrobosStore(s => s.setMapFocus);
  const followRef = useRef(followTarget);
  useEffect(() => { followRef.current = followTarget; }, [followTarget]);
  const [routeMode, setRouteMode] = useState<"roads" | "mixed" | "illustration">("illustration");
  const [selectedPoint, setSelectedPoint] = useState<Position | null>(null);
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
          if (selectionMode) {
            map.addListener("click", (event: any) => {
              const clicked = event.latLng;
              if (clicked) setSelectedPoint({lat: clicked.lat(), lng: clicked.lng()});
            });
          }
          // Manual dragging should never fight against automatic follow.
          map.addListener("dragstart", () => setFollowTarget("off"));
          markersRef.current.pickup = createGoogleMarker(maps, map, originPos, "Titik bantuan", "pickup");
          markersRef.current.destination = createGoogleMarker(maps, map, passengerPos, "Tujuan penumpang", "passenger");
          markersRef.current.workshop = createGoogleMarker(maps, map, carPos, "Tujuan mobil", "workshop");
          markersRef.current.rider = createGoogleMarker(maps, map, originPos, "Armada penumpang simulasi", passengerKind);
          markersRef.current.towing = createGoogleMarker(maps, map, originPos,
            carKind === "tow" ? "Towing simulasi" : "Mobil pelanggan simulasi", carKind);
          markersRef.current.rider.addListener("click", () => setFollowTarget("passenger"));
          markersRef.current.towing.addListener("click", () => setFollowTarget("tow"));
          const [pRoad,cRoad,aRoad] = await Promise.all([
            routeFromGoogle(originPos, passengerPos).catch(() => null),
            routeFromGoogle(originPos, carPos).catch(() => null),
            routeFromGoogle(demoApproach(originPos)[0], originPos).catch(() => null),
          ]);
          const passengerRoute = pRoad || guidePath(originPos, passengerPos);
          const towingRoute = cRoad || guidePath(originPos, carPos);
          const approachRoute = aRoad || demoApproach(originPos);
          if (cancelled) return;
          routesRef.current = {
            passenger: prepareRoute(passengerRoute),
            towing: prepareRoute(towingRoute),
            approach: prepareRoute(approachRoute),
          };
          setRouteMode(pRoad && cRoad ? "roads" : pRoad || cRoad ? "mixed" : "illustration");
          objects.push(googlePath(map, maps, passengerRoute, PASSENGER));
          objects.push(googlePath(map, maps, towingRoute, TOWING, true));
          fitPointsGoogle(map, maps, [originPos, passengerPos, carPos], hostRef.current);
        } else {
          const L = w.L!;
          map = L.map(hostRef.current, { zoomControl: false, attributionControl: true, preferCanvas: true });
          mapRef.current = map;
          if (selectionMode) {
            map.on("click", (event: any) => {
              setSelectedPoint({lat: event.latlng.lat, lng: event.latlng.lng});
            });
          }
          map.on("dragstart", () => setFollowTarget("off"));
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
          markersRef.current.towing = L.marker([origin.lat, origin.lng], { icon: icon(carKind), zIndexOffset: 125 });
          markersRef.current.rider.on("click", () => setFollowTarget("passenger"));
          markersRef.current.towing.on("click", () => setFollowTarget("tow"));
          let passengerRoute = guidePath(originPos, passengerPos);
          let towingRoute = guidePath(originPos, carPos);
          const approachRoute = demoApproach(originPos);
          // Respect the public OSRM demo server guidance, and never forward
          // the user's arbitrary GPS or map-selected coordinates.
          let passengerRoad = false, towingRoad = false;
          if (isPublicDemoPoint(originPos) && isPublicDemoPoint(passengerPos)) {
            try {
              passengerRoute = await routeFromOsrmDemo(originPos, passengerPos);
              passengerRoad = true;
            } catch { /* Explicitly fall back to illustrative geometry for this leg. */ }
          }
          if (isPublicDemoPoint(originPos) && isPublicDemoPoint(carPos)) {
            await new Promise(resolve => window.setTimeout(resolve, 1100));
            if (cancelled) return;
            try {
              towingRoute = await routeFromOsrmDemo(originPos, carPos);
              towingRoad = true;
            } catch { /* Failure of this leg doesn't discard the passenger route. */ }
          }
          if (cancelled) return;
          routesRef.current = {
            passenger: prepareRoute(passengerRoute),
            towing: prepareRoute(towingRoute),
            approach: prepareRoute(approachRoute),
          };
          const pLayer = L.polyline(passengerRoute.map(p => [p.lat, p.lng]), { color: PASSENGER, weight: 5, opacity: 0.85 }).addTo(map);
          const cLayer = L.polyline(towingRoute.map(p => [p.lat, p.lng]), {
             color: TOWING, weight: 6, opacity: 0.96, dashArray: "10 12", lineCap: "round",
           }).addTo(map);
          layersRef.current = [pLayer, cLayer];
          fitPointsLeaflet(map, L, [originPos, passengerPos, carPos], hostRef.current, false);
          L.control.zoom({ position: "bottomright" }).addTo(map);
          setRouteMode(passengerRoad && towingRoad ? "roads" : passengerRoad || towingRoad ? "mixed" : "illustration");
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
  }, [google, dark, origin.lat, origin.lng, passengerDestination.lat, passengerDestination.lng, carDestination.lat, carDestination.lng, passengerKind, carKind, selectionMode]);

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
    // Live frames own marker coordinates. Store progress is only a HUD readout.
    if (approaching) moveVehicle(markers.rider, route.approach, 0, passengerKind, engine);
    else if (tripRunning) {
      moveVehicle(markers.rider, route.passenger, userProgress, passengerKind, engine);
      moveVehicle(markers.towing, route.towing, carProgress, carKind, engine);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine, approaching, tripRunning, passengerKind, carKind]);

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
      const liveTrip = useTrobosStore.getState().currentTrip;
      // A skip can complete a vehicle immediately; never let a stale frame
      // jump it backwards or override a newly advanced trip phase.
      if (!liveTrip || liveTrip.status !== currentStatus) return;
      const elapsed = now - start;
      if (currentStatus === "TANDEM_APPROACHING") {
        const approachPercent = Math.min(100, elapsed / 36000 * 100);
        const marker = markersRef.current.rider;
        if (marker) {
          const pos = sampleRoute(routesRef.current.approach, approachPercent);
          if (engineRef.current) moveVehicle(marker, routesRef.current.approach, approachPercent, passengerKind, engineRef.current);
          if (followRef.current !== "off" && mapRef.current && now - lastPan > 950) {
            mapRef.current.panTo(engineRef.current === "google" ? pos : [pos.lat,pos.lng],
              engineRef.current === "leaflet" ? { animate:true, duration:0.8 } : undefined);
            lastPan = now;
          }
        }
        if (approachPercent === 100) { setArrived(); return; }
      } else if (currentStatus === "TRIP_STARTED" || currentStatus === "USER_ARRIVED" || currentStatus === "VEHICLE_ARRIVED") {
        const up = currentStatus === "USER_ARRIVED" ? 100 : Math.min(100, fromUser + elapsed / 110000 * 100);
        const cp = currentStatus === "VEHICLE_ARRIVED" ? 100 : Math.min(100, fromCar + elapsed / 140000 * 100);
        // Move both vehicles each animation frame; write readable HUD progress
        // at a lower rate to keep React renders and phone battery usage down.
        if (engineRef.current) {
          moveVehicle(markersRef.current.rider, routesRef.current.passenger, up, passengerKind, engineRef.current);
          moveVehicle(markersRef.current.towing, routesRef.current.towing, cp, carKind, engineRef.current);
        }
        if (followRef.current !== "off" && mapRef.current && now - lastPan > 950) {
          const route = followRef.current === "tow" ? routesRef.current.towing : routesRef.current.passenger;
          const location = sampleRoute(route, followRef.current === "tow" ? cp : up);
          mapRef.current.panTo(engineRef.current === "google" ? location : [location.lat, location.lng],
            engineRef.current === "leaflet" ? { animate:true, duration:0.8 } : undefined);
          lastPan = now;
        }
        if (now - last > 430) {
          updateLiveProgress(Math.round(up), Math.round(cp), Math.ceil((100 - up) / 100 * 2), Math.ceil((100 - cp) / 100 * 3));
          last = now;
        }
        if (up >= 100 && (currentStatus === "TRIP_STARTED" || currentStatus === "VEHICLE_ARRIVED")) {
          userArrivedAtDest(); return;
        }
        if (cp >= 100 && (currentStatus === "TRIP_STARTED" || currentStatus === "USER_ARRIVED")) {
          carArrivedAtDest(); return;
        }
      } else return;
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
    // Current progress is sampled only when the trip phase changes, not on every animation tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine, status, setArrived, updateLiveProgress, userArrivedAtDest, carArrivedAtDest, passengerKind, carKind]);

  // Focus immediately on the selected vehicle; subsequent frames keep it in view.
  useEffect(() => {
    if (!engine || !mapRef.current || followTarget === "off" || (!approaching && !tripRunning)) return;
    const route = approaching
      ? routesRef.current.approach
      : followTarget === "tow" ? routesRef.current.towing : routesRef.current.passenger;
    const progress = approaching ? 0 : followTarget === "tow" ? carProgress : userProgress;
    const pos = sampleRoute(route, progress);
    const map = mapRef.current;
    if (engine === "google") {
      map.setZoom(Math.max(14, map.getZoom() || 14));
      map.panTo(pos);
    } else {
      map.flyTo([pos.lat,pos.lng], Math.max(14,map.getZoom()), {animate:true,duration:.7});
    }
    // Do not refocus on every store-progress tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine, followTarget, approaching, tripRunning]);

  useEffect(() => {
    if (!engine || !mapRef.current) return;
    const map = mapRef.current;
    if (engine === "google") {
      fitPointsGoogle(map, (window as MapGlobal).google!.maps,
        [origin, passengerDestination, carDestination], hostRef.current);
    } else {
      const L = (window as MapGlobal).L!;
      fitPointsLeaflet(map, L, [origin, passengerDestination, carDestination], hostRef.current, true);
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
          {engine === "google" ? "Google Maps" : "OpenStreetMap"} · {routeMode === "roads" ? "Dua rute jalan" : routeMode === "mixed" ? "Sebagian rute ilustrasi" : "Rute ilustrasi"}
        </span>
        {message && <p role="status" className="mt-2 rounded-xl px-3 py-2 bg-white/95 dark:bg-[#192633]/95 text-xs text-slate-700 dark:text-slate-200">{message}</p>}
      </div>
      {selectionMode && <div className="tr-map-pick-overlay" role="region" aria-label="Pilih titik di peta">
        <strong>{selectionMode === "pickup" ? "Tentukan titik bantuan" : "Tentukan tujuan penumpang"}</strong>
        <p>Ketuk pada jalan atau area di peta, lalu konfirmasi lokasinya. Koordinat pilihan tidak dikirim ke layanan routing publik.</p>
        {selectedPoint && <>
          <small>{selectedPoint.lat.toFixed(5)}, {selectedPoint.lng.toFixed(5)}</small>
          <button type="button" onClick={() => {
            const point = {
              name: selectionMode === "pickup" ? "Titik bantuan pilihan" : "Tujuan pilihan",
              address: selectedPoint.lat.toFixed(5) + ", " + selectedPoint.lng.toFixed(5) + " (pilihan peta, demo)",
              lat:selectedPoint.lat, lng:selectedPoint.lng,
            };
            if (selectionMode === "pickup") setPickupLocation(point);
            else setSelectedDestination(point);
            setMessage("Titik berhasil dipilih. Rute GPS atau titik pilihan adalah ilustrasi jika penyedia routing tidak tersedia.");
            setSelectedPoint(null);
          }}>Gunakan titik ini <Navigation2 size={15}/></button>
        </>}
      </div>}
      <div className="absolute z-20 top-[92px] right-4 lg:top-5 flex flex-col gap-2">
        <button type="button" onClick={() => { setFollowTarget("off"); setRecenterId(x => x + 1); }}
          className="trobos-map-control" aria-label="Tampilkan seluruh rute" title="Tampilkan seluruh rute">
          <Layers3 size={19}/>
        </button>
        <button type="button" onClick={requestLocation} disabled={status !== "IDLE"}
          className="trobos-map-control disabled:opacity-40" aria-label="Gunakan lokasi perangkat" title="Gunakan GPS">
          <Crosshair size={19}/>
        </button>
        {(approaching || tripRunning) && <button type="button" onClick={() => setFollowTarget(followTarget === "off" ? "passenger" : followTarget === "passenger" ? "tow" : "off")}
          className={"trobos-map-control " + (followTarget !== "off" ? "text-[#C27651] ring-2 ring-[#C27651]/40" : "")}
          aria-pressed={followTarget !== "off"}
          aria-label={followTarget === "off" ? "Ikuti kendaraan penumpang" : followTarget === "passenger" ? (carKind === "tow" ? "Alihkan kamera ke towing" : "Alihkan kamera ke mobil pelanggan") : "Matikan kamera mengikuti kendaraan"}
          title={followTarget === "off" ? "Ikuti penumpang" : followTarget === "passenger" ? (carKind === "tow" ? "Ikuti towing" : "Ikuti mobil") : "Matikan ikuti kendaraan"}>
          <Navigation2 size={19}/>
        </button>}
      </div>
      {followTarget !== "off" && (approaching || tripRunning) && (
        <div className="absolute z-10 top-[235px] right-4 lg:top-[164px] pointer-events-none">
          <span className="rounded-xl bg-white/95 dark:bg-[#1A2B3B]/95 text-slate-800 dark:text-slate-100 border border-white/50 dark:border-white/10 px-3 py-2 text-[11px] font-semibold shadow-md">
            <Navigation2 size={12} className="inline mr-1"/>
            Mengikuti {followTarget === "tow" ? (carKind === "tow" ? "towing" : "mobil") : "penumpang"}
          </span>
        </div>
      )}
      <div className="absolute z-10 right-4 bottom-[min(22rem,45%)] lg:bottom-5 hidden sm:flex items-center gap-2 text-xs text-white/95">
        <span className="tr-route-legend-passenger">━ Penumpang → {passengerDestination.name}</span>
        <span className="tr-route-legend-car">┄ {carKind === "tow" ? "Derek ke bengkel" : "Mobil pelanggan"} → {carDestination.name}</span>
      </div>
      <div className="sr-only"><MapPin/><Route/>Tracking dan rute adalah simulasi. Tidak ada GPS driver sungguhan.</div>
    </div>
  );
};
