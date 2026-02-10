'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Logo } from '@/components/Logo'
import { Linkedin, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  const { t } = useTranslation('common')
  const pathname = usePathname()

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

  // Liens statiques pour éviter les problèmes de traduction
  const companyLinks = [
    { label: t('footer.company.links.about', 'Notre Vision'), href: '/notre-vision' },
    { label: t('footer.company.links.expertises', 'Nos Expertises'), href: '/nos-expertises' },
    { label: t('footer.company.links.careers', 'Carrières'), href: '/carriere' },
    { label: t('footer.company.links.contact', 'Contact'), href: '/contact' },
  ]

  const servicesLinks = [
    { label: t('footer.services.links.expertises', 'Nos Expertises'), href: '/nos-expertises' },
    { label: t('footer.services.links.brochure', 'Télécharger la plaquette'), href: '/#plaquette' },
    { label: t('footer.services.links.caseStudies', 'Cas clients'), href: '/cas-clients' },
    { label: t('footer.services.links.quote', 'Obtenir un devis'), href: '/contact' },
  ]

  const legalLinks = [
    { label: t('footer.legal.links.mentions', 'Mentions légales'), href: '#' },
    { label: t('footer.legal.links.privacy', 'Politique de confidentialité'), href: '#' },
    { label: t('footer.legal.links.terms', 'CGV'), href: '#' },
    { label: t('footer.legal.links.cookies', 'Cookies'), href: '#' },
  ]

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            
            {/* Colonne gauche: Logo + Contacts */}
            <div>
              <div className="mb-8">
                <Logo size="small" href={resolveHref('/')} />
              </div>

              {/* Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
                {/* MPEB / FREM / EGI */}
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="font-semibold text-white text-sm mb-3">MPEB · FREM · EGI</div>
                  <a href="tel:+33442029674" className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary-400 transition-colors">
                    <Phone className="h-4 w-4 text-primary-400 flex-shrink-0" />
                    <span>04 42 02 96 74</span>
                  </a>
                  <a href="mailto:contact@mpeb13.com" className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary-400 transition-colors mt-2">
                    <Mail className="h-4 w-4 text-primary-400 flex-shrink-0" />
                    <span>contact@mpeb13.com</span>
                  </a>
                </div>

                {/* MGP */}
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="font-semibold text-white text-sm mb-3">MGP</div>
                  <a href="tel:+33467737090" className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary-400 transition-colors">
                    <Phone className="h-4 w-4 text-primary-400 flex-shrink-0" />
                    <span>04 67 73 70 90</span>
                  </a>
                  <a href="mailto:mega.gen.pro@wanadoo.fr" className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary-400 transition-colors mt-2">
                    <Mail className="h-4 w-4 text-primary-400 flex-shrink-0" />
                    <span className="truncate">mega.gen.pro@wanadoo.fr</span>
                  </a>
                </div>
              </div>

              {/* Adresse */}
              <div className="mt-6 flex items-start gap-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
                <span>9-11 Boulevard de la Capelane, 13170 Les Pennes-Mirabeau</span>
              </div>
            </div>

            {/* Colonne droite: Liens */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              {/* Entreprise */}
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                  {t('footer.company.title', 'Entreprise')}
                </h3>
                <ul className="space-y-2">
                  {companyLinks.map((link, i) => (
                    <li key={i}>
                      <Link href={resolveHref(link.href)} className="text-sm text-gray-400 hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                  {t('footer.services.title', 'Nos Services')}
                </h3>
                <ul className="space-y-2">
                  {servicesLinks.map((link, i) => (
                    <li key={i}>
                      <Link href={resolveHref(link.href)} className="text-sm text-gray-400 hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Légal */}
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                  {t('footer.legal.title', 'Légal')}
                </h3>
                <ul className="space-y-2">
                  {legalLinks.map((link, i) => (
                    <li key={i}>
                      <Link href={resolveHref(link.href)} className="text-sm text-gray-400 hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="text-sm text-gray-400">
            <span className="font-medium text-white">Fabriqué en France 🇫🇷</span>
            <span className="mx-2">•</span>
            <span>© {new Date().getFullYear()} LLEDO Industries. Tous droits réservés.</span>
          </div>

          {/* LinkedIn + Certifications */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/company/lledo-industries"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 text-gray-400 hover:bg-primary-600 hover:text-white transition-colors"
            >
              <Linkedin className="h-4 w-4" />
            </a>

            {/* Certifications */}
            <div className="flex items-center gap-2">
              {['CE', 'ISO 9001', 'EN 9100', 'EN 12312'].map((cert) => (
                <span key={cert} className="px-2 py-1 text-[10px] font-medium bg-gray-800 text-gray-400 rounded">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
