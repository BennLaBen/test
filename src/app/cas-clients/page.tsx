'use client'

import Link from 'next/link'
import { SEO } from '@/components/SEO'
import { Users, TrendingUp, Award, CheckCircle, ArrowRight, Quote } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function CasClientsPage() {
  const { t } = useTranslation('cases')
  
  // Charger les case studies depuis les traductions
  const caseStudies = t('caseStudies', { returnObjects: true }) as any[]
  
  return (
    <>
      <SEO
        title={t('title')}
        description={t('description')}
        canonical="/cas-clients"
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-20 text-white dark:from-primary-700 dark:to-primary-900 lg:py-32">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold backdrop-blur-sm">
              {t('hero.badge')}
            </span>
            <h1 className="mb-6 text-4xl font-bold lg:text-6xl">
              {t('hero.title')}
            </h1>
            <p className="text-lg text-primary-100 lg:text-xl">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-200 bg-white py-12 dark:border-gray-700 dark:bg-gray-900">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary-600 dark:text-primary-400">70+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('stats.clients')}</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary-600 dark:text-primary-400">98%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('stats.satisfaction')}</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary-600 dark:text-primary-400">36 ans</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('stats.experience')}</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary-600 dark:text-primary-400">500+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('stats.projects')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="bg-gray-50 py-20 dark:bg-gray-800">
        <div className="container">
          <div className="space-y-20">
            {caseStudies.map((study, index) => (
              <article key={study.id} className="overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-900">
                {/* Header */}
                <div className="border-b border-gray-200 bg-gradient-to-r from-primary-50 to-primary-100 p-8 dark:border-gray-700 dark:from-primary-900/30 dark:to-primary-800/30">
                  <div className="mb-4 flex flex-wrap items-center gap-4">
                    <span className="rounded-full bg-primary-600 px-3 py-1 text-sm font-semibold text-white">
                      {study.sector}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      📍 {study.location}
                    </span>
                  </div>
                  <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {study.client}
                  </h2>
                  <p className="text-xl text-gray-700 dark:text-gray-300">
                    {study.title}
                  </p>
                </div>

                <div className="p-8 lg:p-12">
                  <div className="grid gap-12 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                      {/* Challenge */}
                      <div className="mb-8">
                        <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                          <Users className="h-6 w-6 text-primary-600" />
                          {t('sections.challenge')}
                        </h3>
                        <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                          {study.challenge}
                        </p>
                      </div>

                      {/* Solution */}
                      <div className="mb-8">
                        <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                          <Award className="h-6 w-6 text-primary-600" />
                          {t('sections.solution')}
                        </h3>
                        <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                          {study.solution}
                        </p>
                      </div>

                      {/* Results */}
                      <div className="mb-8">
                        <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                          <TrendingUp className="h-6 w-6 text-green-600" />
                          {t('sections.results')}
                        </h3>
                        <ul className="space-y-3">
                          {study.results.map((result, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                              <span className="text-gray-700 dark:text-gray-300">{result}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Testimonial */}
                      <div className="rounded-xl border-l-4 border-primary-600 bg-gray-50 p-6 dark:bg-gray-800">
                        <Quote className="mb-4 h-8 w-8 text-primary-600 opacity-50" />
                        <p className="mb-4 italic text-gray-700 dark:text-gray-300">
                          "{study.testimonial.quote}"
                        </p>
                        <div className="text-sm">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {study.testimonial.author}
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">
                            {study.testimonial.position}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sidebar Stats */}
                    <div>
                      <div className="sticky top-24 space-y-6">
                        <div className="rounded-xl bg-primary-50 p-6 dark:bg-primary-900/20">
                          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                            {t('sections.keyFigures')}
                          </h4>
                          <div className="space-y-4">
                            <div>
                              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                                {study.stats.gain}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">Gain de productivité</div>
                            </div>
                            <div>
                              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                                {study.stats.roi}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">Retour sur investissement</div>
                            </div>
                            <div>
                              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                                {study.stats.units}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">Unités déployées</div>
                            </div>
                          </div>
                        </div>

                        <Link
                          href="/contact"
                          className="block w-full rounded-lg bg-primary-600 px-6 py-3 text-center font-semibold text-white transition-all hover:bg-primary-700"
                        >
                          {t('cta.button')}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20 dark:bg-gray-900">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">
              {t('cta.title')}
            </h2>
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-8 py-4 font-semibold text-white transition-all hover:bg-primary-700"
              >
                {t('cta.button')}
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/aerotools"
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 px-8 py-4 font-semibold text-gray-700 transition-all hover:border-primary-600 hover:text-primary-600 dark:border-gray-600 dark:text-gray-300"
              >
                Découvrir AEROTOOLS
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
