'use client'

import { motion } from 'framer-motion'
import { MessageSquare, FileText, Cog, Truck, Award, HeadphonesIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'

interface Step {
  title: string
  description: string
  details: string[]
}

const icons = [MessageSquare, FileText, Cog, Truck, Award, HeadphonesIcon]

export function Process() {
  const { t } = useTranslation('homepage')
  const steps = t('process.steps', { returnObjects: true }) as Step[]
  const pathname = usePathname()
  const locale = pathname.startsWith('/en') ? 'en' : 'fr'

  return (
    <section className="py-20 lg:py-32">
      <div className="container">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex justify-center">
            <span className="chip">{t('process.badge')}</span>
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-6 text-3xl font-bold text-muted-strong lg:text-5xl"
          >
            {t('process.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted"
          >
            {t('process.subtitle')}
          </motion.p>
        </div>

        {/* Process Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-primary-200 via-primary-400 to-primary-200 dark:from-primary-800 dark:via-primary-600 dark:to-primary-800 lg:block" />

          <div className="space-y-12 lg:space-y-24">
            {steps.map((step, index) => {
              const Icon = icons[index] || MessageSquare
              const isEven = index % 2 === 0

              return (
                <motion.div
                  key={`${locale}-step-${index}`}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className={`lg:grid lg:grid-cols-2 lg:gap-12 ${isEven ? '' : 'lg:grid-flow-dense'}`}>
                    <div className={`${isEven ? 'lg:text-right' : 'lg:col-start-2'}`}>
                      <div className="glass-card inline-block w-full max-w-xl rounded-2xl p-8">
                        <div className={`mb-6 flex items-center gap-4 ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-primary-600/90 text-white shadow-lg">
                            <Icon className="h-8 w-8" />
                          </div>
                          <div>
                            <div className="mb-1 text-sm font-semibold text-primary-600">
                              {t('process.stepLabel', { defaultValue: 'Étape {{number}}', number: index + 1 })}
                            </div>
                            <h3 className="text-2xl font-bold text-muted-strong">
                              {step.title}
                            </h3>
                          </div>
                        </div>

                        <p className="mb-4 text-muted">
                          {step.description}
                        </p>

                        <ul className={`space-y-2 ${isEven ? 'lg:text-right' : ''}`}>
                          {step.details.map((detail, idx) => (
                            <li key={idx} className={`flex items-center gap-2 text-sm text-muted ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                              <span className="flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-500/80" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/60 bg-primary-600 text-2xl font-bold text-white shadow-xl">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* CTA Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="glass-card glass-card--muted inline-block rounded-2xl p-8 lg:p-12">
            <h3 className="mb-4 text-2xl font-bold text-muted-strong lg:text-3xl">
              {t('process.cta.title')}
            </h3>
            <p className="mb-6 text-muted">
              {t('process.cta.subtitle')}
            </p>
            <a
              href="/contact"
              className="btn-primary inline-flex items-center justify-center"
            >
              {t('process.cta.button')}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
