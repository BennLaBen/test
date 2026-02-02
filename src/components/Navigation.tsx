'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { LanguageToggle } from '@/components/LanguageToggle'
import { Logo } from '@/components/Logo'
import { Menu, X, User, LogOut, Phone, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AuthModal } from '@/components/auth/AuthModal'
import { useSession, signOut } from 'next-auth/react'
import { MobileMenuAccordion } from '@/components/MobileMenuAccordion'

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
  const { data: session } = useSession()
  const isAuthenticated = !!session?.user
  const user = session?.user

  const isActive = (href: string) => pathname === href

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Refs pour le focus trap
  const menuRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const firstFocusableRef = useRef<HTMLAnchorElement>(null)

  // Fermer le menu
  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  // Bloquer le scroll du body quand le menu est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.top = `-${window.scrollY}px`
      // Focus sur le bouton fermer à l'ouverture
      setTimeout(() => closeButtonRef.current?.focus(), 100)
    } else {
      const scrollY = document.body.style.top
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
    }
  }, [isOpen])

  // Gestion de la touche ESC pour fermer le menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeMenu()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, closeMenu])

  // Focus trap - garder le focus dans le menu
  useEffect(() => {
    if (!isOpen || !menuRef.current) return

    const focusableElements = menuRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleTabKey)
    return () => document.removeEventListener('keydown', handleTabKey)
  }, [isOpen])

  // Si on est sur la partie boutique, on n'affiche pas cette navigation
  if (pathname?.startsWith('/boutique')) return null

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-[#0a0a12] backdrop-blur-xl border-b border-blue-500/30 shadow-lg shadow-blue-500/10' : 'bg-[#0a0a12]/95 backdrop-blur-sm'
      }`}
      style={{
        ...(scrolled && {
          boxShadow: '0 0 40px rgba(59, 130, 246, 0.2)'
        })
      }}
    >
      <nav id="navigation" aria-label="Navigation principale" role="navigation" className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-4 sm:gap-8">
          {/* Logo - Version moderne */}
          <Logo size="large" href="/" />

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
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-500/30">
                    {(user.firstName || user.email || '?').charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-white">{user.firstName || user.email}</span>
                </button>
                
                {/* Dropdown menu */}
                <div className="absolute right-0 top-full mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all bg-gray-900 rounded-xl shadow-2xl border border-blue-500/30 p-2" style={{ boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)' }}>
                  <div className="px-3 py-2 border-b border-blue-500/20">
                    <p className="text-sm font-bold text-white">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                    {user.role === 'ADMIN' && (
                      <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        {t('auth.administrator')}
                      </span>
                    )}
                  </div>
                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors mt-1"
                    >
                      <User className="h-4 w-4" />
                      {t('auth.dashboard')}
                    </Link>
                  )}
                  <Link
                    href="/espace-client/profil"
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <User className="h-4 w-4" />
                    {t('auth.myProfile')}
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-1"
                  >
                    <LogOut className="h-4 w-4" />
                    {t('auth.logout')}
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/connexion"
                className="btn-secondary text-sm px-4 whitespace-nowrap inline-flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                {t('auth.login')}
              </Link>
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
          <div className="flex items-center gap-2 sm:gap-3 lg:hidden">
            {/* User Avatar on Mobile */}
            {isAuthenticated && user ? (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-bold border-2 border-blue-400/50">
                {(user.firstName || user.email || '?').charAt(0)}
              </div>
            ) : (
              <Link
                href="/connexion"
                className="p-2 rounded-lg hover:bg-blue-500/20 border border-blue-400/30 transition-all"
              >
                <User className="h-5 w-5 text-gray-300" />
              </Link>
            )}
            
            <LanguageToggle />
            
            {/* Menu Hamburger - STYLE TONY STARK */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              onTouchEnd={(e) => {
                e.preventDefault()
                setIsOpen(!isOpen)
              }}
              className="inline-flex items-center justify-center rounded-lg p-3 text-white bg-blue-600/20 border-2 border-blue-400/50 hover:bg-blue-600/30 focus:outline-none active:scale-95 transition-all touch-manipulation"
              style={{ boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)', WebkitTapHighlightColor: 'transparent' }}
              aria-expanded={isOpen}
              aria-label="Menu principal"
            >
              <span className="sr-only">{t('ui.openMenu')}</span>
              {isOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - FULLSCREEN OVERLAY avec Accordéons */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Overlay sombre avec blur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]"
                style={{ touchAction: 'none' }}
                onClick={closeMenu}
                aria-hidden="true"
              />
              
              {/* Menu plein écran */}
              <motion.div
                ref={menuRef}
                role="dialog"
                aria-modal="true"
                aria-label="Menu de navigation"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="lg:hidden fixed inset-0 z-[9999] flex flex-col bg-gradient-to-b from-[#0a0a12] via-[#0d0d18] to-[#0a0a12]"
                style={{ 
                  height: '100dvh',
                  paddingTop: 'env(safe-area-inset-top)'
                }}
              >
                {/* Header fixe */}
                <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-blue-500/20">
                  <Logo size="small" />
                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={closeMenu}
                    className="p-3.5 rounded-xl bg-blue-600/20 border-2 border-blue-400/50 hover:bg-blue-600/30 active:scale-95 transition-all touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-400"
                    style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)', WebkitTapHighlightColor: 'transparent' }}
                    aria-label="Fermer le menu"
                  >
                    <X className="h-6 w-6 text-white" />
                  </button>
                </div>
                
                {/* Contenu scrollable */}
                <div 
                  className="flex-1 overflow-y-auto overscroll-contain"
                  style={{ WebkitOverflowScrolling: 'touch' }}
                >
                  <div className="px-4 py-5 space-y-4">
                    
                    {/* User Profile Section */}
                    {isAuthenticated && user && (
                      <motion.div 
                        className="p-4 rounded-xl bg-gray-800/40 border border-blue-500/30"
                        style={{ boxShadow: '0 0 25px rgba(59, 130, 246, 0.15)' }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-lg font-bold shadow-lg border-2 border-blue-400/50">
                            {user.firstName?.charAt(0) || user.email?.charAt(0) || '?'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {user.role === 'ADMIN' && (
                            <Link
                              href="/admin"
                              onClick={closeMenu}
                              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold text-blue-300 bg-blue-900/40 rounded-lg active:scale-[0.98] transition-all border border-blue-500/30 touch-manipulation"
                              style={{ WebkitTapHighlightColor: 'transparent' }}
                            >
                              <User className="h-4 w-4" />
                              {t('auth.dashboard')}
                            </Link>
                          )}
                          <button
                            onClick={() => {
                              signOut({ callbackUrl: '/' })
                              closeMenu()
                            }}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold text-red-300 bg-red-900/30 rounded-lg active:scale-[0.98] transition-all border border-red-500/30 touch-manipulation"
                            style={{ WebkitTapHighlightColor: 'transparent' }}
                          >
                            <LogOut className="h-4 w-4" />
                            {t('auth.logout')}
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Navigation avec accordéons */}
                    <MobileMenuAccordion onClose={closeMenu} isActive={isActive} />

                    {/* Auth Button si non connecté */}
                    {!isAuthenticated && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                      >
                        <Link
                          href="/connexion"
                          onClick={closeMenu}
                          className="w-full flex items-center justify-center gap-3 px-5 py-4 text-sm font-bold text-white bg-gray-800/50 border-2 border-blue-400/30 rounded-xl active:scale-[0.98] active:bg-blue-500/20 transition-all touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-400"
                          style={{ WebkitTapHighlightColor: 'transparent', minHeight: '56px' }}
                        >
                          <User className="h-5 w-5" />
                          {t('auth.loginRegister')}
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* CTA Sticky en bas */}
                <div 
                  className="flex-shrink-0 px-4 py-4 border-t border-blue-500/20 bg-[#0a0a12]/95 backdrop-blur-lg"
                  style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 16px)' }}
                >
                  <div className="flex gap-3">
                    {/* Contact */}
                    <Link
                      href="/contact"
                      onClick={closeMenu}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-bold text-white bg-gray-800/60 border-2 border-gray-600/50 rounded-xl active:scale-[0.98] transition-all touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-400"
                      style={{ WebkitTapHighlightColor: 'transparent', minHeight: '56px' }}
                    >
                      <Phone className="h-5 w-5" />
                      {t('nav.contact')}
                    </Link>
                    
                    {/* Devis - CTA principal */}
                    <Link
                      href="/contact?type=devis"
                      onClick={closeMenu}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-black uppercase tracking-wide text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl active:scale-[0.98] transition-all touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-300"
                      style={{ 
                        boxShadow: '0 0 25px rgba(59, 130, 246, 0.5)', 
                        WebkitTapHighlightColor: 'transparent',
                        minHeight: '56px'
                      }}
                    >
                      <FileText className="h-5 w-5" />
                      {t('nav.quote')}
                    </Link>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}
