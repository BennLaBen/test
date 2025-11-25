'use client'

import { motion } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { generateJsonLd } from '@/lib/jsonLd'
import { 
  Phone, 
  Mail, 
  MapPin,
  ExternalLink,
  Package,
  Shield,
  Award,
  Truck
} from 'lucide-react'

export default function AerotoolsPage() {
  const jsonLd = generateJsonLd({
    type: 'Organization',
    data: {
      name: 'LLEDO AEROTOOLS - Équipements GSE',
      url: 'https://lledo-industries.com/aerotools',
      logo: 'https://lledo-industries.com/logo.png',
      description: 'Barres de remorquage et rollers hydrauliques pour hélicoptères. Conformes Directive Machines et ISO 9667.',
      address: {
        streetAddress: '9-11 Boulevard de la Capelane',
        addressLocality: 'Les Pennes-Mirabeau',
        postalCode: '13170',
        addressCountry: 'FR',
      },
      contactPoint: {
        telephone: '+33-4-42-02-96-74',
        contactType: 'customer service',
        email: 'contact@lledo-industries.com',
      },
    },
  })

  const stats = [
    { label: 'Clients satisfaits', value: '70+' },
    { label: 'Années d\'expérience', value: '35' },
    { label: 'Certifié CE', value: '100%' },
    { label: 'Qualité ISO 9001', value: 'ISO 9001' },
  ]

  const contactCards = [
    {
      icon: Phone,
      title: 'Téléphone',
      content: '+33 4 42 02 96 74',
      subtitle: 'Lun-Ven 8h-18h',
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'contact@lledo-industries.com',
      subtitle: 'Réponse sous 24h',
    },
    {
      icon: MapPin,
      title: 'Adresse',
      content: '9-11 Bd de la Capelane, 13170',
      subtitle: 'Les Pennes-Mirabeau',
      extra: 'France',
    },
  ]

  return (
    <>
      <SEO
        title="LLEDO AEROTOOLS - Équipements GSE pour Hélicoptères"
        description="Équipez votre flotte avec des solutions certifiées. Barres de remorquage et rollers hydrauliques conformes EN 12312."
        canonical="/aerotools"
        jsonLd={jsonLd}
      />

      {/* Main CTA Section - Similar to image */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 py-20 text-white dark:from-primary-700 dark:to-primary-900 lg:py-32">
        {/* Industrial Background */}
        <div className="absolute inset-0 opacity-5 industrial-grid" />
        <div className="absolute inset-0 opacity-[0.03] blueprint-pattern" />
        
        {/* Animated scanning line */}
        <motion.div
          className="absolute inset-0"
          animate={{ y: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.1), transparent)' }}
        />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white px-4 py-2 text-sm font-bold uppercase tracking-wide text-primary-700"
            >
              <Package className="h-4 w-4" />
              LLEDO AEROTOOLS
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
            >
              Équipez votre flotte avec des solutions{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                  certifiées
                </span>
                <motion.span
                  className="absolute inset-x-0 bottom-2 h-3 bg-white/20"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                />
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12 text-lg text-white/90 sm:text-xl"
            >
              Rejoignez plus de 70 opérateurs et centres MRO qui font confiance à LLEDO Industries.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <a
                href="https://lledo-aerotools.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-gray-100 shadow-xl"
              >
                Découvrir nos produits
                <ExternalLink className="h-5 w-5" />
              </a>
              <a
                href="tel:+33442029674"
                className="btn-secondary inline-flex items-center gap-2 border-white/30 text-white hover:bg-white/10"
              >
                <Phone className="h-5 w-5" />
                Nous contacter
              </a>
            </motion.div>

            {/* Contact Cards */}
            <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3">
              {contactCards.map((card, index) => {
                const Icon = card.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10 hover:shadow-2xl tech-corner"
                  >
                    {/* Industrial grid background */}
                    <div className="absolute inset-0 opacity-[0.02] industrial-grid" />
                    
                    {/* Icon */}
                    <div className="mb-4 flex justify-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-white/70">
                      {card.title}
                    </h3>
                    <p className="mb-1 text-lg font-bold text-white">
                      {card.content}
                    </p>
                    <p className="text-sm text-white/60">{card.subtitle}</p>
                    {card.extra && (
                      <p className="text-sm text-white/60">{card.extra}</p>
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-2 gap-8 border-t border-white/10 pt-12 md:grid-cols-4"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <motion.p
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + index * 0.1, type: 'spring' }}
                    className="mb-2 text-3xl font-bold text-white sm:text-4xl"
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-sm text-white/70">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom wave decoration */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="h-16 w-full">
            <path
              d="M0 0L60 8.33C120 16.7 240 33.3 360 41.7C480 50 600 50 720 45C840 40 960 30 1080 28.3C1200 26.7 1320 33.3 1380 36.7L1440 40V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V0Z"
              fill="currentColor"
              className="text-white dark:text-gray-900"
            />
          </svg>
        </div>
      </section>
    </>
  )
}

