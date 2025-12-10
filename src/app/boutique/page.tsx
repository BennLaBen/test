'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
import { products, Product } from '@/data/aerotools-products'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ArrowRight, Activity, Box, Info, Filter, X, ChevronDown, Wind, Lock, Unlock } from 'lucide-react'
import { useQuote } from '@/contexts/QuoteContext'

// --- COMPOSANTS VISUELS ---

const HelicopterIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 10h18" />
    <path d="M12 10v3" />
    <path d="M4 15h13a3 3 0 0 0 3-3v-2" />
    <path d="M7 18h10" />
    <path d="M7 15v3" />
    <path d="M17 15v3" />
    <path d="M2 12h5" />
    <path d="M2 10v4" />
    <path d="M12 13a3 3 0 0 0-3 3v2h6v-2a3 3 0 0 0-3-3z" />
  </svg>
)

const categories = [
  { id: 'all', label: 'TOUS LES ÉQUIPEMENTS', icon: Box },
  { id: 'towing', label: 'BARRES DE REMORQUAGE', icon: HelicopterIcon },
  { id: 'handling', label: 'ROLLERS & MANUTENTION', icon: Activity },
]

const models = Array.from(new Set(products.flatMap(p => p.compatibility))).sort()

export default function BoutiquePage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeModel, setActiveModel] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { itemCount } = useQuote()
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Gestion du scroll pour la séquence Hangar
  const { scrollY } = useScroll()
  
  // Séquence d'animation
  // 0 - 500px : Ouverture des portes
  // 500 - 1000px : Avancée dans le hangar (Zoom)
  
  // Portes
  const doorGap = useTransform(scrollY, [0, 500], ['0%', '100%']) // Les portes s'écartent
  const doorOpacity = useTransform(scrollY, [400, 600], [1, 0]) // Elles disparaissent une fois ouvertes
  
  // Hélicoptère
  const heliScale = useTransform(scrollY, [0, 800], [1, 3]) // Il grossit (on s'approche)
  const heliY = useTransform(scrollY, [0, 800], [0, 200]) // Il descend légèrement
  const heliOpacity = useTransform(scrollY, [600, 900], [1, 0]) // Il disparaît quand on le dépasse
  
  // Contenu Boutique (Le fond du hangar)
  const shopScale = useTransform(scrollY, [0, 1000], [0.8, 1]) // Le fond grandit (on s'approche)
  const shopOpacity = useTransform(scrollY, [0, 400], [0.5, 1]) // Il devient net
  const shopBlur = useTransform(scrollY, [0, 500], ['10px', '0px']) // Le flou disparaît

  // Indicateurs HUD
  const lockOpacity = useTransform(scrollY, [0, 100], [1, 0])
  const unlockOpacity = useTransform(scrollY, [0, 100], [0, 1])

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory
    const matchesModel = activeModel ? product.compatibility.includes(activeModel) : true
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.compatibility.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesModel && matchesSearch
  })

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-950 text-white selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* --- SÉQUENCE D'INTRODUCTION HANGAR (FIXED) --- */}
      <div className="fixed inset-0 h-screen w-full z-0 overflow-hidden pointer-events-none">
        
        {/* Fond du Hangar (visible derrière les portes) */}
        <motion.div 
          className="absolute inset-0 bg-gray-900 flex items-center justify-center"
          style={{ scale: shopScale, opacity: shopOpacity, filter: `blur(${shopBlur})` }}
        >
           {/* Grille de perspective sol/plafond */}
           <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
           <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-transparent to-gray-950" />
           
           {/* Lumières du hangar (s'intensifient au scroll) */}
           <motion.div 
             className="absolute top-0 left-1/4 w-2 h-full bg-blue-500/30 blur-2xl"
             style={{ opacity: useTransform(scrollY, [200, 600], [0, 0.5]) }}
           />
           <motion.div 
             className="absolute top-0 right-1/4 w-2 h-full bg-blue-500/30 blur-2xl"
             style={{ opacity: useTransform(scrollY, [200, 600], [0, 0.5]) }}
           />
           <motion.div 
             className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-white/20 blur-xl"
             style={{ opacity: useTransform(scrollY, [300, 700], [0, 0.3]) }}
           />
        </motion.div>

        {/* HÉLICOPTÈRE RÉALISTE (Au centre) */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center z-10"
          style={{ scale: heliScale, y: heliY, opacity: heliOpacity }}
        >
           {/* Taille augmentée pour plus d'impact */}
           <div className="relative w-[90vw] max-w-[1000px] h-[60vh] max-h-[600px]">
              {/* Ombre au sol */}
              <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[70%] h-[15%] bg-black/80 blur-3xl rounded-[100%]" />
              
              {/* IMAGE HÉLICOPTÈRE */}
              <div className="relative w-full h-full">
                 <Image 
                   src="/images/aerotools/helicopter-hero.png"
                   alt="Hélicoptère H160"
                   fill
                   className="object-contain drop-shadow-2xl"
                   style={{ filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.5))' }}
                   priority
                 />
                 
                 {/* Effet Rotor Principal (CSS Blur) */}
                 <div className="absolute top-[10%] left-[10%] w-[80%] h-[10%] bg-white/5 blur-md rounded-[100%] animate-pulse" />
                 <div className="absolute top-[10%] left-[10%] w-[80%] h-[5%] bg-gradient-to-r from-transparent via-white/30 to-transparent blur-sm animate-spin-slow" />
              </div>

              {/* Particules de poussière (supprimé pour plus de réalisme) */}
           </div>
        </motion.div>

        {/* PORTES DU HANGAR (Premier plan) */}
        <motion.div 
           className="absolute inset-y-0 left-0 w-1/2 bg-[#0a0a0a] z-20 border-r-4 border-gray-800 flex items-center justify-end pr-8"
           style={{ x: useTransform(doorGap, (v) => `-${v}`), opacity: doorOpacity }}
        >
           {/* Texture Porte Gauche */}
           <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
           <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-black/50 to-transparent" />
           
           {/* Marquages Porte */}
           <div className="flex flex-col items-end gap-4 opacity-50">
              <div className="h-32 w-2 bg-yellow-500/50 rounded-full" />
              <h2 className="text-6xl font-black text-gray-800 rotate-90 origin-bottom-right translate-x-12">HANGAR 01</h2>
           </div>
        </motion.div>

        <motion.div 
           className="absolute inset-y-0 right-0 w-1/2 bg-[#0a0a0a] z-20 border-l-4 border-gray-800 flex items-center justify-start pl-8"
           style={{ x: doorGap, opacity: doorOpacity }}
        >
           {/* Texture Porte Droite */}
           <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
           <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-black/50 to-transparent" />
           
           {/* Marquages Porte */}
           <div className="flex flex-col items-start gap-4 opacity-50">
              <div className="h-32 w-2 bg-yellow-500/50 rounded-full" />
              <div className="text-xs font-mono text-gray-600 border border-gray-700 p-2 rounded">
                 AUTHORIZED PERSONNEL ONLY<br/>
                 ZONE SECURITEE 4
              </div>
           </div>
        </motion.div>

        {/* UI OVERLAY (Reste fixe au début) */}
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
           {/* Message Initial "ACCÈS HANGAR" */}
           <motion.div style={{ opacity: useTransform(scrollY, [0, 200], [1, 0]) }} className="text-center">
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }} 
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-8 inline-block"
              >
                 <div className="relative">
                    <Lock className="w-16 h-16 text-red-500/80" />
                    <motion.div style={{ opacity: unlockOpacity }} className="absolute inset-0"><Unlock className="w-16 h-16 text-green-500" /></motion.div>
                 </div>
              </motion.div>
              <h1 className="text-5xl font-black text-white uppercase tracking-widest mb-2" style={{ textShadow: '0 0 20px rgba(255,255,255,0.5)' }}>
                 ACCÈS HANGAR
              </h1>
              <p className="text-blue-400 font-mono text-sm tracking-[0.5em] animate-pulse">SCROLLEZ POUR OUVRIR</p>
           </motion.div>

           {/* Message "ACCÈS AUTORISÉ" (apparaît quand portes s'ouvrent) */}
           <motion.div 
             style={{ opacity: useTransform(scrollY, [150, 350, 600, 800], [0, 1, 1, 0]) }}
             className="absolute text-center"
           >
              <div className="flex items-center gap-4 px-8 py-4 bg-green-500/10 border border-green-500/50 rounded-xl backdrop-blur-md">
                 <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                 <span className="text-green-400 font-mono text-lg uppercase tracking-widest">Accès Autorisé</span>
              </div>
           </motion.div>
        </div>

      </div>

      {/* ESPACE VIDE POUR LE SCROLL (Créer la hauteur nécessaire à l'animation) */}
      <div className="h-[120vh]" /> 

      {/* --- CONTENU BOUTIQUE (Apparaît après le scroll) --- */}
      <motion.section 
        className="relative z-40 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-t border-blue-400/30 px-4 sm:px-6 lg:px-8 py-16 min-h-screen"
        style={{ 
          boxShadow: '0 -50px 100px rgba(15, 23, 42, 1), 0 0 50px rgba(59, 130, 246, 0.2)' 
        }}
      >
        {/* Ligne lumineuse d'entrée ANIMÉE */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        {/* Particules Lumineuses d'Ambiance */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           {[...Array(15)].map((_, i) => (
             <motion.div
               key={i}
               className="absolute w-1 h-1 bg-blue-300 rounded-full"
               style={{
                 left: `${Math.random() * 100}%`,
                 top: `${Math.random() * 100}%`,
               }}
               animate={{
                 y: [0, -30, 0],
                 opacity: [0.3, 0.8, 0.3],
                 scale: [1, 1.5, 1]
               }}
               transition={{
                 duration: 3 + Math.random() * 2,
                 repeat: Infinity,
                 delay: Math.random() * 5,
               }}
             />
           ))}
        </div>

        {/* Grille lumineuse en arrière-plan (plus visible) */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 invert-[0.1]" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-purple-500/5" />
        
        <div className="container mx-auto relative z-10">
          
          {/* === COCKPIT DE COMMANDE (Filtres) === */}
          <div className="sticky top-24 z-40 mb-12">
            <div className="relative bg-gradient-to-br from-slate-800/90 via-slate-800/90 to-blue-900/30 backdrop-blur-xl border border-blue-400/30 rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.2)] ring-1 ring-blue-400/20 overflow-hidden">
              
              {/* Scan line animée */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-300/10 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />

              {/* Ligne 1 : Recherche + Reset */}
              <div className="p-4 border-b border-blue-400/20 flex gap-4 relative z-10">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-blue-300" />
                  </div>
                  <input
                    type="text"
                    placeholder="RECHERCHER (EX: BARRE H160, ROLLER...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-blue-400/30 rounded-xl text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40 focus:bg-slate-700/80 transition-all uppercase font-mono text-sm shadow-inner"
                  />
                </div>
                {(activeModel || activeCategory !== 'all' || searchQuery) && (
                  <button
                    onClick={() => {setSearchQuery(''); setActiveCategory('all'); setActiveModel(null)}}
                    className="px-4 py-3 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/50 text-red-300 hover:from-red-500/30 hover:to-red-600/30 hover:border-red-400 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-2 shadow-lg shadow-red-500/20"
                  >
                    <X className="h-4 w-4" /> Reset
                  </button>
                )}
              </div>

              {/* Ligne 2 : Catégories (Tabs Principaux) */}
              <div className="flex border-b border-blue-400/20 bg-gradient-to-r from-slate-800/50 via-slate-700/50 to-slate-800/50 relative z-10">
                {categories.map((cat) => {
                  const Icon = cat.icon
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 relative overflow-hidden ${
                        activeCategory === cat.id
                          ? 'border-cyan-400 text-cyan-300 bg-cyan-900/20'
                          : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {activeCategory === cat.id && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-cyan-300/10 to-cyan-400/5"
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                      <Icon className="h-4 w-4 relative z-10" />
                      <span className="hidden sm:inline relative z-10">{cat.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Ligne 3 : Appareils Compatibles (Grille visible) */}
              <div className="p-4 bg-slate-800/30 relative z-10">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Activity className="h-3 w-3 text-cyan-400" />
                  Filtrer par appareil compatible
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveModel(null)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all border relative overflow-hidden ${
                      activeModel === null
                        ? 'bg-cyan-600 border-cyan-400 text-white shadow-lg shadow-cyan-500/20'
                        : 'bg-slate-700 border-white/5 text-slate-400 hover:bg-slate-600 hover:text-white hover:border-white/10'
                    }`}
                  >
                    {activeModel === null && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                    <span className="relative z-10">Tous</span>
                  </button>
                  {models.map((model) => (
                    <button
                      key={model}
                      onClick={() => setActiveModel(activeModel === model ? null : model)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all border relative overflow-hidden ${
                        activeModel === model
                          ? 'bg-cyan-600 border-cyan-400 text-white shadow-lg shadow-cyan-500/20'
                          : 'bg-slate-700 border-white/5 text-slate-400 hover:bg-slate-600 hover:text-white hover:border-white/10'
                      }`}
                    >
                      {activeModel === model && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                      <span className="relative z-10">{model}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Grille des Équipements */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <AnimatePresence mode='popLayout'>
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </AnimatePresence>
          </div>

          {filteredProducts.length === 0 && (
             <div className="py-32 text-center">
               <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-800 mb-6">
                 <Info className="h-10 w-10 text-gray-500" />
               </div>
               <h3 className="text-2xl font-black text-white uppercase mb-2">Aucun équipement détecté</h3>
               <p className="text-gray-500 mb-8">Modifiez vos paramètres de recherche pour scanner à nouveau.</p>
               <button 
                 onClick={() => {setSearchQuery(''); setActiveCategory('all'); setActiveModel(null)}}
                 className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg uppercase transition-colors"
               >
                 Réinitialiser les senseurs
               </button>
             </div>
          )}

        </div>
      </motion.section>
    </div>
  )
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const categoryColors = {
    towing: 'from-blue-500/10 to-cyan-500/10',
    handling: 'from-purple-500/10 to-pink-500/10',
    maintenance: 'from-green-500/10 to-emerald-500/10'
  }
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`group relative h-full bg-gradient-to-br ${categoryColors[product.category as keyof typeof categoryColors]} bg-slate-800/50 border-2 border-slate-700/50 rounded-2xl overflow-hidden hover:border-blue-400 transition-all duration-300 hover:shadow-[0_0_50px_rgba(59,130,246,0.2)] flex flex-col backdrop-blur-sm`}
    >
      {/* Scan Line Holographique */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent pointer-events-none"
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      {/* Image / Preview */}
      <div className="relative h-64 bg-gradient-to-br from-slate-800 to-slate-900 p-8 flex items-center justify-center overflow-hidden border-b-2 border-blue-400/20">
         {/* Fond Tech */}
         <div className="absolute inset-0 opacity-[0.05] bg-[url('/grid.svg')] scale-150 transition-transform duration-1000 group-hover:scale-125 invert-[0.1]" />
         <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 via-transparent to-transparent" />
         
         {/* Cercle HUD animé avec GLOW */}
         <div className="absolute w-48 h-48 rounded-full border-2 border-blue-400/20 group-hover:border-blue-400/50 group-hover:scale-110 transition-all duration-700 shadow-[0_0_30px_rgba(59,130,246,0.1)]" />
         <div className="absolute w-40 h-40 rounded-full border border-blue-400/10 border-dashed animate-[spin_20s_linear_infinite] group-hover:border-blue-400/30" />

         {/* Icon Placeholder - HELICOPTERE SUR CARTE */}
         <div className="relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2">
            {product.category === 'towing' ? 
              <div className="relative">
                <HelicopterIcon className="h-32 w-32 text-slate-400 group-hover:text-blue-400 transition-colors duration-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
                {/* Rotor anim au survol */}
                <div className="absolute -top-2 left-4 w-24 h-1 bg-blue-400/0 group-hover:bg-blue-400/50 blur-sm transition-all group-hover:animate-[spin_0.1s_linear_infinite] shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
              </div>
              : 
              <Box className="h-24 w-24 text-slate-400 group-hover:text-purple-400 transition-colors duration-500 drop-shadow-[0_0_15px_rgba(147,51,234,0.3)]" /> 
            }
         </div>

         {/* Badges Compatibilité avec GLOW */}
         <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5">
            {product.compatibility.slice(0, 3).map((comp, i) => (
              <span key={i} className="px-2 py-1 bg-slate-800/80 backdrop-blur border border-slate-600/50 rounded text-[9px] font-bold uppercase text-slate-300 group-hover:text-white group-hover:border-blue-400/50 transition-colors shadow-sm">
                {comp}
              </span>
            ))}
         </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 relative bg-gradient-to-b from-slate-800/30 to-slate-900/50">
        <div className="mb-4">
           <div className="flex justify-between items-start mb-2">
             <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1">
               {product.category === 'towing' ? 'TOWING SYSTEM' : 'HANDLING UNIT'}
               <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" />
             </span>
             <Activity className="h-3 w-3 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
           </div>
           <h3 className="text-xl font-black uppercase text-white leading-tight group-hover:text-blue-300 transition-colors">
             {product.name}
           </h3>
        </div>

        {/* Specs Mini avec GRADIENTS */}
        <div className="space-y-2 mb-6 mt-auto">
           {Object.entries(product.specs).slice(0, 2).map(([k, v]) => (
             <div key={k} className="flex justify-between items-center text-[10px] border-b border-slate-700/50 pb-1">
               <span className="text-slate-400 uppercase font-bold">{k}</span>
               <span className="text-slate-200 font-bold font-mono bg-slate-700/50 px-2 py-0.5 rounded">{v}</span>
             </div>
           ))}
        </div>

        {/* Action avec GLOW */}
        <div className="pt-2 flex items-center justify-between group/btn border-t border-slate-700/50">
           <span className="text-xs font-mono text-slate-500 group-hover:text-blue-300 transition-colors">
             ID: {product.id}
           </span>
           <Link href={`/boutique/${product.id}`} className="relative overflow-hidden flex items-center gap-2 text-xs font-black uppercase text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all px-4 py-2 rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]">
             <span className="relative z-10 flex items-center gap-2">
               Analyser <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
             </span>
             {/* Shine Effect */}
             <motion.div
               className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
               animate={{ x: ['-100%', '200%'] }}
               transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
             />
           </Link>
        </div>
      </div>
    </motion.div>
  )
}
