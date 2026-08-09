'use client';

import React, { useState, useEffect } from 'react';
import { LOCATIONS } from '@/data/locations';
import Offline3DMap from '@/components/Offline3DMap';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [selectedLocId, setSelectedLocId] = useState('abudhabi-maryah');
  const [themeMode, setThemeMode] = useState('Minimal Light');
  const [showLocationDrawer, setShowLocationDrawer] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden flex flex-col bg-[#0b0f19] text-slate-100 select-none">
      {/* HEADER BAR (Matching AuraMap demo screenshot) */}
      <header className="h-12 px-4 bg-[#090d16] border-b border-slate-800/80 flex items-center justify-between z-20 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center font-bold text-white text-xs shadow-sm">
            A
          </div>
          <h1 className="font-bold text-sm text-slate-100 tracking-wide">
            AuraMap demo
          </h1>

          <div className="hidden md:flex items-center gap-1.5 ml-4 pl-4 border-l border-slate-800">
            {LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setSelectedLocId(loc.id)}
                className={`text-xs px-2.5 py-1 rounded-md transition ${
                  selectedLocId === loc.id
                    ? 'bg-blue-600/30 text-blue-300 font-semibold border border-blue-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {loc.name.split(' ')[0]} {loc.name.split(' ')[1] || ''}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLocationDrawer(!showLocationDrawer)}
            className="text-xs px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            📍 All Locations ({LOCATIONS.length})
          </button>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 font-medium">Theme</label>
            <select
              value={themeMode}
              onChange={(e) => setThemeMode(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-md text-xs font-semibold px-3 py-1 text-white focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
            >
              <option value="Minimal Light">Minimal Light</option>
              <option value="Minimal Dark">Minimal Dark</option>
              <option value="Cyberpunk">Cyberpunk Neon</option>
            </select>
          </div>
        </div>
      </header>

      {/* FULL-BLEED 3D MAP VIEWPORT */}
      <div className="relative flex-1 w-full h-[calc(100vh-3rem)] overflow-hidden">
        {!mounted ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white font-mono text-sm">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
              Loading UAE 3D WebGL Engine...
            </div>
          </div>
        ) : (
          <Offline3DMap
            selectedLocId={selectedLocId}
            onSelectLocation={(loc) => setSelectedLocId(loc.id)}
            themeMode={themeMode}
          />
        )}

        {showLocationDrawer && (
          <div className="absolute top-3 left-4 z-20 w-80 bg-slate-900/95 backdrop-blur border border-slate-700 rounded-xl p-4 shadow-2xl flex flex-col gap-3 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                🇦🇪 UAE 3D Skylines
              </h2>
              <button
                onClick={() => setShowLocationDrawer(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => {
                    setSelectedLocId(loc.id);
                    setShowLocationDrawer(false);
                  }}
                  className={`text-left p-3 rounded-lg border transition ${
                    selectedLocId === loc.id
                      ? 'bg-blue-600/20 border-blue-500/60 text-white'
                      : 'bg-slate-800/50 border-slate-800 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold text-white">{loc.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{loc.country}</div>
                  <div className="text-[10px] text-blue-400 mt-1 font-mono">{loc.type}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
