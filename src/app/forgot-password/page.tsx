"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import { AuthFrame, AuthSubmit } from "@/components/public/BrandExperience";

const hasBackend = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError("");
    if (!hasBackend) return;
    setBusy(true);
    try {
      const response = await fetch("/api/auth", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "recover", email: email.trim() }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Tidak dapat mengirim instruksi pemulihan.");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tidak bisa mengirim email.");
    } finally { setBusy(false); }
  };

  return (
    <AuthFrame eyebrow="ACCOUNT RECOVERY" title="Dapatkan kembali akses."
      subtitle="Pemulihan akun TROBOS menggunakan email yang terdaftar pada penyedia autentikasi.">
      {sent ? <div className="tr-auth-demo-panel" role="status">
        <div className="tr-demo-play"><CheckCircle2 size={27}/></div>
        <strong>Periksa kotak masukmu.</strong>
        <p>Jika <b>{email}</b> terdaftar, penyedia autentikasi akan mengirim tautan untuk membuat password baru.</p>
        <Link href="/login" className="tr-public-primary">Kembali ke login <ArrowLeft size={17}/></Link>
      </div> : hasBackend ? (
        <form className="tr-auth-form" onSubmit={submit}>
          {error && <p role="alert" className="tr-form-alert">{error}</p>}
          <div className="tr-form-field">
            <label htmlFor="tr-forgot-email">Email akun</label>
            <div className="tr-input-wrap"><Mail size={19}/>
              <input id="tr-forgot-email" type="email" autoComplete="email" required
                placeholder="nama@email.com" value={email} onChange={e => setEmail(e.target.value)}/>
            </div>
          </div>
          <AuthSubmit busy={busy}>{busy ? "Mengirim instruksi..." : "Kirim tautan pemulihan"}</AuthSubmit>
          <Link href="/login" className="tr-secondary-link"><ArrowLeft size={17}/> Kembali ke login</Link>
        </form>
      ) : (
        <div className="tr-auth-demo-panel">
          <div className="tr-demo-play"><ShieldCheck size={25}/></div>
          <strong>Mode demo tidak memerlukan password.</strong>
          <p>TROBOS belum mengaktifkan penyedia autentikasi di lingkungan ini. Kamu bisa langsung menjelajahi aplikasi.</p>
          <Link href="/login" className="tr-public-primary">Masuk ke demo <ArrowLeft size={17}/></Link>
        </div>
      )}
      <p className="tr-auth-disclaimer">Jangan gunakan tautan pemulihan dari sumber yang tidak kamu kenal.</p>
    </AuthFrame>
  );
}
