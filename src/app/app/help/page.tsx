"use client";

import React, { useState } from "react";
import { FAQS } from "@/lib/mockData";
import { useTrobosStore } from "@/store/useTrobosStore";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Phone,
  Mail,
  BookOpen,
} from "lucide-react";

export default function HelpCenterPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const setTutorialOpen = useTrobosStore((s) => s.setTutorialOpen);

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto w-full space-y-6 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <HelpCircle className="w-6 h-6 text-sky-600 dark:text-sky-400" />
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Pusat Bantuan & FAQ
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Pertanyaan umum seputar layanan evakuasi mobil & derek Trobos.
        </p>
      </div>

      {/* Tutorial Quick Access Banner */}
      <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-sky-950 dark:text-sky-200">
              Baru Pertama Kali Menggunakan Trobos?
            </h3>
            <p className="text-[11px] text-sky-700 dark:text-sky-300">
              Buka panduan interaktif 5 langkah untuk memahami konsep evakuasi Tandem.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setTutorialOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shrink-0 transition"
        >
          Lihat Panduan
        </button>
      </div>

      {/* Accordion FAQ */}
      <div className="space-y-2.5">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
              >
                <span>{faq.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Direct Contact Channels */}
      <div className="pt-2">
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
          Hubungi Layanan Pelanggan:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noreferrer"
            className="p-3 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2.5 text-slate-800 dark:text-slate-200 font-medium"
          >
            <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold">WhatsApp Care</div>
              <div className="text-[10px] text-slate-400">Respon cepat</div>
            </div>
          </a>

          <a
            href="tel:021500888"
            className="p-3 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2.5 text-slate-800 dark:text-slate-200 font-medium"
          >
            <Phone className="w-5 h-5 text-[#FF4D00] shrink-0" />
            <div>
              <div className="font-bold">Hotline 24 Jam</div>
              <div className="text-[10px] text-slate-400">021-500-888</div>
            </div>
          </a>

          <a
            href="mailto:support@trobos.id"
            className="p-3 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2.5 text-slate-800 dark:text-slate-200 font-medium"
          >
            <Mail className="w-5 h-5 text-sky-600 shrink-0" />
            <div>
              <div className="font-bold">Email Resmi</div>
              <div className="text-[10px] text-slate-400">support@trobos.id</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
