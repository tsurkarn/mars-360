import React from 'react';
import { 
  GitCompare, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ArrowRight, 
  Scale, 
  HelpCircle,
  XCircle,
  Zap,
  Wind
} from 'lucide-react';
import Badge from '../common/Badge';

export default function RouteComparator({ 
  routeA, 
  routeB, 
  analysisA, 
  analysisB, 
  onSelectRoute,
  onClose
}) {
  return (
    <div className="rounded-2xl bg-space-900 border border-space-700 shadow-2xl p-5 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-space-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-mars-orange" />
            <h2 className="font-display font-bold text-lg text-white">
              MARSWALK ROUTE COMPARISON ENGINE
            </h2>
            <Badge variant="real">SAFETY DECISION MATRIX</Badge>
          </div>
          <p className="text-xs text-slate-300 font-sans mt-0.5">
            Comparative analysis of two candidate traverses across terrain slopes, life-support demand, and resolution confidence.
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-space-850 hover:bg-space-800 text-xs font-mono text-slate-300 hover:text-white"
          >
            [CLOSE COMPARISON]
          </button>
        )}
      </div>

      {/* Critical Aerospace Rule Callout */}
      <div className="p-4 rounded-xl bg-space-950 border border-mars-orange/40 space-y-2">
        <div className="flex items-center gap-2 text-mars-orange font-mono text-xs font-bold uppercase">
          <AlertTriangle className="w-4 h-4 text-mars-orange" />
          <span>AEROSPACE RULE: NEVER EQUATE SHORT DISTANCE WITH SAFETY</span>
        </div>
        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          In planetary exploration, distance is secondary to slope stability and surface roughness. A route that cuts directly up a steep crater rim or delta scarp may be shorter in distance, but introduces catastrophic tumbling, fatigue, and suit puncture hazards. Gentle detours with higher consumable margins and verified high-resolution imagery are consistently favored by flight controllers.
        </p>
      </div>

      {/* Side-by-Side Comparison Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Route A Card */}
        <div className={`p-5 rounded-xl border space-y-4 ${
          analysisA.safetyVerdict.status === 'NO-GO'
            ? 'bg-space-950/70 border-telemetry-rose/50 shadow-glow-rose'
            : 'bg-space-950 border-space-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400">PROPOSED OPTION A</span>
            <Badge variant={analysisA.safetyVerdict.badgeVariant}>
              {analysisA.safetyVerdict.status}
            </Badge>
          </div>

          <h3 className="font-display font-bold text-white text-base">
            {routeA.name}
          </h3>
          <p className="text-xs text-slate-400 font-sans">
            {routeA.description}
          </p>

          <div className="space-y-2 text-xs font-mono divide-y divide-space-800/60 pt-2">
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Total Distance:</span>
              <span className="text-white font-bold">{analysisA.totalDistanceMeters.toLocaleString()} m</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Estimated Duration:</span>
              <span className="text-white font-bold">{analysisA.totalDurationMinutes} min</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Max Terrain Slope:</span>
              <span className={`font-bold ${analysisA.maxSlopeDeg > 15 ? 'text-telemetry-rose' : analysisA.maxSlopeDeg > 8 ? 'text-telemetry-amber' : 'text-telemetry-emerald'}`}>
                {analysisA.maxSlopeDeg}° {analysisA.maxSlopeDeg > 15 && '(HAZARDOUS)'}
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Elevation Gain:</span>
              <span className="text-slate-200">+{analysisA.elevationGainMeters} m</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Oxygen Consumption:</span>
              <span className={`font-bold ${analysisA.o2PercentOfTank > 65 ? 'text-telemetry-rose' : 'text-telemetry-emerald'}`}>
                {analysisA.o2PercentOfTank}% of tank
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Coverage Certainty:</span>
              <span className={analysisA.hasLowResWarning ? 'text-telemetry-amber' : 'text-telemetry-emerald'}>
                {analysisA.hasLowResWarning ? 'Low (MOLA 463m)' : 'High (HiRISE 0.25m)'}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-space-900 border border-space-800 text-xs font-sans text-slate-300">
            <strong>Decision Rationale:</strong> {analysisA.safetyVerdict.rationale}
          </div>

          <button
            onClick={() => onSelectRoute('A')}
            className="w-full py-2.5 rounded-xl bg-space-850 hover:bg-space-800 border border-space-700 text-xs font-mono font-bold text-white transition-colors"
          >
            SELECT ROUTE A AS ACTIVE
          </button>
        </div>

        {/* Route B Card */}
        <div className={`p-5 rounded-xl border space-y-4 ${
          analysisB.safetyVerdict.status === 'GO'
            ? 'bg-space-950/70 border-telemetry-emerald/50 shadow-glow-emerald'
            : 'bg-space-950 border-space-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400">PROPOSED OPTION B</span>
            <Badge variant={analysisB.safetyVerdict.badgeVariant}>
              {analysisB.safetyVerdict.status}
            </Badge>
          </div>

          <h3 className="font-display font-bold text-white text-base">
            {routeB.name}
          </h3>
          <p className="text-xs text-slate-400 font-sans">
            {routeB.description}
          </p>

          <div className="space-y-2 text-xs font-mono divide-y divide-space-800/60 pt-2">
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Total Distance:</span>
              <span className="text-white font-bold">{analysisB.totalDistanceMeters.toLocaleString()} m</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Estimated Duration:</span>
              <span className="text-white font-bold">{analysisB.totalDurationMinutes} min</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Max Terrain Slope:</span>
              <span className={`font-bold ${analysisB.maxSlopeDeg > 15 ? 'text-telemetry-rose' : analysisB.maxSlopeDeg > 8 ? 'text-telemetry-amber' : 'text-telemetry-emerald'}`}>
                {analysisB.maxSlopeDeg}° {analysisB.maxSlopeDeg <= 8 && '(NOMINAL)'}
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Elevation Gain:</span>
              <span className="text-slate-200">+{analysisB.elevationGainMeters} m</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Oxygen Consumption:</span>
              <span className={`font-bold ${analysisB.o2PercentOfTank > 65 ? 'text-telemetry-rose' : 'text-telemetry-emerald'}`}>
                {analysisB.o2PercentOfTank}% of tank
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Coverage Certainty:</span>
              <span className={analysisB.hasLowResWarning ? 'text-telemetry-amber' : 'text-telemetry-emerald'}>
                {analysisB.hasLowResWarning ? 'Low (MOLA 463m)' : 'High (HiRISE 0.25m)'}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-space-900 border border-space-800 text-xs font-sans text-slate-300">
            <strong>Decision Rationale:</strong> {analysisB.safetyVerdict.rationale}
          </div>

          <button
            onClick={() => onSelectRoute('B')}
            className="w-full py-2.5 rounded-xl bg-mars-orange hover:bg-mars-rust text-white text-xs font-mono font-bold transition-colors shadow-glow-orange"
          >
            SELECT ROUTE B AS ACTIVE
          </button>
        </div>
      </div>
    </div>
  );
}
