'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { LOCATIONS } from '@/data/locations';

export { LOCATIONS };

export default function Offline3DMap({ onSelectLocation, selectedLocId }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [pitch, setPitch] = useState(65);
  const [bearing, setBearing] = useState(-30);
  const [zoom, setZoom] = useState(16.2);
  const [is2DView, setIs2DView] = useState(false);
  const [hoveredBuilding, setHoveredBuilding] = useState(null);
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const styleUrl = 'http://localhost:8080/styles/uae-3d-style/style.json';

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center: [54.3892, 24.5028],
      zoom: 15.2,
      pitch: 65,
      bearing: -30,
      maxPitch: 85,
      pitchWithRotate: true,
      dragRotate: true
    });

    mapRef.current = map;

    map.on('error', (e) => {
      console.warn('MapLibre Detailed Error:', e?.error?.message || e?.error || e);
      if (e?.error?.message?.includes('fetch')) {
        setMapError('Unable to connect to TileServer GL on http://localhost:8080');
      }
    });

    map.on('load', () => {
      setIsLoaded(true);
      map.setPitch(65);
      map.setBearing(-30);
      map.resize();

      map.on('rotate', () => setBearing(Math.round(map.getBearing())));
      map.on('pitch', () => {
        const p = Math.round(map.getPitch());
        setPitch(p);
        setIs2DView(p < 5);
      });
      map.on('zoom', () => setZoom(map.getZoom().toFixed(1)));

      map.on('mousemove', '3d-buildings-extrusion', (e) => {
        if (e.features && e.features.length > 0) {
          map.getCanvas().style.cursor = 'pointer';
          const f = e.features[0];
          const props = f.properties || {};
          const height = props.render_height || props.height || (props['building:levels'] ? props['building:levels'] * 3.6 : 15);
          const levels = props['building:levels'] || Math.round(height / 3.6);

          setHoveredBuilding({
            name: props.name || (props['building:name'] ? props['building:name'] : '3D Building Extrusion'),
            type: props.building || 'structure',
            height: height,
            levels: levels
          });
        }
      });

      map.on('mouseleave', '3d-buildings-extrusion', () => {
        map.getCanvas().style.cursor = '';
        setHoveredBuilding(null);
      });
    });

    const handleResize = () => {
      if (mapRef.current) mapRef.current.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const flyToLocation = (loc) => {
    if (!mapRef.current) return;
    if (onSelectLocation) onSelectLocation(loc);

    mapRef.current.flyTo({
      center: [loc.lng, loc.lat],
      zoom: loc.zoom,
      pitch: loc.pitch,
      bearing: loc.bearing,
      duration: 2500,
      essential: true
    });
  };

  useEffect(() => {
    if (selectedLocId) {
      const loc = LOCATIONS.find(l => l.id === selectedLocId);
      if (loc) flyToLocation(loc);
    }
  }, [selectedLocId]);

  const toggle2D3D = () => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    if (is2DView) {
      map.easeTo({ pitch: 65, bearing: -30, duration: 1000 });
      setIs2DView(false);
    } else {
      map.easeTo({ pitch: 0, bearing: 0, duration: 1000 });
      setIs2DView(true);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[600px] flex flex-col bg-[#eef2f6] overflow-hidden">
      <div ref={mapContainer} className="w-full h-full absolute inset-0 z-0" />

      {mapError && (
        <div className="absolute top-4 left-4 z-50 bg-rose-900/90 text-rose-200 px-4 py-2 rounded-xl text-xs font-mono shadow-2xl">
          ⚠️ {mapError}
        </div>
      )}

      {hoveredBuilding && (
        <div className="absolute top-4 left-4 z-20 bg-slate-900/95 backdrop-blur text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 shadow-2xl flex flex-col gap-1 pointer-events-none">
          <span className="font-bold text-blue-400 text-xs">{hoveredBuilding.name}</span>
          <div className="flex gap-3 text-[11px] text-slate-300 font-mono">
            <span>Type: {hoveredBuilding.type}</span>
            <span>Height: {Math.round(hoveredBuilding.height)}m</span>
            <span>Floors: {hoveredBuilding.levels}</span>
          </div>
        </div>
      )}

      <div className="absolute top-16 right-4 z-10 flex flex-col gap-1.5 shadow-xl rounded-lg bg-white border border-slate-200 overflow-hidden pointer-events-auto">
        <button
          onClick={() => mapRef.current && mapRef.current.zoomIn()}
          className="w-9 h-9 flex items-center justify-center text-slate-700 hover:bg-slate-100 text-lg font-bold transition border-b border-slate-200"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={() => mapRef.current && mapRef.current.zoomOut()}
          className="w-9 h-9 flex items-center justify-center text-slate-700 hover:bg-slate-100 text-lg font-bold transition border-b border-slate-200"
          title="Zoom Out"
        >
          −
        </button>
        <button
          onClick={toggle2D3D}
          className={`w-9 h-9 flex items-center justify-center text-xs font-extrabold transition border-b border-slate-200 ${
            is2DView ? 'bg-blue-50 text-blue-600' : 'bg-slate-800 text-white'
          }`}
          title="Toggle 2D / 3D View"
        >
          {is2DView ? '3D' : '2D'}
        </button>
      </div>

      <div className="absolute bottom-4 left-4 z-10 bg-slate-900/95 backdrop-blur border border-slate-700/80 text-white text-xs px-3.5 py-2 rounded-xl shadow-2xl flex items-center gap-4 pointer-events-auto">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-emerald-300 text-[11px]">LOCAL TILESERVER GL (PORT 8080)</span>
        </div>
        <div className="h-4 w-px bg-slate-700"></div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Tilt:</span>
          <span className="font-mono text-blue-400 font-bold">{pitch}°</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Bearing:</span>
          <span className="font-mono text-purple-400 font-bold">{bearing}°</span>
        </div>
        <button
          onClick={() => {
            if (mapRef.current) {
              mapRef.current.easeTo({ pitch: 65, bearing: -30, zoom: 16.2 });
            }
          }}
          className="ml-2 text-[10px] bg-blue-600 hover:bg-blue-500 text-white px-2 py-0.5 rounded font-bold"
        >
          Reset 3D View
        </button>
      </div>
    </div>
  );
}
