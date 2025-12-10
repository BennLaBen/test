'use client'

import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { products } from '@/data/aerotools-products'
import { useQuote } from '@/contexts/QuoteContext'
import { ArrowLeft, Check, Shield, Zap, Box, ShoppingBag, FileText, ChevronRight, Activity } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

// Custom Helicopter Icon Component
const HelicopterIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 10h18" /> {/* Rotor */}
    <path d="M12 10v3" /> {/* Axe */}
    <path d="M4 15h13a3 3 0 0 0 3-3v-2" /> {/* Queue et Corps haut */}
    <path d="M7 18h10" /> {/* Patin bas */}
    <path d="M7 15v3" /> {/* Jambe patin avant */}
    <path d="M17 15v3" /> {/* Jambe patin arrière */}
    <path d="M2 12h5" /> {/* Rotor queue gauche */}
    <path d="M2 10v4" /> {/* Rotor queue vertical */}
    <path d="M12 13a3 3 0 0 0-3 3v2h6v-2a3 3 0 0 0-3-3z" /> {/* Cockpit vitre */}
  </svg>
)

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useQuote()
  const [added, setAdded] = useState(false)
  
  const product = products.find(p => p.id === params.slug)

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">ERREUR 404</h1>
          <p className="text-gray-400 mb-8">Système non trouvé dans la base de données.</p>
          <Link href="/boutique" className="text-blue-400 hover:text-blue-300 underline">Retour au catalogue</Link>
        </div>
      </div>
    )
  }

  const handleAddToQuote = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white selection:bg-blue-500/30 overflow-x-hidden pt-20">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="absolute right-0 top-0 w-1/2 h-full bg-blue-900/5 blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Breadcrumb / Back */}
        <button 
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-sm uppercase tracking-wider">Retour à la base</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column: Visuals */}
          <div className="relative">
             {/* Main Image Container style Blueprint */}
             <div className="relative aspect-square bg-gray-800/30 rounded-2xl border border-blue-500/30 overflow-hidden group">
                {/* HUD Corners */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-blue-500/50" />
                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-blue-500/50" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-blue-500/50" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-blue-500/50" />

                {/* Central Visual */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10"
                  >
                     {/* Placeholder Icon */}
                    {product.category === 'towing' ? 
                       <HelicopterIcon className="h-48 w-48 text-gray-600 group-hover:text-blue-400 transition-colors duration-500" /> :
                       <Box className="h-48 w-48 text-gray-600 group-hover:text-blue-400 transition-colors duration-500" />
                    }
                  </motion.div>
                  
                  {/* Rotating Rings */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[80%] h-[80%] border border-dashed border-gray-700 rounded-full animate-[spin_60s_linear_infinite]" />
                    <div className="w-[60%] h-[60%] border border-dotted border-blue-500/20 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
                  </div>
                </div>

                {/* Tech Specs Overlay */}
                <div className="absolute bottom-8 left-8 right-8 flex justify-between font-mono text-xs text-blue-300">
                  <span>SCALE: 1:1</span>
                  <span>REF: {product.id}</span>
                </div>
             </div>

             {/* Compatibility Badge */}
             <div className="mt-6">
                <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">Compatible avec :</h3>
                <div className="flex flex-wrap gap-2">
                   {product.compatibility.map((c, i) => (
                      <span key={i} className="px-3 py-1.5 bg-blue-900/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase rounded">
                         {c}
                      </span>
                   ))}
                </div>
             </div>
          </div>

          {/* Right Column: Info & Action */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-gray-800 border border-gray-700 text-gray-300 text-xs font-bold uppercase tracking-wider rounded">
                  {product.category === 'towing' ? 'REMORQUAGE' : 'MANUTENTION'}
                </span>
                <div className="flex items-center gap-1 text-green-400 text-xs font-bold uppercase">
                  <Activity className="h-3 w-3" />
                  Produit Actif
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-black uppercase text-white mb-6 leading-tight">
                {product.name}
              </h1>

              <p className="text-lg text-gray-300 mb-8 leading-relaxed border-l-4 border-blue-500/30 pl-6">
                {product.description}
              </p>

              {/* Technical Specifications Grid */}
              <div className="bg-gray-800/30 rounded-xl p-6 mb-8 border border-gray-700 backdrop-blur-sm">
                <h3 className="text-sm font-bold uppercase text-gray-500 mb-4 flex items-center gap-2">
                  <Zap className="h-4 w-4" /> Spécifications Techniques
                </h3>
                <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex flex-col border-l-2 border-blue-500/20 pl-3">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{key}</span>
                      <span className="text-sm font-bold text-white font-mono">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features List */}
              <div className="mb-10">
                <h3 className="text-sm font-bold uppercase text-gray-500 mb-4 flex items-center gap-2">
                  <Shield className="h-4 w-4" /> Capacités Avancées
                </h3>
                <ul className="grid grid-cols-1 gap-3">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 bg-gray-800/20 p-3 rounded border border-gray-700/50">
                      <Check className="h-5 w-5 text-blue-500 shrink-0" />
                      <span className="text-sm text-gray-300 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-800">
                <button
                  onClick={handleAddToQuote}
                  className={`flex-1 flex items-center justify-center gap-3 px-8 py-4 text-sm font-black uppercase tracking-wider rounded-lg transition-all ${
                    added
                      ? 'bg-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                      : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:scale-[1.02]'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="h-5 w-5" />
                      Ajouté au devis
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-5 w-5" />
                      Ajouter au devis
                    </>
                  )}
                </button>
                
                <button className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-800 text-white border border-gray-700 hover:bg-gray-700 rounded-lg font-bold uppercase text-sm transition-all">
                  <FileText className="h-5 w-5" />
                  Fiche Tech.
                </button>
              </div>

              <div className="mt-4 text-center">
                 <Link href="/boutique/panier" className="text-xs text-gray-500 hover:text-white uppercase tracking-widest flex items-center justify-center gap-1 group">
                    Voir ma liste d'équipement <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                 </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
