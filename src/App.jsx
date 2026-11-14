import React, { useState } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import PlanetaryMap from './pages/PlanetaryMap';
import RoutePlanning from './pages/RoutePlanning';
import SurvivalSimulation from './pages/SurvivalSimulation';
import MissionReport from './pages/MissionReport';
import { ROUTE_PRESETS } from './data/marsRoutePresets';
import { analyzeRoute } from './utils/marsGeo';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Shared Mission State across modules
  const [activeRoute, setActiveRoute] = useState(() => {
    const defaultRoute = ROUTE_PRESETS[0];
    const analysis = analyzeRoute(defaultRoute.waypoints);
    return {
      ...defaultRoute,
      ...analysis
    };
  });

  const [activeSurvival, setActiveSurvival] = useState({
    crewCount: 4,
    durationDays: 7,
    workHoursPerDay: 6,
    walkingSpeedKmh: 2.5,
    totalDistanceWalkedKm: 105.0,
    o2: { supplied: 32.0, consumed: 24.8, remaining: 7.2, percent: 22.5, isLow: true, isDepleted: false },
    water: { supplied: 110.0, consumed: 72.8, remaining: 37.2, percent: 33.8, isLow: false, isDepleted: false },
    power: { supplied: 90.0, consumed: 62.4, remaining: 27.6, percent: 30.7, isLow: false, isDepleted: false },
    verdict: {
      status: 'CAUTION',
      label: 'CAUTION: Depleting Safety Buffer (<25% Reserve)',
      badgeVariant: 'warning',
      rationale: 'Oxygen buffer drops to 22.5% (<25% threshold). Any EVA delay or leak requires immediate abort.'
    }
  });

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 flex flex-col font-sans grid-pattern relative selection:bg-mars-orange selection:text-white">
      {/* Planetary radial glow background */}
      <div className="fixed inset-0 mars-radial pointer-events-none opacity-60 z-0" />

      {/* Mission Control Top Header */}
      <Header 
        mobileOpen={mobileOpen} 
        setMobileOpen={setMobileOpen} 
        activePage={activePage} 
        onNavigate={setActivePage}
      />

      {/* Main Mission Control Body */}
      <div className="relative z-10 flex flex-1 w-full max-w-[1920px] mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* Central Workspace Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto max-w-full">
          {activePage === 'dashboard' && (
            <Dashboard 
              onNavigate={setActivePage} 
              activeRoute={activeRoute}
              activeSurvival={activeSurvival}
            />
          )}
          {activePage === 'map' && (
            <PlanetaryMap onNavigate={setActivePage} />
          )}
          {activePage === 'routes' && (
            <RoutePlanning 
              onNavigate={setActivePage} 
              onUpdateActiveRoute={(route, analysis) => {
                setActiveRoute({ ...route, ...analysis });
              }}
            />
          )}
          {activePage === 'survival' && (
            <SurvivalSimulation 
              onUpdateSurvivalState={(survivalState) => {
                setActiveSurvival(survivalState);
              }}
            />
          )}
          {activePage === 'report' && (
            <MissionReport 
              activeRoute={activeRoute}
              activeSurvival={activeSurvival}
              onNavigate={setActivePage}
            />
          )}
        </main>
      </div>
    </div>
  );
}
