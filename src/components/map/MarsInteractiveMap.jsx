import React, { useState } from 'react';
import { 
  MapPin, 
  Layers, 
  Info, 
  Crosshair, 
  Compass, 
  Eye, 
  Maximize2, 
  ShieldAlert,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { MARS_LANDMARKS } from '../../data/marsData';
import Badge from '../common/Badge';

export default function MarsInteractiveMap({ onSelectLandmark, selectedLandmarkId, compact = false }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showGrid, setShowGrid] = useState(true);
  const [activeSite, setActiveSite] = useState(
    MARS_LANDMARKS.find(l => l.id === selectedLandmarkId) || MARS_LANDMARKS[0]
  );

  const categories = ['All', 'Crater', 'Volcano', 'Canyon', 'Plain'];

  const filteredLandmarks = selectedCategory === 'All' 
    ? MARS_LANDMARKS 
    : MARS_LANDMARKS.filter(l => l.category === selectedCategory);

  const handlePinClick = (landmark) => {
    setActiveSite(landmark);
    if (onSelectLandmark) {
      onSelectLandmark(landmark);
    }
  };

  return (
    <div className="relative w-full rounded-2xl bg-space-900 border border-space-700/80 overflow-hidden shadow-panel">
      {/* Top Map Toolbar */}
      <div className="p-3.5 bg-space-950/80 backdrop-blur-md border-b border-space-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-mars-orange animate-spin" style={{ animationDuration: '20s' }} />
          <span className="font-display font-semibold text-sm text-slate-200">
            MARTIAN SURFACE CARTOGRAPHY
          </span>
          <Badge variant="real">MOLA DATASET</Badge>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md font-mono transition-colors ${
                selectedCategory === cat
                  ? 'bg-mars-orange text-white font-bold'
                  : 'bg-space-850 text-slate-400 hover:text-slate-200 border border-space-800'
              }`}
            >
              {cat}
            </button>
          ))}

          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`ml-2 px-2.5 py-1 rounded-md font-mono flex items-center gap-1.5 transition-colors border ${
              showGrid 
                ? 'bg-telemetry-cyan/20 text-telemetry-cyan border-telemetry-cyan/40' 
                : 'bg-space-850 text-slate-400 border-space-800'
            }`}
            title="Toggle Planetary Coordinate Grid"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">GRID</span>
          </button>
        </div>
      </div>

      {/* Main Visual Map Canvas */}
      <div className={`relative w-full ${compact ? 'h-[360px]' : 'h-[460px]'} bg-[#120b0b] overflow-hidden select-none`}>
        {/* Martian Topography Graphic Representation (SVG Map with realistic relief features) */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 500">
          <defs>
            {/* Mars surface procedural gradients */}
            <radialGradient id="marsSurface" cx="45%" cy="50%" r="65%">
              <stop offset="0%" stopColor="#451811" />
              <stop offset="45%" stopColor="#2e0f0b" />
              <stop offset="85%" stopColor="#1a0907" />
              <stop offset="100%" stopColor="#0a0505" />
            </radialGradient>

            {/* Northern lowlands vs Southern highlands basin relief */}
            <linearGradient id="molaRelief" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.4" />
              <stop offset="38%" stopColor="#852b1b" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#9a3412" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#431407" stopOpacity="0.6" />
            </linearGradient>

            <pattern id="coordGrid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(56, 189, 248, 0.08)" strokeWidth="1" strokeDasharray="3 3" />
            </pattern>
          </defs>

          {/* Planetary Base Color */}
          <rect width="1000" height="500" fill="url(#marsSurface)" />
          <rect width="1000" height="500" fill="url(#molaRelief)" />

          {/* Valles Marineris Canyon Rift Graphic representation */}
          <path
            d="M 380 290 Q 450 310, 520 280 T 600 320"
            fill="none"
            stroke="#120404"
            strokeWidth="12"
            strokeLinecap="round"
            filter="drop-shadow(0 0 4px #000)"
            opacity="0.85"
          />
          <path
            d="M 390 290 Q 455 308, 518 281 T 595 318"
            fill="none"
            stroke="#ef4444"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.4"
          />

          {/* Olympus Mons Shield Volcano caldera graphic representation */}
          <circle cx="250" cy="200" r="48" fill="#521c15" opacity="0.8" />
          <circle cx="250" cy="200" r="32" fill="#6c251c" opacity="0.9" />
          <circle cx="250" cy="200" r="14" fill="#1b0806" stroke="#fb923c" strokeWidth="1.5" opacity="0.9" />

          {/* Elysium Mons & Planitia smooth contours */}
          <circle cx="780" cy="235" r="28" fill="#3b1510" opacity="0.6" />
          <circle cx="780" cy="235" r="8" fill="#120404" opacity="0.7" />

          {/* Hellas Basin southern depression contour */}
          <ellipse cx="650" cy="400" rx="90" ry="50" fill="#1a0907" stroke="#99351e" strokeWidth="1" opacity="0.6" />
          
          {/* Coordinate Grid Overlay */}
          {showGrid && (
            <>
              <rect width="1000" height="500" fill="url(#coordGrid)" />
              {/* Equator (0° Lat) */}
              <line x1="0" y1="250" x2="1000" y2="250" stroke="#38bdf8" strokeWidth="1" strokeDasharray="6 4" opacity="0.35" />
              {/* Prime Meridian (0° Long) */}
              <line x1="500" y1="0" x2="500" y2="500" stroke="#38bdf8" strokeWidth="1" strokeDasharray="6 4" opacity="0.35" />
            </>
          )}
        </svg>

        {/* Lat/Long Compass Indicators */}
        {showGrid && (
          <div className="absolute top-2 left-3 text-[10px] font-mono text-telemetry-cyan/60 pointer-events-none space-y-0.5">
            <div>LAT: +60° N (ACIDALIA PLANITIA)</div>
            <div>DATUM: MOLA ELEVATION BASELINE</div>
          </div>
        )}
        {showGrid && (
          <div className="absolute bottom-2 left-3 text-[10px] font-mono text-telemetry-cyan/60 pointer-events-none">
            LAT: -60° S (HELLAS BASIN)
          </div>
        )}

        {/* Interactive Landmark Pins */}
        {filteredLandmarks.map((landmark) => {
          const isSelected = activeSite?.id === landmark.id;

          return (
            <div
              key={landmark.id}
              style={{ left: `${landmark.x}%`, top: `${landmark.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
              onClick={() => handlePinClick(landmark)}
            >
              {/* Target Pulse Halo */}
              <div className={`absolute -inset-2 rounded-full transition-all duration-300 ${
                isSelected 
                  ? 'bg-mars-orange/30 animate-ping' 
                  : 'group-hover:bg-telemetry-cyan/20'
              }`} />

              {/* Pin Icon / Marker */}
              <div className={`relative p-1.5 rounded-full border transition-all duration-200 shadow-lg ${
                isSelected 
                  ? 'bg-mars-orange border-white text-white shadow-glow-orange scale-125' 
                  : 'bg-space-950/90 border-mars-orange/80 text-mars-orange hover:border-white hover:text-white hover:scale-110'
              }`}>
                <MapPin className="w-3.5 h-3.5" />
              </div>

              {/* Hover / Active Badge Pill */}
              <div className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 pointer-events-none transition-all duration-200 z-30 ${
                isSelected ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100 scale-95'
              }`}>
                <div className="px-2.5 py-1 rounded-md bg-space-950/95 border border-slate-700 shadow-xl whitespace-nowrap text-center">
                  <div className="text-xs font-display font-bold text-white flex items-center gap-1.5">
                    <span>{landmark.name}</span>
                    <span className="text-[10px] text-mars-orange font-mono">[{landmark.category}]</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    {landmark.coordinates}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Landmark Scientific Intel Bar */}
      {activeSite && (
        <div className="p-4 bg-space-950 border-t border-space-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-base text-white">
                  {activeSite.name}
                </span>
                <Badge variant="real">{activeSite.type}</Badge>
                <Badge variant={activeSite.terrainRisk.includes('Extreme') ? 'danger' : 'warning'}>
                  {activeSite.terrainRisk}
                </Badge>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed max-w-3xl">
                {activeSite.description}
              </p>
            </div>

            <div className="flex items-center gap-4 border-t lg:border-t-0 lg:border-l border-space-800 pt-2 lg:pt-0 lg:pl-4 text-xs font-mono shrink-0">
              <div>
                <div className="text-slate-500 uppercase text-[10px]">COORDINATES</div>
                <div className="text-telemetry-cyan font-semibold">{activeSite.coordinates}</div>
              </div>
              <div>
                <div className="text-slate-500 uppercase text-[10px]">ELEVATION</div>
                <div className="text-slate-200">{activeSite.elevation}</div>
              </div>
              <div>
                <div className="text-slate-500 uppercase text-[10px]">MISSIONS</div>
                <div className="text-mars-orange truncate max-w-[150px]">{activeSite.notableMissions}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
