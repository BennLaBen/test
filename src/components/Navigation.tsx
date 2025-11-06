'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LanguageToggle } from '@/components/LanguageToggle'
import { Menu, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const navigation = [
  { key: 'nav.home', href: '/' },
  { key: 'nav.expertises', href: '/nos-expertises' },
  { key: 'nav.gerard', href: '/notre-vision' },
  { key: 'nav.caseStudies', href: '/cas-clients' },
  { key: 'nav.blog', href: '/blog' },
]

const secondaryNavigation = [
  { key: 'nav.contact', href: '/contact' },
  { key: 'nav.careers', href: '/carriere' },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { t } = useTranslation('common')

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
            
            {/* CTA principal */}
            <Link
              href="/contact"
              className="btn-primary text-sm px-6 whitespace-nowrap"
            >
              {t('nav.quote')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <LanguageToggle />
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-full border border-transparent bg-transparent p-2 text-muted hover:text-muted-strong focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-expanded="false"
            >
              <span className="sr-only">Ouvrir le menu principal</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden"
            >
              <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                {navigation.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`block rounded-xl px-4 py-3 text-base font-semibold transition-colors ${
                      isActive(item.href)
                        ? 'bg-white/60 text-muted-strong'
                        : 'text-muted hover:bg-white/35'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {t(item.key)}
                  </Link>
                ))}
                <div className="mt-4">
                  <Link
                    href="/contact"
                    className="btn-primary w-full justify-center"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('nav.quote')}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}
