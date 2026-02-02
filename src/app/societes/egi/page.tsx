'use client'

import Link from 'next/link'
import { SEO } from '@/components/SEO'
import { motion } from 'framer-motion'
import { IndustrialBackground } from '@/components/IndustrialBackground'
import { useState } from 'react'
import { 
  Lightbulb,
  ArrowRight,
  CheckCircle,
  Award,
  Target,
  TrendingUp,
  Users,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Settings
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function EGIPage() {
  const { t } = useTranslation('expertises')
  const [currentImage, setCurrentImage] = useState(0)

  const expertise = {
    name: 'EGI',
    tagline: 'Bureau d\'études intégré',
    description: 'EGI (Études Générales Industrielles) accompagne nos clients de la conception à la réalisation. Notre bureau d\'études intégré conçoit des solutions techniques innovantes et optimisées pour répondre aux cahiers des charges les plus exigeants.',
    capabilities: {
      capacity: 'CAO/FAO 3D',
      precision: 'Simulation FEM',
      machines: 'CATIA V5 / SolidWorks'
    },
    expertise: [
      'Conception 3D',
      'Mise en plan',
      'Calculs de structures (FEM)',
      'Documentation technique complète',
      'Support technique projet'
    ],
    certifications: ['EN 9100', 'ISO 9001'],
    stats: [
      { label: 'Expertise reconnue', value: 'Ingénierie', icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
      { label: 'Projets maîtrisés', value: 'Conception', icon: Target, color: 'from-blue-500 to-blue-600' },
      { label: 'Équipe qualifiée', value: 'Ingénieurs', icon: Users, color: 'from-green-500 to-green-600' },
      { label: 'Qualité garantie', value: 'Excellence', icon: Lightbulb, color: 'from-amber-500 to-amber-600' },
    ]
  }

  // Placeholder images - à remplacer par les vraies photos
  const images = [
    { id: 1, alt: 'Bureau d\'études EGI - Vue 1' },
    { id: 2, alt: 'Bureau d\'études EGI - Vue 2' },
    { id: 3, alt: 'Bureau d\'études EGI - Vue 3' },
    { id: 4, alt: 'Bureau d\'études EGI - Vue 4' },
  ]

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <>
      <SEO
        title={t('pages.egi.seoTitle')}
        description={t('pages.egi.seoDescription')}
        canonical="/societes/egi"
      />

      {/* Hero Section - Tony Stark */}
      <section className="relative bg-gradient-to-br from-purple-900 via-gray-900 to-gray-900 py-24 text-white lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div style={{
            backgroundImage: `linear-gradient(rgba(147, 51, 234, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(147, 51, 234, 0.4) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} className="h-full w-full" />
        </div>

        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="mb-8 inline-flex items-center gap-3 px-6 py-3 bg-purple-500/20 backdrop-blur-xl border-2 border-purple-400/50 rounded-full"
              style={{ boxShadow: '0 0 30px rgba(147, 51, 234, 0.6)' }}
            >
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                <Lightbulb className="h-5 w-5 text-purple-300" />
              </motion.div>
              <span className="font-black text-white text-sm uppercase tracking-widest">{expertise.name}</span>
            </motion.div>
            
            <motion.h1 
              className="mb-6 text-5xl font-black tracking-tight lg:text-7xl uppercase"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ textShadow: '0 0 40px rgba(147, 51, 234, 0.8)', lineHeight: '1.2' }}
            >
              {expertise.name}
            </motion.h1>
            
            <motion.p 
              className="mb-6 text-xl opacity-90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {expertise.tagline}
            </motion.p>

            {/* CTA Button in Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-12"
            >
              <motion.div
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/contact"
                  className="btn-primary inline-flex items-center gap-2 tech-border bg-white text-purple-600 hover:bg-gray-100"
                >
                  Nous contacter
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-2 gap-6 md:grid-cols-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {expertise.stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div 
                    key={index}
                    className="glass-card relative overflow-hidden p-6 bg-white/10 backdrop-blur-sm group hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.8 + index * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                      className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg mb-4 mx-auto`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <div className="text-3xl font-bold shimmer-text">{stat.value}</div>
                    <div className="mt-1 text-sm opacity-80">{stat.label}</div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <IndustrialBackground variant="grid" />
        
        <div className="container relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-muted-strong mb-6">
                Notre expertise
              </h2>
              <p className="text-muted text-lg leading-relaxed mb-8">
                {expertise.description}
              </p>

              {/* Expertise List */}
              <div className="space-y-3 mb-8">
                {expertise.expertise.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
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
              <div className="flex flex-wrap gap-2 mb-8">
                {expertise.certifications.map((cert, idx) => (
                  <motion.span 
                    key={idx}
                    className="chip chip--sm"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                  >
                    <Award className="mr-1 h-3 w-3" />
                    {cert}
                  </motion.span>
                ))}
              </div>

              <motion.div
                whileHover={{ x: 5 }}
                transition={{ duration: 0.3 }}
              >
                <a
                  href="/plaquette-lledo-industries.pdf"
                  download
                  className="btn-primary inline-flex items-center gap-2 tech-border"
                >
                  Obtenir un devis
                  <ArrowRight className="h-4 w-4" />
                </a>
              </motion.div>
            </motion.div>

            {/* Capabilities Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="glass-card relative overflow-hidden p-8 tech-border group hover:shadow-2xl transition-shadow mb-8">
                <motion.div
                  className="absolute inset-0 -translate-x-full"
                  animate={{
                    translateX: ['100%', '-100%']
                  }}
                  transition={{
                    duration: 3,
                    delay: 2,
                    repeat: Infinity,
                    repeatDelay: 4,
                    ease: "easeInOut"
                  }}
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent)',
                    pointerEvents: 'none'
                  }}
                />
                
                <h3 className="text-2xl font-bold text-muted-strong mb-6 relative z-10">
                  Capacités techniques
                </h3>

                <div className="space-y-4 relative z-10">
                  {[
                    { icon: Lightbulb, label: 'CAO/FAO', value: expertise.capabilities.capacity },
                    { icon: Target, label: 'Simulation', value: expertise.capabilities.precision },
                    { icon: Settings, label: 'Logiciels', value: expertise.capabilities.machines }
                  ].map((cap, idx) => (
                    <motion.div 
                      key={idx}
                      className="glass-card p-4 relative overflow-hidden group/cap"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      whileHover={{ scale: 1.03, x: 5 }}
                    >
                      <div className="flex items-center gap-4">
                        <motion.div
                          animate={{ 
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ 
                            duration: 4, 
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: idx * 0.3
                          }}
                          className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500/15 text-primary-600"
                        >
                          <cap.icon className="h-6 w-6" />
                        </motion.div>
                        <div>
                          <div className="text-sm text-muted mb-1">{cap.label}</div>
                          <div className="text-lg font-bold text-muted-strong">{cap.value}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
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
                  <Sparkles className="h-6 w-6 text-primary-500" />
                </motion.div>
              </div>

              {/* Image Carousel */}
              <motion.div
                className="glass-card relative overflow-hidden tech-border"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="relative h-80 bg-gradient-to-br from-purple-500/10 to-purple-600/5">
                  {/* Placeholder image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lightbulb className="h-32 w-32 text-purple-500 opacity-20" />
                  </div>
                  
                  {/* Image counter */}
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
                    {currentImage + 1} / {images.length}
                  </div>

                  {/* Navigation buttons */}
                  <motion.button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm p-2 rounded-full text-white hover:bg-black/70 transition-colors"
                    whileHover={{ scale: 1.1, x: -5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </motion.button>

                  <motion.button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm p-2 rounded-full text-white hover:bg-black/70 transition-colors"
                    whileHover={{ scale: 1.1, x: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </motion.button>
                </div>

                {/* Carousel indicators */}
                <div className="flex justify-center gap-2 p-4 bg-gray-50 dark:bg-gray-800">
                  {images.map((_, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => setCurrentImage(idx)}
                      className={`h-2 rounded-full transition-all ${
                        currentImage === idx ? 'w-8 bg-purple-600' : 'w-2 bg-gray-300 dark:bg-gray-600'
                      }`}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>

                <div className="p-4 text-center">
                  <p className="text-sm text-muted">
                    📸 Photos du bureau d'études EGI à venir
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
        <IndustrialBackground variant="circuit" />
        
        <div className="container relative z-10">
          <motion.div 
            className="glass-card glass-card--muted mx-auto max-w-4xl p-12 text-center tech-border relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-6 text-3xl font-bold text-muted-strong lg:text-4xl">
              Un projet de conception ?
            </h2>
            <p className="mb-10 text-lg text-muted">
              Notre bureau d'études EGI est à votre disposition pour concevoir vos solutions techniques.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <motion.div whileHover={{ scale: 1.05, x: 5 }} whileTap={{ scale: 0.95 }}>
                <Link href="/contact" className="btn-primary inline-flex items-center gap-2 tech-border">
                  Nous contacter
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, x: 5 }} whileTap={{ scale: 0.95 }}>
                <Link href="/nos-expertises" className="btn-secondary inline-flex items-center gap-2 tech-border">
                  Toutes nos entreprises
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

