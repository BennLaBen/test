'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Logo } from '@/components/Logo'
import { Linkedin, Mail, Phone } from 'lucide-react'

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
          className="text-sm text-gray-400 transition-colors hover:text-white"
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
    mentions: '#',
    privacy: '#',
    terms: '#',
    cookies: '#'
  }

  return (
    <footer className="bg-gray-950 text-gray-400">
      {/* Main Footer */}
      <div className="container px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid gap-10 lg:gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

          {/* Contacts */}
          <div className="md:col-span-2 lg:col-span-2">
            <div className="mb-8">
              <Logo size="small" href={resolveHref('/')} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* MPEB / FREM / EGI */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <h4 className="text-white font-bold text-sm mb-3 tracking-wide">MPEB · FREM · EGI</h4>
                <a href="tel:+33442029674" className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-white transition-colors mb-2">
                  <Phone className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <span className="font-mono">04 42 02 96 74</span>
                </a>
                <a href="mailto:contact@mpeb13.com" className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-white transition-colors">
                  <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <span>contact@mpeb13.com</span>
                </a>
              </div>

              {/* MGP */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <h4 className="text-white font-bold text-sm mb-3 tracking-wide">MGP</h4>
                <a href="tel:+33467737090" className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-white transition-colors mb-2">
                  <Phone className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <span className="font-mono">04 67 73 70 90</span>
                </a>
                <a href="mailto:mega.gen.pro@wanadoo.fr" className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-white transition-colors">
                  <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <span>mega.gen.pro@wanadoo.fr</span>
                </a>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-4">{t('footer.company.title')}</h3>
            <ul className="space-y-2.5">
              {renderLinks(companyLinks, linkMapping)}
            </ul>

            <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-4 mt-8">{t('footer.services.title')}</h3>
            <ul className="space-y-2.5">
              {renderLinks(servicesLinks, linkMapping)}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-4">{t('footer.legal.title')}</h3>
            <ul className="space-y-2.5">
              {renderLinks(legalLinks, linkMapping)}
            </ul>

            {/* Social */}
            <div className="mt-8">
              <a
                href="https://www.linkedin.com/company/lledo-industries"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.05] text-gray-400 transition-all hover:bg-blue-600 hover:text-white"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06]">
        <div className="container px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="text-xs text-gray-500">
              {t('footer.bottom.copyright', { year: new Date().getFullYear() })}
              <span className="mx-2">·</span>
              <span className="text-gray-400">{t('footer.bottom.madeInFrance')}</span>
            </div>

            {/* Certifications */}
            <div className="flex flex-wrap items-center gap-3">
              {[
                { icon: 'CE', labelKey: 'certifications.ce' },
                { icon: '9001', labelKey: 'certifications.iso9001' },
                { icon: '9100', labelKey: 'certifications.en9100' },
                { icon: '12312', labelKey: 'certifications.en12312' },
                { icon: '⇄', labelKey: 'certifications.interchangeability' },
              ].map((cert, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-white/[0.06] text-[10px] font-bold text-blue-400">
                    {cert.icon}
                  </span>
                  <span className="text-[11px] text-gray-500">{t(cert.labelKey)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
