import urllib from 'node:https';

/**
 * MARS 360 - Independent WMTS Layer Verification Suite
 * Validates each authentic NASA Mars Trek layer independently.
 */

const LAYERS = [
  {
    id: 'mola_color',
    name: 'MOLA Global Color Shaded Relief',
    capabilities: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/WMTSCapabilities.xml',
    sampleTile: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/default/default028mm/0/0/0.jpg',
    expectedType: 'image/jpeg'
  },
  {
    id: 'mola_shade',
    name: 'MOLA Grayscale Hillshade',
    capabilities: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MOLA_blend200ppx_HRSC_Shade_clon0dd_200mpp_lzw/1.0.0/WMTSCapabilities.xml',
    sampleTile: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MOLA_blend200ppx_HRSC_Shade_clon0dd_200mpp_lzw/1.0.0/default/default028mm/0/0/0.jpg',
    expectedType: 'image/jpeg'
  },
  {
    id: 'themis_day_ir',
    name: 'THEMIS Daytime Infrared Global Mosaic',
    capabilities: 'https://trek.nasa.gov/tiles/Mars/EQ/THEMIS_DayIR_ControlledMosaics_100m_v2_oct2018/1.0.0/WMTSCapabilities.xml',
    sampleTile: 'https://trek.nasa.gov/tiles/Mars/EQ/THEMIS_DayIR_ControlledMosaics_100m_v2_oct2018/1.0.0/default/default028mm/0/0/0.png',
    expectedType: 'image/png'
  },
  {
    id: 'viking_color',
    name: 'Viking MDIM 2.1 Color Global Mosaic',
    capabilities: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/WMTSCapabilities.xml',
    sampleTile: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/default/default028mm/0/0/0.jpg',
    expectedType: 'image/jpeg'
  },
  {
    id: 'ctx_jezero',
    name: 'MRO CTX Jezero Crater Mosaic (6m)',
    capabilities: 'https://trek.nasa.gov/tiles/Mars/EQ/JEZ_ctx_B_soc_008_orthoMosaic_6m_Eqc_latTs0_lon0/1.0.0/WMTSCapabilities.xml',
    // Tile at Jezero crater (z=8, row=101, col=366)
    sampleTile: 'https://trek.nasa.gov/tiles/Mars/EQ/JEZ_ctx_B_soc_008_orthoMosaic_6m_Eqc_latTs0_lon0/1.0.0/default/default028mm/8/101/366.png',
    expectedType: 'image/png'
  },
  {
    id: 'hirise_jezero',
    name: 'MRO HiRISE Jezero Crater Orthomosaic (25cm)',
    capabilities: 'https://trek.nasa.gov/tiles/Mars/EQ/JEZ_hirise_soc_006_orthoMosaic_25cm_Eqc_latTs0_lon0_first_dd/1.0.0/WMTSCapabilities.xml',
    // Tile at Jezero crater (z=12, row=1629, col=5858)
    sampleTile: 'https://trek.nasa.gov/tiles/Mars/EQ/JEZ_hirise_soc_006_orthoMosaic_25cm_Eqc_latTs0_lon0_first_dd/1.0.0/default/default028mm/12/1629/5858.png',
    expectedType: 'image/png'
  }
];

function checkUrl(url, method = 'HEAD') {
  return new Promise((resolve) => {
    const req = urllib.request(url, { method, headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve({
        status: res.statusCode,
        contentType: res.headers['content-type'],
        contentLength: res.headers['content-length']
      });
    });
    req.on('error', (err) => resolve({ status: 0, error: err.message }));
    req.setTimeout(8000, () => {
      req.destroy();
      resolve({ status: 0, error: 'Timeout' });
    });
    req.end();
  });
}

async function runTests() {
  console.log('================================================================');
  console.log(' NASA MARS TREK WMTS INDEPENDENT LAYER VERIFICATION SUITE');
  console.log('================================================================\n');

  let passed = 0;

  for (const layer of LAYERS) {
    process.stdout.write(`Testing [${layer.id}]: ${layer.name}...\n`);
    
    // 1. Check Capabilities XML
    const capRes = await checkUrl(layer.capabilities);
    const capOk = capRes.status === 200;
    console.log(`  - WMTS Capabilities XML: ${capOk ? 'PASS (HTTP 200)' : `FAIL (HTTP ${capRes.status})`}`);

    // 2. Check Sample Tile Delivery
    const tileRes = await checkUrl(layer.sampleTile);
    const tileOk = tileRes.status === 200 && tileRes.contentType?.includes(layer.expectedType);
    console.log(`  - Sample Tile Fetch:     ${tileOk ? `PASS (HTTP 200, ${tileRes.contentType}, ${tileRes.contentLength}B)` : `FAIL (HTTP ${tileRes.status})`}`);

    if (capOk && tileOk) {
      console.log(`  => RESULT: VERIFIED AUTHENTIC & OPERATIONAL\n`);
      passed++;
    } else {
      console.log(`  => RESULT: FAILED VERIFICATION\n`);
    }
  }

  console.log('================================================================');
  console.log(`Summary: ${passed} / ${LAYERS.length} layers verified successfully.`);
  console.log('================================================================');
}

runTests();
