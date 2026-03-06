'use client'

import { useRef, useState, useCallback } from 'react'
import { Upload, Loader2, Check, AlertTriangle, RotateCw, Image as ImageIcon } from 'lucide-react'

interface TurntableGeneratorProps {
  slug: string
  onComplete?: (config: { hFrames: number; vLevels: number; format: string; baseUrl: string }) => void
}

const H_FRAMES = 36
const V_LEVELS = 3
const RESOLUTION = 1200
const ELEVATIONS = [15, 25, 35]

export function TurntableGenerator({ slug, onComplete }: TurntableGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [status, setStatus] = useState<'idle' | 'loading-three' | 'loading-model' | 'rendering' | 'uploading' | 'done' | 'error'>('idle')
  const [progress, setProgress] = useState(0)
  const [progressLabel, setProgressLabel] = useState('')
  const [error, setError] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!['glb', 'gltf', 'stl'].includes(ext || '')) {
      setError('Formats acceptés : .stl, .glb, .gltf')
      setStatus('error')
      return
    }
    const isSTL = ext === 'stl'

    try {
      // Step 1: Load Three.js
      setStatus('loading-three')
      setProgress(0)
      setProgressLabel('Chargement de Three.js...')

      const THREE = await import('three')
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')
      const { STLLoader } = await import('three/examples/jsm/loaders/STLLoader.js')

      // Step 2: Setup renderer
      const canvas = canvasRef.current
      if (!canvas) throw new Error('Canvas not found')

      canvas.width = RESOLUTION
      canvas.height = RESOLUTION

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        preserveDrawingBuffer: true,
        alpha: false,
      })
      renderer.setSize(RESOLUTION, RESOLUTION)
      renderer.setPixelRatio(1)
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.1
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap

      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x1a1d24)
      scene.fog = new THREE.Fog(0x1a1d24, 20, 45)

      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000)

      // Industrial hangar lighting
      const keyLight = new THREE.DirectionalLight(0xfff0dd, 1.6)
      keyLight.position.set(4, 12, 5)
      keyLight.castShadow = true
      keyLight.shadow.mapSize.set(2048, 2048)
      keyLight.shadow.camera.near = 0.1
      keyLight.shadow.camera.far = 50
      keyLight.shadow.camera.left = -8
      keyLight.shadow.camera.right = 8
      keyLight.shadow.camera.top = 8
      keyLight.shadow.camera.bottom = -8
      keyLight.shadow.bias = -0.0005
      keyLight.shadow.radius = 3
      scene.add(keyLight)
      const secondLight = new THREE.DirectionalLight(0xffe8cc, 0.8)
      secondLight.position.set(-3, 10, -2)
      secondLight.castShadow = true
      secondLight.shadow.mapSize.set(1024, 1024)
      scene.add(secondLight)
      const fillL = new THREE.DirectionalLight(0xc8d8f0, 0.35)
      fillL.position.set(-7, 4, 2)
      scene.add(fillL)
      const fillR = new THREE.DirectionalLight(0xc8d8f0, 0.25)
      fillR.position.set(7, 4, 2)
      scene.add(fillR)
      scene.add(new THREE.AmbientLight(0x404858, 0.5))
      const logoSpot = new THREE.SpotLight(0x3366cc, 0.6, 25, Math.PI / 4, 0.5, 1)
      logoSpot.position.set(0, 6, -4)
      logoSpot.target.position.set(0, 3, -12)
      scene.add(logoSpot); scene.add(logoSpot.target)

      // Dark epoxy floor
      const floorMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(50, 50),
        new THREE.MeshStandardMaterial({ color: 0x3a3d42, metalness: 0.2, roughness: 0.55 })
      )
      floorMesh.rotation.x = -Math.PI / 2; floorMesh.receiveShadow = true
      scene.add(floorMesh)
      const jMat = new THREE.MeshBasicMaterial({ color: 0x2e3035, side: THREE.DoubleSide })
      for (let ii = -5; ii <= 5; ii++) {
        const jh = new THREE.Mesh(new THREE.PlaneGeometry(50, 0.01), jMat)
        jh.rotation.x = -Math.PI / 2; jh.position.set(0, 0.001, ii * 3)
        scene.add(jh)
        const jv = new THREE.Mesh(new THREE.PlaneGeometry(0.01, 50), jMat)
        jv.rotation.x = -Math.PI / 2; jv.position.set(ii * 3, 0.001, 0)
        scene.add(jv)
      }

      // Side walls
      const wMat = new THREE.MeshStandardMaterial({ color: 0x2a2d33, metalness: 0.3, roughness: 0.6 })
      const wL = new THREE.Mesh(new THREE.PlaneGeometry(30, 10), wMat)
      wL.position.set(-12, 5, 0); wL.rotation.y = Math.PI / 2; scene.add(wL)
      const wR = new THREE.Mesh(new THREE.PlaneGeometry(30, 10), wMat)
      wR.position.set(12, 5, 0); wR.rotation.y = -Math.PI / 2; scene.add(wR)

      // Logo wall via canvas texture
      const lc = document.createElement('canvas')
      lc.width = 2048; lc.height = 1024
      const lx = lc.getContext('2d')!
      lx.fillStyle = '#22252b'; lx.fillRect(0, 0, 2048, 1024)
      lx.strokeStyle = '#2a2d33'; lx.lineWidth = 1
      for (let yy = 0; yy < 1024; yy += 64) { lx.beginPath(); lx.moveTo(0, yy); lx.lineTo(2048, yy); lx.stroke() }
      const lcx = 1024, lcy = 380, isc = 2.2
      lx.save(); lx.translate(lcx - 120 * isc, lcy - 60 * isc); lx.scale(isc, isc)
      const bg = lx.createLinearGradient(0, 0, 0, 120)
      bg.addColorStop(0, '#5BA3E8'); bg.addColorStop(0.25, '#1E5FAA')
      bg.addColorStop(0.5, '#0D3A6E'); bg.addColorStop(0.75, '#1E5FAA'); bg.addColorStop(1, '#5BA3E8')
      lx.fillStyle = bg; lx.beginPath()
      lx.moveTo(0,0);lx.lineTo(90,0);lx.lineTo(90,30);lx.lineTo(30,30);lx.lineTo(30,120)
      lx.lineTo(90,120);lx.lineTo(90,90);lx.lineTo(60,90);lx.lineTo(60,60);lx.lineTo(90,60)
      lx.lineTo(90,120);lx.lineTo(0,120);lx.closePath();lx.fill()
      lx.strokeStyle='#b0b8c8';lx.lineWidth=1.5;lx.stroke()
      const rg = lx.createLinearGradient(0,0,0,120)
      rg.addColorStop(0,'#E85B5B');rg.addColorStop(0.25,'#C41E1E')
      rg.addColorStop(0.5,'#8B0000');rg.addColorStop(0.75,'#C41E1E');rg.addColorStop(1,'#E85B5B')
      lx.fillStyle=rg;lx.beginPath()
      lx.moveTo(36,36);lx.lineTo(54,36);lx.lineTo(54,84);lx.lineTo(84,84);lx.lineTo(84,114);lx.lineTo(36,114)
      lx.closePath();lx.fill();lx.strokeStyle='#d0d8e0';lx.lineWidth=0.8;lx.stroke()
      lx.restore()
      lx.save();lx.font='bold 110px Arial Black, Arial, sans-serif';lx.textAlign='center';lx.textBaseline='middle'
      const tg = lx.createLinearGradient(0,lcy+100,0,lcy+200)
      tg.addColorStop(0,'#6BB3F8');tg.addColorStop(0.5,'#2E7AD1');tg.addColorStop(1,'#6BB3F8')
      lx.fillStyle='#000';lx.globalAlpha=0.4;lx.fillText('LLEDO',lcx+3,lcy+158)
      lx.globalAlpha=1;lx.fillStyle=tg;lx.fillText('LLEDO',lcx,lcy+155)
      lx.strokeStyle='#a0b0c8';lx.lineWidth=1.5;lx.strokeText('LLEDO',lcx,lcy+155);lx.restore()
      lx.save();lx.font='bold 48px Arial, sans-serif';lx.textAlign='center'
      lx.fillStyle='#4A90D9';lx.fillText('AERO TOOLS',lcx,lcy+230)
      lx.strokeStyle='#4A90D9';lx.lineWidth=2;lx.globalAlpha=0.5
      lx.beginPath();lx.moveTo(lcx-200,lcy+185);lx.lineTo(lcx+200,lcy+185);lx.stroke();lx.restore()
      const lt = new THREE.CanvasTexture(lc); lt.colorSpace = THREE.SRGBColorSpace
      const lw = new THREE.Mesh(new THREE.PlaneGeometry(20, 10),
        new THREE.MeshStandardMaterial({ map: lt, metalness: 0.1, roughness: 0.7 }))
      lw.position.set(0, 5, -12); scene.add(lw)

      // Step 3: Load model (STL or GLB)
      setStatus('loading-model')
      setProgressLabel(isSTL ? 'Chargement du fichier STL...' : 'Chargement du modèle 3D...')

      const buffer = await file.arrayBuffer()
      const TARGET_SIZE = 3.5
      const pivot = new THREE.Group()
      let lookAtY = 1.0
      let camDistance = 8

      if (isSTL) {
        const stlLoader = new STLLoader()
        const geometry = stlLoader.parse(buffer)

        // Validate geometry
        const posAttr = geometry.attributes.position
        if (!posAttr || posAttr.count === 0) {
          throw new Error('Le fichier STL ne contient aucune géométrie (0 vertices)')
        }
        console.log('[TurntableGenerator] STL vertices:', posAttr.count)

        geometry.computeVertexNormals()
        geometry.computeBoundingBox()

        const geoBox = geometry.boundingBox!
        const geoSize = geoBox.getSize(new THREE.Vector3())
        const geoCenter = geoBox.getCenter(new THREE.Vector3())

        console.log('[TurntableGenerator] STL geo size:', geoSize.x.toFixed(2), geoSize.y.toFixed(2), geoSize.z.toFixed(2),
          'center:', geoCenter.x.toFixed(2), geoCenter.y.toFixed(2), geoCenter.z.toFixed(2))

        const maxDim = Math.max(geoSize.x, geoSize.y, geoSize.z)
        if (maxDim === 0 || !isFinite(maxDim)) {
          throw new Error(`Dimensions invalides (maxDim=${maxDim}, vertices=${posAttr.count})`)
        }

        const s = TARGET_SIZE / maxDim

        const material = new THREE.MeshStandardMaterial({
          color: 0xb8bcc4,
          metalness: 0.55,
          roughness: 0.35,
          side: THREE.DoubleSide,
        })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.castShadow = true
        mesh.receiveShadow = true

        // Center geometry at mesh origin via mesh position offset (don't mutate geometry)
        mesh.position.set(-geoCenter.x, -geoCenter.y, -geoCenter.z)

        pivot.add(mesh)
        pivot.rotation.x = -Math.PI / 2   // STL Z-up → Three.js Y-up
        pivot.scale.setScalar(s)

        // Compute camera params analytically (no setFromObject needed)
        // After Z→Y rotation: world height = geoSize.z * s, width = geoSize.x * s, depth = geoSize.y * s
        const worldHeight = geoSize.z * s
        const worldWidth = geoSize.x * s
        const worldDepth = geoSize.y * s
        pivot.position.y = worldHeight / 2   // place bottom on floor

        lookAtY = worldHeight / 2
        const fovRad = THREE.MathUtils.degToRad(30)
        const fitDist = (Math.max(worldWidth, worldHeight, worldDepth) / 2) / Math.tan(fovRad / 2)
        camDistance = Math.max(fitDist * 1.5, 6)

        console.log('[TurntableGenerator] World dims:', worldWidth.toFixed(2), worldHeight.toFixed(2), worldDepth.toFixed(2),
          'camDist:', camDistance.toFixed(2), 'lookAtY:', lookAtY.toFixed(2))
      } else {
        const gltfLoader = new GLTFLoader()
        const gltf = await new Promise<any>((resolve, reject) => {
          gltfLoader.parse(buffer, '', resolve, reject)
        })
        const model = gltf.scene
        model.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
          }
        })
        pivot.add(model)

        scene.add(pivot)
        renderer.render(scene, camera) // force matrix update

        const box = new THREE.Box3().setFromObject(pivot)
        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)

        if (maxDim === 0 || !isFinite(maxDim)) throw new Error('Modèle GLB vide')

        const s = TARGET_SIZE / maxDim
        pivot.scale.setScalar(s)
        pivot.position.set(-center.x * s, -box.min.y * s, -center.z * s)

        renderer.render(scene, camera)
        const box2 = new THREE.Box3().setFromObject(pivot)
        const c2 = box2.getCenter(new THREE.Vector3())
        lookAtY = c2.y

        const fovRad = THREE.MathUtils.degToRad(30)
        const fitDist = (Math.max(size.x, size.y) * s / 2) / Math.tan(fovRad / 2)
        camDistance = Math.max(fitDist * 1.5, 6)
      }

      if (!pivot.parent) scene.add(pivot)

      // Render helper — camera targets model center, distance adapts to model
      const renderFrame = (hAngle: number, elevation: number, dist: number) => {
        const theta = THREE.MathUtils.degToRad(hAngle)
        const phi = THREE.MathUtils.degToRad(elevation)
        camera.position.set(
          dist * Math.sin(theta) * Math.cos(phi),
          dist * Math.sin(phi) + lookAtY * 0.5,
          dist * Math.cos(theta) * Math.cos(phi)
        )
        camera.lookAt(0, lookAtY, 0)
        renderer.render(scene, camera)
      }

      // Preview render
      renderFrame(45, 25, camDistance)
      setPreviewUrl(canvas.toDataURL('image/webp', 0.8))

      // Step 4: Render all frames
      setStatus('rendering')
      const totalFrames = H_FRAMES * V_LEVELS
      const frames: { v: number; h: number; blob: Blob }[] = []

      for (let v = 0; v < V_LEVELS; v++) {
        for (let h = 0; h < H_FRAMES; h++) {
          const hAngle = (360 / H_FRAMES) * h
          const elevation = ELEVATIONS[v]

          renderFrame(hAngle, elevation, camDistance)

          const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((b) => resolve(b!), 'image/webp', 0.9)
          })

          frames.push({ v, h, blob })

          const count = v * H_FRAMES + h + 1
          setProgress(Math.round((count / totalFrames) * 50))
          setProgressLabel(`Rendu ${count}/${totalFrames} — ${elevation}° / ${hAngle.toFixed(0)}°`)
        }
      }

      // Cleanup Three.js
      renderer.dispose()

      // Step 5: Upload all frames
      setStatus('uploading')
      setProgressLabel('Upload des images...')

      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i]
        const formData = new FormData()
        formData.append('slug', slug)
        formData.append('elevation', String(frame.v))
        formData.append('angle', String(frame.h))
        formData.append('image', frame.blob, `${slug}_e${frame.v}_h${String(frame.h).padStart(3, '0')}.webp`)

        const res = await fetch('/api/aerotools/turntable', { method: 'POST', body: formData })
        if (!res.ok) throw new Error(`Upload failed for frame ${i}`)

        setProgress(50 + Math.round(((i + 1) / frames.length) * 45))
        setProgressLabel(`Upload ${i + 1}/${frames.length}`)
      }

      // Step 6: Save metadata + get baseUrl
      setProgressLabel('Sauvegarde des métadonnées...')
      const metaRes = await fetch('/api/aerotools/turntable', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          hFrames: H_FRAMES,
          vLevels: V_LEVELS,
          elevations: ELEVATIONS,
          format: 'webp',
          resolution: RESOLUTION,
        }),
      })
      const metaData = await metaRes.json()
      const baseUrl = metaData.baseUrl || `/images/aerotools/360/${slug}`

      setProgress(100)
      setStatus('done')
      setProgressLabel('Terminé !')
      onComplete?.({ hFrames: H_FRAMES, vLevels: V_LEVELS, format: 'webp', baseUrl })
    } catch (err) {
      console.error('Turntable generation error:', err)
      setError(err instanceof Error ? err.message : 'Erreur de génération')
      setStatus('error')
    }
  }, [slug, onComplete])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-bold text-white mb-1">Vue 360° Turntable</p>
        <p className="text-xs text-gray-500 mb-3">
          Glissez un fichier STL, GLB ou GLTF pour générer automatiquement {H_FRAMES * V_LEVELS} images de présentation sécurisées.
        </p>
      </div>

      {/* Drop zone */}
      {status === 'idle' && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-600 rounded-2xl p-12 text-center cursor-pointer hover:border-blue-500/50 hover:bg-blue-600/5 transition-all"
        >
          <Upload className="h-10 w-10 text-gray-500 mx-auto mb-4" />
          <p className="text-sm font-bold text-gray-300 mb-1">Glissez votre fichier STL, GLB ou GLTF ici</p>
          <p className="text-xs text-gray-500">ou cliquez pour parcourir • .stl .glb .gltf</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".stl,.glb,.gltf"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      )}

      {/* Progress */}
      {(status === 'loading-three' || status === 'loading-model' || status === 'rendering' || status === 'uploading') && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
            <div>
              <p className="text-sm font-bold text-white">
                {status === 'loading-three' && 'Chargement du moteur 3D...'}
                {status === 'loading-model' && 'Analyse du modèle 3D...'}
                {status === 'rendering' && 'Rendu des images turntable...'}
                {status === 'uploading' && 'Upload des images vers le serveur...'}
              </p>
              <p className="text-xs text-gray-500">{progressLabel}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 text-right">{progress}%</p>

          {/* Preview */}
          {previewUrl && (
            <div className="mt-4 rounded-xl overflow-hidden border border-gray-700">
              <img src={previewUrl} alt="Preview" className="w-full h-48 object-contain bg-gray-800" />
              <p className="text-[10px] text-gray-500 p-2 text-center">Aperçu du modèle</p>
            </div>
          )}
        </div>
      )}

      {/* Done */}
      {status === 'done' && (
        <div className="bg-green-900/20 border border-green-700/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <Check className="h-5 w-5 text-green-400" />
            <div>
              <p className="text-sm font-bold text-green-300">Vue 360° générée avec succès !</p>
              <p className="text-xs text-green-500">{H_FRAMES * V_LEVELS} images • {H_FRAMES} angles × {V_LEVELS} élévations</p>
            </div>
          </div>

          {previewUrl && (
            <div className="mt-3 rounded-xl overflow-hidden border border-green-800/50">
              <img src={previewUrl} alt="Preview" className="w-full h-48 object-contain bg-gray-900" />
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => { setStatus('idle'); setProgress(0); setPreviewUrl(null) }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs font-bold text-gray-300 hover:text-white transition-colors"
            >
              <RotateCw className="h-3.5 w-3.5" /> Regénérer
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <div className="bg-red-900/20 border border-red-700/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div>
              <p className="text-sm font-bold text-red-300">Erreur de génération</p>
              <p className="text-xs text-red-500">{error}</p>
            </div>
          </div>
          <button
            onClick={() => { setStatus('idle'); setProgress(0); setError('') }}
            className="mt-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs font-bold text-gray-300 hover:text-white transition-colors"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Hidden canvas for rendering */}
      <canvas ref={canvasRef} className="hidden" width={RESOLUTION} height={RESOLUTION} />

      {/* Info */}
      <div className="flex items-start gap-2 p-3 bg-blue-900/10 border border-blue-800/30 rounded-xl">
        <ImageIcon className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
        <p className="text-[11px] text-blue-400/70">
          Le rendu génère {H_FRAMES * V_LEVELS} images WebP ({H_FRAMES} angles × {V_LEVELS} élévations à {RESOLUTION}px).
          Aucun fichier 3D ne sera envoyé aux visiteurs — seulement les images.
        </p>
      </div>
    </div>
  )
}
