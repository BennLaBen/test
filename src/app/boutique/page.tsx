'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Shield, Award, Truck, Phone, ChevronDown, ArrowRight, Zap, CheckCircle } from 'lucide-react'
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

// ─── ANIMATED TEXT SECTIONS DATA ───
const STORY_SECTIONS = [
  {
    text: 'LLEDO Aerotools est la référence mondiale en outillage de manutention pour hélicoptères.',
    highlight: 'référence mondiale',
  },
  {
    text: 'Chaque pièce est conçue, usinée et assemblée en France avec une exigence de qualité absolue.',
    highlight: 'qualité absolue',
  },
  {
    text: 'Nos équipements sont certifiés aux plus hauts standards internationaux : EN 9100, ISO 9001, Directive Machines 2006/42/CE.',
    highlight: 'plus hauts standards internationaux',
  },
  {
    text: 'Les forces armées et opérateurs civils de plus de 50 pays nous font confiance pour la sécurité de leurs flottes.',
    highlight: 'plus de 50 pays',
  },
  {
    text: 'Livraison mondiale, support technique dédié, délais optimisés — nous garantissons une réactivité sans faille.',
    highlight: 'réactivité sans faille',
  },
]

// ─── MAIN PAGE ───
export default function BoutiquePage() {
  const router = useRouter()
  const storyRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress: storyProgress } = useScroll({
    target: storyRef,
    offset: ['start end', 'end start'],
  })

  const lineHeight = useTransform(storyProgress, [0.1, 0.9], ['0%', '100%'])

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

        {/* ═══ STORY SECTION — TEXT-ONLY WITH SCROLL ANIMATIONS ═══ */}
        <section ref={storyRef} className="relative py-24 sm:py-40 overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-600/[0.03] rounded-full blur-[200px]" />
            <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-cyan-600/[0.03] rounded-full blur-[180px]" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            {/* Animated vertical line */}
            <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px bg-gray-800/50 hidden lg:block">
              <motion.div
                className="w-full bg-gradient-to-b from-blue-500 via-cyan-400 to-blue-500 origin-top"
                style={{ height: lineHeight }}
              />
            </div>

            <div className="max-w-4xl mx-auto space-y-24 sm:space-y-32">
              {/* Opening statement */}
              <motion.div
                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="text-center"
              >
                <motion.p
                  initial={{ opacity: 0, letterSpacing: '0.3em' }}
                  whileInView={{ opacity: 1, letterSpacing: '0.2em' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.2 }}
                  className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-blue-400 mb-8"
                >
                  L'excellence n'est pas une option
                </motion.p>
                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tight leading-[0.95]">
                  <motion.span
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="block text-white"
                  >
                    Le meilleur
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent"
                  >
                    outillage aéronautique
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="block text-white"
                  >
                    au monde.
                  </motion.span>
                </h2>
              </motion.div>

              {/* Story text blocks — each reveals on scroll */}
              {STORY_SECTIONS.map((section, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 80, filter: 'blur(8px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{
                    duration: 0.9,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.1,
                  }}
                  className={`text-center ${i % 2 === 0 ? 'lg:text-left lg:pr-24' : 'lg:text-right lg:pl-24'}`}
                >
                  <p className="text-xl sm:text-2xl lg:text-3xl font-medium text-gray-300 leading-relaxed">
                    {section.text.split(section.highlight).map((part, j, arr) => (
                      <span key={j}>
                        {part}
                        {j < arr.length - 1 && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="font-black text-white"
                            style={{ textShadow: '0 0 30px rgba(59, 130, 246, 0.4)' }}
                          >
                            {section.highlight}
                          </motion.span>
                        )}
                      </span>
                    ))}
                  </p>

                  {/* Subtle separator dot */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className={`mt-8 ${i % 2 === 0 ? 'lg:text-left' : 'lg:text-right'} text-center`}
                  >
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                  </motion.div>
                </motion.div>
              ))}

              {/* ═══ FINAL CTA — VOIR CATALOGUE ═══ */}
              <motion.div
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="text-center pt-8"
              >
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="text-lg sm:text-xl text-gray-500 mb-10 font-light"
                >
                  Découvrez notre catalogue complet d'équipements certifiés.
                </motion.p>

                <motion.button
                  onClick={handleCatalogueClick}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative inline-flex items-center gap-4 px-14 py-7 sm:px-20 sm:py-8 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-2xl" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-shine" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />

                  <span className="relative text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
                    Voir le Catalogue
                  </span>
                  <ArrowRight className="relative h-6 w-6 sm:h-8 sm:w-8 text-white group-hover:translate-x-2 transition-transform duration-300" />
                </motion.button>
              </motion.div>
            </div>
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
