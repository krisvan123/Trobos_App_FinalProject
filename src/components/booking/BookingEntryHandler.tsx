"use client";

import { useEffect, useState } from "react";
import { useTrobosStore } from "@/store/useTrobosStore";
import type { ServiceType } from "@/types/trobos";
import { ArrowRight, RotateCcw, X } from "lucide-react";

/**
 * A public CTA selects the service without bypassing the booking form.
 * An existing trip must be explicitly discarded, never silently overwritten.
 */
export function BookingEntryHandler() {
  const [pending, setPending] = useState<ServiceType | null>(null);
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const requested = query.get("service");
    if (requested !== "TANDEM" && requested !== "MECHANIC") return;
    window.history.replaceState(window.history.state, "", window.location.pathname + window.location.hash);
    const apply = () => {
      const state = useTrobosStore.getState();
      if (state.currentTrip) {
        setPending(requested);
      } else {
        state.setServiceType(requested);
      }
    };
    if (useTrobosStore.persist.hasHydrated()) apply();
    else return useTrobosStore.persist.onFinishHydration(apply);
  }, []);

  if (!pending) return null;
  return <div className="tr-entry-backdrop" role="dialog" aria-modal="true"
    aria-labelledby="tr-entry-title" aria-describedby="tr-entry-description">
    <div className="tr-entry-dialog">
      <span className="tr-new-eyebrow"><RotateCcw size={16}/> PEMESANAN BARU · DEMO</span>
      <h2 id="tr-entry-title">Mulai pesanan baru?</h2>
      <p id="tr-entry-description">Ada simulasi sebelumnya di browser ini. Memulai pesanan baru akan menghentikan perjalanan saat ini, tetapi tidak menghapus riwayat demo.</p>
      <div className="tr-entry-actions">
        <button type="button" onClick={() => setPending(null)}><X size={17}/> Lanjutkan yang lama</button>
        <button type="button" onClick={() => {
          useTrobosStore.getState().resetToIdle();
          useTrobosStore.getState().setServiceType(pending);
          setPending(null);
        }}>Pesan {pending === "TANDEM" ? "Tandem" : "Derek & Rescue"} <ArrowRight size={17}/></button>
      </div>
    </div>
  </div>;
}
