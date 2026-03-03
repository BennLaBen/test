'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Shield,
  Wrench,
  Truck,
  Plane,
  Cog,
  RotateCw,
  ChevronDown,
} from 'lucide-react'
import { useMouseParallax } from '@/lib/shop/useMouseParallax'

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
   1. IMMERSIVE WELCOME — quick zoom-in reveal
   Reduced scroll height for faster flow
   ═══════════════════════════════════════════════ */
function ImmersiveWelcome() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const mouse = useMouseParallax(1.2)

  const bgX = useTransform(mouse.x, (v) => -v * 1.5)
  const bgY = useTransform(mouse.y, (v) => -v * 1.5)
  const bgRotX = useTransform(mouse.rotateX, (v) => v * 0.3)
  const bgRotY = useTransform(mouse.rotateY, (v) => v * 0.3)
  const textX = useTransform(mouse.x, (v) => v * 0.5)
  const textY = useTransform(mouse.y, (v) => v * 0.5)

  const titleScale = useTransform(scrollYProgress, [0, 0.4, 0.7], [0.4, 1, 1.6])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.15, 0.55, 0.75], [0, 1, 1, 0])
  const subtitleOpacity = useTransform(scrollYProgress, [0.2, 0.35, 0.55, 0.7], [0, 1, 1, 0])
  const subtitleY = useTransform(scrollYProgress, [0.2, 0.4], [40, 0])
  const bgScale = useTransform(scrollYProgress, [0, 0.8], [1.15, 1.4])
  const bgBrightness = useTransform(scrollYProgress, [0, 0.3, 0.7], [0.15, 0.35, 0.05])
  const overlayOpacity = useTransform(scrollYProgress, [0.65, 1], [0, 1])
  const bgOverlayOpacity = useTransform(bgBrightness, (v) => 1 - v)
  const hintOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])

  return (
    <div ref={ref} className="relative h-[180vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-gray-950" style={{ perspective: '1200px' }}>
        <motion.div
          className="absolute inset-0"
          style={{ scale: bgScale, x: bgX, y: bgY, rotateX: bgRotX, rotateY: bgRotY }}
        >
          <Image
            src="/images/aerotools/hangar/hangar-welcome.png"
            alt="Intérieur hangar"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <motion.div className="absolute inset-0 bg-gray-950" style={{ opacity: bgOverlayOpacity }} />
        </motion.div>

        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4"
          style={{ x: textX, y: textY }}
        >
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
        </motion.div>

        <motion.div className="absolute inset-0 bg-gray-950 z-30 pointer-events-none" style={{ opacity: overlayOpacity }} />

        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-blue-400/50">Scroll</span>
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
  const mouse = useMouseParallax(0.8)

  const carouselRotX = useTransform(mouse.rotateX, (v) => v * 0.5)
  const carouselRotY = useTransform(mouse.rotateY, (v) => v * 0.3)

  // 3 panels → translate from 0% to -200%
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-200%'])

  // Smooth 3D depth transitions between panels
  const rotateY = useTransform(scrollYProgress,
    [0, 0.12, 0.33, 0.45, 0.66, 0.78, 1],
    [0, -4, 0, -4, 0, -4, 0]
  )
  const panelScale = useTransform(scrollYProgress,
    [0, 0.12, 0.33, 0.45, 0.66, 0.78, 1],
    [1, 0.92, 1, 0.92, 1, 0.92, 1]
  )
  const panelZ = useTransform(scrollYProgress,
    [0, 0.12, 0.33, 0.45, 0.66, 0.78, 1],
    [0, -100, 0, -100, 0, -100, 0]
  )

  const activeIndex = useTransform(scrollYProgress, (v) =>
    Math.min(2, Math.floor(v * 3))
  )

  return (
    <div ref={ref} className="relative h-[280vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-gray-950" style={{ perspective: '1200px', perspectiveOrigin: '50% 50%' }}>
        <motion.div
          style={{
            x,
            rotateY,
            scale: panelScale,
            z: panelZ,
            rotateX: carouselRotX,
          }}
          className="flex h-full w-[300vw]"
        >
          {showcases.map((product, idx) => (
            <ProductPanel
              key={product.id}
              product={product}
              index={idx}
              scrollProgress={scrollYProgress}
              mouse={mouse}
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
        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-gray-950 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-gray-950 to-transparent z-20 pointer-events-none" />
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

/* ─── Single full-viewport product panel with mouse parallax ─── */
function ProductPanel({
  product,
  index,
  scrollProgress,
  mouse,
}: {
  product: (typeof showcases)[0]
  index: number
  scrollProgress: MotionValue<number>
  mouse: ReturnType<typeof useMouseParallax>
}) {
  const Icon = product.icon
  const a = product.accent

  // Each panel occupies 1/3 of scroll
  const start = index / 3
  const end = (index + 1) / 3
  const mid = (start + end) / 2

  // Smoother content animations
  const contentOpacity = useTransform(
    scrollProgress,
    [start, start + 0.04, mid, end - 0.04, end],
    [0, 1, 1, 1, index === 2 ? 1 : 0]
  )
  const contentY = useTransform(scrollProgress, [start, start + 0.06], [60, 0])
  const imageScale = useTransform(scrollProgress, [start, mid, end], [1.1, 1, 0.95])
  const imageX = useTransform(scrollProgress, [start, start + 0.08], [80, 0])

  // Mouse parallax for background (walking in hangar feel)
  const bgParallaxX = useTransform(mouse.x, (v) => -v * 0.8)
  const bgParallaxY = useTransform(mouse.y, (v) => -v * 0.6)

  return (
    <div className="relative w-screen h-full flex-shrink-0">
      {/* Background image with mouse parallax */}
      <motion.div className="absolute inset-0" style={{ scale: imageScale, x: bgParallaxX, y: bgParallaxY }}>
        <Image
          src={product.bgImage}
          alt={product.title}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gray-950/70" />
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

                <motion.div
                  className="absolute inset-0 z-10 pointer-events-none"
                  style={{
                    background: `linear-gradient(to bottom, transparent 0%, ${a.from}12 50%, transparent 100%)`,
                  }}
                  animate={{ y: ['-100%', '200%'] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                />

                <div className="absolute top-5 left-5 z-20">
                  <span className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-white bg-gradient-to-r ${a.gradient} rounded-md shadow-lg`}>
                    {product.subtitle}
                  </span>
                </div>

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

      <div
        className="absolute bottom-0 left-0 right-0 h-px z-20"
        style={{ background: `linear-gradient(90deg, transparent, ${a.from}40, transparent)` }}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════════
   MAIN EXPORT — Direct flow to catalogue
   ═══════════════════════════════════════════════ */
export function HangarInterior() {
  return (
    <div className="relative bg-gray-950">
      <ImmersiveWelcome />
      <HorizontalShowcase />
    </div>
  )
}
