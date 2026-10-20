import { NextRequest, NextResponse } from "next/server";
import { applyRenewal, backendConfigured, identifyRequest, sameOrigin, supabaseRequest } from "@/lib/server/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function validLocation(location: unknown): boolean {
  if (!location || typeof location !== "object") return false;
  const point = location as { lat?: unknown; lng?: unknown; name?: unknown };
  return typeof point.name === "string" && point.name.length <= 200 &&
    typeof point.lat === "number" && Math.abs(point.lat) <= 90 &&
    typeof point.lng === "number" && Math.abs(point.lng) <= 180;
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
    const body = await request.json().catch(() => null);
    const trip = body?.trip;
    if (!trip || typeof trip !== "object" ||
      typeof trip.id !== "string" || !/^TRB-[A-Za-z0-9-]{3,30}$/.test(trip.id) ||
      !["TANDEM","MECHANIC"].includes(trip.serviceType) ||
      !validLocation(trip.origin) || !validLocation(trip.destination) || !validLocation(trip.carDestination) ||
      !Number.isInteger(trip.passengerCount) || trip.passengerCount < 1 || trip.passengerCount > 8) {
      return NextResponse.json({ error: "Data perjalanan tidak valid" }, { status: 400 });
    }
    // The submitted object is a demo record, not a dispatch or payment instruction.
    const record = {
      user_id: identity.user.id,
      trip_id: trip.id,
      trip_data: {
        ...trip,
        status: "DEMO_RECORDED",
        otpCode: undefined,
        damagePhotoUrl: undefined,
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
