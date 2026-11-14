import React, { useState, useMemo, useEffect } from 'react';
import { 
  Heart, 
  Wind, 
  Droplets, 
  Zap, 
  Clock, 
  Users, 
  Gauge, 
  Sliders, 
  RotateCcw, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp, 
  Info,
  Footprints,
  Calendar,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import Badge from '../components/common/Badge';
import MetricCard from '../components/common/MetricCard';
import ResourceGauge from '../components/survival/ResourceGauge';
import ResourceTimelineChart from '../components/survival/ResourceTimelineChart';

export default function SurvivalSimulation({ onUpdateSurvivalState }) {
  // Preset definitions: 1-Day, 7-Day, 30-Day
  const PRESETS = {
    one_day: {
      name: '1-Day EVA Sortie',
      description: 'Single-sol field EVA traverse with suit portable life support system (PLSS) consumables.',
      crewCount: 2,
      durationDays: 1,
      workHoursPerDay: 8,
      walkingSpeedKmh: 2.5,
      oxygenSupplyKg: 3.5,
      waterSupplyL: 9.0,
      batteryCapacityKwh: 12.0,
    },
    seven_day: {
      name: '7-Day Rover Expedition',
      description: 'Regional multi-sol pressurized rover traverse with daily science sorties.',
      crewCount: 4,
      durationDays: 7,
      workHoursPerDay: 6,
      walkingSpeedKmh: 2.5,
      oxygenSupplyKg: 32.0,
      waterSupplyL: 110.0,
      batteryCapacityKwh: 90.0,
    },
    thirty_day: {
      name: '30-Day Outpost Base Camp',
      description: 'Long-duration surface habitat outpost with closed-loop buffer reserves.',
      crewCount: 4,
      durationDays: 30,
      workHoursPerDay: 6,
      walkingSpeedKmh: 2.2,
      oxygenSupplyKg: 135.0,
      waterSupplyL: 440.0,
      batteryCapacityKwh: 360.0,
    }
  };

  const [activePreset, setActivePreset] = useState('seven_day');

  // Mission Configuration State
  const [crewCount, setCrewCount] = useState(PRESETS.seven_day.crewCount);
  const [durationDays, setDurationDays] = useState(PRESETS.seven_day.durationDays);
  const [workHoursPerDay, setWorkHoursPerDay] = useState(PRESETS.seven_day.workHoursPerDay);
  const [walkingSpeedKmh, setWalkingSpeedKmh] = useState(PRESETS.seven_day.walkingSpeedKmh);

  // Supply Stores (Initial Resources)
  const [oxygenSupplyKg, setOxygenSupplyKg] = useState(PRESETS.seven_day.oxygenSupplyKg);
  const [waterSupplyL, setWaterSupplyL] = useState(PRESETS.seven_day.waterSupplyL);
  const [batteryCapacityKwh, setBatteryCapacityKwh] = useState(PRESETS.seven_day.batteryCapacityKwh);

  // Configurable Illustrative Consumption Rates (Assumptions Engine)
  const [showRateSettings, setShowRateSettings] = useState(false);
  const [rates, setRates] = useState({
    oxygenWorkKgPerHour: 0.082,      // Active EVA breathing rate
    oxygenRestKgPerHour: 0.035,      // Resting / habitat breathing rate
    waterWorkLitersPerHour: 0.24,     // Active work hydration & sublimator
    waterRestLitersPerHour: 0.09,     // Basic drinking & rehydration
    powerWorkKwPerCrew: 0.35,         // Suit PLSS electronics, scrubbers, pumps
    powerBaseKw: 0.60,                // Base rover / comms telemetry baseline
    metabolicSpeedSensitivity: 0.25   // Percent increase per km/h above 2.5 km/h
  });

  // Load a Preset
  const handleSelectPreset = (key) => {
    const p = PRESETS[key];
    setActivePreset(key);
    setCrewCount(p.crewCount);
    setDurationDays(p.durationDays);
    setWorkHoursPerDay(p.workHoursPerDay);
    setWalkingSpeedKmh(p.walkingSpeedKmh);
    setOxygenSupplyKg(p.oxygenSupplyKg);
    setWaterSupplyL(p.waterSupplyL);
    setBatteryCapacityKwh(p.batteryCapacityKwh);
  };

  // Reset to default
  const handleReset = () => {
    handleSelectPreset('seven_day');
  };

  // Dynamic Mathematical Model Calculations
  const simulation = useMemo(() => {
    const totalHours = durationDays * 24;
    const totalWorkHours = durationDays * workHoursPerDay;
    const totalRestHours = Math.max(0, totalHours - totalWorkHours);

    // Walking / Travel Distance
    const totalDistanceWalkedKm = Math.round(totalWorkHours * walkingSpeedKmh * 10) / 10;

    // Metabolic multiplier based on walking speed
    const speedDelta = walkingSpeedKmh - 2.5;
    const metabolicMultiplier = Math.max(0.7, 1.0 + (speedDelta * rates.metabolicSpeedSensitivity));

    // Effective hourly rates adjusted for speed
    const effectiveO2WorkRate = rates.oxygenWorkKgPerHour * metabolicMultiplier;
    const effectiveWaterWorkRate = rates.waterWorkLitersPerHour * metabolicMultiplier;

    // 1. Oxygen Calculations
    const o2ConsumedKg = crewCount * (
      (totalWorkHours * effectiveO2WorkRate) + 
      (totalRestHours * rates.oxygenRestKgPerHour)
    );
    const o2RemainingKg = Math.max(0, oxygenSupplyKg - o2ConsumedKg);
    const o2PercentRemaining = Math.max(0, (o2RemainingKg / Math.max(1, oxygenSupplyKg)) * 100);
    const hourlyO2Drain = crewCount * ((workHoursPerDay / 24) * effectiveO2WorkRate + ((24 - workHoursPerDay) / 24) * rates.oxygenRestKgPerHour);
    const o2HoursToExhaustion = oxygenSupplyKg < o2ConsumedKg 
      ? (oxygenSupplyKg / Math.max(0.001, hourlyO2Drain))
      : null;

    // 2. Water Calculations
    const waterConsumedL = crewCount * (
      (totalWorkHours * effectiveWaterWorkRate) + 
      (totalRestHours * rates.waterRestLitersPerHour)
    );
    const waterRemainingL = Math.max(0, waterSupplyL - waterConsumedL);
    const waterPercentRemaining = Math.max(0, (waterRemainingL / Math.max(1, waterSupplyL)) * 100);
    const hourlyWaterDrain = crewCount * ((workHoursPerDay / 24) * effectiveWaterWorkRate + ((24 - workHoursPerDay) / 24) * rates.waterRestLitersPerHour);
    const waterHoursToExhaustion = waterSupplyL < waterConsumedL 
      ? (waterSupplyL / Math.max(0.001, hourlyWaterDrain))
      : null;

    // 3. Battery / Electrical Energy Calculations
    const powerConsumedKwh = (totalWorkHours * (crewCount * rates.powerWorkKwPerCrew + rates.powerBaseKw)) +
                             (totalRestHours * (rates.powerBaseKw * 0.65));
    const powerRemainingKwh = Math.max(0, batteryCapacityKwh - powerConsumedKwh);
    const powerPercentRemaining = Math.max(0, (powerRemainingKwh / Math.max(1, batteryCapacityKwh)) * 100);
    const hourlyPowerDrain = (workHoursPerDay / 24) * (crewCount * rates.powerWorkKwPerCrew + rates.powerBaseKw) + ((24 - workHoursPerDay) / 24) * (rates.powerBaseKw * 0.65);
    const powerHoursToExhaustion = batteryCapacityKwh < powerConsumedKwh
      ? (batteryCapacityKwh / Math.max(0.001, hourlyPowerDrain))
      : null;

    // 4. Generate Time-series Points for Charting (e.g. 25-50 steps)
    const stepCount = Math.max(20, Math.min(60, durationDays * 4));
    const timelinePoints = [];
    for (let step = 0; step <= stepCount; step++) {
      const t = (step / stepCount) * totalHours;
      const fraction = t / totalHours;

      // Cumulative consumption at time t
      const currO2 = Math.max(0, 100 - (fraction * (o2ConsumedKg / Math.max(1, oxygenSupplyKg)) * 100));
      const currWater = Math.max(0, 100 - (fraction * (waterConsumedL / Math.max(1, waterSupplyL)) * 100));
      const currPower = Math.max(0, 100 - (fraction * (powerConsumedKwh / Math.max(1, batteryCapacityKwh)) * 100));

      timelinePoints.push({
        timeHours: t,
        sol: (t / 24.66).toFixed(1),
        o2Percent: currO2,
        waterPercent: currWater,
        batteryPercent: currPower
      });
    }

    // 5. Overall Mission Completion & Safety Verdict
    const minReserve = Math.min(o2PercentRemaining, waterPercentRemaining, powerPercentRemaining);
    const isAnyDepleted = o2PercentRemaining <= 0 || waterPercentRemaining <= 0 || powerPercentRemaining <= 0;
    const isLowMargin = minReserve < 25 && !isAnyDepleted;

    let verdict = {
      status: 'MISSION GO',
      label: 'GO: Mission Viable with Adequate Reserve Margin',
      badgeVariant: 'nominal',
      color: 'emerald',
      rationale: `All life-support consumables maintain a safe >25% reserve buffer across the entire ${durationDays}-sol mission.`
    };

    if (isAnyDepleted) {
      // Find which failed first
      let earliestFailHours = 99999;
      let failedResource = '';
      if (o2HoursToExhaustion !== null && o2HoursToExhaustion < earliestFailHours) {
        earliestFailHours = o2HoursToExhaustion;
        failedResource = 'Oxygen supply';
      }
      if (waterHoursToExhaustion !== null && waterHoursToExhaustion < earliestFailHours) {
        earliestFailHours = waterHoursToExhaustion;
        failedResource = 'Water reserves';
      }
      if (powerHoursToExhaustion !== null && powerHoursToExhaustion < earliestFailHours) {
        earliestFailHours = powerHoursToExhaustion;
        failedResource = 'Battery electrical capacity';
      }

      const failSol = (earliestFailHours / 24.66).toFixed(1);

      verdict = {
        status: 'CRITICAL ABORT',
        label: `CRITICAL ABORT: ${failedResource.toUpperCase()} DEPLETED`,
        badgeVariant: 'danger',
        color: 'rose',
        rationale: `Fatal consumable depletion! ${failedResource} is exhausted on Sol ${failSol} (${Math.round(earliestFailHours)} hours into mission). Mission cannot proceed safely.`
      };
    } else if (isLowMargin) {
      verdict = {
        status: 'CAUTION',
        label: 'CAUTION: Depleting Safety Buffer (<25% Reserve)',
        badgeVariant: 'warning',
        color: 'amber',
        rationale: `Consumables drop below the standard 25% safety margin. Any EVA delay, suit leak, or metabolic overexertion will trigger emergency abort.`
      };
    }

    return {
      totalHours,
      totalWorkHours,
      totalDistanceWalkedKm,
      metabolicMultiplier,
      o2: {
        consumed: Math.round(o2ConsumedKg * 10) / 10,
        remaining: Math.round(o2RemainingKg * 10) / 10,
        percent: o2PercentRemaining,
        hoursToExhaustion: o2HoursToExhaustion,
        isDepleted: o2PercentRemaining <= 0,
        isLow: o2PercentRemaining < 25 && o2PercentRemaining > 0
      },
      water: {
        consumed: Math.round(waterConsumedL * 10) / 10,
        remaining: Math.round(waterRemainingL * 10) / 10,
        percent: waterPercentRemaining,
        hoursToExhaustion: waterHoursToExhaustion,
        isDepleted: waterPercentRemaining <= 0,
        isLow: waterPercentRemaining < 25 && waterPercentRemaining > 0
      },
      power: {
        consumed: Math.round(powerConsumedKwh * 10) / 10,
        remaining: Math.round(powerRemainingKwh * 10) / 10,
        percent: powerPercentRemaining,
        hoursToExhaustion: powerHoursToExhaustion,
        isDepleted: powerPercentRemaining <= 0,
        isLow: powerPercentRemaining < 25 && powerPercentRemaining > 0
      },
      timelinePoints,
      verdict
    };
  }, [crewCount, durationDays, workHoursPerDay, walkingSpeedKmh, oxygenSupplyKg, waterSupplyL, batteryCapacityKwh, rates]);

  // Sync with global mission report state
  useEffect(() => {
    if (onUpdateSurvivalState && simulation) {
      onUpdateSurvivalState({
        crewCount,
        durationDays,
        workHoursPerDay,
        walkingSpeedKmh,
        totalDistanceWalkedKm: simulation.totalDistanceWalkedKm,
        o2: {
          supplied: oxygenSupplyKg,
          consumed: simulation.o2.consumed,
          remaining: simulation.o2.remaining,
          percent: simulation.o2.percent,
          isLow: simulation.o2.isLow,
          isDepleted: simulation.o2.isDepleted
        },
        water: {
          supplied: waterSupplyL,
          consumed: simulation.water.consumed,
          remaining: simulation.water.remaining,
          percent: simulation.water.percent,
          isLow: simulation.water.isLow,
          isDepleted: simulation.water.isDepleted
        },
        power: {
          supplied: batteryCapacityKwh,
          consumed: simulation.power.consumed,
          remaining: simulation.power.remaining,
          percent: simulation.power.percent,
          isLow: simulation.power.isLow,
          isDepleted: simulation.power.isDepleted
        },
        verdict: simulation.verdict
      });
    }
  }, [simulation, crewCount, durationDays, workHoursPerDay, walkingSpeedKmh, oxygenSupplyKg, waterSupplyL, batteryCapacityKwh]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-telemetry-emerald font-semibold">
              BIO-ASTRONAUTICS & LIFE SUPPORT SIMULATOR
            </span>
            <Badge variant="simulated">SIMULATION MODEL</Badge>
          </div>
          <h1 className="text-xl md:text-2xl font-display font-bold text-white tracking-wide">
            ASTRONAUT CONSUMABLE & SURVIVAL SIMULATOR
          </h1>
          <p className="text-xs md:text-sm text-slate-300 font-sans max-w-2xl">
            Simulate crew metabolic oxygen consumption, hydration demand, and battery power depletion across 1-day, 7-day, and 30-day surface exploration scenarios.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-3.5 py-2 rounded-xl bg-space-900 hover:bg-space-850 border border-space-700 text-xs font-mono font-bold text-slate-300 transition-colors flex items-center gap-2 self-start lg:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESET TO DEFAULT</span>
        </button>
      </div>

      {/* Prominent Educational Assumption Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-space-950 border border-telemetry-cyan/40 flex items-start gap-3">
        <Info className="w-5 h-5 text-telemetry-cyan shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-display font-bold text-white uppercase tracking-wider">
            ILLUSTRATIVE CONSUMPTION MODEL DISCLAIMER
          </div>
          <p className="text-slate-300 font-sans leading-relaxed">
            All metabolic rates, hydration draws, and battery models in this simulator are <strong>configurable illustrative simulation assumptions</strong> designed for mission planning simulations. They do <strong>not</strong> constitute flight-certified NASA EVA engineering specifications or biomedical medical baselines.
          </p>
        </div>
      </div>

      {/* 1-Day, 7-Day, 30-Day Scenario Selector Buttons */}
      <div className="p-4 rounded-2xl bg-space-900 border border-space-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-mars-orange" />
            <span className="font-display font-bold text-sm text-white uppercase">
              SELECT MISSION DURATION SCENARIO
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">1-CLICK CALIBRATION</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.entries(PRESETS).map(([key, p]) => {
            const isSelected = activePreset === key;
            return (
              <button
                key={key}
                onClick={() => handleSelectPreset(key)}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-space-850 border-mars-orange text-white shadow-glow-orange'
                    : 'bg-space-950/70 border-space-800 text-slate-300 hover:border-space-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-display font-bold text-sm">
                      {p.name}
                    </span>
                    <Badge variant={key === 'one_day' ? 'real' : key === 'seven_day' ? 'nominal' : 'default'}>
                      {p.durationDays} {p.durationDays === 1 ? 'SOL' : 'SOLS'}
                    </Badge>
                  </div>
                  <p className="text-xs font-sans text-slate-400 line-clamp-2">
                    {p.description}
                  </p>
                </div>
                <div className="text-[11px] font-mono text-telemetry-cyan mt-3 pt-2 border-t border-space-800 flex justify-between">
                  <span>CREW: {p.crewCount}</span>
                  <span>EVA: {p.workHoursPerDay}h/sol</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mission Completion & Warning Verdict Banner */}
      <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
        simulation.verdict.color === 'emerald'
          ? 'bg-telemetry-emerald/10 border-telemetry-emerald/40 shadow-glow-emerald'
          : simulation.verdict.color === 'rose'
          ? 'bg-telemetry-rose/15 border-telemetry-rose/60 shadow-glow-rose'
          : 'bg-telemetry-amber/10 border-telemetry-amber/40'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
              MISSION READINESS STATUS:
            </span>
            <Badge variant={simulation.verdict.badgeVariant}>
              {simulation.verdict.status}
            </Badge>
          </div>
          <div className="font-display font-bold text-white text-base">
            {simulation.verdict.label}
          </div>
          <p className="text-xs text-slate-200 font-sans">
            {simulation.verdict.rationale}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono shrink-0 border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-4">
          <div>
            <div className="text-slate-400 text-[10px] uppercase">TOTAL TRAVERSE</div>
            <div className="text-white font-bold text-sm">~{simulation.totalDistanceWalkedKm} km</div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px] uppercase">ACTIVE WORK</div>
            <div className="text-telemetry-cyan font-bold text-sm">{simulation.totalWorkHours} hrs</div>
          </div>
        </div>
      </div>

      {/* Specific Resource Deficit Warning Callouts */}
      {(simulation.o2.isDepleted || simulation.water.isDepleted || simulation.power.isDepleted) && (
        <div className="p-4 rounded-xl bg-telemetry-rose/20 border border-telemetry-rose text-white text-xs font-mono space-y-2">
          <div className="flex items-center gap-2 text-telemetry-rose font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-telemetry-rose animate-bounce" />
            <span>CRITICAL CONSUMABLE EXHAUSTION WARNINGS DETECTED:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-200">
            {simulation.o2.isDepleted && (
              <li>
                <strong>OXYGEN DEPLETION:</strong> Oxygen supply of {oxygenSupplyKg} kg is completely exhausted after ~{simulation.o2.hoursToExhaustion.toFixed(1)} hours (Sol {(simulation.o2.hoursToExhaustion / 24.66).toFixed(1)}).
              </li>
            )}
            {simulation.water.isDepleted && (
              <li>
                <strong>WATER DEPLETION:</strong> Water store of {waterSupplyL} L is exhausted after ~{simulation.water.hoursToExhaustion.toFixed(1)} hours (Sol {(simulation.water.hoursToExhaustion / 24.66).toFixed(1)}).
              </li>
            )}
            {simulation.power.isDepleted && (
              <li>
                <strong>BATTERY DEPLETION:</strong> Electrical capacity of {batteryCapacityKwh} kWh is exhausted after ~{simulation.power.hoursToExhaustion.toFixed(1)} hours.
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Interactive Resource Circular Gauges (Oxygen, Water, Power) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ResourceGauge
          name="Oxygen Supply (O₂)"
          unit="kg"
          supplied={oxygenSupplyKg}
          consumed={simulation.o2.consumed}
          remaining={simulation.o2.remaining}
          percentRemaining={simulation.o2.percent}
          hoursToExhaustion={simulation.o2.hoursToExhaustion}
          icon={Wind}
          color="cyan"
          isDepleted={simulation.o2.isDepleted}
          isLowMargin={simulation.o2.isLow}
        />

        <ResourceGauge
          name="Water Reserves (H₂O)"
          unit="L"
          supplied={waterSupplyL}
          consumed={simulation.water.consumed}
          remaining={simulation.water.remaining}
          percentRemaining={simulation.water.percent}
          hoursToExhaustion={simulation.water.hoursToExhaustion}
          icon={Droplets}
          color="emerald"
          isDepleted={simulation.water.isDepleted}
          isLowMargin={simulation.water.isLow}
        />

        <ResourceGauge
          name="Battery Energy Store"
          unit="kWh"
          supplied={batteryCapacityKwh}
          consumed={simulation.power.consumed}
          remaining={simulation.power.remaining}
          percentRemaining={simulation.power.percent}
          hoursToExhaustion={simulation.power.hoursToExhaustion}
          icon={Zap}
          color="orange"
          isDepleted={simulation.power.isDepleted}
          isLowMargin={simulation.power.isLow}
        />
      </div>

      {/* Interactive Time-series Depletion Timeline Chart */}
      <ResourceTimelineChart
        durationDays={durationDays}
        timelinePoints={simulation.timelinePoints}
        safetyThreshold={25}
      />

      {/* Mission Parameter Sliders & Supply Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Operational Mission Sliders */}
        <div className="p-5 rounded-2xl bg-space-900 border border-space-800 space-y-4">
          <div className="flex items-center justify-between border-b border-space-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-mars-orange" />
              <h3 className="font-display font-bold text-sm text-white uppercase">
                OPERATIONAL MISSION CONFIGURATION
              </h3>
            </div>
            <Badge variant="real">CREW & DURATION</Badge>
          </div>

          <div className="space-y-4 text-xs font-mono">
            {/* Crew count */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Number of Astronauts:</span>
                <span className="text-white font-bold">{crewCount} Crew Members</span>
              </div>
              <input
                type="range"
                min="1"
                max="6"
                step="1"
                value={crewCount}
                onChange={(e) => setCrewCount(parseInt(e.target.value, 10))}
                className="w-full accent-mars-orange h-1.5 bg-space-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1 Astronaut (Solo)</span>
                <span>4 Astronauts (Nominal)</span>
                <span>6 Astronauts (Max)</span>
              </div>
            </div>

            {/* Mission duration in Sols/Days */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Mission Duration:</span>
                <span className="text-white font-bold">{durationDays} Sols ({durationDays * 24} hours)</span>
              </div>
              <input
                type="range"
                min="1"
                max="45"
                step="1"
                value={durationDays}
                onChange={(e) => setDurationDays(parseInt(e.target.value, 10))}
                className="w-full accent-mars-orange h-1.5 bg-space-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1 Sol</span>
                <span>7 Sols (Expedition)</span>
                <span>30 Sols (Outpost)</span>
                <span>45 Sols</span>
              </div>
            </div>

            {/* Daily EVA Work Hours */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Mission Work Time:</span>
                <span className="text-white font-bold">{workHoursPerDay} Hours / Sol</span>
              </div>
              <input
                type="range"
                min="2"
                max="14"
                step="1"
                value={workHoursPerDay}
                onChange={(e) => setWorkHoursPerDay(parseInt(e.target.value, 10))}
                className="w-full accent-telemetry-cyan h-1.5 bg-space-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>2 hrs (Light sortie)</span>
                <span>6-8 hrs (Standard EVA)</span>
                <span>14 hrs (High exertion)</span>
              </div>
            </div>

            {/* Walking speed */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Walking Speed (Surface 0.38g):</span>
                <span className="text-white font-bold">{walkingSpeedKmh.toFixed(1)} km/h</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.1"
                value={walkingSpeedKmh}
                onChange={(e) => setWalkingSpeedKmh(parseFloat(e.target.value))}
                className="w-full accent-telemetry-emerald h-1.5 bg-space-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1.0 km/h (Slow scarp)</span>
                <span>2.5 km/h (Nominal pace)</span>
                <span>5.0 km/h (Power trot)</span>
              </div>
              {walkingSpeedKmh > 3.0 && (
                <div className="text-[11px] text-telemetry-amber font-sans">
                  ⚠ High walking speed increases metabolic rate by {Math.round((simulation.metabolicMultiplier - 1) * 100)}%!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Initial Supply Stores Configuration */}
        <div className="p-5 rounded-2xl bg-space-900 border border-space-800 space-y-4">
          <div className="flex items-center justify-between border-b border-space-800 pb-3">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-telemetry-cyan" />
              <h3 className="font-display font-bold text-sm text-white uppercase">
                INITIAL SUPPLY STORES & CAPACITIES
              </h3>
            </div>
            <Badge variant="real">STORE CAPACITIES</Badge>
          </div>

          <div className="space-y-4 text-xs font-mono">
            {/* Oxygen Store */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Oxygen Supply:</span>
                <span className="text-white font-bold">{oxygenSupplyKg} kg O₂</span>
              </div>
              <input
                type="range"
                min="1"
                max="300"
                step="1"
                value={oxygenSupplyKg}
                onChange={(e) => setOxygenSupplyKg(parseFloat(e.target.value))}
                className="w-full accent-telemetry-cyan h-1.5 bg-space-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1 kg (Suit pack)</span>
                <span>50 kg</span>
                <span>150 kg</span>
                <span>300 kg (Habitat)</span>
              </div>
            </div>

            {/* Water Store */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Water Supply:</span>
                <span className="text-white font-bold">{waterSupplyL} Liters H₂O</span>
              </div>
              <input
                type="range"
                min="5"
                max="800"
                step="5"
                value={waterSupplyL}
                onChange={(e) => setWaterSupplyL(parseFloat(e.target.value))}
                className="w-full accent-telemetry-emerald h-1.5 bg-space-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>5 L</span>
                <span>100 L (Rover)</span>
                <span>400 L</span>
                <span>800 L (Habitat)</span>
              </div>
            </div>

            {/* Battery Capacity */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Battery Capacity:</span>
                <span className="text-white font-bold">{batteryCapacityKwh} kWh</span>
              </div>
              <input
                type="range"
                min="5"
                max="600"
                step="5"
                value={batteryCapacityKwh}
                onChange={(e) => setBatteryCapacityKwh(parseFloat(e.target.value))}
                className="w-full accent-mars-amber h-1.5 bg-space-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>5 kWh</span>
                <span>50 kWh</span>
                <span>200 kWh</span>
                <span>600 kWh</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Consumption Rates Drawer (Configurable Assumptions Engine) */}
      <div className="rounded-2xl bg-space-900 border border-space-800 overflow-hidden">
        <button
          onClick={() => setShowRateSettings(!showRateSettings)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-space-850/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-telemetry-cyan" />
            <div>
              <span className="font-display font-bold text-sm text-white uppercase">
                ADVANCED CONSUMPTION RATE ASSUMPTIONS
              </span>
              <p className="text-[11px] text-slate-400 font-sans">
                Customize the baseline hourly breathing, hydration, and electrical load rates.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-telemetry-cyan">
            <span>{showRateSettings ? 'HIDE SETTINGS' : 'EDIT CONSUMPTION RATES'}</span>
            {showRateSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showRateSettings && (
          <div className="p-5 border-t border-space-800 bg-space-950 space-y-4">
            <div className="p-3 rounded-lg bg-space-900/80 border border-space-800 text-[11px] text-slate-300 font-sans">
              <strong>Simulated Model Assumptions:</strong> Customize the illustrative rate coefficients below to experiment with closed-loop efficiency, metabolic workloads, and suit thermal subsystems.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-space-900 border border-space-800 space-y-1">
                <span className="text-slate-400">EVA Work O₂ Rate:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.005"
                    min="0.04"
                    max="0.20"
                    value={rates.oxygenWorkKgPerHour}
                    onChange={(e) => setRates(prev => ({ ...prev, oxygenWorkKgPerHour: parseFloat(e.target.value) }))}
                    className="w-full px-2 py-1 rounded bg-space-950 border border-space-700 text-white font-bold"
                  />
                  <span className="text-slate-400 shrink-0">kg/hr/crew</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-space-900 border border-space-800 space-y-1">
                <span className="text-slate-400">EVA Work H₂O Rate:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0.10"
                    max="0.80"
                    value={rates.waterWorkLitersPerHour}
                    onChange={(e) => setRates(prev => ({ ...prev, waterWorkLitersPerHour: parseFloat(e.target.value) }))}
                    className="w-full px-2 py-1 rounded bg-space-950 border border-space-700 text-white font-bold"
                  />
                  <span className="text-slate-400 shrink-0">L/hr/crew</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-space-900 border border-space-800 space-y-1">
                <span className="text-slate-400">Suit Power Load:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.05"
                    min="0.10"
                    max="1.50"
                    value={rates.powerWorkKwPerCrew}
                    onChange={(e) => setRates(prev => ({ ...prev, powerWorkKwPerCrew: parseFloat(e.target.value) }))}
                    className="w-full px-2 py-1 rounded bg-space-950 border border-space-700 text-white font-bold"
                  />
                  <span className="text-slate-400 shrink-0">kW/crew</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
