'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Phone, Mail, Wrench } from 'lucide-react'

function HelicopterSVG({ flipped = false }: { flipped?: boolean }) {
  return (
    <svg
      viewBox="0 0 220 80"
      fill="currentColor"
      className="w-full h-full"
      style={{ transform: flipped ? 'scaleX(-1)' : undefined }}
    >
      <rect x="55" y="5" width="90" height="5" rx="2.5" />
      <circle cx="100" cy="7" r="5" />
      <ellipse cx="82" cy="38" rx="22" ry="15" />
      <ellipse cx="79" cy="34" rx="13" ry="10" fill="rgba(96,165,250,0.25)" />
      <path d="M62 32 Q105 22 148 36 L153 52 Q118 62 62 52 Z" />
      <path d="M148 44 L192 33 L192 40 L148 51 Z" />
      <rect x="188" y="21" width="5" height="24" rx="2.5" />
      <line x1="70" y1="58" x2="66" y2="70" stroke="currentColor" strokeWidth="3" />
      <line x1="94" y1="58" x2="94" y2="70" stroke="currentColor" strokeWidth="3" />
      <line x1="66" y1="70" x2="94" y2="70" stroke="currentColor" strokeWidth="3" />
      <line x1="122" y1="56" x2="119" y2="68" stroke="currentColor" strokeWidth="3" />
      <line x1="142" y1="54" x2="142" y2="68" stroke="currentColor" strokeWidth="3" />
      <line x1="119" y1="68" x2="142" y2="68" stroke="currentColor" strokeWidth="3" />
    </svg>
  )
}

function FlyingHelicopter({
  delay = 0,
  top = '30%',
  scale = 1,
  opacity = 0.4,
  flipped = false,
}: {
  delay?: number
  top?: string
  scale?: number
  opacity?: number
  flipped?: boolean
}) {
  const duration = 16 + delay * 3
  return (
    <motion.div
      className="absolute text-blue-400 pointer-events-none"
      style={{ top, width: 200 * scale, height: 76 * scale, opacity }}
      initial={{ x: flipped ? '110vw' : '-250px' }}
      animate={{ x: flipped ? '-250px' : '110vw' }}
      transition={{ duration, repeat: Infinity, delay, ease: 'linear' }}
    >
      <HelicopterSVG flipped={flipped} />
    </motion.div>
  )
}

export default function BoutiquePage() {
  return (
    <div className="relative min-h-screen bg-gray-950 text-white overflow-hidden flex flex-col items-center justify-center">

      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-700/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Warning stripes */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-[repeating-linear-gradient(45deg,rgba(245,158,11,0.2)_0,rgba(245,158,11,0.2)_14px,transparent_14px,transparent_28px)]" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600" />

      {/* Flying helicopters */}
      <FlyingHelicopter delay={0}  top="10%"  scale={0.7} opacity={0.30} />
      <FlyingHelicopter delay={6}  top="70%"  scale={0.5} opacity={0.20} flipped />
      <FlyingHelicopter delay={11} top="40%"  scale={0.9} opacity={0.22} />
      <FlyingHelicopter delay={3}  top="83%"  scale={0.4} opacity={0.15} flipped />
      <FlyingHelicopter delay={8}  top="25%"  scale={1.0} opacity={0.18} flipped />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-80 h-28 mb-10"
        >
          <Image
            src="/images/aerotools/logo-aero-distribution.png?v=local-11"
            alt="LLEDO Aero Distribution"
            fill
            className="object-contain"
            priority
            unoptimized
          />
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-3 mb-6 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full"
        >
          <Wrench className="h-4 w-4 text-amber-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
            Hangar en cours de fabrication
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.95] mb-6"
        >
          <span className="block text-white">Boutique</span>
          <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
            AEROTOOLS
          </span>
          <span className="block text-white">à venir.</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="text-gray-400 text-lg leading-relaxed mb-10 max-w-xl"
        >
          Nos équipes préparent le hangar. La boutique en ligne d&apos;outillage
          aéronautique certifié ouvrira ses portes très prochainement.
        </motion.p>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="w-full max-w-md mb-10"
        >
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            <span>Progression</span>
            <span>Ouverture prochaine</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '72%' }}
              transition={{ duration: 1.5, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            href="tel:+33442029674"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-colors"
          >
            <Phone className="h-4 w-4" />
            +33 4 42 02 96 74
          </Link>
          <Link
            href="mailto:contact@lledo.fr"
            className="flex items-center gap-2 px-6 py-3 border border-gray-700 hover:border-blue-500/50 text-gray-300 hover:text-white rounded-xl font-bold text-sm transition-colors"
          >
            <Mail className="h-4 w-4" />
            Nous contacter
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors underline underline-offset-4"
          >
            Retour au site
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
