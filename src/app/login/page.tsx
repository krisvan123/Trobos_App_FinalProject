"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Mail, Lock, ArrowRight, AlertCircle, PlayCircle } from "lucide-react";
import { useTrobosStore } from "@/store/useTrobosStore";

const hasBackend = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function LoginPage() {
  const router = useRouter();
  const login = useTrobosStore((s) => s.login);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const startDemo = () => { login(); router.push("/app"); };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!hasBackend) { startDemo(); return; }
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email: identifier, password }),
      });
      const body = await response.json();
      if (!response.ok || !body.authenticated) throw new Error(body.error || "Tidak dapat masuk.");
      login(identifier);
      router.push("/app");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Terjadi kesalahan saat login.");
    } finally { setIsLoading(false); }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-5">
            <span className="w-11 h-11 bg-[#FF4D00] rounded-2xl text-white inline-flex items-center justify-center">
              <Zap className="w-6 h-6 fill-white" />
            </span>
            <span className="text-2xl font-black tracking-tight">TROBOS</span>
          </Link>
          <h1 className="text-2xl font-black">Selamat Datang Kembali</h1>
          <p className="text-sm text-slate-500 mt-2">Masuk untuk melihat perjalanan dan kendaraan Anda.</p>
        </div>
        {!hasBackend && <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
          <strong>Mode Prototipe.</strong> Autentikasi server belum dikonfigurasi. Tombol demo tidak membuat akun atau mengirim permintaan bantuan sungguhan.
        </div>}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          {error && <p role="alert" className="rounded-xl bg-red-50 text-red-700 p-3 text-sm flex gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="identifier" className="block text-sm font-semibold mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute top-3.5 left-3.5 w-4 h-4 text-slate-400" />
                <input id="identifier" type="email" autoComplete="email" value={identifier} onChange={(event) => setIdentifier(event.target.value)} required
                  placeholder="nama@email.com" className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label htmlFor="password" className="text-sm font-semibold">Password</label>
                {hasBackend && <Link href="/forgot-password" className="text-xs font-semibold text-[#FF4D00]">Lupa password?</Link>}
              </div>
              <div className="relative">
                <Lock className="absolute top-3.5 left-3.5 w-4 h-4 text-slate-400" />
                <input id="password" type="password" autoComplete="current-password" minLength={hasBackend ? 8 : undefined}
                  required value={password} onChange={(event) => setPassword(event.target.value)}
                  placeholder="Masukkan password" className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-[#FF4D00] hover:bg-[#E64400] disabled:opacity-60 text-white rounded-xl py-3.5 flex justify-center items-center gap-2 font-bold">
              {isLoading ? "Memverifikasi..." : hasBackend ? "Masuk" : "Lanjut ke Demo"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          {!hasBackend && <button onClick={startDemo} className="w-full rounded-xl py-3 border border-slate-300 bg-slate-50 hover:bg-slate-100 flex items-center justify-center gap-2 text-sm font-bold">
            <PlayCircle className="w-4 h-4 text-[#FF4D00]" /> Coba tanpa memasukkan data
          </button>}
          <p className="text-center text-sm text-slate-500">
            Belum punya akun? <Link href="/register" className="font-bold text-[#FF4D00]">Daftar</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
