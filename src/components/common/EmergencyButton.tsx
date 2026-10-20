"use client";

import React from "react";
import { Zap, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmergencyButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  compact?: boolean;
}

export const EmergencyButton: React.FC<EmergencyButtonProps> = ({
  onClick,
  disabled = false,
  className,
  compact = false,
}) => {
  return (
    <div className={cn("w-full", className)}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label="Simulasikan permintaan bantuan evakuasi"
        className={cn(
          "w-full bg-[#FF4D00] hover:bg-[#E64500] active:scale-[0.99] text-white rounded-2xl shadow-elevated transition-all duration-150 flex items-center justify-between",
          compact ? "p-3.5" : "p-4 sm:p-5"
        )}
      >
        <div className="flex items-center gap-3.5 text-left">
          <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black tracking-tight text-white leading-tight">
              MINTA BANTUAN
            </div>
            <div className="text-xs text-white/90 font-medium mt-0.5">
              Evakuasi mobil mogok & antar penumpang ke tujuan
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2.5 pl-4 border-l border-white/20 text-right shrink-0">
          <div>
            <div className="text-[11px] text-white/80 font-medium">Towing & Armada Pengganti</div>
            <div className="text-xs font-bold text-white">Hanya Demo</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
            <ArrowRight className="w-4 h-4 text-white" />
          </div>
        </div>
      </button>
    </div>
  );
};
