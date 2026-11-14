import React, { useEffect, useRef, useState, useMemo } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import XYZ from 'ol/source/XYZ';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import Polygon from 'ol/geom/Polygon';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import Fill from 'ol/style/Fill';
import CircleStyle from 'ol/style/Circle';
import TileGrid from 'ol/tilegrid/TileGrid';
import { defaults as defaultControls } from 'ol/control';
import { 
  MapPin, 
  Plus, 
  Crosshair, 
  Layers, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut,
  Sparkles,
  MousePointer
} from 'lucide-react';
import { fetchMarsElevation } from '../../utils/marsGeo';
import Badge from '../common/Badge';

export default function RouteMapOpenLayers({ 
  waypoints, 
  onAddWaypoint, 
  onSelectWaypoint,
  activeWaypointId,
  isEditMode = false
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const routeSourceRef = useRef(null);
  const [clickToAdd, setClickToAdd] = useState(false);
  const [cursorCoords, setCursorCoords] = useState({ lon: 77.45, lat: 18.38 });

  // NASA Mars Equirectangular TileGrid
  const marsTileGrid = useMemo(() => {
    const resolutions = [];
    for (let z = 0; z <= 18; z++) {
      resolutions.push(360 / (256 * Math.pow(2, z + 1)));
    }
    return new TileGrid({
      extent: [-180, -90, 180, 90],
      origin: [-180, 90],
      resolutions: resolutions,
      tileSize: 256
    });
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // 1. MOLA Elevation Basemap
    const molaSource = new XYZ({
      projection: 'EPSG:4326',
      tileGrid: marsTileGrid,
      tileUrlFunction: (tileCoord) => {
        const z = tileCoord[0];
        const x = tileCoord[1];
        const y = tileCoord[2];
        const maxCols = 2 * Math.pow(2, z);
        const maxRows = Math.pow(2, z);
        if (x < 0 || x >= maxCols || y < 0 || y >= maxRows) return null;
        return `https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/default/default028mm/${z}/${y}/${x}.jpg`;
      }
    });

    const molaLayer = new TileLayer({
      source: molaSource,
      zIndex: 0
    });

    // 2. HiRISE Jezero 25cm Overlay Layer
    const hiriseSource = new XYZ({
      projection: 'EPSG:4326',
      tileGrid: marsTileGrid,
      tileUrlFunction: (tileCoord) => {
        const z = tileCoord[0];
        const x = tileCoord[1];
        const y = tileCoord[2];
        const maxCols = 2 * Math.pow(2, z);
        const maxRows = Math.pow(2, z);
        if (x < 0 || x >= maxCols || y < 0 || y >= maxRows) return null;

        // Bbox filter
        const tileRes = 360 / (256 * Math.pow(2, z + 1));
        const tileMinLon = -180 + x * 256 * tileRes;
        const tileMaxLon = tileMinLon + 256 * tileRes;
        const tileMaxLat = 90 - y * 256 * tileRes;
        const tileMinLat = tileMaxLat - 256 * tileRes;

        if (tileMaxLon < 77.2229 || tileMinLon > 77.5840 || tileMaxLat < 18.3068 || tileMinLat > 18.6693) {
          return null;
        }

        return `https://trek.nasa.gov/tiles/Mars/EQ/JEZ_hirise_soc_006_orthoMosaic_25cm_Eqc_latTs0_lon0_first_dd/1.0.0/default/default028mm/${z}/${y}/${x}.png`;
      }
    });

    const hiriseLayer = new TileLayer({
      source: hiriseSource,
      opacity: 0.85,
      zIndex: 10
    });

    // 3. Vector Layer for Route Trajectory & Waypoint Pins
    const routeSource = new VectorSource();
    routeSourceRef.current = routeSource;

    // HiRISE Footprint Box
    const hiriseBox = new Feature({
      geometry: new Polygon([[
        [77.2229, 18.3068],
        [77.5840, 18.3068],
        [77.5840, 18.6693],
        [77.2229, 18.6693],
        [77.2229, 18.3068]
      ]]),
      name: 'HiRISE 25cm Coverage Ellipse'
    });
    hiriseBox.setStyle(new Style({
      stroke: new Stroke({ color: 'rgba(249, 115, 22, 0.7)', width: 1.5, lineDash: [4, 4] }),
      fill: new Fill({ color: 'rgba(249, 115, 22, 0.04)' })
    }));
    routeSource.addFeature(hiriseBox);

    const vectorLayer = new VectorLayer({
      source: routeSource,
      zIndex: 20
    });

    // Initial center around Jezero
    const map = new Map({
      target: mapContainerRef.current,
      layers: [molaLayer, hiriseLayer, vectorLayer],
      view: new View({
        projection: 'EPSG:4326',
        center: [77.45, 18.40],
        zoom: 9,
        minZoom: 2,
        maxZoom: 16
      }),
      controls: defaultControls({ zoom: false, rotate: false, attribution: false })
    });

    mapInstanceRef.current = map;

    // Pointer move listener
    map.on('pointermove', (evt) => {
      if (evt.coordinate) {
        setCursorCoords({
          lon: Math.round(evt.coordinate[0] * 10000) / 10000,
          lat: Math.round(evt.coordinate[1] * 10000) / 10000
        });
      }
    });

    // Click on map to add waypoint
    map.on('click', async (evt) => {
      if (!clickToAdd) return;
      if (evt.coordinate) {
        const [lon, lat] = evt.coordinate;
        const elev = await fetchMarsElevation(lon, lat);
        if (onAddWaypoint) {
          onAddWaypoint({
            id: `wp-${Date.now()}`,
            name: `Waypoint ${waypoints.length}`,
            coords: [Math.round(lon * 10000) / 10000, Math.round(lat * 10000) / 10000],
            elevation: elev,
            type: 'waypoint'
          });
        }
      }
    });

    return () => {
      map.setTarget(null);
    };
  }, [clickToAdd]);

  // Update Route Features whenever waypoints change
  useEffect(() => {
    if (!routeSourceRef.current) return;
    const source = routeSourceRef.current;

    // Clear previous route lines and points (keep footprint box)
    const features = source.getFeatures().filter(f => f.get('name') === 'HiRISE 25cm Coverage Ellipse');
    source.clear();
    features.forEach(f => source.addFeature(f));

    if (waypoints.length >= 2) {
      // 1. Add Trajectory LineString
      const coords = waypoints.map(w => w.coords);
      const lineFeature = new Feature({
        geometry: new LineString(coords),
        name: 'Marswalk Trajectory Line'
      });

      // Neon cyan route path with dark casing
      lineFeature.setStyle([
        new Style({
          stroke: new Stroke({ color: '#030712', width: 6 })
        }),
        new Style({
          stroke: new Stroke({ color: '#38bdf8', width: 3, lineDash: [8, 4] })
        })
      ]);
      source.addFeature(lineFeature);
    }

    // 2. Add Waypoint Pin Features
    waypoints.forEach((wp, idx) => {
      const isStart = idx === 0;
      const isDest = idx === waypoints.length - 1;
      const isSelected = wp.id === activeWaypointId;

      const pinColor = isStart ? '#10b981' : isDest ? '#ef4444' : '#38bdf8';
      const labelText = isStart ? 'START' : isDest ? 'DEST' : `WP-${idx}`;

      const pointFeature = new Feature({
        geometry: new Point(wp.coords),
        name: wp.name,
        waypointData: wp
      });

      pointFeature.setStyle(new Style({
        image: new CircleStyle({
          radius: isSelected ? 9 : 7,
          fill: new Fill({ color: pinColor }),
          stroke: new Stroke({ color: '#ffffff', width: isSelected ? 3 : 2 })
        }),
        text: new Text({
          text: `${labelText}: ${wp.name.split(' (')[0]}`,
          offsetY: -16,
          font: 'bold 11px "JetBrains Mono", monospace',
          fill: new Fill({ color: '#ffffff' }),
          stroke: new Stroke({ color: '#030712', width: 3 }),
          backgroundFill: new Fill({ color: isSelected ? 'rgba(224, 83, 51, 0.9)' : 'rgba(3, 7, 18, 0.85)' }),
          padding: [2, 6, 2, 6]
        })
      }));

      source.addFeature(pointFeature);
    });
  }, [waypoints, activeWaypointId]);

  const handleZoom = (delta) => {
    if (!mapInstanceRef.current) return;
    const view = mapInstanceRef.current.getView();
    view.animate({ zoom: view.getZoom() + delta, duration: 250 });
  };

  const handleCenterRoute = () => {
    if (!mapInstanceRef.current || waypoints.length === 0) return;
    const view = mapInstanceRef.current.getView();
    // Center at first waypoint or midpoint
    const midIdx = Math.floor(waypoints.length / 2);
    view.animate({
      center: waypoints[midIdx].coords,
      zoom: 10,
      duration: 600
    });
  };

  return (
    <div className="relative w-full rounded-2xl bg-space-950 border border-space-700 shadow-panel overflow-hidden flex flex-col">
      {/* Top Map Action Toolbar */}
      <div className="p-3 bg-space-900 border-b border-space-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-mars-orange" />
          <span className="font-display font-bold text-white uppercase text-sm">
            MARSWALK TRAVERSE MAPPER
          </span>
          <Badge variant="real">MOLA + HiRISE 25cm</Badge>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setClickToAdd(!clickToAdd)}
            className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 transition-all ${
              clickToAdd
                ? 'bg-mars-orange text-white border-mars-orange shadow-glow-orange animate-pulse'
                : 'bg-space-850 hover:bg-space-800 border-space-700 text-slate-300'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{clickToAdd ? 'CLICK MAP TO DROP WP' : 'ADD WAYPOINT ON MAP'}</span>
          </button>

          <button
            onClick={handleCenterRoute}
            className="px-2.5 py-1.5 rounded-lg bg-space-850 hover:bg-space-800 border border-space-700 text-slate-300 transition-colors"
            title="Focus Route Center"
          >
            CENTER ROUTE
          </button>
        </div>
      </div>

      {/* Main OpenLayers Map Canvas */}
      <div className="relative w-full h-[460px] bg-[#030712] select-none">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Click Mode Banner */}
        {clickToAdd && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-mars-orange text-white text-xs font-mono font-bold shadow-glow-orange border border-white/20 flex items-center gap-2 z-20">
            <MousePointer className="w-3.5 h-3.5" />
            <span>CLICK ANYWHERE ON MARS MAP TO PLACE WAYPOINT</span>
          </div>
        )}

        {/* Bottom Left Coordinate Telemetry HUD */}
        <div className="absolute bottom-3 left-3 z-20 pointer-events-none">
          <div className="px-3 py-2 rounded-xl bg-space-950/90 backdrop-blur-md border border-space-700 font-mono text-xs space-y-0.5">
            <div className="text-telemetry-cyan font-semibold text-[11px]">
              CURSOR: {cursorCoords.lat.toFixed(4)}° N, {cursorCoords.lon.toFixed(4)}° E
            </div>
            <div className="text-[10px] text-slate-400">
              ORBITAL BASELINE: <span className="text-white">MOLA ELEVATION DATUM</span>
            </div>
          </div>
        </div>

        {/* Floating Zoom Buttons */}
        <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-1.5">
          <button
            onClick={() => handleZoom(1)}
            className="p-2 rounded-lg bg-space-950/90 hover:bg-space-900 border border-space-700 text-white shadow-lg"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleZoom(-1)}
            className="p-2 rounded-lg bg-space-950/90 hover:bg-space-900 border border-space-700 text-white shadow-lg"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
