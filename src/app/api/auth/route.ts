import { NextRequest, NextResponse } from "next/server";
import { applyRenewal, backendConfigured, identifyRequest, sameOrigin, supabaseRequest, writeAuthCookies } from "@/lib/server/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const unavailable = () => NextResponse.json({ error: "Backend belum dikonfigurasi. Gunakan demo tanpa akun nyata." }, { status: 503 });

export async function GET(request: NextRequest) {
  if (!backendConfigured) return NextResponse.json({ mode: "demo", authenticated: false });
  try {
    const identity = await identifyRequest(request);
    if (!identity) return NextResponse.json({ mode: "server", authenticated: false }, { status: 401 });
    const result = NextResponse.json({
      mode: "server", authenticated: true,
      user: { email: identity.user.email, name: identity.user.user_metadata?.full_name || "Pengguna TROBOS" },
    });
    return applyRenewal(result, identity);
  } catch {
    return NextResponse.json({ error: "Layanan autentikasi tidak tersedia" }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  if (!backendConfigured) return unavailable();
  const input = await request.json().catch(() => null);
  if (!input || typeof input.action !== "string") return NextResponse.json({ error: "Permintaan tidak valid" }, { status: 400 });
  if (input.action === "logout") {
    const token = request.cookies.get("trobos_access")?.value;
    if (token) await supabaseRequest("/auth/v1/logout", { method: "POST" }, token).catch(() => {});
    const response = NextResponse.json({ ok: true });
    response.cookies.delete("trobos_access");
    response.cookies.delete("trobos_refresh");
    return response;
  }
  if (!["login","register"].includes(input.action) ||
      typeof input.email !== "string" || !/^\S+@\S+\.\S+$/.test(input.email) ||
      typeof input.password !== "string" || input.password.length < 8 || input.password.length > 128) {
    return NextResponse.json({ error: "Email atau password tidak valid (minimal 8 karakter)." }, { status: 400 });
  }
  const isRegister = input.action === "register";
  const name = typeof input.name === "string" ? input.name.trim().slice(0, 100) : "";
  if (isRegister && !name) return NextResponse.json({ error: "Nama lengkap wajib diisi" }, { status: 400 });
  try {
    const upstream = await supabaseRequest(isRegister ? "/auth/v1/signup" : "/auth/v1/token?grant_type=password", {
      method: "POST",
      body: JSON.stringify({
        email: input.email, password: input.password,
        ...(isRegister ? { data: { full_name: name } } : {}),
      }),
    });
    const body = await upstream.json().catch(() => ({}));
    if (!upstream.ok) return NextResponse.json({ error: body.msg || body.error_description || body.message || "Autentikasi gagal" }, { status: 401 });
    const authenticated = Boolean(body.access_token && body.refresh_token);
    const response = NextResponse.json({ authenticated, email: input.email, pendingVerification: !authenticated });
    if (authenticated) writeAuthCookies(response, body);
    return response;
  } catch {
    return NextResponse.json({ error: "Gagal terhubung ke penyedia autentikasi" }, { status: 502 });
  }
}
