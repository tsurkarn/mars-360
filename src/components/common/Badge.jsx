import React from 'react';

export default function Badge({ children, variant = 'default', className = '' }) {
  const styles = {
    default: 'bg-space-800 text-slate-300 border-slate-700/60',
    simulated: 'bg-mars-rust/20 text-mars-amber border-mars-orange/40 font-mono text-xs shadow-sm',
    real: 'bg-telemetry-cyan/15 text-telemetry-cyan border-telemetry-cyan/40 font-mono text-xs',
    nominal: 'bg-telemetry-emerald/15 text-telemetry-emerald border-telemetry-emerald/40',
    warning: 'bg-telemetry-amber/15 text-telemetry-amber border-telemetry-amber/40',
    danger: 'bg-telemetry-rose/15 text-telemetry-rose border-telemetry-rose/40 animate-pulse',
    info: 'bg-telemetry-cyan/15 text-telemetry-cyan border-telemetry-cyan/40'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[11px] font-semibold tracking-wider uppercase ${styles[variant] || styles.default} ${className}`}>
      {variant === 'simulated' && (
        <span className="w-1.5 h-1.5 rounded-full bg-mars-amber animate-ping" />
      )}
      {children}
    </span>
  );
}
