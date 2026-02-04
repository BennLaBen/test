'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Bell, Wrench, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SEO } from '@/components/SEO'

// --- COMPOSANT HÉLICOPTÈRE ANIMÉ ---
const AnimatedHelicopter = ({ delay = 0, direction = 1, top = '20%', size = 'md' }: { delay?: number; direction?: number; top?: string; size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  }
  
  return (
    <motion.div
      className={`absolute ${sizes[size]}`}
      style={{ top }}
      initial={{ x: direction > 0 ? '-20%' : '120%', opacity: 0 }}
      animate={{ 
        x: direction > 0 ? '120vw' : '-20vw',
        opacity: [0, 1, 1, 1, 0],
      }}
      transition={{
        duration: 12,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <div className={`relative ${direction < 0 ? 'scale-x-[-1]' : ''}`}>
        <svg viewBox="0 0 100 60" fill="none" className="w-full h-full drop-shadow-[0_10px_30px_rgba(59,130,246,0.3)]">
          <motion.ellipse
            cx="50"
            cy="8"
            rx="45"
            ry="3"
            fill="url(#rotorGradient)"
            animate={{ scaleX: [1, 0.3, 1] }}
            transition={{ duration: 0.1, repeat: Infinity }}
          />
          <rect x="48" y="8" width="4" height="10" fill="#64748b" />
          <ellipse cx="35" cy="30" rx="20" ry="15" fill="url(#bodyGradient)" />
          <ellipse cx="30" cy="28" rx="12" ry="8" fill="#0ea5e9" opacity="0.6" />
          <path d="M50 25 L85 28 L85 32 L50 35 Z" fill="url(#tailGradient)" />
          <motion.ellipse
            cx="88"
            cy="30"
            rx="2"
            ry="8"
            fill="#94a3b8"
            animate={{ scaleY: [1, 0.3, 1] }}
            transition={{ duration: 0.08, repeat: Infinity }}
          />
          <rect x="20" y="45" width="30" height="3" rx="1.5" fill="#475569" />
          <rect x="18" y="42" width="3" height="6" fill="#475569" />
          <rect x="48" y="42" width="3" height="6" fill="#475569" />
          <defs>
            <linearGradient id="rotorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#cbd5e1" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
            <linearGradient id="tailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
        <motion.div
          className="absolute top-1/2 left-1/4 w-2 h-2 bg-red-500 rounded-full"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-1.5 h-1.5 bg-green-500 rounded-full"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
        />
      </div>
    </motion.div>
  )
}

export default function BoutiquePage() {
  const { t } = useTranslation('common')

  return (
    <>
      <SEO 
        title={t('aerotools.pageTitle')} 
        description={t('aerotools.pageDescription')} 
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white overflow-hidden relative">
        
        {/* Fond animé avec grille */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          
          {/* Nuages/brume animés */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-blue-900/20"
            animate={{ x: ['-50%', '50%'] }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          />
          
          {/* Étoiles/particules */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/50 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}

          {/* Cercles lumineux */}
          <motion.div
            className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          />
        </div>

        {/* Hélicoptères animés qui traversent l'écran */}
        <AnimatedHelicopter delay={0} direction={1} top="15%" size="lg" />
        <AnimatedHelicopter delay={4} direction={-1} top="35%" size="md" />
        <AnimatedHelicopter delay={8} direction={1} top="55%" size="sm" />
        <AnimatedHelicopter delay={6} direction={-1} top="75%" size="md" />

        {/* Contenu principal */}
        <div className="relative z-10 container mx-auto px-4 py-20 min-h-screen flex flex-col items-center justify-center">
          
          {/* Bouton retour */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-8 left-4 sm:left-8"
          >
            <Link
              href="/aerotools"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('aerotools.backToAerotools')}
            </Link>
          </motion.div>

          {/* Logo LLEDO Aerotools */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative mb-8"
          >
            {/* Cercle pulsant */}
            <motion.div
              className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0.2, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Icône principale - Hélicoptère stylisé */}
            <div className="relative w-40 h-40 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/40 border border-blue-400/30 overflow-hidden">
              {/* Effet scan */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-300/20 to-transparent"
                animate={{ y: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* SVG Hélicoptère stylisé */}
              <svg viewBox="0 0 100 80" fill="none" className="h-24 w-24 relative z-10">
                {/* Rotor principal animé */}
                <motion.ellipse
                  cx="50"
                  cy="15"
                  rx="40"
                  ry="3"
                  fill="white"
                  opacity="0.8"
                  animate={{ scaleX: [1, 0.3, 1] }}
                  transition={{ duration: 0.15, repeat: Infinity }}
                />
                
                {/* Mât du rotor */}
                <rect x="48" y="15" width="4" height="12" fill="white" opacity="0.9" />
                
                {/* Cabine */}
                <ellipse cx="40" cy="40" rx="22" ry="18" fill="white" opacity="0.95" />
                <ellipse cx="35" cy="38" rx="14" ry="10" fill="#60a5fa" opacity="0.7" />
                
                {/* Corps arrière */}
                <path d="M55 35 L85 38 L85 42 L55 45 Z" fill="white" opacity="0.9" />
                
                {/* Rotor arrière */}
                <motion.ellipse
                  cx="88"
                  cy="40"
                  rx="2"
                  ry="8"
                  fill="white"
                  opacity="0.8"
                  animate={{ scaleY: [1, 0.3, 1] }}
                  transition={{ duration: 0.1, repeat: Infinity }}
                />
                
                {/* Patins */}
                <rect x="22" y="58" width="36" height="3" rx="1.5" fill="white" opacity="0.85" />
                <rect x="20" y="55" width="3" height="6" fill="white" opacity="0.85" />
                <rect x="55" y="55" width="3" height="6" fill="white" opacity="0.85" />
              </svg>
              
              {/* Badge horloge */}
              <motion.div
                className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg border-2 border-amber-400/50"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Clock className="h-6 w-6 text-white" />
              </motion.div>
            </div>
          </motion.div>

          {/* Titre principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-4"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight mb-2">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                LLEDO
              </span>
            </h1>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                AEROTOOLS
              </span>
            </h2>
          </motion.div>

          {/* Sous-titre animé */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <motion.p
              className="text-2xl sm:text-3xl text-blue-300 font-light"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {t('aerotools.comingSoon')}
            </motion.p>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 text-center max-w-2xl mb-12 text-lg leading-relaxed"
          >
            {t('aerotools.comingSoonDescription')}
          </motion.p>

          {/* Barre de progression animée */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: '100%' }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="w-full max-w-md mb-8"
          >
            <div className="h-3 bg-gray-800/50 rounded-full overflow-hidden border border-blue-500/30">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 rounded-full"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{ width: '50%' }}
              />
            </div>
            <p className="text-center text-sm text-blue-400/70 mt-3 font-mono uppercase tracking-widest">
              {t('aerotools.inDevelopment')}
            </p>
          </motion.div>

          {/* Bouton notification */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl font-bold uppercase tracking-wider text-white shadow-2xl shadow-blue-500/40 overflow-hidden border border-blue-400/30"
          >
            {/* Effet shine */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-200%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
            
            <Bell className="h-6 w-6 relative z-10" />
            <span className="relative z-10 text-lg">{t('aerotools.notifyMe')}</span>
          </motion.button>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center max-w-4xl"
          >
            <div className="flex flex-col items-center p-6 bg-slate-800/30 rounded-2xl border border-blue-500/20 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                <Wrench className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-white font-bold mb-2">{t('aerotools.feature1Title')}</h3>
              <p className="text-sm text-gray-400">{t('aerotools.feature1Desc')}</p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-slate-800/30 rounded-2xl border border-blue-500/20 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className="text-white font-bold mb-2">{t('aerotools.feature2Title')}</h3>
              <p className="text-sm text-gray-400">{t('aerotools.feature2Desc')}</p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-slate-800/30 rounded-2xl border border-blue-500/20 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-white font-bold mb-2">{t('aerotools.feature3Title')}</h3>
              <p className="text-sm text-gray-400">{t('aerotools.feature3Desc')}</p>
            </div>
          </motion.div>

        </div>
      </div>
    </>
  )
}
