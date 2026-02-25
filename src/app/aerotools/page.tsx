'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
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

const helicopterFleet = [
  { id: 'h120', name: 'H120', subtitle: 'EC120 Colibri', type: 'civil', image: '/images/aerotools/helicopters/h120.jpg' },
  { id: 'h125', name: 'H125', subtitle: 'AS350 Écureuil', type: 'civil', image: '/images/aerotools/helicopters/h125.jpg' },
  { id: 'h130', name: 'H130', subtitle: 'EC130', type: 'civil', image: '/images/aerotools/helicopters/h130.jpg' },
  { id: 'h135', name: 'H135', subtitle: 'EC135', type: 'civil', image: '/images/aerotools/helicopters/h135.jpg' },
  { id: 'h145', name: 'H145', subtitle: 'EC145', type: 'civil', image: '/images/aerotools/helicopters/h145.jpg' },
  { id: 'h160', name: 'H160', subtitle: 'Airbus H160', type: 'civil', image: '/images/aerotools/helicopters/h160.jpg' },
  { id: 'h215', name: 'H215', subtitle: 'Super Puma', type: 'civil', image: '/images/aerotools/helicopters/h215.jpg' },
  { id: 'h225', name: 'H225', subtitle: 'EC225 Super Puma', type: 'civil', image: '/images/aerotools/helicopters/h225.jpg' },
  { id: 'sa330', name: 'SA330', subtitle: 'Puma', type: 'civil', image: '/images/aerotools/helicopters/sa330.jpg' },
  { id: 'as332', name: 'AS332', subtitle: 'Super Puma', type: 'civil', image: '/images/aerotools/helicopters/as332.jpg' },
  { id: 'sa365', name: 'SA365', subtitle: 'Dauphin', type: 'civil', image: '/images/aerotools/helicopters/sa365.jpg' },
  { id: 'aw109', name: 'AW109', subtitle: 'Leonardo', type: 'civil', image: '/images/aerotools/helicopters/aw109.jpg' },
  { id: 'aw119', name: 'AW119', subtitle: 'Koala', type: 'civil', image: '/images/aerotools/helicopters/aw119.jpg' },
  { id: 'aw139', name: 'AW139', subtitle: 'Leonardo', type: 'civil', image: '/images/aerotools/helicopters/aw139.jpg' },
  { id: 'gazelle', name: 'Gazelle', subtitle: 'SA341/342', type: 'militaire', image: '/images/aerotools/helicopters/gazelle.jpg' },
  { id: 'nh90', name: 'NH90', subtitle: 'NATO Helicopter', type: 'militaire', image: '/images/aerotools/helicopters/nh90.jpg' },
  { id: 'as532', name: 'AS532', subtitle: 'Cougar', type: 'militaire', image: '/images/aerotools/helicopters/as532.jpg' },
  { id: 'as565', name: 'AS565', subtitle: 'Panther', type: 'militaire', image: '/images/aerotools/helicopters/as565.jpg' },
  { id: 'h225m', name: 'H225M', subtitle: 'Caracal', type: 'militaire', image: '/images/aerotools/helicopters/h225m.jpg' },
]

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

      {/* ═══ HELICOPTER FLEET SECTION ═══ */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-primary-600 mb-4 block">
              Flotte compatible
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 text-muted-strong">
              Hélicoptères{' '}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                supportés
              </span>
            </h2>
            <p className="text-muted max-w-2xl mx-auto text-lg">
              Nos équipements GSE sont conçus et certifiés pour les principaux hélicoptères civils et militaires en service.
            </p>
          </motion.div>

          {/* Civil */}
          <div className="mb-12">
            <h3 className="text-sm font-black uppercase tracking-widest text-primary-600 mb-6 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Hélicoptères civils
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {helicopterFleet.filter(h => h.type === 'civil').map((heli, idx) => (
                <motion.div
                  key={heli.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-500 transition-all"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={heli.image}
                      alt={`${heli.name} - ${heli.subtitle}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white font-black text-sm uppercase tracking-wider">{heli.name}</p>
                    <p className="text-white/70 text-xs">{heli.subtitle}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Military */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-6 flex items-center gap-2">
              <Award className="h-4 w-4" />
              Hélicoptères militaires
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {helicopterFleet.filter(h => h.type === 'militaire').map((heli, idx) => (
                <motion.div
                  key={heli.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:shadow-lg hover:border-amber-400 dark:hover:border-amber-500 transition-all"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={heli.image}
                      alt={`${heli.name} - ${heli.subtitle}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white font-black text-sm uppercase tracking-wider">{heli.name}</p>
                    <p className="text-white/70 text-xs">{heli.subtitle}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-muted mb-4">Votre hélicoptère n'est pas listé ? Contactez-nous pour une étude sur-mesure.</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-bold uppercase tracking-wider text-sm hover:bg-primary-700 transition-colors"
            >
              Demander un devis
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}

