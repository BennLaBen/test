'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { Loader2, Shield } from 'lucide-react'

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface SecureTurntableViewerProps {
  slug: string
  productName?: string
  hFrames?: number       // nombre de frames horizontaux (ex: 36)
  vLevels?: number       // nombre de niveaux verticaux (ex: 3)
  format?: string        // webp | png | jpeg
  baseUrl?: string       // URL de base pour les images (Vercel Blob ou local)
  className?: string
}

interface FrameData {
  elevation: number
  angle: number
  image: HTMLImageElement
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export function SecureTurntableViewer({
  slug,
  productName = 'Produit Aerotools',
  hFrames = 36,
  vLevels = 3,
  format = 'webp',
  baseUrl,
  className = '',
}: SecureTurntableViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const framesRef = useRef<FrameData[][]>([])  // [vLevel][hFrame]
  const animRef = useRef<number>(0)

  const [loading, setLoading] = useState(true)
  const [loadProgress, setLoadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [currentH, setCurrentH] = useState(0)
  const [currentV, setCurrentV] = useState(Math.floor(vLevels / 2))  // milieu
  const [autoRotate] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const dragStartRef = useRef({ x: 0, y: 0, h: 0, v: 0 })

  // ─── Load all frames ───
  const loadFrames = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      setLoadProgress(0)

      const totalFrames = hFrames * vLevels
      let loaded = 0
      const allFrames: FrameData[][] = []

      for (let v = 0; v < vLevels; v++) {
        const levelFrames: FrameData[] = []
        for (let h = 0; h < hFrames; h++) {
          const filename = `${slug}_e${v}_h${String(h).padStart(3, '0')}.${format}`
          const resolvedBase = baseUrl || `/images/aerotools/360/${slug}`
          const url = `${resolvedBase}/${filename}`

          const img = await new Promise<HTMLImageElement>((resolve, reject) => {
            const image = new Image()
            image.crossOrigin = 'anonymous'
            image.onload = () => resolve(image)
            image.onerror = () => reject(new Error(`Image introuvable: ${filename}`))
            image.src = url
          })

          levelFrames.push({
            elevation: v,
            angle: (360 / hFrames) * h,
            image: img,
          })

          loaded++
          setLoadProgress(Math.round((loaded / totalFrames) * 100))
        }
        allFrames.push(levelFrames)
      }

      framesRef.current = allFrames
      setLoading(false)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement des images')
      setLoading(false)
    }
  }, [slug, hFrames, vLevels, format, baseUrl])

  useEffect(() => {
    loadFrames()
  }, [loadFrames])

  // ─── Draw frame on canvas (secure: no <img> tag exposed) ───
  const drawFrame = useCallback((hIndex: number, vIndex: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const frames = framesRef.current
    if (!frames[vIndex] || !frames[vIndex][hIndex]) return

    const img = frames[vIndex][hIndex].image
    const container = containerRef.current
    if (!container) return

    // Set canvas to container size for sharp rendering
    const rect = container.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = rect.width + 'px'
    canvas.style.height = rect.height + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // Clear
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Draw image fitted (contain)
    const imgAspect = img.width / img.height
    const canAspect = rect.width / rect.height
    let drawW, drawH, drawX, drawY

    if (imgAspect > canAspect) {
      drawW = rect.width
      drawH = rect.width / imgAspect
      drawX = 0
      drawY = (rect.height - drawH) / 2
    } else {
      drawH = rect.height
      drawW = rect.height * imgAspect
      drawX = (rect.width - drawW) / 2
      drawY = 0
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH)

    // Burn invisible watermark into canvas pixels
    ctx.save()
    ctx.globalAlpha = 0.02
    ctx.font = 'bold 48px system-ui'
    ctx.fillStyle = '#000'
    ctx.translate(rect.width / 2, rect.height / 2)
    ctx.rotate(-0.4)
    ctx.textAlign = 'center'
    ctx.fillText('LLEDO AEROTOOLS', 0, 0)
    ctx.fillText('LLEDO AEROTOOLS', 0, 80)
    ctx.fillText('LLEDO AEROTOOLS', 0, -80)
    ctx.restore()
  }, [])

  // ─── Auto-rotation animation ───
  useEffect(() => {
    if (loading || error || !autoRotate) return

    let lastTime = 0
    const speed = 0.003 // frames per ms — ultra slow, luxury showcase rotation
    let accum = 0

    const animate = (time: number) => {
      if (lastTime) {
        accum += (time - lastTime) * speed
        if (accum >= 1) {
          const steps = Math.floor(accum)
          accum -= steps
          setCurrentH(prev => (prev + steps) % hFrames)
        }
      }
      lastTime = time
      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [loading, error, autoRotate, hFrames])

  // ─── Redraw when frame changes ───
  useEffect(() => {
    if (!loading && !error) {
      drawFrame(currentH, currentV)
    }
  }, [currentH, currentV, loading, error, drawFrame])

  // ─── Resize handler ───
  useEffect(() => {
    const handleResize = () => {
      if (!loading && !error) drawFrame(currentH, currentV)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [currentH, currentV, loading, error, drawFrame])

  // ─── Mouse/touch drag handling ───
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      h: currentH,
      v: currentV,
    }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [currentH, currentV])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return

    const dx = e.clientX - dragStartRef.current.x
    const dy = e.clientY - dragStartRef.current.y

    // Horizontal: natural drag — ~400px for full 360°
    const hSensitivity = hFrames / 400
    let newH = dragStartRef.current.h - Math.round(dx * hSensitivity)
    newH = ((newH % hFrames) + hFrames) % hFrames
    setCurrentH(newH)

    // Vertical: very slight, clamped (like Mercedes)
    if (vLevels > 1) {
      const vSensitivity = vLevels / 300
      let newV = dragStartRef.current.v + Math.round(dy * vSensitivity)
      newV = Math.max(0, Math.min(vLevels - 1, newV))
      setCurrentV(newV)
    }
  }, [isDragging, hFrames, vLevels])

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // ─── Anti-theft measures ───
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const blockContext = (e: MouseEvent) => e.preventDefault()
    const blockKeys = (e: KeyboardEvent) => {
      if ((e.ctrlKey && (e.key === 's' || e.key === 'u' || e.key === 'S' || e.key === 'U')) || e.key === 'F12') {
        e.preventDefault()
      }
    }
    const blockDrag = (e: DragEvent) => e.preventDefault()

    container.addEventListener('contextmenu', blockContext)
    container.addEventListener('dragstart', blockDrag)
    document.addEventListener('keydown', blockKeys)

    return () => {
      container.removeEventListener('contextmenu', blockContext)
      container.removeEventListener('dragstart', blockDrag)
      document.removeEventListener('keydown', blockKeys)
    }
  }, [])

  // ─── Prevent canvas data extraction ───
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Override toDataURL and toBlob to prevent screenshot via JS
    const noop = () => { return '' }
    const noopBlob = () => { return }
    try {
      Object.defineProperty(canvas, 'toDataURL', { value: noop, writable: false })
      Object.defineProperty(canvas, 'toBlob', { value: noopBlob, writable: false })
    } catch {
      // Silently fail if can't override
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden select-none ${className}`}
      style={{
        background: 'linear-gradient(180deg, #e8e8ec 0%, #d5d5db 30%, #c8c8d0 60%, #bbbbc4 100%)',
        userSelect: 'none',
        touchAction: 'none',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      {/* ── Loading ── */}
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center" style={{ background: 'linear-gradient(180deg, #e8e8ec 0%, #d0d0d6 100%)' }}>
          <Loader2 className="h-8 w-8 text-gray-400 animate-spin mb-4" />
          <p className="text-[11px] text-gray-400 uppercase tracking-[0.3em] mb-3">Chargement</p>
          {/* Progress bar */}
          <div className="w-48 h-1 bg-gray-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-500 rounded-full transition-all duration-200"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-2">{loadProgress}%</p>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="absolute inset-0 z-50 flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #e8e8ec 0%, #d0d0d6 100%)' }}>
          <div className="text-center">
            <Shield className="h-10 w-10 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-500 mb-2">{error}</p>
            <p className="text-xs text-gray-400 mb-4">Les images turntable n&apos;ont pas encore été générées pour ce produit.</p>
            <button onClick={loadFrames} className="px-4 py-2 text-xs uppercase tracking-wider text-gray-600 border border-gray-300 rounded hover:bg-gray-100 transition-colors">
              Réessayer
            </button>
          </div>
        </div>
      )}

      {/* ── Secure Canvas (NO <img> exposed) ── */}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ display: loading || error ? 'none' : 'block' }}
      />


      {/* ── Frame indicator (subtle) ── */}
      {!loading && !error && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex gap-0.5 pointer-events-none">
          {Array.from({ length: Math.min(hFrames, 36) }).map((_, i) => {
            const frameIndex = hFrames > 36 ? Math.round(i * (hFrames / 36)) : i
            return (
              <div
                key={i}
                className="w-1 h-1 rounded-full transition-colors duration-100"
                style={{
                  backgroundColor: frameIndex === currentH ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)',
                }}
              />
            )
          })}
        </div>
      )}

      {/* ── Product label (Mercedes-style) ── */}
      {!loading && !error && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="bg-white/70 backdrop-blur-sm px-6 py-2 rounded-full border border-gray-200/80 shadow-sm">
            <span className="text-[11px] text-gray-600 font-medium tracking-wider uppercase">
              {productName}
            </span>
          </div>
        </div>
      )}

      {/* ── Security badge ── */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-2.5 py-1 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-full pointer-events-none">
        <Shield className="h-3 w-3 text-green-500/60" />
        <span className="text-[9px] uppercase tracking-wider text-gray-400 font-medium">Protégé</span>
      </div>

      {/* ── Drag hint ── */}
      {!loading && !error && !isDragging && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-pulse">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/5 rounded-full">
            <span className="text-[10px] text-gray-400">↔ Glissez pour tourner</span>
          </div>
        </div>
      )}
    </div>
  )
}
