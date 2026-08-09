# 🗺️ Offline 3D Vector Map Application

A high-performance, 100% offline 3D Map application built with **Next.js 16**, **MapLibre GL JS v5.13**, and **TileServer GL**.

It features 3D extruded building heights, custom camera controls, building inspection popups, and offline vector text labels (street names, district labels, and landmark POIs) without requiring internet connectivity or external API keys.

---

## 🌟 Key Features

- **3D Building Extrusions**: Interpolated building heights rendered in WebGL shaders.
- **100% Air-Gapped & Offline**: Zero calls to external Mapbox or Google APIs.
- **Vector Text Labels**: Local PBF font glyphs (`Open Sans Regular`, `Noto Sans Regular`) served directly by Next.js.
- **Location Presets**: Dynamic camera pan/pitch presets (e.g., Al Maryah Island, Dubai Downtown, Abu Dhabi Corniche, Dubai Marina).
- **Interactive Inspection**: Hover and click cards displaying building height, levels, and type.
- **Robust Build Setup**: Custom Next.js Turbopack/Webpack aliases ensuring zero SSR or WebWorker import errors.

---

## 🏗️ Architecture

```
                  ┌─────────────────────────────────────────┐
                  │       Planetiler 3D Vector Tiles        │
                  │             (uae.mbtiles)               │
                  └────────────────────┬────────────────────┘
                                       │
                                       ▼ (Local Docker Mount)
                  ┌─────────────────────────────────────────┐
                  │     TileServer GL Docker Container      │
                  │         (http://localhost:8080)         │
                  └────────────────────┬────────────────────┘
                                       │
                                       ▼ (Vector Tiles + WebGL Rendering)
                  ┌─────────────────────────────────────────┐
                  │          Next.js 16 Application         │
                  │         (http://localhost:3000)         │
                  └─────────────────────────────────────────┘
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js 18+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/)

---

### Step 1: Run Local TileServer GL

1. Place your vector tiles file `uae.mbtiles` inside a local data folder (e.g. `./tileserver`).
2. Start the TileServer GL Docker container:

```bash
docker run --name uae-tileserver -d \
  -v $(pwd)/tileserver:/data \
  -p 8080:8080 \
  maptiler/tileserver-gl --config /data/config.json
```

Verify that TileServer GL is running by visiting [http://localhost:8080](http://localhost:8080).

---

### Step 2: Run the Next.js Frontend

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Project Structure

```
offline-3d-map/
├── public/
│   └── fonts/             # Offline PBF font glyph ranges
├── src/
│   ├── app/
│   │   ├── fonts/         # Next.js route handler for font fallback
│   │   ├── globals.css
│   │   └── page.js
│   ├── components/
│   │   └── Offline3DMap.jsx # MapLibre GL 3D Map Component
│   └── data/
│       └── locations.js   # UAE preset coordinates
├── tileserver/
│   ├── config.json        # TileServer GL configuration
│   └── styles/
│       └── style.json     # MapLibre vector style with 3D extrusions & labels
├── next.config.mjs        # MapLibre Webpack & Turbopack aliases
└── README.md
```

---

## 🛠️ Production Build

To test and deploy the production bundle:

```bash
npm run build
npm run start
```
