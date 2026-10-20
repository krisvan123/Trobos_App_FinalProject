"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Bike, CarFront, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useTrobosStore } from "@/store/useTrobosStore";
import { AuthFrame, AuthSubmit } from "@/components/public/BrandExperience";

const hasBackend = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const intro = [
  { name: "Penumpang tetap bergerak", info: "Simulasikan unit penumpang yang mengikuti rute di peta.", icon: Bike },
  { name: "Mobil tetap tertangani", info: "Pantau jalur mobil dan towing secara terpisah.", icon: CarFront },
  { name: "Semua dalam satu tampilan", info: "Rute, status, dan ringkasan perjalanan pada satu aplikasi.", icon: CheckCircle2 },
];

export default function RegisterPage() {
  const router = useRouter();
  const login = useTrobosStore(s => s.login);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", agree: false });
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);
  const [introStep, setIntroStep] = useState(0);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!form.agree) {
      setError("Konfirmasi mode demo diperlukan."); return;
    }
    if (hasBackend && (form.password !== form.confirm || form.password.length < 8)) {
      setError("Password minimal delapan karakter dan konfirmasi password harus sama."); return;
    }
    setBusy(true);
    try {
      if (hasBackend) {
        const response = await fetch("/api/auth", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "register", email: form.email.trim(), password: form.password, name: form.name.trim() }),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "Pendaftaran gagal.");
        if (data.pendingVerification) {
          setError("Periksa email untuk verifikasi, lalu masuk menggunakan akun tersebut.");
          return;
        }
      }
      login(hasBackend ? form.email.trim() : undefined, form.name.trim());
      setRegistered(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pendaftaran belum berhasil.");
    } finally { setBusy(false); }
  };

  if (registered) {
    const current = intro[introStep];
    const Icon = current.icon;
    return (
      <AuthFrame eyebrow="WELCOME TO TROBOS" title="Satu perjalanan, dua jalur."
        subtitle="Kenali pengalaman yang akan kamu temukan di aplikasi.">
        <div className="tr-onboarding">
          <div className="tr-onboarding-progress">
            {intro.map((_, i) => <span key={i} className={i <= introStep ? "is-active" : ""}/>)}
          </div>
          <div className="tr-onboarding-icon"><Icon size={35} strokeWidth={1.6}/></div>
          <span className="tr-kicker">TAHAP 0{introStep + 1} / 03</span>
          <h2>{current.name}</h2>
          <p>{current.info}</p>
          <button type="button" className="tr-public-primary" onClick={() =>
            introStep < intro.length - 1 ? setIntroStep(i => i + 1) : router.push("/app")
          }>
            {introStep === intro.length - 1 ? "Mulai pengalaman TROBOS" : "Lanjut ke tahap berikutnya"}
            <CheckCircle2 size={18}/>
          </button>
        </div>
      </AuthFrame>
    );
  }

  return (
    <AuthFrame eyebrow="GET STARTED" title={hasBackend ? "Mulai dengan TROBOS." : "Buat profil demo."}
      subtitle={hasBackend ? "Daftarkan akun untuk menyimpan permintaan demo." : "Ciptakan profil lokal untuk menjelajahi aplikasi tanpa membuat akun server."}>
      {!hasBackend && <div className="tr-mode-hint">
        <CheckCircle2 size={18}/>
        <span>Profil ini hanya disimpan di browser, bukan akun layanan transportasi sungguhan.</span>
      </div>}
      <form onSubmit={submit} className="tr-auth-form">
        {error && <p role="alert" className="tr-form-alert"><AlertCircle size={17}/>{error}</p>}
        <div className="tr-form-field">
          <label htmlFor="tr-reg-name">{hasBackend ? "Nama lengkap" : "Nama panggilan demo"}</label>
          <div className="tr-input-wrap"><UserRound size={19}/>
            <input id="tr-reg-name" type="text" autoComplete="name" required minLength={2} maxLength={100}
              placeholder="Nama kamu" value={form.name} onChange={e => setForm({...form, name:e.target.value})}/>
          </div>
        </div>
        {hasBackend && (<>\n        <div className="tr-form-field">
          <label htmlFor="tr-reg-email">Email</label>
          <div className="tr-input-wrap"><Mail size={19}/>
            <input id="tr-reg-email" type="email" autoComplete="email" required
              placeholder="nama@email.com" value={form.email} onChange={e => setForm({...form, email:e.target.value})}/>
          </div>
        </div>
        <div className="tr-form-field">
          <label htmlFor="tr-reg-password">Password</label>
          <div className="tr-input-wrap"><LockKeyhole size={19}/>
            <input id="tr-reg-password" type={visible ? "text" : "password"}
              autoComplete="new-password" minLength={8} maxLength={128} required
              placeholder="Minimal 8 karakter" value={form.password}
              onChange={e => setForm({...form,password:e.target.value})}/>
            <button type="button" onClick={() => setVisible(v => !v)}
              aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}>
              {visible ? <EyeOff size={19}/> : <Eye size={19}/>}
            </button>
          </div>
        </div>
        <div className="tr-form-field">
          <label htmlFor="tr-reg-confirm">Konfirmasi password</label>
          <div className="tr-input-wrap"><LockKeyhole size={19}/>
            <input id="tr-reg-confirm" type={visible ? "text" : "password"}
              autoComplete="new-password" minLength={8} maxLength={128} required
              placeholder="Ulangi password" value={form.confirm}
              onChange={e => setForm({...form,confirm:e.target.value})}/>
          </div>
        </div>
        </>)}\n        <label className="tr-form-consent">
          <input type="checkbox" checked={form.agree} onChange={e => setForm({...form,agree:e.target.checked})} required/>
          <span>Saya memahami TROBOS adalah prototipe akademik dan belum menyediakan driver, pembayaran, atau asuransi aktif.</span>
        </label>
        <AuthSubmit busy={busy}>{busy ? "Menyiapkan..." : hasBackend ? "Buat akun TROBOS" : "Buat profil demo"}</AuthSubmit>
      </form>
      <div className="tr-auth-switch">Sudah punya akun? <Link href="/login">Masuk ke TROBOS</Link></div>
      <p className="tr-auth-disclaimer">Profil demo tersimpan di browser; gunakan nama contoh pada perangkat bersama.</p>
    </AuthFrame>
  );
}
