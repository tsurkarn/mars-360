import React from 'react';
import { 
  Activity, 
  Map, 
  Navigation, 
  ShieldAlert, 
  FileText, 
  Radio, 
  AlertCircle,
  ExternalLink,
  Cpu,
  Compass
} from 'lucide-react';
import Badge from '../common/Badge';
import { SIMULATED_MISSION_DATA } from '../../data/marsData';

export default function Sidebar({ activePage, setActivePage, mobileOpen, setMobileOpen }) {
  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Mission Dashboard', 
      icon: Activity, 
      desc: 'Overview & Surface Status',
      tag: 'LIVE'
    },
    { 
      id: 'map', 
      label: 'Planetary Map', 
      icon: Map, 
      desc: 'Topographic Exploration',
      tag: 'MOLA'
    },
    { 
      id: 'routes', 
      label: 'Route Planning', 
      icon: Navigation, 
      desc: 'Marswalk & EVA Waypoints',
      tag: 'SIM'
    },
    { 
      id: 'survival', 
      label: 'Survival Simulation', 
      icon: ShieldAlert, 
      desc: 'Life Support & EVA Hazards',
      tag: 'SIM'
    },
    { 
      id: 'report', 
      label: 'Mission Report', 
      icon: FileText, 
      desc: 'Observations & Telemetry Debrief',
      tag: 'LOG'
    },
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      {/* Main Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 lg:top-[61px] left-0 h-screen lg:h-[calc(100vh-61px)] 
        w-72 bg-space-950/95 lg:bg-space-950/70 backdrop-blur-md border-r border-space-800/80 
        z-40 lg:z-10 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top: Section Label & Nav Items */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2 pt-2">
            <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
              MISSION MODULES
            </span>
            <Badge variant="real">MISSION CONTROL</Badge>
          </div>

          <nav className="space-y-1.5" aria-label="Mission navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-3.5 py-3 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                    isActive 
                      ? 'bg-space-850 border-mars-orange text-white shadow-glow-orange' 
                      : 'bg-space-900/50 border-transparent text-slate-300 hover:bg-space-850 hover:text-white hover:border-space-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-mars-orange/20 text-mars-orange border border-mars-orange/30' 
                        : 'bg-space-800/70 text-slate-400 group-hover:text-slate-200'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="font-display font-semibold text-sm tracking-wide">
                        {item.label}
                      </div>
                      <div className="text-[11px] text-slate-400 font-sans truncate max-w-[130px]">
                        {item.desc}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                    isActive
                      ? 'bg-mars-orange/20 text-mars-orange border-mars-orange/30'
                      : 'bg-space-800 text-slate-400 border-space-700'
                  }`}>
                    {item.tag}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Panel: Mission Context & Simulated Status Card */}
        <div className="space-y-3 pt-4 border-t border-space-800/80">
          <div className="p-3 rounded-xl bg-space-900 border border-space-800 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                ACTIVE SITE [SIM]
              </span>
              <span className="w-2 h-2 rounded-full bg-telemetry-emerald" />
            </div>
            <div className="font-display font-bold text-slate-100 text-sm">
              {SIMULATED_MISSION_DATA.primarySite}
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>CREW: 4 ASTRONAUTS</span>
              <span className="text-telemetry-cyan">SOL {SIMULATED_MISSION_DATA.currentSol}</span>
            </div>
          </div>

          <div className="px-2 py-1 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>PLANETARY EXPLORATION</span>
            <span className="text-mars-orange">MARS 360</span>
          </div>
        </div>
      </aside>
    </>
  );
}
