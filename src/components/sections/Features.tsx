'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { 
  Cog, 
  Shield, 
  Award, 
  Clock, 
  Users, 
  Zap,
  CheckCircle,
  Globe,
  Wrench,
  TrendingUp,
  Factory,
  Target,
  Sparkles
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

const iconMap = [Shield, Cog, Clock, Users, Zap, Globe]

// Animated Counter Component
function AnimatedCounter({ value, duration = 2 }: { value: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  
  useEffect(() => {
    if (isInView) {
      // Extract number from string (e.g., "70+" -> 70, "100k" -> 100, "98%" -> 98)
      const numericValue = parseInt(value.replace(/[^0-9]/g, ''))
      if (isNaN(numericValue)) return
      
      let startTime: number
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
        
        setCount(Math.floor(progress * numericValue))
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }
  }, [isInView, value, duration])
  
  const displayValue = value.replace(/[0-9]+/, count.toString())
  
  return <span ref={ref}>{displayValue}</span>
}

export function Features() {
  const { t } = useTranslation('common')
  const ref = useRef(null)
  const statsRef = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const statsInView = useInView(statsRef, { once: true, margin: '-100px' })
  
  const features = (t('features.list', { returnObjects: true }) as any[]).map((feature, idx) => ({
    ...feature,
    icon: iconMap[idx]
  }))

  // Points forts qualitatifs
  const stats = [
    { label: 'Équipe experte', value: 'Savoir-faire', icon: Users, color: 'from-blue-500 to-blue-600', progress: 100 },
    { label: 'Capacité industrielle', value: 'Production', icon: Factory, color: 'from-purple-500 to-purple-600', progress: 100 },
    { label: 'Rayonnement', value: 'International', icon: Globe, color: 'from-green-500 to-green-600', progress: 100 },
    { label: 'Engagement qualité', value: 'Excellence', icon: Target, color: 'from-amber-500 to-amber-600', progress: 100 },
  ]

  return (
    <section id="features" ref={ref} className="py-32 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Grille industrielle en fond */}
      <div className="absolute inset-0 opacity-10">
        <div 
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
          className="h-full w-full"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Tony Stark Style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.h2
            className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl mb-6 uppercase"
            style={{
              textShadow: '0 0 30px rgba(59, 130, 246, 0.8)'
            }}
            animate={{
              textShadow: [
                '0 0 20px rgba(59, 130, 246, 0.6)',
                '0 0 40px rgba(59, 130, 246, 1)',
                '0 0 20px rgba(59, 130, 246, 0.6)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {t('features.title')}
          </motion.h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t('features.subtitle')}
          </p>
        </motion.div>

        {/* Stats Section - Ultra Modern */}
        <div ref={statsRef} className="mb-16 sm:mb-20 lg:mb-24 grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={statsInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 40 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1
                }}
                whileHover={{ 
                  scale: 1.03,
                  y: -5
                }}
                className="relative overflow-hidden p-5 sm:p-8 group cursor-pointer bg-white/5 backdrop-blur-sm border border-blue-400/30 rounded-2xl"
                style={{
                  boxShadow: '0 10px 40px rgba(59, 130, 246, 0.2)',
                  willChange: 'transform'
                }}
              >
                {/* Scan line */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                    delay: index * 0.5
                  }}
                  style={{ willChange: 'transform' }}
                />
                
                {/* Glow on hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    {/* Icon */}
                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    
                    <TrendingUp className="h-6 w-6 text-green-400" />
                  </div>
                  
                  {/* Animated counter */}
                  <div className="text-4xl font-black text-white mb-2">
                    <AnimatedCounter value={stat.value} duration={2} />
                  </div>
                  <div className="text-sm text-gray-400 font-semibold uppercase tracking-wider">{stat.label}</div>
                  
                  {/* Progress bar */}
                  <div className="mt-4 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={statsInView ? { width: `${stat.progress}%` } : { width: 0 }}
                      transition={{ duration: 1.5, delay: index * 0.1 + 0.4, ease: 'easeOut' }}
                      className={`h-full bg-gradient-to-r ${stat.color}`}
                      style={{
                        boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Grid Features - Toutes les cartes de la même taille */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.95 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1
                }}
                whileHover={{ 
                  y: -6,
                  scale: 1.02
                }}
                className="group relative overflow-hidden p-5 sm:p-8 cursor-pointer bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-2xl h-full"
                style={{
                  boxShadow: '0 8px 32px rgba(59, 130, 246, 0.15)',
                  willChange: 'transform'
                }}
              >
                {/* Scan line */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                    delay: index * 0.7
                  }}
                  style={{ willChange: 'transform' }}
                />
                
                {/* Glow on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                
                <div className="relative">
                  {/* Icon */}
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-xl mb-6">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-black text-white mb-3 uppercase group-hover:text-blue-300 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-300 leading-relaxed mb-5">
                    {feature.description}
                  </p>
                  
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit: string, benefitIndex: number) => (
                      <motion.li
                        key={benefitIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ 
                          duration: 0.4, 
                          delay: index * 0.1 + benefitIndex * 0.05
                        }}
                        className="flex items-center text-sm text-gray-300"
                      >
                        <div className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500/20">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        </div>
                        <span className="font-medium">{benefit}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
