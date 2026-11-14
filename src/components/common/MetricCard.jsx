import React from 'react';
import Badge from './Badge';

export default function MetricCard({
  title,
  value,
  unit = '',
  icon: Icon,
  trend,
  trendType = 'neutral', // 'positive', 'negative', 'warning', 'neutral'
  isSimulated = false,
  isReal = false,
  subtitle,
  className = '',
  statusColor = 'cyan' // 'cyan', 'orange', 'emerald', 'rose', 'amber'
}) {
  const borderAccents = {
    cyan: 'border-space-700/60 hover:border-telemetry-cyan/50 hover:shadow-glow-cyan',
    orange: 'border-space-700/60 hover:border-mars-orange/50 hover:shadow-glow-orange',
    emerald: 'border-space-700/60 hover:border-telemetry-emerald/50 hover:shadow-glow-emerald',
    amber: 'border-space-700/60 hover:border-telemetry-amber/50',
    rose: 'border-space-700/60 hover:border-telemetry-rose/50',
  };

  const iconColors = {
    cyan: 'text-telemetry-cyan bg-telemetry-cyan/10 border-telemetry-cyan/20',
    orange: 'text-mars-orange bg-mars-orange/10 border-mars-orange/20',
    emerald: 'text-telemetry-emerald bg-telemetry-emerald/10 border-telemetry-emerald/20',
    amber: 'text-telemetry-amber bg-telemetry-amber/10 border-telemetry-amber/20',
    rose: 'text-telemetry-rose bg-telemetry-rose/10 border-telemetry-rose/20',
  };

  return (
    <div className={`relative bg-space-900/90 backdrop-blur-md border rounded-xl p-4 transition-all duration-200 overflow-hidden group ${borderAccents[statusColor] || borderAccents.cyan} ${className}`}>
      {/* Corner Mission Control Notch Marks */}
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-slate-600/40 group-hover:border-slate-400 transition-colors" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-slate-600/40 group-hover:border-slate-400 transition-colors" />

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className={`p-2 rounded-lg border ${iconColors[statusColor] || iconColors.cyan}`}>
              <Icon className="w-4 h-4" />
            </div>
          )}
          <span className="text-xs uppercase tracking-wider font-display font-semibold text-slate-400">
            {title}
          </span>
        </div>

        {isSimulated && <Badge variant="simulated">SIMULATED</Badge>}
        {isReal && <Badge variant="real">NASA FACT</Badge>}
      </div>

      {/* Metric Main Value */}
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold font-mono text-white tracking-tight">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-mono text-slate-400 uppercase">
            {unit}
          </span>
        )}
      </div>

      {/* Subtitle / Context / Trend */}
      {(subtitle || trend) && (
        <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
          {subtitle && (
            <span className="text-slate-400 truncate text-[11px] font-sans">
              {subtitle}
            </span>
          )}
          {trend && (
            <span className={`font-mono text-[11px] font-medium ${
              trendType === 'positive' ? 'text-telemetry-emerald' :
              trendType === 'negative' ? 'text-telemetry-rose' :
              trendType === 'warning' ? 'text-telemetry-amber' : 'text-slate-400'
            }`}>
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
