'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Star, Quote, Plane, Shield, Factory, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const iconMap: Record<string, any> = {
  aeronautique: Plane,
  defense: Shield,
  industrie: Factory,
  energie: Zap
}

export function Testimonials() {
  const { t } = useTranslation('testimonials')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [activeSector, setActiveSector] = useState<string>('all')

  const sectors = t('sectors', { returnObjects: true }) as any[]
  const testimonials = t('list', { returnObjects: true }) as any[]
  
  const filteredTestimonials = activeSector === 'all' 
    ? testimonials 
    : testimonials.filter((t: any) => t.sector === activeSector)

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tight text-muted-strong sm:text-4xl mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Sector Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          <button
            onClick={() => setActiveSector('all')}
            className={`chip cursor-pointer transition-all ${
              activeSector === 'all' 
                ? 'bg-primary-600 text-white hover:bg-primary-700' 
                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {t('filterAll')}
          </button>
          {sectors.map((sector: any) => {
            const Icon = iconMap[sector.id]
            return (
              <button
                key={sector.id}
                onClick={() => setActiveSector(sector.id)}
                className={`chip cursor-pointer transition-all inline-flex items-center gap-2 ${
                  activeSector === sector.id 
                    ? 'bg-primary-600 text-white hover:bg-primary-700' 
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {sector.name}
              </button>
            )
          })}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
          {filteredTestimonials.map((testimonial: any, index: number) => (
            <motion.div
              key={`${testimonial.company}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-card p-8 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-primary-200 dark:text-primary-900">
                <Quote className="h-12 w-12" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-muted mb-6 text-base leading-relaxed relative z-10">
                "{testimonial.content}"
              </blockquote>

              {/* Author */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="font-semibold text-muted-strong">{testimonial.author}</div>
                <div className="text-sm text-muted">{testimonial.role}</div>
                <div className="text-sm font-medium text-muted-strong mt-1">
                  {testimonial.company}
                </div>
                {testimonial.project && (
                  <div className="text-xs text-muted mt-2 italic">
                    Projet : {testimonial.project}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="glass-card glass-card--muted p-8 inline-block">
            <h3 className="text-xl font-bold text-muted-strong mb-4">
              {t('cta.title')}
            </h3>
            <a href="/contact" className="btn-primary">
              {t('cta.button')}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
