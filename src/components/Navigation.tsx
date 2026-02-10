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

  // Bloquer le scroll du body quand le menu est ouvert (iOS Safari fix)
  useEffect(() => {
    if (isOpen) {
      // Sauvegarder la position de scroll actuelle
      const scrollY = window.scrollY
      const scrollX = window.scrollX
      
      // iOS Safari: bloquer le scroll de manière robuste
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.left = `-${scrollX}px`
      document.body.style.right = '0'
      document.body.style.width = '100%'
      document.body.style.height = '100%'
      // Empêcher le bounce scroll iOS
      document.body.style.overscrollBehavior = 'none'
      document.documentElement.style.overflow = 'hidden'
      document.documentElement.style.height = '100%'
      
      // Focus sur le bouton fermer à l'ouverture
      setTimeout(() => closeButtonRef.current?.focus(), 100)
    } else {
      // Récupérer la position sauvegardée
      const scrollY = document.body.style.top
      
      // Restaurer les styles
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.width = ''
      document.body.style.height = ''
      document.body.style.overscrollBehavior = ''
      document.documentElement.style.overflow = ''
      document.documentElement.style.height = ''
      
      // Restaurer la position de scroll
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }
    
    return () => {
      // Cleanup complet
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.width = ''
      document.body.style.height = ''
      document.body.style.overscrollBehavior = ''
      document.documentElement.style.overflow = ''
      document.documentElement.style.height = ''
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
            
            {/* Menu Hamburger - 32x32px minimum, animation simple */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              onTouchEnd={(e) => {
                e.preventDefault()
                setIsOpen(!isOpen)
              }}
              className="inline-flex items-center justify-center rounded-xl p-2.5 text-white bg-blue-600/20 border-2 border-blue-400/50 hover:bg-blue-600/30 focus:outline-none active:scale-95 transition-all duration-200 touch-manipulation"
              style={{ 
                boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)', 
                WebkitTapHighlightColor: 'transparent',
                minWidth: '48px',
                minHeight: '48px'
              }}
              aria-expanded={isOpen}
              aria-label="Menu principal"
            >
              <span className="sr-only">{t('ui.openMenu')}</span>
              {/* Animation rotate + fade */}
              <span className={`transition-transform duration-200 ${isOpen ? 'rotate-90 opacity-0 absolute' : 'rotate-0 opacity-100'}`}>
                <Menu className="h-8 w-8" aria-hidden="true" />
              </span>
              <span className={`transition-transform duration-200 ${isOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0 absolute'}`}>
                <X className="h-8 w-8" aria-hidden="true" />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation - FULLSCREEN OVERLAY avec Accordéons */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Overlay sombre avec blur - z-index élevé pour iOS */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden fixed bg-black/80 backdrop-blur-sm"
                style={{ 
                  touchAction: 'none',
                  // iOS Safari: position fixe robuste
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 99998,
                  // Empêcher tout scroll/touch sur l'overlay
                  WebkitOverflowScrolling: 'auto',
                  overscrollBehavior: 'none'
                }}
                onClick={closeMenu}
                onTouchMove={(e) => e.preventDefault()}
                aria-hidden="true"
              />
              
              {/* Menu plein écran - iOS Safari optimisé */}
              <motion.div
                ref={menuRef}
                role="dialog"
                aria-modal="true"
                aria-label="Menu de navigation"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="lg:hidden fixed flex flex-col bg-gradient-to-b from-[#0a0a12] via-[#0d0d18] to-[#0a0a12]"
                style={{ 
                  // iOS Safari: position fixe robuste
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  width: '100%',
                  // 100dvh pour iOS 15.4+, fallback via CSS variable
                  height: 'var(--mobile-menu-height, 100dvh)',
                  // Safe area pour notch iPhone
                  paddingTop: 'env(safe-area-inset-top, 0px)',
                  paddingLeft: 'env(safe-area-inset-left, 0px)',
                  paddingRight: 'env(safe-area-inset-right, 0px)',
                  // z-index très élevé pour passer au-dessus de tout
                  zIndex: 99999,
                  // Empêcher le bounce scroll iOS sur le conteneur principal
                  overscrollBehavior: 'contain'
                }}
              >
                {/* Header fixe */}
                <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-blue-500/20">
                  <Logo size="small" />
                  {/* Close icon - 44x44px minimum, bien visible top-right */}
                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={closeMenu}
                    className="p-2 rounded-xl bg-red-600/20 border-2 border-red-400/50 hover:bg-red-600/30 active:scale-95 transition-all duration-200 touch-manipulation focus:outline-none focus:ring-2 focus:ring-red-400"
                    style={{ 
                      boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)', 
                      WebkitTapHighlightColor: 'transparent',
                      minWidth: '44px',
                      minHeight: '44px'
                    }}
                    aria-label="Fermer le menu"
                  >
                    <X className="h-7 w-7 text-white" />
                  </button>
                </div>
                
                {/* Contenu scrollable - iOS Safari optimisé */}
                <div 
                  className="flex-1 overflow-y-auto"
                  style={{ 
                    // iOS Safari: scroll fluide
                    WebkitOverflowScrolling: 'touch',
                    // Empêcher le scroll de "passer" au body
                    overscrollBehavior: 'contain',
                    // Permettre le scroll tactile
                    touchAction: 'pan-y',
                    // Fix pour le scroll sur iOS
                    minHeight: 0
                  }}
                >
                  <div className="px-4 py-5 space-y-4">
                    {/* Navigation avec accordéons - inclut section compte si connecté */}
                    <MobileMenuAccordion 
                      onClose={closeMenu} 
                      isActive={isActive}
                      isAuthenticated={isAuthenticated}
                      user={user ? {
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email,
                        role: user.role
                      } : null}
                      onLogout={() => signOut({ callbackUrl: '/' })}
                    />

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

                {/* CTA Sticky en bas - Safe area iPhone */}
                <div 
                  className="flex-shrink-0 px-4 pt-4 border-t border-blue-500/20 bg-[#0a0a12]/95 backdrop-blur-lg"
                  style={{ 
                    // Safe area bottom pour home indicator iPhone X+
                    paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)'
                  }}
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
