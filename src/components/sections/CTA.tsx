'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Phone, Mail, MapPin, Sparkles, Factory, Settings } from 'lucide-react'
import { IndustrialBackground } from '@/components/IndustrialBackground'
import { useEffect, useState } from 'react'

interface ContactCard {
  label: string
  value: string
  info: string
}

// Animated Counter for stats
function AnimatedCounter({ value, duration = 2 }: { value: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    if (isVisible) {
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
  }, [isVisible, value, duration])
  
  const displayValue = value.replace(/[0-9]+/, count.toString())
  
  return (
    <motion.span
      onViewportEnter={() => setIsVisible(true)}
      viewport={{ once: true }}
    >
      {displayValue}
    </motion.span>
  )
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
    <section id="cta" className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 py-20 dark:from-primary-700 dark:to-primary-900 lg:py-32">
      {/* Industrial Background */}
      <IndustrialBackground variant="blueprint" showGears showGrid intensity="light" />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 blueprint-pattern opacity-20" />
      
      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            className="mb-12"
          >
            {/* Badge industriel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mb-6 inline-flex"
            >
              <div className="industrial-badge flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Factory className="h-4 w-4" />
                </motion.div>
                PROJET INDUSTRIEL
              </div>
            </motion.div>

            <motion.h2
              className="mb-6 text-3xl font-bold text-white lg:text-5xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              {t('cta.title')}
            </motion.h2>
            
            <motion.p
              className="mb-8 text-lg text-primary-100 lg:text-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              {t('cta.subtitle')}
            </motion.p>
            
            <motion.div
              className="flex flex-col gap-4 sm:flex-row sm:justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  href={resolveHref('/contact')}
                  className="group relative inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 font-semibold text-primary-700 overflow-hidden tech-border"
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      x: ['-200%', '200%']
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)'
                    }}
                  />
                  <span className="relative z-10">{t('cta.primary')}</span>
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="relative z-10"
                  >
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </motion.div>
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  href={resolveHref('/aerotools')}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white px-8 py-4 font-semibold text-white transition-all hover:bg-white hover:text-primary-700 tech-corner relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10"
                    whileHover={{ scale: 1.5 }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10">{t('cta.secondary')}</span>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Contact Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="grid gap-6 md:grid-cols-3"
          >
            {/* Phone */}
            <motion.div
              className="rounded-xl border border-primary-400/30 bg-white/10 p-6 backdrop-blur-sm tech-border relative overflow-hidden group cursor-pointer"
              whileHover={{ y: -5, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Shimmer */}
              <motion.div
                className="absolute inset-0 -translate-x-full"
                animate={{ translateX: ['100%', '-100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)' }}
              />
              
              <motion.div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Phone className="h-6 w-6 text-white" />
              </motion.div>
              <h3 className="mb-2 font-semibold text-white relative z-10">{phone.label}</h3>
              <a
                href={`tel:${phone.value.replace(/\s+/g, '')}`}
                className="text-primary-100 transition-colors hover:text-white relative z-10 font-mono"
              >
                {phone.value}
              </a>
              <p className="mt-1 text-sm text-primary-200 relative z-10">
                {phone.info}
              </p>
            </motion.div>

            {/* Email */}
            <motion.div
              className="rounded-xl border border-primary-400/30 bg-white/10 p-6 backdrop-blur-sm tech-border relative overflow-hidden group cursor-pointer"
              whileHover={{ y: -5, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Shimmer */}
              <motion.div
                className="absolute inset-0 -translate-x-full"
                animate={{ translateX: ['100%', '-100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)' }}
              />
              
              <motion.div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Mail className="h-6 w-6 text-white" />
              </motion.div>
              <h3 className="mb-2 font-semibold text-white relative z-10">{email.label}</h3>
              <a
                href={`mailto:${email.value}`}
                className="break-all text-primary-100 transition-colors hover:text-white relative z-10 font-mono text-sm"
              >
                {email.value}
              </a>
              <p className="mt-1 text-sm text-primary-200 relative z-10">
                {email.info}
              </p>
            </motion.div>

            {/* Address */}
            <motion.div
              className="rounded-xl border border-primary-400/30 bg-white/10 p-6 backdrop-blur-sm tech-border relative overflow-hidden group cursor-pointer"
              whileHover={{ y: -5, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Shimmer */}
              <motion.div
                className="absolute inset-0 -translate-x-full"
                animate={{ translateX: ['100%', '-100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)' }}
              />
              
              <motion.div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <MapPin className="h-6 w-6 text-white" />
              </motion.div>
              <h3 className="mb-2 font-semibold text-white relative z-10">{address.label}</h3>
              <p className="text-primary-100 relative z-10">
                {address.value}
              </p>
              <p className="mt-1 text-sm text-primary-200 relative z-10">
                {address.info}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
