import React, { useEffect, useRef, useState, useMemo } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Graticule from 'ol/layer/Graticule';
import XYZ from 'ol/source/XYZ';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Text from 'ol/style/Text';
import Fill from 'ol/style/Fill';
import TileGrid from 'ol/tilegrid/TileGrid';
import { defaults as defaultControls } from 'ol/control';
import { 
  Layers, 
  MapPin, 
  Compass, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Info, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle,
  Eye,
  Sliders,
  Crosshair,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { MARS_MAP_LAYERS, MARS_FLY_TARGETS } from '../../data/marsMapLayers';
import Badge from '../common/Badge';

export default function MarsOpenLayersMap({ onSelectLandmark }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const baseTileLayerRef = useRef(null);
  const ctxOverlayLayerRef = useRef(null);
  const hiriseOverlayLayerRef = useRef(null);
  const vectorLayerRef = useRef(null);
  const graticuleLayerRef = useRef(null);

  // State
  const [selectedBaseLayerId, setSelectedBaseLayerId] = useState('mola_color');
  const [showCtxOverlay, setShowCtxOverlay] = useState(true);
  const [showHiriseOverlay, setShowHiriseOverlay] = useState(true);
  const [showGraticule, setShowGraticule] = useState(true);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [overlayOpacity, setOverlayOpacity] = useState(0.85);

  // Telemetry Coordinates
  const [cursorCoords, setCursorCoords] = useState({ lon: 77.45, lat: 18.38 });
  const [viewState, setViewState] = useState({ zoom: 2, centerLon: 0, centerLat: 0 });
  const [isLoadingTiles, setIsLoadingTiles] = useState(false);
  const [tileErrorCount, setTileErrorCount] = useState(0);
  const [showCapabilitiesModal, setShowCapabilitiesModal] = useState(false);
  const [selectedPinInfo, setSelectedPinInfo] = useState(null);

  const activeBaseLayer = useMemo(() => {
    return MARS_MAP_LAYERS.find(l => l.id === selectedBaseLayerId) || MARS_MAP_LAYERS[0];
  }, [selectedBaseLayerId]);

  // NASA Mars Equirectangular TileGrid Specification
  // Extent: [-180, -90, 180, 90], origin: [-180, 90], 256x256 px tiles
  // At z=0: matrix is 2 cols x 1 row (512x256 px). Resolution = 360 / 512 = 0.703125 deg/px
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

  // Helper: create a NASA Mars Trek Tile Source
  const createMarsTileSource = (layerConfig) => {
    return new XYZ({
      projection: 'EPSG:4326',
      tileGrid: marsTileGrid,
      wrapX: true,
      tileUrlFunction: (tileCoord) => {
        const z = tileCoord[0];
        const x = tileCoord[1];
        const y = tileCoord[2]; // row from top
        const maxCols = 2 * Math.pow(2, z);
        const maxRows = Math.pow(2, z);

        // Bounds validation
        if (x < 0 || x >= maxCols || y < 0 || y >= maxRows) {
          return null;
        }

        // Check if regional layer has bounding box limit
        if (layerConfig.bbox && !layerConfig.isGlobal) {
          const tileRes = 360 / (256 * Math.pow(2, z + 1));
          const tileMinLon = -180 + x * 256 * tileRes;
          const tileMaxLon = tileMinLon + 256 * tileRes;
          const tileMaxLat = 90 - y * 256 * tileRes;
          const tileMinLat = tileMaxLat - 256 * tileRes;

          const [bMinLon, bMinLat, bMaxLon, bMaxLat] = layerConfig.bbox;
          // Discard tiles outside the regional mosaic footprint to prevent 404s
          if (tileMaxLon < bMinLon || tileMinLon > bMaxLon || tileMaxLat < bMinLat || tileMinLat > bMaxLat) {
            return null;
          }
        }

        return layerConfig.tileUrlPattern
          .replace('{z}', z)
          .replace('{row}', y)
          .replace('{col}', x);
      }
    });
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // 1. Basemap Layer
    const baseSource = createMarsTileSource(activeBaseLayer);
    const baseLayer = new TileLayer({
      source: baseSource,
      zIndex: 0
    });
    baseTileLayerRef.current = baseLayer;

    // Track Tile Loading Telemetry
    baseSource.on('tileloadstart', () => setIsLoadingTiles(true));
    baseSource.on('tileloadend', () => setIsLoadingTiles(false));
    baseSource.on('tileloaderror', () => {
      setIsLoadingTiles(false);
      setTileErrorCount(prev => prev + 1);
    });

    // 2. High-Res CTX Jezero Overlay Layer (6m)
    const ctxConfig = MARS_MAP_LAYERS.find(l => l.id === 'ctx_jezero');
    const ctxSource = createMarsTileSource(ctxConfig);
    const ctxLayer = new TileLayer({
      source: ctxSource,
      opacity: overlayOpacity,
      visible: showCtxOverlay,
      zIndex: 10
    });
    ctxOverlayLayerRef.current = ctxLayer;

    // 3. Ultra-Res HiRISE Jezero Overlay Layer (25cm)
    const hiriseConfig = MARS_MAP_LAYERS.find(l => l.id === 'hirise_jezero');
    const hiriseSource = createMarsTileSource(hiriseConfig);
    const hiriseLayer = new TileLayer({
      source: hiriseSource,
      opacity: overlayOpacity,
      visible: showHiriseOverlay,
      zIndex: 20
    });
    hiriseOverlayLayerRef.current = hiriseLayer;

    // 4. Vector Landmarks Layer (Pins & Bounding Boxes)
    const vectorSource = new VectorSource();
    
    // Add Landmark Pins
    MARS_FLY_TARGETS.filter(t => t.id !== 'global').forEach(target => {
      const pinFeature = new Feature({
        geometry: new Point(target.coordinates),
        name: target.name,
        targetData: target
      });

      pinFeature.setStyle(new Style({
        text: new Text({
          text: target.name.split(' (')[0],
          offsetY: -16,
          font: 'bold 11px "JetBrains Mono", monospace',
          fill: new Fill({ color: '#ffffff' }),
          stroke: new Stroke({ color: '#030712', width: 3 }),
          backgroundFill: new Fill({ color: 'rgba(3, 7, 18, 0.75)' }),
          padding: [2, 6, 2, 6]
        })
      }));

      vectorSource.addFeature(pinFeature);
    });

    // Add HiRISE & CTX Regional Footprint Polygons
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
      stroke: new Stroke({ color: '#f97316', width: 2, lineDash: [4, 4] }),
      fill: new Fill({ color: 'rgba(249, 115, 22, 0.08)' })
    }));
    vectorSource.addFeature(hiriseBox);

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      visible: showLandmarks,
      zIndex: 30
    });
    vectorLayerRef.current = vectorLayer;

    // 5. Graticule / Coordinate Grid Overlay
    const graticule = new Graticule({
      strokeStyle: new Stroke({
        color: 'rgba(56, 189, 248, 0.25)',
        width: 1,
        lineDash: [4, 4]
      }),
      showLabels: true,
      wrapX: true,
      visible: showGraticule,
      zIndex: 40
    });
    graticuleLayerRef.current = graticule;

    // Construct Map Instance in Planetary EPSG:4326 Projection
    const map = new Map({
      target: mapContainerRef.current,
      layers: [baseLayer, ctxLayer, hiriseLayer, graticule, vectorLayer],
      view: new View({
        projection: 'EPSG:4326',
        center: [0, 0],
        zoom: 2,
        minZoom: 0,
        maxZoom: 18,
        extent: [-180, -90, 180, 90]
      }),
      controls: defaultControls({ zoom: false, rotate: false, attribution: false })
    });

    mapInstanceRef.current = map;

    // Real-time Coordinate & View Telemetry Listeners
    map.on('pointermove', (evt) => {
      if (evt.coordinate) {
        let lon = evt.coordinate[0];
        let lat = evt.coordinate[1];
        // Normalize lon to -180..180
        lon = ((((lon + 180) % 360) + 360) % 360) - 180;
        lat = Math.max(-90, Math.min(90, lat));
        setCursorCoords({ lon, lat });
      }
    });

    map.on('moveend', () => {
      const view = map.getView();
      const center = view.getCenter();
      if (center) {
        setViewState({
          zoom: Math.round(view.getZoom() * 10) / 10,
          centerLon: Math.round(center[0] * 100) / 100,
          centerLat: Math.round(center[1] * 100) / 100
        });
      }
    });

    // Feature click
    map.on('click', (evt) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, f => f);
      if (feature && feature.get('targetData')) {
        const target = feature.get('targetData');
        setSelectedPinInfo(target);
        if (onSelectLandmark) onSelectLandmark(target);
      }
    });

    return () => {
      map.setTarget(null);
    };
  }, []);

  // Update Base Layer when selection changes
  useEffect(() => {
    if (!baseTileLayerRef.current) return;
    const newSource = createMarsTileSource(activeBaseLayer);
    baseTileLayerRef.current.setSource(newSource);
    setTileErrorCount(0);

    newSource.on('tileloadstart', () => setIsLoadingTiles(true));
    newSource.on('tileloadend', () => setIsLoadingTiles(false));
    newSource.on('tileloaderror', () => {
      setIsLoadingTiles(false);
      setTileErrorCount(prev => prev + 1);
    });
  }, [activeBaseLayer]);

  // Toggle Overlays
  useEffect(() => {
    if (ctxOverlayLayerRef.current) {
      ctxOverlayLayerRef.current.setVisible(showCtxOverlay);
      ctxOverlayLayerRef.current.setOpacity(overlayOpacity);
    }
  }, [showCtxOverlay, overlayOpacity]);

  useEffect(() => {
    if (hiriseOverlayLayerRef.current) {
      hiriseOverlayLayerRef.current.setVisible(showHiriseOverlay);
      hiriseOverlayLayerRef.current.setOpacity(overlayOpacity);
    }
  }, [showHiriseOverlay, overlayOpacity]);

  useEffect(() => {
    if (graticuleLayerRef.current) {
      graticuleLayerRef.current.setVisible(showGraticule);
    }
  }, [showGraticule]);

  useEffect(() => {
    if (vectorLayerRef.current) {
      vectorLayerRef.current.setVisible(showLandmarks);
    }
  }, [showLandmarks]);

  // Fly to target
  const handleFlyTo = (target) => {
    if (!mapInstanceRef.current) return;
    const view = mapInstanceRef.current.getView();
    view.animate({
      center: target.coordinates,
      zoom: target.zoom,
      duration: 1200
    });
    setSelectedPinInfo(target);
    if (target.suggestedLayer && target.suggestedLayer !== selectedBaseLayerId) {
      if (target.suggestedLayer === 'hirise_jezero' || target.suggestedLayer === 'ctx_jezero') {
        setShowHiriseOverlay(true);
        setShowCtxOverlay(true);
      } else {
        setSelectedBaseLayerId(target.suggestedLayer);
      }
    }
  };

  const handleZoom = (delta) => {
    if (!mapInstanceRef.current) return;
    const view = mapInstanceRef.current.getView();
    const currentZoom = view.getZoom();
    view.animate({
      zoom: Math.max(0, Math.min(18, currentZoom + delta)),
      duration: 300
    });
  };

  const handleResetNorth = () => {
    if (!mapInstanceRef.current) return;
    const view = mapInstanceRef.current.getView();
    view.animate({
      center: [0, 0],
      zoom: 2,
      duration: 800
    });
  };

  // Format planetary coordinate
  const formatMarsCoord = (lon, lat) => {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lonDir = lon >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lon).toFixed(4)}° ${lonDir}`;
  };

  return (
    <div className="relative w-full rounded-2xl bg-space-950 border border-space-700 shadow-panel overflow-hidden flex flex-col">
      {/* Top Console Command Bar */}
      <div className="bg-space-900/95 backdrop-blur-md border-b border-space-800 p-3 lg:p-4 flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-mars-orange/15 text-mars-orange border border-mars-orange/30">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm lg:text-base text-white tracking-wide">
                MARS EXPLORER WMTS CONSOLE
              </span>
              <Badge variant="real">NASA MARS TREK / JPL</Badge>
            </div>
            <p className="text-[11px] font-mono text-slate-400 hidden sm:block">
              Equirectangular (EPSG:4326 / EPSG:104905) • Plate Carrée Projection
            </p>
          </div>
        </div>

        {/* Live Loading & Telemetry Status Pill */}
        <div className="flex items-center gap-3">
          {isLoadingTiles ? (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-telemetry-cyan/15 border border-telemetry-cyan/30 text-telemetry-cyan text-xs font-mono">
              <div className="w-2 h-2 rounded-full bg-telemetry-cyan animate-ping" />
              <span>STREAMING TILES...</span>
            </div>
          ) : tileErrorCount > 0 ? (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-telemetry-amber/15 border border-telemetry-amber/30 text-telemetry-amber text-xs font-mono">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>OUT OF BOUNDS ({tileErrorCount})</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-telemetry-emerald/15 border border-telemetry-emerald/30 text-telemetry-emerald text-xs font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>WMTS FEED NOMINAL</span>
            </div>
          )}

          <button
            onClick={() => setShowCapabilitiesModal(true)}
            className="px-2.5 py-1 rounded-md bg-space-850 hover:bg-space-800 border border-space-700 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
            title="Inspect OGC WMTS GetCapabilities metadata"
          >
            <Info className="w-3.5 h-3.5 text-telemetry-cyan" />
            <span className="hidden md:inline">GETCAPABILITIES</span>
          </button>
        </div>
      </div>

      {/* Main Map Viewer Area */}
      <div className="relative w-full h-[580px] lg:h-[640px] bg-[#030712] overflow-hidden select-none">
        {/* OpenLayers Map Root Div */}
        <div ref={mapContainerRef} className="w-full h-full bg-[#04060d]" />

        {/* Bottom Left Coordinate HUD Readout */}
        <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
          <div className="p-3 rounded-xl bg-space-950/90 backdrop-blur-md border border-space-700/80 shadow-2xl font-mono text-xs space-y-1">
            <div className="flex items-center gap-2 text-telemetry-cyan font-bold">
              <Crosshair className="w-3.5 h-3.5 text-mars-orange animate-spin" style={{ animationDuration: '30s' }} />
              <span>MARS SURFACE COORDINATES</span>
            </div>
            <div className="text-white text-sm font-bold">
              {formatMarsCoord(cursorCoords.lon, cursorCoords.lat)}
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5 border-t border-space-800">
              <span>ZOOM: <span className="text-white font-semibold">{viewState.zoom}x</span></span>
              <span>DATUM: <span className="text-white font-semibold">MOLA AREOID</span></span>
              <span>RES: <span className="text-mars-orange font-semibold">{activeBaseLayer.nativeResolution}</span></span>
            </div>
          </div>
        </div>

        {/* Floating Zoom & Map Controls (Bottom Right) */}
        <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
          <button
            onClick={() => handleZoom(1)}
            className="p-2.5 rounded-xl bg-space-950/90 hover:bg-space-900 border border-space-700 text-slate-200 hover:text-white shadow-xl transition-colors"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(-1)}
            className="p-2.5 rounded-xl bg-space-950/90 hover:bg-space-900 border border-space-700 text-slate-200 hover:text-white shadow-xl transition-colors"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetNorth}
            className="p-2.5 rounded-xl bg-space-950/90 hover:bg-space-900 border border-space-700 text-slate-200 hover:text-white shadow-xl transition-colors"
            title="Reset Global View"
            aria-label="Reset Global View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Top Floating Layer & Flight Selector Drawer */}
        <div className="absolute top-4 left-4 right-4 lg:right-auto z-20 flex flex-col lg:flex-row gap-2 max-w-2xl">
          {/* Quick Flight Targets Dropdown */}
          <div className="p-2 rounded-xl bg-space-950/95 backdrop-blur-md border border-space-700 shadow-2xl flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 uppercase shrink-0 pl-1">
              FLY TO:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono py-0.5">
              {MARS_FLY_TARGETS.map(target => (
                <button
                  key={target.id}
                  onClick={() => handleFlyTo(target)}
                  className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                    selectedPinInfo?.id === target.id
                      ? 'bg-mars-orange text-white font-bold shadow-glow-orange'
                      : 'bg-space-850 hover:bg-space-800 text-slate-300 border border-space-750'
                  }`}
                >
                  {target.name.split(' (')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Top-Right Layer Config Drawer (Collapsible) */}
        <div className="absolute top-4 right-4 z-20 hidden lg:block w-80">
          <div className="p-4 rounded-2xl bg-space-950/95 backdrop-blur-md border border-space-700 shadow-2xl space-y-4">
            {/* Basemap Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-200 uppercase flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-mars-orange" />
                  AUTHENTIC MARS BASEMAP
                </span>
                <span className="text-[10px] font-mono text-slate-400">WMTS</span>
              </div>

              <div className="space-y-1.5">
                {MARS_MAP_LAYERS.filter(l => l.isGlobal).map(layer => (
                  <button
                    key={layer.id}
                    onClick={() => setSelectedBaseLayerId(layer.id)}
                    className={`w-full text-left p-2 rounded-lg border text-xs font-mono transition-all flex items-center justify-between ${
                      selectedBaseLayerId === layer.id
                        ? 'bg-space-850 border-mars-orange text-white font-bold shadow-glow-orange'
                        : 'bg-space-900/60 border-space-800 text-slate-400 hover:text-slate-200 hover:border-space-700'
                    }`}
                  >
                    <span>{layer.shortName}</span>
                    <span className="text-[10px] text-slate-500 font-sans">{layer.nativeResolution}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* High-Resolution Regional Overlays */}
            <div className="space-y-2 pt-2 border-t border-space-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-200 uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-telemetry-cyan" />
                  JEZERO HIGH-RES OVERLAYS
                </span>
                <span className="text-[10px] font-mono text-telemetry-cyan">MRO</span>
              </div>

              <div className="space-y-1.5 text-xs font-mono">
                <label className="flex items-center justify-between p-2 rounded-lg bg-space-900 border border-space-800 cursor-pointer hover:border-space-700">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showCtxOverlay}
                      onChange={(e) => setShowCtxOverlay(e.target.checked)}
                      className="rounded bg-space-800 border-space-700 text-mars-orange focus:ring-0"
                    />
                    <span className="text-slate-200">CTX Jezero Mosaic (6m)</span>
                  </div>
                  <Badge variant="real">MRO CTX</Badge>
                </label>

                <label className="flex items-center justify-between p-2 rounded-lg bg-space-900 border border-space-800 cursor-pointer hover:border-space-700">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showHiriseOverlay}
                      onChange={(e) => setShowHiriseOverlay(e.target.checked)}
                      className="rounded bg-space-800 border-space-700 text-mars-orange focus:ring-0"
                    />
                    <span className="text-slate-200">HiRISE Jezero Delta (25cm)</span>
                  </div>
                  <Badge variant="real">0.25 m/px</Badge>
                </label>

                {/* Opacity slider */}
                {(showCtxOverlay || showHiriseOverlay) && (
                  <div className="p-2 rounded-lg bg-space-900 border border-space-800 space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Overlay Opacity:</span>
                      <span className="text-white font-bold">{Math.round(overlayOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={overlayOpacity}
                      onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
                      className="w-full accent-mars-orange h-1 bg-space-800 rounded-lg cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Overlays: Graticule & Landmarks */}
            <div className="flex items-center justify-between pt-2 border-t border-space-800 text-xs font-mono">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={showGraticule}
                  onChange={(e) => setShowGraticule(e.target.checked)}
                  className="rounded bg-space-800 border-space-700 text-telemetry-cyan focus:ring-0"
                />
                <span>Graticule Grid</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={showLandmarks}
                  onChange={(e) => setShowLandmarks(e.target.checked)}
                  className="rounded bg-space-800 border-space-700 text-mars-orange focus:ring-0"
                />
                <span>Landmark Pins</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Scientific Legend & Data Source Attribution Bar */}
      <div className="p-4 bg-space-950 border-t border-space-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Scientific Legend for Active Layer */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-slate-400">
              LAYER SCIENTIFIC LEGEND:
            </span>
            <span className="text-xs font-display font-bold text-white">
              {activeBaseLayer.name}
            </span>
          </div>

          {activeBaseLayer.legendType === 'elevation' && (
            <div className="space-y-1">
              <div className="w-full lg:w-96 h-3 rounded bg-gradient-to-r from-[#2c105e] via-[#0064d2] via-[#00c853] via-[#ffeb3b] via-[#d50000] to-[#ffffff] border border-space-700" />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 w-full lg:w-96">
                <span>-8,200 m (Hellas)</span>
                <span>0 m (Datum)</span>
                <span>+21,287 m (Olympus)</span>
              </div>
            </div>
          )}

          {activeBaseLayer.legendType === 'thermal' && (
            <div className="space-y-1">
              <div className="w-full lg:w-96 h-3 rounded bg-gradient-to-r from-[#000000] via-[#5c5c5c] to-[#ffffff] border border-space-700" />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 w-full lg:w-96">
                <span>Low Thermal Inertia (Fine Dust)</span>
                <span>High Thermal Inertia (Bedrock)</span>
              </div>
            </div>
          )}

          {activeBaseLayer.legendType === 'grayscale' && (
            <div className="space-y-1">
              <div className="w-full lg:w-96 h-3 rounded bg-gradient-to-r from-[#111111] via-[#777777] to-[#eeeeee] border border-space-700" />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 w-full lg:w-96">
                <span>Shaded Slopes</span>
                <span>Sunlit Topography</span>
              </div>
            </div>
          )}

          {activeBaseLayer.legendType === 'visible' && (
            <div className="text-xs text-slate-400 font-sans">
              True-color Martian surface reflectance composite from Viking Orbiter VIS cameras (red & violet filters).
            </div>
          )}
        </div>

        {/* Right: Data Source Attribution & Provenance */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs font-mono border-t lg:border-t-0 lg:border-l border-space-800 pt-3 lg:pt-0 lg:pl-4">
          <div>
            <div className="text-[10px] text-slate-500 uppercase">AUTHENTIC SCIENTIFIC SOURCE</div>
            <div className="text-slate-200 font-bold">{activeBaseLayer.attribution}</div>
            <div className="text-slate-400 text-[11px] font-sans">
              Mission: {activeBaseLayer.mission} ({activeBaseLayer.nativeResolution})
            </div>
          </div>

          <a
            href={activeBaseLayer.capabilitiesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-space-900 hover:bg-space-850 border border-space-750 text-telemetry-cyan hover:underline flex items-center gap-1.5 self-start sm:self-auto shrink-0"
          >
            <span>WMTS XML</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* OGC WMTS GetCapabilities Inspector Modal */}
      {showCapabilitiesModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-space-900 border border-space-700 rounded-2xl max-w-3xl w-full max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-space-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-telemetry-cyan" />
                <span className="font-display font-bold text-white text-base">
                  OGC WMTS Capabilities Metadata Inspector
                </span>
              </div>
              <button
                onClick={() => setShowCapabilitiesModal(false)}
                className="text-slate-400 hover:text-white font-mono text-sm"
              >
                [CLOSE]
              </button>
            </div>

            <div className="p-5 overflow-y-auto font-mono text-xs space-y-4 text-slate-300">
              <div className="p-3 rounded-xl bg-space-950 border border-space-800 space-y-1">
                <div className="text-mars-orange font-bold">WMTS SERVICE IDENTIFIER:</div>
                <div className="text-white">{activeBaseLayer.name}</div>
                <div className="text-[11px] text-slate-400">Endpoint: {activeBaseLayer.capabilitiesUrl}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-space-950 border border-space-800 space-y-1">
                  <div className="text-slate-500 uppercase text-[10px]">CRS / PROJECTION</div>
                  <div className="text-telemetry-cyan font-bold">urn:ogc:def:crs:EPSG::104905 (Plate Carrée)</div>
                  <div className="text-[10px] text-slate-500">Mars Geocentric Spherical Coordinate System</div>
                </div>

                <div className="p-3 rounded-lg bg-space-950 border border-space-800 space-y-1">
                  <div className="text-slate-500 uppercase text-[10px]">TILE MATRIX SET</div>
                  <div className="text-telemetry-emerald font-bold">default028mm (256x256 px)</div>
                  <div className="text-[10px] text-slate-500">Origin: -180.0° Lon, +90.0° Lat</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-slate-400 uppercase text-[10px]">ALL CONNECTED NASA MARS TREK WMTS LAYERS</div>
                <div className="space-y-1">
                  {MARS_MAP_LAYERS.map(l => (
                    <div key={l.id} className="p-2 rounded bg-space-950 border border-space-850 flex items-center justify-between">
                      <div>
                        <span className="text-white font-semibold">{l.name}</span>
                        <span className="text-slate-500 text-[10px] ml-2">({l.nativeResolution})</span>
                      </div>
                      <Badge variant="real">{l.format.split('/')[1].toUpperCase()}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-space-800 flex justify-end">
              <button
                onClick={() => setShowCapabilitiesModal(false)}
                className="px-4 py-2 rounded-xl bg-mars-orange text-white text-xs font-mono font-bold hover:bg-mars-rust"
              >
                RETURN TO MAP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
