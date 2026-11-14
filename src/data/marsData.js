/**
 * MARS 360 Scientific Dataset & Simulation Constants
 * 
 * Rules strictly followed:
 * - Real planetary parameters derived from NASA Mars Fact Sheet (NSSDC / Planetary Data System).
 * - All mission planning telemetry and EVA operational placeholder parameters are explicitly tagged [SIMULATED].
 */

// 1. REAL SCIENTIFIC MARS CONSTANTS (NASA Planetary Fact Sheet / PDS)
export const MARS_PLANETARY_CONSTANTS = {
  name: "Mars",
  designation: "Fourth planet from the Sun",
  meanRadiusKm: 3389.5,
  equatorialCircumferenceKm: 21344,
  surfaceGravity: "3.721 m/s² (0.379 g)",
  dayLengthSol: "24h 39m 35.2s",
  yearLengthDays: "687 Earth Days (668.6 Sols)",
  meanSurfacePressure: "610 Pa (6.10 mbar)",
  meanSurfaceTempC: -63,
  surfaceTempRangeC: "-140°C to +20°C",
  solarIrradianceWm2: "590 W/m² (top of atmosphere)",
  atmosphereComposition: [
    { gas: "Carbon Dioxide (CO₂)", percentage: 95.32, color: "#e05333" },
    { gas: "Nitrogen (N₂)", percentage: 2.60, color: "#38bdf8" },
    { gas: "Argon (Ar)", percentage: 1.90, color: "#818cf8" },
    { gas: "Oxygen (O₂)", percentage: 0.13, color: "#10b981" },
    { gas: "Carbon Monoxide (CO)", percentage: 0.08, color: "#f59e0b" },
    { gas: "Water Vapor (H₂O)", percentage: 0.02, color: "#93c5fd" },
  ]
};

// 2. REAL SCIENTIFIC LANDMARKS & EXPLORATION SITES
export const MARS_LANDMARKS = [
  {
    id: "jezero-crater",
    name: "Jezero Crater",
    type: "Paleolake & Delta Deposit",
    coordinates: "18.38° N, 77.58° E",
    x: 68, // map projection percentage
    y: 42,
    elevation: "-2,500 m (relative to MOLA datum)",
    notableMissions: "Mars 2020 (Perseverance & Ingenuity)",
    description: "An ancient 45-km wide crater containing an ancient river delta system rich in clay minerals, ideal for astrobiological biosignature detection.",
    scientificPriority: "High (Astrobiology)",
    terrainRisk: "Moderate (Delta boulders & scarps)",
    category: "Crater",
    isRealSite: true
  },
  {
    id: "gale-crater",
    name: "Gale Crater & Mount Sharp",
    type: "Layered Sedimentary Mound",
    coordinates: "5.38° S, 137.44° E",
    x: 82,
    y: 53,
    elevation: "-4,500 m (crater floor)",
    notableMissions: "Curiosity Rover (MSL)",
    description: "154-km diameter crater with a 5.5-km high central mound displaying alternating sulfate and clay layers tracking Mars' climate transition.",
    scientificPriority: "High (Paleoclimate)",
    terrainRisk: "High (Mount Sharp steep incline)",
    category: "Crater",
    isRealSite: true
  },
  {
    id: "olympus-mons",
    name: "Olympus Mons",
    type: "Shield Volcano",
    coordinates: "18.65° N, 226.20° E",
    x: 25,
    y: 40,
    elevation: "+21,287 m",
    notableMissions: "Orbital mapping (MRO, Mars Express, Viking)",
    description: "The largest volcano in the Solar System. Shield slopes are gentle (2-5°), but flanked by an outer scarp up to 8 km high.",
    scientificPriority: "High (Volcanology)",
    terrainRisk: "Extreme (Basal cliffs & lava tubes)",
    category: "Volcano",
    isRealSite: true
  },
  {
    id: "valles-marineris",
    name: "Valles Marineris (Candor Chasma)",
    type: "Tectonic Rift Canyon",
    coordinates: "13.90° S, 300.80° E",
    x: 45,
    y: 60,
    elevation: "-7,000 m floor",
    notableMissions: "Mars Global Surveyor, HiRISE",
    description: "Grand Canyon of Mars spanning over 4,000 km in length, revealing deep crustal stratification and recurrent slope lineae.",
    scientificPriority: "High (Stratigraphy & Geophysics)",
    terrainRisk: "Extreme (Vertical cliff faces)",
    category: "Canyon",
    isRealSite: true
  },
  {
    id: "elysium-planitia",
    name: "Elysium Planitia",
    type: "Smooth Volcanic Plain",
    coordinates: "4.50° N, 135.62° E",
    x: 78,
    y: 47,
    elevation: "-2,600 m",
    notableMissions: "InSight Lander (SEIS seismometer)",
    description: "Smooth, relatively featureless equatorial volcanic plain ideal for geophysical probing of core and mantle boundary layers.",
    scientificPriority: "Moderate (Seismology)",
    terrainRisk: "Low (Flat regolith plain)",
    category: "Plain",
    isRealSite: true
  }
];

