/**
 * LLEDO Aerotools — Turntable Image Generator v2
 * Realistic hangar environment, RAL 1003 product color, auto-flat orientation
 * 
 * Usage: node 3d-pipeline/generate-turntable.js [slug] [hFrames] [vLevels] [resolution]
 * Example: node 3d-pipeline/generate-turntable.js roller-h125 36 3 1200
 */

const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')
const http = require('http')

const slug = process.argv[2] || 'roller-h125'
const hFrames = parseInt(process.argv[3]) || 36
const vLevels = parseInt(process.argv[4]) || 3
const resolution = parseInt(process.argv[5]) || 1200

// Auto-detect file: try .stl first, then .glb
const stlPath = path.resolve(__dirname, '..', 'models', `${slug}.stl`)
const glbPath = path.resolve(__dirname, '..', 'models', `${slug}.glb`)
const modelPath = fs.existsSync(stlPath) ? stlPath : glbPath
const isSTL = modelPath.endsWith('.stl')
const outputDir = path.resolve(__dirname, '..', 'public', 'images', 'aerotools', '360', slug)

if (!fs.existsSync(modelPath)) {
  console.error(`❌ Model file not found: ${stlPath} or ${glbPath}`)
  process.exit(1)
}

fs.mkdirSync(outputDir, { recursive: true })

const elevations = vLevels === 1 ? [20]
  : vLevels === 3 ? [15, 25, 35]
  : [10, 18, 25, 32, 40]

const totalFrames = hFrames * vLevels

