'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface LogoProps {
  size?: 'small' | 'medium' | 'large'
  href?: string
}

export function Logo({ size = 'medium', href = '/' }: LogoProps) {
  const sizes = {
    small: { iconSize: 40 },
    medium: { iconSize: 52 },
    large: { iconSize: 64 }
  }

  const currentSize = sizes[size]

  const LogoContent = () => (
    <motion.div 
      className="relative group"
      style={{ height: currentSize.iconSize, width: currentSize.iconSize }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Metallic glow effect on hover */}
      <motion.div
        className="absolute -inset-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, rgba(239, 68, 68, 0.3) 60%, transparent 80%)',
          filter: 'blur(12px)',
        }}
      />
      
      {/* Main logo container - Modern LI icon */}
      <div 
        className="relative w-full h-full rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 40%, #2563eb 60%, #1e3a8a 100%)',
          boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.2)'
        }}
      >
        {/* Metallic overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 40%, rgba(0,0,0,0.15) 100%)'
          }}
        />
        
        {/* Red accent bar */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-[20%]"
          style={{
            background: 'linear-gradient(180deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)',
            boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.2)'
          }}
        />
        
        {/* LI Letters */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span 
            className="font-black text-white relative z-10"
            style={{ 
              fontSize: currentSize.iconSize * 0.45,
              textShadow: '0 2px 4px rgba(0,0,0,0.4), 0 0 20px rgba(255,255,255,0.2)',
              letterSpacing: '-0.02em',
              marginRight: currentSize.iconSize * 0.08
            }}
          >
            LI
          </span>
        </div>
        
        {/* Shine sweep effect on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
          initial={{ x: '-100%' }}
          whileHover={{ x: '200%' }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            width: '40%'
          }}
        />
        
        {/* Corner highlights for 3D effect */}
        <div className="absolute top-1 left-1 w-2 h-2 rounded-sm bg-white/20" />
      </div>
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
