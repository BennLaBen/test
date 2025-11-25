'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
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
  Sparkles
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

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

const statsIconMap = [TrendingUp, Factory, Award, Shield]
const statsColorMap = ['text-blue-500', 'text-purple-500', 'text-orange-500', 'text-green-500']

export function Expertises() {
  const { t } = useTranslation('expertises')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const expertises = t('list', { returnObjects: true }) as any[]
  const stats = t('stats.list', { returnObjects: true }) as any[]

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      <IndustrialBackground variant="grid" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="chip mb-4 inline-flex items-center gap-2">
            <Shield className="h-4 w-4" />
            LLEDO Industries Group
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-muted-strong sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-muted max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Expertises */}
        <div className="space-y-24">
          {expertises.map((expertise: any, index: number) => {
            const Icon = iconMap[expertise.id]
            const colorClass = colorMap[expertise.id]
            const isEven = index % 2 === 0

            return (
              <motion.div
                key={expertise.id}
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: -15 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 80
                }}
                className={`grid gap-12 lg:grid-cols-2 lg:gap-16 ${isEven ? '' : 'lg:grid-flow-dense'}`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Icon/Visual Side */}
                <motion.div 
                  className={isEven ? '' : 'lg:col-start-2'}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colorClass} p-12 shadow-2xl hover:shadow-3xl transition-all duration-300 group cursor-pointer`}>
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 -translate-x-full"
                      animate={{
                        translateX: ['100%', '-100%']
                      }}
                      transition={{
                        duration: 3,
                        delay: index * 0.5 + 2,
                        repeat: Infinity,
                        repeatDelay: 4,
                        ease: "easeInOut"
                      }}
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                        pointerEvents: 'none'
                      }}
                    />
                    
                    {/* Border glow on hover */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      whileHover={{
                        boxShadow: [
                          '0 0 0 0 rgba(255, 255, 255, 0)',
                          '0 0 30px 3px rgba(255, 255, 255, 0.4)',
                          '0 0 0 0 rgba(255, 255, 255, 0)'
                        ]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    
                    <div className="relative z-10 text-center text-white">
                      {/* Floating icon */}
                      <motion.div 
                        className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
                        animate={{ 
                          y: [0, -10, 0],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.3
                        }}
                        whileHover={{ 
                          rotate: 360,
                          scale: 1.1
                        }}
                      >
                        <Icon className="h-12 w-12" />
                      </motion.div>
                      
                      <motion.h3 
                        className="mb-2 text-3xl font-bold"
                        whileHover={{ scale: 1.05 }}
                      >
                        {expertise.name}
                      </motion.h3>
                      <p className="text-lg opacity-90 mb-8">{expertise.tagline}</p>

                      {/* Capabilities with animation */}
                      <div className="grid grid-cols-1 gap-4">
                        {[
                          { label: 'Capacité / Capacity', value: expertise.capabilities.capacity },
                          { label: 'Précision / Precision', value: expertise.capabilities.precision },
                          { label: 'Équipements / Equipment', value: expertise.capabilities.machines }
                        ].map((cap, capIdx) => (
                          <motion.div 
                            key={capIdx}
                            className="rounded-lg bg-white/10 p-4 backdrop-blur-sm text-left relative overflow-hidden group/cap"
                            initial={{ opacity: 0, x: -30 }}
                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                            transition={{ duration: 0.5, delay: index * 0.2 + capIdx * 0.1 }}
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
                          delay: index * 0.4 + 1,
                          repeat: Infinity,
                          repeatDelay: 5,
                          ease: "easeOut"
                        }}
                      >
                        <Sparkles className="h-6 w-6 text-white" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Content Side */}
                <motion.div 
                  className={`flex flex-col justify-center ${isEven ? '' : 'lg:col-start-1'}`}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -50 : 50 }}
                  transition={{ duration: 0.8, delay: index * 0.2 + 0.2 }}
                >
                  <motion.h3 
                    className="text-2xl font-bold text-muted-strong mb-4"
                    whileHover={{ x: 5 }}
                  >
                    {expertise.name} - {expertise.tagline}
                  </motion.h3>
                  <p className="text-muted mb-6 text-lg leading-relaxed">
                    {expertise.description}
                  </p>

                  {/* Expertise List with stagger animation */}
                  <div className="mb-6 space-y-3">
                    {expertise.expertise.map((item: string, idx: number) => (
                      <motion.div 
                        key={idx} 
                        className="flex items-start"
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ duration: 0.5, delay: index * 0.2 + idx * 0.08 }}
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

                  {/* Certifications with animation */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {expertise.certifications.map((cert: string, idx: number) => (
                      <motion.span 
                        key={idx} 
                        className="chip chip--sm"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.4, delay: index * 0.2 + idx * 0.05 }}
                        whileHover={{ scale: 1.1, y: -2 }}
                      >
                        <Award className="mr-1 h-3 w-3" />
                        {cert}
                      </motion.span>
                    ))}
                  </div>

                  {/* CTA with link to dedicated page */}
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link
                      href={`/societes/${expertise.id}`}
                      className="btn-secondary inline-flex items-center gap-2 tech-border relative overflow-hidden group"
                    >
                      <motion.div
                        className="absolute inset-0 bg-primary-600/10 opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.3 }}
                      />
                      <span className="relative z-10">Découvrir {expertise.name}</span>
                      <motion.div
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-24 text-center"
        >
          <div className="glass-card glass-card--muted p-12 tech-border relative overflow-hidden group">
            {/* Animated corners */}
            <div className="absolute top-0 left-0 w-20 h-20 tech-corner opacity-20" />
            <div className="absolute top-0 right-0 w-20 h-20 tech-corner opacity-20 rotate-90" />
            <div className="absolute bottom-0 left-0 w-20 h-20 tech-corner opacity-20 -rotate-90" />
            <div className="absolute bottom-0 right-0 w-20 h-20 tech-corner opacity-20 rotate-180" />
            
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 -translate-x-full"
              animate={{
                translateX: ['100%', '-100%']
              }}
              transition={{
                duration: 3,
                delay: 2,
                repeat: Infinity,
                repeatDelay: 5,
                ease: "easeInOut"
              }}
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent)',
                pointerEvents: 'none'
              }}
            />
            
            <motion.h3 
              className="text-2xl font-bold text-muted-strong mb-4 relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              {t('cta.title')}
            </motion.h3>
            <motion.p 
              className="text-muted mb-8 max-w-2xl mx-auto relative z-10"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              {t('cta.subtitle')}
            </motion.p>
            <motion.div
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative z-10"
            >
              <Link href="/contact" className="btn-primary inline-flex items-center gap-2 tech-border">
                {t('cta.button')}
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
