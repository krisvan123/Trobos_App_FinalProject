import type { LocationPoint } from "@/types/trobos";
/** Isolated for Node's strip-types test runner (no module path alias support). */
function geographicDistanceKm(a: {lat:number;lng:number}, b: {lat:number;lng:number}): number {
  const r = Math.PI / 180;
  const dLat=(b.lat-a.lat)*r, dLng=(b.lng-a.lng)*r;
  const h=Math.sin(dLat/2)**2 + Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(dLng/2)**2;
  return 6371*2*Math.atan2(Math.sqrt(Math.max(0,h)),Math.sqrt(Math.max(0,1-h)));
}

/** Prototype recommendations only: geographical distance from passenger
 * destination to a fixed, unverified list of example workshops.
 * Does NOT assert opening hours, capacity, road-network distance, or partnership. */
export function rankDemoWorkshops(
  passengerDestination: LocationPoint, workshops: readonly LocationPoint[]
): { workshop: LocationPoint; distanceKm: number }[] {
  return workshops
    .filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng) &&
      Math.abs(p.lat) <= 90 && Math.abs(p.lng) <= 180)
    .map(workshop => ({ workshop, distanceKm: geographicDistanceKm(passengerDestination, workshop) }))
    .sort((a,b) => a.distanceKm - b.distanceKm || a.workshop.name.localeCompare(b.workshop.name));
}
export function nearestDemoWorkshop(
  passengerDestination: LocationPoint, workshops: readonly LocationPoint[]
): LocationPoint | null {
  return rankDemoWorkshops(passengerDestination, workshops)[0]?.workshop ?? null;
}
