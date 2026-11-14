import React, { useState } from 'react';
import { 
  Thermometer, 
  Wind, 
  Gauge, 
  Sun, 
  Orbit, 
  Activity, 
  Radio, 
  Battery, 
  ShieldAlert, 
  AlertTriangle,
  ArrowRight,
  Compass,
  CheckCircle2,
  Clock
} from 'lucide-react';
import MetricCard from '../components/common/MetricCard';
import Badge from '../components/common/Badge';
import MarsInteractiveMap from '../components/map/MarsInteractiveMap';
import { 
  MARS_PLANETARY_CONSTANTS, 
  SIMULATED_MISSION_DATA, 
  INITIAL_SIMULATED_TELEMETRY,
  MARS_LANDMARKS
} from '../data/marsData';

export default function Dashboard({ onNavigate, activeRoute, activeSurvival }) {
  const [selectedSite, setSelectedSite] = useState(MARS_LANDMARKS[0]);

  return (
    <div className="space-y-6">
      {/* Top Banner: Mission Status & Prototype Notice */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-space-900 via-space-850 to-space-900 border border-space-700/80 p-5 shadow-panel">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-telemetry-emerald animate-pulse" />
              <span className="font-mono text-xs text-telemetry-emerald font-bold tracking-wider">
                MISSION STATUS: {activeSurvival?.verdict?.status || SIMULATED_MISSION_DATA.missionStatus}
              </span>
              <Badge variant="simulated">SIMULATED TELEMETRY</Badge>
            </div>
            <h1 className="text-xl md:text-2xl font-display font-bold text-white tracking-wide">
              MARS 360 EXPLORATION COMMAND
            </h1>
            <p className="text-xs md:text-sm text-slate-300 font-sans max-w-2xl">
              Real-time planetary cartography and simulated surface operations for scientific Mars exploration.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('routes')}
              className="px-4 py-2 rounded-xl bg-mars-orange hover:bg-mars-rust text-white text-xs font-mono font-bold tracking-wider transition-all duration-200 shadow-glow-orange flex items-center gap-2"
            >
              <span>PLAN MARSWALK</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('survival')}
              className="px-4 py-2 rounded-xl bg-space-800 hover:bg-space-700 border border-space-600 text-slate-200 text-xs font-mono font-bold tracking-wider transition-all"
            >
              SURVIVAL SIMULATOR
            </button>
            <button
              onClick={() => onNavigate('report')}
              className="px-4 py-2 rounded-xl bg-space-850 hover:bg-space-800 border border-telemetry-cyan/40 text-telemetry-cyan text-xs font-mono font-bold tracking-wider transition-all"
            >
              MISSION REPORT
            </button>
          </div>
        </div>
      </div>

      {/* Row 1: Key Scientific Planetary Constants vs Simulated Surface Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Surface Pressure"
          value={MARS_PLANETARY_CONSTANTS.meanSurfacePressure}
          icon={Gauge}
          isReal={true}
          subtitle="Fluctuates with seasonal polar CO₂ cycles"
          trend="PDS VERIFIED"
          trendType="neutral"
          statusColor="cyan"
        />

        <MetricCard
          title="Martian Gravity"
          value={MARS_PLANETARY_CONSTANTS.surfaceGravity}
          icon={Orbit}
          isReal={true}
          subtitle="38% of Earth standard gravitational pull"
          trend="3.721 m/s²"
          trendType="neutral"
          statusColor="cyan"
        />

        <MetricCard
          title="Ambient Temp (Jezero)"
          value="-58.4"
          unit="°C"
          icon={Thermometer}
          isSimulated={true}
          subtitle="Simulated diurnal thermal sensor"
          trend="-140°C to +20°C Range"
          trendType="warning"
          statusColor="orange"
        />

        <MetricCard
          title="EVA Battery State"
          value={INITIAL_SIMULATED_TELEMETRY.batteryLevelPercent}
          unit="%"
          icon={Battery}
          isSimulated={true}
          subtitle="Suit life support power cells"
          trend="NOMINAL DURATION"
          trendType="positive"
          statusColor="emerald"
        />
      </div>

      {/* Row 2: Main Planetary Surface Map Area */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-display font-bold text-white tracking-wide">
                SURFACE CARTOGRAPHY & REGIONAL TARGETS
              </h2>
              <Badge variant="real">OPENLAYERS + NASA TREK</Badge>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Interactive topographic map overlay with NASA MOLA elevation baselines. Click any pin to inspect terrain.
            </p>
          </div>
          <button
            onClick={() => onNavigate('map')}
            className="px-3 py-1.5 rounded-lg bg-space-850 hover:bg-space-800 border border-space-700 text-xs font-mono font-bold text-telemetry-cyan hover:text-white flex items-center gap-1.5 self-start sm:self-auto transition-colors shadow-sm"
          >
            <span>LAUNCH OPENLAYERS SATELLITE EXPLORER</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <MarsInteractiveMap 
          selectedLandmarkId={selectedSite.id}
          onSelectLandmark={(site) => setSelectedSite(site)}
        />
      </div>

      {/* Row 3: Planetary Atmosphere Profile & Active Mission Status Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Atmospheric Composition Panel (NASA Scientific Fact) */}
        <div className="lg:col-span-2 rounded-2xl bg-space-900 border border-space-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-telemetry-cyan" />
              <h3 className="font-display font-bold text-sm text-white">
                MARTIAN ATMOSPHERIC COMPOSITION (NASA FACT SHEET)
              </h3>
            </div>
            <Badge variant="real">IN SITU DATA</Badge>
          </div>

          <p className="text-xs text-slate-300 font-sans">
            Mars has a thin atmosphere composed primarily of Carbon Dioxide, requiring closed-loop life support (O₂ generation via MOXIE electrolysis) for human exploration.
          </p>

          {/* Bar visualization */}
          <div className="space-y-3 pt-1">
            {MARS_PLANETARY_CONSTANTS.atmosphereComposition.map((gas) => (
              <div key={gas.gas} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">{gas.gas}</span>
                  <span className="text-white font-bold">{gas.percentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-space-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(gas.percentage, 2)}%`,
                      backgroundColor: gas.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active Simulated EVA Operations Card */}
        <div className="rounded-2xl bg-space-900 border border-space-800 p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-mars-orange" />
                <h3 className="font-display font-bold text-sm text-white">
                  EVA-018 STATUS [SIMULATED]
                </h3>
              </div>
              <Badge variant="simulated">ACTIVE</Badge>
            </div>

            <div className="p-3.5 rounded-xl bg-space-950 border border-space-800 space-y-2">
              <div className="text-xs font-mono text-slate-400">CURRENT OPERATION:</div>
              <div className="font-display font-bold text-slate-100 text-sm">
                Fan Delta Core Sampling
              </div>
              <div className="text-xs text-slate-400 font-sans">
                Crew members conducting mineralogical spectrography at Jezero Kodiak outcrop.
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-space-800">
                <span className="text-slate-400">Oxygen Reserves:</span>
                <span className={`font-bold ${activeSurvival?.o2?.percent < 25 ? 'text-telemetry-rose' : 'text-telemetry-emerald'}`}>
                  {activeSurvival?.o2 ? `${activeSurvival.o2.percent.toFixed(1)}% (${activeSurvival.o2.remaining} kg)` : '320 min remaining'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-space-800">
                <span className="text-slate-400">Water Reserves:</span>
                <span className={`font-bold ${activeSurvival?.water?.percent < 25 ? 'text-telemetry-rose' : 'text-telemetry-emerald'}`}>
                  {activeSurvival?.water ? `${activeSurvival.water.percent.toFixed(1)}% (${activeSurvival.water.remaining} L)` : '100% (Nominal)'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-space-800">
                <span className="text-slate-400">Planned Traverse:</span>
                <span className="text-telemetry-cyan font-bold">
                  {activeRoute ? `${activeRoute.totalDistanceMeters.toLocaleString()} m` : '4,250 m'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => onNavigate('survival')}
              className="w-full py-2.5 rounded-xl bg-space-850 hover:bg-space-800 border border-space-700 text-xs font-mono font-bold text-slate-200 transition-colors flex items-center justify-center gap-2"
            >
              <span>OPEN SURVIVAL SIMULATOR</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('report')}
              className="w-full py-2 rounded-xl bg-space-950 hover:bg-space-900 border border-telemetry-cyan/40 text-xs font-mono text-telemetry-cyan transition-colors flex items-center justify-center gap-2"
            >
              <span>INSPECT MISSION DEBRIEF</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
