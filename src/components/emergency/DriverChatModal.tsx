"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTrobosStore } from "@/store/useTrobosStore";
import {
  MessageSquare,
  Send,
  X,
  Phone,
  Bike,
  Car,
  ShieldCheck,
  CheckCheck,
  PhoneCall,
  PhoneOff,
} from "lucide-react";

interface DriverChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DriverChatModal: React.FC<DriverChatModalProps> = ({
  isOpen,
  onClose,
}) => {
  const currentTrip = useTrobosStore((s) => s.currentTrip);
  const chatMessages = useTrobosStore((s) => s.chatMessages);
  const sendChatMessage = useTrobosStore((s) => s.sendChatMessage);

  const [inputVal, setInputVal] = useState("");
  const [isCalling, setIsCalling] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const rider = currentTrip?.tandem?.rider || {
    name: "Rizky Pratama",
    phone: "0813-8822-9011",
    bikeModel: "Yamaha NMAX",
  };
  const driver = currentTrip?.tandem?.driver || {
    name: "Budi Santoso",
    phone: "0812-7711-4455",
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCalling) {
      timer = setInterval(() => setCallDuration((c) => c + 1), 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [isCalling]);

  if (!isOpen) return null;

  const quickReplies = [
    "Saya sudah menunggu di lobi depan.",
    "Kunci mobil nanti saya serahkan ke Driver Budi.",
    "Berapa menit lagi perkiraan tiba?",
    "Tolong parkirkan di area basement ya.",
  ];

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputVal.trim()) return;
    sendChatMessage(inputVal.trim());
    setInputVal("");
  };

  const formatCallTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remaining.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-md w-full h-[85vh] sm:h-[620px] flex flex-col shadow-modal text-slate-900 dark:text-white overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950/60 text-[#FF4D00] flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Chat Simulasi TROBOS
                </h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Rider Rizky & Driver Budi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsCalling(true)}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition"
              title="Simulasi Panggilan"
              aria-label="Panggilan Telepon"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Tutup Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Prototype notice pill */}
        <div className="px-3 py-1 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900/50 text-[10px] text-amber-800 dark:text-amber-300 text-center font-medium">
          Simulasi Saluran Komunikasi Driver (Demo Prototype)
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          {chatMessages.map((msg) => {
            const isUser = msg.sender === "user";
            const isSystem = msg.sender === "system";

            if (isSystem) {
              return (
                <div key={msg.id} className="text-center my-2">
                  <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] rounded-full border border-slate-200 dark:border-slate-700">
                    {msg.text}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
              >
                {!isUser && (
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 pl-1">
                    {msg.senderName}
                  </span>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                    isUser
                      ? "bg-[#FF4D00] text-white rounded-br-xs shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-xs"
                  }`}
                >
                  {msg.text}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 px-1">
                  <span>{msg.timestamp}</span>
                  {isUser && <CheckCheck className="w-3 h-3 text-[#FF4D00]" />}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {quickReplies.map((reply, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  sendChatMessage(reply);
                }}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 hover:border-[#FF4D00] hover:text-[#FF4D00] transition"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ketik pesan untuk rider/driver..."
            className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#FF4D00]"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="p-2.5 rounded-xl bg-[#FF4D00] hover:bg-[#E64500] disabled:opacity-40 text-white font-bold transition flex items-center justify-center shrink-0"
            aria-label="Kirim Pesan"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Simulated Phone Call Overlay */}
        {isCalling && (
          <div className="absolute inset-0 z-30 bg-slate-950/95 text-white flex flex-col items-center justify-between p-8 animate-fade-in">
            <div className="text-center space-y-2 mt-12">
              <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-800">
                Panggilan Suara Terhubung
              </span>
              <h4 className="text-xl font-black mt-2">{rider.name}</h4>
              <p className="text-xs text-slate-400">Rider Motor Trobos • {rider.phone}</p>
              <div className="text-2xl font-mono font-bold text-white pt-2">
                {formatCallTime(callDuration)}
              </div>
            </div>

            <div className="w-24 h-24 rounded-full bg-slate-900 border-2 border-emerald-500/60 flex items-center justify-center shadow-elevated">
              <PhoneCall className="w-10 h-10 text-emerald-400 animate-pulse" />
            </div>

            <div className="w-full max-w-xs space-y-3 mb-6">
              <p className="text-[11px] text-slate-400 text-center">
                Ini animasi panggilan demo. Tidak ada komunikasi telepon sungguhan.
              </p>
              <button
                type="button"
                onClick={() => setIsCalling(false)}
                className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition"
              >
                <PhoneOff className="w-4 h-4" />
                <span>Akhiri Panggilan</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
