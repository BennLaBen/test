'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Facebook, Twitter, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react'

interface FooterLink {
  label: string
  href: string
}

export function Footer() {
  const { t } = useTranslation('common')
  const pathname = usePathname()
  const locale = pathname.startsWith('/en') ? 'en' : 'fr'
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
          className="text-sm transition-colors hover:text-white"
        >
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
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="border-b border-gray-800">
        <div className="container py-12 lg:py-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <Link href={resolveHref('/')} className="flex items-center space-x-3 group">
                  <div className="relative h-12 w-12 flex-shrink-0">
                    <Image
                      src="/logo.png"
                      alt="LLEDO Industries Logo"
                      fill
                      className="object-contain transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-white">LLEDO</span>
                    <span className="ml-1 text-sm text-primary-400">Industries</span>
                  </div>
                </Link>
              </div>
              <p className="mb-6 text-sm leading-relaxed">
                {t('hero.subheadline')}
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 flex-shrink-0 text-primary-400" />
                  <span>{t('footer.address')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 flex-shrink-0 text-primary-400" />
                  <a href={`tel:${t('footer.phone').replace(/\s+/g, '')}`} className="hover:text-white transition-colors">
                    {t('footer.phone')}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 flex-shrink-0 text-primary-400" />
                  <a href={`mailto:${t('footer.email')}`} className="hover:text-white transition-colors">
                    {t('footer.email')}
                  </a>
                </div>
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                {t('footer.company.title')}
              </h3>
              <ul className="space-y-3">
                {renderLinks(companyLinks, linkMapping)}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                {t('footer.services.title')}
              </h3>
              <ul className="space-y-3">
                {renderLinks(servicesLinks, linkMapping)}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                {t('footer.resources.title')}
              </h3>
              <ul className="space-y-3">
                {renderLinks(resourcesLinks, linkMapping)}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                {t('footer.legal.title')}
              </h3>
              <ul className="space-y-3">
                {renderLinks(legalLinks, linkMapping)}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="container py-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-center text-sm md:text-left">
            {t('footer.bottom.madeInFrance')}
            <span className="mx-2">•</span>
            {t('footer.bottom.copyright', { year: new Date().getFullYear() })}
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => {
              const Icon = social.icon
              return (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-all hover:bg-primary-600 hover:text-white"
                >
                  <Icon className="h-5 w-5" />
                </a>
              )
            })}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 border-t border-gray-800 pt-6 text-xs text-gray-400">
          <span className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 font-semibold text-primary-400">
              CE
            </span>
            <span>Marquage CE</span>
          </span>
          <span>•</span>
          <span>ISO 9001:2015</span>
          <span>•</span>
          <span>EN 12312-1</span>
          <span>•</span>
          <span>Directive Machines 2006/42/CE</span>
        </div>
      </div>
    </footer>
  )
}
