"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useTrobosStore } from "@/store/useTrobosStore";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const logout = useTrobosStore((s) => s.logout);

  if (!isOpen) return null;

  const handleConfirmLogout = async () => {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "logout" }) }).catch(() => null);
    }
    logout();
    onClose();
    router.push("/login");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-sm w-full shadow-modal text-left animate-in fade-in zoom-in-95 duration-150">
        <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mb-3.5 border border-red-200 dark:border-red-900">
          <LogOut className="w-5 h-5" />
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Keluar dari akun?
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
          Sesi aktif Anda akan diakhiri. Anda perlu masuk kembali untuk mengakses pesanan dan data kendaraan Anda.
        </p>

        <div className="mt-5 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirmLogout}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition shadow-sm"
          >
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
};
