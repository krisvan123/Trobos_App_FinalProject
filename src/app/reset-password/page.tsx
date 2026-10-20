"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, LockKeyhole } from "lucide-react";
import { AuthFrame, AuthSubmit } from "@/components/public/BrandExperience";

export default function ResetPasswordPage() {
  const [token,setToken] = useState("");
  const [ready,setReady] = useState(false);
  const [password,setPassword] = useState("");
  const [confirm,setConfirm] = useState("");
  const [result,setResult] = useState("");
  const [error,setError] = useState("");
  const [busy,setBusy] = useState(false);

  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.substring(1));
    if (fragment.get("type") === "recovery") setToken(fragment.get("access_token") || "");
    if (window.location.hash) window.history.replaceState(null, "", window.location.pathname);
    setReady(true);
  }, []);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirm) { setError("Konfirmasi password belum sama."); return; }
    setError(""); setBusy(true);
    try {
      const response = await fetch("/api/auth", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset", accessToken: token, password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Tautan pemulihan tidak berlaku.");
      setResult("Password berhasil diperbarui. Silakan masuk kembali.");
      setToken(""); setPassword(""); setConfirm("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengubah password.");
    } finally { setBusy(false); }
  };

  return (
    <AuthFrame eyebrow="SECURE ACCOUNT" title="Atur password baru."
      subtitle="Buat password yang aman agar perjalanan dan arsip demo akunmu tetap terlindungi.">
      {!ready ? <p role="status" className="tr-mode-hint">Memeriksa tautan pemulihan...</p> :
        result ? (
          <div className="tr-auth-demo-panel" role="status">
            <div className="tr-demo-play"><CheckCircle2 size={27}/></div>
            <strong>Password berhasil diubah.</strong>
            <p>{result}</p>
            <Link href="/login" className="tr-public-primary">Masuk kembali <CheckCircle2 size={17}/></Link>
          </div>
        ) : !token ? (
          <div className="tr-auth-demo-panel">
            <div className="tr-demo-play"><LockKeyhole size={25}/></div>
            <strong>Tautan tidak tersedia.</strong>
            <p>Link pemulihan tidak ditemukan atau sudah kedaluwarsa. Minta tautan baru melalui halaman pemulihan.</p>
            <Link href="/forgot-password" className="tr-public-primary">Minta tautan baru <LockKeyhole size={17}/></Link>
          </div>
        ) : (
          <form onSubmit={submit} className="tr-auth-form">
            {error && <p role="alert" className="tr-form-alert">{error}</p>}
            <div className="tr-form-field"><label htmlFor="tr-new-pass">Password baru</label>
              <div className="tr-input-wrap"><LockKeyhole size={19}/>
                <input id="tr-new-pass" type="password" autoComplete="new-password" required minLength={8} maxLength={128}
                  value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimal delapan karakter"/>
              </div>
            </div>
            <div className="tr-form-field"><label htmlFor="tr-confirm-pass">Ulangi password</label>
              <div className="tr-input-wrap"><LockKeyhole size={19}/>
                <input id="tr-confirm-pass" type="password" autoComplete="new-password" required minLength={8} maxLength={128}
                  value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Ulangi password baru"/>
              </div>
            </div>
            <AuthSubmit busy={busy}>{busy ? "Menyimpan password..." : "Simpan password baru"}</AuthSubmit>
          </form>
        )}
    </AuthFrame>
  );
}
