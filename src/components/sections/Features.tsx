'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  Cog, 
  Shield, 
  Award, 
  Clock, 
  Users, 
  Zap,
  CheckCircle,
  Globe,
  Wrench
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

const iconMap = [Shield, Cog, Clock, Users, Zap, Globe]

export function Features() {
  const { t } = useTranslation('common')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  
  const features = (t('features.list', { returnObjects: true }) as any[]).map((feature, idx) => ({
    ...feature,
    icon: iconMap[idx]
  }))

  return (
    <section ref={ref} className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-muted-strong sm:text-4xl">
            {t('features.title')}
          </h2>
          <p className="mt-4 text-lg text-muted">
            {t('features.subtitle')}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient">36+</div>
            <div className="mt-2 text-sm text-muted">{t('features.stats.years', { count: 36 })}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient">70+</div>
            <div className="mt-2 text-sm text-muted">{t('features.stats.employees', { count: 70 })}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient">20+</div>
            <div className="mt-2 text-sm text-muted">{t('features.stats.countries', { count: 20 })}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient">100%</div>
            <div className="mt-2 text-sm text-muted">{t('features.stats.compliance', { percent: '100%' })}</div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-card group p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500/15 text-primary-600 group-hover:bg-primary-500/25">
                <feature.icon className="h-6 w-6" />
              </div>
              
              <h3 className="mt-4 text-lg font-semibold text-muted-strong">
                {feature.title}
              </h3>
              
              <p className="mt-2 text-muted">
                {feature.description}
              </p>
              
              <ul className="mt-4 space-y-2">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-center text-sm text-muted">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Process Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="glass-card glass-card--muted mt-20 p-8 lg:p-12"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-muted-strong">
              {t('features.process.title')}
            </h3>
            <p className="mt-4 text-muted">
              {t('features.process.subtitle')}
            </p>
            
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-4">
              {(t('features.process.steps', { returnObjects: true }) as any[]).map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600/90 text-white shadow-lg">
                    <span className="text-lg font-bold">{index + 1}</span>
                  </div>
                  <h4 className="mt-3 font-semibold text-muted-strong">{step.title}</h4>
                  <p className="mt-1 text-sm text-muted">{step.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