const htmlContent = `<!DOCTYPE html>
<html>
<head>
<style>* { margin:0; padding:0; } body { background: #1a1a1a; }</style>
<script type="importmap">
{ "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
} }
</script>
</head>
<body>
<canvas id="c" width="${resolution}" height="${resolution}" style="width:${resolution}px;height:${resolution}px;"></canvas>
<script type="module">
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';

const IS_STL = ${isSTL};
const canvas = document.getElementById('c');
const scene = new THREE.Scene();

// ═══════════════════════════════════════════════════════════════
// PROFESSIONAL STUDIO — Clean infinite backdrop
// ═══════════════════════════════════════════════════════════════

scene.background = new THREE.Color(0xd8dce2);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setSize(${resolution}, ${resolution});
renderer.setPixelRatio(1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000);

// ── Studio 3-point lighting ──

// Key light — main, slightly warm, from upper right
const keyLight = new THREE.DirectionalLight(0xfff8f0, 1.8);
keyLight.position.set(5, 12, 6);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
keyLight.shadow.camera.near = 0.1;
keyLight.shadow.camera.far = 50;
keyLight.shadow.camera.left = -8;
keyLight.shadow.camera.right = 8;
keyLight.shadow.camera.top = 8;
keyLight.shadow.camera.bottom = -8;
keyLight.shadow.bias = -0.0005;
keyLight.shadow.radius = 4;
scene.add(keyLight);

// Fill light — softer, from left, cool tone
const fillLight = new THREE.DirectionalLight(0xe8eeff, 0.6);
fillLight.position.set(-6, 6, 4);
scene.add(fillLight);

// Rim/back light — highlights edges, from behind
const rimLight = new THREE.DirectionalLight(0xffffff, 0.9);
rimLight.position.set(0, 8, -6);
scene.add(rimLight);

// Ambient — soft overall fill
scene.add(new THREE.AmbientLight(0xe0e4ea, 0.5));

// Top light — soft overhead
const topLight = new THREE.PointLight(0xffffff, 0.3, 20);
topLight.position.set(0, 10, 0);
scene.add(topLight);

// ── Studio Floor — Seamless cyclorama ──

// Curved backdrop (quarter-cylinder) that blends floor into background
const curveSegments = 40;
const curveRadius = 18;
const curveHeight = 14;
const curveGeo = new THREE.BufferGeometry();
const verts = [];
const uvs = [];
const indices = [];
const cols = 60;
for (let j = 0; j <= curveSegments; j++) {
  const t = j / curveSegments;
  const angle = t * Math.PI * 0.5;
  const y = Math.sin(angle) * curveRadius;
  const z = -(Math.cos(angle) * curveRadius - curveRadius);
  for (let i = 0; i <= cols; i++) {
    const x = (i / cols - 0.5) * 40;
    verts.push(x, y, z - 8);
    uvs.push(i / cols, t);
  }
}
for (let j = 0; j < curveSegments; j++) {
  for (let i = 0; i < cols; i++) {
    const a = j * (cols + 1) + i;
    const b = a + cols + 1;
    indices.push(a, b, a + 1, b, b + 1, a + 1);
  }
}
curveGeo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
curveGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
curveGeo.setIndex(indices);
curveGeo.computeVertexNormals();

const curveMat = new THREE.MeshStandardMaterial({
  color: 0xd8dce2,
  metalness: 0.0,
  roughness: 0.95,
  side: THREE.DoubleSide,
});
const curve = new THREE.Mesh(curveGeo, curveMat);
scene.add(curve);

// Floor — smooth, slightly reflective
const floorGeo = new THREE.PlaneGeometry(40, 40);
const floorMat = new THREE.MeshStandardMaterial({
  color: 0xc8ccd4,
  metalness: 0.15,
  roughness: 0.6,
});
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// ═══════════════════════════════════════════════════════════════
// RENDER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

window.__renderFrame = function(hAngle, elevation, distance) {
  const theta = THREE.MathUtils.degToRad(hAngle);
  const phi = THREE.MathUtils.degToRad(elevation);
  camera.position.set(
    distance * Math.sin(theta) * Math.cos(phi),
    distance * Math.sin(phi) + 0.3,
    distance * Math.cos(theta) * Math.cos(phi)
  );
  camera.lookAt(0, 0.8, 0);
  renderer.render(scene, camera);
};

// ═══════════════════════════════════════════════════════════════
// LOAD MODEL
// ═══════════════════════════════════════════════════════════════

try {
  const res = await fetch('/model-file');
  const buffer = await res.arrayBuffer();
  let model;

  if (IS_STL) {
    const stlLoader = new STLLoader();
    const geometry = stlLoader.parse(buffer);
    geometry.computeVertexNormals();

    // Realistic brushed aluminum / industrial metal
    const material = new THREE.MeshStandardMaterial({
      color: 0xb8bcc4,
      metalness: 0.55,
      roughness: 0.35,
    });
    model = new THREE.Mesh(geometry, material);
    model.castShadow = true;
    model.receiveShadow = true;
  } else {
    const gltfLoader = new GLTFLoader();
    const gltf = await new Promise((resolve, reject) => { gltfLoader.parse(buffer, '', resolve, reject); });
    model = gltf.scene;
    model.traverse((child) => {
      if (child.isMesh) { child.castShadow = true; child.receiveShadow = true; }
    });
  }

  // ── Standard CAD orientation: Z-up → Y-up ──
  // Most CAD STL exports use Z as the up axis; Three.js uses Y-up
  // Rotate -90° on X to convert
  if (IS_STL) {
    model.rotation.x = -Math.PI / 2;
  }

  // Compute bounding box after rotation
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);

  // Scale to fit ~3 units
  const s = 3 / maxDim;
  model.scale.multiplyScalar(s);

  // Recompute after scale
  const box2 = new THREE.Box3().setFromObject(model);
  const center2 = box2.getCenter(new THREE.Vector3());

  // Center horizontally, sit on ground (y=0)
  model.position.x -= center2.x;
  model.position.z -= center2.z;
  model.position.y -= box2.min.y;

  scene.add(model);
  window.__renderFrame(45, 25, 8);
  window.__modelReady = true;
  console.log('MODEL_READY');
} catch(err) {
  console.error('LOAD_ERROR', err);
}
</script>
</body>
</html>`

