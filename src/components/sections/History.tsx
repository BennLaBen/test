'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useMemo } from 'react'
import { IndustrialBackground } from '@/components/IndustrialBackground'
import { TrendingUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function History() {
  const { t } = useTranslation('vision')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const milestones = t('history.milestones', { returnObjects: true }) as any[]

  const yearsOfExperience = useMemo(() => {
    return new Date().getFullYear() - 1989
  }, [])

  return (
    <section ref={ref} id="notre-histoire" className="bg-gradient-to-b from-gray-50 to-white py-20 dark:from-gray-800 dark:to-gray-900 lg:py-32 relative overflow-hidden">
      <IndustrialBackground variant="blueprint" />
      
      {/* Particules ultra-optimisées */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary-400 rounded-full opacity-40"
            style={{
              left: `${(i * 25) % 100}%`,
              top: `${(i * 30) % 100}%`,
              willChange: 'transform',
            }}
            animate={{
              y: [0, -35, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Lignes de scan holographiques */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50"
        animate={{
          scaleX: [0.5, 1, 0.5],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50"
        animate={{
          scaleX: [0.5, 1, 0.5],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, delay: 2 }}
      />
      
      <div className="container relative z-10">
        <motion.div 
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <span className="chip mb-4 tech-border">
            <TrendingUp className="h-4 w-4 mr-2 inline-block" />
            {t('history.badge')}
          </span>
          <h2 className="mb-6 text-3xl font-bold text-muted-strong lg:text-5xl">
            {t('history.title')}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted">
            {t('history.subtitle')}
          </p>
        </motion.div>

        <div className="relative mx-auto max-w-4xl">
          {/* Timeline holographique centrale */}
          <motion.div 
            className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-gradient-to-b from-primary-500/50 via-primary-500 to-primary-500/50 rounded-full"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 1.5, delay: 0.3 }}
            style={{ 
              transformOrigin: 'top',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.3)'
            }}
          />

          {/* Pulse d'énergie qui descend */}
          <motion.div
            className="absolute left-1/2 top-0 w-3 h-3 -translate-x-1/2 rounded-full bg-primary-400"
            animate={{
              y: ['0%', '100%'],
              opacity: [1, 0.3, 1],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              boxShadow: '0 0 15px rgba(59, 130, 246, 0.8)'
            }}
          />
          
          {milestones.map((milestone: any, index: number) => (
            <motion.div 
              key={index} 
              className={`relative mb-12 grid grid-cols-2 gap-8 ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}
              initial={{ 
                opacity: 0, 
                x: index % 2 === 0 ? -50 : 50,
                scale: 0.95
              }}
              animate={isInView ? { 
                opacity: 1, 
                x: 0,
                scale: 1
              } : { 
                opacity: 0, 
                x: index % 2 === 0 ? -50 : 50,
                scale: 0.95
              }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1
              }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className={index % 2 === 0 ? 'text-right' : 'col-start-2'}>
                <motion.div 
                  className="glass-card inline-block p-6 text-left tech-border relative overflow-hidden"
                  whileHover={{ 
                    scale: 1.03, 
                    x: index % 2 === 0 ? -5 : 5
                  }}
                  transition={{ duration: 0.2 }}
                  style={{ willChange: 'transform' }}
                >
                  {/* Scan holographique */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-500/20 to-transparent"
                    animate={{
                      x: ['-100%', '200%']
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.5,
                      ease: "linear"
                    }}
                  />

                  {/* Grille holographique */}
                  <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: `
                      linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '15px 15px'
                  }} />

                  {/* Coins HUD statiques */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary-500/60" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary-500/60" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary-500/60" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary-500/60" />

                  {/* Glow au hover */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0"
                    whileHover={{ opacity: 1 }}
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), transparent)',
                      boxShadow: 'inset 0 0 30px rgba(59, 130, 246, 0.2)'
                    }}
                  />

                  <div className="mb-2 text-lg font-black text-primary-500 relative z-10 industrial-badge tracking-wider">{milestone.year}</div>
                  <h3 className="mb-2 text-lg font-bold text-muted-strong relative z-10">{milestone.event}</h3>
                  <p className="text-sm text-muted relative z-10">{milestone.description}</p>
                </motion.div>
              </div>

              {/* Point central holographique sur timeline */}
              <motion.div 
                className="absolute left-1/2 top-6 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white bg-primary-600 dark:border-gray-900 tech-indicator"
                initial={{ scale: 0, rotate: -180 }}
                animate={isInView ? { 
                  scale: 1, 
                  rotate: 0,
                  boxShadow: [
                    '0 0 15px rgba(59, 130, 246, 0.6)',
                    '0 0 25px rgba(59, 130, 246, 0.9)',
                    '0 0 15px rgba(59, 130, 246, 0.6)'
                  ]
                } : { scale: 0, rotate: -180 }}
                transition={{ 
                  scale: { duration: 0.5, delay: index * 0.2 + 0.3 },
                  rotate: { duration: 0.5, delay: index * 0.2 + 0.3 },
                  boxShadow: { duration: 2, repeat: Infinity }
                }}
                whileHover={{ scale: 1.5, rotate: 360 }}
              >
                {/* Anneaux d'énergie */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary-400"
                  animate={{
                    scale: [1, 1.8],
                    opacity: [0.8, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: index * 0.3
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary-400"
                  animate={{
                    scale: [1, 1.8],
                    opacity: [0.8, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: index * 0.3 + 0.5
                  }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

