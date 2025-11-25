'use client'

import Link from 'next/link'
import { SEO } from '@/components/SEO'
import { ContactForm } from '@/components/forms/ContactForm'
import { FAQ } from '@/components/sections/FAQ'
import { motion } from 'framer-motion'
import { IndustrialBackground } from '@/components/IndustrialBackground'
import { useTranslation } from 'react-i18next'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Zap,
  CheckCircle,
  Factory,
  Lightbulb,
  Wrench,
  Settings,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react'

export default function ContactPage() {
  const { t } = useTranslation('contact')

  const contactStats = [
    { icon: Clock, label: 'Temps de réponse', value: '<24h', color: 'from-blue-500 to-blue-600' },
    { icon: TrendingUp, label: 'Taux de satisfaction', value: '98%', color: 'from-green-500 to-green-600' },
    { icon: MessageCircle, label: 'Projets traités/an', value: '500+', color: 'from-purple-500 to-purple-600' },
    { icon: Award, label: 'Certifications', value: 'EN 9100', color: 'from-amber-500 to-amber-600' },
  ]

  const contactMethods = [
    {
      icon: MapPin,
      title: t('info.address.label'),
      content: (
        <>
          {t('info.address.value')}<br />
          {t('info.address.city')}<br />
          {t('info.address.country')}
        </>
      ),
      action: 'Voir sur la carte',
      href: '#map',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Phone,
      title: t('info.phone.label'),
      content: (
        <>
          <a href="tel:+33442029674" className="hover:text-primary-600 font-semibold">
            {t('info.phone.value')}
          </a>
          <br />
          <span className="text-sm">{t('info.phone.hours')}</span>
        </>
      ),
      action: 'Appeler maintenant',
      href: 'tel:+33442029674',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Mail,
      title: t('info.email.label'),
      content: (
        <>
          <a href="mailto:contact@lledo-industries.com" className="hover:text-primary-600 font-semibold">
            {t('info.email.value')}
          </a>
          <br />
          <span className="text-sm">{t('info.email.response')}</span>
        </>
      ),
      action: 'Envoyer un email',
      href: 'mailto:contact@lledo-industries.com',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Clock,
      title: 'Horaires d\'ouverture',
      content: (
        <>
          Lundi - Vendredi : 8h00 - 18h00<br />
          Samedi : 8h00 - 12h00<br />
          Dimanche : Fermé
        </>
      ),
      action: null,
      href: null,
      color: 'from-amber-500 to-amber-600'
    },
  ]

  const companies = [
    { id: 'mpeb', name: 'MPEB', icon: Factory, tagline: 'Usinage de précision', color: 'from-blue-600 to-blue-800' },
    { id: 'egi', name: 'EGI', icon: Lightbulb, tagline: 'Bureau d\'études', color: 'from-purple-600 to-purple-800' },
    { id: 'frem', name: 'FREM', icon: Wrench, tagline: 'Maintenance industrielle', color: 'from-orange-600 to-orange-800' },
    { id: 'mgp', name: 'MGP', icon: Settings, tagline: 'Tôlerie & chaudronnerie', color: 'from-gray-600 to-gray-800' },
  ]

  return (
    <>
      <SEO
        title={t('title')}
        description={t('description')}
        canonical="/contact"
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 py-20 text-white dark:from-primary-700 dark:to-primary-900 lg:py-32 overflow-hidden">
        <IndustrialBackground variant="circuit" className="opacity-20" />
        
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full industrial-grid bg-center" />
        </div>

        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <motion.span 
              className="chip mb-6 inline-flex bg-white/20 text-white backdrop-blur-sm tech-border"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Zap className="h-4 w-4 mr-2" />
              Contact
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
              className="mb-12 text-xl opacity-90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {t('hero.subtitle')}
            </motion.p>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-2 gap-6 md:grid-cols-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {contactStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div 
                    key={index}
                    className="glass-card relative overflow-hidden p-6 bg-white/10 backdrop-blur-sm group hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.8 + index * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                      className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg mb-4 mx-auto`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <div className="text-3xl font-bold shimmer-text">{stat.value}</div>
                    <div className="mt-1 text-sm opacity-80">{stat.label}</div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <IndustrialBackground variant="grid" />
        
        <div className="container relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="mb-6 text-3xl font-bold text-muted-strong">
                {t('form.title')}
              </h2>
              <p className="text-muted mb-8">
                Remplissez ce formulaire et notre équipe vous répondra dans les plus brefs délais.
              </p>
              <div className="glass-card p-8 tech-border relative overflow-hidden group">
                <motion.div
                  className="absolute inset-0 -translate-x-full"
                  animate={{
                    translateX: ['100%', '-100%']
                  }}
                  transition={{
                    duration: 3,
                    delay: 2,
                    repeat: Infinity,
                    repeatDelay: 4,
                    ease: "easeInOut"
                  }}
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent)',
                    pointerEvents: 'none'
                  }}
                />
                <div className="relative z-10">
                  <ContactForm />
                </div>
                
                <motion.div
                  className="absolute top-4 right-4"
                  animate={{ 
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 2,
                    delay: 1,
                    repeat: Infinity,
                    repeatDelay: 5,
                    ease: "easeOut"
                  }}
                >
                  <Sparkles className="h-6 w-6 text-primary-500" />
                </motion.div>
              </div>
            </motion.div>

            {/* Contact Methods */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="mb-6 text-3xl font-bold text-muted-strong">
                {t('info.title')}
              </h2>
              
              {contactMethods.map((method, index) => {
                const Icon = method.icon
                return (
                  <motion.div
                    key={index}
                    className="glass-card p-6 tech-border relative overflow-hidden group cursor-pointer hover:shadow-2xl transition-shadow"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100"
                      style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.03), transparent)' }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    <div className="flex items-start gap-4 relative z-10">
                      <motion.div
                        animate={{ 
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.3
                        }}
                        className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${method.color} text-white shadow-lg`}
                      >
                        <Icon className="h-7 w-7" />
                      </motion.div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-muted-strong mb-2">{method.title}</h3>
                        <div className="text-muted mb-3">
                          {method.content}
                        </div>
                        {method.action && method.href && (
                          <motion.a
                            href={method.href}
                            className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-semibold"
                            whileHover={{ x: 5 }}
                          >
                            {method.action}
                            <ArrowRight className="h-4 w-4" />
                          </motion.a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
        <IndustrialBackground variant="blueprint" />
        
        <div className="container relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-muted-strong mb-4">
              Nos sociétés du groupe
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Contactez directement la société correspondant à vos besoins
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companies.map((company, index) => {
              const Icon = company.icon
              return (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 50, rotateX: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 80
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <Link href={`/societes/${company.id}`}>
                    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${company.color} p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 group cursor-pointer h-full`}>
                      <motion.div
                        className="absolute inset-0 -translate-x-full"
                        whileHover={{ translateX: '100%' }}
                        transition={{ duration: 0.6 }}
                        style={{
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                          pointerEvents: 'none'
                        }}
                      />
                      
                      <motion.div
                        animate={{ 
                          y: [0, -10, 0],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.2
                        }}
                        className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
                      >
                        <Icon className="h-8 w-8" />
                      </motion.div>
                      
                      <h3 className="text-2xl font-bold mb-2">{company.name}</h3>
                      <p className="text-sm opacity-90 mb-4">{company.tagline}</p>
                      
                      <motion.div
                        className="flex items-center gap-2 text-sm font-semibold"
                        whileHover={{ x: 5 }}
                      >
                        En savoir plus
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section id="map" className="py-20 lg:py-32 relative overflow-hidden">
        <IndustrialBackground variant="precision" />
        
        <div className="container relative z-10">
          <motion.div
            className="glass-card tech-border relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative h-96 bg-gradient-to-br from-primary-500/10 to-primary-600/5 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-24 w-24 mx-auto mb-4 text-primary-500 opacity-50" />
                <p className="text-muted text-lg">
                  📍 Carte interactive à venir
                </p>
                <p className="text-sm text-muted mt-2">
                  9-11 Boulevard de la Capelane, 13170 Les Pennes-Mirabeau
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
        <IndustrialBackground variant="circuit" />
        
        <div className="container relative z-10">
          <motion.div 
            className="glass-card glass-card--muted mx-auto max-w-4xl p-12 text-center tech-border relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-6 text-3xl font-bold text-muted-strong lg:text-4xl">
              Besoin de notre plaquette commerciale ?
            </h2>
            <p className="mb-10 text-lg text-muted">
              Téléchargez notre documentation complète pour découvrir toutes nos capacités.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <motion.div whileHover={{ scale: 1.05, x: 5 }} whileTap={{ scale: 0.95 }}>
                <a
                  href="/plaquette-lledo-industries.pdf"
                  download
                  className="btn-primary inline-flex items-center gap-2 tech-border"
                >
                  Télécharger la plaquette PDF
                  <ArrowRight className="h-5 w-5" />
                </a>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, x: 5 }} whileTap={{ scale: 0.95 }}>
                <Link href="/nos-expertises" className="btn-secondary inline-flex items-center gap-2 tech-border">
                  Découvrir nos expertises
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />
    </>
  )
}
