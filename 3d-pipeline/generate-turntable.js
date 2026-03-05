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
// HANGAR LLEDO AEROTOOLS — Dark showroom with logo wall
// ═══════════════════════════════════════════════════════════════

scene.background = new THREE.Color(0x1a1d24);
scene.fog = new THREE.Fog(0x1a1d24, 20, 45);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setSize(${resolution}, ${resolution});
renderer.setPixelRatio(1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000);

// ── Industrial hangar lighting ──

// Overhead key — slightly warm sodium vapor feel
const keyLight = new THREE.DirectionalLight(0xfff0dd, 1.6);
keyLight.position.set(4, 12, 5);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
keyLight.shadow.camera.near = 0.1;
keyLight.shadow.camera.far = 50;
keyLight.shadow.camera.left = -8;
keyLight.shadow.camera.right = 8;
keyLight.shadow.camera.top = 8;
keyLight.shadow.camera.bottom = -8;
keyLight.shadow.bias = -0.0005;
keyLight.shadow.radius = 3;
scene.add(keyLight);

// Secondary overhead
const secondLight = new THREE.DirectionalLight(0xffe8cc, 0.8);
secondLight.position.set(-3, 10, -2);
secondLight.castShadow = true;
secondLight.shadow.mapSize.set(1024, 1024);
scene.add(secondLight);

// Cool fill from sides
const fillL = new THREE.DirectionalLight(0xc8d8f0, 0.35);
fillL.position.set(-7, 4, 2);
scene.add(fillL);
const fillR = new THREE.DirectionalLight(0xc8d8f0, 0.25);
fillR.position.set(7, 4, 2);
scene.add(fillR);

// Ambient — low, to keep shadows dramatic
scene.add(new THREE.AmbientLight(0x404858, 0.5));

// Spot on the logo wall — subtle blue wash
const logoSpot = new THREE.SpotLight(0x3366cc, 0.6, 25, Math.PI / 4, 0.5, 1);
logoSpot.position.set(0, 6, -4);
logoSpot.target.position.set(0, 3, -12);
scene.add(logoSpot);
scene.add(logoSpot.target);

// ── Hangar Floor — Dark epoxy concrete ──
const floorGeo = new THREE.PlaneGeometry(50, 50);
const floorMat = new THREE.MeshStandardMaterial({
  color: 0x3a3d42,
  metalness: 0.2,
  roughness: 0.55,
});
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Floor joint lines (subtle)
const jointMat = new THREE.MeshBasicMaterial({ color: 0x2e3035, side: THREE.DoubleSide });
for (let i = -5; i <= 5; i++) {
  const jh = new THREE.Mesh(new THREE.PlaneGeometry(50, 0.01), jointMat);
  jh.rotation.x = -Math.PI / 2; jh.position.set(0, 0.001, i * 3);
  scene.add(jh);
  const jv = new THREE.Mesh(new THREE.PlaneGeometry(0.01, 50), jointMat);
  jv.rotation.x = -Math.PI / 2; jv.position.set(i * 3, 0.001, 0);
  scene.add(jv);
}

// ── Hangar Walls — Dark panels ──
const wallMat = new THREE.MeshStandardMaterial({ color: 0x2a2d33, metalness: 0.3, roughness: 0.6 });

// Side walls
const sideWallL = new THREE.Mesh(new THREE.PlaneGeometry(30, 10), wallMat);
sideWallL.position.set(-12, 5, 0); sideWallL.rotation.y = Math.PI / 2;
scene.add(sideWallL);
const sideWallR = new THREE.Mesh(new THREE.PlaneGeometry(30, 10), wallMat);
sideWallR.position.set(12, 5, 0); sideWallR.rotation.y = -Math.PI / 2;
scene.add(sideWallR);

// ── LOGO WALL — Back wall with LLEDO AEROTOOLS branding ──
// Create canvas texture for the logo
const logoCanvas = document.createElement('canvas');
logoCanvas.width = 2048;
logoCanvas.height = 1024;
const ctx = logoCanvas.getContext('2d');

// Dark wall background
ctx.fillStyle = '#22252b';
ctx.fillRect(0, 0, 2048, 1024);

// Subtle horizontal panel lines
ctx.strokeStyle = '#2a2d33';
ctx.lineWidth = 1;
for (let y = 0; y < 1024; y += 64) {
  ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(2048, y); ctx.stroke();
}

