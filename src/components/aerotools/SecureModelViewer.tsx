'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { Loader2, Shield } from 'lucide-react'

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

interface SecureModelViewerProps {
  slug: string
  productName?: string
  productSubtitle?: string
  metalColor?: string
  className?: string
}

export function SecureModelViewer({
  slug,
  productName = 'Produit Aerotools',
  productSubtitle = 'Équipement GSE certifié',
  className = '',
}: SecureModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mvRef = useRef<HTMLElement | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modelUrl, setModelUrl] = useState<string | null>(null)
  const [mvReady, setMvReady] = useState(false)

  // Load model-viewer web component
  useEffect(() => {
    import('@google/model-viewer').then(() => setMvReady(true)).catch(() => setError('Viewer 3D non disponible'))
  }, [])

  // Fetch model securely and create blob URL
  const loadModel = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const tokenRes = await fetch(`/api/aerotools/model/token?slug=${slug}`)
      if (!tokenRes.ok) throw new Error('Token invalide')
      const { token } = await tokenRes.json()

      const modelRes = await fetch(`/api/aerotools/model?slug=${slug}&token=${token}`)
      if (!modelRes.ok) throw new Error('Modèle introuvable')
      const blob = await modelRes.blob()
      const url = URL.createObjectURL(blob)
      setModelUrl(url)
      // Data already in memory, model-viewer just parses it
      setTimeout(() => setLoading(false), 800)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement')
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    if (mvReady) loadModel()
    return () => { if (modelUrl) URL.revokeObjectURL(modelUrl) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mvReady, loadModel])

  // Anti-theft: block right-click
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const block = (e: MouseEvent) => e.preventDefault()
    const blockKeys = (e: KeyboardEvent) => {
      if ((e.ctrlKey && (e.key === 's' || e.key === 'u')) || e.key === 'F12') e.preventDefault()
    }
    container.addEventListener('contextmenu', block)
    document.addEventListener('keydown', blockKeys)
    return () => {
      container.removeEventListener('contextmenu', block)
      document.removeEventListener('keydown', blockKeys)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden select-none ${className}`}
      style={{
        background: 'linear-gradient(180deg, #e8e8ec 0%, #d5d5db 30%, #c8c8d0 60%, #bbbbc4 100%)',
        userSelect: 'none',
      }}
      onDragStart={(e) => e.preventDefault()}
    >
      {/* ── Loading ── */}
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center" style={{ background: 'linear-gradient(180deg, #e8e8ec 0%, #d0d0d6 100%)' }}>
          <Loader2 className="h-8 w-8 text-gray-400 animate-spin mb-4" />
          <p className="text-[11px] text-gray-400 uppercase tracking-[0.3em]">Chargement 3D</p>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="absolute inset-0 z-50 flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #e8e8ec 0%, #d0d0d6 100%)' }}>
          <div className="text-center">
            <Shield className="h-10 w-10 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <button onClick={loadModel} className="px-4 py-2 text-xs uppercase tracking-wider text-gray-600 border border-gray-300 rounded hover:bg-gray-100 transition-colors">
              Réessayer
            </button>
          </div>
        </div>
      )}

      {/* ── Google Model Viewer (Mercedes-style) ── */}
      {modelUrl && mvReady && (
        <div
          ref={(el) => {
            if (!el) return
            const mv = el.querySelector('model-viewer')
            if (mv && mv !== mvRef.current) {
              mvRef.current = mv
              mv.addEventListener('load', () => setLoading(false))
              mv.addEventListener('error', () => {
                setError('Erreur de chargement du modèle')
                setLoading(false)
              })
            }
          }}
          style={{ width: '100%', height: '100%' }}
          dangerouslySetInnerHTML={{
            __html: `<model-viewer
              src="${modelUrl}"
              alt="${productName}"
              auto-rotate
              auto-rotate-delay="0"
              rotation-per-second="18deg"
              camera-controls
              touch-action="pan-y"
              shadow-intensity="0.8"
              shadow-softness="0.8"
              exposure="1.1"
              
              interaction-prompt="auto"
              camera-orbit="45deg 65deg auto"
              min-camera-orbit="auto 20deg auto"
              max-camera-orbit="auto 90deg auto"
              field-of-view="30deg"
              style="width:100%;height:100%;background:transparent;--poster-color:transparent;"
            ></model-viewer>`
          }}
        />
      )}

      {/* ── Invisible watermark ── */}
      <div className="absolute inset-0 pointer-events-none z-30 select-none">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.015] rotate-[-25deg]">
          <span className="text-gray-800 text-6xl font-black tracking-[0.5em] select-none whitespace-nowrap">
            LLEDO AEROTOOLS
          </span>
        </div>
      </div>

      {/* ── Product label (Mercedes-style: bottom center) ── */}
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
    </div>
  )
}
