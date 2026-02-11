'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Search, Menu, X, Phone, FileText } from 'lucide-react'
import { useQuote } from '@/contexts/QuoteContext'
import { useState } from 'react'

const navLinks = [
  { href: '/boutique', label: 'Accueil' },
  { href: '/boutique/catalogue', label: 'Catalogue' },
  { href: '/boutique/panier', label: 'Devis' },
  { href: '/contact', label: 'Contact' },
]

export function ShopNavigation() {
  const { itemCount } = useQuote()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === '/boutique') return pathname === '/boutique'
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed top-0 w-full z-50">
      {/* Top accent line */}
      <div className="h-0.5 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600" />

      {/* Top info bar */}
      <div className="bg-gray-950/95 backdrop-blur-sm border-b border-gray-800/50 py-1.5 px-4">
        <div className="container mx-auto flex justify-between items-center text-[10px] text-gray-500">
          <div className="hidden sm:flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="h-3 w-3" />
              +33 4 42 02 96 74
            </span>
            <span className="hidden md:inline">Lun–Ven 8h–18h</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              Devis sous 24h
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <FileText className="h-3 w-3" />
              Livraison mondiale
            </span>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="bg-gray-900/90 backdrop-blur-xl border-b border-gray-800/50 shadow-lg shadow-black/20">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/boutique" className="flex items-center group flex-shrink-0">
              <div className="relative h-10 w-44">
                <Image 
                  src="/images/aerotools/lledo-aerotools-logo.svg"
                  alt="LLEDO Aerotools"
                  fill
                  className="object-contain group-hover:scale-[1.03] transition-transform"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 mx-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
                    isActive(link.href)
                      ? 'text-white bg-blue-600/15'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="shop-nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Phone CTA — desktop only */}
              <a
                href="tel:+33442029674"
                className="hidden lg:flex items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                Appeler
              </a>

              {/* Quote Cart */}
              <Link href="/boutique/panier" className="group relative p-2.5 rounded-lg hover:bg-white/5 transition-colors">
                <ShoppingBag className="h-5 w-5 text-gray-300 group-hover:text-blue-400 transition-colors" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-blue-500 text-[9px] font-black text-white shadow-lg shadow-blue-500/40">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden p-2.5 rounded-lg text-gray-300 hover:bg-white/5 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-900/95 backdrop-blur-xl border-b border-gray-800"
          >
            <div className="container mx-auto px-4 py-3 flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-3 text-sm font-bold uppercase tracking-wider border-b border-gray-800/50 last:border-0 transition-colors ${
                    isActive(link.href) ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                  {link.href === '/boutique/panier' && itemCount > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 bg-blue-600 text-white text-[10px] rounded-full">{itemCount}</span>
                  )}
                </Link>
              ))}
              <a href="tel:+33442029674" className="flex items-center gap-2 pt-3 text-xs text-gray-500 uppercase">
                <Phone className="h-3 w-3" /> +33 4 42 02 96 74
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