// ─── Draw the LLEDO Industries-style icon (centered, large) ───
const cx = 1024, cy = 380;
const iconScale = 2.2;

// Blue outer "L" shape
ctx.save();
ctx.translate(cx - 120 * iconScale, cy - 60 * iconScale);
ctx.scale(iconScale, iconScale);

// Outer blue L
const blueGrad = ctx.createLinearGradient(0, 0, 0, 120);
blueGrad.addColorStop(0, '#5BA3E8');
blueGrad.addColorStop(0.25, '#1E5FAA');
blueGrad.addColorStop(0.5, '#0D3A6E');
blueGrad.addColorStop(0.75, '#1E5FAA');
blueGrad.addColorStop(1, '#5BA3E8');

ctx.fillStyle = blueGrad;
ctx.beginPath();
ctx.moveTo(0, 0); ctx.lineTo(90, 0); ctx.lineTo(90, 30);
ctx.lineTo(30, 30); ctx.lineTo(30, 120); ctx.lineTo(90, 120);
ctx.lineTo(90, 90); ctx.lineTo(60, 90); ctx.lineTo(60, 60);
ctx.lineTo(90, 60); ctx.lineTo(90, 120); ctx.lineTo(0, 120);
ctx.closePath();
ctx.fill();

// Silver outline
ctx.strokeStyle = '#b0b8c8';
ctx.lineWidth = 1.5;
ctx.stroke();

// Inner red accent
const redGrad = ctx.createLinearGradient(0, 0, 0, 120);
redGrad.addColorStop(0, '#E85B5B');
redGrad.addColorStop(0.25, '#C41E1E');
redGrad.addColorStop(0.5, '#8B0000');
redGrad.addColorStop(0.75, '#C41E1E');
redGrad.addColorStop(1, '#E85B5B');

ctx.fillStyle = redGrad;
ctx.beginPath();
ctx.moveTo(36, 36); ctx.lineTo(54, 36); ctx.lineTo(54, 84);
ctx.lineTo(84, 84); ctx.lineTo(84, 114); ctx.lineTo(36, 114);
ctx.closePath();
ctx.fill();
ctx.strokeStyle = '#d0d8e0';
ctx.lineWidth = 0.8;
ctx.stroke();

ctx.restore();

// ─── "LLEDO" text ───
ctx.save();
ctx.font = 'bold 110px Arial Black, Arial, sans-serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

// Blue metallic text gradient
const textGrad = ctx.createLinearGradient(0, cy + 100, 0, cy + 200);
textGrad.addColorStop(0, '#6BB3F8');
textGrad.addColorStop(0.5, '#2E7AD1');
textGrad.addColorStop(1, '#6BB3F8');

// Shadow
ctx.fillStyle = '#000';
ctx.globalAlpha = 0.4;
ctx.fillText('LLEDO', cx + 3, cy + 155 + 3);
ctx.globalAlpha = 1.0;

// Main text
ctx.fillStyle = textGrad;
ctx.fillText('LLEDO', cx, cy + 155);

// Silver outline
ctx.strokeStyle = '#a0b0c8';
ctx.lineWidth = 1.5;
ctx.strokeText('LLEDO', cx, cy + 155);
ctx.restore();

// ─── "AERO TOOLS" subtitle ───
ctx.save();
ctx.font = 'bold 48px Arial, sans-serif';
ctx.textAlign = 'center';
ctx.letterSpacing = '12px';
ctx.fillStyle = '#4A90D9';
ctx.fillText('AERO TOOLS', cx, cy + 230);

// Decorative line
ctx.strokeStyle = '#4A90D9';
ctx.lineWidth = 2;
ctx.globalAlpha = 0.5;
ctx.beginPath();
ctx.moveTo(cx - 200, cy + 185);
ctx.lineTo(cx + 200, cy + 185);
ctx.stroke();
ctx.restore();

// Create texture from canvas
const logoTexture = new THREE.CanvasTexture(logoCanvas);
logoTexture.colorSpace = THREE.SRGBColorSpace;

// Logo wall — large plane behind the product
const logoWallGeo = new THREE.PlaneGeometry(20, 10);
const logoWallMat = new THREE.MeshStandardMaterial({
  map: logoTexture,
  metalness: 0.1,
  roughness: 0.7,
});
const logoWall = new THREE.Mesh(logoWallGeo, logoWallMat);
logoWall.position.set(0, 5, -12);
scene.add(logoWall);

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
