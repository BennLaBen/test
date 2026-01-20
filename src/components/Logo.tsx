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
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
          filter: 'blur(20px)',
          transform: 'scale(1.2)'
        }}
      />
      
      {/* Logo image with enhanced contrast */}
      <div className="absolute inset-0 z-10">
        <Image
          src="/logo sans fond et nom.png"
          alt="LLEDO Industries Logo"
          fill
          className="object-contain object-left drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] group-hover:drop-shadow-[0_4px_12px_rgba(59,130,246,0.4)] transition-all duration-300"
          priority
        />
      </div>
      
      {/* Subtle shine effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
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
