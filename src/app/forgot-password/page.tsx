"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const hasBackend = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!hasBackend) { setError("Pemulihan akun tidak tersedia dalam mode demo tanpa backend."); return; }
    setLoading(true);
    try {
      const response = await fetch("/api/auth", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "recover", email }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Permintaan gagal.");
      setSent(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Pemulihan gagal.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1.5">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-[#FF4D00] flex items-center justify-center shadow-sm">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-black text-slate-900">TROBOS</span>
          </Link>
          <h1 className="text-xl font-black text-slate-900">Pemulihan Password</h1>
          <p className="text-xs text-slate-500">
            Masukkan email Anda untuk menerima instruksi reset akun darurat.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          {sent ? (
            <div className="text-center space-y-3 py-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Periksa Email Anda</h3>
              <p className="text-xs text-slate-500">
                Jika email <strong>{email}</strong> terdaftar, petunjuk pemulihan akan dikirim oleh penyedia autentikasi.
              </p>
              <button
                onClick={() => router.push("/login")}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs mt-2"
              >
                Kembali ke Halaman Masuk
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p role="alert" className="text-xs text-red-700 bg-red-50 rounded-xl p-3">{error}</p>}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Akun
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#FF4D00] hover:bg-[#E64400] text-white font-bold text-xs shadow-sm transition"
              >
                {loading ? "Mengirim..." : "Kirim Tautan Pemulihan"}
              </button>

              <div className="pt-1 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali ke Login</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
