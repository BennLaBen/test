'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Logo } from '@/components/Logo'
import { Facebook, Twitter, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react'

interface FooterLink {
  label: string
  href: string
}

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
  const resourcesLinks = t('footer.resources.links', { returnObjects: true }) as Record<string, string>
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

  const socialLinks = [
    { icon: Linkedin, href: 'https://www.linkedin.com/company/lledo-industries', label: 'LinkedIn' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: 'https://www.youtube.com/channel/lledo-industries', label: 'YouTube' }
  ]

  return (
    <footer className="relative bg-gray-900 text-gray-300 overflow-hidden">
      {/* Grille industrielle en fond */}
      <div className="absolute inset-0 opacity-5 industrial-grid pointer-events-none" />

      {/* Main Footer */}
      <div className="border-b border-gray-800">
        <div className="container py-12 lg:py-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <Logo size="small" showText={true} href={resolveHref('/')} />
              </div>
              <p className="mb-6 text-sm leading-relaxed">
                {t('hero.subheadline')}
              </p>
              
              {/* Contact Info avec style industriel */}
              <div className="space-y-3 text-sm">
                <div className="group flex items-start gap-3 transition-colors hover:text-primary-400">
                  <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-400" />
                  <span>{t('footer.address')}</span>
                </div>
                <div className="group flex items-center gap-3 transition-colors hover:text-primary-400">
                  <Phone className="h-5 w-5 flex-shrink-0 text-primary-400" />
                  <a href={`tel:${t('footer.phone').replace(/\s+/g, '')}`} className="font-mono">
                    {t('footer.phone')}
                  </a>
                </div>
                <div className="group flex items-center gap-3 transition-colors hover:text-primary-400">
                  <Mail className="h-5 w-5 flex-shrink-0 text-primary-400" />
                  <a href={`mailto:${t('footer.email')}`}>
                    {t('footer.email')}
                  </a>
                </div>
              </div>
            </div>

            {/* Links Columns avec bordures techniques */}
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
                {t('footer.resources.title')}
              </h3>
              <ul className="space-y-3">
                {renderLinks(resourcesLinks, linkMapping)}
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

      {/* Bottom Footer avec certifications */}
      <div className="container py-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center text-sm md:text-left">
            <span className="font-semibold text-white">{t('footer.bottom.madeInFrance')}</span>
            <span className="mx-2 text-gray-600">•</span>
            <span>{t('footer.bottom.copyright', { year: new Date().getFullYear() })}</span>
          </div>

          {/* Social Links avec style industriel */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social, index) => {
              const Icon = social.icon
              return (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 text-gray-400 transition-all hover:bg-primary-600 hover:text-white hover:shadow-lg tech-corner"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              )
            })}
          </div>
        </div>

        {/* Certifications avec badges industriels */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 border-t border-gray-800 pt-6">
          {[
            { icon: 'CE', label: 'Marquage CE' },
            { icon: '9001', label: 'ISO 9001:2015' },
            { icon: '9100', label: 'EN 9100' },
            { icon: '12312', label: 'EN 12312-1' },
          ].map((cert, index) => (
            <motion.div
              key={index}
              className="industrial-badge flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded bg-primary-500/20 text-xs font-bold text-primary-400">
                {cert.icon}
              </span>
              <span className="text-xs">{cert.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </footer>
  )
}
