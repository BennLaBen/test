'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LanguageToggle } from '@/components/LanguageToggle'
import { Menu, X, User, LogOut, Package, Phone, Users, Download, Newspaper } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { AuthModal } from '@/components/auth/AuthModal'

const navigation = [
  { key: 'nav.home', href: '/' },
  { key: 'nav.vision', href: '/notre-vision' },
  { key: 'nav.expertises', href: '/nos-expertises' },
  { key: 'nav.caseStudies', href: '/cas-clients' },
]

const secondaryNavigation = [
  { key: 'nav.contact', href: '/contact' },
  { key: 'nav.careers', href: '/carriere' },
]

const quickLinks = [
  { 
    icon: Package, 
    label: 'Produits Aerotools', 
    href: '/aerotools',
    color: 'from-orange-500 to-orange-600'
  },
  { 
    icon: Phone, 
    label: 'Contact', 
    href: '/contact',
    color: 'from-primary-500 to-primary-600'
  },
  { 
    icon: Users, 
    label: 'Recrutement', 
    href: '/carriere',
    color: 'from-amber-500 to-amber-600'
  },
  { 
    icon: Newspaper, 
    label: 'Blog', 
    href: '/blog',
    color: 'from-indigo-500 to-indigo-600'
  },
  { 
    icon: Download, 
    label: 'Plaquette PDF', 
    href: '/plaquette-lledo-industries.pdf',
    color: 'from-gray-500 to-gray-600',
    isDownload: true
  },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const pathname = usePathname()
  const { t } = useTranslation('common')
  const { isAuthenticated, user, logout } = useAuth()

  const isActive = (href: string) => pathname === href

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'nav-solid' : 'nav-transparent'
      }`}
    >
      <nav id="navigation" aria-label="Navigation principale" role="navigation" className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 transition-transform hover:scale-105">
            <div className="relative h-14 w-auto" style={{ width: '200px' }}>
              <Image
                src="/logo.png"
                alt="LLEDO Industries Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:justify-center lg:flex-1 lg:gap-1">
            {navigation.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`nav-link ${isActive(item.href) ? 'nav-link--active' : ''}`}
              >
                {t(item.key)}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex lg:items-center lg:gap-4 lg:flex-shrink-0">
            {/* Toggles avec séparation */}
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
            
            {/* Séparateur vertical */}
            <div className="h-8 w-px bg-gray-300 dark:bg-gray-600" />
            
            {/* Auth Button/User Menu */}
            {isAuthenticated && user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white text-sm font-bold">
                    {user.firstName.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-muted-strong">{user.firstName}</span>
                </button>
                
                {/* Dropdown menu */}
                <div className="absolute right-0 top-full mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-2">
                  <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-muted-strong">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-muted">{user.email}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors mt-1"
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="btn-secondary text-sm px-4 whitespace-nowrap inline-flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Connexion
              </button>
            )}
            
            {/* CTA principal */}
            <Link
              href="/contact"
              className="btn-primary text-sm px-6 whitespace-nowrap"
            >
              {t('nav.quote')}
            </Link>
          </div>

          {/* Auth Modal */}
          <AuthModal 
            isOpen={showAuthModal} 
            onClose={() => setShowAuthModal(false)}
            defaultMode="login"
          />

          {/* Mobile menu button & actions */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* User Avatar on Mobile */}
            {isAuthenticated && user ? (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white text-sm font-bold">
                {user.firstName.charAt(0)}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <User className="h-5 w-5 text-muted-strong" />
              </button>
            )}
            <LanguageToggle />
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-full p-2 text-muted hover:text-muted-strong focus:outline-none focus:ring-2 focus:ring-primary-500 active:scale-95 transition-transform"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Ouvrir le menu principal</span>
              <motion.div
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </motion.div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation - ULTRA OPTIMISÉ */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden"
            >
              <motion.div 
                className="px-4 pb-6 pt-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-700"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {/* User Profile Section - Mobile */}
                {isAuthenticated && user && (
                  <motion.div 
                    className="mb-4 p-4 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950/30 dark:to-primary-900/30"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white text-lg font-bold shadow-lg">
                        {user.firstName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-muted-strong">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-muted">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        logout()
                        setIsOpen(false)
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Déconnexion
                    </button>
                  </motion.div>
                )}

                {/* Navigation Links */}
                <div className="space-y-1 mb-4">
                  {navigation.map((item, index) => (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        className={`block rounded-xl px-4 py-3.5 text-base font-semibold transition-all active:scale-95 ${
                          isActive(item.href)
                            ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                            : 'bg-gray-100 dark:bg-gray-800 text-muted-strong hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {t(item.key)}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Links - Mobile avec icônes */}
                <div className="mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-2 px-2">
                    Accès Rapide
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {quickLinks.map((link, index) => {
                      const Icon = link.icon
                      const isDownload = link.isDownload || false
                      
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                        >
                          {isDownload ? (
                            <a
                              href={link.href}
                              download
                              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95 min-h-[88px]"
                              onClick={() => setIsOpen(false)}
                            >
                              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${link.color}`}>
                                <Icon className="h-5 w-5 text-white" />
                              </div>
                              <span className="text-xs font-semibold text-muted-strong text-center leading-tight">
                                {link.label}
                              </span>
                            </a>
                          ) : (
                            <Link
                              href={link.href}
                              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95 min-h-[88px]"
                              onClick={() => setIsOpen(false)}
                            >
                              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${link.color}`}>
                                <Icon className="h-5 w-5 text-white" />
                              </div>
                              <span className="text-xs font-semibold text-muted-strong text-center leading-tight">
                                {link.label}
                              </span>
                            </Link>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                </div>

                {/* Auth Button - Mobile */}
                {!isAuthenticated && (
                  <motion.button
                    onClick={() => {
                      setShowAuthModal(true)
                      setIsOpen(false)
                    }}
                    className="w-full mb-3 btn-secondary justify-center text-base py-3.5 active:scale-95"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <User className="h-5 w-5" />
                    Connexion / Inscription
                  </motion.button>
                )}

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.45 }}
                >
                  <Link
                    href="/contact"
                    className="btn-primary w-full justify-center text-base py-3.5 active:scale-95"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('nav.quote')}
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}
