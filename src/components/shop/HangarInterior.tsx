'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Play,
  Shield,
  Wrench,
  Truck,
  Plane,
  Cog,
  RotateCw,
  ChevronDown,
} from 'lucide-react'

/* ═══════════════════════════════════════════════
   PRODUCT DATA
   ═══════════════════════════════════════════════ */
const showcases = [
  {
    id: 'towing',
    icon: Truck,
    title: 'Barres de Remorquage',
    subtitle: 'TOWING BARS',
    description:
      'Conçues pour la manutention sécurisée de vos hélicoptères sur piste et en hangar. Fusible de cisaillement calibré, verrouillage double sécurité, amortisseur de chocs.',
    features: ['Verrouillage double sécurité', 'Fusible de cisaillement', 'Roues pivotantes HD', 'Certification CE / EN 12312'],
    bgImage: '/images/aerotools/hangar/panel-towing-bg.png',
    productImage: '/images/aerotools/hangar/product-towing.png',
    accent: { from: '#3b82f6', to: '#1d4ed8', text: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/10', gradient: 'from-blue-500 to-blue-700' },
  },
  {
    id: 'handling',
    icon: RotateCw,
    title: 'Rollers Hydrauliques',
    subtitle: 'HYDRAULIC ROLLERS',
    description:
      "Systèmes de levage et déplacement pour hélicoptères sur patins. Levage hydraulique, frein de parc positif et adaptation rapide — l'outil indispensable.",
    features: ['Levage hydraulique intégré', 'Frein de parc positif', 'Garde au sol réglable', 'Polyuréthane anti-trace'],
    bgImage: '/images/aerotools/hangar/panel-rollers-bg.png',
    productImage: '/images/aerotools/hangar/panel-rollers-bg.png',
    accent: { from: '#06b6d4', to: '#0e7490', text: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10', gradient: 'from-cyan-500 to-cyan-700' },
  },
  {
    id: 'maintenance',
    icon: Wrench,
    title: 'Équipements de Maintenance',
    subtitle: 'MAINTENANCE GSE',
    description:
      "Bâches de protection, berceaux moteurs, dispositifs de calage et équipements sur-mesure conçus par notre bureau d'études.",
    features: ['Bâches sur-mesure', 'Berceaux moteur certifiés', 'Dispositifs de calage', "Bureau d'études dédié"],
    bgImage: '/images/aerotools/hangar/hangar-welcome.png',
    productImage: '',
    accent: { from: '#f59e0b', to: '#d97706', text: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10', gradient: 'from-amber-500 to-amber-700' },
  },
]

/* ═══════════════════════════════════════════════
   1. IMMERSIVE WELCOME — sticky pinned zoom-in
   Scroll drives: scale, opacity, blur, perspective
   ═══════════════════════════════════════════════ */
function ImmersiveWelcome() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Phase 1: text zooms in from tiny (0→0.4)
  // Phase 2: text holds then fades (0.4→0.7)
  // Phase 3: transition to black (0.7→1)
  const titleScale = useTransform(scrollYProgress, [0, 0.35, 0.6], [0.3, 1, 1.8])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.1, 0.5, 0.7], [0, 1, 1, 0])
  const subtitleOpacity = useTransform(scrollYProgress, [0.15, 0.3, 0.5, 0.65], [0, 1, 1, 0])
  const subtitleY = useTransform(scrollYProgress, [0.15, 0.35], [60, 0])
  const bgScale = useTransform(scrollYProgress, [0, 0.7], [1.2, 1.6])
  const bgBrightness = useTransform(scrollYProgress, [0, 0.3, 0.7], [0.15, 0.35, 0.05])
  const overlayOpacity = useTransform(scrollYProgress, [0.6, 1], [0, 1])
  const gridOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 0.06])

  // Parallax floor perspective
  const floorY = useTransform(scrollYProgress, [0, 1], ['60%', '30%'])

  // Scroll hint
  const hintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0])

  return (
    <div ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-gray-950">
        {/* BG image with zoom */}
        <motion.div className="absolute inset-0" style={{ scale: bgScale }}>
          <Image
            src="/images/aerotools/hangar/hangar-welcome.png"
            alt="Intérieur hangar"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <motion.div
            className="absolute inset-0 bg-gray-950"
            style={{ opacity: useTransform(bgBrightness, (v) => 1 - v) }}
          />
        </motion.div>

        {/* Perspective grid floor — reveals as you scroll */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-[60%] pointer-events-none"
          style={{ opacity: gridOpacity, top: floorY }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(90deg, rgba(59,130,246,0.4) 1px, transparent 1px), linear-gradient(rgba(59,130,246,0.2) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
              transform: 'perspective(500px) rotateX(65deg)',
              transformOrigin: 'center top',
            }}
          />
        </motion.div>

        {/* Ceiling light beams */}
        <div className="absolute top-0 inset-x-0 flex justify-around pointer-events-none z-10">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-px h-40"
              style={{
                opacity: useTransform(scrollYProgress, [0.2, 0.4], [0, 0.4]),
                background: 'linear-gradient(to bottom, rgba(59,130,246,0.5), transparent)',
              }}
            />
          ))}
        </div>

        {/* Main text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4">
          <motion.div style={{ scale: titleScale, opacity: titleOpacity }} className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6 backdrop-blur-sm">
              <Plane className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
                Bienvenue dans le hangar
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-none">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(59,130,246,0.4)]">
                NOS SOLUTIONS
              </span>
            </h2>
          </motion.div>

          <motion.p
            style={{ opacity: subtitleOpacity, y: subtitleY }}
            className="text-gray-400 max-w-2xl text-center text-base sm:text-lg mt-6 leading-relaxed"
          >
            Ergonomie, efficacité, sécurité — chaque produit LLEDO Aerotools est conçu
            pour optimiser vos opérations au sol et en maintenance.
          </motion.p>
        </div>

        {/* Black overlay for transition out */}
        <motion.div
          className="absolute inset-0 bg-gray-950 z-30 pointer-events-none"
          style={{ opacity: overlayOpacity }}
        />

        {/* Scroll hint */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-blue-400/50">
            Scroll
          </span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className="h-5 w-5 text-blue-400/40" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   2. HORIZONTAL PRODUCT CAROUSEL
   Vertical scroll → horizontal slide through 3
   full-viewport product panels (Vizcom-style)
   ═══════════════════════════════════════════════ */
function HorizontalShowcase() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  // 3 panels → translate from 0% to -200% (each panel = 100vw)
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-200%'])

  // Progress dots
  const activeIndex = useTransform(scrollYProgress, (v) =>
    Math.min(2, Math.floor(v * 3))
  )

  return (
    <div ref={ref} className="relative h-[400vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-gray-950">
        {/* Horizontal sliding container */}
        <motion.div style={{ x }} className="flex h-full w-[300vw]">
          {showcases.map((product, idx) => (
            <ProductPanel
              key={product.id}
              product={product}
              index={idx}
              scrollProgress={scrollYProgress}
            />
          ))}
        </motion.div>

        {/* Progress indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
          {showcases.map((_, i) => (
            <ProgressDot key={i} index={i} activeIndex={activeIndex} />
          ))}
        </div>

        {/* Side gradient masks */}
        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-gray-950 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-gray-950 to-transparent z-20 pointer-events-none" />
      </div>
    </div>
  )
}

