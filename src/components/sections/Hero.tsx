'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Shield, Award, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function Hero() {
  const { t } = useTranslation('common')
  const trustBrands = t('hero.trust.brands', { returnObjects: true }) as string[]

  return (
    <section className="hero-section">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 scale-[1.015] bg-[url('/images/hero-industrial.jpg')] bg-cover bg-center opacity-50 blur-md" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/45 to-white/25 dark:from-gray-950/70 dark:via-gray-950/52 dark:to-gray-950/38" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-30 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="container relative mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="chip mb-6 inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                {t('hero.chip')}
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-muted-strong sm:text-5xl lg:text-6xl">
                <span className="uppercase">{t('hero.headline')}</span>{' '}
                <span className="text-gradient">{t('hero.headlineAccent')}</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-muted">
                {t('hero.subheadline')}
              </p>
            </motion.div>

            {/* Key Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-10 grid gap-4 sm:grid-cols-2"
            >
              {[t('hero.badges.compliance'), t('hero.badges.cmu'), t('hero.badges.certs')].map((label, idx) => (
                <div key={idx} className="glass-card group flex items-center gap-3 rounded-xl px-5 py-4 shadow-sm">
                  {idx === 0 && <Shield className="h-5 w-5 text-primary-500" />}
                  {idx === 1 && <CheckCircle className="h-5 w-5 text-green-500" />}
                  {idx === 2 && <Award className="h-5 w-5 text-amber-400" />}
                  <span className="text-sm font-semibold text-muted-strong group-hover:text-muted">
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 flex flex-col gap-4 sm:flex-row"
            >
              <Link
                href="/contact"
                className="btn-primary group inline-flex items-center justify-center"
              >
                {t('hero.ctaPrimary')}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/nos-expertises"
                className="btn-secondary inline-flex items-center justify-center"
              >
                {t('hero.ctaSecondary')}
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-14"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
                {t('hero.trust.title')}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-6 opacity-80">
                {trustBrands.map((brand) => (
                  <div key={brand} className="text-sm font-semibold text-muted">
                    {brand}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Visual */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="hero-card p-8">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-primary-100/70 via-primary-200/60 to-primary-300/70">
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-primary-600 text-2xl font-bold text-white shadow-xl">
                        RL125-02
                      </div>
                      <p className="mt-4 text-sm font-semibold text-muted">
                        {t('hero.productLabel')}
                      </p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-6 right-6 rounded-full border border-white/30 bg-white/70 p-3 shadow-xl"
                  >
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -bottom-8 left-6 rounded-full border border-white/30 bg-primary-500/80 p-3 shadow-xl"
                  >
                    <Shield className="h-6 w-6 text-white" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="h-8 w-5 rounded-full border-2 border-white/40"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mt-2 h-2 w-1 rounded-full bg-white/60"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
