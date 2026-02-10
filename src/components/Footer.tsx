'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Logo } from '@/components/Logo'
import { Linkedin, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  const { t } = useTranslation('common')
  const pathname = usePathname()

  // Si on est sur la partie boutique, on n'affiche pas ce footer
  if (pathname?.startsWith('/boutique')) return null

  const locale = pathname?.startsWith('/en') ? 'en' : 'fr'
  const localePrefix = locale === 'en' ? '/en' : ''

  const resolveHref = (href: string) => {
    if (href.startsWith('http')) return href
    if (locale === 'en') {
      if (href === '/') return '/en'
      return `${localePrefix}${href}`
    }
    return href
  }

  const companyLinks = t('footer.company.links', { returnObjects: true }) as Record<string, string>
  const servicesLinks = t('footer.services.links', { returnObjects: true }) as Record<string, string>
  const legalLinks = t('footer.legal.links', { returnObjects: true }) as Record<string, string>

  const renderLinks = (links: Record<string, string>, mapping: Record<string, string>) =>
    Object.entries(links).map(([key, label]) => (
      <li key={key}>
        <Link
          href={resolveHref(mapping[key] ?? '#')}
          className="group flex items-center text-sm transition-colors hover:text-primary-400"
        >
          <span className="mr-2 text-primary-500 opacity-0 transition-opacity group-hover:opacity-100">→</span>
          {label}
        </Link>
      </li>
    ))

  const linkMapping: Record<string, string> = {
    about: '/notre-vision',
    expertises: '/nos-expertises',
    careers: '/carriere',
    contact: '/contact',
    brochure: '/#plaquette',
    quote: '/contact',
    blog: '/blog',
    caseStudies: '/cas-clients',
    docs: '/#plaquette',
    support: '/contact',
    mentions: '#',
    privacy: '#',
    terms: '#',
    cookies: '#'
  }

  return (
    <footer className="relative bg-gray-900 text-gray-300 overflow-hidden">
      {/* Grille industrielle en fond */}
      <div className="absolute inset-0 opacity-5 industrial-grid pointer-events-none" />

      {/* Main Footer */}
      <div className="border-b border-gray-800">
        <div className="container py-8 sm:py-12 lg:py-16">
          <div className="grid gap-8 lg:gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-12">

            {/* Logo + Contacts */}
            <div className="lg:col-span-5">
              <div className="mb-6">
                <Logo size="small" href={resolveHref('/')} />
              </div>

              {/* Contacts sociétés */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* MPEB / FREM / EGI */}
                <div className="p-4 bg-white/5 rounded-xl border border-gray-700/50 hover:border-primary-500/30 transition-colors">
                  <div className="font-bold text-white text-sm mb-3 tracking-wide">MPEB · FREM · EGI</div>
                  <a href="tel:+33442029674" className="flex items-center gap-2.5 text-sm text-gray-300 hover:text-primary-400 transition-colors group">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500/10 group-hover:bg-primary-500/20 transition-colors">
                      <Phone className="h-4 w-4 text-primary-400" />
                    </div>
                    <span className="font-mono">04 42 02 96 74</span>
                  </a>
                  <a href="mailto:contact@mpeb13.com" className="flex items-center gap-2.5 text-sm text-gray-300 hover:text-primary-400 transition-colors mt-2 group">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500/10 group-hover:bg-primary-500/20 transition-colors">
                      <Mail className="h-4 w-4 text-primary-400" />
                    </div>
                    <span>contact@mpeb13.com</span>
                  </a>
                </div>

                {/* MGP */}
                <div className="p-4 bg-white/5 rounded-xl border border-gray-700/50 hover:border-primary-500/30 transition-colors">
                  <div className="font-bold text-white text-sm mb-3 tracking-wide">MGP</div>
                  <a href="tel:+33467737090" className="flex items-center gap-2.5 text-sm text-gray-300 hover:text-primary-400 transition-colors group">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500/10 group-hover:bg-primary-500/20 transition-colors">
                      <Phone className="h-4 w-4 text-primary-400" />
                    </div>
                    <span className="font-mono">04 67 73 70 90</span>
                  </a>
                  <a href="mailto:mega.gen.pro@wanadoo.fr" className="flex items-center gap-2.5 text-sm text-gray-300 hover:text-primary-400 transition-colors mt-2 group">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500/10 group-hover:bg-primary-500/20 transition-colors">
                      <Mail className="h-4 w-4 text-primary-400" />
                    </div>
                    <span className="text-xs sm:text-sm break-all">mega.gen.pro@wanadoo.fr</span>
                  </a>
                </div>
              </div>

              {/* Adresse */}
              <div className="mt-4 flex items-start gap-2.5 text-xs text-gray-500">
                <MapPin className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
                <span>{t('footer.address')}</span>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 lg:gap-8">
                <div>
                  <h3 className="mb-4 flex items-center text-sm font-semibold uppercase tracking-wider text-white">
                    <span className="mr-2 h-px w-4 bg-primary-500" />
                    {t('footer.company.title')}
                  </h3>
                  <ul className="space-y-3">
                    {renderLinks(companyLinks, linkMapping)}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-4 flex items-center text-sm font-semibold uppercase tracking-wider text-white">
                    <span className="mr-2 h-px w-4 bg-primary-500" />
                    {t('footer.services.title')}
                  </h3>
                  <ul className="space-y-3">
                    {renderLinks(servicesLinks, linkMapping)}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-4 flex items-center text-sm font-semibold uppercase tracking-wider text-white">
                    <span className="mr-2 h-px w-4 bg-primary-500" />
                    {t('footer.legal.title')}
                  </h3>
                  <ul className="space-y-3">
                    {renderLinks(legalLinks, linkMapping)}
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="container py-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:gap-6 md:flex-row">
          {/* Copyright */}
          <div className="text-center text-sm md:text-left">
            <span className="font-semibold text-white">{t('footer.bottom.madeInFrance')}</span>
            <span className="mx-2 text-gray-600">•</span>
            <span>{t('footer.bottom.copyright', { year: new Date().getFullYear() })}</span>
          </div>

          {/* Social + Certifications */}
          <div className="flex items-center gap-6">
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/company/lledo-industries"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 text-gray-400 transition-all duration-200 hover:bg-primary-600 hover:text-white active:scale-95 touch-manipulation"
              style={{ minWidth: '40px', minHeight: '40px' }}
            >
              <Linkedin className="h-5 w-5" />
            </a>

            {/* Certifications badges */}
            <div className="flex flex-wrap items-center gap-3">
              {[
                { icon: 'CE', labelKey: 'certifications.ce' },
                { icon: '9001', labelKey: 'certifications.iso9001' },
                { icon: '9100', labelKey: 'certifications.en9100' },
                { icon: '12312', labelKey: 'certifications.en12312' },
                { icon: '⇄', labelKey: 'certifications.interchangeability' },
              ].map((cert, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-1.5"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-primary-500/20 text-[10px] font-bold text-primary-400">
                    {cert.icon}
                  </span>
                  <span className="text-[10px] text-gray-500 hidden sm:inline">{t(cert.labelKey)}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
