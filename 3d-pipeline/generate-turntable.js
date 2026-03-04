/**
 * LLEDO Aerotools — Turntable Image Generator
 * Uses Puppeteer + Three.js to render GLB from multiple angles
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

const glbPath = path.resolve(__dirname, '..', 'models', `${slug}.glb`)
const outputDir = path.resolve(__dirname, '..', 'public', 'images', 'aerotools', '360', slug)

if (!fs.existsSync(glbPath)) {
  console.error(`❌ GLB file not found: ${glbPath}`)
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
<style>* { margin:0; padding:0; } body { background: #e0e0e4; }</style>
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

const canvas = document.getElementById('c');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe0e0e4);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setSize(${resolution}, ${resolution});
renderer.setPixelRatio(1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000);

scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
keyLight.position.set(5, 8, 5);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
keyLight.shadow.camera.near = 0.1;
keyLight.shadow.camera.far = 50;
keyLight.shadow.camera.left = -10;
keyLight.shadow.camera.right = 10;
keyLight.shadow.camera.top = 10;
keyLight.shadow.camera.bottom = -10;
scene.add(keyLight);

const fill = new THREE.DirectionalLight(0xeeeeff, 0.5);
fill.position.set(-3, 4, -2);
scene.add(fill);

const rim = new THREE.DirectionalLight(0xffffff, 0.3);
rim.position.set(0, 2, -5);
scene.add(rim);

const groundGeo = new THREE.CircleGeometry(10, 64);
const groundMat = new THREE.ShadowMaterial({ opacity: 0.15 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const ringGeo = new THREE.RingGeometry(3.8, 4.0, 64);
const ringMat = new THREE.MeshBasicMaterial({ color: 0xc8c8cc, side: THREE.DoubleSide });
const ring = new THREE.Mesh(ringGeo, ringMat);
ring.rotation.x = -Math.PI / 2;
ring.position.y = 0.001;
scene.add(ring);

window.__renderFrame = function(hAngle, elevation, distance) {
  const theta = THREE.MathUtils.degToRad(hAngle);
  const phi = THREE.MathUtils.degToRad(elevation);
  camera.position.set(
    distance * Math.sin(theta) * Math.cos(phi),
    distance * Math.sin(phi),
    distance * Math.cos(theta) * Math.cos(phi)
  );
  camera.lookAt(0, 0.8, 0);
  renderer.render(scene, camera);
};

try {
  const res = await fetch('/glb-file');
  const buffer = await res.arrayBuffer();
  const loader = new GLTFLoader();
  loader.parse(buffer, '', (gltf) => {
    const model = gltf.scene;
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const s = 3 / maxDim;
    model.scale.setScalar(s);
    model.position.sub(center.multiplyScalar(s));
    model.position.y -= (box.min.y * s);
    model.traverse((child) => {
      if (child.isMesh) { child.castShadow = true; child.receiveShadow = true; }
    });
    scene.add(model);
    window.__renderFrame(45, 55, 8);
    window.__modelReady = true;
    console.log('MODEL_READY');
  }, (err) => {
    console.error('PARSE_ERROR', err);
  });
} catch(err) {
  console.error('FETCH_ERROR', err);
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

  // Start a tiny HTTP server to serve HTML + GLB
  const glbBuffer = fs.readFileSync(glbPath)
  const server = http.createServer((req, res) => {
    if (req.url === '/glb-file') {
      res.writeHead(200, { 'Content-Type': 'model/gltf-binary', 'Content-Length': glbBuffer.length })
      res.end(glbBuffer)
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
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--window-size=800,800']
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
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle2', timeout: 60000 })
  console.log('   Page loaded, waiting for Three.js scripts...')

  // Wait a bit for scripts to execute
  await new Promise(r => setTimeout(r, 3000))

  // Wait for model to load
  console.log('⏳ Loading model...')
  await page.waitForFunction('window.__modelReady === true', { timeout: 60000 })
  console.log('✅ Model loaded\n')

  // Render all frames
  const distance = 8
  let count = 0

  for (let v = 0; v < elevations.length; v++) {
    for (let h = 0; h < hFrames; h++) {
      const hAngle = (360 / hFrames) * h
      const elevation = elevations[v]

      await page.evaluate((a, e, d) => window.__renderFrame(a, e, d), hAngle, elevation, distance)

      // Delay for render to complete (avoid context destruction)
      await new Promise(r => setTimeout(r, 150))

      const filename = `${slug}_e${v}_h${String(h).padStart(3, '0')}.webp`
      const filepath = path.join(outputDir, filename)

      // Skip if already exists (resume support)
      if (fs.existsSync(filepath)) { count++; continue }

      // Screenshot the canvas
      const canvasEl = await page.$('#c')
      await canvasEl.screenshot({ path: filepath, type: 'webp', quality: 90 })

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
