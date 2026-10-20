export interface PricingPoint { lat: number; lng: number }
export interface DemoFareInput {
  serviceType: "TANDEM" | "MECHANIC";
  origin: PricingPoint;
  passengerDestination: PricingPoint;
  carDestination: PricingPoint;
  passengerCount: number;
}
// Illustrative straight-line estimate, NOT a real road distance, ETA, or price quote.
export function haversineKm(a: PricingPoint, b: PricingPoint): number {
  const rad = (d: number) => d * Math.PI / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat/2)**2 + Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLng/2)**2;
  return 6371 * 2 * Math.atan2(Math.sqrt(Math.max(0,h)), Math.sqrt(Math.max(0,1-h)));
}
export function calculateDemoFare(input: DemoFareInput) {
  if (!Number.isInteger(input.passengerCount) || input.passengerCount < 1 || input.passengerCount > 8)
    throw new RangeError("passengerCount must be 1–8");
  const passengerKm = Math.max(1.5, haversineKm(input.origin,input.passengerDestination)*1.35);
  const carKm = Math.max(1.5, haversineKm(input.origin,input.carDestination)*1.35);
  const mechanic = input.serviceType === "MECHANIC";
  const distanceKm = Math.round((mechanic ? Math.max(passengerKm,carKm) : passengerKm)*10)/10;
  const baseFare = mechanic ? 45000 : 35000;
  const emergencyService = (mechanic ? 45000 : 30000) + (input.passengerCount > 4 ? 35000 : input.passengerCount > 2 ? 15000 : 0);
  const towingFare = mechanic ? 110000 : 0;
  const distanceFare = Math.round(distanceKm*(mechanic ? 3000 : 2200)/1000)*1000;
  const surgeFare = mechanic ? 0 : 10000;
  return {
    baseFare, emergencyService, towingFare, distanceFare, surgeFare,
    totalFare: baseFare + emergencyService + towingFare + distanceFare + surgeFare,
    distanceKm,
    estimatedPassengerMinutes: Math.round(8 + passengerKm/22*60),
    estimatedTowingMinutes: Math.round(12 + carKm/18*60),
  };
}
