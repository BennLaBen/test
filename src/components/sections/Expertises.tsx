'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import Link from 'next/link'
import { IndustrialBackground } from '@/components/IndustrialBackground'
import { 
  Settings, 
  Lightbulb, 
  Wrench, 
  Factory,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Shield,
  Award,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Download,
  Lock,
  MonitorCheck,
  Ruler,
  FileText
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { AuthModal } from '@/components/auth/AuthModal'

const iconMap: Record<string, any> = {
  mpeb: Factory,
  egi: Lightbulb,
  frem: Wrench,
  mgp: Settings,
  aerotools: Settings
}

const colorMap: Record<string, string> = {
  mpeb: 'from-blue-600 to-blue-800',
  egi: 'from-purple-600 to-purple-800',
  frem: 'from-orange-600 to-orange-800',
  mgp: 'from-gray-600 to-gray-800',
  aerotools: 'from-red-600 to-accent-700'
}

const brochureIconMap = [Factory, MonitorCheck, Award, Ruler, Settings, Factory]

export function Expertises() {
  const { t } = useTranslation('expertises')
  const { t: tBrochure } = useTranslation('brochure')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAuthModal, setShowAuthModal] = useState(false)
  
  const { isAuthenticated, user } = useAuth()

  const expertises = t('list', { returnObjects: true }) as any[]
  const brochureItems = tBrochure('items', { returnObjects: true }) as any[]

  const currentExpertise = expertises[currentIndex]
  const Icon = iconMap[currentExpertise?.id]
  const colorClass = colorMap[currentExpertise?.id]

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % expertises.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + expertises.length) % expertises.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const handleDownload = (itemTitle: string) => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    
    alert(`✅ Téléchargement démarré !\n\n📄 ${itemTitle}\n👤 ${user?.firstName} ${user?.lastName}\n📧 ${user?.email}\n\nMerci de votre confiance !`)
  }

  const handleDownloadComplete = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    
    alert(`✅ Téléchargement de la plaquette complète démarré !\n\n👤 ${user?.firstName} ${user?.lastName}\n📧 ${user?.email}\n\nMerci de votre confiance !`)
  }

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      <IndustrialBackground variant="grid" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header - Style Holographique Tony Stark */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 relative"
        >
          {/* Cercle holographique simplifié */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none">
            <motion.div
              className="absolute inset-0 rounded-full border border-primary-500/20 opacity-30"
              animate={{
                rotate: [0, 360]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ willChange: 'transform' }}
            />
          </div>

          <motion.span 
            className="chip mb-6 tech-border relative inline-flex items-center gap-2 px-6 py-3 text-base"
            style={{
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
            }}
            whileHover={{ scale: 1.05, y: -2 }}
            animate={{
              boxShadow: [
                '0 0 20px rgba(59, 130, 246, 0.3)',
                '0 0 30px rgba(59, 130, 246, 0.5)',
                '0 0 20px rgba(59, 130, 246, 0.3)'
              ]
            }}
            transition={{
              boxShadow: { duration: 2, repeat: Infinity }
            }}
          >
            {/* Grille technique */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'radial-gradient(circle, rgba(59,130,246,0.5) 1px, transparent 1px)',
              backgroundSize: '8px 8px'
            }} />
            
            <Shield className="h-5 w-5 relative z-10" />
            <span className="relative z-10 font-bold">LLEDO Industries Group</span>
          </motion.span>

          <motion.h2 
            className="mb-8 text-4xl font-bold text-muted-strong lg:text-6xl relative z-10"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.span
              className="inline-block"
              animate={{
                textShadow: [
                  '0 0 30px rgba(59, 130, 246, 0.2)',
                  '0 0 50px rgba(59, 130, 246, 0.4)',
                  '0 0 30px rgba(59, 130, 246, 0.2)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {t('title')}
            </motion.span>
          </motion.h2>

          <motion.p 
            className="text-xl text-muted max-w-4xl mx-auto relative z-10 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {t('subtitle')}
          </motion.p>

          {/* Lignes holographiques décoratives */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 bottom-0 h-px w-64 bg-gradient-to-r from-transparent via-primary-500 to-transparent"
            animate={{
              scaleX: [0.5, 1, 0.5],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>

        {/* Indicators - Style Holographique avec noms des entreprises - NAVIGATION ENTREPRISES */}
        <div className="flex justify-center items-center gap-4 mb-12 flex-wrap">
          {expertises.map((expertise: any, index: number) => {
            const isActive = index === currentIndex
            return (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative group`}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Indicateur visuel */}
                <div className="flex items-center gap-2 px-5 py-3 rounded-full backdrop-blur-md bg-white/10 dark:bg-gray-900/50 border transition-all"
                     style={{
                       borderColor: isActive ? 'rgba(59, 130, 246, 0.5)' : 'rgba(156, 163, 175, 0.2)'
                     }}>
                  {/* Point indicateur */}
                  <motion.div
                    className={`rounded-full transition-all ${
                      isActive 
                        ? 'w-3 h-3 bg-primary-500' 
                        : 'w-2 h-2 bg-gray-400 dark:bg-gray-600'
                    }`}
                    animate={isActive ? {
                      boxShadow: [
                        '0 0 10px rgba(59, 130, 246, 0.6)',
                        '0 0 20px rgba(59, 130, 246, 1)',
                        '0 0 10px rgba(59, 130, 246, 0.6)'
                      ],
                      scale: [1, 1.2, 1]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  
                  {/* Nom de l'entreprise */}
                  <span className={`text-sm font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-primary-500'
                  }`}>
                    {expertise.name}
                  </span>
                </div>

                {/* Ligne de connexion active */}
                {isActive && (
                  <motion.div
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-transparent via-primary-500 to-transparent"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.5 }}
                  />
                )}

                {/* Glow effect on hover */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary-500/20 opacity-0 group-hover:opacity-100 blur-xl -z-10"
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            )
          })}
        </div>

        {/* Carrousel des entreprises - Style Tony Stark */}
        <div className="relative max-w-7xl mx-auto perspective-2000">
          {/* Particules ultra-optimisées */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary-500 rounded-full opacity-40"
                style={{
                  left: `${(i * 25) % 100}%`,
                  top: `${(i * 30) % 100}%`,
                  willChange: 'transform',
                }}
                animate={{
                  y: [0, -30, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  delay: i * 1.25,
                  ease: "linear"
                }}
              />
            ))}
          </div>

          {/* Ligne holographique du haut */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent"
            animate={{
              scaleX: [0.8, 1, 0.8],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ 
                opacity: 0, 
                x: 80,
                scale: 0.9
              }}
              animate={{ 
                opacity: 1, 
                x: 0,
                scale: 1
              }}
              exit={{ 
                opacity: 0, 
                x: -80,
                scale: 0.9
              }}
              transition={{ 
                duration: 0.5, 
                ease: [0.43, 0.13, 0.23, 0.96]
              }}
              className="grid gap-12 lg:grid-cols-2 lg:gap-16"
            >
              {/* Visual Side - Carte colorée CLIQUABLE avec effets 3D */}
              <Link href={`/societes/${currentExpertise.id}`}>
                <motion.div 
                  whileHover={{ 
                    scale: 1.03, 
                    y: -8
                  }}
                  transition={{ 
                    duration: 0.2
                  }}
                  style={{ willChange: 'transform' }}
                >
                  <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colorClass} p-12 shadow-2xl hover:shadow-3xl transition-all duration-300 group cursor-pointer`}>
                  {/* Holographic scan effect - Style Jarvis */}
                  <motion.div
                    className="absolute inset-0 -translate-x-full"
                    animate={{
                      translateX: ['100%', '-100%']
                    }}
                    transition={{
                      duration: 2.5,
                      delay: 1,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "easeInOut"
                    }}
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), rgba(59,130,246,0.3), transparent)',
                      pointerEvents: 'none',
                      boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
                    }}
                  />

                  {/* Grille holographique */}
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `
                      linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                    pointerEvents: 'none'
                  }} />
                  
                  {/* Arc Reactor Style Border Glow */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    animate={{
                      boxShadow: [
                        '0 0 20px 2px rgba(59, 130, 246, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)',
                        '0 0 40px 4px rgba(59, 130, 246, 0.6), inset 0 0 30px rgba(255, 255, 255, 0.2)',
                        '0 0 20px 2px rgba(59, 130, 246, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />

                  {/* Coins HUD statiques */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white/70" />
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/70" />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white/70" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white/70" />
                  
                  <div className="relative z-10 text-center text-white">
                    {/* Holographic Floating Icon - Arc Reactor Style */}
                    <div className="relative mb-6 inline-flex">
                      {/* Rings autour de l'icône */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-white/30"
                        animate={{
                          scale: [1, 1.4, 1],
                          opacity: [0.6, 0, 0.6],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeOut"
                        }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-white/30"
                        animate={{
                          scale: [1, 1.4, 1],
                          opacity: [0.6, 0, 0.6],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: 0.5,
                          ease: "easeOut"
                        }}
                      />

                      <motion.div 
                        className="relative h-24 w-24 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
                        style={{
                          boxShadow: '0 0 30px rgba(255, 255, 255, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.2)'
                        }}
                        animate={{ 
                          y: [0, -15, 0],
                          rotate: [0, 5, -5, 0],
                          boxShadow: [
                            '0 0 30px rgba(255, 255, 255, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.2)',
                            '0 0 50px rgba(59, 130, 246, 0.6), inset 0 0 30px rgba(255, 255, 255, 0.4)',
                            '0 0 30px rgba(255, 255, 255, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.2)'
                          ]
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        whileHover={{ 
                          rotate: [0, 360],
                          scale: 1.2,
                          transition: { duration: 0.6 }
                        }}
                      >
                        {/* Grille interne */}
                        <div className="absolute inset-0 rounded-full opacity-20" style={{
                          backgroundImage: `
                            radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)
                          `,
                          backgroundSize: '8px 8px'
                        }} />
                        <Icon className="h-12 w-12 relative z-10 drop-shadow-lg" />
                      </motion.div>
                    </div>
                    
                    <motion.h3 
                      className="mb-2 text-3xl font-bold"
                      whileHover={{ scale: 1.05 }}
                    >
                      {currentExpertise.name}
                    </motion.h3>
                    <p className="text-lg opacity-90 mb-8">{currentExpertise.tagline}</p>

                    {/* Capabilities */}
                    <div className="grid grid-cols-1 gap-4">
                      {[
                        { label: 'Capacité / Capacity', value: currentExpertise.capabilities.capacity },
                        { label: 'Précision / Precision', value: currentExpertise.capabilities.precision },
                        { label: 'Équipements / Equipment', value: currentExpertise.capabilities.machines }
                      ].map((cap, capIdx) => (
                        <motion.div 
                          key={capIdx}
                          className="rounded-lg bg-white/10 p-4 backdrop-blur-sm text-left relative overflow-hidden group/cap"
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: capIdx * 0.1 }}
                          whileHover={{ scale: 1.03, x: 5 }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-white/5 opacity-0 group-hover/cap:opacity-100"
                            transition={{ duration: 0.3 }}
                          />
                          <div className="text-sm opacity-80 mb-1 relative z-10">{cap.label}</div>
                          <div className="text-lg font-bold relative z-10">{cap.value}</div>
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Sparkle effect */}
                    <motion.div
                      className="absolute top-4 right-4"
                      animate={{ 
                        scale: [0, 1, 0],
                        rotate: [0, 180, 360]
                      }}
                      transition={{ 
                        duration: 2,
                        delay: 1,
                        repeat: Infinity,
                        repeatDelay: 5,
                        ease: "easeOut"
                      }}
                    >
                      <Sparkles className="h-6 w-6 text-white" />
                    </motion.div>
                    </div>

                    {/* Badge "Cliquer pour découvrir" avec pulse */}
                    <motion.div
                      className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/90 text-primary-600 text-xs font-bold backdrop-blur-sm"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ 
                        opacity: [0.8, 1, 0.8],
                        y: [0, -3, 0],
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity
                      }}
                    >
                      Cliquez pour découvrir
                    </motion.div>
                  </div>
                </motion.div>
              </Link>

              {/* Content Side */}
              <motion.div 
                className="flex flex-col justify-center"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.h3 
                  className="text-2xl font-bold text-muted-strong mb-4"
                  whileHover={{ x: 5 }}
                >
                  {currentExpertise.name} - {currentExpertise.tagline}
                </motion.h3>
                <p className="text-muted mb-6 text-lg leading-relaxed">
                  {currentExpertise.description}
                </p>

                {/* Expertise List */}
                <div className="mb-6 space-y-3">
                  {currentExpertise.expertise.map((item: string, idx: number) => (
                    <motion.div 
                      key={idx} 
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.08 }}
                      whileHover={{ x: 5, scale: 1.02 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.3, rotate: 360 }}
                        transition={{ duration: 0.4 }}
                      >
                        <CheckCircle className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-primary-600" />
                      </motion.div>
                      <span className="text-muted">{item}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Certifications */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {currentExpertise.certifications.map((cert: string, idx: number) => (
                    <motion.span 
                      key={idx} 
                      className="chip chip--sm"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      whileHover={{ scale: 1.1, y: -2 }}
                    >
                      <Award className="mr-1 h-3 w-3" />
                      {cert}
                    </motion.span>
                  ))}
                </div>

                {/* CTA ULTRA VISIBLE - Style Arc Reactor */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -5
                  }}
                >
                  <Link
                    href={`/societes/${currentExpertise.id}`}
                    className="relative inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 text-white font-bold text-lg shadow-2xl overflow-hidden group"
                  >
                    {/* Fond animé holographique */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{
                        x: ['-200%', '200%']
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />

                    {/* Grille technique */}
                    <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)
                      `,
                      backgroundSize: '10px 10px'
                    }} />

                    {/* Bordures lumineuses */}
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      animate={{
                        boxShadow: [
                          '0 0 20px rgba(59, 130, 246, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.1)',
                          '0 0 40px rgba(59, 130, 246, 0.8), inset 0 0 30px rgba(255, 255, 255, 0.2)',
                          '0 0 20px rgba(59, 130, 246, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.1)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />

                    <span className="relative z-10 flex items-center gap-3">
                      <motion.span
                        animate={{
                          textShadow: [
                            '0 0 10px rgba(255,255,255,0.5)',
                            '0 0 20px rgba(255,255,255,0.8)',
                            '0 0 10px rgba(255,255,255,0.5)'
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Découvrir {currentExpertise.name}
                      </motion.span>
                      <motion.div
                        animate={{
                          x: [0, 5, 0]
                        }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <ArrowRight className="h-6 w-6" />
                      </motion.div>
                    </span>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons - Style Holographique Futuriste */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-4 lg:-mx-16 z-20">
            <motion.button
              onClick={prevSlide}
              className="pointer-events-auto relative p-4 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-2xl overflow-hidden group"
              whileHover={{ 
                scale: 1.2, 
                x: -8,
                rotate: -10
              }}
              whileTap={{ scale: 0.85 }}
              style={{
                boxShadow: '0 0 25px rgba(59, 130, 246, 0.5)',
                willChange: 'transform'
              }}
            >
              {/* Effet de scan */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ['-100%', '200%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Grille technique */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
                backgroundSize: '8px 8px'
              }} />

              <ChevronLeft className="h-7 w-7 relative z-10 drop-shadow-lg" />
              
              {/* Bordure animée */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-white/40"
                animate={{
                  scale: [1, 1.3],
                  opacity: [0.6, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity
                }}
              />
            </motion.button>

            <motion.button
              onClick={nextSlide}
              className="pointer-events-auto relative p-4 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-2xl overflow-hidden group"
              whileHover={{ 
                scale: 1.2, 
                x: 8,
                rotate: 10
              }}
              whileTap={{ scale: 0.85 }}
              style={{
                boxShadow: '0 0 25px rgba(59, 130, 246, 0.5)',
                willChange: 'transform'
              }}
            >
              {/* Effet de scan */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ['-100%', '200%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.5
                }}
              />
              
              {/* Grille technique */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
                backgroundSize: '8px 8px'
              }} />

              <ChevronRight className="h-7 w-7 relative z-10 drop-shadow-lg" />
              
              {/* Bordure animée */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-white/40"
                animate={{
                  scale: [1, 1.3],
                  opacity: [0.6, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 0.5
                }}
              />
            </motion.button>
          </div>
        </div>

        {/* Bottom CTA - STYLE TONY STARK ARC REACTOR */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-32 text-center"
        >
          <div className="glass-card glass-card--muted p-16 tech-border relative overflow-hidden group"
               style={{ 
                 boxShadow: '0 30px 60px rgba(59, 130, 246, 0.2)'
               }}>
            
            {/* Cercles holographiques Arc Reactor Style */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none">
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary-500/30 opacity-50"
                animate={{
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ willChange: 'transform' }}
              />
            </div>

            {/* Coins HUD statiques */}
            <div className="absolute top-6 left-6 w-16 h-16 border-t-4 border-l-4 border-primary-500/70" />
            <div className="absolute top-6 right-6 w-16 h-16 border-t-4 border-r-4 border-primary-500/70" />
            <div className="absolute bottom-6 left-6 w-16 h-16 border-b-4 border-l-4 border-primary-500/70" />
            <div className="absolute bottom-6 right-6 w-16 h-16 border-b-4 border-r-4 border-primary-500/70" />
            
            {/* Scan holographique simplifié */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-500/15 to-transparent"
              animate={{
                x: ['-100%', '200%']
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "linear"
              }}
              style={{ willChange: 'transform' }}
            />

            {/* Grille technique 3D */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.5) 2px, transparent 2px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.5) 2px, transparent 2px)
              `,
              backgroundSize: '30px 30px'
            }} />
            
            <motion.h3 
              className="text-4xl lg:text-5xl font-bold text-muted-strong mb-6 relative z-10"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <motion.span
                animate={{
                  textShadow: [
                    '0 0 20px rgba(59, 130, 246, 0.3)',
                    '0 0 40px rgba(59, 130, 246, 0.5)',
                    '0 0 20px rgba(59, 130, 246, 0.3)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {t('cta.title')}
              </motion.span>
            </motion.h3>
            
            <motion.p 
              className="text-muted mb-12 max-w-3xl mx-auto relative z-10 text-lg"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              {t('cta.subtitle')}
            </motion.p>
            
            <motion.div
              className="relative z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            >
              <Link href="/contact">
                <motion.button
                  className="relative inline-flex items-center gap-4 px-12 py-6 rounded-2xl bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 text-white text-xl font-bold shadow-2xl overflow-hidden group"
                  whileHover={{ 
                    scale: 1.1,
                    y: -8,
                    boxShadow: '0 25px 50px rgba(59, 130, 246, 0.5)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    boxShadow: [
                      '0 15px 40px rgba(59, 130, 246, 0.3)',
                      '0 20px 60px rgba(59, 130, 246, 0.5)',
                      '0 15px 40px rgba(59, 130, 246, 0.3)'
                    ]
                  }}
                  transition={{ 
                    boxShadow: { duration: 2, repeat: Infinity }
                  }}
                >
                  {/* Scan simplifié */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{
                      x: ['-200%', '200%']
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{ willChange: 'transform' }}
                  />

                  {/* Grille holographique */}
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `
                      linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)
                    `,
                    backgroundSize: '15px 15px'
                  }} />

                  {/* Multiples anneaux pulsants */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-white/50"
                    animate={{
                      scale: [1, 1.15],
                      opacity: [0.7, 0]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-white/50"
                    animate={{
                      scale: [1, 1.15],
                      opacity: [0.7, 0]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: 0.3
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-white/50"
                    animate={{
                      scale: [1, 1.15],
                      opacity: [0.7, 0]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: 0.6
                    }}
                  />

                  <span className="relative z-10 flex items-center gap-4">
                    <motion.span
                      animate={{
                        textShadow: [
                          '0 0 20px rgba(255,255,255,0.6)',
                          '0 0 30px rgba(255,255,255,1)',
                          '0 0 20px rgba(255,255,255,0.6)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {t('cta.button')}
                    </motion.span>
                    <motion.div
                      animate={{
                        x: [0, 8, 0]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="h-7 w-7" />
                    </motion.div>
                  </span>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Moyens et outils industriels - Style Holographique */}
        <div className="mt-20 relative perspective-2000">
          {/* Particules ultra-optimisées */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary-500 rounded-full opacity-50"
                style={{
                  left: `${(i * 25) % 100}%`,
                  top: `${(i * 30) % 100}%`,
                  willChange: 'transform',
                }}
                animate={{
                  y: [0, -30, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  delay: i * 1.25,
                  ease: "linear"
                }}
              />
            ))}
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 relative"
          >
            <span className="chip mb-4 inline-flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documentation technique
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-muted-strong sm:text-4xl mb-4">
              Moyens et outils industriels
            </h2>
            <p className="text-lg text-muted max-w-3xl mx-auto">
              Accédez à toute notre documentation technique : parc machines, certifications, moyens de contrôle et capacités.
            </p>
          </motion.div>

          {/* Grid des cartes - 3D Style Tony Stark */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
            {brochureItems.map((item: any, index: number) => {
              const ItemIcon = brochureIconMap[index]
              return (
                <motion.div
                  key={index}
                  initial={{ 
                    opacity: 0, 
                    y: 30,
                    scale: 0.95
                  }}
                  animate={isInView ? { 
                    opacity: 1, 
                    y: 0,
                    scale: 1
                  } : { 
                    opacity: 0, 
                    y: 30,
                    scale: 0.95
                  }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.08
                  }}
                  whileHover={{
                    scale: 1.03,
                    y: -6
                  }}
                  className="glass-card group p-6 hover:shadow-2xl transition-all relative overflow-hidden"
                  style={{ willChange: 'transform' }}
                >
                  {/* Scan simplifié */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-500/10 to-transparent"
                    animate={{
                      x: ['-100%', '100%']
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      delay: index * 1,
                      ease: "linear"
                    }}
                    style={{ willChange: 'transform' }}
                  />

                  {/* Grille technique */}
                  <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: `
                      linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '12px 12px'
                  }} />

                  {/* Coins HUD statiques */}
                  <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-primary-500/60" />
                  <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-primary-500/60" />
                  <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-primary-500/60" />
                  <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-primary-500/60" />

                  {/* Bordure glow */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    animate={{
                      boxShadow: [
                        '0 0 10px rgba(59, 130, 246, 0.2)',
                        '0 0 25px rgba(59, 130, 246, 0.4)',
                        '0 0 10px rgba(59, 130, 246, 0.2)'
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />

                  <div className="flex items-start gap-4 mb-4 relative z-10">
                    {/* Icône holographique avec anneaux */}
                    <div className="relative">
                      <motion.div
                        className="absolute inset-0 rounded-lg border-2 border-primary-500/30"
                        animate={{
                          scale: [1, 1.3],
                          opacity: [0.6, 0]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: index * 0.2
                        }}
                      />
                      <motion.div
                        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-500/20 text-primary-600 group-hover:bg-primary-500/30 transition-colors relative"
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        style={{
                          boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)'
                        }}
                      >
                        <ItemIcon className="h-6 w-6 relative z-10" />
                        {/* Grille radiale */}
                        <div className="absolute inset-0 opacity-20 rounded-lg" style={{
                          backgroundImage: 'radial-gradient(circle, rgba(59,130,246,0.4) 1px, transparent 1px)',
                          backgroundSize: '6px 6px'
                        }} />
                      </motion.div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-muted-strong mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 relative z-10">
                    <span className="text-xs text-muted font-semibold">{item.size}</span>
                    <motion.button
                      onClick={() => handleDownload(item.title)}
                      className="relative inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-bold overflow-hidden group"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Shimmer effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{
                          x: ['-100%', '200%']
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                      
                      {/* Glow border */}
                      <motion.div
                        className="absolute inset-0 rounded-lg"
                        animate={{
                          boxShadow: [
                            '0 0 10px rgba(59, 130, 246, 0.3)',
                            '0 0 20px rgba(59, 130, 246, 0.6)',
                            '0 0 10px rgba(59, 130, 246, 0.3)'
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />

                      <span className="relative z-10 flex items-center gap-2">
                        {isAuthenticated ? (
                          <>
                            <Download className="h-4 w-4" />
                            Télécharger
                          </>
                        ) : (
                          <>
                            <Lock className="h-4 w-4" />
                            Se connecter
                          </>
                        )}
                      </span>
                    </motion.button>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Bouton télécharger tout - ULTRA VISIBLE */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center"
          >
            <motion.button
              onClick={handleDownloadComplete}
              className="relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 text-white text-lg font-bold shadow-2xl overflow-hidden group"
              whileHover={{ 
                scale: 1.08,
                y: -8,
                boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)'
              }}
              whileTap={{ scale: 0.95 }}
              style={{
                boxShadow: '0 12px 40px rgba(59, 130, 246, 0.4)',
                willChange: 'transform'
              }}
            >
              {/* Shimmer holographique */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{
                  x: ['-200%', '200%']
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />

              {/* Grille technique */}
              <div className="absolute inset-0 opacity-15" style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
                `,
                backgroundSize: '12px 12px'
              }} />

              {/* Anneaux pulsants */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-white/40"
                animate={{
                  scale: [1, 1.1],
                  opacity: [0.6, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-white/40"
                animate={{
                  scale: [1, 1.1],
                  opacity: [0.6, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 0.5
                }}
              />

              <span className="relative z-10 flex items-center gap-3">
                {isAuthenticated ? (
                  <>
                    <motion.div
                      animate={{
                        rotate: [0, 360]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <Download className="h-6 w-6" />
                    </motion.div>
                    <motion.span
                      animate={{
                        textShadow: [
                          '0 0 15px rgba(255,255,255,0.6)',
                          '0 0 25px rgba(255,255,255,0.9)',
                          '0 0 15px rgba(255,255,255,0.6)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Télécharger la plaquette complète
                    </motion.span>
                  </>
                ) : (
                  <>
                    <Lock className="h-6 w-6" />
                    Se connecter pour télécharger
                  </>
                )}
              </span>
            </motion.button>

            {isAuthenticated && user && (
              <motion.p 
                className="mt-6 text-sm text-muted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Connecté en tant que <span className="font-semibold text-primary-600">{user.firstName} {user.lastName}</span>
              </motion.p>
            )}
          </motion.div>

          {/* Auth Modal */}
          <AuthModal 
            isOpen={showAuthModal} 
            onClose={() => setShowAuthModal(false)}
            defaultMode="signup"
          />
        </div>
      </div>
    </section>
  )
}
