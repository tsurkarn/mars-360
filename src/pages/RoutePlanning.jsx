import React, { useState } from 'react';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  Zap, 
  ShieldAlert, 
  Plus, 
  ArrowRight, 
  AlertTriangle,
  CheckCircle,
  FileDown
} from 'lucide-react';
import Badge from '../components/common/Badge';
import MetricCard from '../components/common/MetricCard';
import { SIMULATED_ROUTES } from '../data/marsData';

export default function RoutePlanning({ onNavigate }) {
  const [selectedRouteId, setSelectedRouteId] = useState(SIMULATED_ROUTES[0].id);
  const [routes, setRoutes] = useState(SIMULATED_ROUTES);
  const [newWaypointName, setNewWaypointName] = useState('');
  const [newWaypointSlope, setNewWaypointSlope] = useState('3.5');
  const [showAddForm, setShowAddForm] = useState(false);

  const activeRoute = routes.find(r => r.id === selectedRouteId) || routes[0];

  const handleAddWaypoint = (e) => {
    e.preventDefault();
    if (!newWaypointName.trim()) return;

    const slopeNum = parseFloat(newWaypointSlope) || 2.0;
    const danger = slopeNum > 10 ? 'High' : slopeNum > 5 ? 'Moderate' : 'Low';
    
    const lastWp = activeRoute.waypoints[activeRoute.waypoints.length - 1];
    const lastDistNum = parseInt(lastWp.dist.replace(/[^0-9]/g, '')) || 4000;
    const newDist = `${(lastDistNum + 850).toLocaleString()} m`;

    const newWp = {
      id: `WP-${activeRoute.waypoints.length + 1 < 10 ? '0' : ''}${activeRoute.waypoints.length + 1}`,
      name: newWaypointName.trim() + ' [SIMULATED]',
      dist: newDist,
      slope: `${slopeNum}°`,
      danger: danger,
      type: 'Sampling'
    };

    const updatedRoutes = routes.map(r => {
      if (r.id === activeRoute.id) {
        return {
          ...r,
          totalDistanceMeters: r.totalDistanceMeters + 850,
          estimatedDurationMinutes: r.estimatedDurationMinutes + 35,
          suitPowerUsagePercent: Math.min(r.suitPowerUsagePercent + 7, 100),
          oxygenReserveUsagePercent: Math.min(r.oxygenReserveUsagePercent + 8, 100),
          waypoints: [...r.waypoints, newWp]
        };
      }
      return r;
    });

    setRoutes(updatedRoutes);
    setNewWaypointName('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-mars-orange font-semibold">
              EVA OPERATIONS CONSOLE
            </span>
            <Badge variant="simulated">SIMULATED ROUTE PLANNING</Badge>
          </div>
          <h1 className="text-xl md:text-2xl font-display font-bold text-white tracking-wide">
            MARSWALK TRAVERSE & WAYPOINT PLANNER
          </h1>
          <p className="text-xs md:text-sm text-slate-300 font-sans max-w-2xl">
            Simulate surface walks, estimate terrain slope hazards, and budget consumables (O₂ margins, suit power cells, and radiation exposure).
          </p>
        </div>

        {/* Route Selector Tabs */}
        <div className="flex items-center gap-2">
          {routes.map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedRouteId(r.id)}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                selectedRouteId === r.id
                  ? 'bg-mars-orange text-white border-mars-orange shadow-glow-orange'
                  : 'bg-space-900 text-slate-300 border-space-800 hover:border-space-700'
              }`}
            >
              {r.name.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Route Trajectory Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Traverse Distance"
          value={activeRoute.totalDistanceMeters.toLocaleString()}
          unit="METERS"
          icon={Navigation}
          isSimulated={true}
          subtitle={`Target: ${activeRoute.targetSite}`}
          statusColor="orange"
        />

        <MetricCard
          title="Est. EVA Duration"
          value={activeRoute.estimatedDurationMinutes}
          unit="MIN"
          icon={Clock}
          isSimulated={true}
          subtitle="Includes 15m science stop per waypoint"
          statusColor="cyan"
        />

        <MetricCard
          title="Est. Oxygen Consumed"
          value={activeRoute.oxygenReserveUsagePercent}
          unit="% OF TANK"
          icon={ShieldAlert}
          isSimulated={true}
          subtitle="Includes 25% safety return reserve"
          statusColor={activeRoute.oxygenReserveUsagePercent > 70 ? 'rose' : 'emerald'}
        />

        <MetricCard
          title="Est. Radiation Dose"
          value={activeRoute.radiationExposureMicroSv}
          unit="µSv"
          icon={Zap}
          isSimulated={true}
          subtitle="Galactic cosmic rays + solar wind"
          statusColor="amber"
        />
      </div>

      {/* Main Waypoint Table & Elevation Elevation Section */}
      <div className="rounded-2xl bg-space-900 border border-space-800 p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-space-800 pb-4">
          <div>
            <h2 className="font-display font-bold text-base text-white">
              {activeRoute.name}
            </h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Terrain Profile: {activeRoute.terrainDescription}
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3.5 py-1.5 rounded-xl bg-space-850 hover:bg-space-800 border border-space-700 text-xs font-mono font-bold text-slate-200 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-mars-orange" />
            <span>ADD SIMULATED WAYPOINT</span>
          </button>
        </div>

        {/* Add Waypoint Modal/Drawer */}
        {showAddForm && (
          <form onSubmit={handleAddWaypoint} className="p-4 rounded-xl bg-space-950 border border-space-700/80 space-y-3">
            <div className="text-xs font-mono text-mars-orange font-bold uppercase">
              CREATE NEW TRAVERSE WAYPOINT [SIMULATED]
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Waypoint Name / Landmark Goal:
                </label>
                <input
                  type="text"
                  value={newWaypointName}
                  onChange={(e) => setNewWaypointName(e.target.value)}
                  placeholder="e.g. Scarp Delta Outcrop Delta 4"
                  className="w-full px-3 py-2 rounded-lg bg-space-900 border border-space-750 text-white text-xs font-mono focus:border-mars-orange focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Slope Incline (°):
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="45"
                  value={newWaypointSlope}
                  onChange={(e) => setNewWaypointSlope(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-space-900 border border-space-750 text-white text-xs font-mono focus:border-mars-orange focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-lg bg-space-900 text-slate-400 text-xs font-mono hover:text-white"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-mars-orange text-white text-xs font-mono font-bold hover:bg-mars-rust transition-colors"
              >
                SAVE TO TRAVERSE
              </button>
            </div>
          </form>
        )}

        {/* Waypoints Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-space-800 text-slate-500 uppercase text-[10px]">
                <th className="py-2.5 px-3">WP ID</th>
                <th className="py-2.5 px-3">WAYPOINT NAME</th>
                <th className="py-2.5 px-3">DISTANCE</th>
                <th className="py-2.5 px-3">INCLINATION</th>
                <th className="py-2.5 px-3">TERRAIN RISK</th>
                <th className="py-2.5 px-3">GOAL TYPE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-space-800/60">
              {activeRoute.waypoints.map((wp, idx) => (
                <tr key={wp.id} className="hover:bg-space-850/50 transition-colors">
                  <td className="py-3 px-3 font-bold text-telemetry-cyan">
                    {wp.id}
                  </td>
                  <td className="py-3 px-3 font-sans font-medium text-slate-100 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-mars-orange shrink-0" />
                    <span>{wp.name}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    {wp.dist}
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    {wp.slope}
                  </td>
                  <td className="py-3 px-3">
                    <Badge variant={
                      wp.danger === 'Severe' ? 'danger' :
                      wp.danger === 'High' ? 'warning' : 'nominal'
                    }>
                      {wp.danger}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    {wp.type}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Safety Margin Callout */}
        <div className="p-4 rounded-xl bg-space-950 border border-space-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-telemetry-emerald shrink-0" />
            <div>
              <div className="font-display font-bold text-slate-100">
                TRAVERSE SAFETY GO/NO-GO VERIFIED [SIMULATED]
              </div>
              <div className="text-slate-400 font-sans text-[11px]">
                Route stays within 2.5 km of abort shelter and maintains a minimum 25% oxygen margin.
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('report')}
            className="px-3.5 py-1.5 rounded-lg bg-space-800 hover:bg-space-700 text-slate-200 font-mono text-xs transition-colors shrink-0"
          >
            EXPORT TRAVERSE MANIFEST
          </button>
        </div>
      </div>
    </div>
  );
}
