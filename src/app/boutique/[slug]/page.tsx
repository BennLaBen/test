'use client'

import { useParams } from 'next/navigation'
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { getProductBySlug, getRelatedProducts, getBoughtTogether } from '@/lib/shop/data'
import { useQuote } from '@/contexts/QuoteContext'
import {
  Check, Shield, ShoppingBag, FileText, ChevronRight, ChevronDown, ChevronLeft,
  Package, Phone, Clock, Award, Truck, MessageSquare, ArrowRight,
  Box, Zap, Activity, Download, Users, Ruler, Layers, ZoomIn, X, Eye, EyeOff
} from 'lucide-react'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/shop/Breadcrumbs'
import { ProductCard } from '@/components/shop/ProductCard'

const HELICOPTER_IMAGES: Record<string, string> = {
  H160: '/images/aerotools/helicopter-hero.png',
  H175: '/images/aerotools/helicopter-hero1.png',
  NH90: '/images/aerotools/helicopter-hero2.png',
  'Super Puma': '/images/aerotools/helicopter-hero1.png',
  Cougar: '/images/aerotools/helicopter-hero1.png',
  Caracal: '/images/aerotools/helicopter-hero1.png',
  AS332: '/images/aerotools/helicopter-hero1.png',
  EC225: '/images/aerotools/helicopter-hero1.png',
  H215: '/images/aerotools/helicopter-hero1.png',
  Gazelle: '/images/aerotools/helicopter-hero.png',
  SA341: '/images/aerotools/helicopter-hero.png',
  SA342: '/images/aerotools/helicopter-hero.png',
  H125: '/images/aerotools/helicopter-hero2.png',
  AS350: '/images/aerotools/helicopter-hero2.png',
  AS355: '/images/aerotools/helicopter-hero2.png',
  Ecureuil: '/images/aerotools/helicopter-hero2.png',
  H130: '/images/aerotools/helicopter-hero2.png',
  EC130: '/images/aerotools/helicopter-hero2.png',
  Universel: '/images/aerotools/helicopter-hero.png',
}

/* ═══════════════════════════════════════════
   CATEGORY MAP
   ═══════════════════════════════════════════ */
const catLabel: Record<string, string> = {
  towing: 'Remorquage', handling: 'Manutention', maintenance: 'Maintenance', gse: 'GSE',
}

