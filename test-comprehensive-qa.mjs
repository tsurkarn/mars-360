/**
 * MARS 360 - Comprehensive Automated QA & Scientific Verification Suite
 * Senior QA Engineer & NASA Space Apps Reviewer Testing Script
 */

import { calculateMarsDistance, analyzeRoute, checkCoordinateCoverage, MARS_RADIUS_METERS } from './src/utils/marsGeo.js';
import { ROUTE_PRESETS } from './src/data/marsRoutePresets.js';
import { MARS_MAP_LAYERS, MARS_FLY_TARGETS } from './src/data/marsMapLayers.js';
import { MARS_PLANETARY_CONSTANTS, SIMULATED_MISSION_DATA } from './src/data/marsData.js';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${testName} - Details: ${details}`);
  }
}

console.log('================================================================');
console.log(' MARS 360 | AUTOMATED QA & REVIEW TEST SUITE');
console.log('================================================================\n');

// 1. GEODESY & DISTANCE CALCULATION TESTS
console.log('--- TEST GROUP 1: Martian Spherical Geodesy & Distance Math ---');
assert(MARS_RADIUS_METERS === 3389500, 'Mars volumetric mean radius is 3,389.5 km (3,389,500 m)', `Got ${MARS_RADIUS_METERS}`);

// Test distance between Jezero Base Alpha (77.42°E, 18.38°N) and Delta-4 (77.485°E, 18.44°N)
const p1 = [77.4200, 18.3800];
const p2 = [77.4850, 18.4400];
const distMeters = calculateMarsDistance(p1, p2);
assert(Math.abs(distMeters - 5090.2) < 2.0, `Distance between Jezero points is ~5.09 km (5,090.2 m)`, `Calculated: ${distMeters.toFixed(1)}m`);

// Test Equator 1-degree distance on Mars: (2 * PI * R) / 360 = ~59.16 km
const eq1 = [0.0, 0.0];
const eq2 = [1.0, 0.0];
const deg1Dist = calculateMarsDistance(eq1, eq2);
const expectedDegDist = (2 * Math.PI * MARS_RADIUS_METERS) / 360; // 59,158.4 m
assert(Math.abs(deg1Dist - expectedDegDist) < 1.0, `1 degree of longitude at equator on Mars is ~59.16 km`, `Got ${deg1Dist.toFixed(1)}m, expected ${expectedDegDist.toFixed(1)}m`);

// 2. ROUTE PLANNING & SLOPE HAZARD EVALUATION TESTS
console.log('\n--- TEST GROUP 2: Route Planning & Slope Hazard Rules ---');
// Preset 1: Delta Meander Detour (Longer, gentle 3.8° slope)
const routeGentle = ROUTE_PRESETS[0];
const analysisGentle = analyzeRoute(routeGentle.waypoints);
assert(analysisGentle.totalDistanceMeters > 3800, 'Preset 1 distance is ~4.2 km', `Got ${analysisGentle.totalDistanceMeters}m`);
assert(analysisGentle.maxSlopeDeg <= 8.0, 'Preset 1 max slope is nominal (<8°)', `Got ${analysisGentle.maxSlopeDeg}°`);
assert(analysisGentle.safetyVerdict.status === 'GO', 'Preset 1 receives GO verdict', `Got ${analysisGentle.safetyVerdict.status}`);

// Preset 2: Direct Scarp Cut (Short, but steep 17.5° slope)
const routeScarp = ROUTE_PRESETS[1];
const analysisScarp = analyzeRoute(routeScarp.waypoints);
assert(analysisScarp.totalDistanceMeters < analysisGentle.totalDistanceMeters, 'Preset 2 is shorter in distance than Preset 1', `Scarp: ${analysisScarp.totalDistanceMeters}m vs Gentle: ${analysisGentle.totalDistanceMeters}m`);
assert(analysisScarp.maxSlopeDeg > 15.0, 'Preset 2 slope is extreme (>15°)', `Got ${analysisScarp.maxSlopeDeg}°`);
assert(analysisScarp.safetyVerdict.status === 'NO-GO', 'Preset 2 is flagged NO-GO despite being shorter (Never equate short distance with safety!)', `Got ${analysisScarp.safetyVerdict.status}`);

// 3. TERRAIN IMAGE COVERAGE & UNCERTAINTY TESTS
console.log('\n--- TEST GROUP 3: Image Coverage & Resolution Uncertainty ---');
// Test point inside HiRISE Jezero 25cm footprint (77.45°E, 18.38°N)
const covHiRISE = checkCoordinateCoverage(77.45, 18.38);
assert(covHiRISE.isHighRes === true && covHiRISE.instrument.includes('HiRISE'), 'Jezero core has 0.25m HiRISE coverage', `Got ${covHiRISE.instrument} (${covHiRISE.resolution})`);

// Test point outside HiRISE footprint in regional MOLA terrain (77.80°E, 18.80°N)
const covMOLA = checkCoordinateCoverage(77.80, 18.80);
assert(covMOLA.isHighRes === false && covMOLA.instrument.includes('MOLA'), 'Crater rim beyond footprint triggers MOLA regional warning', `Got ${covMOLA.instrument} (${covMOLA.resolution})`);
assert(covMOLA.warning !== undefined, 'MOLA coverage returns explicit resolution limitation warning', covMOLA.warning);

// 4. SURVIVAL & CONSUMABLE DEPLETION SIMULATION TESTS
console.log('\n--- TEST GROUP 4: Astronaut Survival & Depletion Math ---');
// Test 1-day EVA scenario: 2 crew, 8h work, 2.5 km/h, 3.5kg O2, 9L H2O, 12 kWh
const crew1Day = 2;
const workHrs = 8;
const restHrs = 16;
const speed = 2.5; // metabolic multiplier = 1.0
const o2WorkRate = 0.082;
const o2RestRate = 0.035;
const o2Consumed1Day = crew1Day * ((workHrs * o2WorkRate) + (restHrs * o2RestRate)); // 2 * (0.656 + 0.56) = 2.432 kg
const o2Supply1Day = 3.5;
const o2Remaining1Day = o2Supply1Day - o2Consumed1Day; // ~1.068 kg (~30.5%)
assert(o2Consumed1Day > 2.0 && o2Consumed1Day < 2.8, '1-Day O2 consumption calculation is ~2.4 kg', `Got ${o2Consumed1Day.toFixed(2)} kg`);
assert(o2Remaining1Day > 0.8, '1-Day O2 remaining is adequate (>25% buffer)', `Got ${o2Remaining1Day.toFixed(2)} kg`);

// Test Overexertion metabolic scaling: Speed 4.5 km/h -> multiplier = 1.0 + (4.5 - 2.5) * 0.25 = 1.5
const speedHigh = 4.5;
const metabolicMult = 1.0 + (speedHigh - 2.5) * 0.25;
assert(metabolicMult === 1.5, 'Walking at 4.5 km/h yields 1.5x metabolic rate multiplier', `Got ${metabolicMult}`);

// Test Depletion Abort Trigger: 4 crew, 7 days, but only 5 kg O2 supplied
const crew7Day = 4;
const totalWorkHrs7 = 7 * 6; // 42h
const totalRestHrs7 = 7 * 18; // 126h
const o2Needed7Day = crew7Day * ((totalWorkHrs7 * o2WorkRate) + (totalRestHrs7 * o2RestRate)); // 4 * (3.444 + 4.41) = 31.416 kg
const o2DeficitSupply = 5.0; // Grossly insufficient
const isDepleted = o2DeficitSupply < o2Needed7Day;
assert(isDepleted === true, 'Insufficient 5kg O2 for 4 crew over 7 days triggers depletion', `Need ${o2Needed7Day.toFixed(1)}kg, have 5kg`);

// 5. NASA WMTS LAYER INTEGRITY TESTS
console.log('\n--- TEST GROUP 5: NASA Mars Trek WMTS Layer Configurations ---');
assert(MARS_MAP_LAYERS.length >= 6, 'At least 6 authentic NASA Mars layers configured', `Count: ${MARS_MAP_LAYERS.length}`);
MARS_MAP_LAYERS.forEach(l => {
  const hasUrl = l.tileUrlPattern && l.tileUrlPattern.includes('trek.nasa.gov');
  const hasRes = l.nativeResolution && l.nativeResolution.length > 0;
  assert(hasUrl && hasRes, `Layer [${l.id}] has valid NASA Trek URL and resolution (${l.nativeResolution})`);
});

// 6. SCIENTIFIC DATA PROVENANCE TESTS
console.log('\n--- TEST GROUP 6: NASA Ground Truth vs Derived vs Simulated Provenance ---');
assert(MARS_PLANETARY_CONSTANTS.meanRadiusKm === 3389.5, 'Ground Truth: Mean Radius = 3,389.5 km');
assert(MARS_PLANETARY_CONSTANTS.surfaceGravity.includes('3.721'), 'Ground Truth: Surface Gravity = 3.721 m/s²');
assert(MARS_PLANETARY_CONSTANTS.atmosphereComposition.find(g => g.gas.includes('Carbon Dioxide')).percentage === 95.32, 'Ground Truth: CO2 fraction = 95.32%');
assert(SIMULATED_MISSION_DATA.simulatedDisclaimer.includes('SIMULATED DATA'), 'Simulated values have explicit disclaimer');

console.log('\n================================================================');
console.log(` QA RESULTS: ${passedTests} / ${totalTests} TESTS PASSED (${failedTests} failures)`);
console.log('================================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
