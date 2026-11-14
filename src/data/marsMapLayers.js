/**
 * NASA MARS TREK AUTHENTIC WMTS MAP LAYERS & METADATA
 * 
 * Rules strictly followed:
 * - Uses official NASA Mars Trek / JPL Solar System Treks WMTS tile endpoints.
 * - Exact scientific instruments, native spatial resolutions, and coverage bounds are documented.
 * - No fake Earth OpenStreetMap or invented NASA data.
 */

export const MARS_MAP_LAYERS = [
  {
    id: 'mola_color',
    name: 'MOLA Global Color Shaded Relief',
    shortName: 'MOLA Color',
    category: 'Topography',
    instrument: 'Mars Orbiter Laser Altimeter (MOLA) + HRSC',
    mission: 'Mars Global Surveyor (MGS) & Mars Express',
    nativeResolution: '463 meters/pixel (8 ppd)',
    maxZoom: 7,
    minZoom: 0,
    format: 'image/jpeg',
    coverage: 'Global (-180° to +180° Lon, -90° to +90° Lat)',
    isGlobal: true,
    capabilitiesUrl: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/WMTSCapabilities.xml',
    tileUrlPattern: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/default/default028mm/{z}/{row}/{col}.jpg',
    description: 'Global topographic elevation model where colors represent surface height relative to the Martian datum (areoid), from Hellas Planitia (-8.2 km) to the summit of Olympus Mons (+21.3 km).',
    attribution: 'NASA / JPL / GSFC / USGS Astrogeology / DLR',
    legendType: 'elevation',
    elevationRange: {
      min: -8200,
      max: 21287,
      unit: 'meters'
    }
  },
  {
    id: 'mola_shade',
    name: 'MOLA Grayscale Shaded Relief',
    shortName: 'MOLA Hillshade',
    category: 'Topography',
    instrument: 'MGS MOLA & Mars Express HRSC Blend',
    mission: 'Mars Global Surveyor / ESA Mars Express',
    nativeResolution: '200 meters/pixel',
    maxZoom: 8,
    minZoom: 0,
    format: 'image/jpeg',
    coverage: 'Global (-180° to +180° Lon, -90° to +90° Lat)',
    isGlobal: true,
    capabilitiesUrl: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MOLA_blend200ppx_HRSC_Shade_clon0dd_200mpp_lzw/1.0.0/WMTSCapabilities.xml',
    tileUrlPattern: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MOLA_blend200ppx_HRSC_Shade_clon0dd_200mpp_lzw/1.0.0/default/default028mm/{z}/{row}/{col}.jpg',
    description: 'High-contrast hillshade illuminated from the northwest to reveal ridges, impact crater rims, fault scarps, and volcanic calderas without color bias.',
    attribution: 'NASA / JPL / DLR / Freie Universität Berlin',
    legendType: 'grayscale'
  },
  {
    id: 'themis_day_ir',
    name: 'THEMIS Daytime Infrared Global Mosaic',
    shortName: 'THEMIS Day IR',
    category: 'Infrared & Composition',
    instrument: 'Thermal Emission Imaging System (THEMIS)',
    mission: '2001 Mars Odyssey',
    nativeResolution: '100 meters/pixel (100m Controlled Mosaic v2)',
    maxZoom: 9,
    minZoom: 0,
    format: 'image/png',
    coverage: 'Global Equirectangular (-180° to +180° Lon, -65° to +65° Lat)',
    isGlobal: true,
    capabilitiesUrl: 'https://trek.nasa.gov/tiles/Mars/EQ/THEMIS_DayIR_ControlledMosaics_100m_v2_oct2018/1.0.0/WMTSCapabilities.xml',
    tileUrlPattern: 'https://trek.nasa.gov/tiles/Mars/EQ/THEMIS_DayIR_ControlledMosaics_100m_v2_oct2018/1.0.0/default/default028mm/{z}/{row}/{col}.png',
    description: 'Thermal infrared brightness temperatures captured at ~5:00 PM local solar time. High thermal inertia bedrock and ejecta appear warm/bright; loose fine dust mantles appear dark.',
    attribution: 'NASA / JPL / Arizona State University (ASU)',
    legendType: 'thermal'
  },
  {
    id: 'viking_color',
    name: 'Viking MDIM 2.1 Color Global Mosaic',
    shortName: 'Viking Color',
    category: 'Visible Imagery',
    instrument: 'Visual Imaging Subsystem (VIS)',
    mission: 'Viking Orbiters 1 & 2',
    nativeResolution: '232 meters/pixel',
    maxZoom: 7,
    minZoom: 0,
    format: 'image/jpeg',
    coverage: 'Global (-180° to +180° Lon, -90° to +90° Lat)',
    isGlobal: true,
    capabilitiesUrl: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/WMTSCapabilities.xml',
    tileUrlPattern: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/default/default028mm/{z}/{row}/{col}.jpg',
    description: 'The definitive planetary color visual mosaic created by the USGS Astrogeology Science Center from thousands of red- and violet-filtered Viking Orbiter photographs.',
    attribution: 'NASA / USGS Astrogeology Science Center',
    legendType: 'visible'
  },
  {
    id: 'ctx_jezero',
    name: 'MRO CTX Jezero Crater Controlled Mosaic',
    shortName: 'CTX Jezero (6m)',
    category: 'High-Res Context',
    instrument: 'Context Camera (CTX)',
    mission: 'Mars Reconnaissance Orbiter (MRO)',
    nativeResolution: '6.0 meters/pixel',
    maxZoom: 13,
    minZoom: 5,
    format: 'image/png',
    coverage: 'Regional: Jezero Crater & Nili Planum (77.16°E to 77.70°E, 18.21°N to 18.72°N)',
    isGlobal: false,
    bbox: [77.1604655, 18.2110274, 77.6991776, 18.7211945],
    capabilitiesUrl: 'https://trek.nasa.gov/tiles/Mars/EQ/JEZ_ctx_B_soc_008_orthoMosaic_6m_Eqc_latTs0_lon0/1.0.0/WMTSCapabilities.xml',
    tileUrlPattern: 'https://trek.nasa.gov/tiles/Mars/EQ/JEZ_ctx_B_soc_008_orthoMosaic_6m_Eqc_latTs0_lon0/1.0.0/default/default028mm/{z}/{row}/{col}.png',
    description: 'High-resolution panchromatic context imagery bridging regional geology with rover traverse exploration around Jezero Crater floor, western fan, and inlet channel.',
    attribution: 'NASA / JPL / Malin Space Science Systems (MSSS) / USGS',
    legendType: 'highres'
  },
  {
    id: 'hirise_jezero',
    name: 'MRO HiRISE Jezero Crater Orthomosaic',
    shortName: 'HiRISE Jezero (25cm)',
    category: 'Ultra High-Res',
    instrument: 'High Resolution Imaging Science Experiment (HiRISE)',
    mission: 'Mars Reconnaissance Orbiter (MRO)',
    nativeResolution: '0.25 meters/pixel (25 cm)',
    maxZoom: 17,
    minZoom: 8,
    format: 'image/png',
    coverage: 'Ultra-localized: Perseverance landing site & Jezero Delta (77.22°E to 77.58°E, 18.30°N to 18.67°N)',
    isGlobal: false,
    bbox: [77.2229331, 18.3067994, 77.583964, 18.669315],
    capabilitiesUrl: 'https://trek.nasa.gov/tiles/Mars/EQ/JEZ_hirise_soc_006_orthoMosaic_25cm_Eqc_latTs0_lon0_first_dd/1.0.0/WMTSCapabilities.xml',
    tileUrlPattern: 'https://trek.nasa.gov/tiles/Mars/EQ/JEZ_hirise_soc_006_orthoMosaic_25cm_Eqc_latTs0_lon0_first_dd/1.0.0/default/default028mm/{z}/{row}/{col}.png',
    description: 'Ultra-high-resolution photogrammetrically controlled orthomosaic showing individual meter-scale boulders, ripple crests, eroded delta remnants, and the Mars 2020 landing ellipse.',
    attribution: 'NASA / JPL / University of Arizona / USGS',
    legendType: 'ultrares'
  }
];

