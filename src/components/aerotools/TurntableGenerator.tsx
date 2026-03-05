'use client'

import { useRef, useState, useCallback } from 'react'
import { Upload, Loader2, Check, AlertTriangle, RotateCw, Image as ImageIcon } from 'lucide-react'

interface TurntableGeneratorProps {
  slug: string
  onComplete?: (config: { hFrames: number; vLevels: number; format: string }) => void
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
      scene.background = new THREE.Color(0x2a2d35)
      scene.fog = new THREE.Fog(0x2a2d35, 18, 40)

      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000)

      // Hangar lighting — warm industrial overhead
      scene.add(new THREE.AmbientLight(0xd4cbb8, 0.45))
      const mainLight = new THREE.DirectionalLight(0xfff5e6, 1.5)
      mainLight.position.set(3, 10, 4)
      mainLight.castShadow = true
      mainLight.shadow.mapSize.set(2048, 2048)
      mainLight.shadow.camera.near = 0.1
      mainLight.shadow.camera.far = 50
      mainLight.shadow.camera.left = -10
      mainLight.shadow.camera.right = 10
      mainLight.shadow.camera.top = 10
      mainLight.shadow.camera.bottom = -10
      mainLight.shadow.bias = -0.001
      scene.add(mainLight)
      const secondLight = new THREE.DirectionalLight(0xe8e0d0, 0.7)
      secondLight.position.set(-4, 8, -2)
      secondLight.castShadow = true
      scene.add(secondLight)
      const fillL = new THREE.DirectionalLight(0xd4e5ff, 0.3)
      fillL.position.set(-6, 3, 0)
      scene.add(fillL)
      const fillR = new THREE.DirectionalLight(0xd4e5ff, 0.2)
      fillR.position.set(6, 3, 0)
      scene.add(fillR)
      const workshopLight = new THREE.PointLight(0xffaa44, 0.25, 12)
      workshopLight.position.set(4, 4, -2)
      scene.add(workshopLight)

      // Hangar floor — epoxy concrete
      const floorGeo = new THREE.PlaneGeometry(40, 40)
      const floorMat = new THREE.MeshStandardMaterial({ color: 0x7a7d72, metalness: 0.05, roughness: 0.75 })
      const floor = new THREE.Mesh(floorGeo, floorMat)
      floor.rotation.x = -Math.PI / 2
      floor.receiveShadow = true
      scene.add(floor)

      // Concrete joints
      const jointMat = new THREE.MeshBasicMaterial({ color: 0x65685e, side: THREE.DoubleSide })
      for (let i = -4; i <= 4; i++) {
        const jh = new THREE.Mesh(new THREE.PlaneGeometry(40, 0.015), jointMat)
        jh.rotation.x = -Math.PI / 2; jh.position.set(0, 0.001, i * 2.5)
        scene.add(jh)
        const jv = new THREE.Mesh(new THREE.PlaneGeometry(0.015, 40), jointMat)
        jv.rotation.x = -Math.PI / 2; jv.position.set(i * 2.5, 0.001, 0)
        scene.add(jv)
      }

      // Yellow safety marking
      const safetyLine = new THREE.Mesh(
        new THREE.RingGeometry(4.2, 4.28, 64),
        new THREE.MeshBasicMaterial({ color: 0xf9a800, side: THREE.DoubleSide, transparent: true, opacity: 0.4 })
      )
      safetyLine.rotation.x = -Math.PI / 2; safetyLine.position.y = 0.002
      scene.add(safetyLine)

      // Closed hangar doors (360°)
      const createHangarWall = (width: number, height: number, posX: number, posZ: number, rotY: number) => {
        const g = new THREE.Group()
        const panelMat = new THREE.MeshStandardMaterial({ color: 0x4a4e55, metalness: 0.6, roughness: 0.4 })
        const panel = new THREE.Mesh(new THREE.PlaneGeometry(width, height), panelMat)
        panel.position.y = height / 2; g.add(panel)
        const ribMat = new THREE.MeshStandardMaterial({ color: 0x3e4248, metalness: 0.7, roughness: 0.35 })
        for (let y = 0.4; y < height; y += 0.6) {
          const rib = new THREE.Mesh(new THREE.BoxGeometry(width, 0.08, 0.04), ribMat)
          rib.position.set(0, y, 0.02); g.add(rib)
        }
        const seam = new THREE.Mesh(new THREE.BoxGeometry(0.06, height, 0.05),
          new THREE.MeshStandardMaterial({ color: 0x35383e, metalness: 0.7, roughness: 0.3 }))
        seam.position.set(0, height / 2, 0.025); g.add(seam)
        const rail = new THREE.Mesh(new THREE.BoxGeometry(width + 0.5, 0.12, 0.08),
          new THREE.MeshStandardMaterial({ color: 0x555860, metalness: 0.8, roughness: 0.25 }))
        rail.position.set(0, 0.06, 0.04); g.add(rail)
        const blueS = new THREE.Mesh(new THREE.PlaneGeometry(width, 0.2), new THREE.MeshBasicMaterial({ color: 0x0047ff }))
        blueS.position.set(0, height * 0.42, 0.01); g.add(blueS)
        const redS = new THREE.Mesh(new THREE.PlaneGeometry(width, 0.06), new THREE.MeshBasicMaterial({ color: 0xe61e2b }))
        redS.position.set(0, height * 0.42 - 0.18, 0.01); g.add(redS)
        g.position.set(posX, 0, posZ); g.rotation.y = rotY
        return g
      }
      scene.add(createHangarWall(22, 8, 0, -10, 0))
      scene.add(createHangarWall(22, 8, -10, 0, Math.PI / 2))
      scene.add(createHangarWall(22, 8, 10, 0, -Math.PI / 2))
      scene.add(createHangarWall(22, 8, 0, 10, Math.PI))

      // Step 3: Load model (STL or GLB)
      setStatus('loading-model')
      setProgressLabel(isSTL ? 'Chargement du fichier STL...' : 'Chargement du modèle 3D...')

      const buffer = await file.arrayBuffer()
      let model: InstanceType<typeof THREE.Object3D>

      if (isSTL) {
        const stlLoader = new STLLoader()
        const geometry = stlLoader.parse(buffer)
        geometry.computeVertexNormals()
        // Realistic brushed aluminum / industrial metal
        const material = new THREE.MeshStandardMaterial({
          color: 0xb8bcc4,
          metalness: 0.55,
          roughness: 0.35,
        })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.castShadow = true
        mesh.receiveShadow = true
        model = mesh
      } else {
        const gltfLoader = new GLTFLoader()
        const gltf = await new Promise<any>((resolve, reject) => {
          gltfLoader.parse(buffer, '', resolve, reject)
        })
        model = gltf.scene
        model.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
          }
        })
      }

      // Standard CAD orientation: Z-up → Y-up
      if (isSTL) {
        model.rotation.x = -Math.PI / 2
      }

      const box = new THREE.Box3().setFromObject(model)
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      const s = 3 / maxDim
      model.scale.multiplyScalar(s)

      const box2 = new THREE.Box3().setFromObject(model)
      const center2 = box2.getCenter(new THREE.Vector3())
      model.position.x -= center2.x
      model.position.z -= center2.z
      model.position.y -= box2.min.y
      scene.add(model)

      // Render helper
      const renderFrame = (hAngle: number, elevation: number, distance: number) => {
        const theta = THREE.MathUtils.degToRad(hAngle)
        const phi = THREE.MathUtils.degToRad(elevation)
        camera.position.set(
          distance * Math.sin(theta) * Math.cos(phi),
          distance * Math.sin(phi) + 0.5,
          distance * Math.cos(theta) * Math.cos(phi)
        )
        camera.lookAt(0, 1.0, 0)
        renderer.render(scene, camera)
      }

      // Preview render
      renderFrame(45, 25, 8)
      setPreviewUrl(canvas.toDataURL('image/webp', 0.8))

      // Step 4: Render all frames
      setStatus('rendering')
      const totalFrames = H_FRAMES * V_LEVELS
      const distance = 8
      const frames: { v: number; h: number; blob: Blob }[] = []

      for (let v = 0; v < V_LEVELS; v++) {
        for (let h = 0; h < H_FRAMES; h++) {
          const hAngle = (360 / H_FRAMES) * h
          const elevation = ELEVATIONS[v]

          renderFrame(hAngle, elevation, distance)

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

      // Step 6: Save metadata
      setProgressLabel('Sauvegarde des métadonnées...')
      await fetch('/api/aerotools/turntable', {
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

      setProgress(100)
      setStatus('done')
      setProgressLabel('Terminé !')
      onComplete?.({ hFrames: H_FRAMES, vLevels: V_LEVELS, format: 'webp' })
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
