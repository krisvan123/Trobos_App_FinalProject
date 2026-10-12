"use client";

import React, { useState, useRef } from "react";
import {
  Plus,
  Minus,
  Crosshair,
  Layers,
  MapPin,
  Bike,
  Car,
  AlertCircle,
  ShieldCheck,
  Check,
} from "lucide-react";
import { TripStatus } from "@/types/trobos";
import { cn } from "@/lib/utils";

interface InteractiveMapProps {
  status?: TripStatus;
  userProgress?: number; // 0 - 100
  carProgress?: number;  // 0 - 100
  originName?: string;
  destinationName?: string;
  className?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  status = "IDLE",
  userProgress = 0,
  carProgress = 0,
  originName = "Jl. Sudirman Kav. 28",
  destinationName = "Pacific Place / SCBD",
  className,
}) => {
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedPin, setSelectedPin] = useState<string | null>(null);

  // SVG Coordinates (viewBox 0 0 1000 700)
  // Origin (Sudirman Kav 28): (520, 320)
  // Destination (SCBD): (340, 540)
  const originCoord = { x: 520, y: 320 };
  const destCoord = { x: 340, y: 540 };

  // Motorbike route calculation (fast shortcut)
  const motorProgressRatio = Math.min(Math.max(userProgress / 100, 0), 1);
  const motorPos = {
    x: originCoord.x + (destCoord.x - originCoord.x) * motorProgressRatio - Math.sin(motorProgressRatio * Math.PI) * 40,
    y: originCoord.y + (destCoord.y - originCoord.y) * motorProgressRatio,
  };

  // Car route calculation (arterial detour)
  const carProgressRatio = Math.min(Math.max(carProgress / 100, 0), 1);
  const carPos = {
    x: originCoord.x + (destCoord.x - originCoord.x) * carProgressRatio + Math.sin(carProgressRatio * Math.PI) * 60,
    y: originCoord.y + (destCoord.y - originCoord.y) * carProgressRatio,
  };

  // Tandem approaching position
  const tandemApproachingPos = {
    x: 660 - 140 * (status === "TANDEM_APPROACHING" ? 0.75 : status === "TANDEM_ARRIVED" ? 1 : 0.2),
    y: 210 + 110 * (status === "TANDEM_APPROACHING" ? 0.75 : status === "TANDEM_ARRIVED" ? 1 : 0.2),
  };

  const isTripActive = status === "TRIP_STARTED" || status === "USER_ARRIVED" || status === "VEHICLE_ARRIVED";
  const isSearching = status === "SEARCHING_TANDEM";
  const isApproaching = status === "TANDEM_ASSIGNED" || status === "TANDEM_APPROACHING" || status === "TANDEM_ARRIVED";

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - panOffset.x,
        y: e.touches[0].clientY - panOffset.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPanOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
    setSelectedPin(null);
  };

  return (
    <div
      className={cn(
        "relative w-full h-full bg-[#EEF2F6] dark:bg-[#070B16] overflow-hidden select-none cursor-grab active:cursor-grabbing",
        className
      )}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Map Controls: Zoom, Recenter, Layer */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 shadow-sm pointer-events-auto">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setZoom((z) => Math.min(z + 0.2, 1.8));
          }}
          className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition"
          aria-label="Perbesar Peta"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setZoom((z) => Math.max(z - 0.2, 0.7));
          }}
          className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition"
          aria-label="Perkecil Peta"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            resetView();
          }}
          className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 text-[#FF4D00] border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition"
          title="Reset Posisi Peta"
          aria-label="Pusatkan Posisi"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      {/* Top Left Traffic Info Tag */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold shadow-sm">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>Koridor Sudirman: Macet Padat</span>
        </div>
      </div>

      {/* Bottom Center Indicator: Interactive Guidance */}
      <div className="absolute bottom-20 md:bottom-5 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-slate-900/80 dark:bg-slate-800/80 text-white text-[10px] font-medium backdrop-blur-xs shadow-sm">
          Geser (Drag) untuk menjelajah • Klik titik untuk info rute
        </span>
      </div>

      {/* Selected Marker Detail Modal / Tooltip */}
      {selectedPin && (
        <div className="absolute top-16 left-4 right-4 sm:right-auto sm:max-w-xs z-30 pointer-events-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-modal text-xs animate-fade-in">
          <div className="flex justify-between items-start">
            <span className="font-bold text-slate-900 dark:text-white">
              {selectedPin === "origin" && "Titik Jemput Anda"}
              {selectedPin === "dest" && "Tujuan Akhir"}
              {selectedPin === "motor" && "Rider Motor Trobos"}
              {selectedPin === "car" && "Driver Mobil Anda"}
            </span>
            <button
              onClick={() => setSelectedPin(null)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs font-bold"
            >
              ✕
            </button>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
            {selectedPin === "origin" && `${originName} — Siap serah terima kunci saat tandem tiba.`}
            {selectedPin === "dest" && `${destinationName} — Estimasi motor tiba 18 mnt, mobil 31 mnt.`}
            {selectedPin === "motor" && "Kecepatan ~35 km/h menembus kemacetan koridor Sudirman."}
            {selectedPin === "car" && "Kecepatan ~22 km/h melalui jalur arteri dengan aman & berasuransi."}
          </p>
        </div>
      )}

      {/* SVG Canvas with Zoom & Pan Translation */}
      <div
        className="w-full h-full flex items-center justify-center transition-transform duration-75 ease-out"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
        }}
      >
        <svg
          viewBox="0 0 1000 700"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="trafficGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
            <linearGradient id="motorRouteLine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>
            <linearGradient id="carRouteLine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          </defs>

          {/* Urban City Blocks */}
          <g className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-800" strokeWidth="1">
            <rect x="50" y="50" width="220" height="180" rx="8" />
            <rect x="310" y="50" width="160" height="180" rx="8" />
            <rect x="570" y="50" width="230" height="170" rx="8" />
            <rect x="830" y="60" width="150" height="180" rx="8" />

            <rect x="50" y="270" width="210" height="180" rx="8" />
            <rect x="670" y="260" width="280" height="180" rx="8" />

            <rect x="50" y="490" width="220" height="170" rx="8" />
            <rect x="670" y="480" width="280" height="180" rx="8" />

            {/* SCBD Commercial District Blocks */}
            <rect x="300" y="470" width="150" height="140" rx="10" className="fill-slate-50 dark:fill-slate-800/80 stroke-slate-300 dark:stroke-slate-700" />
            <rect x="470" y="480" width="160" height="130" rx="10" className="fill-slate-50 dark:fill-slate-800/80 stroke-slate-300 dark:stroke-slate-700" />
          </g>

          {/* Natural Green Parks (GBK Senayan) */}
          <rect x="290" y="260" width="180" height="180" rx="20" fill="#E2EEDD" className="dark:fill-emerald-950/30" stroke="#C8DFBE" strokeWidth="1.5" />
          <circle cx="380" cy="350" r="50" fill="#D5E8CE" className="dark:fill-emerald-950/50" stroke="#BAD9AE" strokeWidth="1.5" />
          <text x="380" y="354" fill="#3B6B35" className="dark:fill-emerald-400" fontSize="11" fontWeight="700" textAnchor="middle">
            GBK Senayan
          </text>

          {/* Minor Road Grid */}
          <g className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="4" strokeLinecap="round">
            <line x1="160" y1="20" x2="160" y2="680" />
            <line x1="880" y1="20" x2="880" y2="680" />
            <line x1="30" y1="150" x2="970" y2="150" />
            <line x1="30" y1="460" x2="970" y2="460" />
          </g>

          {/* Major Highway: Gatot Subroto */}
          <path
            d="M 30 400 Q 500 385 970 400"
            fill="none"
            className="stroke-slate-300 dark:stroke-slate-700"
            strokeWidth="20"
            strokeLinecap="round"
          />
          <path
            d="M 30 400 Q 500 385 970 400"
            fill="none"
            className="stroke-white dark:stroke-slate-900"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Main Avenue: Jl. Jend. Sudirman */}
          <path
            d="M 520 30 L 520 670"
            fill="none"
            className="stroke-slate-300 dark:stroke-slate-700"
            strokeWidth="26"
            strokeLinecap="round"
          />
          <path
            d="M 520 30 L 520 670"
            fill="none"
            className="stroke-white dark:stroke-slate-900"
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* Semanggi Interchange */}
          <ellipse cx="520" cy="390" rx="55" ry="35" fill="none" className="stroke-slate-300 dark:stroke-slate-700" strokeWidth="10" />
          <ellipse cx="520" cy="390" rx="55" ry="35" fill="none" className="stroke-white dark:stroke-slate-900" strokeWidth="6" />

          {/* Realistic Traffic Stripe on Sudirman */}
          <path
            d="M 520 180 L 520 460"
            fill="none"
            stroke="url(#trafficGradient)"
            strokeWidth="7"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Road Labels */}
          <g className="fill-slate-400 dark:fill-slate-500" fontSize="10" fontWeight="600">
            <text x="532" y="100">JL. MH THAMRIN</text>
            <text x="532" y="240">JL. JEND. SUDIRMAN</text>
            <text x="532" y="630">BLOK M</text>
            <text x="340" y="525" className="fill-slate-800 dark:fill-slate-200" fontWeight="700">SCBD LOT 8</text>
          </g>

          {/* ACTIVE DUAL ROUTE POLYLINES */}
          {isTripActive && (
            <g>
              {/* Motorbike shortcut route (Blue) */}
              <path
                d={`M ${originCoord.x} ${originCoord.y} Q 450 400 ${destCoord.x} ${destCoord.y}`}
                fill="none"
                stroke="url(#motorRouteLine)"
                strokeWidth="5"
                strokeDasharray="7 4"
                strokeLinecap="round"
              />
              {/* Car arterial route (Amber) */}
              <path
                d={`M ${originCoord.x} ${originCoord.y} Q 570 420 450 500 L ${destCoord.x} ${destCoord.y}`}
                fill="none"
                stroke="url(#carRouteLine)"
                strokeWidth="4"
                strokeDasharray="6 4"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* SEARCHING TANDEM: RADAR */}
          {isSearching && (
            <g transform={`translate(${originCoord.x}, ${originCoord.y})`}>
              <circle r="130" fill="#FF4D00" fillOpacity="0.08" />
              <circle r="75" fill="#FF4D00" fillOpacity="0.12" />
              <circle r="130" fill="none" stroke="#FF4D00" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.6" />
            </g>
          )}

          {/* DESTINATION PIN */}
          <g
            transform={`translate(${destCoord.x}, ${destCoord.y})`}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPin("dest");
            }}
            className="cursor-pointer"
          >
            <circle r="14" fill="#10B981" />
            <circle r="5" fill="#FFFFFF" />
            <g transform="translate(0, -22)">
              <rect x="-45" y="-12" width="90" height="18" rx="6" fill="#0F172A" />
              <text x="0" y="1" fill="#FFFFFF" fontSize="9" fontWeight="700" textAnchor="middle">
                Tujuan: {destinationName.split("/")[0]}
              </text>
            </g>
          </g>

          {/* USER PICKUP PIN */}
          <g
            transform={`translate(${originCoord.x}, ${originCoord.y})`}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPin("origin");
            }}
            className="cursor-pointer"
          >
            <circle r="18" fill="#FF4D00" fillOpacity="0.2" className="animate-ping" />
            <circle r="12" fill="#FF4D00" />
            <circle r="4" fill="#FFFFFF" />
            <g transform="translate(0, 26)">
              <rect x="-60" y="-12" width="120" height="18" rx="6" fill="#0F172A" />
              <text x="0" y="1" fill="#FFFFFF" fontSize="9" fontWeight="700" textAnchor="middle">
                Titik Anda: {originName.split("Kav")[0]}
              </text>
            </g>
          </g>

          {/* TANDEM APPROACHING PIN */}
          {isApproaching && (
            <g transform={`translate(${tandemApproachingPos.x}, ${tandemApproachingPos.y})`}>
              <rect x="-14" y="-14" width="28" height="28" rx="8" fill="#0F172A" stroke="#FF4D00" strokeWidth="2" />
              <path d="M1 -6 L-5 1 L0 1 L-1 7 L5 -1 L0 -1 Z" fill="#FF4D00" />
              <g transform="translate(0, -22)">
                <rect x="-45" y="-12" width="90" height="18" rx="6" fill="#FF4D00" />
                <text x="0" y="1" fill="#FFFFFF" fontSize="9" fontWeight="700" textAnchor="middle">
                  Tandem (3 mnt)
                </text>
              </g>
            </g>
          )}

          {/* LIVE DUAL JOURNEY PINS */}
          {isTripActive && (
            <g>
              {/* YOU ON MOTORBIKE */}
              <g
                transform={`translate(${motorPos.x}, ${motorPos.y})`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPin("motor");
                }}
                className="cursor-pointer"
              >
                <rect x="-14" y="-14" width="28" height="28" rx="8" fill="#0284C7" stroke="#FFFFFF" strokeWidth="2" />
                <g transform="translate(0, -1)">
                  <circle cx="-5" cy="4" r="3" fill="none" stroke="#FFFFFF" strokeWidth="1.4" />
                  <circle cx="5" cy="4" r="3" fill="none" stroke="#FFFFFF" strokeWidth="1.4" />
                  <path d="M-5 4 L-1 0 L3 0 L5 -3 M-1 0 L2 4" fill="none" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <g transform="translate(0, -22)">
                  <rect x="-40" y="-12" width="80" height="18" rx="6" fill="#0284C7" />
                  <text x="0" y="1" fill="#FFFFFF" fontSize="9" fontWeight="700" textAnchor="middle">
                    Anda (Motor)
                  </text>
                </g>
              </g>

              {/* YOUR CAR FOLLOWING */}
              <g
                transform={`translate(${carPos.x}, ${carPos.y})`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPin("car");
                }}
                className="cursor-pointer"
              >
                <rect x="-14" y="-14" width="28" height="28" rx="8" fill="#D97706" stroke="#FFFFFF" strokeWidth="2" />
                <g transform="translate(0, -1)">
                  <path d="M-7 3 L-5 -2 L-1 -5 L3 -5 L6 -2 L8 3 Z" fill="none" stroke="#FFFFFF" strokeWidth="1.3" strokeLinejoin="round" />
                  <circle cx="-4" cy="4" r="1.8" fill="#FFFFFF" />
                  <circle cx="4" cy="4" r="1.8" fill="#FFFFFF" />
                </g>
                <g transform="translate(0, 26)">
                  <rect x="-46" y="-12" width="92" height="18" rx="6" fill="#B45309" />
                  <text x="0" y="1" fill="#FFFFFF" fontSize="9" fontWeight="700" textAnchor="middle">
                    Mobil Anda (Driver)
                  </text>
                </g>
              </g>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
