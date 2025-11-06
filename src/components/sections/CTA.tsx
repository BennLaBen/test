'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Phone, Mail, MapPin } from 'lucide-react'

interface ContactCard {
  label: string
  value: string
  info: string
}

export function CTA() {
  const { t } = useTranslation('homepage')
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

  const stats = t('cta.stats', { returnObjects: true }) as { label: string; value: string }[]
  const phone = t('cta.contacts.phone', { returnObjects: true }) as ContactCard
  const email = t('cta.contacts.email', { returnObjects: true }) as ContactCard
  const address = t('cta.contacts.address', { returnObjects: true }) as ContactCard

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 py-20 dark:from-primary-700 dark:to-primary-900 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-10" />
      
      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="mb-6 text-3xl font-bold text-white lg:text-5xl">
              {t('cta.title')}
            </h2>
            <p className="mb-8 text-lg text-primary-100 lg:text-xl">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href={resolveHref('/contact')}
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 font-semibold text-primary-700 transition-all hover:bg-gray-100"
              >
                {t('cta.primary')}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={resolveHref('/aerotools')}
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white px-8 py-4 font-semibold text-white transition-all hover:bg-white hover:text-primary-700"
              >
                {t('cta.secondary')}
              </Link>
            </div>
          </motion.div>

          {/* Contact Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid gap-6 md:grid-cols-3"
          >
            {/* Phone */}
            <div className="rounded-xl border border-primary-400/30 bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 font-semibold text-white">{phone.label}</h3>
              <a
                href={`tel:${phone.value.replace(/\s+/g, '')}`}
                className="text-primary-100 transition-colors hover:text-white"
              >
                {phone.value}
              </a>
              <p className="mt-1 text-sm text-primary-200">
                {phone.info}
              </p>
            </div>

            {/* Email */}
            <div className="rounded-xl border border-primary-400/30 bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 font-semibold text-white">{email.label}</h3>
              <a
                href={`mailto:${email.value}`}
                className="break-all text-primary-100 transition-colors hover:text-white"
              >
                {email.value}
              </a>
              <p className="mt-1 text-sm text-primary-200">
                {email.info}
              </p>
            </div>

            {/* Address */}
            <div className="rounded-xl border border-primary-400/30 bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 font-semibold text-white">{address.label}</h3>
              <p className="text-primary-100">
                {address.value}
              </p>
              <p className="mt-1 text-sm text-primary-200">
                {address.info}
              </p>
            </div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-8 border-t border-primary-400/30 pt-8 text-primary-100"
          >
            {stats.map((stat, index) => (
              <div key={`${locale}-stat-${index}`} className="text-center">
                <div className="mb-1 text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
