'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { LanguageToggle } from '@/components/LanguageToggle'
import { Logo } from '@/components/Logo'
import { Menu, X, User, LogOut } from 'lucide-react'
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

  // Si on est sur la partie boutique, on n'affiche pas cette navigation
  if (pathname?.startsWith('/boutique')) return null

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-gray-900/95 backdrop-blur-xl border-b border-blue-500/20 shadow-lg shadow-blue-500/10' : 'bg-gray-900/80 backdrop-blur-sm'
      }`}
      style={{
        ...(scrolled && {
          boxShadow: '0 0 40px rgba(59, 130, 246, 0.2)'
        })
      }}
    >
      <nav id="navigation" aria-label="Navigation principale" role="navigation" className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-8">
          {/* Logo - Version moderne */}
          <Logo size="medium" href="/" />

          {/* Desktop Navigation - Style Tony Stark */}
          <div className="hidden lg:flex lg:items-center lg:justify-center lg:flex-1 lg:gap-6 xl:gap-10">
            {navigation.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`relative px-6 py-2.5 text-sm font-bold uppercase tracking-wider transition-all duration-300 rounded-lg whitespace-nowrap ${
                  isActive(item.href)
                    ? 'text-white bg-blue-600/20 border border-blue-400/50'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
                style={{
                  ...(isActive(item.href) && {
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
                    textShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
                  })
                }}
              >
                <span className="relative z-10">{t(item.key)}</span>
                {isActive(item.href) && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    style={{ willChange: 'transform' }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex lg:items-center lg:gap-4 lg:flex-shrink-0">
            {/* Language Toggle uniquement */}
            <LanguageToggle />
            
            {/* Séparateur vertical */}
            <div className="h-8 w-px bg-gray-600" />
            
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
            
            {/* CTA principal - Style Arc Reactor */}
            <Link
              href="/contact"
              className="relative inline-flex items-center px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg overflow-hidden group"
              style={{
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-200%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={{ willChange: 'transform' }}
              />
              <span className="relative z-10">{t('nav.quote')}</span>
            </Link>
          </div>

          {/* Auth Modal */}
          <AuthModal 
            isOpen={showAuthModal} 
            onClose={() => setShowAuthModal(false)}
            defaultMode="login"
          />

          {/* Mobile menu button & actions - DARK MODE */}
          <div className="flex items-center gap-3 lg:hidden">
            {/* User Avatar on Mobile */}
            {isAuthenticated && user ? (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-bold border-2 border-blue-400/50">
                {user.firstName.charAt(0)}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="p-2 rounded-lg hover:bg-blue-500/20 border border-blue-400/30 transition-all"
              >
                <User className="h-5 w-5 text-gray-300" />
              </button>
            )}
            
            <LanguageToggle />
            
            {/* Menu Hamburger - STYLE TONY STARK */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2.5 text-white bg-blue-600/20 border-2 border-blue-400/50 hover:bg-blue-600/30 focus:outline-none active:scale-95 transition-all"
              style={{ boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)' }}
              aria-expanded={isOpen}
            >
              <span className="sr-only">Ouvrir le menu principal</span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
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

        {/* Mobile Navigation - DRAWER GAUCHE style Leboncoin */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Overlay sombre */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                onClick={() => setIsOpen(false)}
              />
              
              {/* Drawer menu moderne full width */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="lg:hidden fixed left-0 top-0 h-full w-full bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 z-[70] overflow-y-auto"
                style={{ boxShadow: '0 0 100px rgba(59, 130, 246, 0.5)' }}
              >
              <motion.div 
                className="flex flex-col h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.15 }}
              >
                {/* Header moderne avec bouton fermer */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-blue-500/20">
                  <Logo size="small" />
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className="p-3 rounded-xl bg-blue-600/20 border-2 border-blue-400/50 hover:bg-blue-600/30 transition-all"
                    style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' }}
                    whileHover={{ scale: 1.05, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="h-6 w-6 text-white" />
                  </motion.button>
                </div>
                
                {/* Contenu scrollable */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                {/* User Profile Section - DARK MODE */}
                {isAuthenticated && user && (
                  <motion.div 
                    className="mb-5 p-4 rounded-xl bg-gray-800/50 border border-blue-500/30 backdrop-blur-sm"
                    style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)' }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xl font-bold shadow-md border-2 border-blue-400/50">
                        {user.firstName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-[15px] font-bold text-white">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        logout()
                        setIsOpen(false)
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-[14px] font-semibold text-red-300 bg-red-900/30 rounded-lg active:scale-[0.98] transition-all border border-red-500/30"
                    >
                      <LogOut className="h-4 w-4" />
                      Déconnexion
                    </button>
                  </motion.div>
                )}

                {/* Navigation Links - Ultra moderne */}
                <div className="space-y-4 mb-8">
                  {navigation.map((item, index) => (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 + index * 0.1, type: "spring" }}
                    >
                      <Link
                        href={item.href}
                        className="group relative block"
                        onClick={() => setIsOpen(false)}
                      >
                        <motion.div
                          className={`relative px-6 py-5 rounded-2xl overflow-hidden ${
                            isActive(item.href)
                              ? 'bg-gradient-to-r from-blue-600 to-blue-500 border-2 border-blue-400/50'
                              : 'bg-gray-800/30 border-2 border-gray-700/50 hover:border-blue-400/50'
                          }`}
                          whileHover={{ scale: 1.02, x: 10 }}
                          whileTap={{ scale: 0.98 }}
                          style={{
                            ...(isActive(item.href) && {
                              boxShadow: '0 0 30px rgba(59, 130, 246, 0.5), inset 0 0 20px rgba(255,255,255,0.1)'
                            })
                          }}
                        >
                          {/* Effet de scan */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            initial={{ x: '-100%' }}
                            animate={{ x: isActive(item.href) ? ['  -100%', '200%'] : '-100%' }}
                            transition={{ 
                              duration: 2, 
                              repeat: isActive(item.href) ? Infinity : 0,
                              ease: "linear" 
                            }}
                          />
                          
                          <span className={`relative z-10 text-lg font-black uppercase tracking-wider ${
                            isActive(item.href) ? 'text-white' : 'text-gray-300 group-hover:text-white'
                          }`}>
                            {t(item.key)}
                          </span>
                          
                          {/* Indicateur actif */}
                          {isActive(item.href) && (
                            <motion.div
                              className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white"
                              animate={{
                                scale: [1, 1.3, 1],
                                opacity: [1, 0.5, 1]
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Secondary Links - Moderne */}
                <div className="grid grid-cols-2 gap-3 mb-6 pb-6 border-b border-blue-500/20">
                  {secondaryNavigation.map((item, index) => (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className="block rounded-xl px-4 py-4 text-sm font-bold text-center text-white bg-gray-800/50 border border-gray-700 hover:border-blue-400/50 hover:bg-blue-600/20 transition-all active:scale-95"
                        onClick={() => setIsOpen(false)}
                      >
                        {t(item.key)}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Auth Button - DARK MODE */}
                {!isAuthenticated && (
                  <motion.button
                    onClick={() => {
                      setShowAuthModal(true)
                      setIsOpen(false)
                    }}
                    className="w-full mb-3 flex items-center justify-center gap-2 px-4 py-3 text-[15px] font-bold text-white bg-gray-800/50 border-2 border-blue-400/30 rounded-xl active:scale-[0.98] transition-all hover:bg-blue-500/20"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <User className="h-5 w-5" />
                    Connexion / Inscription
                  </motion.button>
                )}

                {/* CTA Button - TONY STARK */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.45 }}
                >
                  <Link
                    href="/contact"
                    className="relative w-full flex items-center justify-center px-6 py-4 text-[15px] font-black uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl overflow-hidden active:scale-[0.98] transition-all"
                    style={{ boxShadow: '0 0 30px rgba(59, 130, 246, 0.6)' }}
                    onClick={() => setIsOpen(false)}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: ['-200%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      style={{ willChange: 'transform' }}
                    />
                    <span className="relative z-10">{t('nav.quote')}</span>
                  </Link>
                </motion.div>
                </div>
                {/* Fin contenu scrollable */}
              </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}
