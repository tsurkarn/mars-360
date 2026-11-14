import React, { useState, useMemo, useEffect } from 'react';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  Zap, 
  ShieldAlert, 
  Plus, 
  ArrowRight, 
  AlertTriangle,
  CheckCircle2,
  Scale,
  Trash2,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
  ChevronDown,
  Compass
} from 'lucide-react';
import Badge from '../components/common/Badge';
import MetricCard from '../components/common/MetricCard';
import RouteMapOpenLayers from '../components/routes/RouteMapOpenLayers';
import ElevationProfileChart from '../components/routes/ElevationProfileChart';
import RouteComparator from '../components/routes/RouteComparator';
import { ROUTE_PRESETS } from '../data/marsRoutePresets';
import { analyzeRoute, fetchMarsElevation, checkCoordinateCoverage } from '../utils/marsGeo';

export default function RoutePlanning({ onNavigate, onUpdateActiveRoute }) {
  const [selectedPresetId, setSelectedPresetId] = useState(ROUTE_PRESETS[0].id);
  const [waypoints, setWaypoints] = useState(ROUTE_PRESETS[0].waypoints);
  const [activeWaypointId, setActiveWaypointId] = useState(null);
  const [showComparator, setShowComparator] = useState(false);

  // New waypoint form inputs
  const [newWpName, setNewWpName] = useState('');
  const [newWpLon, setNewWpLon] = useState('77.4600');
  const [newWpLat, setNewWpLat] = useState('18.4200');
  const [showAddDrawer, setShowAddDrawer] = useState(false);

  // Active route analysis
  const currentAnalysis = useMemo(() => {
    return analyzeRoute(waypoints);
  }, [waypoints]);

  // Sync with global mission state
  useEffect(() => {
    if (onUpdateActiveRoute && currentAnalysis) {
      const preset = ROUTE_PRESETS.find(p => p.id === selectedPresetId);
      onUpdateActiveRoute({
        name: preset?.name || 'Custom Marswalk Traverse',
        description: preset?.description || 'User-customized exploration traverse',
        waypoints
      }, currentAnalysis);
    }
  }, [waypoints, currentAnalysis]);

  // Route A and Route B for comparator
  const routeA = ROUTE_PRESETS[1]; // Direct Scarp Cut (Short but Dangerous)
  const analysisA = useMemo(() => analyzeRoute(routeA.waypoints), []);

  const routeB = ROUTE_PRESETS[0]; // Delta Meander (Longer but Gentle)
  const analysisB = useMemo(() => analyzeRoute(routeB.waypoints), []);

  // Preset switch
  const handleLoadPreset = (presetId) => {
    const preset = ROUTE_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setSelectedPresetId(preset.id);
      setWaypoints([...preset.waypoints]);
      setActiveWaypointId(null);
    }
  };

  // Add waypoint from map click
  const handleAddWaypointFromMap = (newWp) => {
    setWaypoints(prev => [...prev, newWp]);
  };

  // Add waypoint from manual form
  const handleAddManualWaypoint = async (e) => {
    e.preventDefault();
    const lon = parseFloat(newWpLon);
    const lat = parseFloat(newWpLat);
    const elev = await fetchMarsElevation(lon, lat);

    const newWp = {
      id: `wp-${Date.now()}`,
      name: newWpName.trim() || `Waypoint ${waypoints.length + 1}`,
      coords: [lon, lat],
      elevation: elev,
      type: 'waypoint'
    };

    setWaypoints(prev => [...prev, newWp]);
    setNewWpName('');
    setShowAddDrawer(false);
  };

  // Remove waypoint
  const handleRemoveWaypoint = (id) => {
    if (waypoints.length <= 2) {
      alert("A Marswalk route requires at least a Start point and a Destination.");
      return;
    }
    setWaypoints(prev => prev.filter(w => w.id !== id));
  };

  // Reset to current preset
  const handleResetRoute = () => {
    handleLoadPreset(selectedPresetId);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Preset Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-mars-orange font-semibold">
              EVA OPERATIONS & TRAVERSE ENGINE
            </span>
            <Badge variant="real">OPENLAYERS + MOLA ALTIMETRY</Badge>
          </div>
          <h1 className="text-xl md:text-2xl font-display font-bold text-white tracking-wide">
            MARSWALK ROUTE PLANNER & SAFETY EVALUATOR
          </h1>
          <p className="text-xs md:text-sm text-slate-300 font-sans max-w-2xl">
            Design EVA traverses with authentic Martian geodesy. Evaluates terrain inclination, consumable margins, and image coverage certainty.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowComparator(!showComparator)}
            className="px-3.5 py-2 rounded-xl bg-space-850 hover:bg-space-800 border border-mars-orange text-mars-orange hover:text-white text-xs font-mono font-bold flex items-center gap-2 shadow-glow-orange transition-all"
          >
            <Scale className="w-4 h-4" />
            <span>{showComparator ? 'HIDE COMPARATOR' : 'COMPARE CANDIDATE ROUTES'}</span>
          </button>

          <button
            onClick={handleResetRoute}
            className="px-3 py-2 rounded-xl bg-space-900 hover:bg-space-850 border border-space-700 text-xs font-mono text-slate-300 transition-colors flex items-center gap-1.5"
            title="Reset Route to Preset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">RESET</span>
          </button>
        </div>
      </div>

      {/* Guided Route Preset Switcher (Great for First-Time Users) */}
      <div className="p-4 rounded-2xl bg-space-900 border border-space-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-mars-orange" />
            <span className="font-display font-bold text-sm text-white uppercase">
              GUIDED ROUTE PRESETS FOR JEZERO CRATER
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            CLICK TO LOAD CANDIDATE SCENARIO
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {ROUTE_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleLoadPreset(preset.id)}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-space-850 border-mars-orange text-white shadow-glow-orange'
                    : 'bg-space-950/70 border-space-800 text-slate-300 hover:border-space-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display font-bold text-xs">
                      {preset.name.split(' (')[0]}
                    </span>
                    <Badge variant={preset.tag.includes('RECOMMENDED') ? 'nominal' : preset.tag.includes('DANGER') ? 'danger' : 'warning'}>
                      {preset.tag}
                    </Badge>
                  </div>
                  <p className="text-[11px] font-sans text-slate-400 line-clamp-2">
                    {preset.description}
                  </p>
                </div>
                <div className="text-[10px] font-mono text-telemetry-cyan mt-2">
                  {preset.waypoints.length} WAYPOINTS DEFINED
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Route Comparator Panel (Conditionally Visible) */}
      {showComparator && (
        <RouteComparator
          routeA={routeA}
          routeB={routeB}
          analysisA={analysisA}
          analysisB={analysisB}
          onSelectRoute={(choice) => {
            if (choice === 'A') handleLoadPreset(routeA.id);
            else handleLoadPreset(routeB.id);
            setShowComparator(false);
          }}
          onClose={() => setShowComparator(false)}
        />
      )}

      {/* Route Telemetry Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Marswalk Distance"
          value={currentAnalysis.totalDistanceMeters.toLocaleString()}
          unit="METERS"
          icon={Navigation}
          subtitle={`Mars Sphere Great-Circle Formula`}
          statusColor="cyan"
        />

        <MetricCard
          title="Estimated EVA Duration"
          value={currentAnalysis.totalDurationMinutes}
          unit="MINUTES"
          icon={Clock}
          subtitle="Includes 15m science per waypoint"
          statusColor="orange"
        />

        <MetricCard
          title="Max Terrain Slope"
          value={currentAnalysis.maxSlopeDeg}
          unit="DEGREES"
          icon={AlertTriangle}
          subtitle={currentAnalysis.maxSlopeDeg > 15 ? 'CRITICAL SLOPE HAZARD (>15°)' : 'MOLA Laser Altimetry'}
          trend={currentAnalysis.maxSlopeDeg > 15 ? 'HAZARDOUS' : 'NOMINAL'}
          trendType={currentAnalysis.maxSlopeDeg > 15 ? 'negative' : 'positive'}
          statusColor={currentAnalysis.maxSlopeDeg > 15 ? 'rose' : 'emerald'}
        />

        <MetricCard
          title="Oxygen Consumed"
          value={currentAnalysis.o2PercentOfTank}
          unit="% OF TANK"
          icon={ShieldAlert}
          subtitle="Includes pacing & incline metabolic draw"
          trend={currentAnalysis.o2PercentOfTank > 65 ? 'MARGIN DEFICIT' : 'NOMINAL MARGIN'}
          trendType={currentAnalysis.o2PercentOfTank > 65 ? 'negative' : 'positive'}
          statusColor={currentAnalysis.o2PercentOfTank > 65 ? 'rose' : 'emerald'}
        />
      </div>

      {/* Safety Assessment Banner (NEVER labels safe just because it is short!) */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        currentAnalysis.safetyVerdict.status === 'GO' 
          ? 'bg-telemetry-emerald/10 border-telemetry-emerald/30 shadow-glow-emerald' 
          : currentAnalysis.safetyVerdict.status === 'NO-GO'
          ? 'bg-telemetry-rose/10 border-telemetry-rose/40 shadow-glow-rose'
          : 'bg-telemetry-amber/10 border-telemetry-amber/30'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
              SAFETY EVALUATION VERDICT:
            </span>
            <Badge variant={currentAnalysis.safetyVerdict.badgeVariant}>
              {currentAnalysis.safetyVerdict.label}
            </Badge>
          </div>
          <p className="text-xs text-slate-200 font-sans">
            {currentAnalysis.safetyVerdict.rationale}
          </p>
        </div>

        {currentAnalysis.hasLowResWarning && (
          <div className="px-3 py-1.5 rounded-lg bg-space-950/80 border border-telemetry-amber/40 text-telemetry-amber text-[11px] font-mono shrink-0">
            ⚠ MOLA 463m/px UNCERTAINTY ZONE
          </div>
        )}
      </div>

      {/* Main Interactive OpenLayers Map */}
      <RouteMapOpenLayers
        waypoints={waypoints}
        onAddWaypoint={handleAddWaypointFromMap}
        activeWaypointId={activeWaypointId}
      />

      {/* Vertical Elevation Profile Chart */}
      <ElevationProfileChart
        waypoints={waypoints}
        analysis={currentAnalysis}
      />

      {/* Waypoint Management Table & Add Drawer */}
      <div className="rounded-2xl bg-space-900 border border-space-800 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-space-800 pb-3">
          <div>
            <h3 className="font-display font-bold text-sm text-white uppercase">
              ROUTE WAYPOINTS & TERRAIN ELEVATION TABLE
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Starting point, intermediate scientific stations, and mission destination.
            </p>
          </div>

          <button
            onClick={() => setShowAddDrawer(!showAddDrawer)}
            className="px-3.5 py-1.5 rounded-xl bg-space-850 hover:bg-space-800 border border-space-700 text-xs font-mono font-bold text-slate-200 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5 text-mars-orange" />
            <span>MANUAL COORDINATE ENTRY</span>
          </button>
        </div>

        {/* Manual Waypoint Drawer */}
        {showAddDrawer && (
          <form onSubmit={handleAddManualWaypoint} className="p-4 rounded-xl bg-space-950 border border-space-700/80 space-y-3">
            <div className="text-xs font-mono text-mars-orange font-bold uppercase">
              ADD INTERMEDIATE WAYPOINT BY MARS COORDINATES
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Station / Landmark Name:</label>
                <input
                  type="text"
                  value={newWpName}
                  onChange={(e) => setNewWpName(e.target.value)}
                  placeholder="e.g. Scarp Outcrop Beta"
                  className="w-full px-3 py-1.5 rounded-lg bg-space-900 border border-space-750 text-white text-xs font-mono focus:border-mars-orange focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Longitude (°E):</label>
                <input
                  type="number"
                  step="0.0001"
                  min="-180"
                  max="180"
                  value={newWpLon}
                  onChange={(e) => setNewWpLon(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-space-900 border border-space-750 text-white text-xs font-mono focus:border-mars-orange focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Latitude (°N):</label>
                <input
                  type="number"
                  step="0.0001"
                  min="-90"
                  max="90"
                  value={newWpLat}
                  onChange={(e) => setNewWpLat(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-space-900 border border-space-750 text-white text-xs font-mono focus:border-mars-orange focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddDrawer(false)}
                className="px-3 py-1.5 rounded-lg bg-space-900 text-slate-400 text-xs font-mono"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-mars-orange text-white text-xs font-mono font-bold hover:bg-mars-rust"
              >
                INSERT INTO TRAVERSE
              </button>
            </div>
          </form>
        )}

        {/* Waypoints Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-space-800 text-slate-500 uppercase text-[10px]">
                <th className="py-2.5 px-3">ROLE</th>
                <th className="py-2.5 px-3">STATION NAME</th>
                <th className="py-2.5 px-3">COORDINATES</th>
                <th className="py-2.5 px-3">ELEVATION</th>
                <th className="py-2.5 px-3">SEGMENT INCLINE</th>
                <th className="py-2.5 px-3">DATA CONFIDENCE</th>
                <th className="py-2.5 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-space-800/60">
              {waypoints.map((wp, idx) => {
                const isStart = idx === 0;
                const isDest = idx === waypoints.length - 1;
                const seg = currentAnalysis.segments[idx];
                const cov = checkCoordinateCoverage(wp.coords[0], wp.coords[1]);

                return (
                  <tr key={wp.id} className="hover:bg-space-850/50 transition-colors">
                    <td className="py-3 px-3">
                      <Badge variant={isStart ? 'nominal' : isDest ? 'danger' : 'default'}>
                        {isStart ? 'START' : isDest ? 'DESTINATION' : `WP-${idx}`}
                      </Badge>
                    </td>

                    <td className="py-3 px-3 font-sans font-medium text-white flex items-center gap-2">
                      <MapPin className={`w-3.5 h-3.5 ${isStart ? 'text-telemetry-emerald' : isDest ? 'text-telemetry-rose' : 'text-telemetry-cyan'}`} />
                      <span>{wp.name}</span>
                    </td>

                    <td className="py-3 px-3 text-slate-300">
                      {wp.coords[1].toFixed(4)}° N, {wp.coords[0].toFixed(4)}° E
                    </td>

                    <td className="py-3 px-3 text-white font-bold">
                      {wp.elevation} m
                    </td>

                    <td className="py-3 px-3">
                      {seg ? (
                        <span className={`font-bold ${seg.isExtreme ? 'text-telemetry-rose' : seg.isSteep ? 'text-telemetry-amber' : 'text-slate-300'}`}>
                          {seg.slopeDeg}° ({seg.distanceMeters} m)
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <span className={`text-[10px] ${cov.isHighRes ? 'text-telemetry-emerald' : 'text-telemetry-amber'}`}>
                        {cov.instrument} ({cov.resolution})
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      {!isStart && !isDest && (
                        <button
                          onClick={() => handleRemoveWaypoint(wp.id)}
                          className="p-1.5 rounded hover:bg-space-800 text-slate-500 hover:text-telemetry-rose transition-colors"
                          title="Remove Waypoint"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
