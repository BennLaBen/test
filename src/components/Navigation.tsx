'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LanguageToggle } from '@/components/LanguageToggle'
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

          {/* Mobile menu button & actions - MENU À GAUCHE */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Menu Hamburger À GAUCHE */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2.5 text-muted-strong hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 active:scale-95 transition-all"
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
            
            {/* Spacer pour pousser les icônes à droite */}
            <div className="flex-1" />
            
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
              
              {/* Drawer menu depuis la gauche */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="lg:hidden fixed left-0 top-0 h-full w-[85%] max-w-[320px] bg-white dark:bg-gray-900 shadow-2xl z-[70] overflow-y-auto"
              >
              <motion.div 
                className="flex flex-col h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.15 }}
              >
                {/* Header du drawer avec logo */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
                  <div className="relative h-10 w-auto" style={{ width: '140px' }}>
                    <Image
                      src="/logo.png"
                      alt="LLEDO Industries"
                      fill
                      className="object-contain object-left"
                    />
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <X className="h-5 w-5 text-muted-strong" />
                  </button>
                </div>
                
                {/* Contenu scrollable */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                {/* User Profile Section - Mobile Style Leboncoin */}
                {isAuthenticated && user && (
                  <motion.div 
                    className="mb-5 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white text-xl font-bold shadow-md">
                        {user.firstName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-[15px] font-bold text-gray-900 dark:text-white">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        logout()
                        setIsOpen(false)
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-[14px] font-semibold text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg active:scale-[0.98] transition-all border border-red-200 dark:border-red-900/30"
                    >
                      <LogOut className="h-4 w-4" />
                      Déconnexion
                    </button>
                  </motion.div>
                )}

                {/* Navigation Links - Style Leboncoin */}
                <div className="space-y-2 mb-6">
                  {navigation.map((item, index) => (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        className={`block rounded-lg px-4 py-3 text-[15px] font-medium transition-all active:scale-[0.98] border ${
                          isActive(item.href)
                            ? 'bg-primary-500 text-white shadow-md border-primary-600'
                            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {t(item.key)}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Secondary Links - Style minimal */}
                <div className="space-y-1 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  {secondaryNavigation.map((item, index) => (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        className="block rounded-lg px-4 py-2.5 text-[14px] font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200 transition-all active:scale-[0.98]"
                        onClick={() => setIsOpen(false)}
                      >
                        {t(item.key)}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Auth Button - Mobile */}
                {!isAuthenticated && (
                  <motion.button
                    onClick={() => {
                      setShowAuthModal(true)
                      setIsOpen(false)
                    }}
                    className="w-full mb-3 flex items-center justify-center gap-2 px-4 py-3 text-[15px] font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded-lg active:scale-[0.98] transition-all border border-primary-200 dark:border-primary-800"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <User className="h-5 w-5" />
                    Connexion / Inscription
                  </motion.button>
                )}

                {/* CTA Button - Style Leboncoin */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.45 }}
                >
                  <Link
                    href="/contact"
                    className="w-full flex items-center justify-center px-6 py-3.5 text-[15px] font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg shadow-primary-500/30 active:scale-[0.98] transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('nav.quote')}
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
