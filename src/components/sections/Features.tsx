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

  // Statistiques clés
  const stats = [
    { label: 'Collaborateurs experts', value: '70+', icon: Users, color: 'from-blue-500 to-blue-600', progress: 100 },
    { label: 'Heures de production/an', value: '100k', icon: Factory, color: 'from-purple-500 to-purple-600', progress: 95 },
    { label: 'Pays exportés', value: '20+', icon: Globe, color: 'from-green-500 to-green-600', progress: 90 },
    { label: 'Taux de satisfaction', value: '98%', icon: Target, color: 'from-amber-500 to-amber-600', progress: 98 },
  ]

  return (
    <section id="features" ref={ref} className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-muted-strong sm:text-4xl mb-4">
            {t('features.title')}
          </h2>
          <p className="text-lg text-muted max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
        </motion.div>

        {/* Stats Section */}
        <div ref={statsRef} className="mb-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={statsInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 50 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.05,
                  rotate: [0, -1, 1, 0],
                  transition: { duration: 0.3 }
                }}
                className="glass-card relative overflow-hidden p-6 group hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 -translate-x-full"
                  animate={{
                    translateX: statsInView ? ['100%', '-100%'] : '100%'
                  }}
                  transition={{
                    duration: 2,
                    delay: index * 0.2 + 1,
                    ease: "easeInOut"
                  }}
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
                  }}
                />
                
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Pulse ring on hover */}
                <motion.div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-0`}
                  whileHover={{
                    opacity: [0, 0.2, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    {/* Floating icon */}
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:shadow-2xl transition-shadow`}
                    >
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </motion.div>
                    </motion.div>
                    
                    <motion.div
                      animate={{ 
                        y: [0, -4, 0],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    </motion.div>
                  </div>
                  
                  {/* Animated counter */}
                  <motion.div 
                    className="text-3xl font-bold text-muted-strong mb-1"
                    initial={{ scale: 0.5 }}
                    animate={statsInView ? { scale: 1 } : { scale: 0.5 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  >
                    <AnimatedCounter value={stat.value} duration={2} />
                  </motion.div>
                  <div className="text-sm text-muted mb-3">{stat.label}</div>
                  
                  {/* Progress bar with glow */}
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700 relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={statsInView ? { width: `${stat.progress}%` } : { width: 0 }}
                      transition={{ duration: 1.5, delay: index * 0.1 + 0.5, ease: 'easeOut' }}
                      className={`h-full bg-gradient-to-r ${stat.color} relative`}
                    >
                      {/* Glow effect */}
                      <motion.div
                        className="absolute right-0 top-0 h-full w-8 blur-sm"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={{
                          background: 'linear-gradient(90deg, transparent, white)'
                        }}
                      />
                    </motion.div>
                  </div>
                  
                  {/* Sparkle effect */}
                  <motion.div
                    className="absolute top-2 right-2"
                    animate={{ 
                      scale: [0, 1, 0],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 2,
                      delay: index * 0.3 + 0.5,
                      ease: "easeOut"
                    }}
                  >
                    <Sparkles className="h-4 w-4 text-yellow-400" />
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bento Grid Features */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-6 lg:grid-cols-12">
          {features.map((feature, index) => {
            // Layout Bento: certaines cartes plus grandes
            const spanClasses = [
              'md:col-span-6 lg:col-span-4', // Conformité (grande)
              'md:col-span-6 lg:col-span-4', // Précision (grande)
              'md:col-span-6 lg:col-span-4', // Délais (grande)
              'md:col-span-6 lg:col-span-6', // Équipe (très grande)
              'md:col-span-3 lg:col-span-3', // Innovation (medium)
              'md:col-span-3 lg:col-span-3', // Service (medium)
            ]

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: -15 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 80
                }}
                whileHover={{ 
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className={`glass-card group relative overflow-hidden p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer ${spanClasses[index]}`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Shimmer effect traversant */}
                <motion.div
                  className="absolute inset-0 -translate-x-full"
                  animate={{
                    translateX: isInView ? ['100%', '-100%'] : '100%'
                  }}
                  transition={{
                    duration: 2.5,
                    delay: index * 0.3 + 1.5,
                    ease: "easeInOut"
                  }}
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
                    pointerEvents: 'none'
                  }}
                />
                
                {/* Animated gradient background on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-primary-600/10 opacity-0"
                  whileHover={{ 
                    opacity: 1,
                    scale: 1.05,
                  }}
                  transition={{ duration: 0.4 }}
                />
                
                {/* Border glow on hover */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  whileHover={{
                    boxShadow: [
                      '0 0 0 0 rgba(59, 130, 246, 0)',
                      '0 0 20px 2px rgba(59, 130, 246, 0.3)',
                      '0 0 0 0 rgba(59, 130, 246, 0)'
                    ]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                
                <div className="relative">
                  {/* Icon avec animation float */}
                  <motion.div
                    animate={{ 
                      y: [0, -12, 0],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.2
                    }}
                    className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-xl mb-6 group-hover:shadow-2xl transition-shadow duration-300"
                    whileHover={{ 
                      rotate: [0, -10, 10, -10, 0],
                      scale: 1.1
                    }}
                  >
                    <motion.div
                      whileHover={{ 
                        rotate: 360,
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className="h-7 w-7" />
                    </motion.div>
                  </motion.div>
                  
                  {/* Title with gradient on hover */}
                  <motion.h3 
                    className="text-xl font-bold text-muted-strong mb-3 group-hover:text-primary-600 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    {feature.title}
                  </motion.h3>
                  
                  <p className="text-muted leading-relaxed mb-5">
                    {feature.description}
                  </p>
                  
                  <ul className="space-y-2.5">
                    {feature.benefits.map((benefit: string, benefitIndex: number) => (
                      <motion.li
                        key={benefitIndex}
                        initial={{ opacity: 0, x: -20, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -20, scale: 0.8 }}
                        transition={{ 
                          duration: 0.5, 
                          delay: index * 0.1 + benefitIndex * 0.08,
                          type: "spring",
                          stiffness: 100
                        }}
                        whileHover={{ x: 5, scale: 1.05 }}
                        className="flex items-center text-sm text-muted group-hover:text-muted-strong transition-colors"
                      >
                        <motion.div 
                          className="mr-3 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"
                          whileHover={{ 
                            scale: 1.3,
                            rotate: 360
                          }}
                          transition={{ duration: 0.4 }}
                        >
                          <CheckCircle className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                        </motion.div>
                        {benefit}
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
