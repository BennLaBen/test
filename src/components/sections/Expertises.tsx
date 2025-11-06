'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { 
  Settings, 
  Lightbulb, 
  Wrench, 
  Factory,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Shield,
  Award
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
    <section ref={ref} className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* Group Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 gap-6 md:grid-cols-4 mb-20"
        >
          {stats.map((stat: any, index: number) => {
            const Icon = statsIconMap[index]
            const colorClass = statsColorMap[index]
            return (
              <div key={index} className="glass-card p-6 text-center">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-3 ${colorClass}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-gradient mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted">
                  {stat.label}
                </div>
              </div>
            )
          })}
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
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`grid gap-12 lg:grid-cols-2 lg:gap-16 ${isEven ? '' : 'lg:grid-flow-dense'}`}
              >
                {/* Icon/Visual Side */}
                <div className={isEven ? '' : 'lg:col-start-2'}>
                  <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colorClass} p-12 shadow-2xl`}>
                    <div className="relative z-10 text-center text-white">
                      <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                        <Icon className="h-12 w-12" />
                      </div>
                      <h3 className="mb-2 text-3xl font-bold">{expertise.name}</h3>
                      <p className="text-lg opacity-90 mb-8">{expertise.tagline}</p>

                      {/* Capabilities */}
                      <div className="grid grid-cols-1 gap-4">
                        <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm text-left">
                          <div className="text-sm opacity-80 mb-1">Capacité / Capacity</div>
                          <div className="text-lg font-bold">{expertise.capabilities.capacity}</div>
                        </div>
                        <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm text-left">
                          <div className="text-sm opacity-80 mb-1">Précision / Precision</div>
                          <div className="text-lg font-bold">{expertise.capabilities.precision}</div>
                        </div>
                        <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm text-left">
                          <div className="text-sm opacity-80 mb-1">Équipements / Equipment</div>
                          <div className="text-lg font-bold">{expertise.capabilities.machines}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className={`flex flex-col justify-center ${isEven ? '' : 'lg:col-start-1'}`}>
                  <h3 className="text-2xl font-bold text-muted-strong mb-4">
                    {expertise.name} - {expertise.tagline}
                  </h3>
                  <p className="text-muted mb-6 text-lg leading-relaxed">
                    {expertise.description}
                  </p>

                  {/* Expertise List */}
                  <div className="mb-6 space-y-3">
                    {expertise.expertise.map((item: string, idx: number) => (
                      <div key={idx} className="flex items-start">
                        <CheckCircle className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-primary-600" />
                        <span className="text-muted">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Certifications */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {expertise.certifications.map((cert: string, idx: number) => (
                      <span key={idx} className="chip chip--sm">
                        <Award className="mr-1 h-3 w-3" />
                        {cert}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div>
                    <Link
                      href="/contact"
                      className="btn-secondary inline-flex items-center gap-2"
                    >
                      {expertise.ctaLabel}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-24 text-center"
        >
          <div className="glass-card glass-card--muted p-12">
            <h3 className="text-2xl font-bold text-muted-strong mb-4">
              {t('cta.title')}
            </h3>
            <p className="text-muted mb-8 max-w-2xl mx-auto">
              {t('cta.subtitle')}
            </p>
            <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
              {t('cta.button')}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
