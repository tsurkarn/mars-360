import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Clock, 
  Globe, 
  Menu, 
  X, 
  Orbit, 
  Activity, 
  Compass, 
  Layers, 
  ShieldCheck 
} from 'lucide-react';
import Badge from '../common/Badge';
import { SIMULATED_MISSION_DATA } from '../../data/marsData';

export default function Header({ mobileOpen, setMobileOpen, activePage }) {
  const [earthTime, setEarthTime] = useState('');
  const [solTime, setSolTime] = useState('14:26:12');

  // Live Earth UTC Clock and simulated Martian Sol Clock tick
  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setEarthTime(now.toUTCString().slice(17, 25) + ' UTC');
      
      // Update Martian second tick
      const totalSec = (Math.floor(now.getTime() / 1027.49125)) % 86400; // Martian second is ~1.0275 Earth seconds
      const hrs = String(Math.floor(totalSec / 3600)).padStart(2, '0');
      const mins = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
      const secs = String(totalSec % 60).padStart(2, '0');
      setSolTime(`${hrs}:${mins}:${secs}`);
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-space-950/95 backdrop-blur-md border-b border-space-700/60 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Project Brand & Mission Identifier */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg bg-space-850 border border-space-700 text-slate-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-mars-rust to-mars-orange text-white shadow-glow-orange border border-mars-orange/30">
              <Orbit className="w-5 h-5 animate-[spin_12s_linear_infinite]" />
              <div className="absolute w-2 h-2 rounded-full bg-white shadow" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg lg:text-xl tracking-wider text-white">
                  MARS <span className="text-mars-orange">360</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-space-800 text-slate-400 border border-space-700">
                  v0.1-PROTOTYPE
                </span>
              </div>
              <p className="text-[10px] lg:text-[11px] font-mono text-slate-400 uppercase tracking-widest hidden md:block">
                Scientific Exploration & Marswalk Planning Console
              </p>
            </div>
          </div>
        </div>

        {/* Center: Mission Control Timers (Sol Clock & Earth UTC) */}
        <div className="hidden lg:flex items-center gap-6 px-4 py-1.5 rounded-lg bg-space-900 border border-space-800">
          {/* Sol Time */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-mars-orange animate-pulse" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-display text-slate-400">MARTIAN SOL</span>
                <Badge variant="simulated">SOL {SIMULATED_MISSION_DATA.currentSol}</Badge>
              </div>
              <div className="font-mono text-sm font-bold text-slate-100">
                {solTime} <span className="text-[10px] text-mars-orange font-normal">MTC</span>
              </div>
            </div>
          </div>

          <div className="w-px h-8 bg-space-800" />

          {/* Earth UTC */}
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-telemetry-cyan" />
            <div>
              <div className="text-xs font-display text-slate-400">EARTH SYNC</div>
              <div className="font-mono text-sm font-bold text-slate-200">
                {earthTime || 'SYNCING...'}
              </div>
            </div>
          </div>

          <div className="w-px h-8 bg-space-800" />

          {/* Telemetry Delay */}
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-telemetry-emerald" />
            <div>
              <div className="text-xs font-display text-slate-400">ONE-WAY LIGHT TIME</div>
              <div className="font-mono text-xs font-semibold text-telemetry-emerald flex items-center gap-1">
                <span>~12.3 MIN</span>
                <span className="text-[10px] text-slate-500 font-sans">(DSN ACTIVE)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Space Apps Challenge Pill & Operational Status */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-telemetry-emerald animate-ping" />
              <span className="text-xs font-display font-semibold text-slate-200">
                DSN TELEMETRY LINK
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              SPACE APPS 2026 CHALLENGE
            </span>
          </div>

          <div className="px-3 py-1 rounded-lg bg-space-850 border border-space-700 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-telemetry-emerald" />
            <span className="text-xs font-mono font-bold text-telemetry-emerald">
              NOMINAL
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
