import type { TripStatus } from "../types/trobos";

/** Single source of truth for both natural and skipped arrivals. */
export function resolveDemoArrival(
  status: TripStatus,
  passengerProgress: number,
  vehicleProgress: number,
  arrived: "passenger" | "vehicle",
): { status: TripStatus; passengerProgress: number; vehicleProgress: number } | null {
  if (status !== "TRIP_STARTED" && status !== "USER_ARRIVED" && status !== "VEHICLE_ARRIVED") return null;
  const clamp=(n:number)=>Number.isFinite(n)?Math.max(0,Math.min(100,n)):0;
  const passenger = arrived === "passenger" || status === "USER_ARRIVED" ? 100 : clamp(passengerProgress);
  const vehicle = arrived === "vehicle" || status === "VEHICLE_ARRIVED" ? 100 : clamp(vehicleProgress);
  return {
    passengerProgress: passenger,
    vehicleProgress: vehicle,
    status: passenger === 100 && vehicle === 100 ? "COMPLETED"
      : passenger === 100 ? "USER_ARRIVED"
      : vehicle === 100 ? "VEHICLE_ARRIVED" : "TRIP_STARTED",
  };
}
