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
// HANGAR LLEDO AEROTOOLS — Helicopter maintenance hangar
// ═══════════════════════════════════════════════════════════════

// Gradient background — dark industrial hangar
scene.background = new THREE.Color(0x1a1f2e);
scene.fog = new THREE.Fog(0x1a1f2e, 15, 35);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setSize(${resolution}, ${resolution});
renderer.setPixelRatio(1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000);

// ── Hangar Lighting ──
// Warm overhead industrial lights (like halogen hangar lamps)
scene.add(new THREE.AmbientLight(0xc4b8a0, 0.35));

// Main overhead hangar light — warm white
const mainLight = new THREE.DirectionalLight(0xfff5e6, 1.6);
mainLight.position.set(3, 10, 4);
mainLight.castShadow = true;
mainLight.shadow.mapSize.set(2048, 2048);
mainLight.shadow.camera.near = 0.1;
mainLight.shadow.camera.far = 50;
mainLight.shadow.camera.left = -10;
mainLight.shadow.camera.right = 10;
mainLight.shadow.camera.top = 10;
mainLight.shadow.camera.bottom = -10;
mainLight.shadow.bias = -0.001;
scene.add(mainLight);

// Secondary overhead light — slightly cooler
const secondLight = new THREE.DirectionalLight(0xe8e0d0, 0.8);
secondLight.position.set(-4, 8, -2);
secondLight.castShadow = true;
secondLight.shadow.mapSize.set(1024, 1024);
scene.add(secondLight);

// Fill light from the side — simulate hangar door light
const fillLight = new THREE.DirectionalLight(0xd4e5ff, 0.4);
fillLight.position.set(-6, 3, 0);
scene.add(fillLight);

// Subtle LLEDO blue accent from below (brand touch)
const accentLight = new THREE.PointLight(0x0047ff, 0.15, 12);
accentLight.position.set(0, 0.1, 3);
scene.add(accentLight);

// Warm point light — simulates nearby workshop lamp
const workshopLight = new THREE.PointLight(0xffaa44, 0.3, 10);
workshopLight.position.set(4, 3, -2);
scene.add(workshopLight);

// ── Hangar Floor — Concrete ──
const floorGeo = new THREE.PlaneGeometry(30, 30);
const floorMat = new THREE.MeshStandardMaterial({
  color: 0x8a8a82,
  metalness: 0.1,
  roughness: 0.85,
});
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Concrete texture lines (subtle joints)
for (let i = -3; i <= 3; i++) {
  const lineGeo = new THREE.PlaneGeometry(30, 0.02);
  const lineMat = new THREE.MeshBasicMaterial({ color: 0x6e6e66, side: THREE.DoubleSide });
  const line = new THREE.Mesh(lineGeo, lineMat);
  line.rotation.x = -Math.PI / 2;
  line.position.set(0, 0.001, i * 2);
  scene.add(line);
  // Cross lines
  const lineGeo2 = new THREE.PlaneGeometry(0.02, 30);
  const line2 = new THREE.Mesh(lineGeo2, lineMat);
  line2.rotation.x = -Math.PI / 2;
  line2.position.set(i * 2, 0.001, 0);
  scene.add(line2);
}

// Yellow safety line on floor (industrial)
const safetyLineGeo = new THREE.RingGeometry(4.0, 4.06, 64);
const safetyLineMat = new THREE.MeshBasicMaterial({ color: 0xf9a800, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
const safetyLine = new THREE.Mesh(safetyLineGeo, safetyLineMat);
safetyLine.rotation.x = -Math.PI / 2;
safetyLine.position.y = 0.002;
scene.add(safetyLine);

// ── Back Wall (distant, dark) ──
const wallGeo = new THREE.PlaneGeometry(30, 12);
const wallMat = new THREE.MeshStandardMaterial({ color: 0x3a3d45, metalness: 0.3, roughness: 0.7 });
const backWall = new THREE.Mesh(wallGeo, wallMat);
backWall.position.set(0, 6, -12);
scene.add(backWall);

// LLEDO blue stripe on wall
const stripeGeo = new THREE.PlaneGeometry(30, 0.15);
const stripeMat = new THREE.MeshBasicMaterial({ color: 0x0047ff });
const stripe = new THREE.Mesh(stripeGeo, stripeMat);
stripe.position.set(0, 2.5, -11.99);
scene.add(stripe);

// Red accent stripe below
const redStripeGeo = new THREE.PlaneGeometry(30, 0.05);
const redStripeMat = new THREE.MeshBasicMaterial({ color: 0xe61e2b });
const redStripe = new THREE.Mesh(redStripeGeo, redStripeMat);
redStripe.position.set(0, 2.3, -11.99);
scene.add(redStripe);

// ═══════════════════════════════════════════════════════════════
// RENDER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

window.__renderFrame = function(hAngle, elevation, distance) {
  const theta = THREE.MathUtils.degToRad(hAngle);
  const phi = THREE.MathUtils.degToRad(elevation);
  camera.position.set(
    distance * Math.sin(theta) * Math.cos(phi),
    distance * Math.sin(phi) + 0.5,
    distance * Math.cos(theta) * Math.cos(phi)
  );
  camera.lookAt(0, 1.0, 0);
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

    // RAL 1003 Signal Yellow — realistic industrial paint
    const material = new THREE.MeshStandardMaterial({
      color: 0xf9a800,
      metalness: 0.25,
      roughness: 0.45,
      envMapIntensity: 0.8,
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

  // ── Auto-orient: lay product flat on ground ──
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  // Find the shortest axis — that should be the vertical (height)
  // If Y is already shortest → product is already flat
  // If X is shortest → rotate so X becomes Y
  // If Z is shortest → rotate so Z becomes Y
  const dims = [
    { axis: 'x', val: size.x },
    { axis: 'y', val: size.y },
    { axis: 'z', val: size.z },
  ].sort((a, b) => a.val - b.val);
  const shortest = dims[0].axis;

  if (shortest === 'x') {
    model.rotation.z = Math.PI / 2;
  } else if (shortest === 'z') {
    model.rotation.x = Math.PI / 2;
  }
  // If Y is already shortest, no rotation needed

  // Re-compute box after rotation
  const box2 = new THREE.Box3().setFromObject(model);
  const center2 = box2.getCenter(new THREE.Vector3());
  const size2 = box2.getSize(new THREE.Vector3());
  const maxDim = Math.max(size2.x, size2.y, size2.z);

  // Scale to fit ~3 units
  const s = 3 / maxDim;
  model.scale.multiplyScalar(s);

  // Recompute after scale
  const box3 = new THREE.Box3().setFromObject(model);
  const center3 = box3.getCenter(new THREE.Vector3());

  // Center horizontally, sit on ground (y=0)
  model.position.x -= center3.x;
  model.position.z -= center3.z;
  model.position.y -= box3.min.y;

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
