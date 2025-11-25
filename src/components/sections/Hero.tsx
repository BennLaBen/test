'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Shield, Award, Sparkles, Factory, Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { IndustrialBackground } from '@/components/IndustrialBackground'
import { useEffect } from 'react'

export function Hero() {
  const { t } = useTranslation('common')
  
  // Parallax mouse effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      mouseX.set((clientX / innerWidth - 0.5) * 20)
      mouseY.set((clientY / innerHeight - 0.5) * 20)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <section id="hero" className="hero-section relative">
      {/* Industrial Background */}
      <IndustrialBackground variant="precision" showGears showGrid intensity="medium" />
      
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 scale-[1.015] bg-[url('/images/hero-industrial.jpg')] bg-cover bg-center opacity-50 blur-md" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/45 to-white/25 dark:from-gray-950/70 dark:via-gray-950/52 dark:to-gray-950/38" />
      </div>

      <div className="container relative mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="chip mb-6 inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                {t('hero.chip')}
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-muted-strong sm:text-5xl lg:text-6xl break-words leading-tight pb-2">
                <span className="uppercase">{t('hero.headline')}</span>{' '}
                <span className="text-gradient">{t('hero.headlineAccent')}</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-muted">
                {t('hero.subheadline')}
              </p>
            </motion.div>

            {/* Key Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-10 grid gap-3 sm:grid-cols-2"
            >
              <motion.div 
                className="glass-card group flex items-center gap-3 rounded-xl px-4 py-3 shadow-sm tech-border relative overflow-hidden"
                whileHover={{ scale: 1.05, x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 -translate-x-full"
                  animate={{ translateX: ['100%', '-100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.2), transparent)' }}
                />
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                >
                  <Shield className="h-5 w-5 flex-shrink-0 text-primary-500 relative z-10" />
                </motion.div>
                <span className="text-sm font-semibold text-muted-strong group-hover:text-primary-600 transition-colors relative z-10">
                  {t('hero.badges.compliance')}
                </span>
              </motion.div>
              
              <motion.div 
                className="glass-card group flex items-center gap-3 rounded-xl px-4 py-3 shadow-sm tech-border relative overflow-hidden"
                whileHover={{ scale: 1.05, x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 -translate-x-full"
                  animate={{ translateX: ['100%', '-100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.2), transparent)' }}
                />
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                  animate={{ rotate: [0, 10, -10, 0] }}
                  style={{ transition: 'all 4s ease-in-out', repeat: Infinity }}
                >
                  <Sparkles className="h-5 w-5 flex-shrink-0 text-blue-500 relative z-10" />
                </motion.div>
                <span className="text-sm font-semibold text-muted-strong group-hover:text-primary-600 transition-colors relative z-10">
                  {t('hero.badges.experience')}
                </span>
              </motion.div>

              <motion.div 
                className="glass-card group flex items-center gap-3 rounded-xl px-4 py-3 shadow-sm tech-border relative overflow-hidden"
                whileHover={{ scale: 1.05, x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="absolute inset-0 -translate-x-full"
                  animate={{ translateX: ['100%', '-100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.2), transparent)' }}
                />
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  style={{ transition: 'all 2s ease-in-out', repeat: Infinity }}
                >
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500 relative z-10" />
                </motion.div>
                <span className="text-sm font-semibold text-muted-strong group-hover:text-primary-600 transition-colors relative z-10">
                  {t('hero.badges.cmu')}
                </span>
              </motion.div>

              <motion.div 
                className="glass-card group flex items-center gap-3 rounded-xl px-4 py-3 shadow-sm tech-border relative overflow-hidden"
                whileHover={{ scale: 1.05, x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="absolute inset-0 -translate-x-full"
                  animate={{ translateX: ['100%', '-100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.2), transparent)' }}
                />
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    y: [0, -3, 0]
                  }}
                  style={{ transition: 'all 3s ease-in-out', repeat: Infinity }}
                >
                  <Award className="h-5 w-5 flex-shrink-0 text-amber-400 relative z-10" />
                </motion.div>
                <span className="text-sm font-semibold text-muted-strong group-hover:text-primary-600 transition-colors relative z-10">
                  {t('hero.badges.certs')}
                </span>
              </motion.div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 flex flex-col gap-4 sm:flex-row"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  href="/contact"
                  className="btn-primary group inline-flex items-center justify-center relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      background: [
                        'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
                        'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)'
                      ],
                      x: ['-200%', '200%']
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                  <span className="relative z-10">{t('hero.ctaPrimary')}</span>
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 relative z-10" />
                  </motion.div>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  href="/nos-expertises"
                  className="btn-secondary inline-flex items-center justify-center tech-border relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-primary-500/5"
                    whileHover={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10">{t('hero.ctaSecondary')}</span>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Visual - Entities Cards */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="hero-card p-6">
                <h3 className="mb-6 text-center text-lg font-bold text-muted-strong">
                  Nos Entités
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* MPEB */}
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="group cursor-pointer rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 p-5 shadow-lg transition-all hover:shadow-2xl"
                  >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                      <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <h4 className="mb-2 text-xl font-bold text-white">MPEB</h4>
                    <p className="text-sm text-white/90">Usinage de précision</p>
                    <p className="mt-2 text-xs text-white/70">100 000h/an</p>
                  </motion.div>

                  {/* EGI */}
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="group cursor-pointer rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 p-5 shadow-lg transition-all hover:shadow-2xl"
                  >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                      <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h4 className="mb-2 text-xl font-bold text-white">EGI</h4>
                    <p className="text-sm text-white/90">Bureau d'études</p>
                    <p className="mt-2 text-xs text-white/70">Ingénierie intégrée</p>
                  </motion.div>

                  {/* FREM */}
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="group cursor-pointer rounded-xl bg-gradient-to-br from-orange-600 to-orange-800 p-5 shadow-lg transition-all hover:shadow-2xl"
                  >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                      <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h4 className="mb-2 text-xl font-bold text-white">FREM</h4>
                    <p className="text-sm text-white/90">Maintenance</p>
                    <p className="mt-2 text-xs text-white/70">Support OPEX</p>
                  </motion.div>

                  {/* MGP */}
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="group cursor-pointer rounded-xl bg-gradient-to-br from-gray-600 to-gray-800 p-5 shadow-lg transition-all hover:shadow-2xl"
                  >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                      <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                      </svg>
                    </div>
                    <h4 className="mb-2 text-xl font-bold text-white">MGP</h4>
                    <p className="text-sm text-white/90">Tôlerie chaudronnerie</p>
                    <p className="mt-2 text-xs text-white/70">2 000m² atelier</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="h-8 w-5 rounded-full border-2 border-white/40"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mt-2 h-2 w-1 rounded-full bg-white/60"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
