# 🗺️ GeoVista3D — 100% Offline 3D Vector Map Application

A high-performance, 100% offline 3D Map application built with **Next.js 16**, **MapLibre GL JS v5.13**, and **TileServer GL**.

It features **3D extruded building elevations**, custom camera view controls, building inspection popups, and **offline vector text labels** (street names, district labels, and landmark POIs) without requiring internet connectivity or external API keys.

---

## 🚀 How to Run on Any Machine (Mac, Windows, Linux)

### Prerequisites

1. **[Node.js 18+](https://nodejs.org/)** installed.
2. **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** installed.

---

### Step 1: Download Map Dataset

1. Download **`uae.mbtiles.zip`** from the [GeoVista3D GitHub Release v1.0.0](https://github.com/Anantharaj/GeoVista3D/releases/tag/v1.0.0).
2. Unzip `uae.mbtiles.zip` to extract **`uae.mbtiles`**.
3. Place **`uae.mbtiles`** inside the `tileserver/` folder in your project directory.

Your `tileserver/` folder should look like this:
```
GeoVista3D/
└── tileserver/
    ├── config.json
    ├── uae.mbtiles   <-- (Extracted file goes here)
    └── styles/
        └── style.json
```

---

### Step 2: Start Local TileServer GL (Docker)

Follow these exact 3 steps to start the tile server in Docker:

1. **Open Docker Desktop**: Launch the **Docker Desktop** application on your computer and make sure it is running (green status).
2. **Open Terminal**: Open your terminal (or Command Prompt) and navigate to the project folder:
   ```bash
   cd path/to/GeoVista3D
   ```
3. **Run Docker Command**: Copy and paste the command for your operating system and press **Enter**:

   - 🍏 **macOS / 🐧 Linux**:
     ```bash
     docker run --name uae-tileserver -d -v "$(pwd)/tileserver:/data" -p 8080:8080 maptiler/tileserver-gl --config /data/config.json
     ```

   - 🪟 **Windows (PowerShell)**:
     ```powershell
     docker run --name uae-tileserver -d -v "${PWD}/tileserver:/data" -p 8080:8080 maptiler/tileserver-gl --config /data/config.json
     ```

   - 🪟 **Windows (Command Prompt - CMD)**:
     ```cmd
     docker run --name uae-tileserver -d -v "%cd%/tileserver:/data" -p 8080:8080 maptiler/tileserver-gl --config /data/config.json
     ```

> **How to check if it worked**: Open [http://localhost:8080](http://localhost:8080) in your browser. You will see the TileServer GL page showing vector tiles and styles.

---

### Step 3: Run the Next.js App

1. In your terminal, install project dependencies:
```bash
npm install
```

2. Start the development web server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see your 3D Map!

---

## 🌟 Key Features

- **3D Building Extrusions**: Real height elevations rendered in WebGL shaders.
- **100% Offline**: Zero calls to external Mapbox or Google APIs. Works with Wi-Fi disabled.
- **Vector Text Labels**: Local PBF font glyphs (`Open Sans Regular`, `Noto Sans Regular`) served directly by Next.js.
- **Location Presets**: Direct camera navigation (Al Maryah Island, Dubai Downtown, Abu Dhabi Corniche, Dubai Marina).
- **Interactive Inspection**: Hover and click cards displaying building height, level count, and building type.

---

## 🛠️ Stop or Restart TileServer GL

- **Stop TileServer**:
  ```bash
  docker stop uae-tileserver
  ```
- **Restart TileServer**:
  ```bash
  docker start uae-tileserver
  ```
- **Remove Container**:
  ```bash
  docker rm -f uae-tileserver
  ```
