import React, { useState } from 'react';
import { 
  Heart, 
  Wind, 
  ShieldAlert, 
  Zap, 
  Thermometer, 
  Gauge, 
  AlertTriangle, 
  RotateCcw,
  Activity,
  Flame,
  Sun,
  Radio
} from 'lucide-react';
import MetricCard from '../components/common/MetricCard';
import Badge from '../components/common/Badge';
import { INITIAL_SIMULATED_TELEMETRY } from '../data/marsData';

export default function SurvivalSimulation() {
  const [telemetry, setTelemetry] = useState(INITIAL_SIMULATED_TELEMETRY);
  const [activeHazards, setActiveHazards] = useState({
    dustStorm: false,
    thermalDrop: false,
    solarRadiation: false,
  });

  const toggleHazard = (hazardKey) => {
    const updated = !activeHazards[hazardKey];
    setActiveHazards(prev => ({ ...prev, [hazardKey]: updated }));

    // Dynamically adjust simulated telemetry according to active hazards
    setTelemetry(prev => {
      let batt = INITIAL_SIMULATED_TELEMETRY.batteryLevelPercent;
      let o2 = INITIAL_SIMULATED_TELEMETRY.suitO2RemainingMin;
      let hr = INITIAL_SIMULATED_TELEMETRY.heartRateBpm;
      let rad = INITIAL_SIMULATED_TELEMETRY.radiationRateMicroSvH;
      let extTemp = INITIAL_SIMULATED_TELEMETRY.ambientExtTempC;
      let scrubber = INITIAL_SIMULATED_TELEMETRY.co2ScrubberEfficiencyPercent;

      if (updated || (hazardKey !== 'dustStorm' && activeHazards.dustStorm)) {
        batt -= 15;
        scrubber -= 8.4;
        hr += 12;
      }
      if (updated || (hazardKey !== 'thermalDrop' && activeHazards.thermalDrop)) {
        extTemp -= 32; // Drops to -90.4°C
        batt -= 18;
      }
      if (updated || (hazardKey !== 'solarRadiation' && activeHazards.solarRadiation)) {
        rad += 95.5; // Elevated radiation
        hr += 18;
      }

      return {
        ...prev,
        batteryLevelPercent: Math.max(batt, 20),
        suitO2RemainingMin: o2,
        heartRateBpm: hr,
        radiationRateMicroSvH: rad,
        ambientExtTempC: extTemp,
        co2ScrubberEfficiencyPercent: scrubber,
      };
    });
  };

  const handleReset = () => {
    setActiveHazards({
      dustStorm: false,
      thermalDrop: false,
      solarRadiation: false,
    });
    setTelemetry(INITIAL_SIMULATED_TELEMETRY);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-telemetry-rose font-semibold">
              BIO-TELEMETRY & LIFE SUPPORT
            </span>
            <Badge variant="simulated">SIMULATED SUIT DYNAMICS</Badge>
          </div>
          <h1 className="text-xl md:text-2xl font-display font-bold text-white tracking-wide">
            MARSWALK LIFE SUPPORT & HAZARD SIMULATOR
          </h1>
          <p className="text-xs md:text-sm text-slate-300 font-sans max-w-2xl">
            Simulate astronaut physiological vitals, closed-loop EMU suit pressurization, and environmental hazards under realistic Mars atmospheric conditions.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-3.5 py-2 rounded-xl bg-space-900 hover:bg-space-850 border border-space-700 text-xs font-mono font-bold text-slate-300 transition-colors flex items-center gap-2 self-start md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESET SIMULATION</span>
        </button>
      </div>

      {/* Hazard Injector Console */}
      <div className="rounded-2xl bg-space-900 border border-space-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-telemetry-amber" />
            <h2 className="font-display font-bold text-sm text-white">
              SIMULATE ENVIRONMENTAL HAZARDS [TEST CONSOLE]
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            TOGGLE HAZARD SCENARIOS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => toggleHazard('dustStorm')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              activeHazards.dustStorm
                ? 'bg-mars-rust/20 border-mars-orange text-white shadow-glow-orange'
                : 'bg-space-950 border-space-800 text-slate-400 hover:border-space-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-display font-bold text-xs text-white">
                Regional Dust Storm
              </span>
              <Wind className="w-4 h-4 text-mars-orange" />
            </div>
            <p className="text-[11px] font-sans text-slate-400">
              Atmospheric opacity spikes, increases scrubber filtration resistance.
            </p>
          </button>

          <button
            onClick={() => toggleHazard('thermalDrop')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              activeHazards.thermalDrop
                ? 'bg-telemetry-cyan/20 border-telemetry-cyan text-white shadow-glow-cyan'
                : 'bg-space-950 border-space-800 text-slate-400 hover:border-space-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-display font-bold text-xs text-white">
                Nightfall Thermal Plunge
              </span>
              <Thermometer className="w-4 h-4 text-telemetry-cyan" />
            </div>
            <p className="text-[11px] font-sans text-slate-400">
              Ambient temperature drops to -90°C. Suit heating power consumption jumps.
            </p>
          </button>

          <button
            onClick={() => toggleHazard('solarRadiation')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              activeHazards.solarRadiation
                ? 'bg-telemetry-rose/20 border-telemetry-rose text-white shadow-glow-rose'
                : 'bg-space-950 border-space-800 text-slate-400 hover:border-space-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-display font-bold text-xs text-white">
                Solar Particle Event (SPE)
              </span>
              <Sun className="w-4 h-4 text-telemetry-rose" />
            </div>
            <p className="text-[11px] font-sans text-slate-400">
              Ionizing radiation spike. Immediate abort to regolith-shielded habitat.
            </p>
          </button>
        </div>
      </div>

      {/* Main Telemetry Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Suit Pressure"
          value={telemetry.suitPressureKPa}
          unit="kPa"
          icon={Gauge}
          isSimulated={true}
          subtitle="Nominal 100% O₂ suit envelope"
          trend="Ambient: 618 Pa"
          trendType="positive"
          statusColor="cyan"
        />

        <MetricCard
          title="Astronaut Heart Rate"
          value={telemetry.heartRateBpm}
          unit="BPM"
          icon={Heart}
          isSimulated={true}
          subtitle="Biometric sensor patch"
          trend={telemetry.heartRateBpm > 95 ? 'ELEVATED' : 'STABLE'}
          trendType={telemetry.heartRateBpm > 95 ? 'warning' : 'positive'}
          statusColor={telemetry.heartRateBpm > 95 ? 'amber' : 'emerald'}
        />

        <MetricCard
          title="Oxygen Time Remaining"
          value={telemetry.suitO2RemainingMin}
          unit="MINUTES"
          icon={Wind}
          isSimulated={true}
          subtitle="Primary + secondary tanks"
          trend="5.3 HOURS"
          trendType="positive"
          statusColor="emerald"
        />

        <MetricCard
          title="Radiation Dose Rate"
          value={telemetry.radiationRateMicroSvH.toFixed(1)}
          unit="µSv/h"
          icon={Zap}
          isSimulated={true}
          subtitle="Cosmic ray flux sensor"
          trend={telemetry.radiationRateMicroSvH > 50 ? 'HAZARD WARNING' : 'NOMINAL'}
          trendType={telemetry.radiationRateMicroSvH > 50 ? 'negative' : 'neutral'}
          statusColor={telemetry.radiationRateMicroSvH > 50 ? 'rose' : 'cyan'}
        />
      </div>

      {/* Deep Dive: Suit Closed-Loop Subsystems */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-space-900 border border-space-800 p-5 space-y-4">
          <h3 className="font-display font-bold text-sm text-white">
            CLOSED-LOOP SUIT SUBSYSTEMS [SIMULATED]
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Battery Reserve:</span>
                <span className="text-white font-bold">{telemetry.batteryLevelPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-space-800 overflow-hidden">
                <div 
                  className="h-full bg-telemetry-emerald rounded-full transition-all duration-300" 
                  style={{ width: `${telemetry.batteryLevelPercent}%` }} 
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">CO₂ Amine Scrubber Efficiency:</span>
                <span className="text-white font-bold">{telemetry.co2ScrubberEfficiencyPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-space-800 overflow-hidden">
                <div 
                  className="h-full bg-telemetry-cyan rounded-full transition-all duration-300" 
                  style={{ width: `${telemetry.co2ScrubberEfficiencyPercent}%` }} 
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Hydration Reservoirs:</span>
                <span className="text-white font-bold">{telemetry.hydrationLevelPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-space-800 overflow-hidden">
                <div 
                  className="h-full bg-telemetry-cyan rounded-full transition-all duration-300" 
                  style={{ width: `${telemetry.hydrationLevelPercent}%` }} 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-space-900 border border-space-800 p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="font-display font-bold text-sm text-white">
              PLANETARY SCIENTIFIC REALITY (MARS vs EARTH)
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Unlike the vacuum of Low Earth Orbit (ISS spacewalks), Martian surface suits must withstand sharp abrasive basaltic dust, extreme diurnal thermal swings of 100+ °C, and toxic perchlorates in the regolith, while preserving astronaut joint mobility under 0.38g gravity.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-space-950 border border-space-800 space-y-1 text-xs font-mono">
            <div className="text-telemetry-cyan font-bold">ATMOSPHERIC FACT:</div>
            <div className="text-slate-300 text-[11px] font-sans">
              Mars atmospheric pressure at Jezero Crater is only ~0.6% of Earth sea-level pressure. An unpressurized suit would cause immediate ebullism.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