// 3. SIMULATED BASE & MARSWALK ROUTE DATA (Clearly Tagged [SIMULATED])
export const SIMULATED_MISSION_DATA = {
  missionTag: "MARS-360-ALPHA",
  missionStatus: "OPERATIONAL",
  currentSol: 142,
  solLocalTime: "14:26:12 MTC", // Mars Time Coordinated
  primarySite: "Jezero Delta Base Alpha",
  crewMembers: 4,
  activeEva: "EVA-018: Fan Delta Core Sampling",
  commsDelaySeconds: 742, // One-way light time ~12.3 minutes (Earth-Mars orbital geometry)
  simulatedDisclaimer: "[SIMULATED DATA FOR 2026 SPACE APPS PROTOTYPE]"
};

// 4. SIMULATED ROUTE WAYPOINTS FOR JEZERO CRATER MARSWALK
export const SIMULATED_ROUTES = [
  {
    id: "route-alpha",
    name: "Route 1: Delta Front Sediment Traverse [SIMULATED]",
    targetSite: "Jezero Crater Delta",
    difficulty: "Moderate",
    totalDistanceMeters: 4200,
    estimatedDurationMinutes: 195,
    suitPowerUsagePercent: 38,
    oxygenReserveUsagePercent: 42,
    radiationExposureMicroSv: 124,
    terrainDescription: "Cobble field transitioning into mudstone layered benches.",
    waypoints: [
      { id: "WP-01", name: "Delta Base Alpha Airlock", dist: "0 m", slope: "0.5°", danger: "Low", type: "Depot" },
      { id: "WP-02", name: "Kodiak Butte Observation Point", dist: "1,150 m", slope: "4.2°", danger: "Moderate", type: "Geology" },
      { id: "WP-03", name: "Scarp Core Sampling Site #3", dist: "2,400 m", slope: "7.8°", danger: "High", type: "Sample Return" },
      { id: "WP-04", name: "Ancient River Meander Ridge", dist: "3,350 m", slope: "2.1°", danger: "Low", type: "Hydrology" },
      { id: "WP-05", name: "Base Alpha South Ramp Return", dist: "4,200 m", slope: "1.0°", danger: "Low", type: "Return" },
    ]
  },
  {
    id: "route-beta",
    name: "Route 2: Crater Rim Reconnaissance [SIMULATED]",
    targetSite: "Jezero North Rim",
    difficulty: "High",
    totalDistanceMeters: 8900,
    estimatedDurationMinutes: 380,
    suitPowerUsagePercent: 74,
    oxygenReserveUsagePercent: 81,
    radiationExposureMicroSv: 248,
    terrainDescription: "Steep regolith scree, impact breccia outcrops, boulder fields.",
    waypoints: [
      { id: "WP-11", name: "North Perimeter Depot", dist: "0 m", slope: "1.2°", danger: "Low", type: "Depot" },
      { id: "WP-12", name: "Breccia Talus Transition", dist: "2,800 m", slope: "11.5°", danger: "High", type: "Hazard" },
      { id: "WP-13", name: "Rim Crest Panorama Overlook", dist: "5,400 m", slope: "14.2°", danger: "Severe", type: "Survey" },
      { id: "WP-14", name: "Rim Descent Path Bravo", dist: "7,100 m", slope: "9.0°", danger: "High", type: "Traverse" },
      { id: "WP-15", name: "Airlock Primary", dist: "8,900 m", slope: "1.0°", danger: "Low", type: "Return" },
    ]
  }
];

// 5. SIMULATED SURVIVAL & EVA METRICS
export const INITIAL_SIMULATED_TELEMETRY = {
  suitPressureKPa: 29.6, // Typical Apollo/EMU suit ~29.6 kPa (100% O2)
  coreTempC: 37.1,
  ambientExtTempC: -58.4,
  ambientPressurePa: 618,
  suitO2Fraction: 99.4,
  suitO2RemainingMin: 320,
  batteryLevelPercent: 86,
  heartRateBpm: 84,
  metabolicRateWatts: 240,
  radiationRateMicroSvH: 28.5,
  co2ScrubberEfficiencyPercent: 98.2,
  hydrationLevelPercent: 91,
};