/* ═══════════════════════════════════════════
   FAQ ACCORDION
   ═══════════════════════════════════════════ */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-800 last:border-0">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full py-4 text-left group">
        <span className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors pr-4">{q}</span>
        <ChevronDown className={`h-4 w-4 text-gray-500 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-gray-400 pb-4 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ═══════════════════════════════════════════
   DATA TABLE (specs, tolerances, materials)
   ═══════════════════════════════════════════ */
function DataTable({ data, icon, title }: { data: Record<string, string>; icon: React.ReactNode; title: string }) {
  return (
    <div className="bg-gray-800/20 border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-800 bg-gray-800/40">
        {icon}
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">{title}</h3>
      </div>
      <table className="w-full">
        <tbody>
          {Object.entries(data).map(([key, value], i) => (
            <tr key={key} className={i % 2 === 0 ? 'bg-gray-800/10' : ''}>
              <td className="px-5 py-3 text-xs text-gray-500 uppercase tracking-wider font-medium w-2/5 align-top">{key}</td>
              <td className="px-5 py-3 text-sm text-white font-mono">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ═══════════════════════════════════════════
   PRODUCT GALLERY — Hero hélico + carrousel + avant/après
   ═══════════════════════════════════════════ */
function ProductGallery({ product }: { product: any }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const [showEquipped, setShowEquipped] = useState(false)

  const heliImage = product.compatibility?.[0] ? HELICOPTER_IMAGES[product.compatibility[0]] : null
  const allImages = [product.image, ...(product.gallery || [])].filter(Boolean)
  const hasGallery = allImages.length > 1

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % allImages.length)
  }, [allImages.length])

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + allImages.length) % allImages.length)
  }, [allImages.length])

  return (
    <div className="space-y-4">
      {/* ── HERO: Hélicoptère + overlay équipement ── */}
      {heliImage && (
        <div className="relative aspect-[16/10] rounded-2xl border border-gray-700/50 overflow-hidden group bg-gradient-to-br from-gray-800/80 to-gray-900/80">
          {/* Helicopter background */}
          <Image
            src={heliImage}
            alt={`Hélicoptère ${product.compatibility[0]}`}
            fill
            className={`object-cover transition-all duration-700 ${showEquipped ? 'brightness-50 scale-105' : 'brightness-75'}`}
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />

          {/* Equipment overlay when toggled */}
          <AnimatePresence>
            {showEquipped && product.image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="absolute inset-0 flex items-center justify-center z-10"
              >
                <div className="relative w-[80%] h-[60%] drop-shadow-[0_0_30px_rgba(59,130,246,0.4)]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain filter brightness-110"
                    sizes="(max-width: 1024px) 80vw, 40vw"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* HUD corners */}
          <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-blue-500/40 z-20" />
          <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-blue-500/40 z-20" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-blue-500/40 z-20" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-blue-500/40 z-20" />

          {/* Toggle button */}
          <button
            onClick={() => setShowEquipped(!showEquipped)}
            className="absolute top-4 right-14 z-20 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-sm border border-gray-600/50 rounded-lg text-[10px] font-bold uppercase tracking-wider text-white hover:bg-black/80 transition-all"
          >
            {showEquipped ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showEquipped ? 'Masquer' : 'Voir équipé'}
          </button>

          {/* Label overlay */}
          <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end z-20">
            <div>
              <p className="text-[10px] font-mono text-white/50 uppercase tracking-widest">
                {showEquipped ? 'CONFIGURATION ÉQUIPÉE' : 'APPAREIL COMPATIBLE'}
              </p>
              <p className="text-sm font-black text-white uppercase tracking-wider">
                Airbus {product.compatibility[0]}
              </p>
            </div>
            <span className="font-mono text-[10px] text-white/40">REF {product.id}</span>
          </div>

          {/* Scan effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/5 to-transparent translate-y-full group-hover:translate-y-[-100%] transition-transform duration-[2500ms] z-10" />
        </div>
      )}

      {/* ── CARROUSEL: Photos équipement ── */}
      {allImages.length > 0 && (
        <div className="relative">
          {/* Main image */}
          <div
            className="relative aspect-[4/3] bg-gray-800/30 rounded-2xl border border-gray-700/50 overflow-hidden cursor-pointer group"
            onClick={() => setZoomed(true)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Image
                  src={allImages[activeIndex]}
                  alt={`${product.name} — vue ${activeIndex + 1}`}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </motion.div>
            </AnimatePresence>

            {/* Zoom hint */}
            <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-black/40 backdrop-blur-sm rounded-lg text-[10px] text-white/60 opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="h-3 w-3" />
              Agrandir
            </div>

            {/* Counter */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-[10px] font-mono text-white/70">
              {activeIndex + 1} / {allImages.length}
            </div>

            {/* Navigation arrows */}
            {hasGallery && (
              <>
                <button onClick={(e) => { e.stopPropagation(); goPrev() }} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/70 backdrop-blur-sm rounded-full text-white transition-all">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); goNext() }} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/70 backdrop-blur-sm rounded-full text-white transition-all">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {hasGallery && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    i === activeIndex
                      ? 'border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                      : 'border-gray-700/50 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Vue ${i + 1}`} fill className="object-contain p-1" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Fallback if no helicopter image and no gallery */}
      {!heliImage && allImages.length === 0 && (
        <div className="relative aspect-[4/3] bg-gray-800/30 rounded-2xl border border-gray-700/50 overflow-hidden flex items-center justify-center">
          <Box className="h-40 w-40 text-gray-700" />
        </div>
      )}

      {/* Compliance badges */}
      <div className="flex flex-wrap gap-2">
        {(product.certifications || ['CE', 'EN 9100']).map((cert: string, i: number) => (
          <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800/40 border border-gray-700/50 rounded-lg">
            <Shield className="h-3 w-3 text-green-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{cert}</span>
          </div>
        ))}
      </div>

      {/* ── ZOOM LIGHTBOX ── */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center"
            onClick={() => setZoomed(false)}
          >
            <button className="absolute top-6 right-6 p-3 text-white/60 hover:text-white transition-colors">
              <X className="h-6 w-6" />
            </button>

            <div className="relative w-[90vw] h-[80vh]">
              <Image
                src={allImages[activeIndex]}
                alt={product.name}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>

            {/* Nav in lightbox */}
            {hasGallery && (
              <>
                <button onClick={(e) => { e.stopPropagation(); goPrev() }} className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all">
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); goNext() }} className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all">
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActiveIndex(i) }}
                  className={`w-2 h-2 rounded-full transition-all ${i === activeIndex ? 'bg-blue-500 w-6' : 'bg-white/30 hover:bg-white/60'}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function ProductDetailPage() {
  const params = useParams()
  const { addItem } = useQuote()
  const [added, setAdded] = useState(false)

  const product = getProductBySlug(params.slug as string)

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="text-center">
          <h1 className="text-5xl font-black mb-4 text-gray-700">404</h1>
          <p className="text-gray-500 mb-6">Référence introuvable dans le catalogue.</p>
          <Link href="/boutique/catalogue" className="text-blue-400 hover:text-blue-300 text-sm font-bold uppercase tracking-wider">
            Retour au catalogue
          </Link>
        </div>
      </div>
    )
  }

  const related = getRelatedProducts(product)
  const boughtTogether = getBoughtTogether(product)

  const handleAddToQuote = () => {
    addItem({ ...product, price_display: product.priceDisplay } as any)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-28 pb-20">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
        <div className="absolute right-0 top-0 w-1/2 h-full bg-blue-900/5 blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">

        {/* ─── BREADCRUMBS ─── */}
        <div className="mb-8">
          <Breadcrumbs items={[
            { label: 'Catalogue', href: '/boutique/catalogue' },
            { label: catLabel[product.category] || product.category, href: `/boutique/catalogue?cat=${product.category}` },
            { label: product.name },
          ]} />
        </div>

        {/* ═══════════════════════════════════════
            SECTION 1 — HERO : VISUAL + INFO + CTA
           ═══════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16">

          {/* ── LEFT: ENHANCED GALLERY ── */}
          <ProductGallery product={product} />

          {/* ── RIGHT: PRODUCT INFO ── */}
          <div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

              {/* Badges row */}
              <div className="flex items-center gap-2 flex-wrap mb-4">
                {product.isNew && (
                  <span className="px-2.5 py-1 bg-green-600/20 border border-green-500/30 text-green-400 text-[10px] font-bold uppercase tracking-wider rounded-md">
                    Nouveau
                  </span>
                )}
                <span className="px-2.5 py-1 bg-gray-800 border border-gray-700 text-gray-400 text-[10px] font-bold uppercase tracking-wider rounded-md">
                  {catLabel[product.category] || product.category}
                </span>
                <span className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  product.inStock
                    ? 'bg-green-900/20 border border-green-500/20 text-green-400'
                    : 'bg-amber-900/20 border border-amber-500/20 text-amber-400'
                }`}>
                  {product.inStock ? <Activity className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                  {product.inStock ? 'Disponible' : 'Sur commande'}
                </span>
              </div>

              {/* Reference */}
              <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-2">
                Réf. {product.id}
              </p>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black uppercase text-white mb-5 leading-[1.1] tracking-tight">
                {product.name}
              </h1>

              {/* Description */}
              <p className="text-base text-gray-400 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Compatibility chips */}
              <div className="mb-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2">Appareils compatibles</p>
                <div className="flex flex-wrap gap-1.5">
                  {product.compatibility.map((c, i) => (
                    <span key={i} className="px-2.5 py-1 bg-blue-900/20 border border-blue-500/20 text-blue-300 text-xs font-bold uppercase rounded-md">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Standards */}
              {product.standards && product.standards.length > 0 && (
                <div className="mb-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2">Normes &amp; standards applicables</p>
                  <div className="flex flex-wrap gap-1.5">
                    {product.standards.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 bg-gray-800/60 border border-gray-700/50 text-gray-400 text-[10px] font-bold uppercase tracking-wider rounded-md">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick info strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 p-4 bg-gray-800/20 border border-gray-800 rounded-xl">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-600 uppercase">Délai</p>
                    <p className="text-xs font-bold text-gray-300">{product.leadTime || '4–8 semaines'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-600 uppercase">Garantie</p>
                    <p className="text-xs font-bold text-gray-300">{product.warranty || '24 mois'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-600 uppercase">Qté min.</p>
                    <p className="text-xs font-bold text-gray-300">{product.minOrder || 1} unité</p>
                  </div>
                </div>
              </div>

              {/* ── PRIMARY CTA ── */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={handleAddToQuote}
                  className={`w-full flex items-center justify-center gap-3 px-8 py-4 text-sm font-black uppercase tracking-wider rounded-xl transition-all ${
                    added
                      ? 'bg-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                      : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:scale-[1.01]'
                  }`}
                >
                  {added ? (
                    <><Check className="h-5 w-5" /> Ajouté à votre liste de devis</>
                  ) : (
                    <><ShoppingBag className="h-5 w-5" /> Ajouter à la demande de devis</>
                  )}
                </button>

                {/* Secondary CTAs */}
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/contact"
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white hover:border-gray-600 transition-all"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    Contacter un expert
                  </Link>
                  <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white hover:border-gray-600 transition-all">
                    <Download className="h-3.5 w-3.5" />
                    Fiche technique PDF
                  </button>
                </div>
              </div>

              {/* View cart link */}
              <Link href="/boutique/panier" className="flex items-center justify-center gap-1 text-[10px] text-gray-600 hover:text-blue-400 uppercase tracking-widest transition-colors">
                Voir ma liste de devis <ChevronRight className="h-3 w-3" />
              </Link>

            </motion.div>
          </div>
        </div>

        {/* ═══════════════════════════════════════
            SECTION 2 — SPECS / APPLICATIONS / MATERIALS
           ═══════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          {/* Specs table */}
          <DataTable
            data={product.specs}
            icon={<Zap className="h-4 w-4 text-blue-400" />}
            title="Spécifications techniques"
          />

          {/* Tolerances */}
          {product.tolerances && Object.keys(product.tolerances).length > 0 && (
            <DataTable
              data={product.tolerances}
              icon={<Ruler className="h-4 w-4 text-cyan-400" />}
              title="Tolérances &amp; performances"
            />
          )}

          {/* Materials */}
          {product.materials && Object.keys(product.materials).length > 0 && (
            <DataTable
              data={product.materials}
              icon={<Layers className="h-4 w-4 text-amber-400" />}
              title="Matériaux &amp; traitements"
            />
          )}

          {/* Applications */}
          {product.applications && product.applications.length > 0 && (
            <div className="bg-gray-800/20 border border-gray-800 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-800 bg-gray-800/40">
                <Users className="h-4 w-4 text-purple-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Applications</h3>
              </div>
              <ul className="p-5 space-y-3">
                {product.applications.map((app, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">{app}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Features list (always present) */}
        <div className="mb-16">
          <h2 className="text-lg font-black uppercase tracking-tight text-white mb-5 flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-400" />
            Caractéristiques clés
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {product.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 bg-gray-800/20 border border-gray-800 rounded-xl">
                <div className="w-6 h-6 rounded-md bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                  <Check className="h-3.5 w-3.5 text-blue-400" />
                </div>
                <span className="text-sm text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════
            SECTION 3 — BOUGHT TOGETHER
           ═══════════════════════════════════════ */}
        {boughtTogether.length > 0 && (
          <div className="mb-16">
            <h2 className="text-lg font-black uppercase tracking-tight text-white mb-5 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-cyan-400" />
              Souvent commandé ensemble
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {boughtTogether.map((p, idx) => (
                <ProductCard key={p.id} product={p} index={idx} />
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════
            SECTION 4 — FAQ + POLICIES
           ═══════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* FAQ */}
          {product.faq && product.faq.length > 0 && (
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight text-white mb-5 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-400" />
                Questions fréquentes
              </h2>
              <div className="bg-gray-800/20 border border-gray-800 rounded-xl p-5">
                {product.faq.map((item, i) => (
                  <FaqItem key={i} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          )}

          {/* Policies */}
          <div>
            <h2 className="text-lg font-black uppercase tracking-tight text-white mb-5 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-400" />
              Informations pratiques
            </h2>
            <div className="bg-gray-800/20 border border-gray-800 rounded-xl divide-y divide-gray-800">
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-4 w-4 text-blue-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">Délais de livraison</h4>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Délai standard : <strong className="text-gray-300">{product.leadTime || '4 à 8 semaines'}</strong> après validation de commande.
                  Livraison France métropolitaine et export. Fret aéronautique sur demande.
                </p>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-blue-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">Garantie constructeur</h4>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  <strong className="text-gray-300">{product.warranty || '24 mois'}</strong> pièces et main-d&apos;œuvre.
                  Couverture étendue disponible. SAV et pièces détachées garantis 10 ans.
                </p>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-blue-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">Politique retour B2B</h4>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Retour accepté sous 30 jours pour les produits catalogue, en état neuf et emballage d&apos;origine.
                  Les produits sur mesure ne sont pas éligibles au retour. Contactez le service commercial.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════
            SECTION 5 — RELATED PRODUCTS
           ═══════════════════════════════════════ */}
        {related.length > 0 && (
          <div className="mb-16">
            <h2 className="text-lg font-black uppercase tracking-tight text-white mb-5">
              Équipements associés
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((p, idx) => (
                <ProductCard key={p.id} product={p} index={idx} />
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════
            SECTION 6 — BOTTOM CTA BAR
           ═══════════════════════════════════════ */}
        <div className="bg-gradient-to-r from-blue-950/80 to-blue-900/80 border border-blue-500/20 rounded-2xl p-8 sm:p-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1">
                Besoin d&apos;une configuration spécifique ?
              </h3>
              <p className="text-sm text-blue-200/60">
                Notre bureau d&apos;études adapte chaque équipement à vos contraintes opérationnelles.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-blue-50 transition-colors"
              >
                Demander un devis personnalisé
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="tel:+33442029674"
                className="inline-flex items-center gap-2 px-6 py-3 border border-blue-400/30 text-blue-300 rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-blue-800/30 transition-colors"
              >
                <Phone className="h-4 w-4" />
                +33 4 42 02 96 74
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
