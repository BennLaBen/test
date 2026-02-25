'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Wrench, HardHat } from 'lucide-react'
import { SEO } from '@/components/SEO'

// ─── SVG HELICOPTER (fun cartoon style) ───
function HelicopterSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main rotor */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 0.3, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '100px 20px' }}
      >
        <rect x="20" y="18" width="160" height="4" rx="2" fill="#60a5fa" />
      </motion.g>
      {/* Rotor mast */}
      <rect x="96" y="20" width="8" height="15" rx="2" fill="#64748b" />
      {/* Body */}
      <ellipse cx="100" cy="55" rx="55" ry="22" fill="#1e40af" />
      <ellipse cx="100" cy="55" rx="50" ry="18" fill="#2563eb" />
      {/* Cockpit window */}
      <ellipse cx="130" cy="50" rx="18" ry="12" fill="#93c5fd" opacity="0.8" />
      <ellipse cx="132" cy="48" rx="8" ry="5" fill="white" opacity="0.4" />
      {/* Tail */}
      <path d="M45 55 L10 40 L10 50 L45 58Z" fill="#1e40af" />
      {/* Tail rotor */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 0.15, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '10px 45px' }}
      >
        <rect x="6" y="30" width="8" height="30" rx="3" fill="#60a5fa" />
      </motion.g>
      {/* Skids */}
      <rect x="70" y="75" width="60" height="3" rx="1.5" fill="#475569" />
      <rect x="80" y="72" width="4" height="6" rx="1" fill="#475569" />
      <rect x="116" y="72" width="4" height="6" rx="1" fill="#475569" />
      {/* Cute eyes on cockpit */}
      <circle cx="134" cy="48" r="3" fill="#1e3a5f" />
      <circle cx="135" cy="47" r="1.2" fill="white" />
    </svg>
  )
}

