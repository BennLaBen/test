'use client'

import Link from 'next/link'
import { SEO } from '@/components/SEO'
import { motion } from 'framer-motion'
import { IndustrialBackground } from '@/components/IndustrialBackground'
import { 
  Factory,
  ArrowRight,
  CheckCircle,
  Award,
  Wrench,
  Settings,
  Target,
  TrendingUp,
  Users,
  Sparkles
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function MPEBPage() {
  const { t } = useTranslation('expertises')

  // Placeholder data - sera remplacé par les vraies données
  const expertise = {
    name: 'MPEB',
    tagline: 'Usinage de précision',
    description: 'MPEB est spécialisée dans l\'usinage de pièces complexes pour l\'aéronautique. Notre expertise technique et nos équipements de pointe nous permettent de répondre aux exigences les plus strictes du secteur.',
    capabilities: {
      capacity: '100 000h/an',
      precision: '±0.01mm',
      machines: '25+ machines CNC'
    },
    expertise: [
      'Usinage 3, 4 et 5 axes',
      'Tournage et fraisage',
      'Alésage de précision',
      'Surfaçage et rectification',
      'Contrôle dimensionnel'
    ],
    certifications: ['EN 9100', 'ISO 9001', 'NADCAP'],
    stats: [
      { label: 'Années d\'expérience', value: '36+', icon: TrendingUp, color: 'from-blue-500 to-blue-600' },
      { label: 'Pièces produites/an', value: '10k+', icon: Factory, color: 'from-purple-500 to-purple-600' },
      { label: 'Collaborateurs', value: '25', icon: Users, color: 'from-green-500 to-green-600' },
      { label: 'Taux de conformité', value: '99.8%', icon: Target, color: 'from-amber-500 to-amber-600' },
    ]
  }

  return (
    <>
      <SEO
        title="MPEB - Usinage de précision aéronautique"
        description="Spécialiste de l'usinage de précision pour l'aéronautique. Usinage 3, 4 et 5 axes, tournage et fraisage de haute précision."
        canonical="/societes/mpeb"
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 py-20 text-white dark:from-blue-700 dark:to-blue-900 lg:py-32 overflow-hidden">
        <IndustrialBackground variant="circuit" className="opacity-20" />
        
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full industrial-grid bg-center" />
        </div>

        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <motion.span 
              className="chip mb-6 inline-flex bg-white/20 text-white backdrop-blur-sm tech-border"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Factory className="h-4 w-4 mr-2" />
              {expertise.name}
            </motion.span>
            
            <motion.h1 
              className="mb-4 text-5xl font-bold tracking-tight lg:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {expertise.name}
            </motion.h1>
            
            <motion.p 
              className="mb-12 text-xl opacity-90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {expertise.tagline}
            </motion.p>

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

              <div className="flex flex-wrap gap-4">
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    href="/contact"
                    className="btn-primary inline-flex items-center gap-2 tech-border"
                  >
                    Nous contacter
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <a
                    href="/plaquette-lledo-industries.pdf"
                    download
                    className="btn-secondary inline-flex items-center gap-2 tech-border"
                  >
                    Obtenir un devis
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </motion.div>
              </div>
            </motion.div>

            {/* Capabilities Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="glass-card relative overflow-hidden p-8 tech-border group hover:shadow-2xl transition-shadow">
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
                    { icon: Factory, label: 'Capacité', value: expertise.capabilities.capacity },
                    { icon: Target, label: 'Précision', value: expertise.capabilities.precision },
                    { icon: Settings, label: 'Équipements', value: expertise.capabilities.machines }
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
                
                {/* Sparkles */}
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

              {/* Placeholder for future image */}
              <motion.div
                className="mt-8 glass-card p-8 text-center relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Factory className="h-24 w-24 mx-auto mb-4 text-primary-500 opacity-50" />
                <p className="text-muted">
                  Photos de l'atelier MPEB à venir
                </p>
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
              Besoin d'un devis ou d'informations ?
            </h2>
            <p className="mb-10 text-lg text-muted">
              Notre équipe MPEB est à votre disposition pour répondre à vos besoins en usinage de précision.
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
                  Voir toutes nos expertises
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

