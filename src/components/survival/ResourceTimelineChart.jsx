import React, { useState } from 'react';
import { Clock, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import Badge from '../common/Badge';

export default function ResourceTimelineChart({
  durationDays,
  timelinePoints, // Array of { timeHours, sol, o2Percent, waterPercent, batteryPercent }
  safetyThreshold = 25
}) {
  const [hoverIndex, setHoverIndex] = useState(null);

  if (!timelinePoints || timelinePoints.length < 2) {
    return null;
  }

  const svgWidth = 840;
  const svgHeight = 260;
  const padLeft = 60;
  const padRight = 40;
  const padTop = 30;
  const padBottom = 40;
  const plotWidth = svgWidth - padLeft - padRight;
  const plotHeight = svgHeight - padTop - padBottom;

  const totalHours = timelinePoints[timelinePoints.length - 1].timeHours || 24;

  const getX = (hours) => padLeft + (hours / totalHours) * plotWidth;
  const getY = (percent) => padTop + plotHeight - (Math.max(0, Math.min(100, percent)) / 100) * plotHeight;

  // Build path strings for each resource curve
  const o2Path = timelinePoints.map(p => `${getX(p.timeHours)},${getY(p.o2Percent)}`).join(' L ');
  const waterPath = timelinePoints.map(p => `${getX(p.timeHours)},${getY(p.waterPercent)}`).join(' L ');
  const batteryPath = timelinePoints.map(p => `${getX(p.timeHours)},${getY(p.batteryPercent)}`).join(' L ');

  const thresholdY = getY(safetyThreshold);

  const hoveredData = hoverIndex !== null ? timelinePoints[hoverIndex] : null;

  return (
    <div className="rounded-2xl bg-space-900 border border-space-800 p-5 space-y-4">
      {/* Chart Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-space-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-telemetry-cyan" />
            <h3 className="font-display font-bold text-sm text-white uppercase">
              PROJECTED RESOURCE DEPLETION TIMELINE
            </h3>
            <Badge variant="simulated">SIMULATED MODEL</Badge>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Depletion rate projection across {durationDays} Sols ({Math.round(totalHours)} hours total).
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-telemetry-cyan rounded" />
            <span className="text-slate-300">OXYGEN (O₂)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-telemetry-emerald rounded" />
            <span className="text-slate-300">WATER (H₂O)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-mars-amber rounded" />
            <span className="text-slate-300">POWER / BATTERY</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t border-dashed border-telemetry-rose" />
            <span className="text-telemetry-rose">25% SAFETY RESERVE</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Plot */}
      <div className="relative w-full overflow-x-auto">
        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
          className="w-full h-56 select-none"
          onMouseLeave={() => setHoverIndex(null)}
        >
          {/* Horizontal Grid lines */}
          {[100, 75, 50, 25, 0].map(pct => {
            const y = getY(pct);
            return (
              <g key={pct}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={svgWidth - padRight}
                  y2={y}
                  stroke={pct === 25 ? 'rgba(244, 63, 94, 0.4)' : '#1e293b'}
                  strokeDasharray={pct === 25 ? '6 4' : '3 3'}
                  strokeWidth={pct === 25 ? 1.5 : 1}
                />
                <text
                  x={padLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  className={`text-[10px] font-mono ${pct === 25 ? 'fill-telemetry-rose font-bold' : 'fill-slate-500'}`}
                >
                  {pct}%
                </text>
              </g>
            );
          })}

          {/* Critical 25% Reserve Label */}
          <text
            x={svgWidth - padRight + 6}
            y={thresholdY + 4}
            className="text-[9px] font-mono fill-telemetry-rose font-bold"
          >
            25% MARGIN
          </text>

          {/* Curves */}
          <path d={`M ${o2Path}`} fill="none" stroke="#38bdf8" strokeWidth="2.5" />
          <path d={`M ${waterPath}`} fill="none" stroke="#10b981" strokeWidth="2.5" />
          <path d={`M ${batteryPath}`} fill="none" stroke="#f97316" strokeWidth="2.5" />

          {/* X-axis Sol Time Labels */}
          {Array.from({ length: Math.min(8, durationDays + 1) }).map((_, i) => {
            const fraction = i / Math.min(7, durationDays);
            const hrs = fraction * totalHours;
            const solNum = (hrs / 24.66).toFixed(1);
            const x = getX(hrs);

            return (
              <g key={i}>
                <line x1={x} y1={padTop + plotHeight} x2={x} y2={padTop + plotHeight + 6} stroke="#475569" />
                <text
                  x={x}
                  y={padTop + plotHeight + 20}
                  textAnchor="middle"
                  className="text-[10px] font-mono fill-slate-400"
                >
                  Sol {solNum} ({Math.round(hrs)}h)
                </text>
              </g>
            );
          })}

          {/* Interactive Hover Vertical Scrubber */}
          {hoveredData && (
            <g>
              <line
                x1={getX(hoveredData.timeHours)}
                y1={padTop}
                x2={getX(hoveredData.timeHours)}
                y2={padTop + plotHeight}
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <circle cx={getX(hoveredData.timeHours)} cy={getY(hoveredData.o2Percent)} r={4} fill="#38bdf8" stroke="#fff" />
              <circle cx={getX(hoveredData.timeHours)} cy={getY(hoveredData.waterPercent)} r={4} fill="#10b981" stroke="#fff" />
              <circle cx={getX(hoveredData.timeHours)} cy={getY(hoveredData.batteryPercent)} r={4} fill="#f97316" stroke="#fff" />
            </g>
          )}

          {/* Transparent Hover Hit Areas */}
          {timelinePoints.map((p, idx) => (
            <rect
              key={idx}
              x={getX(p.timeHours) - (plotWidth / timelinePoints.length) / 2}
              y={padTop}
              width={plotWidth / timelinePoints.length}
              height={plotHeight}
              fill="transparent"
              className="cursor-crosshair"
              onMouseEnter={() => setHoverIndex(idx)}
            />
          ))}
        </svg>

        {/* Hover Inspector Tooltip */}
        {hoveredData && (
          <div className="absolute top-2 right-4 p-3 rounded-xl bg-space-950/95 border border-space-700 shadow-2xl text-xs font-mono space-y-1 pointer-events-none">
            <div className="text-white font-bold pb-1 border-b border-space-800">
              TIME: Sol {(hoveredData.timeHours / 24.66).toFixed(1)} ({Math.round(hoveredData.timeHours)}h into mission)
            </div>
            <div className="text-telemetry-cyan flex justify-between gap-4">
              <span>Oxygen Remaining:</span>
              <span className="font-bold">{hoveredData.o2Percent.toFixed(1)}%</span>
            </div>
            <div className="text-telemetry-emerald flex justify-between gap-4">
              <span>Water Remaining:</span>
              <span className="font-bold">{hoveredData.waterPercent.toFixed(1)}%</span>
            </div>
            <div className="text-mars-amber flex justify-between gap-4">
              <span>Power Remaining:</span>
              <span className="font-bold">{hoveredData.batteryPercent.toFixed(1)}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
