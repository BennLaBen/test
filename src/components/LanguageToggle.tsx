'use client'

import { useState, useEffect, useRef } from 'react'
import { Globe, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷', countries: ['FR', 'BE', 'CH', 'CA', 'LU', 'MC', 'SN', 'CI', 'ML', 'BF', 'NE', 'TG', 'BJ', 'GA', 'CG', 'CD', 'MG', 'CM', 'DZ', 'TN', 'MA'] },
  { code: 'en', name: 'English', flag: '🇬🇧', countries: ['US', 'GB', 'AU', 'NZ', 'IE', 'ZA', 'IN', 'PH', 'SG', 'MY', 'NG', 'KE', 'GH', 'PK'] },
  { code: 'es', name: 'Español', flag: '🇪🇸', countries: ['ES', 'MX', 'AR', 'CO', 'PE', 'VE', 'CL', 'EC', 'GT', 'CU', 'BO', 'DO', 'HN', 'PY', 'SV', 'NI', 'CR', 'PA', 'UY'] },
  { code: 'pt-BR', name: 'Português', flag: '🇧🇷', countries: ['BR', 'PT', 'AO', 'MZ', 'CV', 'GW', 'ST', 'TL'] },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', rtl: true, countries: ['SA', 'AE', 'EG', 'IQ', 'JO', 'KW', 'LB', 'LY', 'OM', 'QA', 'SY', 'YE', 'BH', 'PS', 'SD'] },
]

const STORAGE_KEY = 'lledo-preferred-language'
const GEO_DETECTED_KEY = 'lledo-geo-detected'

export function LanguageToggle() {
  const [isOpen, setIsOpen] = useState(false)
  const [isChanging, setIsChanging] = useState(false)
  const { t, i18n } = useTranslation('common')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLanguage = i18n.language

  // Auto-detect language from country on first visit
  useEffect(() => {
    const detectLanguage = async () => {
      // Check if user already has a saved preference
      const savedLang = localStorage.getItem(STORAGE_KEY)
      if (savedLang) {
        const lang = languages.find(l => l.code === savedLang)
        if (lang && i18n.language !== lang.code) {
          await i18n.changeLanguage(lang.code)
          document.documentElement.lang = lang.code
          document.documentElement.dir = lang.code === 'ar' ? 'rtl' : 'ltr'
        }
        return
      }

      // Check if geo detection already done
      const geoDetected = localStorage.getItem(GEO_DETECTED_KEY)
      if (geoDetected) return

      // Detect country from IP for SEO optimization
      try {
        const response = await fetch('https://ipapi.co/json/', { 
          signal: AbortSignal.timeout(3000) 
        })
        const data = await response.json()
        const countryCode = data.country_code

        if (countryCode) {
          const matchedLang = languages.find(lang => 
            lang.countries?.includes(countryCode)
          )

          if (matchedLang && matchedLang.code !== i18n.language) {
            await i18n.changeLanguage(matchedLang.code)
            localStorage.setItem(STORAGE_KEY, matchedLang.code)
            document.documentElement.lang = matchedLang.code
            document.documentElement.dir = matchedLang.code === 'ar' ? 'rtl' : 'ltr'
          }
        }

        localStorage.setItem(GEO_DETECTED_KEY, 'true')
      } catch (error) {
        localStorage.setItem(GEO_DETECTED_KEY, 'true')
      }
    }

    detectLanguage()
  }, [i18n])

  // Fermer le dropdown au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const changeLanguage = async (langCode: string) => {
    setIsOpen(false)

    if (langCode === currentLanguage) {
      return
    }

    setIsChanging(true)

    // Save preference to localStorage
    localStorage.setItem(STORAGE_KEY, langCode)

    // Change language in i18next
    await i18n.changeLanguage(langCode)

    // Handle RTL for Arabic
    const selectedLang = languages.find(l => l.code === langCode)
    document.documentElement.setAttribute('dir', selectedLang?.rtl ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', langCode)

    setTimeout(() => setIsChanging(false), 300)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-all ${
          isChanging ? 'animate-pulse' : ''
        }`}
        aria-label={t('language.switchLabel')}
        disabled={isChanging}
      >
        <Globe className={`h-4 w-4 ${isChanging ? 'animate-spin' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg z-50 dark:border-gray-700 dark:bg-gray-800 animate-slide-down">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              disabled={isChanging}
              className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                currentLanguage === lang.code
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 font-semibold'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
              {currentLanguage === lang.code && (
                <Check className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
