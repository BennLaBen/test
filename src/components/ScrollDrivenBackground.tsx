'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export function ScrollDrivenBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Transforms basés sur le scroll - comme une vidéo qui avance
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 300])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grille industrielle animée par scroll */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{ y: y1 }}
      >
        <div 
          className="h-[200%] w-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 2px, transparent 2px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 2px, transparent 2px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </motion.div>

      {/* Lignes de circuit qui avancent */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{ y: y2, opacity }}
      >
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent"
            style={{
              top: `${(i * 8) % 100}%`,
              left: 0,
              right: 0,
              willChange: 'transform'
            }}
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.3
            }}
          />
        ))}
      </motion.div>

      {/* Cercles tech qui tournent avec le scroll */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-96 h-96"
        style={{ rotate, scale }}
      >
        <div className="absolute inset-0 rounded-full border-2 border-primary-500/20" />
        <div className="absolute inset-8 rounded-full border border-primary-500/30" />
        <div className="absolute inset-16 rounded-full border border-primary-500/40" />
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 left-1/4 w-72 h-72"
        style={{ rotate: useTransform(scrollYProgress, [0, 1], [0, -360]) }}
      >
        <div className="absolute inset-0 rounded-full border-2 border-blue-500/20" />
        <div className="absolute inset-6 rounded-full border border-blue-500/30" />
      </motion.div>

      {/* Particules industrielles qui montent */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary-500 rounded-full"
          style={{
            left: `${(i * 5) % 100}%`,
            top: `${(i * 7) % 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 2
          }}
        />
      ))}

      {/* Hexagones tech qui se déplacent */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`hex-${i}`}
          className="absolute"
          style={{
            left: `${(i * 20 + 10) % 90}%`,
            top: `${(i * 15 + 10) % 80}%`,
            width: '60px',
            height: '60px',
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 180, 360],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 8 + i,
            repeat: Infinity,
            ease: "linear",
            delay: i * 1.5
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon
              points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
              fill="none"
              stroke="rgba(59, 130, 246, 0.4)"
              strokeWidth="2"
            />
          </svg>
        </motion.div>
      ))}

      {/* Scanlines qui se déplacent avec le scroll */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"
        style={{
          y: useTransform(scrollYProgress, [0, 1], [-100, 500]),
          height: '200px'
        }}
      />
    </div>
  )
}