async function main() {
  console.log(`\n🔄 LLEDO Aerotools Turntable Generator`)
  console.log(`   Slug: ${slug}`)
  console.log(`   Frames: ${hFrames} horizontal × ${vLevels} vertical = ${totalFrames} images`)
  console.log(`   Resolution: ${resolution}×${resolution}`)
  console.log(`   Output: ${outputDir}\n`)

  // Start a tiny HTTP server to serve HTML + model
  const modelBuffer = fs.readFileSync(modelPath)
  console.log(`   Model: ${path.basename(modelPath)} (${isSTL ? 'STL' : 'GLB'}, ${(modelBuffer.length / 1024 / 1024).toFixed(1)} MB)`)
  const server = http.createServer((req, res) => {
    if (req.url === '/model-file') {
      const ct = isSTL ? 'application/octet-stream' : 'model/gltf-binary'
      res.writeHead(200, { 'Content-Type': ct, 'Content-Length': modelBuffer.length })
      res.end(modelBuffer)
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(htmlContent)
    }
  })

  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const port = server.address().port
  console.log(`   Local server on port ${port}`)

  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl',
      '--window-size=800,800',
      '--js-flags=--max-old-space-size=8192',
      '--disable-dev-shm-usage',
      '--disable-gpu-sandbox',
    ]
  })

  const page = await browser.newPage()
  await page.setViewport({ width: resolution, height: resolution, deviceScaleFactor: 1 })

  // Capture browser console for debugging
  page.on('console', msg => {
    const text = msg.text()
    if (text.includes('ERROR') || text.includes('error')) {
      console.log('   [browser]', text)
    }
  })
  page.on('pageerror', err => console.log('   [page error]', err.message))

  // Navigate to our local server
  console.log('⏳ Loading page...')
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle2', timeout: 300000 })
  console.log('   Page loaded, waiting for Three.js scripts...')

  // Wait a bit for scripts to execute
  await new Promise(r => setTimeout(r, 3000))

  // Wait for model to load
  console.log('⏳ Loading model...')
  await page.waitForFunction('window.__modelReady === true', { timeout: 300000 })
  console.log('✅ Model loaded\n')

  // Render all frames
  const distance = 8
  let count = 0

  for (let v = 0; v < elevations.length; v++) {
    for (let h = 0; h < hFrames; h++) {
      const filename = `${slug}_e${v}_h${String(h).padStart(3, '0')}.webp`
      const filepath = path.join(outputDir, filename)

      // Skip if already exists (resume support)
      if (fs.existsSync(filepath)) { count++; continue }

      const hAngle = (360 / hFrames) * h
      const elevation = elevations[v]

      try {
        await page.evaluate((a, e, d) => window.__renderFrame(a, e, d), hAngle, elevation, distance)

        // Delay for render to complete (longer for large STL files)
        await new Promise(r => setTimeout(r, 500))

        // Screenshot the canvas
        const canvasEl = await page.$('#c')
        await canvasEl.screenshot({ path: filepath, type: 'webp', quality: 90 })
      } catch (err) {
        console.log(`\n⚠️  Frame ${count+1} failed, re-run script to resume.`)
        throw err
      }

      count++
      const pct = ((count / totalFrames) * 100).toFixed(0)
      process.stdout.write(`\r   [${pct}%] ${count}/${totalFrames} — e${v}_h${String(h).padStart(3, '0')} (${elevation}° / ${hAngle.toFixed(0)}°)`)
    }
  }

  console.log(`\n\n✅ Done! ${count} images saved to:\n   ${outputDir}\n`)

  // Write metadata
  const metadata = {
    slug,
    hFrames,
    vLevels,
    elevations,
    format: 'webp',
    resolution,
    totalFrames: count,
    generatedAt: new Date().toISOString(),
    filePattern: `${slug}_e{elevation}_h{angle}.webp`,
  }
  fs.writeFileSync(path.join(outputDir, 'metadata.json'), JSON.stringify(metadata, null, 2))
  console.log('📄 metadata.json written\n')

  await browser.close()
  server.close()
}

main().catch(err => {
  console.error('❌ Error:', err)
  process.exit(1)
})
