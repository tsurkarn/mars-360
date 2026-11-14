import React, { useState } from 'react';
import { Mountain, AlertTriangle, TrendingUp, Info } from 'lucide-react';
import Badge from '../common/Badge';

export default function ElevationProfileChart({ waypoints, analysis }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!waypoints || waypoints.length < 2) {
    return (
      <div className="p-6 rounded-2xl bg-space-900 border border-space-800 text-center text-xs font-mono text-slate-400">
        Add at least 2 waypoints to compute the vertical Martian elevation cross-section.
      </div>
    );
  }

  // Calculate cumulative distances for each waypoint
  let cumDist = 0;
  const profilePoints = waypoints.map((wp, idx) => {
    if (idx > 0) {
      cumDist += analysis.segments[idx - 1]?.distanceMeters || 0;
    }
    return {
      index: idx,
      name: wp.name,
      coords: wp.coords,
      elevation: wp.elevation !== undefined ? wp.elevation : -2500,
      distanceMeters: cumDist,
      slopeToNext: analysis.segments[idx]?.slopeDeg || 0,
      isSteep: analysis.segments[idx]?.isSteep || false,
      isExtreme: analysis.segments[idx]?.isExtreme || false
    };
  });

  const totalDist = profilePoints[profilePoints.length - 1].distanceMeters || 1;
  const elevations = profilePoints.map(p => p.elevation);
  const minElev = Math.min(...elevations);
  const maxElev = Math.max(...elevations);
  const elevRange = Math.max(1, maxElev - minElev);

  // Chart dimensions in SVG coordinates
  const svgWidth = 800;
  const svgHeight = 220;
  const padLeft = 60;
  const padRight = 30;
  const padTop = 30;
  const padBottom = 40;
  const plotWidth = svgWidth - padLeft - padRight;
  const plotHeight = svgHeight - padTop - padBottom;

  // Coordinate mapping functions
  const getX = (dist) => padLeft + (dist / totalDist) * plotWidth;
  const getY = (elev) => padTop + plotHeight - ((elev - minElev) / elevRange) * plotHeight;

  // Build SVG path
  const linePoints = profilePoints.map(p => `${getX(p.distanceMeters)},${getY(p.elevation)}`).join(' L ');
  const areaPath = `M ${getX(0)},${padTop + plotHeight} L ${linePoints} L ${getX(totalDist)},${padTop + plotHeight} Z`;

  return (
    <div className="rounded-2xl bg-space-900 border border-space-800 p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-space-800 pb-3">
        <div className="flex items-center gap-2">
          <Mountain className="w-4 h-4 text-telemetry-cyan" />
          <h3 className="font-display font-bold text-sm text-white uppercase">
            MOLA VERTICAL ELEVATION CROSS-SECTION
          </h3>
          <Badge variant="real">MOLA DATUM</Badge>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400">ELEV GAIN: </span>
            <span className="text-telemetry-emerald font-bold">+{analysis.elevationGainMeters} m</span>
          </div>
          <div>
            <span className="text-slate-400">MAX SLOPE: </span>
            <span className={`font-bold ${analysis.maxSlopeDeg > 15 ? 'text-telemetry-rose' : analysis.maxSlopeDeg > 8 ? 'text-telemetry-amber' : 'text-telemetry-emerald'}`}>
              {analysis.maxSlopeDeg}°
            </span>
          </div>
        </div>
      </div>

      {/* SVG Elevation Profile Plot */}
      <div className="relative w-full overflow-x-auto">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-48 select-none">
          <defs>
            <linearGradient id="elevGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e05333" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#99351e" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0a0505" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={padLeft} y1={padTop} x2={svgWidth - padRight} y2={padTop} stroke="#1e293b" strokeDasharray="3 3" />
          <line x1={padLeft} y1={padTop + plotHeight / 2} x2={svgWidth - padRight} y2={padTop + plotHeight / 2} stroke="#1e293b" strokeDasharray="3 3" />
          <line x1={padLeft} y1={padTop + plotHeight} x2={svgWidth - padRight} y2={padTop + plotHeight} stroke="#334155" />

          {/* Y-axis Labels */}
          <text x={padLeft - 8} y={padTop + 4} textAnchor="end" className="text-[10px] font-mono fill-slate-400">
            {maxElev} m
          </text>
          <text x={padLeft - 8} y={padTop + plotHeight / 2 + 4} textAnchor="end" className="text-[10px] font-mono fill-slate-500">
            {Math.round((maxElev + minElev) / 2)} m
          </text>
          <text x={padLeft - 8} y={padTop + plotHeight + 4} textAnchor="end" className="text-[10px] font-mono fill-slate-400">
            {minElev} m
          </text>

          {/* Area Fill */}
          <path d={areaPath} fill="url(#elevGradient)" />

          {/* Elevation Profile Line */}
          <path d={`M ${linePoints}`} fill="none" stroke="#e05333" strokeWidth="2.5" />

          {/* Segment danger coloring */}
          {profilePoints.map((p, idx) => {
            if (idx === profilePoints.length - 1) return null;
            const nextP = profilePoints[idx + 1];
            if (p.isExtreme) {
              return (
                <line
                  key={`steep-${idx}`}
                  x1={getX(p.distanceMeters)}
                  y1={getY(p.elevation)}
                  x2={getX(nextP.distanceMeters)}
                  y2={getY(nextP.elevation)}
                  stroke="#ef4444"
                  strokeWidth="4"
                  strokeDasharray="4 2"
                />
              );
            }
            return null;
          })}

          {/* Waypoint nodes */}
          {profilePoints.map((p) => {
            const cx = getX(p.distanceMeters);
            const cy = getY(p.elevation);
            const isHovered = hoveredPoint?.index === p.index;

            return (
              <g 
                key={p.index} 
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 6 : 4}
                  fill={p.index === 0 ? '#10b981' : p.index === profilePoints.length - 1 ? '#ef4444' : '#38bdf8'}
                  stroke="#ffffff"
                  strokeWidth={isHovered ? 2 : 1}
                />
                <text
                  x={cx}
                  y={padTop + plotHeight + 20}
                  textAnchor="middle"
                  className="text-[10px] font-mono fill-slate-400"
                >
                  {(p.distanceMeters / 1000).toFixed(1)} km
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div className="absolute top-2 right-4 p-2.5 rounded-lg bg-space-950/95 border border-space-700 shadow-xl text-xs font-mono space-y-0.5 pointer-events-none">
            <div className="text-white font-bold">{hoveredPoint.name}</div>
            <div className="text-telemetry-cyan">Distance: {hoveredPoint.distanceMeters} m</div>
            <div className="text-slate-300">Elevation: {hoveredPoint.elevation} m</div>
            {hoveredPoint.slopeToNext > 0 && (
              <div className={`font-semibold ${hoveredPoint.slopeToNext > 15 ? 'text-telemetry-rose' : hoveredPoint.slopeToNext > 8 ? 'text-telemetry-amber' : 'text-telemetry-emerald'}`}>
                Segment Incline: {hoveredPoint.slopeToNext}°
              </div>
            )}
          </div>
        )}
      </div>

      {/* Safety Notice regarding Altimetry */}
      <div className="p-3 rounded-xl bg-space-950 border border-space-800 text-[11px] font-sans text-slate-400 flex items-start gap-2">
        <Info className="w-4 h-4 text-telemetry-cyan shrink-0 mt-0.5" />
        <span>
          <strong>Scientific Measurement Note:</strong> Vertical elevation values are derived from NASA Mars Global Surveyor (MGS) MOLA 128 ppd laser altimetry relative to the Martian reference datum. Slopes over 15° present severe EVA suit traction and rover rollover hazards.
        </span>
      </div>
    </div>
  );
}
