'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface LogoProps {
  size?: 'small' | 'medium' | 'large'
  href?: string
}

export function Logo({ size = 'medium', href = '/' }: LogoProps) {
  const sizes = {
    small: { iconSize: 36, fontSize: 14, gap: 8 },
    medium: { iconSize: 48, fontSize: 18, gap: 10 },
    large: { iconSize: 60, fontSize: 22, gap: 12 }
  }

  const currentSize = sizes[size]

  const LogoContent = () => (
    <motion.div 
      className="relative group flex items-center"
      style={{ gap: currentSize.gap }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Logo Icon - Metallic LI Design */}
      <div 
        className="relative flex items-center justify-center rounded-lg overflow-hidden"
        style={{ 
          width: currentSize.iconSize, 
          height: currentSize.iconSize,
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e40af 100%)',
          boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
        }}
      >
        {/* Metallic overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)'
          }}
        />
        
        {/* LI Letters */}
        <span 
          className="relative z-10 font-black text-white"
          style={{ 
            fontSize: currentSize.iconSize * 0.5,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            letterSpacing: '-0.05em'
          }}
        >
          LI
        </span>
        
        {/* Shine effect on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          }}
        />
      </div>
      
      {/* Company Name */}
      <div className="flex flex-col">
        <span 
          className="font-black uppercase tracking-wide"
          style={{ 
            fontSize: currentSize.fontSize,
            background: 'linear-gradient(135deg, #e2e8f0 0%, #ffffff 50%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: 'none',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
          }}
        >
          LLEDO
        </span>
        <span 
          className="font-medium uppercase tracking-widest text-blue-400"
          style={{ 
            fontSize: currentSize.fontSize * 0.55,
            marginTop: -2
          }}
        >
          INDUSTRIES
        </span>
      </div>
      
      {/* Glow effect on hover */}
      <motion.div
        className="absolute -inset-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
          filter: 'blur(10px)'
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
