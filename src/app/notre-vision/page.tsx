'use client'

import Link from 'next/link'
import { SEO } from '@/components/SEO'
import { 
  Heart, 
  Target, 
  Users, 
  TrendingUp, 
  Award,
  Lightbulb,
  Shield,
  Handshake,
  ArrowRight,
  Quote,
  Star,
  Factory,
  Wrench,
  Zap
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

const iconMap = {
  excellence: Shield,
  humain: Users,
  engagement: Handshake,
  innovation: Lightbulb,
  reactivite: Target,
  certifications: Award
}

const objectiveIcons = [TrendingUp, Lightbulb, Target, Users]

export default function NotreVisionPage() {
  const { t } = useTranslation('vision')

  const values = t('values.list', { returnObjects: true }) as any[]
  const milestones = t('history.milestones', { returnObjects: true }) as any[]
  const paragraphs = t('industrialVision.paragraphs', { returnObjects: true }) as string[]
  const objectives = t('industrialVision.objectives.list', { returnObjects: true }) as any[]
  const testimonials = t('testimonials.list', { returnObjects: true }) as any[]
  const companies = t('testimonials.logos.companies', { returnObjects: true }) as string[]
  const heroStats = t('hero.stats', { returnObjects: true }) as any[]
  const testimonialsStats = t('testimonials.stats.list', { returnObjects: true }) as any[]

  return (
    <>
      <SEO
        title={t('title')}
        description={t('description')}
        canonical="/notre-vision"
      />

      {/* Hero Section */}
      <section id="vision-hero" className="relative bg-gradient-to-br from-primary-600 to-primary-800 py-20 text-white dark:from-primary-700 dark:to-primary-900 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[url('/images/grid.svg')] bg-center" />
        </div>

        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <span className="chip mb-6 inline-flex bg-white/20 text-white backdrop-blur-sm">
              {t('hero.badge')}
            </span>
            
            <h1 className="mb-4 text-5xl font-bold tracking-tight lg:text-6xl">
              {t('hero.title')}
            </h1>
            <p className="mb-6 text-xl opacity-90">
              {t('hero.subtitle')}
            </p>
            
            <p className="mb-12 text-lg leading-relaxed opacity-80">
              {t('hero.intro')}
            </p>

            <div className="glass-card mb-12 bg-white/10 p-8 backdrop-blur-sm">
              <Quote className="mx-auto mb-4 h-12 w-12 opacity-60" />
              <blockquote className="text-xl font-medium italic leading-relaxed">
                "{t('hero.quote')}"
              </blockquote>
            </div>

            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {heroStats.map((stat: any, index: number) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="mt-1 text-sm opacity-80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section id="nos-valeurs" className="py-20 lg:py-32">
        <div className="container">
          <div className="mb-16 text-center">
            <span className="chip mb-4">{t('values.badge')}</span>
            <h2 className="mb-6 text-3xl font-bold text-muted-strong lg:text-5xl">
              {t('values.title')}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted">
              {t('values.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {values.map((value: any, index: number) => {
              const Icon = Object.values(iconMap)[index]
              return (
                <div key={index} className="glass-card group p-8">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-500/15 text-primary-600 transition-colors group-hover:bg-primary-500/25">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-muted-strong">{value.title}</h3>
                  <p className="text-muted">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section id="notre-histoire" className="bg-gradient-to-b from-gray-50 to-white py-20 dark:from-gray-800 dark:to-gray-900 lg:py-32">
        <div className="container">
          <div className="mb-16 text-center">
            <span className="chip mb-4">{t('history.badge')}</span>
            <h2 className="mb-6 text-3xl font-bold text-muted-strong lg:text-5xl">
              {t('history.title')}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted">
              {t('history.subtitle')}
            </p>
          </div>

          <div className="relative mx-auto max-w-4xl">
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-primary-500/50 via-primary-500 to-primary-500/50" />
            
            {milestones.map((milestone: any, index: number) => (
              <div key={index} className={`relative mb-12 grid grid-cols-2 gap-8 ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                <div className={index % 2 === 0 ? 'text-right' : 'col-start-2'}>
                  <div className="glass-card inline-block p-6 text-left">
                    <div className="mb-2 text-sm font-semibold text-primary-600">{milestone.year}</div>
                    <h3 className="mb-2 text-lg font-bold text-muted-strong">{milestone.event}</h3>
                    <p className="text-sm text-muted">{milestone.description}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 top-6 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white bg-primary-600 dark:border-gray-900" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industrial Vision Section */}
      <section id="vision-industrielle" className="py-20 lg:py-32">
        <div className="container">
          <div className="mb-16 text-center">
            <span className="chip mb-4">{t('industrialVision.badge')}</span>
            <h2 className="mb-6 text-3xl font-bold text-muted-strong lg:text-5xl">
              {t('industrialVision.title')}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted">
              {t('industrialVision.subtitle')}
            </p>
          </div>

          <div className="mx-auto max-w-4xl space-y-6">
            {paragraphs.map((paragraph: string, index: number) => (
              <p key={index} className="text-lg leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-16">
            <h3 className="mb-8 text-center text-2xl font-bold text-muted-strong">
              {t('industrialVision.objectives.title')}
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {objectives.map((objective: any, index: number) => {
                const Icon = objectiveIcons[index]
                return (
                  <div key={index} className="glass-card flex items-start gap-4 p-6">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-500/15 text-primary-600">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="mb-2 font-bold text-muted-strong">{objective.title}</h4>
                      <p className="text-sm text-muted">{objective.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="temoignages" className="bg-gradient-to-b from-gray-50 to-white py-20 dark:from-gray-800 dark:to-gray-900 lg:py-32">
        <div className="container">
          <div className="mb-16 text-center">
            <span className="chip mb-4">{t('testimonials.badge')}</span>
            <h2 className="mb-6 text-3xl font-bold text-muted-strong lg:text-5xl">
              {t('testimonials.title')}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted">
              {t('testimonials.subtitle')}
            </p>
          </div>

          <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial: any, index: number) => (
              <div key={index} className="glass-card relative p-8">
                <Quote className="absolute right-6 top-6 h-12 w-12 text-primary-200 dark:text-primary-900" />
                <div className="mb-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="relative z-10 mb-6 text-muted">
                  "{testimonial.content}"
                </blockquote>
                <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                  <div className="font-semibold text-muted-strong">{testimonial.author}</div>
                  <div className="text-sm text-primary-600">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-16 text-center">
            <h3 className="mb-8 text-2xl font-bold text-muted-strong">{t('testimonials.logos.title')}</h3>
            <div className="flex flex-wrap justify-center gap-8">
              {companies.map((company: string, index: number) => (
                <div key={index} className="rounded-lg bg-white px-6 py-4 shadow-sm dark:bg-gray-800">
                  <span className="font-semibold text-muted-strong">{company}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card glass-card--muted p-8">
            <h3 className="mb-8 text-center text-2xl font-bold text-muted-strong">
              {t('testimonials.stats.title')}
            </h3>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {testimonialsStats.map((stat: any, index: number) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-gradient">{stat.value}</div>
                  <div className="mt-2 text-sm text-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact-vision" className="py-20 lg:py-32">
        <div className="container">
          <div className="glass-card glass-card--muted mx-auto max-w-4xl p-12 text-center">
            <h2 className="mb-6 text-3xl font-bold text-muted-strong lg:text-4xl">
              {t('cta.title')}
            </h2>
            <p className="mb-10 text-lg text-muted">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
                {t('cta.buttons.contact')}
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/carriere" className="btn-secondary inline-flex items-center gap-2">
                {t('cta.buttons.careers')}
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/nos-expertises" className="btn-secondary inline-flex items-center gap-2">
                {t('cta.buttons.expertises')}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
