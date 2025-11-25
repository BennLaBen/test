'use client'

import Link from 'next/link'
import { SEO } from '@/components/SEO'
import { motion } from 'framer-motion'
import { IndustrialBackground } from '@/components/IndustrialBackground'
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
  Zap,
  Sparkles
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
        <IndustrialBackground variant="circuit" className="opacity-20" />
        
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full industrial-grid bg-center" />
        </div>

        {/* Animated corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32 tech-corner opacity-30" />
        <div className="absolute top-0 right-0 w-32 h-32 tech-corner opacity-30 rotate-90" />
        <div className="absolute bottom-0 left-0 w-32 h-32 tech-corner opacity-30 -rotate-90" />
        <div className="absolute bottom-0 right-0 w-32 h-32 tech-corner opacity-30 rotate-180" />

        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <motion.span 
              className="chip mb-6 inline-flex bg-white/20 text-white backdrop-blur-sm tech-border"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {t('hero.badge')}
            </motion.span>
            
            <motion.h1 
              className="mb-4 text-5xl font-bold tracking-tight lg:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t('hero.title')}
            </motion.h1>
            
            <motion.p 
              className="mb-6 text-xl opacity-90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {t('hero.subtitle')}
            </motion.p>
            
            <motion.p 
              className="mb-12 text-lg leading-relaxed opacity-80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {t('hero.intro')}
            </motion.p>

            <motion.div 
              className="glass-card mb-12 bg-white/10 p-8 backdrop-blur-sm tech-border relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="absolute inset-0 -translate-x-full"
                animate={{ translateX: ['100%', '-100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)' }}
              />
              <Quote className="mx-auto mb-4 h-12 w-12 opacity-60" />
              <blockquote className="text-xl font-medium italic leading-relaxed relative z-10">
                "{t('hero.quote')}"
              </blockquote>
            </motion.div>

            <motion.div 
              className="grid grid-cols-2 gap-6 md:grid-cols-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              {heroStats.map((stat: any, index: number) => (
                <motion.div 
                  key={index} 
                  className="text-center relative group"
                  whileHover={{ scale: 1.1, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute inset-0 bg-white/5 rounded-lg tech-border opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-3xl font-bold relative z-10 shimmer-text">{stat.value}</div>
                  <div className="mt-1 text-sm opacity-80 relative z-10">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section id="nos-valeurs" className="py-20 lg:py-32 relative overflow-hidden">
        <IndustrialBackground variant="grid" />
        
        <div className="container relative z-10">
          <motion.div 
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="chip mb-4 tech-border">
              <Factory className="h-4 w-4 mr-2 inline-block" />
              {t('values.badge')}
            </span>
            <h2 className="mb-6 text-3xl font-bold text-muted-strong lg:text-5xl">
              {t('values.title')}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted">
              {t('values.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {values.map((value: any, index: number) => {
              const Icon = Object.values(iconMap)[index]
              return (
                <motion.div 
                  key={index} 
                  className="glass-card group p-8 tech-border relative overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  {/* Animated wave effect */}
                  <motion.div
                    className="absolute inset-0 opacity-30"
                    animate={{ 
                      backgroundPosition: ['0% 0%', '100% 100%'],
                    }}
                    transition={{ 
                      duration: 8, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }}
                    style={{ 
                      background: 'linear-gradient(45deg, transparent 30%, rgba(59, 130, 246, 0.05) 50%, transparent 70%)',
                      backgroundSize: '200% 200%'
                    }}
                  />
                  
                  {/* Hover shimmer effect */}
                  <motion.div
                    className="absolute inset-0 -translate-x-full"
                    whileHover={{ translateX: '100%' }}
                    transition={{ duration: 0.6 }}
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.15), transparent)' }}
                  />
                  
                  <motion.div 
                    className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-500/15 text-primary-600 transition-colors group-hover:bg-primary-500/25 tech-corner relative z-10"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      y: [0, -3, 0]
                    }}
                    transition={{ 
                      duration: 4 + index * 0.5, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: index * 0.3
                    }}
                  >
                    <Icon className="h-7 w-7" />
                  </motion.div>
                  <h3 className="mb-3 text-xl font-bold text-muted-strong relative z-10">{value.title}</h3>
                  <p className="text-muted relative z-10">{value.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section id="notre-histoire" className="bg-gradient-to-b from-gray-50 to-white py-20 dark:from-gray-800 dark:to-gray-900 lg:py-32 relative overflow-hidden">
        <IndustrialBackground variant="blueprint" />
        
        <div className="container relative z-10">
          <motion.div 
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="chip mb-4 tech-border">
              <TrendingUp className="h-4 w-4 mr-2 inline-block" />
              {t('history.badge')}
            </span>
            <h2 className="mb-6 text-3xl font-bold text-muted-strong lg:text-5xl">
              {t('history.title')}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted">
              {t('history.subtitle')}
            </p>
          </motion.div>

          <div className="relative mx-auto max-w-4xl">
            <motion.div 
              className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-primary-500/50 via-primary-500 to-primary-500/50"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              style={{ transformOrigin: 'top' }}
            />
            
            {milestones.map((milestone: any, index: number) => (
              <motion.div 
                key={index} 
                className={`relative mb-12 grid grid-cols-2 gap-8 ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className={index % 2 === 0 ? 'text-right' : 'col-start-2'}>
                  <motion.div 
                    className="glass-card inline-block p-6 text-left tech-border relative overflow-hidden"
                    whileHover={{ scale: 1.05, x: index % 2 === 0 ? -5 : 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div
                      className="absolute inset-0 opacity-0"
                      whileHover={{ opacity: 1 }}
                      style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), transparent)' }}
                    />
                    <div className="mb-2 text-sm font-semibold text-primary-600 relative z-10 industrial-badge">{milestone.year}</div>
                    <h3 className="mb-2 text-lg font-bold text-muted-strong relative z-10">{milestone.event}</h3>
                    <p className="text-sm text-muted relative z-10">{milestone.description}</p>
                  </motion.div>
                </div>
                <motion.div 
                  className="absolute left-1/2 top-6 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white bg-primary-600 dark:border-gray-900 tech-indicator"
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                  whileHover={{ scale: 1.3, rotate: 360 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industrial Vision Section */}
      <section id="vision-industrielle" className="py-20 lg:py-32 relative overflow-hidden">
        <IndustrialBackground variant="precision" />
        
        <div className="container relative z-10">
          <motion.div 
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="chip mb-4 tech-border">
              <Wrench className="h-4 w-4 mr-2 inline-block" />
              {t('industrialVision.badge')}
            </span>
            <h2 className="mb-6 text-3xl font-bold text-muted-strong lg:text-5xl">
              {t('industrialVision.title')}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted">
              {t('industrialVision.subtitle')}
            </p>
          </motion.div>

          <div className="mx-auto max-w-4xl space-y-6">
            {paragraphs.map((paragraph: string, index: number) => (
              <motion.p 
                key={index} 
                className="text-lg leading-relaxed text-muted"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          <div className="mt-16">
            <motion.h3 
              className="mb-8 text-center text-2xl font-bold text-muted-strong"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {t('industrialVision.objectives.title')}
            </motion.h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {objectives.map((objective: any, index: number) => {
                const Icon = objectiveIcons[index]
                return (
                  <motion.div 
                    key={index} 
                    className="glass-card flex items-start gap-4 p-6 tech-border relative overflow-hidden"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    whileHover={{ scale: 1.03, x: 5 }}
                  >
                    <motion.div
                      className="absolute inset-0 -translate-y-full"
                      whileHover={{ translateY: '100%' }}
                      transition={{ duration: 0.6 }}
                      style={{ background: 'linear-gradient(180deg, transparent, rgba(59, 130, 246, 0.05), transparent)' }}
                    />
                    <motion.div 
                      className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-500/15 text-primary-600 tech-corner relative z-10"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="h-6 w-6" />
                    </motion.div>
                    <div className="relative z-10">
                      <h4 className="mb-2 font-bold text-muted-strong">{objective.title}</h4>
                      <p className="text-sm text-muted">{objective.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="temoignages" className="bg-gradient-to-b from-gray-50 to-white py-20 dark:from-gray-800 dark:to-gray-900 lg:py-32 relative overflow-hidden">
        <IndustrialBackground variant="grid" />
        
        <div className="container relative z-10">
          <motion.div 
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="chip mb-4 tech-border">
              <Star className="h-4 w-4 mr-2 inline-block" />
              {t('testimonials.badge')}
            </span>
            <h2 className="mb-6 text-3xl font-bold text-muted-strong lg:text-5xl">
              {t('testimonials.title')}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted">
              {t('testimonials.subtitle')}
            </p>
          </motion.div>

          <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial: any, index: number) => (
              <motion.div 
                key={index} 
                className="glass-card relative p-8 tech-border overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <motion.div
                  className="absolute inset-0 opacity-0"
                  whileHover={{ opacity: 1 }}
                  style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.03), transparent)' }}
                />
                <Quote className="absolute right-6 top-6 h-12 w-12 text-primary-200 dark:text-primary-900 opacity-20" />
                <div className="mb-4 flex gap-1 relative z-10">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 + i * 0.05 }}
                    >
                      <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    </motion.div>
                  ))}
                </div>
                <blockquote className="relative z-10 mb-6 text-muted">
                  "{testimonial.content}"
                </blockquote>
                <div className="border-t border-gray-200 pt-4 dark:border-gray-700 relative z-10">
                  <div className="font-semibold text-muted-strong">{testimonial.author}</div>
                  <div className="text-sm text-primary-600">{testimonial.company}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Note de confidentialité */}
          <motion.div 
            className="glass-card glass-card--muted p-8 tech-border relative overflow-hidden mx-auto max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <IndustrialBackground variant="circuit" className="opacity-5" />
            <div className="text-center relative z-10">
              <Shield className="h-12 w-12 mx-auto mb-4 text-primary-600" />
              <h3 className="mb-4 text-xl font-bold text-muted-strong">Confidentialité client</h3>
              <p className="text-muted leading-relaxed">
                Par respect de la confidentialité de nos partenaires et clients, nous ne pouvons pas divulguer publiquement les noms des grandes entreprises avec lesquelles nous collaborons. 
                Nos relations clients sont fondées sur la confiance mutuelle et la discrétion professionnelle.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact-vision" className="py-20 lg:py-32 relative overflow-hidden">
        <IndustrialBackground variant="circuit" />
        
        <div className="container relative z-10">
          <motion.div 
            className="glass-card glass-card--muted mx-auto max-w-4xl p-12 text-center tech-border relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Animated corners */}
            <div className="absolute top-0 left-0 w-20 h-20 tech-corner opacity-20" />
            <div className="absolute top-0 right-0 w-20 h-20 tech-corner opacity-20 rotate-90" />
            <div className="absolute bottom-0 left-0 w-20 h-20 tech-corner opacity-20 -rotate-90" />
            <div className="absolute bottom-0 right-0 w-20 h-20 tech-corner opacity-20 rotate-180" />
            
            {/* Scanline effect */}
            <motion.div
              className="absolute inset-0 scanline-effect opacity-20"
              animate={{ translateY: ['0%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            <motion.h2 
              className="mb-6 text-3xl font-bold text-muted-strong lg:text-4xl relative z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Zap className="inline-block h-8 w-8 mr-3 text-primary-600" />
              {t('cta.title')}
            </motion.h2>
            
            <motion.p 
              className="mb-10 text-lg text-muted relative z-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {t('cta.subtitle')}
            </motion.p>
            
            <motion.div 
              className="flex flex-col justify-center gap-4 sm:flex-row relative z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.div whileHover={{ scale: 1.05, x: 5 }} whileTap={{ scale: 0.95 }}>
                <Link href="/contact" className="btn-primary inline-flex items-center gap-2 tech-border">
                  {t('cta.buttons.contact')}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, x: 5 }} whileTap={{ scale: 0.95 }}>
                <Link href="/carriere" className="btn-secondary inline-flex items-center gap-2 tech-border">
                  {t('cta.buttons.careers')}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, x: 5 }} whileTap={{ scale: 0.95 }}>
                <Link href="/nos-expertises" className="btn-secondary inline-flex items-center gap-2 tech-border">
                  {t('cta.buttons.expertises')}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
