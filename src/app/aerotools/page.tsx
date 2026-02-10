'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
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
  Truck,
  Play,
  CheckCircle
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
      sameAs: [
        'https://www.linkedin.com/company/lledo-industries',
        'https://www.youtube.com/channel/lledo-industries',
      ],
    },
  })

  const stats = [
    { label: 'Manipulation intuitive', value: 'Ergonomie' },
    { label: 'Expédition express', value: 'Livraison rapide' },
    { label: 'Conformité garantie', value: 'Certifié CE' },
    { label: 'Adaptation client', value: 'Sur-mesure' },
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

      {/* Main CTA Section - Tony Stark */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-gray-900 to-gray-900 py-24 text-white lg:py-32">
        {/* Grille industrielle */}
        <div className="absolute inset-0 opacity-10">
          <div style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.4) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} className="h-full w-full" />
        </div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            {/* Badge Tony Stark */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="mb-8 inline-flex items-center gap-3 px-6 py-3 bg-blue-500/20 backdrop-blur-xl border-2 border-blue-400/50 rounded-full"
              style={{ boxShadow: '0 0 30px rgba(59, 130, 246, 0.6)' }}
            >
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                <Package className="h-5 w-5 text-blue-300" />
              </motion.div>
              <span className="font-black text-white text-sm uppercase tracking-widest">LLEDO AEROTOOLS</span>
            </motion.div>

            {/* Main Title Tony Stark */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6 text-5xl font-black leading-tight sm:text-6xl lg:text-7xl uppercase"
              style={{ textShadow: '0 0 40px rgba(59, 130, 246, 0.8)', lineHeight: '1.2' }}
            >
              Équipez votre flotte avec des solutions{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                certifiées
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-12 text-xl text-gray-300 max-w-3xl mx-auto"
            >
              Des opérateurs et centres MRO du monde entier font confiance à LLEDO Industries pour leurs équipements GSE.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link
                href="/boutique"
                className="group relative overflow-hidden rounded bg-white text-gray-900 px-8 py-4 font-black uppercase tracking-wider text-sm hover:bg-blue-50 transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.5)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Accéder au catalogue <ExternalLink className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />
              </Link>
              
              <a
                href="tel:+33442029674"
                className="px-8 py-4 border border-white/30 text-white font-bold uppercase tracking-wider text-sm hover:bg-white/10 rounded transition-all flex items-center gap-2"
              >
                <Phone className="h-5 w-5" />
                Ligne Directe
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
                    className="group relative overflow-hidden rounded-2xl border border-blue-400/20 bg-white/5 p-6 backdrop-blur-sm transition-all hover:shadow-2xl"
                    style={{ boxShadow: '0 8px 32px rgba(59, 130, 246, 0.15)', willChange: 'transform' }}
                    whileHover={{ scale: 1.03, y: -5 }}
                  >
                    {/* Scan line */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/15 to-transparent"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: index * 0.7 }}
                      style={{ willChange: 'transform' }}
                    />
                    
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
                    transition={{ delay: 1 + index * 0.1 }}
                    className="mb-2 text-3xl font-black text-white sm:text-4xl"
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Video Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mt-16 pt-12 border-t border-white/10"
            >
              <h2 className="text-2xl font-black text-white mb-8 uppercase tracking-wide">
                Découvrez nos équipements en action
              </h2>
              <div className="relative aspect-video max-w-4xl mx-auto rounded-2xl overflow-hidden border-2 border-blue-500/30 bg-gradient-to-br from-blue-950/80 via-gray-900/90 to-blue-950/80 shadow-[0_0_40px_rgba(59,130,246,0.15)]">
                {/* Video placeholder */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 blur-3xl bg-blue-500/20 rounded-full scale-150" />
                    <motion.div
                      className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-blue-600/80 backdrop-blur-sm border-2 border-blue-400/50 cursor-pointer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ boxShadow: '0 0 30px rgba(59, 130, 246, 0.6)' }}
                    >
                      <Play className="h-8 w-8 text-white ml-1" />
                    </motion.div>
                  </div>
                  <p className="text-blue-300/70 text-sm font-medium tracking-wide">
                    Vidéo de présentation à venir
                  </p>
                </div>
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                {/* Bottom accent bar */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
              </div>
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

