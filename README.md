# 🗺️ GeoVista3D — 100% Offline 3D Vector Map Application

A high-performance, 100% offline 3D Map application built with **Next.js 16**, **MapLibre GL JS v5.13**, and **TileServer GL**.

It features **3D extruded building elevations**, custom camera view controls, building inspection popups, and **offline vector text labels** (street names, district labels, and landmark POIs) without requiring internet connectivity or external API keys.

---

## 🚀 How to Run on Any Machine (Mac, Windows, Linux)

### Prerequisites

Make sure you have installed:
1. **[Node.js 18+](https://nodejs.org/)**
2. **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (Make sure Docker is running)

---

### Step 1: Download Map Dataset

1. Download **`uae.mbtiles.zip`** from the [GeoVista3D GitHub Release v1.0.0](https://github.com/Anantharaj/GeoVista3D/releases/tag/v1.0.0).
2. Unzip `uae.mbtiles.zip` to extract **`uae.mbtiles`**.
3. Move `uae.mbtiles` into the `tileserver/` folder inside this project.

The `tileserver/` folder should now look like:
```
tileserver/
├── config.json
├── uae.mbtiles   <-- (Downloaded & unzipped file)
└── styles/
    └── style.json
```

---

### Step 2: Start Local TileServer GL (Docker)

Open your terminal in the project root directory and run the command for your OS:

#### 🍏 macOS / 🐧 Linux:
```bash
docker run --name uae-tileserver -d \
  -v $(pwd)/tileserver:/data \
  -p 8080:8080 \
  maptiler/tileserver-gl --config /data/config.json
```

#### 🪟 Windows (PowerShell):
```powershell
docker run --name uae-tileserver -d -v "${PWD}/tileserver:/data" -p 8080:8080 maptiler/tileserver-gl --config /data/config.json
```

#### 🪟 Windows (Command Prompt - CMD):
```cmd
docker run --name uae-tileserver -d -v "%cd%/tileserver:/data" -p 8080:8080 maptiler/tileserver-gl --config /data/config.json
```

> **Verify**: Open [http://localhost:8080](http://localhost:8080) in your browser. You should see TileServer GL serving vector tiles.

---

### Step 3: Run the Next.js App

1. Install project dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser!

---

## 🌟 Key Features

- **3D Building Extrusions**: Real height elevations rendered in WebGL shaders.
- **100% Offline**: Zero calls to external Mapbox or Google APIs. Works with Wi-Fi disabled.
- **Vector Text Labels**: Local PBF font glyphs (`Open Sans Regular`, `Noto Sans Regular`) served directly by Next.js.
- **Location Presets**: Direct camera navigation (Al Maryah Island, Dubai Downtown, Abu Dhabi Corniche, Dubai Marina).
- **Interactive Inspection**: Hover and click cards displaying building height, level count, and building type.

---

## 📦 Project Structure

```
GeoVista3D/
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
│   ├── uae.mbtiles        # Place downloaded uae.mbtiles here
│   └── styles/
│       └── style.json     # MapLibre vector style with 3D extrusions & labels
├── next.config.mjs        # MapLibre Webpack & Turbopack aliases
└── README.md
```

---

## 🛠️ Production Build

To build and run the production bundle:

```bash
npm run build
npm run start
```
