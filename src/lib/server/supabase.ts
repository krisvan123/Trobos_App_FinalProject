import "server-only";
import type { NextRequest, NextResponse } from "next/server";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const backendConfigured = Boolean(url && anon);

export interface AuthIdentity {
  user: { id: string; email?: string; user_metadata?: { full_name?: string } };
  accessToken: string;
  renewed?: { access_token: string; refresh_token: string; expires_in: number };
}

export async function supabaseRequest(
  path: string,
  options: RequestInit = {},
  accessToken?: string
): Promise<Response> {
  if (!backendConfigured) throw new Error("Supabase is not configured");
  const headers = new Headers(options.headers);
  headers.set("apikey", anon!);
  headers.set("Authorization", "Bearer " + (accessToken || anon));
  headers.set("Content-Type", "application/json");
  return fetch(url + path, { ...options, headers, cache: "no-store" });
}

export function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  return !origin || origin === request.nextUrl.origin;
}

export function writeAuthCookies(
  response: NextResponse,
  session: { access_token: string; refresh_token: string; expires_in?: number }
) {
  const common = {
    httpOnly: true, sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production", path: "/",
  };
  response.cookies.set("trobos_access", session.access_token, {
    ...common, maxAge: Math.max(60, session.expires_in || 3600),
  });
  response.cookies.set("trobos_refresh", session.refresh_token, {
    ...common, maxAge: 60 * 60 * 24 * 30,
  });
}

export async function identifyRequest(request: NextRequest): Promise<AuthIdentity | null> {
  if (!backendConfigured) return null;
  let accessToken = request.cookies.get("trobos_access")?.value;
  let renewed: AuthIdentity["renewed"];
  if (!accessToken) return null;
  let response = await supabaseRequest("/auth/v1/user", { method: "GET" }, accessToken);
  if (!response.ok) {
    const refresh = request.cookies.get("trobos_refresh")?.value;
    if (!refresh) return null;
    const refreshResult = await supabaseRequest(
      "/auth/v1/token?grant_type=refresh_token",
      { method: "POST", body: JSON.stringify({ refresh_token: refresh }) }
    );
    if (!refreshResult.ok) return null;
    const data = await refreshResult.json();
    if (!data.access_token || !data.refresh_token) return null;
    renewed = { access_token: data.access_token, refresh_token: data.refresh_token, expires_in: data.expires_in || 3600 };
    accessToken = renewed.access_token;
    response = await supabaseRequest("/auth/v1/user", { method: "GET" }, accessToken);
  }
  if (!response.ok) return null;
  const user = await response.json();
  if (typeof user.id !== "string") return null;
  return { user, accessToken: accessToken!, renewed };
}

export function applyRenewal(response: NextResponse, identity: AuthIdentity) {
  if (identity.renewed) writeAuthCookies(response, identity.renewed);
  return response;
}
