'use client'

import { useEffect, useRef, useState } from 'react'
import { Box, Maximize2, Minimize2, RotateCw, Loader2 } from 'lucide-react'

interface ModelViewer3DProps {
  src: string
  alt?: string
  poster?: string
  className?: string
}

export function ModelViewer3D({ src, alt = 'Modèle 3D', poster, className = '' }: ModelViewer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    // Dynamically import model-viewer (web component, client only)
    import('@google/model-viewer').catch(() => {
      console.warn('model-viewer failed to load')
      setError(true)
    })
  }, [])

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (!fullscreen) {
      containerRef.current.requestFullscreen?.()
      setFullscreen(true)
    } else {
      document.exitFullscreen?.()
      setFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-800/30 rounded-2xl border border-gray-700/50 ${className}`}>
        <div className="text-center p-8">
          <Box className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Viewer 3D non disponible</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl border border-gray-700/50 overflow-hidden group ${className}`}
    >
      {/* Loading state */}
      {!loaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900/80">
          <div className="text-center">
            <Loader2 className="h-8 w-8 text-blue-400 animate-spin mx-auto mb-2" />
            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Chargement du modèle 3D...</p>
          </div>
        </div>
      )}

      {/* HUD corners */}
      <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-cyan-500/40 z-20 pointer-events-none" />
      <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-cyan-500/40 z-20 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-cyan-500/40 z-20 pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-cyan-500/40 z-20 pointer-events-none" />

      {/* Badge 3D */}
      <div className="absolute top-4 left-14 z-20 flex items-center gap-1.5 px-2.5 py-1 bg-cyan-500/20 backdrop-blur-sm border border-cyan-500/30 rounded-lg pointer-events-none">
        <Box className="h-3.5 w-3.5 text-cyan-400" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">Modèle 3D</span>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-14 z-20 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={toggleFullscreen}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/60 backdrop-blur-sm border border-gray-600/50 rounded-lg text-[10px] font-bold uppercase tracking-wider text-white hover:bg-black/80 transition-all"
        >
          {fullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          {fullscreen ? 'Quitter' : 'Plein écran'}
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <RotateCw className="h-3 w-3 text-gray-400" />
        <span className="text-[10px] text-gray-400">Cliquer + glisser pour tourner • Scroll pour zoomer</span>
      </div>

      {/* @ts-ignore - model-viewer is a web component */}
      {/* @ts-expect-error model-viewer is a web component */}
      <model-viewer
        src={src}
        alt={alt}
        poster={poster}
        auto-rotate
        camera-controls
        shadow-intensity="1"
        shadow-softness="0.5"
        environment-image="neutral"
        exposure="1"
        interaction-prompt="auto"
        style={{
          width: '100%',
          height: '100%',
          minHeight: fullscreen ? '100vh' : '400px',
          backgroundColor: 'transparent',
          '--poster-color': 'transparent',
        } as React.CSSProperties}
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}
