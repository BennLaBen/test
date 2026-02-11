'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { ShoppingBag, ArrowLeft, Search, Menu, X } from 'lucide-react'
import { useQuote } from '@/contexts/QuoteContext'
import { useState } from 'react'

export function ShopNavigation() {
  const { itemCount } = useQuote()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-gray-900/90 backdrop-blur-xl border-b border-blue-500/20 shadow-[0_0_30px_rgba(37,99,235,0.1)]">
      {/* Top Bar - System Status */}
      <div className="bg-gray-950 border-b border-gray-800 py-1 px-4">
        <div className="container mx-auto flex justify-between items-center text-[10px] font-mono text-gray-500 uppercase">
          <div className="hidden sm:flex items-center gap-4">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              SYSTEM_ONLINE
            </span>
            <span className="hidden md:inline">SECURE_CONNECTION: TLS 1.3</span>
          </div>
          <div className="flex sm:hidden items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            <span>ONLINE</span>
          </div>
          <Link href="/" className="hover:text-blue-400 transition-colors flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> <span className="hidden xs:inline">RETOUR</span> <span className="hidden sm:inline">GROUPE LLEDO</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo Area - LLEDO AEROTOOLS GSE */}
          <Link href="/boutique" className="flex items-center group mr-8">
            <div className="relative h-16 w-56 flex items-center justify-center transition-all group-hover:scale-105">
               {/* Fond blanc arrondi pour le logo */}
               <div className="absolute inset-1 bg-white rounded-lg" />
               <Image 
                 src="/images/aerotools/lledoaerotols-logo.png"
                 alt="LLEDO Aerotools GSE Logo"
                 fill
                 className="object-contain relative z-10 rounded-lg"
                 priority
               />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-lg text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-white transition-all group"
            >
              <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
              Groupe LLEDO
            </Link>
            <div className="h-8 w-px bg-slate-800 mx-2" />
            <Link 
              href="/boutique" 
              className={`text-sm font-bold uppercase tracking-wider transition-colors ${pathname === '/boutique' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'}`}
            >
              Accueil
            </Link>
            <Link 
              href="/boutique/catalogue" 
              className={`text-sm font-bold uppercase tracking-wider transition-colors ${pathname === '/boutique/catalogue' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'}`}
            >
              Catalogue
            </Link>
            <Link 
              href="/boutique/panier" 
              className={`text-sm font-bold uppercase tracking-wider transition-colors ${pathname === '/boutique/panier' ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
            >
              Devis
            </Link>
            <Link 
              href="/contact" 
              className="text-sm font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
            >
              Support
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Search (Icon only for now) */}
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Search className="h-5 w-5" />
            </button>

            {/* Quote Cart */}
            <Link href="/boutique/panier" className="group relative p-2">
              <ShoppingBag className="h-6 w-6 text-gray-300 group-hover:text-blue-400 transition-colors" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white shadow-lg shadow-blue-500/50 animate-bounce">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-gray-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden border-t border-gray-800 bg-gray-900"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link 
              href="/boutique" 
              className="block py-2 text-sm font-bold uppercase tracking-wider text-gray-300 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link 
              href="/boutique/catalogue" 
              className="block py-2 text-sm font-bold uppercase tracking-wider text-gray-300 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Catalogue complet
            </Link>
            <Link 
              href="/boutique/panier" 
              className="block py-2 text-sm font-bold uppercase tracking-wider text-gray-300 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Ma Liste de Devis ({itemCount})
            </Link>
            <Link 
              href="/contact" 
              className="block py-2 text-sm font-bold uppercase tracking-wider text-gray-300 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Support Technique
            </Link>
            <div className="pt-4 border-t border-gray-800">
               <Link href="/" className="flex items-center gap-2 text-xs text-gray-500 uppercase">
                  <ArrowLeft className="h-3 w-3" /> Retour au site principal
               </Link>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  )
}

