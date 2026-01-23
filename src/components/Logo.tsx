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
    small: { height: 50, width: 180 },
    medium: { height: 70, width: 250 },
    large: { height: 90, width: 320 }
  }

  const currentSize = sizes[size]

  const LogoContent = () => (
    <motion.div 
      className="relative group"
      style={{ height: currentSize.height, width: currentSize.width }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Metallic glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(220, 38, 38, 0.2) 50%, transparent 70%)',
          filter: 'blur(15px)',
          transform: 'scale(1.3)'
        }}
      />
      
      {/* Logo image with metallic effect */}
      <div className="absolute inset-0 z-10">
        <Image
          src="/logo sans fond et nom.png"
          alt="LLEDO Industries Logo"
          fill
          className="object-contain object-left transition-all duration-300"
          style={{
            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4)) drop-shadow(0 0 20px rgba(59, 130, 246, 0.3)) contrast(1.1) saturate(1.2)',
          }}
          priority
        />
      </div>
      
      {/* Metallic shine sweep effect on hover */}
      <motion.div
        className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden rounded-lg"
      >
        <motion.div
          className="absolute inset-0"
          initial={{ x: '-100%' }}
          whileHover={{ x: '200%' }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
            width: '50%'
          }}
        />
      </motion.div>
      
      {/* Subtle metallic border glow */}
      <div 
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.1)'
        }}
      />
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
