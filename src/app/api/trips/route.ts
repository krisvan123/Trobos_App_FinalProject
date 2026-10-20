import { NextRequest, NextResponse } from "next/server";
import { applyRenewal, backendConfigured, identifyRequest, sameOrigin, supabaseRequest } from "@/lib/server/supabase";
import { calculateDemoFare } from "@/lib/pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function validLocation(location: unknown): boolean {
  if (!location || typeof location !== "object") return false;
  const point = location as { lat?: unknown; lng?: unknown; name?: unknown };
  return typeof point.name === "string" && point.name.trim().length > 0 && point.name.length <= 120 &&
    typeof point.lat === "number" && Number.isFinite(point.lat) && Math.abs(point.lat) <= 90 &&
    typeof point.lng === "number" && Number.isFinite(point.lng) && Math.abs(point.lng) <= 180;
}

export async function GET(request: NextRequest) {
  if (!backendConfigured) return NextResponse.json({ mode: "demo", trips: [] });
  try {
    const identity = await identifyRequest(request);
    if (!identity) return NextResponse.json({ error: "Login diperlukan" }, { status: 401 });
    const query = new URLSearchParams({ select: "trip_id,trip_data,created_at", order: "created_at.desc", limit: "100" });
    const upstream = await supabaseRequest("/rest/v1/trobos_trips?" + query, {}, identity.accessToken);
    if (!upstream.ok) return NextResponse.json({ error: "Gagal memuat riwayat" }, { status: 502 });
    return applyRenewal(NextResponse.json({ mode: "server", trips: await upstream.json() }), identity);
  } catch {
    return NextResponse.json({ error: "Database tidak tersedia" }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  if (!backendConfigured) return NextResponse.json({ error: "Backend belum dikonfigurasi" }, { status: 503 });
  try {
    const identity = await identifyRequest(request);
    if (!identity) return NextResponse.json({ error: "Login diperlukan" }, { status: 401 });
    const raw = await request.text();
    // Prevent arbitrarily large JSON objects from being written to the demo archive.
    if (raw.length > 32768) return NextResponse.json({ error: "Permintaan terlalu besar" }, { status: 413 });
    const body = (() => { try { return JSON.parse(raw); } catch { return null; } })();
    const trip = body?.trip;
    if (!trip || typeof trip !== "object" ||
      typeof trip.id !== "string" || !/^TRB-[A-Za-z0-9-]{3,30}$/.test(trip.id) ||
      !["TANDEM","MECHANIC"].includes(trip.serviceType) ||
      !validLocation(trip.origin) || !validLocation(trip.destination) || !validLocation(trip.carDestination) ||
      !Number.isInteger(trip.passengerCount) || trip.passengerCount < 1 || trip.passengerCount > 8) {
      return NextResponse.json({ error: "Data perjalanan tidak valid" }, { status: 400 });
    }
    // Server-calculated estimate. Only retain the fields needed for a demo archive,
    // excluding mock driver contact details, photo blobs, OTP and untrusted UI state.
    const point = (location: { name: string; lat: number; lng: number }) => ({
      name: location.name.trim(),
      lat: location.lat,
      lng: location.lng,
    });
    const origin = point(trip.origin);
    const destination = point(trip.destination);
    const carDestination = point(trip.carDestination);
    const fare = calculateDemoFare({
      serviceType: trip.serviceType,
      origin, passengerDestination: destination, carDestination,
      passengerCount: trip.passengerCount,
    });
    const plate = typeof trip.vehicle?.plate === "string"
      ? trip.vehicle.plate.trim().slice(0, 16) : undefined;
    const record = {
      user_id: identity.user.id,
      trip_id: trip.id,
      trip_data: {
        id: trip.id,
        serviceType: trip.serviceType,
        status: "DEMO_RECORDED",
        passengerCount: trip.passengerCount,
        vehiclePlate: plate,
        origin, destination, carDestination,
        fare,
        createdAt: new Date().toISOString(),
      },
    };
    const upstream = await supabaseRequest("/rest/v1/trobos_trips?on_conflict=user_id,trip_id", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(record),
    }, identity.accessToken);
    if (!upstream.ok) return NextResponse.json({ error: "Gagal menyimpan perjalanan" }, { status: 502 });
    return applyRenewal(NextResponse.json({ saved: true, tripId: trip.id, mode: "demo_record" }, { status: 201 }), identity);
  } catch {
    return NextResponse.json({ error: "Database tidak tersedia" }, { status: 502 });
  }
}