export const MARS_FLY_TARGETS = [
  {
    id: 'jezero',
    name: 'Jezero Crater (Perseverance & HiRISE)',
    coordinates: [77.45, 18.38],
    zoom: 9,
    description: 'Landing site of Mars 2020 Perseverance. Rich in river delta sediments with authentic HiRISE & CTX coverage.',
    feature: 'Ancient River Delta & Paleolake',
    suggestedLayer: 'hirise_jezero'
  },
  {
    id: 'olympus',
    name: 'Olympus Mons',
    coordinates: [-133.80, 18.65], // 226.2°E -> -133.8°W
    zoom: 4,
    description: 'Largest volcano in the solar system. Reaches 21.9 km above datum.',
    feature: 'Shield Volcano Caldera',
    suggestedLayer: 'mola_color'
  },
  {
    id: 'valles',
    name: 'Valles Marineris (Candor Chasma)',
    coordinates: [-59.20, -13.90], // 300.8°E -> -59.2°W
    zoom: 4,
    description: 'Massive canyon system over 4,000 km long and up to 7 km deep.',
    feature: 'Tectonic Rift Canyon',
    suggestedLayer: 'mola_color'
  },
  {
    id: 'gale',
    name: 'Gale Crater (Mount Sharp / Curiosity)',
    coordinates: [137.44, -5.38],
    zoom: 7,
    description: '154-km impact crater explored by Curiosity rover since 2012.',
    feature: 'Sedimentary Mound (Aeolis Mons)',
    suggestedLayer: 'themis_day_ir'
  },
  {
    id: 'elysium',
    name: 'Elysium Planitia (InSight Lander)',
    coordinates: [135.62, 4.50],
    zoom: 5,
    description: 'Smooth volcanic plain where InSight measured Martian seismicity.',
    feature: 'Smooth Volcanic Plain',
    suggestedLayer: 'viking_color'
  },
  {
    id: 'global',
    name: 'Global Mars Equirectangular View',
    coordinates: [0, 0],
    zoom: 1,
    description: 'Planetary baseline view centered at Prime Meridian (0° Lon, 0° Lat).',
    feature: 'Full Planetary Globe',
    suggestedLayer: 'mola_color'
  }
];
