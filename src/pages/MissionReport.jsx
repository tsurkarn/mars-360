import React from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  Database, 
  Compass, 
  Layers, 
  Award,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Scale,
  MapPin,
  Clock,
  Wind,
  Droplets,
  Zap,
  Mountain,
  Satellite,
  Info
} from 'lucide-react';
import Badge from '../components/common/Badge';
import { 
  MARS_PLANETARY_CONSTANTS, 
  SIMULATED_MISSION_DATA, 
  MARS_LANDMARKS 
} from '../data/marsData';

export default function MissionReport({ activeRoute, activeSurvival, onNavigate }) {
  // Use passed activeRoute or fallback to baseline
  const route = activeRoute || {
    name: 'Route 1: Delta Meander Detour (Longer, but Low Slope)',
    description: 'Circumnavigates the western delta front along gentle sedimentary benches. Verified by 0.25m HiRISE imagery.',
    totalDistanceMeters: 4250,
    estimatedDurationMinutes: 195,
    maxSlopeDeg: 3.8,
    elevationGainMeters: 79,
    hasLowResWarning: false,
    safetyVerdict: {
      status: 'GO',
      label: 'GO: Nominal Traverse',
      badgeVariant: 'nominal',
      rationale: 'Slope gradients remain below 8°. Adequate 40%+ oxygen margin and high-resolution terrain coverage verified.'
    },
    waypoints: [
      { id: 'wp-1', name: 'Base Alpha Airlock', coords: [77.4200, 18.3800], elevation: -2594, type: 'start' },
      { id: 'wp-2', name: 'Lower Fan Sand Bench', coords: [77.4350, 18.3920], elevation: -2575, type: 'waypoint' },
      { id: 'wp-3', name: 'Meander Ridge Transition', coords: [77.4520, 18.4100], elevation: -2548, type: 'waypoint' },
      { id: 'wp-4', name: 'Kodiak Butte Viewpoint', coords: [77.4700, 18.4250], elevation: -2532, type: 'waypoint' },
      { id: 'wp-5', name: 'Sampling Station Delta-4', coords: [77.4850, 18.4400], elevation: -2515, type: 'destination' }
    ]
  };

  // Use passed activeSurvival or fallback to baseline
  const survival = activeSurvival || {
    crewCount: 4,
    durationDays: 7,
    workHoursPerDay: 6,
    walkingSpeedKmh: 2.5,
    totalDistanceWalkedKm: 105.0,
    o2: { supplied: 32.0, consumed: 24.8, remaining: 7.2, percent: 22.5, isLow: true, isDepleted: false },
    water: { supplied: 110.0, consumed: 72.8, remaining: 37.2, percent: 33.8, isLow: false, isDepleted: false },
    power: { supplied: 90.0, consumed: 62.4, remaining: 27.6, percent: 30.7, isLow: false, isDepleted: false },
    verdict: {
      status: 'CAUTION',
      label: 'CAUTION: Depleting Safety Buffer (<25% Reserve)',
      badgeVariant: 'warning',
      rationale: 'Oxygen buffer drops to 22.5% (<25% threshold). Any EVA delay or leak requires immediate abort.'
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const reportData = {
      project: "MARS 360",
      challenge: "2026 NASA Space Apps Challenge",
      generatedAt: new Date().toISOString(),
      reportId: `M360-REP-${Date.now()}`,
      missionTag: SIMULATED_MISSION_DATA.missionTag,
      activeTraverse: {
        name: route.name,
        distanceMeters: route.totalDistanceMeters,
        durationMinutes: route.estimatedDurationMinutes,
        maxSlopeDeg: route.maxSlopeDeg,
        safetyStatus: route.safetyVerdict?.status,
        waypoints: route.waypoints
      },
      lifeSupportSimulation: {
        crewSize: survival.crewCount,
        durationSols: survival.durationDays,
        oxygenKg: { supplied: survival.o2.supplied, consumed: survival.o2.consumed, remaining: survival.o2.remaining, percent: survival.o2.percent },
        waterLiters: { supplied: survival.water.supplied, consumed: survival.water.consumed, remaining: survival.water.remaining, percent: survival.water.percent },
        batteryKwh: { supplied: survival.power.supplied, consumed: survival.power.consumed, remaining: survival.power.remaining, percent: survival.power.percent },
        readinessStatus: survival.verdict?.status
      },
      methodologyProvenance: {
        tier1_measuredNASAData: [
          "Mars Volumetric Mean Radius: 3,389.5 km",
          "Surface Gravity: 3.721 m/s²",
          "Mean Surface Pressure: 610 Pa (6.10 mbar)",
          "Atmosphere CO2 Fraction: 95.32%",
          "MOLA Laser Altimetry Elevation Baselines",
          "HiRISE 0.25m / CTX 6m / THEMIS IR Satellite Imagery (NASA Mars Trek WMTS)"
        ],
        tier2_derivedCalculations: [
          "Mars Spherical Great-Circle Geodesy (Haversine)",
          "Segment Elevation Gradients & Slope Inclination θ = atan(Δh / d)",
          "Metabolic Pacing Multipliers under 0.38g gravity",
          "Consumables Depletion Integral"
        ],
        tier3_simulatedAssumptions: [
          "Configurable Illustrative EVA Consumption Rates",
          "Planned Traverse Station Coordinates (WP-1..WP-5)",
          "Suit Battery & Portable Life Support Storage Limits"
        ]
      }
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MARS-360-MISSION-DEBRIEF-SOL-${SIMULATED_MISSION_DATA.currentSol}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-telemetry-cyan font-semibold">
              MISSION DEBRIEF & METHODOLOGY PROVENANCE
            </span>
            <Badge variant="real">CERTIFIED DOSSIER</Badge>
          </div>
          <h1 className="text-xl md:text-2xl font-display font-bold text-white tracking-wide">
            MARS 360 COMPREHENSIVE MISSION REPORT
          </h1>
          <p className="text-xs md:text-sm text-slate-300 font-sans max-w-2xl">
            Synthesized operational summary of active planned traverse routes, terrain constraints, environmental evidence, life-support consumables, and methodology certification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            className="px-3.5 py-2 rounded-xl bg-space-900 hover:bg-space-850 border border-space-700 text-xs font-mono font-bold text-slate-200 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-mars-orange" />
            <span>EXPORT JSON</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-mars-orange hover:bg-mars-rust text-white text-xs font-mono font-bold transition-colors flex items-center gap-2 shadow-glow-orange"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINT REPORT</span>
          </button>
        </div>
      </div>

      {/* Main Report Document Panel */}
      <div className="rounded-2xl bg-space-900 border border-space-800 p-6 lg:p-8 space-y-8 shadow-panel">
        {/* Document Header Banner */}
        <div className="border-b border-space-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono text-mars-orange font-bold uppercase tracking-widest flex items-center gap-2">
              <span>2026 NASA SPACE APPS CHALLENGE</span>
              <span>•</span>
              <span>PROJECT MARS 360</span>
            </div>
            <h2 className="text-2xl font-display font-bold text-white mt-1">
              OPERATIONAL TRAVERSE & CONSUMABLE DEBRIEF
            </h2>
            <div className="text-xs font-mono text-slate-400 mt-1 flex flex-wrap gap-4">
              <span>MISSION TAG: <strong className="text-white">{SIMULATED_MISSION_DATA.missionTag}</strong></span>
              <span>SOL: <strong className="text-mars-orange">{SIMULATED_MISSION_DATA.currentSol}</strong></span>
              <span>SITE: <strong className="text-telemetry-cyan">{SIMULATED_MISSION_DATA.primarySite}</strong></span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-space-950 border border-space-800 text-right font-mono text-xs shrink-0">
            <div className="text-slate-500 text-[10px] uppercase">READINESS VERDICT</div>
            <div className="flex items-center justify-end gap-1.5 mt-0.5">
              <Badge variant={survival.verdict?.badgeVariant || 'nominal'}>
                {survival.verdict?.status || 'MISSION GO'}
              </Badge>
            </div>
          </div>
        </div>

        {/* 1. ROUTE, DISTANCE & WAYPOINT MANIFEST */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-space-800 pb-2">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-mars-orange" />
              <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                1. PLANNED MARSWALK TRAVERSE & GEODESY
              </h3>
            </div>
            {onNavigate && (
              <button
                onClick={() => onNavigate('routes')}
                className="text-xs font-mono text-telemetry-cyan hover:underline"
              >
                EDIT ROUTE →
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-space-950 border border-space-800 space-y-1">
              <span className="text-slate-400 text-[10px]">TOTAL DISTANCE:</span>
              <div className="text-base font-bold text-white">
                {route.totalDistanceMeters.toLocaleString()} METERS
              </div>
              <div className="text-[10px] text-slate-500 font-sans">Mars Radius 3,389.5 km Geodesy</div>
            </div>

            <div className="p-3 rounded-xl bg-space-950 border border-space-800 space-y-1">
              <span className="text-slate-400 text-[10px]">ESTIMATED DURATION:</span>
              <div className="text-base font-bold text-telemetry-cyan">
                {route.estimatedDurationMinutes} MINUTES
              </div>
              <div className="text-[10px] text-slate-500 font-sans">Includes 15m stops / station</div>
            </div>

            <div className="p-3 rounded-xl bg-space-950 border border-space-800 space-y-1">
              <span className="text-slate-400 text-[10px]">MAX INCLINATION:</span>
              <div className={`text-base font-bold ${route.maxSlopeDeg > 15 ? 'text-telemetry-rose' : 'text-telemetry-emerald'}`}>
                {route.maxSlopeDeg}° {route.maxSlopeDeg > 15 && '(EXTREME)'}
              </div>
              <div className="text-[10px] text-slate-500 font-sans">MOLA 128 ppd DEM datum</div>
            </div>

            <div className="p-3 rounded-xl bg-space-950 border border-space-800 space-y-1">
              <span className="text-slate-400 text-[10px]">TRAVERSE SAFETY VERDICT:</span>
              <div>
                <Badge variant={route.safetyVerdict?.badgeVariant || 'nominal'}>
                  {route.safetyVerdict?.status || 'GO'}
                </Badge>
              </div>
              <div className="text-[10px] text-slate-500 font-sans truncate">{route.safetyVerdict?.label}</div>
            </div>
          </div>

          {/* Waypoints breakdown list */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-space-800 text-slate-500 uppercase text-[10px]">
                  <th className="py-2 px-3">ROLE</th>
                  <th className="py-2 px-3">WAYPOINT NAME</th>
                  <th className="py-2 px-3">COORDINATES</th>
                  <th className="py-2 px-3">ELEVATION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-space-800/60">
                {route.waypoints.map((wp, idx) => (
                  <tr key={wp.id} className="hover:bg-space-850/40">
                    <td className="py-2 px-3">
                      <Badge variant={idx === 0 ? 'nominal' : idx === route.waypoints.length - 1 ? 'danger' : 'default'}>
                        {idx === 0 ? 'START' : idx === route.waypoints.length - 1 ? 'DEST' : `WP-${idx}`}
                      </Badge>
                    </td>
                    <td className="py-2 px-3 font-sans font-medium text-slate-200">
                      {wp.name}
                    </td>
                    <td className="py-2 px-3 text-slate-400">
                      {wp.coords[1].toFixed(4)}° N, {wp.coords[0].toFixed(4)}° E
                    </td>
                    <td className="py-2 px-3 text-white font-bold">
                      {wp.elevation} m
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. TERRAIN LIMITATIONS & UNCERTAINTY ANALYSIS */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-space-800 pb-2">
            <Mountain className="w-4 h-4 text-telemetry-amber" />
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              2. TERRAIN LIMITATIONS & IMAGE RESOLUTION UNCERTAINTY
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            <div className="p-4 rounded-xl bg-space-950 border border-space-800 space-y-2">
              <div className="font-display font-bold text-white flex items-center gap-2">
                <span>Steep Terrain & Slope Hazard Classification</span>
                <Badge variant={route.maxSlopeDeg > 15 ? 'danger' : 'nominal'}>
                  {route.maxSlopeDeg > 15 ? 'CRITICAL SLOPE' : 'NOMINAL INCLINE'}
                </Badge>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Slopes greater than 15° present severe EVA suit traction loss, scree slippage, and rover rollover risks. Route planning rules strictly prohibit classifying a route as "safe" purely because it is short. The active traverse maintains a peak slope of <strong>{route.maxSlopeDeg}°</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-space-950 border border-space-800 space-y-2">
              <div className="font-display font-bold text-white flex items-center gap-2">
                <span>Orbital Altimetry & Resolution Limitations</span>
                <Badge variant={route.hasLowResWarning ? 'warning' : 'real'}>
                  {route.hasLowResWarning ? 'MOLA UNCERTAINTY' : 'HiRISE 0.25m VERIFIED'}
                </Badge>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {route.hasLowResWarning
                  ? 'Caution: Portions of this route traverse regional MOLA 463m/pixel altimetry outside HiRISE/CTX footprints. Sub-kilometer hazards (boulders <400m, fissures, and loose sand traps) cannot be resolved from orbit.'
                  : 'High Confidence: Traversed corridors fall within NASA MRO HiRISE (0.25m/pixel) and CTX (6.0m/pixel) coverage. Meter-scale boulder fields, sand ripple crests, and scarp talus are verified.'}
              </p>
            </div>
          </div>
        </div>

        {/* 3. ENVIRONMENTAL EVIDENCE & IN-SITU OBSERVATIONS */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-space-800 pb-2">
            <Layers className="w-4 h-4 text-telemetry-cyan" />
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              3. ENVIRONMENTAL EVIDENCE & ASTROBIOLOGICAL CONTEXT
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-space-950 border border-space-800 space-y-1.5 font-sans">
              <div className="font-display font-bold text-white">Deltaic Sedimentology</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Layered bottomset and topset mudstone benches confirmed at Jezero fan front, indicating sustained lacustrine river deposition during the Noachian–Hesperian epoch (~3.7 Ga).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-space-950 border border-space-800 space-y-1.5 font-sans">
              <div className="font-display font-bold text-white">Phyllosilicate Clays</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Spectral smectite and iron/magnesium carbonate signatures identified in proximity to Kodiak Butte, signifying optimal biosignature preservation taphonomy.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-space-950 border border-space-800 space-y-1.5 font-sans">
              <div className="font-display font-bold text-white">Atmospheric In-Situ Baseline</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Surface pressure verified at 610 Pa (0.6% Earth sea-level). Diurnal thermal swings of -140°C to +20°C require continuous closed-loop EVA thermal conditioning.
              </p>
            </div>
          </div>
        </div>

        {/* 4. LIFE SUPPORT CONSUMABLES & REMAINING RESOURCES */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-space-800 pb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-telemetry-emerald" />
              <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                4. CONSUMABLE CONSUMPTION & REMAINING RESOURCES
              </h3>
            </div>
            {onNavigate && (
              <button
                onClick={() => onNavigate('survival')}
                className="text-xs font-mono text-telemetry-cyan hover:underline"
              >
                CONFIGURE SIMULATOR →
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            {/* Oxygen */}
            <div className="p-4 rounded-xl bg-space-950 border border-space-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-telemetry-cyan" />
                  OXYGEN SUPPLY (O₂)
                </span>
                <Badge variant={survival.o2.isDepleted ? 'danger' : survival.o2.isLow ? 'warning' : 'nominal'}>
                  {survival.o2.percent.toFixed(1)}% LEFT
                </Badge>
              </div>
              <div className="space-y-1 text-slate-400">
                <div className="flex justify-between"><span>Supplied:</span><span className="text-white">{survival.o2.supplied} kg</span></div>
                <div className="flex justify-between"><span>Consumed:</span><span className="text-white">{survival.o2.consumed} kg</span></div>
                <div className="flex justify-between border-t border-space-800 pt-1 font-bold"><span>Remaining:</span><span className="text-telemetry-cyan">{survival.o2.remaining} kg</span></div>
              </div>
            </div>

            {/* Water */}
            <div className="p-4 rounded-xl bg-space-950 border border-space-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-telemetry-emerald" />
                  WATER STORES (H₂O)
                </span>
                <Badge variant={survival.water.isDepleted ? 'danger' : survival.water.isLow ? 'warning' : 'nominal'}>
                  {survival.water.percent.toFixed(1)}% LEFT
                </Badge>
              </div>
              <div className="space-y-1 text-slate-400">
                <div className="flex justify-between"><span>Supplied:</span><span className="text-white">{survival.water.supplied} L</span></div>
                <div className="flex justify-between"><span>Consumed:</span><span className="text-white">{survival.water.consumed} L</span></div>
                <div className="flex justify-between border-t border-space-800 pt-1 font-bold"><span>Remaining:</span><span className="text-telemetry-emerald">{survival.water.remaining} L</span></div>
              </div>
            </div>

            {/* Battery */}
            <div className="p-4 rounded-xl bg-space-950 border border-space-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-mars-amber" />
                  ELECTRICAL BATTERY
                </span>
                <Badge variant={survival.power.isDepleted ? 'danger' : survival.power.isLow ? 'warning' : 'nominal'}>
                  {survival.power.percent.toFixed(1)}% LEFT
                </Badge>
              </div>
              <div className="space-y-1 text-slate-400">
                <div className="flex justify-between"><span>Capacity:</span><span className="text-white">{survival.power.supplied} kWh</span></div>
                <div className="flex justify-between"><span>Consumed:</span><span className="text-white">{survival.power.consumed} kWh</span></div>
                <div className="flex justify-between border-t border-space-800 pt-1 font-bold"><span>Remaining:</span><span className="text-mars-amber">{survival.power.remaining} kWh</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. VISIBLE DATA SOURCES & METHODOLOGY PROVENANCE (THREE TIERS) */}
        <div className="space-y-4 pt-4 border-t border-space-800">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-telemetry-cyan" />
            <div>
              <h3 className="font-display font-bold text-base text-white uppercase tracking-wider">
                5. DATA SOURCES & SCIENTIFIC METHODOLOGY PROVENANCE
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Rigorous scientific categorization distinguishing measured NASA ground truth from mathematical derivations and simulation models.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs font-mono">
            {/* TIER 1: MEASURED NASA DATA */}
            <div className="p-5 rounded-2xl bg-space-950 border border-telemetry-cyan/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-telemetry-cyan text-sm uppercase">
                  TIER 1: MEASURED NASA DATA
                </span>
                <Badge variant="real">GROUND TRUTH</Badge>
              </div>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                Direct in-situ observations and calibrated orbital spacecraft measurements:
              </p>
              <ul className="space-y-1.5 text-slate-200 text-[11px] list-disc list-inside">
                <li><strong>Volumetric Radius:</strong> 3,389.5 km (NASA Mars Fact Sheet)</li>
                <li><strong>Surface Gravity:</strong> 3.721 m/s² (0.379 g)</li>
                <li><strong>Atmospheric Pressure:</strong> 610 Pa (Viking & MSL in-situ)</li>
                <li><strong>Gas Fractions:</strong> 95.32% CO₂, 2.60% N₂, 1.90% Ar (SAM)</li>
                <li><strong>Orbital Altimetry:</strong> MOLA Laser Altimeter 128 ppd datum</li>
                <li><strong>Satellite Imagery:</strong> MRO HiRISE (0.25m), CTX (6m), THEMIS IR (100m) via NASA Mars Trek WMTS</li>
              </ul>
            </div>

            {/* TIER 2: DERIVED CALCULATIONS */}
            <div className="p-5 rounded-2xl bg-space-950 border border-telemetry-emerald/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-telemetry-emerald text-sm uppercase">
                  TIER 2: DERIVED CALCULATIONS
                </span>
                <Badge variant="nominal">GEODESY</Badge>
              </div>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                Physically grounded mathematical formulas applied to Martian coordinates:
              </p>
              <ul className="space-y-1.5 text-slate-200 text-[11px] list-disc list-inside">
                <li><strong>Mars Geodesy:</strong> Spherical Haversine distance using R = 3,389.5 km</li>
                <li><strong>Terrain Slope Angle:</strong> θ = arctan(ΔElevation / Distance)</li>
                <li><strong>Cumulative Traverse Distance:</strong> Segment summation across waypoints</li>
                <li><strong>Metabolic Pacing:</strong> Multiplier M_speed scaling with surface velocity</li>
                <li><strong>Consumable Depletion:</strong> Integration over active work vs resting cycles</li>
              </ul>
            </div>

            {/* TIER 3: SIMULATED ASSUMPTIONS */}
            <div className="p-5 rounded-2xl bg-space-950 border border-mars-orange/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-mars-orange text-sm uppercase">
                  TIER 3: SIMULATED ASSUMPTIONS
                </span>
                <Badge variant="simulated">ILLUSTRATIVE</Badge>
              </div>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                Pedagogical educational models configured for the Space Apps Challenge:
              </p>
              <ul className="space-y-1.5 text-slate-200 text-[11px] list-disc list-inside">
                <li><strong>EVA Waypoint Stations:</strong> WP-1 to WP-5 planning points</li>
                <li><strong>PLSS Suit Tank Sizing:</strong> 3.5 kg O₂ / 9 L H₂O / 12 kWh</li>
                <li><strong>Baseline Consumption Rates:</strong> 0.082 kg/hr O₂, 0.24 L/hr H₂O</li>
                <li><strong>25% Safety Reserve Margin:</strong> Abort buffer threshold</li>
                <li><em>Disclaimer: Illustrative approximations, not flight-certified specs</em></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Space Apps Challenge Submission Footer */}
        <div className="pt-6 border-t border-space-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-mars-orange" />
            <span>2026 NASA SPACE APPS CHALLENGE • MARS EXPLORATION CHALLENGE</span>
          </div>
          <div>
            SUBMITTED BY: <span className="text-white font-bold">TEAM MARS 360</span>
          </div>
        </div>
      </div>
    </div>
  );
}