function ProgressDot({ index, activeIndex }: { index: number; activeIndex: MotionValue<number> }) {
  const isActive = useTransform(activeIndex, (v) => (v === index ? 1 : 0))
  const width = useTransform(isActive, [0, 1], [8, 32])
  const opacity = useTransform(isActive, [0, 1], [0.3, 1])

  return (
    <motion.div
      className="h-2 rounded-full bg-blue-400"
      style={{ width, opacity }}
    />
  )
}

/* ─── Single full-viewport product panel ─── */
function ProductPanel({
  product,
  index,
  scrollProgress,
}: {
  product: (typeof showcases)[0]
  index: number
  scrollProgress: MotionValue<number>
}) {
  const Icon = product.icon
  const a = product.accent

  // Each panel occupies 1/3 of scroll: [i/3, (i+1)/3]
  const start = index / 3
  const end = (index + 1) / 3
  const mid = (start + end) / 2

  // Content animations within this panel's scroll range
  const contentOpacity = useTransform(
    scrollProgress,
    [start, start + 0.05, mid, end - 0.05, end],
    [0, 1, 1, 1, index === 2 ? 1 : 0]
  )
  const contentY = useTransform(
    scrollProgress,
    [start, start + 0.08],
    [80, 0]
  )
  const imageScale = useTransform(
    scrollProgress,
    [start, mid, end],
    [1.15, 1, 0.95]
  )
  const imageX = useTransform(
    scrollProgress,
    [start, start + 0.1],
    [100, 0]
  )

  return (
    <div className="relative w-screen h-full flex-shrink-0">
      {/* Background image */}
      <motion.div className="absolute inset-0" style={{ scale: imageScale }}>
        <Image
          src={product.bgImage}
          alt={product.title}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gray-950/75" />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 30% 50%, ${a.from}10 0%, transparent 70%)`,
          }}
        />
      </motion.div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            `linear-gradient(90deg, ${a.from}40 1px, transparent 1px), linear-gradient(${a.from}20 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Content */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 h-full flex items-center"
      >
        <div className="container mx-auto px-6 sm:px-12 lg:px-20">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Text side */}
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              {/* Category tag */}
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-11 h-11 rounded-xl ${a.bg} ${a.border} border flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${a.text}`} />
                </div>
                <span className={`text-[11px] font-black uppercase tracking-[0.25em] ${a.text}`}>
                  {product.subtitle}
                </span>
              </div>

              <h3 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white uppercase tracking-tight leading-[0.95] mb-5">
                {product.title}
              </h3>

              <p className="text-gray-400 text-sm sm:text-base lg:text-lg leading-relaxed mb-8 max-w-lg">
                {product.description}
              </p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-8">
                {product.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <Shield className={`h-4 w-4 ${a.text} mt-0.5 flex-shrink-0`} />
                    <span className="text-xs sm:text-sm text-gray-300 font-medium">{feat}</span>
                  </div>
                ))}
              </div>

              <Link
                href="#catalogue"
                className={`inline-flex items-center gap-2.5 px-7 py-3.5 ${a.bg} border ${a.border} rounded-xl ${a.text} text-sm font-bold uppercase tracking-wider hover:brightness-125 transition-all group`}
              >
                Voir les produits
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>

            {/* Image card side */}
            <motion.div style={{ x: imageX }} className="w-full lg:w-1/2 order-1 lg:order-2">
              <div
                className={`relative aspect-[4/3] rounded-2xl overflow-hidden border ${a.border}`}
                style={{ boxShadow: `0 0 80px ${a.from}15` }}
              >
                {/* HUD corners */}
                <div className={`absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 ${a.border} z-10`} />
                <div className={`absolute top-3 right-3 w-8 h-8 border-r-2 border-t-2 ${a.border} z-10`} />
                <div className={`absolute bottom-3 left-3 w-8 h-8 border-l-2 border-b-2 ${a.border} z-10`} />
                <div className={`absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 ${a.border} z-10`} />

                {product.productImage ? (
                  <Image
                    src={product.productImage}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-900" />
                )}

                {/* Scan line */}
                <motion.div
                  className="absolute inset-0 z-10 pointer-events-none"
                  style={{
                    background: `linear-gradient(to bottom, transparent 0%, ${a.from}12 50%, transparent 100%)`,
                  }}
                  animate={{ y: ['-100%', '200%'] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                />

                {/* Badge */}
                <div className="absolute top-5 left-5 z-20">
                  <span className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-white bg-gradient-to-r ${a.gradient} rounded-md shadow-lg`}>
                    {product.subtitle}
                  </span>
                </div>

                {/* Placeholder if no product image */}
                {!product.productImage && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center">
                      <Cog className={`h-14 w-14 ${a.text} opacity-20 mx-auto mb-2`} />
                      <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                        Photo produit
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Accent line at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px z-20"
        style={{ background: `linear-gradient(90deg, transparent, ${a.from}40, transparent)` }}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════════
   3. VIDEO SECTION — cinematic scale-up
   Card starts small, scales to full viewport
   ═══════════════════════════════════════════════ */
function VideoSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  })

  const scale = useTransform(scrollYProgress, [0, 0.8], [0.6, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])
  const borderRadius = useTransform(scrollYProgress, [0, 0.8], [40, 16])
  const textY = useTransform(scrollYProgress, [0.3, 0.7], [40, 0])

  return (
    <div ref={ref} className="relative py-20 sm:py-32 bg-gray-950">
      <div className="container mx-auto px-4">
        {/* Title */}
        <motion.div style={{ opacity, y: textY }} className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-blue-400/60 mb-4 block">
            En action
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4">
            Découvrez nos{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              équipements
            </span>
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Vidéo de présentation de notre gamme d&apos;outillage aéronautique certifié.
          </p>
        </motion.div>

        {/* Video card — scales up from small */}
        <motion.div
          style={{ scale, opacity, borderRadius }}
          className="relative mx-auto max-w-6xl overflow-hidden border border-blue-500/20 bg-gray-900"
        >
          <div className="relative aspect-video">
            {/* Grid bg */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />

            {/* Play button */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <motion.div
                className="relative mb-6 cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 blur-3xl bg-blue-500/20 rounded-full scale-[2.5]" />
                <motion.div
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-600/80 backdrop-blur-sm border-2 border-blue-400/40 flex items-center justify-center"
                  animate={{
                    boxShadow: [
                      '0 0 40px rgba(59,130,246,0.3)',
                      '0 0 70px rgba(59,130,246,0.6)',
                      '0 0 40px rgba(59,130,246,0.3)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Play className="h-8 w-8 sm:h-10 sm:w-10 text-white ml-1" />
                </motion.div>
              </motion.div>
              <p className="text-blue-300/50 text-sm font-medium tracking-wide">
                Vidéo de présentation à venir
              </p>
            </div>

            {/* Edge accents */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   4. CATALOGUE CTA — dramatic reveal
   ═══════════════════════════════════════════════ */
function CatalogueCTA() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  })

  const scale = useTransform(scrollYProgress, [0, 0.6], [0.85, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1])
  const y = useTransform(scrollYProgress, [0, 0.6], [60, 0])

  return (
    <div ref={ref} className="relative py-20 sm:py-28 bg-gray-950">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          style={{ scale, opacity, y }}
          className="relative max-w-4xl mx-auto p-10 sm:p-16 rounded-3xl overflow-hidden border border-blue-500/20"
        >
          {/* BG layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/60 via-gray-900/90 to-cyan-950/40" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />
          {/* Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-500/5 rounded-full blur-[100px]" />

          <div className="relative z-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="mx-auto mb-8 w-16 h-16 rounded-full border border-blue-500/30 flex items-center justify-center"
            >
              <Cog className="h-8 w-8 text-blue-400" />
            </motion.div>

            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white mb-5">
              Explorez le catalogue{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                complet
              </span>
            </h3>
            <p className="text-gray-400 max-w-xl mx-auto mb-10 text-sm sm:text-base leading-relaxed">
              Barres de remorquage, rollers hydrauliques, équipements GSE — filtrez par
              hélicoptère et trouvez l&apos;outillage adapté à votre flotte.
            </p>

            <Link
              href="#catalogue"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-gray-900 rounded-2xl font-black uppercase tracking-wider text-sm hover:bg-blue-50 transition-all shadow-2xl hover:shadow-[0_0_60px_rgba(255,255,255,0.25)]"
            >
              Accéder au catalogue
              <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════ */
export function HangarInterior() {
  return (
    <div className="relative bg-gray-950">
      <ImmersiveWelcome />
      <HorizontalShowcase />
      <VideoSection />
      <CatalogueCTA />
    </div>
  )
}
