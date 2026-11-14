/**
 * MARS 360 - Curated Marswalk Route Scenarios
 * 
 * Specifically engineered to demonstrate:
 * 1. "Never label a route safe just because it is short."
 * 2. "If high-resolution terrain data is unavailable, clearly communicate the uncertainty."
 */

export const ROUTE_PRESETS = [
  {
    id: 'preset_delta_gentle',
    name: 'Route 1: Delta Meander Detour (Longer, but Low Slope)',
    description: 'Circumnavigates the western delta front along gentle sedimentary benches. Verified by 0.25m HiRISE imagery.',
    tag: 'RECOMMENDED EVA',
    waypoints: [
      { id: 'wp-1', name: 'Base Alpha Airlock', coords: [77.4200, 18.3800], elevation: -2594, type: 'start' },
      { id: 'wp-2', name: 'Lower Fan Sand Bench', coords: [77.4350, 18.3920], elevation: -2575, type: 'waypoint' },
      { id: 'wp-3', name: 'Meander Ridge Transition', coords: [77.4520, 18.4100], elevation: -2548, type: 'waypoint' },
      { id: 'wp-4', name: 'Kodiak Butte Viewpoint', coords: [77.4700, 18.4250], elevation: -2532, type: 'waypoint' },
      { id: 'wp-5', name: 'Sampling Station Delta-4', coords: [77.4850, 18.4400], elevation: -2515, type: 'destination' }
    ]
  },
  {
    id: 'preset_scarp_direct',
    name: 'Route 2: Direct Scarp Cut (Short, but Treacherous Slope)',
    description: 'Attempts a direct ascent up the western delta erosion scarp. Shorter in distance, but severely steep (>17°) with rollover risk.',
    tag: 'HIGH DANGER HAZARD',
    waypoints: [
      { id: 'wp-11', name: 'Base Alpha Airlock', coords: [77.4200, 18.3800], elevation: -2594, type: 'start' },
      { id: 'wp-12', name: 'Talus Base Scree Field', coords: [77.4260, 18.3900], elevation: -2520, type: 'waypoint' },
      { id: 'wp-13', name: 'Vertical Scarp Face Pitch', coords: [77.4310, 18.3980], elevation: -2340, type: 'waypoint' },
      { id: 'wp-14', name: 'Delta Crest Plateau Edge', coords: [77.4380, 18.4050], elevation: -2210, type: 'destination' }
    ]
  },
  {
    id: 'preset_rim_recon',
    name: 'Route 3: Jezero North Rim Traverse (Uncertainty Demo)',
    description: 'Leaves the high-resolution HiRISE coverage boundary and heads toward the impact crater rim. High uncertainty from 463m MOLA orbital grid.',
    tag: 'LOW CERTAINTY',
    waypoints: [
      { id: 'wp-21', name: 'North Perimeter Depot', coords: [77.5200, 18.4600], elevation: -2520, type: 'start' },
      { id: 'wp-22', name: 'HiRISE Boundary Threshold', coords: [77.5800, 18.5200], elevation: -2410, type: 'waypoint' },
      { id: 'wp-23', name: 'MOLA Regional Plateau (Unverified)', coords: [77.6500, 18.6100], elevation: -2200, type: 'waypoint' },
      { id: 'wp-24', name: 'North Rim Breccia Outcrop', coords: [77.7200, 18.7000], elevation: -1880, type: 'destination' }
    ]
  }
];
