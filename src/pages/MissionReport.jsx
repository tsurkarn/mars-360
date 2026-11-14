import React from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  Database, 
  Compass, 
  Layers, 
  Award,
  ExternalLink
} from 'lucide-react';
import Badge from '../components/common/Badge';
import { 
  MARS_PLANETARY_CONSTANTS, 
  SIMULATED_MISSION_DATA, 
  MARS_LANDMARKS 
} from '../data/marsData';

export default function MissionReport() {
  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const reportData = {
      project: "MARS 360",
      challenge: "2026 NASA Space Apps Challenge",
      generatedAt: new Date().toISOString(),
      planetaryFacts: MARS_PLANETARY_CONSTANTS,
      simulatedMission: SIMULATED_MISSION_DATA,
      landmarks: MARS_LANDMARKS
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MARS-360-MISSION-REPORT-SOL-${SIMULATED_MISSION_DATA.currentSol}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-telemetry-cyan font-semibold">
              SCIENTIFIC DEBRIEF
            </span>
            <Badge variant="real">MISSION SUMMARY</Badge>
          </div>
          <h1 className="text-xl md:text-2xl font-display font-bold text-white tracking-wide">
            MISSION REPORT & SCIENTIFIC OBSERVATION LOG
          </h1>
          <p className="text-xs md:text-sm text-slate-300 font-sans max-w-2xl">
            Official operational debrief, geological findings log, and verified scientific provenance documentation for the 2026 NASA Space Apps Challenge.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            className="px-3.5 py-2 rounded-xl bg-space-900 hover:bg-space-850 border border-space-700 text-xs font-mono font-bold text-slate-200 transition-colors flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5 text-mars-orange" />
            <span>EXPORT JSON</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-mars-orange hover:bg-mars-rust text-white text-xs font-mono font-bold transition-colors flex items-center gap-2 shadow-glow-orange"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINT REPORT</span>
          </button>
        </div>
      </div>

      {/* Primary Report Paper Panel */}
      <div className="rounded-2xl bg-space-900 border border-space-800 p-6 space-y-6">
        {/* Document Header */}
        <div className="border-b border-space-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono text-mars-orange font-bold uppercase tracking-wider">
              2026 NASA SPACE APPS CHALLENGE • PROTOTYPE DOSSIER
            </div>
            <h2 className="text-xl font-display font-bold text-white mt-1">
              MARS 360 | SCIENTIFIC TRAVERSE MANIFEST
            </h2>
            <div className="text-xs font-mono text-slate-400 mt-1">
              MISSION IDENTIFIER: <span className="text-slate-200 font-bold">{SIMULATED_MISSION_DATA.missionTag}</span> | SOL: <span className="text-mars-orange font-bold">{SIMULATED_MISSION_DATA.currentSol}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-space-950 border border-space-800 text-right font-mono text-xs">
            <div className="text-slate-500 text-[10px]">VERIFICATION STATUS</div>
            <div className="text-telemetry-emerald font-bold flex items-center justify-end gap-1.5 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>DATA PROVENANCE CERTIFIED</span>
            </div>
          </div>
        </div>

        {/* Scientific Integrity & NASA Fact Provenance Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-telemetry-cyan" />
            <h3 className="font-display font-bold text-sm text-white">
              DATASET PROVENANCE & INTEGRITY PROTOCOL
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-space-800 text-slate-500 uppercase text-[10px]">
                  <th className="py-2 px-3">DATA FIELD</th>
                  <th className="py-2 px-3">VALUE / SPECIFICATION</th>
                  <th className="py-2 px-3">PROVENANCE SOURCE</th>
                  <th className="py-2 px-3">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-space-800/60">
                <tr>
                  <td className="py-2.5 px-3 text-white font-medium">Martian Mean Radius</td>
                  <td className="py-2.5 px-3 text-slate-300">3,389.5 km</td>
                  <td className="py-2.5 px-3 text-slate-400">NASA Planetary Data System (PDS)</td>
                  <td className="py-2.5 px-3"><Badge variant="real">REAL FACT</Badge></td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-white font-medium">Surface Gravity</td>
                  <td className="py-2.5 px-3 text-slate-300">3.721 m/s² (0.379 g)</td>
                  <td className="py-2.5 px-3 text-slate-400">NASA Mars Fact Sheet</td>
                  <td className="py-2.5 px-3"><Badge variant="real">REAL FACT</Badge></td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-white font-medium">Mean Surface Pressure</td>
                  <td className="py-2.5 px-3 text-slate-300">610 Pa (6.10 mbar)</td>
                  <td className="py-2.5 px-3 text-slate-400">Viking / Curiosity In-Situ Pressure Sens.</td>
                  <td className="py-2.5 px-3"><Badge variant="real">REAL FACT</Badge></td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-white font-medium">Atmosphere CO₂ Fraction</td>
                  <td className="py-2.5 px-3 text-slate-300">95.32%</td>
                  <td className="py-2.5 px-3 text-slate-400">Curiosity SAM Spectrometer</td>
                  <td className="py-2.5 px-3"><Badge variant="real">REAL FACT</Badge></td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-white font-medium">EVA Suit Battery & Pressure</td>
                  <td className="py-2.5 px-3 text-slate-300">86% / 29.6 kPa</td>
                  <td className="py-2.5 px-3 text-mars-amber">MARS 360 Life Support Simulator</td>
                  <td className="py-2.5 px-3"><Badge variant="simulated">SIMULATED</Badge></td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-white font-medium">Jezero Delta Waypoints</td>
                  <td className="py-2.5 px-3 text-slate-300">5 Planned Route Waypoints</td>
                  <td className="py-2.5 px-3 text-mars-amber">MARS 360 Marswalk Traverse Engine</td>
                  <td className="py-2.5 px-3"><Badge variant="simulated">SIMULATED</Badge></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Geological Observations */}
        <div className="space-y-3 pt-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-mars-orange" />
            <h3 className="font-display font-bold text-sm text-white">
              SOL 142 SCIENTIFIC FIELD LOG SUMMARY
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-space-950 border border-space-800 space-y-2">
              <div className="font-display font-bold text-slate-200">
                1. Lacustrine Delta Stratigraphy (Jezero Crater)
              </div>
              <p className="text-slate-400 font-sans leading-relaxed">
                Observed fine-grained mudstone benches exhibiting cross-bedding consistent with ancient sustained aqueous flow into a paleolake basin during the Noachian–Hesperian transition epoch (~3.7 Ga).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-space-950 border border-space-800 space-y-2">
              <div className="font-display font-bold text-slate-200">
                2. Mineralogical Signatures (Astrobiology Target)
              </div>
              <p className="text-slate-400 font-sans leading-relaxed">
                Clay-bearing phyllosilicates (smectite) identified in proximity to carbonate-rich lithologies, indicating high biosignature preservation potential for future Mars sample return caching.
              </p>
            </div>
          </div>
        </div>

        {/* Space Apps Challenge Team Footer */}
        <div className="pt-4 border-t border-space-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-mars-orange" />
            <span>2026 NASA SPACE APPS CHALLENGE SUBMISSION</span>
          </div>
          <div>
            DEVELOPED BY THE <span className="text-white font-bold">MARS 360 TEAM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
