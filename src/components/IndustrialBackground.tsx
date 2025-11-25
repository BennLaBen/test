'use client'

import { motion } from 'framer-motion'
import { Settings, Cpu, Hexagon, Grid3x3 } from 'lucide-react'

interface IndustrialBackgroundProps {
  variant?: 'grid' | 'blueprint' | 'circuit' | 'precision'
  showGears?: boolean
  showGrid?: boolean
  intensity?: 'light' | 'medium' | 'strong'
}

export function IndustrialBackground({ 
  variant = 'grid',
  showGears = true,
  showGrid = true,
  intensity = 'medium'
}: IndustrialBackgroundProps) {
  
  const opacityMap = {
    light: 0.3,
    medium: 0.5,
    strong: 0.7
  }

  const opacity = opacityMap[intensity]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grille de fond */}
      {showGrid && (
        <div 
          className={`absolute inset-0 ${
            variant === 'grid' ? 'industrial-grid' :
            variant === 'blueprint' ? 'blueprint-pattern' :
            variant === 'circuit' ? 'circuit-pattern' :
            'precision-grid'
          }`}
          style={{ opacity: opacity * 0.5 }}
        />
      )}

      {/* Engrenages décoratifs */}
      {showGears && (
        <>
          {/* Engrenage 1 - Haut droite */}
          <motion.div
            className="absolute -top-20 -right-20 text-primary-500/10"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Settings size={200} strokeWidth={0.5} />
          </motion.div>

          {/* Engrenage 2 - Bas gauche */}
          <motion.div
            className="absolute -bottom-24 -left-24 text-primary-500/10"
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          >
            <Settings size={250} strokeWidth={0.5} />
          </motion.div>

          {/* Engrenage 3 - Centre droit (petit) */}
          <motion.div
            className="absolute top-1/3 -right-16 text-primary-500/10"
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          >
            <Settings size={150} strokeWidth={0.5} />
          </motion.div>

          {/* Circuit décoratif - Haut gauche */}
          <motion.div
            className="absolute top-20 -left-12 text-primary-500/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, opacity * 0.3, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Cpu size={180} strokeWidth={0.5} />
          </motion.div>

          {/* Hexagones - Milieu */}
          <motion.div
            className="absolute top-1/2 left-1/4 text-primary-500/10"
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 10, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Hexagon size={120} strokeWidth={0.5} />
          </motion.div>

          {/* Grille 3x3 - Bas droite */}
          <motion.div
            className="absolute bottom-32 right-1/4 text-primary-500/10"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [opacity * 0.3, opacity * 0.5, opacity * 0.3]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Grid3x3 size={100} strokeWidth={0.5} />
          </motion.div>
        </>
      )}

      {/* Lignes techniques diagonales */}
      <div className="absolute inset-0" style={{ opacity: opacity * 0.2 }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="diagonal-lines" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <line x1="0" y1="40" x2="40" y2="0" stroke="currentColor" strokeWidth="0.5" className="text-primary-500" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diagonal-lines)" />
        </svg>
      </div>

      {/* Indicateurs techniques (points clignotants) */}
      <div className="absolute top-10 left-10">
        <motion.div
          className="w-3 h-3 rounded-full bg-primary-500"
          animate={{ 
            opacity: [1, 0.3, 1],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' }}
        />
      </div>

      <div className="absolute bottom-10 right-10">
        <motion.div
          className="w-3 h-3 rounded-full bg-primary-500"
          animate={{ 
            opacity: [1, 0.3, 1],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' }}
        />
      </div>

      {/* Scanline effect */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        style={{ opacity: opacity * 0.5 }}
      />
    </div>
  )
}

