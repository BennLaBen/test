'use client'

import { useEffect } from 'react'
import { useMotionValue, useSpring, MotionValue } from 'framer-motion'

interface ParallaxMotionValues {
  rotateX: MotionValue<number>
  rotateY: MotionValue<number>
  x: MotionValue<number>
  y: MotionValue<number>
}

const springConfig = { stiffness: 50, damping: 20, mass: 0.5 }

/**
 * Track mouse position and return smooth framer-motion MotionValues
 * for 3D parallax. Integrates directly with motion.div style props.
 */
export function useMouseParallax(strength: number = 1): ParallaxMotionValues {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rawRotX = useMotionValue(0)
  const rawRotY = useMotionValue(0)

  const x = useSpring(rawX, springConfig)
  const y = useSpring(rawY, springConfig)
  const rotateX = useSpring(rawRotX, springConfig)
  const rotateY = useSpring(rawRotY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      const nx = (e.clientX - centerX) / centerX   // -1 to 1
      const ny = (e.clientY - centerY) / centerY   // -1 to 1

      rawX.set(nx * 30 * strength)
      rawY.set(ny * 20 * strength)
      rawRotX.set(-ny * 4 * strength)
      rawRotY.set(nx * 6 * strength)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [strength, rawX, rawY, rawRotX, rawRotY])

  return { rotateX, rotateY, x, y }
}
