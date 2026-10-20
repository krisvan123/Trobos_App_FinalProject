"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Eye, EyeOff, LockKeyhole, Mail, Play, ShieldCheck } from "lucide-react";
import { useTrobosStore } from "@/store/useTrobosStore";
import { AuthFrame, AuthSubmit } from "@/components/public/BrandExperience";

const hasBackend = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function LoginPage() {
  const router = useRouter();
  const login = useTrobosStore(s => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const startDemo = () => { login(); router.push("/app"); };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!hasBackend) { startDemo(); return; }
    setBusy(true);
    try {
      const response = await fetch("/api/auth", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email: email.trim(), password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.authenticated) throw new Error(data.error || "Email atau password tidak sesuai.");
      login(email.trim());
      router.replace("/app");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tidak dapat masuk. Silakan coba lagi.");
    } finally { setBusy(false); }
  };

  return (
    <AuthFrame eyebrow="WELCOME BACK" title="Kembali ke perjalananmu."
      subtitle="Satu aplikasi untuk mengelola perjalanan penumpang dan kendaraan.">
      {!hasBackend && (
        <div className="tr-mode-hint">
          <ShieldCheck size={18}/>
          <span>Mode demo aktif. Tidak perlu email, password, atau akun sungguhan untuk mencoba TROBOS.</span>
        </div>
      )}
      {hasBackend ? (
        <form onSubmit={submit} className="tr-auth-form">
          {error && <p role="alert" className="tr-form-alert"><AlertCircle size={17}/>{error}</p>}
          <div className="tr-form-field">
            <label htmlFor="tr-login-email">Alamat email</label>
            <div className="tr-input-wrap">
              <Mail size={19}/>
              <input id="tr-login-email" type="email" autoComplete="email" required
                placeholder="nama@email.com" value={email} onChange={e => setEmail(e.target.value)}/>
            </div>
          </div>
          <div className="tr-form-field">
            <div className="tr-form-label-row">
              <label htmlFor="tr-login-password">Password</label>
              <Link href="/forgot-password">Lupa password?</Link>
            </div>
            <div className="tr-input-wrap">
              <LockKeyhole size={19}/>
              <input id="tr-login-password" type={visible ? "text" : "password"}
                autoComplete="current-password" required minLength={8}
                placeholder="Masukkan password" value={password}
                onChange={e => setPassword(e.target.value)}/>
              <button type="button" onClick={() => setVisible(v => !v)}
                aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}>
                {visible ? <EyeOff size={19}/> : <Eye size={19}/>}
              </button>
            </div>
          </div>
          <AuthSubmit busy={busy}>{busy ? "Memverifikasi akun..." : "Masuk ke TROBOS"}</AuthSubmit>
        </form>
      ) : (
        <div className="tr-auth-demo-panel">
          <div className="tr-demo-play"><Play size={23} fill="currentColor"/></div>
          <strong>Jelajahi pengalaman TROBOS</strong>
          <p>Buka peta, coba pencarian armada, dan lihat simulasi kendaraan yang bergerak menuju tujuan.</p>
          <button type="button" onClick={startDemo} className="tr-public-primary">
            <span>Masuk ke demo interaktif</span><Play size={18}/>
          </button>
        </div>
      )}
      <div className="tr-auth-switch">
        {hasBackend ? "Belum punya akun?" : "Ingin membuat profil demo?"}
        <Link href="/register">Daftar sekarang</Link>
      </div>
      <p className="tr-auth-disclaimer">TROBOS masih prototipe akademik. Tidak menyediakan dispatch atau layanan darurat nyata.</p>
    </AuthFrame>
  );
}
