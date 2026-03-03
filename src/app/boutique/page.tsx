'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Shield, Award, Truck, Phone, ChevronDown, X, ArrowRight, Zap, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SEO } from '@/components/SEO'
import { getCategoryCounts, getHelicopters, getProductsByHelicopter } from '@/lib/shop/data'
import { useProducts } from '@/lib/shop/useProducts'
import { ProductCard } from '@/components/shop/ProductCard'
import { CategoryFilter } from '@/components/shop/CategoryFilter'

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

// ─── HELICOPTER FAMILIES ───
const HELI_FAMILIES: { label: string; prefixes: string[] }[] = [
  { label: 'Airbus Helicopters', prefixes: ['H1', 'H2', 'AS', 'EC', 'DAUPHIN', 'ECUREUIL', 'PANTHER', 'SUPER PUMA', 'CARACAL', 'COUGAR', 'GAZELLE'] },
  { label: 'Leonardo', prefixes: ['AW'] },
  { label: 'NH Industries', prefixes: ['NH'] },
  { label: 'Sikorsky', prefixes: ['S7', 'S9', 'UH', 'BLACK'] },
  { label: 'Bell', prefixes: ['BELL', '2', '4', '5'] },
  { label: 'Puma / SA', prefixes: ['SA', 'PUMA'] },
]

function groupHelicoptersByFamily(helicopters: { id: string; name: string; count: number }[]) {
  const groups: { label: string; items: typeof helicopters }[] = []
  const used = new Set<string>()

  for (const family of HELI_FAMILIES) {
    const items = helicopters.filter(h => {
      const upper = h.name.toUpperCase()
      return family.prefixes.some(p => upper.startsWith(p))
    })
    if (items.length > 0) {
      items.forEach(i => used.add(i.id))
      groups.push({ label: family.label, items })
    }
  }

  const others = helicopters.filter(h => !used.has(h.id))
  if (others.length > 0) {
    groups.push({ label: 'Autres', items: others })
  }

  return groups
}

