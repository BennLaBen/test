'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface LogoProps {
  size?: 'small' | 'medium' | 'large'
  href?: string
}

export function Logo({ size = 'medium', href = '/' }: LogoProps) {
  const sizes = {
    small: { height: 44, width: 60 },
    medium: { height: 52, width: 80 },
    large: { height: 56, width: 100 }
  }

  const currentSize = sizes[size]

  const LogoContent = () => (
    <motion.div 
      className="relative group"
      style={{ height: currentSize.height, width: currentSize.width }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Bleu nuit metallic glow effect on hover */}
      <motion.div
        className="absolute -inset-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle, rgba(30, 58, 138, 0.6) 0%, rgba(220, 38, 38, 0.3) 50%, transparent 80%)',
          filter: 'blur(15px)',
        }}
      />
      
      {/* Logo image with bleu nuit metallic effect */}
      <div className="absolute inset-0 z-10">
        <Image
          src="/logo1-cropped.png"
          alt="LLEDO Industries"
          fill
          className="object-contain transition-all duration-300"
          style={{
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5)) drop-shadow(0 0 25px rgba(30, 58, 138, 0.4)) brightness(0.95) saturate(1.3)',
          }}
          priority
        />
      </div>
      
      {/* Metallic shine sweep effect on hover */}
      <motion.div
        className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden"
      >
        <motion.div
          className="absolute inset-0"
          initial={{ x: '-100%' }}
          whileHover={{ x: '200%' }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)',
            width: '50%'
          }}
        />
      </motion.div>
    </motion.div>
  )

  if (href) {
    return (
      <Link href={href} className="flex-shrink-0 block">
        <LogoContent />
      </Link>
    )
  }

  return <LogoContent />
}
