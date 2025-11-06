'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { ChevronDown, HelpCircle } from 'lucide-react'

interface FaqItem {
  question: string
  answer: string
}

export function FAQ() {
  const { t } = useTranslation('homepage')
  const items = t('faq.items', { returnObjects: true }) as FaqItem[]
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const pathname = usePathname()
  const locale = pathname.startsWith('/en') ? 'en' : 'fr'
  const localePrefix = locale === 'en' ? '/en' : ''

  const resolveHref = (href: string) => {
    if (locale === 'en') {
      if (href === '/') return '/en'
      return `${localePrefix}${href}`
    }
    return href
  }

  return (
    <section className="py-20 lg:py-32">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-16 text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-4 inline-flex justify-center"
            >
              <span className="chip">{t('faq.badge')}</span>
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mb-6 text-3xl font-bold text-muted-strong lg:text-5xl"
            >
              {t('faq.title')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted"
            >
              {t('faq.subtitle')}
            </motion.p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {items.map((faq, index) => (
              <motion.div
                key={`${locale}-faq-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="overflow-hidden rounded-xl border border-gray-200/40 bg-white/70 backdrop-blur-xl shadow-sm dark:border-gray-700/40 dark:bg-gray-800/70"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="flex w-full items-start gap-4 p-6 text-left transition-colors hover:bg-white/40"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500/15 text-primary-600">
                      <HelpCircle className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-muted-strong">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="flex-shrink-0">
                    <ChevronDown
                      className={`h-6 w-6 text-gray-400 transition-transform ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200/50 bg-white/30 px-6 py-6"
                  >
                    <p className="pl-12 text-muted leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* CTA Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="glass-card glass-card--muted inline-flex flex-col items-center gap-4 rounded-2xl px-10 py-8">
              <h3 className="text-xl font-bold text-muted-strong">
                {t('faq.contactCta')}
              </h3>
              <p className="max-w-2xl text-muted">
                {t('faq.contactDescription')}
              </p>
              <a
                href={resolveHref('/contact')}
                className="btn-primary"
              >
                {t('faq.contactButton')}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
