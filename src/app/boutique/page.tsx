'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Shield, Award, Truck, Phone, ChevronDown, ArrowRight, Zap, CheckCircle, Star, Target, Wrench, Globe, Users, Clock } from 'lucide-react'
import { SEO } from '@/components/SEO'

// ─── HANGAR DOOR COMPONENT ───
function HangarDoors() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const leftDoor = useTransform(scrollYProgress, [0, 0.5], ['0%', '-100%'])
  const rightDoor = useTransform(scrollYProgress, [0, 0.5], ['0%', '100%'])
  const contentOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1])
  const contentScale = useTransform(scrollYProgress, [0.2, 0.5], [0.92, 1])
  const imageZoom = useTransform(scrollYProgress, [0, 0.8], [1.15, 1])
  const overlayOpacity = useTransform(scrollYProgress, [0.4, 0.7], [0.7, 0.3])

  return (
    <div ref={ref} className="relative h-[200vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background image */}
        <motion.div className="absolute inset-0" style={{ scale: imageZoom }}>
          <Image
            src="/images/aerotools/helicopter-hero2.png"
            alt="Hangar LLEDO Aero Tools — Hélicoptères"
            fill
            className="object-cover brightness-[0.4]"
            priority
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)' }}
          />
        </motion.div>

        {/* Dark overlay */}
        <motion.div
          className="absolute inset-0 bg-gray-950 z-[5]"
          style={{ opacity: overlayOpacity }}
        />

        {/* Content revealed behind doors */}
        <motion.div
          style={{ opacity: contentOpacity, scale: contentScale }}
          className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4"
        >
          <div className="text-center">
            <motion.div className="relative w-48 h-20 mx-auto mb-8">
              <Image
                src="/images/aerotools/lledo-aerotools-logo.svg"
                alt="LLEDO Aerotools"
                fill
                className="object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                priority
              />
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black uppercase tracking-tighter mb-4">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                AEROTOOLS
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-6 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Outillage aéronautique certifié — Barres de remorquage, rollers hydrauliques et équipements GSE pour hélicoptères civils et militaires.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest text-blue-400/80">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              Catalogue en ligne
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-16 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="h-8 w-8 text-blue-400/50" />
          </motion.div>
        </motion.div>

        {/* LEFT DOOR */}
        <motion.div
          style={{ x: leftDoor }}
          className="absolute inset-y-0 left-0 w-1/2 z-20"
        >
          <div className="h-full bg-gradient-to-r from-gray-800 to-gray-700 border-r-4 border-gray-600 shadow-[8px_0_30px_rgba(0,0,0,0.5)]">
            {/* Rivets top-left */}
            <div className="absolute top-8 left-8 grid grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-3 h-3 rounded-full bg-gray-600 shadow-inner" />
              ))}
            </div>
            {/* Rivets bottom-right */}
            <div className="absolute bottom-24 right-16 grid grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={`br-${i}`} className="w-3 h-3 rounded-full bg-gray-600 shadow-inner" />
              ))}
            </div>
            {/* Warning stripes */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-[repeating-linear-gradient(45deg,#f59e0b_0,#f59e0b_20px,#111827_20px,#111827_40px)] opacity-60" />
            {/* Handle */}
            <div className="absolute top-1/2 right-8 -translate-y-1/2 w-4 h-32 bg-gray-500 rounded-full shadow-lg" />
            {/* Horizontal beams */}
            <div className="absolute top-1/3 left-0 right-0 h-1 bg-gray-600/50" />
            <div className="absolute top-2/3 left-0 right-0 h-1 bg-gray-600/50" />
            {/* Text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-6xl sm:text-8xl font-black text-gray-600/40 tracking-tighter select-none">
                LLEDO
              </p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT DOOR */}
        <motion.div
          style={{ x: rightDoor }}
          className="absolute inset-y-0 right-0 w-1/2 z-20"
        >
          <div className="h-full bg-gradient-to-l from-gray-800 to-gray-700 border-l-4 border-gray-600 shadow-[-8px_0_30px_rgba(0,0,0,0.5)]">
            {/* Rivets top-right */}
            <div className="absolute top-8 right-8 grid grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-3 h-3 rounded-full bg-gray-600 shadow-inner" />
              ))}
            </div>
            {/* Rivets bottom-left */}
            <div className="absolute bottom-24 left-16 grid grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={`bl-${i}`} className="w-3 h-3 rounded-full bg-gray-600 shadow-inner" />
              ))}
            </div>
            {/* Warning stripes */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-[repeating-linear-gradient(-45deg,#f59e0b_0,#f59e0b_20px,#111827_20px,#111827_40px)] opacity-60" />
            {/* Handle */}
            <div className="absolute top-1/2 left-8 -translate-y-1/2 w-4 h-32 bg-gray-500 rounded-full shadow-lg" />
            {/* Horizontal beams */}
            <div className="absolute top-1/3 left-0 right-0 h-1 bg-gray-600/50" />
            <div className="absolute top-2/3 left-0 right-0 h-1 bg-gray-600/50" />
            {/* Text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-6xl sm:text-8xl font-black text-gray-600/40 tracking-tighter select-none">
                GSE
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ─── TRUST BADGES ───
function TrustBar() {
  const badges = [
    { icon: Shield, text: 'Certifié EN 9100', sub: 'Norme aéronautique' },
    { icon: Award, text: 'Directive 2006/42/CE', sub: 'Conformité machines' },
    { icon: Truck, text: 'Livraison mondiale', sub: 'Fret aéronautique' },
    { icon: Phone, text: 'Support technique', sub: '+33 4 42 02 96 74' },
  ]

  return (
    <div className="bg-gray-900/80 border-y border-gray-800">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((b, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-900/30 border border-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <b.icon className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wide">{b.text}</p>
                <p className="text-[10px] text-gray-500">{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── MARKETING STATS ───
const STATS = [
  { value: '30+', label: 'Années d\'expertise', icon: Clock },
  { value: '50+', label: 'Pays livrés', icon: Globe },
  { value: '500+', label: 'Clients satisfaits', icon: Users },
  { value: '100%', label: 'Made in France', icon: Star },
]

// ─── MARKETING FEATURES ───
const FEATURES = [
  {
    icon: Target,
    title: 'Précision Aéronautique',
    description: 'Chaque équipement est usiné avec une tolérance de ±0.1mm, garantissant une parfaite compatibilité avec votre flotte.',
  },
  {
    icon: Shield,
    title: 'Certifications Internationales',
    description: 'EN 9100, ISO 9001, Directive Machines 2006/42/CE — Nos produits répondent aux normes les plus strictes.',
  },
  {
    icon: Wrench,
    title: 'Bureau d\'Études Intégré',
    description: 'Notre équipe d\'ingénieurs conçoit des solutions sur-mesure adaptées à vos besoins opérationnels spécifiques.',
  },
  {
    icon: Zap,
    title: 'Réactivité Garantie',
    description: 'Délais de fabrication optimisés et support technique disponible 24/7 pour les urgences opérationnelles.',
  },
]

// ─── MAIN PAGE ───
export default function BoutiquePage() {
  const router = useRouter()

  const handleCatalogueClick = () => {
    router.push('/boutique/catalogue')
  }

  return (
    <>
      <SEO
        title="LLEDO Aerotools — Outillage Aéronautique Certifié"
        description="Leader français de l'outillage aéronautique certifié : barres de remorquage, rollers hydrauliques et GSE pour hélicoptères Airbus, NH90, Super Puma, Gazelle."
      />

      <div className="min-h-screen bg-gray-950 text-white">
        {/* ═══ HERO — HANGAR OPENING ═══ */}
        <HangarDoors />

        {/* ═══ TRUST BAR ═══ */}
        <TrustBar />

        {/* ═══ MARKETING SECTION — WHY LLEDO ═══ */}
        <section className="relative py-20 sm:py-32 overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
            <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px]" />
            <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[120px]" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-bold uppercase tracking-widest text-blue-400 mb-6"
              >
                <Star className="h-3 w-3" />
                Leader Français depuis 1994
              </motion.span>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight mb-6">
                <span className="text-white">L'excellence </span>
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  aéronautique
                </span>
                <br />
                <span className="text-white">à votre service</span>
              </h2>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
              >
                LLEDO Aerotools conçoit et fabrique en France des équipements de manutention hélicoptère 
                reconnus par les plus grandes forces armées et opérateurs civils du monde entier.
              </motion.p>
            </motion.div>

            {/* Stats grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
            >
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-600/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
                  <div className="relative bg-gray-900/50 border border-gray-800 rounded-2xl p-6 text-center hover:border-blue-500/30 transition-colors">
                    <stat.icon className="h-6 w-6 text-blue-400 mx-auto mb-3" />
                    <p className="text-3xl sm:text-4xl font-black text-white mb-1">{stat.value}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Features grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-20">
              {FEATURES.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex gap-5 p-6 bg-gray-900/30 border border-gray-800/50 rounded-2xl hover:border-gray-700 transition-colors">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ═══ BIG CTA BUTTON ═══ */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-center"
            >
              <motion.button
                onClick={handleCatalogueClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center gap-4 px-12 py-6 sm:px-16 sm:py-8 overflow-hidden"
              >
                {/* Button background with gradient animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-2xl" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Animated shine effect */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-shine" />
                </div>

                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />

                {/* Button content */}
                <span className="relative text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
                  Accéder au Catalogue
                </span>
                <ArrowRight className="relative h-6 w-6 sm:h-8 sm:w-8 text-white group-hover:translate-x-2 transition-transform duration-300" />
              </motion.button>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="mt-6 text-sm text-gray-500"
              >
                <CheckCircle className="inline h-4 w-4 text-green-500 mr-2" />
                Plus de 50 références disponibles — Devis en ligne instantané
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* ═══ CTA SECTION — CUSTOM EQUIPMENT ═══ */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />

          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Zap className="h-10 w-10 text-amber-400 mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-4 text-white">
                Besoin d'un équipement sur mesure ?
              </h2>
              <p className="text-blue-200/70 max-w-xl mx-auto mb-8">
                Notre bureau d'études conçoit des outillages spécifiques pour votre flotte. Contactez notre équipe pour une étude personnalisée.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-xl font-black uppercase tracking-wider text-sm hover:bg-blue-50 transition-colors shadow-xl"
                >
                  Demander un devis
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/aerotools"
                  className="inline-flex items-center gap-2 px-6 py-4 border border-blue-400/30 text-blue-300 rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-blue-800/30 transition-colors"
                >
                  <Award className="h-4 w-4" />
                  Voir nos certifications
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}
