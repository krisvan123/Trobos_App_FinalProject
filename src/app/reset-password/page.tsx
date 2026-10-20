"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.substring(1));
    if (fragment.get("type") === "recovery") setToken(fragment.get("access_token") || "");
    // Remove sensitive token from the visible URL, retaining it only in component state.
    if (window.location.hash) window.history.replaceState(null, "", window.location.pathname);
  }, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirm) { setError("Konfirmasi password tidak sama."); return; }
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/auth", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset", accessToken: token, password }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Tautan pemulihan tidak valid");
      setResult("Password berhasil diperbarui. Silakan masuk kembali.");
      setToken("");
      setPassword("");
      setConfirm("");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Pemulihan gagal."); }
    finally { setBusy(false); }
  };

  return (
    <main className="min-h-screen bg-slate-50 grid place-items-center p-4">
      <div className="w-full max-w-sm bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <h1 className="text-xl font-black text-slate-900">Buat Password Baru</h1>
        {result ? <p role="status" className="text-sm p-3 bg-emerald-50 text-emerald-800 rounded-xl">{result}</p> :
          !token ? <p className="text-sm text-slate-600">Tautan pemulihan tidak tersedia atau tidak valid. Minta tautan baru melalui halaman lupa password.</p> :
            <form className="space-y-4" onSubmit={save}>
              {error && <p role="alert" className="p-3 rounded-xl text-red-700 bg-red-50 text-sm">{error}</p>}
              <div><label htmlFor="new-password" className="block text-sm font-semibold mb-1">Password baru</label>
                <input id="new-password" type="password" autoComplete="new-password" required minLength={8} maxLength={128}
                  value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-xl p-3 border border-slate-300" /></div>
              <div><label htmlFor="confirm-password" className="block text-sm font-semibold mb-1">Ulangi password</label>
                <input id="confirm-password" type="password" autoComplete="new-password" required minLength={8} maxLength={128}
                  value={confirm} onChange={e => setConfirm(e.target.value)} className="w-full rounded-xl p-3 border border-slate-300" /></div>
              <button disabled={busy} className="w-full rounded-xl p-3 bg-[#FF4D00] text-white font-bold">{busy ? "Memproses..." : "Simpan Password"}</button>
            </form>}
        <Link href="/login" className="block text-center text-sm font-bold text-[#FF4D00]">Kembali ke Login</Link>
      </div>
    </main>
  );
}
