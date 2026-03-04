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
      scene.background = new THREE.Color(0xe0e0e4)

      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000)

      // Studio lighting
      scene.add(new THREE.AmbientLight(0xffffff, 0.6))
      const keyLight = new THREE.DirectionalLight(0xffffff, 1.2)
      keyLight.position.set(5, 8, 5)
      keyLight.castShadow = true
      keyLight.shadow.mapSize.set(2048, 2048)
      keyLight.shadow.camera.near = 0.1
      keyLight.shadow.camera.far = 50
      keyLight.shadow.camera.left = -10
      keyLight.shadow.camera.right = 10
      keyLight.shadow.camera.top = 10
      keyLight.shadow.camera.bottom = -10
      scene.add(keyLight)

      const fill = new THREE.DirectionalLight(0xeeeeff, 0.5)
      fill.position.set(-3, 4, -2)
      scene.add(fill)

      const rim = new THREE.DirectionalLight(0xffffff, 0.3)
      rim.position.set(0, 2, -5)
      scene.add(rim)

      // Ground
      const groundGeo = new THREE.CircleGeometry(10, 64)
      const groundMat = new THREE.ShadowMaterial({ opacity: 0.15 })
      const ground = new THREE.Mesh(groundGeo, groundMat)
      ground.rotation.x = -Math.PI / 2
      ground.receiveShadow = true
      scene.add(ground)

      // Ground ring
      const ringGeo = new THREE.RingGeometry(3.8, 4.0, 64)
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xc8c8cc, side: THREE.DoubleSide })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.rotation.x = -Math.PI / 2
      ring.position.y = 0.001
      scene.add(ring)

      // Step 3: Load model (STL or GLB)
      setStatus('loading-model')
      setProgressLabel(isSTL ? 'Chargement du fichier STL...' : 'Chargement du modèle 3D...')

      const buffer = await file.arrayBuffer()
      let model: InstanceType<typeof THREE.Object3D>

      if (isSTL) {
        const stlLoader = new STLLoader()
        const geometry = stlLoader.parse(buffer)
        geometry.computeVertexNormals()
        const material = new THREE.MeshStandardMaterial({
          color: 0x404045,
          metalness: 0.4,
          roughness: 0.5,
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

      const box = new THREE.Box3().setFromObject(model)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      const s = 3 / maxDim
      model.scale.setScalar(s)
      model.position.sub(center.multiplyScalar(s))
      model.position.y -= box.min.y * s
      scene.add(model)

      // Render helper
      const renderFrame = (hAngle: number, elevation: number, distance: number) => {
        const theta = THREE.MathUtils.degToRad(hAngle)
        const phi = THREE.MathUtils.degToRad(elevation)
        camera.position.set(
          distance * Math.sin(theta) * Math.cos(phi),
          distance * Math.sin(phi),
          distance * Math.cos(theta) * Math.cos(phi)
        )
        camera.lookAt(0, 0.8, 0)
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
