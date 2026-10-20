import type { LocationPoint } from "@/types/trobos";
import { haversineKm } from "@/lib/pricing";

/** Prototype recommendations only: geographical distance from passenger
 * destination to a fixed, unverified list of example workshops.
 * Does NOT assert opening hours, capacity, road-network distance, or partnership. */
export function rankDemoWorkshops(
  passengerDestination: LocationPoint, workshops: readonly LocationPoint[]
): { workshop: LocationPoint; distanceKm: number }[] {
  return workshops
    .filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng) &&
      Math.abs(p.lat) <= 90 && Math.abs(p.lng) <= 180)
    .map(workshop => ({ workshop, distanceKm: haversineKm(passengerDestination, workshop) }))
    .sort((a,b) => a.distanceKm - b.distanceKm || a.workshop.name.localeCompare(b.workshop.name));
}
export function nearestDemoWorkshop(
  passengerDestination: LocationPoint, workshops: readonly LocationPoint[]
): LocationPoint | null {
  return rankDemoWorkshops(passengerDestination, workshops)[0]?.workshop ?? null;
}
