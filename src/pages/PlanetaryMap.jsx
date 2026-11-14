import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Layers, 
  ExternalLink, 
  Mountain, 
  Crosshair, 
  Info,
  ShieldCheck,
  AlertTriangle,
  Radio,
  Satellite
} from 'lucide-react';
import MarsOpenLayersMap from '../components/explorer/MarsOpenLayersMap';
import MarsInteractiveMap from '../components/map/MarsInteractiveMap';
import Badge from '../components/common/Badge';
import { MARS_LANDMARKS, MARS_PLANETARY_CONSTANTS } from '../data/marsData';

export default function PlanetaryMap({ onNavigate }) {
  const [selectedSite, setSelectedSite] = useState(MARS_LANDMARKS[0]);
  const [explorerMode, setExplorerMode] = useState('wmts'); // 'wmts' (OpenLayers) or 'thematic' (SVG Cartography)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-telemetry-cyan font-semibold">
              PLANETARY CARTOGRAPHY & SATELLITE TILES
            </span>
            <Badge variant="real">NASA MARS TREK WMTS</Badge>
          </div>
          <h1 className="text-xl md:text-2xl font-display font-bold text-white tracking-wide">
            MARS EXPLORER & SATELLITE IMAGERY
          </h1>
          <p className="text-xs md:text-sm text-slate-300 font-sans max-w-2xl">
            Stream authentic orbital layers directly from NASA JPL Mars Trek: MGS MOLA elevation, 2001 Mars Odyssey THEMIS infrared, MRO CTX, and HiRISE 25cm Jezero Crater imagery.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-xl bg-space-900 border border-space-800 flex items-center">
            <button
              onClick={() => setExplorerMode('wmts')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                explorerMode === 'wmts'
                  ? 'bg-mars-orange text-white shadow-glow-orange'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Satellite className="w-3.5 h-3.5" />
              <span>OPENLAYERS WMTS</span>
            </button>
            <button
              onClick={() => setExplorerMode('thematic')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                explorerMode === 'thematic'
                  ? 'bg-mars-orange text-white shadow-glow-orange'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>THEMATIC RELIEF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Viewer Display */}
      {explorerMode === 'wmts' ? (
        <MarsOpenLayersMap 
          onSelectLandmark={(target) => {
            const matched = MARS_LANDMARKS.find(l => 
              l.name.toLowerCase().includes(target.name.toLowerCase()) || 
              target.name.toLowerCase().includes(l.name.toLowerCase())
            );
            if (matched) setSelectedSite(matched);
          }} 
        />
      ) : (
        <MarsInteractiveMap
          compact={false}
          selectedLandmarkId={selectedSite.id}
          onSelectLandmark={(landmark) => setSelectedSite(landmark)}
        />
      )}

      {/* Landmark Directory & Detailed Scientific Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Comprehensive Geological Site Dossier */}
        <div className="lg:col-span-2 space-y-4 rounded-2xl bg-space-900 border border-space-800 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-space-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-lg text-white">
                  {selectedSite.name}
                </h2>
                <Badge variant="real">{selectedSite.category}</Badge>
              </div>
              <p className="text-xs font-mono text-telemetry-cyan">
                COORDINATES: {selectedSite.coordinates}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">TERRAIN RISK:</span>
              <Badge variant={selectedSite.terrainRisk.includes('Extreme') ? 'danger' : 'warning'}>
                {selectedSite.terrainRisk}
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                GEOLOGICAL & ASTROBIOLOGICAL CONTEXT
              </h3>
              <p className="text-sm text-slate-200 font-sans leading-relaxed">
                {selectedSite.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-space-950 border border-space-800 space-y-1">
                <div className="text-[11px] font-mono text-slate-400">ELEVATION (DATUM):</div>
                <div className="font-mono font-bold text-slate-100 text-sm">
                  {selectedSite.elevation}
                </div>
                <div className="text-[10px] text-slate-500 font-sans">
                  Measured by Mars Orbiter Laser Altimeter (MOLA)
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-space-950 border border-space-800 space-y-1">
                <div className="text-[11px] font-mono text-slate-400">EXPLORATION MISSIONS:</div>
                <div className="font-mono font-bold text-mars-orange text-sm truncate">
                  {selectedSite.notableMissions}
                </div>
                <div className="text-[10px] text-slate-500 font-sans">
                  Verified robotic surface & orbital exploration
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-space-850/80 border border-space-700/60 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-sans">
                Plan a traverse route with waypoint margins for this site?
              </span>
              <button
                onClick={() => onNavigate('routes')}
                className="px-3.5 py-1.5 rounded-lg bg-mars-orange hover:bg-mars-rust text-white font-mono font-bold text-xs transition-colors shrink-0"
              >
                OPEN ROUTE PLANNER
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Site Selector List */}
        <div className="rounded-2xl bg-space-900 border border-space-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-white">
              EXPLORATION TARGETS
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {MARS_LANDMARKS.length} SITES
            </span>
          </div>

          <div className="space-y-2">
            {MARS_LANDMARKS.map((site) => {
              const isSelected = selectedSite.id === site.id;

              return (
                <button
                  key={site.id}
                  onClick={() => setSelectedSite(site)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-space-850 border-mars-orange text-white shadow-glow-orange'
                      : 'bg-space-950 border-space-800 text-slate-300 hover:border-space-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-sm">
                      {site.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {site.category}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 truncate mt-1">
                    {site.coordinates}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