export default function BoutiquePage() {
  return (
    <>
      <SEO
        title="LLEDO Aerotools — En cours de développement"
        description="La boutique LLEDO Aerotools est en cours de développement. Outillage aéronautique certifié bientôt disponible."
      />

      <div className="min-h-screen bg-gray-950 text-white overflow-hidden relative">
        {/* Stars / particles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.1,
              }}
              animate={{ opacity: [0.1, 0.6, 0.1] }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Back link */}
        <div className="relative z-20 pt-8 px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au site
          </Link>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] px-4">
          
          {/* Flying helicopter animation — goes across the screen in a loop */}
          <div className="absolute top-[15%] left-0 right-0 h-32 overflow-hidden pointer-events-none">
            <motion.div
              animate={{
                x: ['110vw', '-20vw'],
                y: [0, -20, 10, -15, 5, 0],
              }}
              transition={{
                x: { duration: 8, repeat: Infinity, ease: 'linear' },
                y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="absolute"
              style={{ width: 120 }}
            >
              <HelicopterSVG className="w-28 h-auto drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]" />
            </motion.div>
          </div>

          {/* Second helicopter going the other way (smaller, in background) */}
          <div className="absolute top-[35%] left-0 right-0 h-20 overflow-hidden pointer-events-none opacity-30">
            <motion.div
              animate={{
                x: ['-15vw', '115vw'],
                y: [0, -10, 5, -8, 0],
              }}
              transition={{
                x: { duration: 12, repeat: Infinity, ease: 'linear', delay: 3 },
                y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="absolute"
              style={{ width: 70 }}
            >
              <HelicopterSVG className="w-16 h-auto scale-x-[-1]" />
            </motion.div>
          </div>

          {/* ═══ CLOSED HANGAR ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative w-full max-w-2xl mx-auto mb-12"
          >
            {/* Hangar structure */}
            <div className="relative">
              {/* Roof */}
              <div className="h-8 bg-gradient-to-b from-gray-600 to-gray-700 rounded-t-[40px] border-t-2 border-gray-500" />

              {/* Doors (closed) */}
              <div className="flex h-52 sm:h-64">
                {/* Left door */}
                <div className="flex-1 bg-gradient-to-r from-gray-700 to-gray-600 border-r-2 border-gray-500 relative overflow-hidden">
                  {/* Rivets */}
                  <div className="absolute top-4 left-4 grid grid-cols-2 gap-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-2.5 h-2.5 rounded-full bg-gray-500 shadow-inner" />
                    ))}
                  </div>
                  {/* Handle */}
                  <div className="absolute top-1/2 right-4 -translate-y-1/2 w-3 h-20 bg-gray-500 rounded-full shadow-lg" />
                  {/* Horizontal beams */}
                  <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-gray-500/40" />
                  <div className="absolute top-2/3 left-0 right-0 h-0.5 bg-gray-500/40" />
                  {/* Text */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <p className="text-4xl sm:text-6xl font-black text-gray-500/30 tracking-tighter select-none">
                      LLEDO
                    </p>
                  </div>
                </div>
                {/* Right door */}
                <div className="flex-1 bg-gradient-to-l from-gray-700 to-gray-600 border-l-2 border-gray-500 relative overflow-hidden">
                  {/* Rivets */}
                  <div className="absolute top-4 right-4 grid grid-cols-2 gap-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-2.5 h-2.5 rounded-full bg-gray-500 shadow-inner" />
                    ))}
                  </div>
                  {/* Handle */}
                  <div className="absolute top-1/2 left-4 -translate-y-1/2 w-3 h-20 bg-gray-500 rounded-full shadow-lg" />
                  {/* Horizontal beams */}
                  <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-gray-500/40" />
                  <div className="absolute top-2/3 left-0 right-0 h-0.5 bg-gray-500/40" />
                  {/* Text */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <p className="text-4xl sm:text-6xl font-black text-gray-500/30 tracking-tighter select-none">
                      GSE
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning stripes at bottom */}
              <div className="h-10 bg-[repeating-linear-gradient(45deg,#f59e0b_0,#f59e0b_15px,#111827_15px,#111827_30px)] opacity-50" />

              {/* Ground */}
              <div className="h-4 bg-gradient-to-t from-gray-800 to-gray-900" />

              {/* Padlock in the center */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                animate={{ rotate: [-3, 3, -3] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="bg-amber-500 rounded-lg p-3 shadow-lg shadow-amber-500/30">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-amber-900" fill="currentColor">
                    <path d="M12 2C9.24 2 7 4.24 7 7V10H6C4.9 10 4 10.9 4 12V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V12C20 10.9 19.1 10 18 10H17V7C17 4.24 14.76 2 12 2ZM12 4C13.66 4 15 5.34 15 7V10H9V7C9 5.34 10.34 4 12 4ZM12 14C13.1 14 14 14.9 14 16C14 17.1 13.1 18 12 18C10.9 18 10 17.1 10 16C10 14.9 10.9 14 12 14Z"/>
                  </svg>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center max-w-xl"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Wrench className="h-8 w-8 text-amber-400" />
              </motion.div>
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <HardHat className="h-8 w-8 text-amber-400" />
              </motion.div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter mb-4">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                AEROTOOLS
              </span>
            </h1>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-6">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                En cours de développement
              </span>
            </div>

            <p className="text-gray-400 text-lg mb-4 leading-relaxed">
              Notre catalogue d'outillage aéronautique certifié est en préparation.
            </p>
            <p className="text-gray-500 text-sm mb-10">
              Barres de remorquage, rollers hydrauliques et équipements GSE pour hélicoptères civils et militaires — bientôt disponible !
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold uppercase tracking-wider text-sm hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/20"
              >
                Nous contacter
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-4 border border-gray-700 text-gray-300 rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-gray-800/50 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour à l'accueil
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Ambient glow effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px]" />
        </div>
      </div>
    </>
  )
}
