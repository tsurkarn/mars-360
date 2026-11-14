import React from 'react';
import { AlertTriangle, CheckCircle2, AlertOctagon } from 'lucide-react';
import Badge from '../common/Badge';

export default function ResourceGauge({
  name,
  unit,
  supplied,
  consumed,
  remaining,
  percentRemaining,
  hoursToExhaustion,
  icon: Icon,
  color = 'cyan', // 'cyan', 'emerald', 'amber', 'rose'
  isDepleted = false,
  isLowMargin = false
}) {
  const percentClamped = Math.max(0, Math.min(100, Math.round(percentRemaining)));

  // Gauge stroke colors based on status
  const strokeColor = isDepleted 
    ? '#f43f5e' 
    : isLowMargin 
    ? '#f59e0b' 
    : color === 'emerald' ? '#10b981' : color === 'orange' ? '#f97316' : '#38bdf8';

  const glowClass = isDepleted 
    ? 'shadow-glow-rose border-telemetry-rose/50' 
    : isLowMargin 
    ? 'border-telemetry-amber/50' 
    : 'border-space-700/80 hover:border-space-600';

  // SVG circular gauge calculation (radius 42, circumference 263.89)
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentClamped / 100) * circumference;

  return (
    <div className={`relative p-5 rounded-2xl bg-space-900 border transition-all overflow-hidden ${glowClass}`}>
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className={`p-2 rounded-lg border ${
              isDepleted 
                ? 'bg-telemetry-rose/15 text-telemetry-rose border-telemetry-rose/30' 
                : isLowMargin 
                ? 'bg-telemetry-amber/15 text-telemetry-amber border-telemetry-amber/30' 
                : 'bg-space-800 text-slate-300 border-space-700'
            }`}>
              <Icon className="w-4 h-4" />
            </div>
          )}
          <div>
            <span className="font-display font-bold text-xs uppercase tracking-wider text-slate-200">
              {name}
            </span>
            <div className="text-[10px] font-mono text-slate-500 uppercase">
              CONSUMABLE RESERVE
            </div>
          </div>
        </div>

        <Badge variant={isDepleted ? 'danger' : isLowMargin ? 'warning' : 'nominal'}>
          {isDepleted ? 'DEPLETED' : isLowMargin ? 'LOW MARGIN' : 'NOMINAL'}
        </Badge>
      </div>

      {/* Main Gauge Visual Center */}
      <div className="flex items-center justify-between gap-4 py-2">
        {/* Circular Progress Gauge */}
        <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#131e36"
              strokeWidth="8"
            />
            {/* Active percentage ring */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke={strokeColor}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>

          {/* Center text percentage */}
          <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
            <span className="text-xl font-bold text-white tracking-tight">
              {percentClamped}%
            </span>
            <span className="text-[9px] text-slate-400 uppercase">
              LEFT
            </span>
          </div>
        </div>

        {/* Numerical Breakdown */}
        <div className="flex-1 space-y-1.5 font-mono text-xs">
          <div className="flex justify-between border-b border-space-800 pb-1">
            <span className="text-slate-400">Remaining:</span>
            <span className="text-white font-bold">
              {remaining.toLocaleString()} {unit}
            </span>
          </div>
          <div className="flex justify-between border-b border-space-800 pb-1">
            <span className="text-slate-400">Total Supplied:</span>
            <span className="text-slate-300">
              {supplied.toLocaleString()} {unit}
            </span>
          </div>
          <div className="flex justify-between border-b border-space-800 pb-1">
            <span className="text-slate-400">Total Consumed:</span>
            <span className="text-slate-300">
              {consumed.toLocaleString()} {unit}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Status / Time-to-Depletion Callout */}
      <div className="mt-3 pt-3 border-t border-space-800/80 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400 text-[11px]">
          {isDepleted 
            ? 'EXHAUSTION REACHED' 
            : hoursToExhaustion !== null 
            ? `Depletes in ~${hoursToExhaustion.toFixed(1)} hrs` 
            : 'Sufficient for mission duration'}
        </span>
        <span className={`text-[11px] font-bold ${
          isDepleted ? 'text-telemetry-rose' : isLowMargin ? 'text-telemetry-amber' : 'text-telemetry-emerald'
        }`}>
          {isDepleted ? 'ABORT TRIGGER' : isLowMargin ? '<25% BUFFER' : 'SAFE MARGIN'}
        </span>
      </div>
    </div>
  );
}
