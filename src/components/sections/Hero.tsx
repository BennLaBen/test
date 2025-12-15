'use client'

import Image from 'next/image'
import { motion, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Shield, Award, Sparkles, Factory, Settings, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useEffect, useRef } from 'react'

export function Hero() {
  const { t } = useTranslation('common')
  const containerRef = useRef<HTMLElement>(null)
  
  // Scroll-driven animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  
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
  
  // Sociétés avec leurs vraies URLs
  const companies = [
    { id: 'mpeb', name: 'MPEB', desc: 'Usinage de précision', detail: '100 000h/an', color: 'from-blue-600 to-blue-800', icon: '⚙️' },
    { id: 'egi', name: 'EGI', desc: "Bureau d'études", detail: 'Ingénierie intégrée', color: 'from-purple-600 to-purple-800', icon: '💡' },
    { id: 'frem', name: 'FREM', desc: 'Maintenance', detail: 'Support OPEX', color: 'from-orange-600 to-orange-800', icon: '🔧' },
    { id: 'mgp', name: 'MGP', desc: 'Tôlerie chaudronnerie', detail: '2 000m² atelier', color: 'from-gray-600 to-gray-800', icon: '🏭' },
  ]

  return (
    <section ref={containerRef} id="hero" className="hero-section relative min-h-screen overflow-hidden">
      {/* Image de fond réelle */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-accueil.png"
          alt="Atelier industriel LLEDO Industries - Usinage de précision"
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />
        {/* Overlay pour lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/85 via-gray-900/60 to-blue-900/50" />
      </div>
      
      {/* Scan lines futuristes */}
      <div className="absolute inset-0 opacity-5 pointer-events-none z-10">
        <div className="h-full w-full" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, transparent 1px, transparent 2px, rgba(255,255,255,0.05) 3px)',
          backgroundSize: '100% 4px'
        }} />
      </div>

      <motion.div 
        className="container relative mx-auto px-4 py-12 sm:px-6 lg:px-8 z-10"
        style={{ y, opacity }}
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Content - Style IRON MAN */}
          <div className="flex flex-col justify-center text-white relative z-10">
            {/* Arc Reactor Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="mb-8 relative inline-block"
            >
              <motion.div
                className="relative inline-flex items-center gap-3 px-6 py-3 bg-blue-500/20 backdrop-blur-xl border-2 border-blue-400/50 rounded-full"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(59, 130, 246, 0.5)',
                    '0 0 40px rgba(59, 130, 246, 0.8)',
                    '0 0 20px rgba(59, 130, 246, 0.5)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ willChange: 'box-shadow' }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="h-5 w-5 text-blue-300" />
                </motion.div>
                <span className="font-bold text-white text-sm tracking-wider uppercase">
                  {t('hero.chip')}
                </span>
              </motion.div>
            </motion.div>

            {/* Titre OPTIMISÉ */}
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl mb-6"
              style={{
                textShadow: '0 0 30px rgba(59, 130, 246, 0.5)',
                lineHeight: '1.3'
              }}
            >
              <motion.span
                className="block uppercase text-white"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(255, 255, 255, 0.5)',
                    '0 0 40px rgba(255, 255, 255, 0.8)',
                    '0 0 20px rgba(255, 255, 255, 0.5)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ lineHeight: '1.3' }}
              >
                {t('hero.headline')}
              </motion.span>
              <motion.span
                className="block text-white mt-3"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(59, 130, 246, 0.8)',
                    '0 0 30px rgba(59, 130, 246, 1)',
                    '0 0 20px rgba(59, 130, 246, 0.8)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ 
                  lineHeight: '1.3'
                }}
              >
                {t('hero.headlineAccent')}
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-gray-300 leading-relaxed max-w-2xl mb-8"
            >
              {t('hero.subheadline')}
            </motion.p>

            {/* Stats rapides - Style HUD */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid gap-3 sm:grid-cols-2 mb-8"
            >
              <motion.div 
                className="relative bg-white/5 backdrop-blur-sm border border-blue-400/30 rounded-lg px-4 py-3 overflow-hidden group"
                whileHover={{ scale: 1.02, borderColor: 'rgba(59, 130, 246, 0.8)' }}
                transition={{ duration: 0.2 }}
                style={{ willChange: 'transform' }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/15 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  style={{ willChange: 'transform' }}
                />
                <div className="flex items-center gap-2 relative z-10">
                  <Shield className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span className="text-xs font-bold text-white">
                    {t('hero.badges.compliance')}
                  </span>
                </div>
              </motion.div>
              
              <motion.div 
                className="relative bg-white/5 backdrop-blur-sm border border-cyan-400/30 rounded-lg px-4 py-3 overflow-hidden group"
                whileHover={{ scale: 1.02, borderColor: 'rgba(34, 211, 238, 0.8)' }}
                transition={{ duration: 0.2 }}
                style={{ willChange: 'transform' }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 0.5 }}
                  style={{ willChange: 'transform' }}
                />
                <div className="flex items-center gap-2 relative z-10">
                  <Sparkles className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                  <span className="text-xs font-bold text-white">
                    {t('hero.badges.experience')}
                  </span>
                </div>
              </motion.div>

              <motion.div 
                className="relative bg-white/5 backdrop-blur-sm border border-green-400/30 rounded-lg px-4 py-3 overflow-hidden group"
                whileHover={{ scale: 1.02, borderColor: 'rgba(34, 197, 94, 0.8)' }}
                transition={{ duration: 0.2 }}
                style={{ willChange: 'transform' }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/15 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
                  style={{ willChange: 'transform' }}
                />
                <div className="flex items-center gap-2 relative z-10">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-xs font-bold text-white">
                    {t('hero.badges.cmu')}
                  </span>
                </div>
              </motion.div>

              <motion.div 
                className="relative bg-white/5 backdrop-blur-sm border border-amber-400/30 rounded-lg px-4 py-3 overflow-hidden group"
                whileHover={{ scale: 1.02, borderColor: 'rgba(251, 191, 36, 0.8)' }}
                transition={{ duration: 0.2 }}
                style={{ willChange: 'transform' }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/15 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1.5 }}
                  style={{ willChange: 'transform' }}
                />
                <div className="flex items-center gap-2 relative z-10">
                  <Award className="h-5 w-5 text-amber-400 flex-shrink-0" />
                  <span className="text-xs font-bold text-white">
                    {t('hero.badges.certs')}
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* CTA Buttons - Style Tony Stark */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col gap-5 sm:flex-row"
            >
              <Link href="/contact">
                <motion.div
                  className="relative inline-flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 rounded-xl font-bold text-lg text-white overflow-hidden group cursor-pointer"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)',
                    willChange: 'transform'
                  }}
                >
                  {/* Animated shine */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    animate={{ x: ['-200%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    style={{ willChange: 'transform' }}
                  />
                  <span className="relative z-10">{t('hero.ctaPrimary')}</span>
                  <ArrowRight className="h-5 w-5 relative z-10" />
                </motion.div>
              </Link>

              <Link href="/nos-expertises">
                <motion.div
                  className="relative inline-flex items-center gap-3 px-8 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-xl font-bold text-lg text-white overflow-hidden cursor-pointer"
                  whileHover={{ scale: 1.05, y: -3, borderColor: 'rgba(255,255,255,0.6)' }}
                  whileTap={{ scale: 0.98 }}
                  style={{ willChange: 'transform' }}
                >
                  <span className="relative z-10">{t('hero.ctaSecondary')}</span>
                </motion.div>
              </Link>
            </motion.div>
          </div>

          {/* Visual - Nos Entités CLIQUABLES Style JARVIS */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative"
            >
              {/* Titre attractif avec effet */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-center mb-6"
              >
                <motion.div
                  className="inline-flex items-center gap-3 px-6 py-3 bg-blue-500/20 backdrop-blur-xl border-2 border-blue-400/50 rounded-full mb-6"
                  style={{
                    boxShadow: '0 0 30px rgba(59, 130, 246, 0.6)'
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="h-5 w-5 text-blue-300" />
                  </motion.div>
                  <span className="font-black text-white text-sm uppercase tracking-widest">
                    Découvrir nos entités
                  </span>
                </motion.div>
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                {companies.map((company, index) => (
                  <Link key={company.id} href={`/societes/${company.id}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                      whileHover={{ 
                        scale: 1.08, 
                        y: -12,
                        rotate: [0, -2, 2, 0]
                      }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative group cursor-pointer rounded-xl bg-gradient-to-br ${company.color} p-5 overflow-hidden border-2 border-transparent hover:border-white/30 transition-all duration-300`}
                      style={{
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
                        willChange: 'transform'
                      }}
                    >
                      {/* Scan line horizontal - Plus visible au hover */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100"
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity, 
                          ease: "linear"
                        }}
                        style={{ willChange: 'transform' }}
                      />
                      
                      {/* Glow effect intense au hover */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />

                      {/* Corners HUD - Animés au hover */}
                      <motion.div 
                        className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-white/60"
                        whileHover={{ scale: 1.2, opacity: 1 }}
                        style={{ opacity: 0.6 }}
                      />
                      <motion.div 
                        className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-white/60"
                        whileHover={{ scale: 1.2, opacity: 1 }}
                        style={{ opacity: 0.6 }}
                      />
                      <motion.div 
                        className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-white/60"
                        whileHover={{ scale: 1.2, opacity: 1 }}
                        style={{ opacity: 0.6 }}
                      />
                      <motion.div 
                        className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-white/60"
                        whileHover={{ scale: 1.2, opacity: 1 }}
                        style={{ opacity: 0.6 }}
                      />

                      {/* Icon Badge - Animé au hover */}
                      <motion.div 
                        className="mb-3 text-3xl"
                        whileHover={{ 
                          scale: 1.2,
                          rotate: [0, -10, 10, 0]
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        {company.icon}
                      </motion.div>

                      {/* Content */}
                      <div className="relative z-10">
                        <h4 className="mb-1.5 text-xl font-black text-white uppercase tracking-wide">
                          {company.name}
                        </h4>
                        <p className="text-sm text-white/95 font-semibold mb-1">
                          {company.desc}
                        </p>
                        <p className="text-xs text-white/70">
                          {company.detail}
                        </p>

                        {/* Arrow on hover - Ultra visible */}
                        <motion.div
                          className="mt-4 flex items-center gap-2 text-white font-black px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                          style={{
                            boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
                          }}
                        >
                          <span className="text-sm uppercase tracking-wider">Découvrir</span>
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <ArrowRight className="h-5 w-5" />
                          </motion.div>
                        </motion.div>
                      </div>

                      {/* Pulse effect puissant au hover */}
                      <motion.div
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100"
                        animate={{
                          boxShadow: [
                            '0 0 0 0 rgba(255, 255, 255, 0)',
                            '0 0 0 8px rgba(255, 255, 255, 0.2)',
                            '0 0 0 16px rgba(255, 255, 255, 0)'
                          ]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator Futuriste */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 text-center"
      >
        <motion.div className="flex flex-col items-center gap-2">
          <span className="text-xs font-bold text-white/60 uppercase tracking-widest">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-12 w-7 rounded-full border-2 border-white/40 bg-white/5 backdrop-blur-sm relative"
          >
            <motion.div
              animate={{ y: [2, 16, 2], opacity: [1, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-2 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-white"
              style={{
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
              }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