function HelicopterSelector({
  helicopters,
  active,
  totalCount,
  onSelect,
}: {
  helicopters: { id: string; name: string; count: number }[]
  active: string
  totalCount: number
  onSelect: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  const groups = groupHelicoptersByFamily(helicopters)

  const filteredGroups = search
    ? groups.map(g => ({
        ...g,
        items: g.items.filter(h => h.name.toLowerCase().includes(search.toLowerCase())),
      })).filter(g => g.items.length > 0)
    : groups

  const activeName = active === 'all'
    ? `Tous les hélicoptères (${totalCount})`
    : helicopters.find(h => h.id === active)?.name || active

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-8"
      ref={ref}
    >
      <p className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">
        Sélectionnez votre hélicoptère
      </p>

      {/* Dropdown trigger */}
      <div className="relative max-w-md">
        <button
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl text-sm font-bold transition-all ${
            active !== 'all'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
              : 'bg-gray-800/60 text-white border border-gray-700 hover:border-gray-600'
          }`}
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M12 19l-7-7 3-3 4 4 8-8 3 3-11 11z" />
              <circle cx="5" cy="8" r="1.5" />
            </svg>
            <span className="uppercase tracking-wider truncate">{activeName}</span>
          </div>
          <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown panel */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden"
            >
              {/* Search */}
              <div className="p-3 border-b border-gray-800">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Rechercher un hélicoptère..."
                    autoFocus
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-800/80 border border-gray-700 rounded-lg text-xs text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-colors"
                  />
                  {search && (
                    <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Options */}
              <div className="max-h-72 overflow-y-auto overscroll-contain">
                {/* "Tous" option */}
                <button
                  onClick={() => { onSelect('all'); setOpen(false); setSearch('') }}
                  className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${
                    active === 'all'
                      ? 'bg-blue-600/20 text-blue-400'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span>Tous les hélicoptères</span>
                  <span className="text-gray-600 font-mono">{totalCount}</span>
                </button>

                {/* Grouped helicopters */}
                {filteredGroups.map(group => (
                  <div key={group.label}>
                    <div className="px-4 py-2 bg-gray-800/40 border-y border-gray-800/60">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{group.label}</span>
                    </div>
                    {group.items.map(h => (
                      <button
                        key={h.id}
                        onClick={() => { onSelect(h.id); setOpen(false); setSearch('') }}
                        className={`w-full text-left px-4 py-2.5 text-xs transition-colors flex items-center justify-between ${
                          active === h.id
                            ? 'bg-blue-600/20 text-blue-400 font-bold'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        <span className="uppercase tracking-wider">{h.name}</span>
                        <span className="text-gray-600 font-mono text-[10px]">{h.count}</span>
                      </button>
                    ))}
                  </div>
                ))}

                {filteredGroups.length === 0 && (
                  <div className="px-4 py-6 text-center text-xs text-gray-600">
                    Aucun hélicoptère trouvé
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active filter chip (when not "all") */}
      {active !== 'all' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/10 border border-blue-500/20 rounded-lg"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
            Filtré : {activeName}
          </span>
          <button
            onClick={() => onSelect('all')}
            className="text-blue-500/50 hover:text-blue-300 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}

// ─── MAIN PAGE ───
export default function BoutiquePage() {
  const { t } = useTranslation('common')
  const { products } = useProducts()
  const [activeHelicopter, setActiveHelicopter] = useState('all')
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)

  const helicopters = getHelicopters(products)
  const baseProducts = getProductsByHelicopter(activeHelicopter, products)
  const categoryCounts = getCategoryCounts(baseProducts)

  const filteredProducts = baseProducts.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.compatibility.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <>
      <SEO
        title="AEROTOOL by LLEDO — Outillage Aéronautique Certifié"
        description="Catalogue d'outillage aéronautique certifié : barres de remorquage, rollers hydrauliques et GSE pour hélicoptères Airbus, NH90, Super Puma, Gazelle."
      />

      <div className="min-h-screen bg-gray-950 text-white">
        {/* ═══ HERO — HANGAR OPENING ═══ */}
        <HangarDoors />

        {/* ═══ TRUST BAR ═══ */}
        <TrustBar />

        {/* ═══ CATALOGUE SECTION ═══ */}
        <section id="catalogue" className="relative py-16 sm:py-24">
          {/* Background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-900/80 to-transparent" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-blue-400/60 mb-4 block">
                Catalogue produits
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4">
                <span className="text-white">Équipements </span>
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">certifiés</span>
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto">
                Chaque produit est conçu et fabriqué en France, conforme aux normes aéronautiques les plus exigeantes.
              </p>
            </motion.div>

            {/* ═══ HELICOPTER FILTER ═══ */}
            <HelicopterSelector
              helicopters={helicopters}
              active={activeHelicopter}
              totalCount={products.length}
              onSelect={(id) => { setActiveHelicopter(id); setActiveCategory('all') }}
            />

            {/* Toolbar: Category + Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10"
            >
              <CategoryFilter
                active={activeCategory}
                onChange={setActiveCategory}
                counts={categoryCounts}
              />

              {/* Search toggle */}
              <div className="relative">
                <AnimatePresence>
                  {searchOpen ? (
                    <motion.div
                      initial={{ width: 40, opacity: 0.5 }}
                      animate={{ width: 280, opacity: 1 }}
                      exit={{ width: 40, opacity: 0 }}
                      className="flex items-center bg-gray-800/60 border border-gray-700 rounded-xl overflow-hidden"
                    >
                      <Search className="h-4 w-4 text-gray-400 ml-3 flex-shrink-0" />
                      <input
                        type="text"
                        autoFocus
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher un produit, hélicoptère..."
                        className="w-full px-3 py-2.5 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
                      />
                      <button
                        onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                        className="p-2 text-gray-500 hover:text-white flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setSearchOpen(true)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-400 hover:text-white hover:border-gray-600 transition-all text-xs font-bold uppercase tracking-wider"
                    >
                      <Search className="h-4 w-4" />
                      <span className="hidden sm:inline">Rechercher</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>

            {/* Empty state */}
            {filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Search className="h-12 w-12 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-400 text-lg font-medium mb-2">Aucun produit trouvé</p>
                <p className="text-gray-600 text-sm">Essayez un autre terme ou changez de catégorie.</p>
              </motion.div>
            )}
          </div>
        </section>

        {/* ═══ CTA SECTION ═══ */}
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
                  <FileText className="h-4 w-4" />
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
