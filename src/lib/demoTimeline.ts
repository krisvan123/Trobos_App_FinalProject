import type { ActiveTrip } from "../types/trobos";

/** Demo-only durations, in milliseconds. They are not real-world ETAs. */
export const DEMO_DURATIONS = {
  search: 10000,
  approach: 36000,
  passenger: 110000,
  vehicle: 140000,
} as const;

type TimelineResult = { trip: ActiveTrip; changed: boolean };
const percent = (value: number): number =>
  Number.isFinite(value) ? Math.max(0, Math.min(100, Math.floor(value))) : 0;

/**
 * Advance a local, persisted demo using wall-clock time. No timers or browser
 * APIs here, so the same function works after refresh or route navigation.
 * Manual skips win over the clock: progress never moves backwards.
 */
export function advanceDemoTimeline(trip: ActiveTrip, now: number): TimelineResult {
  if (!Number.isFinite(now)) return { trip, changed: false };
  if (trip.status === "SEARCHING_TANDEM") {
    const started = trip.searchStartedAt ?? now;
    if (now - started >= DEMO_DURATIONS.search)
      return { trip: { ...trip, searchStartedAt: started, status: "TANDEM_ASSIGNED" }, changed: true };
    if (trip.searchStartedAt == null)
      return { trip: { ...trip, searchStartedAt: started }, changed: true };
  }
  if (trip.status === "TANDEM_APPROACHING") {
    const started = trip.approachStartedAt ?? now;
    if (now - started >= DEMO_DURATIONS.approach)
      return { trip: { ...trip, approachStartedAt: started, status: "TANDEM_ARRIVED" }, changed: true };
    if (trip.approachStartedAt == null)
      return { trip: { ...trip, approachStartedAt: started }, changed: true };
  }
  if (trip.status !== "TRIP_STARTED" && trip.status !== "USER_ARRIVED" &&
      trip.status !== "VEHICLE_ARRIVED") return { trip, changed: false };
  const started = trip.travelStartedAt ?? now;
  const elapsed = Math.max(0, now - started);
  const passengerProgress = Math.max(percent(trip.userProgressPercent),
    percent(elapsed / DEMO_DURATIONS.passenger * 100));
  const carProgress = Math.max(percent(trip.carProgressPercent),
    percent(elapsed / DEMO_DURATIONS.vehicle * 100));
  const status = passengerProgress >= 100 && carProgress >= 100 ? "COMPLETED"
    : passengerProgress >= 100 ? "USER_ARRIVED"
    : carProgress >= 100 ? "VEHICLE_ARRIVED" : "TRIP_STARTED";
  const changed = started !== trip.travelStartedAt ||
    passengerProgress !== trip.userProgressPercent || carProgress !== trip.carProgressPercent ||
    status !== trip.status;
  if (!changed) return { trip, changed: false };
  return {
    changed: true,
    trip: {
      ...trip,
      travelStartedAt: started,
      userProgressPercent: passengerProgress,
      carProgressPercent: carProgress,
      userEtaMinutes: passengerProgress >= 100 ? 0 : Math.max(1,Math.ceil((DEMO_DURATIONS.passenger - elapsed)/60000)),
      carEtaMinutes: carProgress >= 100 ? 0 : Math.max(1,Math.ceil((DEMO_DURATIONS.vehicle - elapsed)/60000)),
      status,
    },
  };
}

/** Visual-only fractional progress for smooth map frames (no React updates). */
export function demoVisualProgress(progress: number, startedAt: number | undefined,
  durationMs: number, now: number): number {
  const persisted = Number.isFinite(progress) ? Math.max(0,Math.min(100,progress)) : 0;
  if (startedAt === undefined || !Number.isFinite(startedAt) || !Number.isFinite(now)) return persisted;
  return Math.max(persisted,Math.min(100,Math.max(0,(now - startedAt) / durationMs * 100)));
}
