# MARS 360 | Scientific Mars Exploration & Marswalk Planning

> **2026 NASA Space Apps Challenge Project Prototype**  
> A mission-control web application engineered for planetary scientists and astronauts to explore Martian topography, plan EVA traverses, and monitor simulated life support metrics.

---

## 🚀 Key Features Built in Phase 1

1. **Dark Planetary Mission-Control Aesthetic**
   - High-contrast telemetry design inspired by modern aerospace operations consoles (deep space black `#030712`, Martian rust `#99351e`, amber accents, and telemetry cyan `#38bdf8`).
   - Clean, professional typography with live Martian Sol clock, Earth UTC synchronization, and realistic light-travel time delay indicator.

2. **Mission Dashboard**
   - Instant overview of real Martian physical constants (gravity 3.721 m/s², mean pressure 610 Pa, atmospheric breakdown) alongside simulated Jezero Delta Base operations.
   - Interactive surface map preview with quick action routing.

3. **Interactive Planetary Cartography (`PlanetaryMap`)**
   - SVG-based topographic cartography incorporating NASA MOLA (Mars Orbiter Laser Altimeter) datum baselines and coordinate grids.
   - Regional exploration dossiers for historic and target sites:
     - **Jezero Crater** (Perseverance & Ingenuity / Ancient Delta)
     - **Gale Crater & Mount Sharp** (Curiosity MSL / Stratigraphy)
     - **Olympus Mons** (21.9 km shield volcano & basal scarp)
     - **Valles Marineris** (4,000 km tectonic rift chasm)
     - **Elysium Planitia** (InSight Lander seismic baseline)

4. **Marswalk Traverse Planner (`RoutePlanning`)**
   - Waypoint navigation and slope inclination analysis.
   - Consumable budgeting: estimated oxygen tank depletion, suit battery draw, and cumulative radiation exposure.
   - Dynamic waypoint creator for simulated custom field traverses.

5. **Life Support & Survival Simulator (`SurvivalSimulation`)**
   - Real-time EVA suit telemetry dashboard: 29.6 kPa pure O₂ internal pressure vs 618 Pa ambient Mars pressure.
   - Closed-loop environmental subsystems: CO₂ amine scrubber efficiency, biometric vitals, and thermal control.
   - Interactive hazard injection simulator: test suit response to Regional Dust Storms, Diurnal Nightfall Freezes (-90°C), and Solar Particle Radiation Events.

6. **Scientific Observation Log & Mission Debrief (`MissionReport`)**
   - Formal debrief document certifying data provenance (NASA Fact Sheet / PDS verified data vs simulated telemetry).
   - One-click JSON data export and print-ready report generation.

---

## 🪐 Scientific Integrity Protocol

To uphold the standards of the NASA Space Apps Challenge:
- **Verified NASA Datasets**: Atmospheric gas fractions (95.32% CO₂), surface gravity ($3.721\text{ m/s}^2$), mean surface atmospheric pressure ($610\text{ Pa}$ / $6.1\text{ mbar}$), and geographical coordinates are derived from the NASA Planetary Data System (PDS) and Mars Fact Sheet.
- **Simulated Metrics**: All mission operations, EVA bio-telemetry, suit pressures, and future route waypoints are clearly tagged with `[SIMULATED]` badges.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: React 18 (Component-based architecture)
- **Bundler**: Vite 5
- **Styling**: Tailwind CSS with custom mission-control palette
- **Icons**: Lucide React
- **Client-Side Only**: 100% responsive, fast, zero unnecessary backend overhead

### Directory Layout
```
mars-360/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── common/         # Badge, MetricCard reusable atoms
│   │   ├── layout/         # Header, Sidebar responsive navigation
│   │   └── map/            # MarsInteractiveMap cartography engine
│   ├── data/
│   │   └── marsData.js     # NASA constants & simulated telemetry models
│   ├── pages/
│   │   ├── Dashboard.jsx   # Mission Control overview
│   │   ├── PlanetaryMap.jsx# Full orbital cartography explorer
│   │   ├── RoutePlanning.jsx # Marswalk traverse & waypoint planner
│   │   ├── SurvivalSimulation.jsx # Life support & hazard simulator
│   │   └── MissionReport.jsx# Debrief & data provenance verification
│   ├── App.jsx             # Root layout controller
│   ├── index.css           # Tailwind base & mission-control themes
│   └── main.jsx            # React root mount
├── package.json
├── tailwind.config.js
├── vite.config.js
└── run.sh                  # One-click start script
```

---

## 💻 How to Start the Application

### Option A: Using the Quick-Start Script
From the project root (`/home/matrix/mars-360`):
```bash
./run.sh
```

### Option B: Using Standard NPM Commands
```bash
# Add Node to PATH if using the local toolchain
export PATH="$PWD/.tools/node/bin:$PATH"

# Start the Vite development server
npm run dev

# Or build the optimized production package
npm run build

# Preview the production build
npm run preview
```

The application will be accessible in your web browser at:
`http://localhost:3000`

---

## 📋 Next Phases (Roadmap)
- 3D WebGL / Three.js Martian globe rendering
- Real-time NASA API integration (InSight weather archive / APOD)
- Elevation profile graph rendering along custom waypoint paths
- Multi-crew EVA coordination & rover hitching simulation
