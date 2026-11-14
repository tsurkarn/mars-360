import React, { useState } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import PlanetaryMap from './pages/PlanetaryMap';
import RoutePlanning from './pages/RoutePlanning';
import SurvivalSimulation from './pages/SurvivalSimulation';
import MissionReport from './pages/MissionReport';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 flex flex-col font-sans grid-pattern relative selection:bg-mars-orange selection:text-white">
      {/* Planetary radial glow background */}
      <div className="fixed inset-0 mars-radial pointer-events-none opacity-60 z-0" />

      {/* Mission Control Top Header */}
      <Header 
        mobileOpen={mobileOpen} 
        setMobileOpen={setMobileOpen} 
        activePage={activePage} 
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
          {activePage === 'dashboard' && <Dashboard onNavigate={setActivePage} />}
          {activePage === 'map' && <PlanetaryMap onNavigate={setActivePage} />}
          {activePage === 'routes' && <RoutePlanning onNavigate={setActivePage} />}
          {activePage === 'survival' && <SurvivalSimulation />}
          {activePage === 'report' && <MissionReport />}
        </main>
      </div>
    </div>
  );
}
