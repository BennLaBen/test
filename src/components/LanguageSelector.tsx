'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type SupportedLocale = 'fr' | 'en' | 'es' | 'pt-BR' | 'ar'

interface Language {
  code: SupportedLocale
  name: string
  nativeName: string
  flag: string
  countries: string[]
}

const languages: Language[] = [
  { 
    code: 'fr', 
    name: 'French', 
    nativeName: 'Français', 
    flag: '🇫🇷',
    countries: ['FR', 'BE', 'CH', 'CA', 'LU', 'MC', 'SN', 'CI', 'ML', 'BF', 'NE', 'TG', 'BJ', 'GA', 'CG', 'CD', 'MG', 'CM', 'DZ', 'TN', 'MA']
  },
  { 
    code: 'en', 
    name: 'English', 
    nativeName: 'English', 
    flag: '🇬🇧',
    countries: ['US', 'GB', 'AU', 'NZ', 'IE', 'ZA', 'IN', 'PH', 'SG', 'MY', 'NG', 'KE', 'GH', 'PK']
  },
  { 
    code: 'es', 
    name: 'Spanish', 
    nativeName: 'Español', 
    flag: '🇪🇸',
    countries: ['ES', 'MX', 'AR', 'CO', 'PE', 'VE', 'CL', 'EC', 'GT', 'CU', 'BO', 'DO', 'HN', 'PY', 'SV', 'NI', 'CR', 'PA', 'UY']
  },
  { 
    code: 'pt-BR', 
    name: 'Portuguese', 
    nativeName: 'Português', 
    flag: '🇧🇷',
    countries: ['BR', 'PT', 'AO', 'MZ', 'CV', 'GW', 'ST', 'TL']
  },
  { 
    code: 'ar', 
    name: 'Arabic', 
    nativeName: 'العربية', 
    flag: '🇸🇦',
    countries: ['SA', 'AE', 'EG', 'IQ', 'JO', 'KW', 'LB', 'LY', 'OM', 'QA', 'SY', 'YE', 'BH', 'PS', 'SD']
  },
]

const STORAGE_KEY = 'lledo-preferred-language'
const GEO_DETECTED_KEY = 'lledo-geo-detected'

export function LanguageSelector() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState<Language>(languages[0])
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Detect language from country on first visit
  useEffect(() => {
    const detectLanguage = async () => {
      // Check if user already has a preference
      const savedLang = localStorage.getItem(STORAGE_KEY)
      if (savedLang) {
        const lang = languages.find(l => l.code === savedLang)
        if (lang) {
          setCurrentLang(lang)
          if (i18n.language !== lang.code) {
            await i18n.changeLanguage(lang.code)
          }
          return
        }
      }

      // Check if we already detected geo
      const geoDetected = localStorage.getItem(GEO_DETECTED_KEY)
      if (geoDetected) {
        return
      }

      // Detect country from IP (free API)
      try {
        const response = await fetch('https://ipapi.co/json/', { 
          signal: AbortSignal.timeout(3000) 
        })
        const data = await response.json()
        const countryCode = data.country_code

        if (countryCode) {
          // Find matching language for this country
          const matchedLang = languages.find(lang => 
            lang.countries.includes(countryCode)
          )

          if (matchedLang && matchedLang.code !== i18n.language) {
            setCurrentLang(matchedLang)
            await i18n.changeLanguage(matchedLang.code)
            localStorage.setItem(STORAGE_KEY, matchedLang.code)
          }
        }

        localStorage.setItem(GEO_DETECTED_KEY, 'true')
      } catch (error) {
        console.log('Geo detection failed, using default language')
        localStorage.setItem(GEO_DETECTED_KEY, 'true')
      }
    }

    detectLanguage()
  }, [i18n])

  // Sync with i18n language changes
  useEffect(() => {
    const lang = languages.find(l => l.code === i18n.language)
    if (lang) {
      setCurrentLang(lang)
    }
  }, [i18n.language])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLanguageChange = async (lang: Language) => {
    setCurrentLang(lang)
    setIsOpen(false)
    localStorage.setItem(STORAGE_KEY, lang.code)
    await i18n.changeLanguage(lang.code)
    
    // Update HTML lang attribute for SEO
    document.documentElement.lang = lang.code
    
    // Update dir attribute for RTL languages
    document.documentElement.dir = lang.code === 'ar' ? 'rtl' : 'ltr'
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <span className="text-lg">{currentLang.flag}</span>
        <span className="hidden sm:inline text-sm font-medium">{currentLang.nativeName}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 rounded-xl bg-gray-900/95 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden z-50"
          >
            <div className="py-1">
              {languages.map((lang) => (
                <motion.button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10 transition-colors ${
                    currentLang.code === lang.code ? 'bg-blue-500/20 text-blue-300' : 'text-white'
                  }`}
                  whileHover={{ x: 4 }}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{lang.nativeName}</div>
                    <div className="text-xs text-gray-400">{lang.name}</div>
                  </div>
                  {currentLang.code === lang.code && (
                    <Check className="h-4 w-4 text-blue-400" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Compact version for mobile/footer
export function LanguageSelectorCompact() {
  const { i18n } = useTranslation()
  const [currentLang, setCurrentLang] = useState<Language>(languages[0])

  useEffect(() => {
    const lang = languages.find(l => l.code === i18n.language)
    if (lang) setCurrentLang(lang)
  }, [i18n.language])

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = languages.find(l => l.code === e.target.value)
    if (lang) {
      setCurrentLang(lang)
      localStorage.setItem(STORAGE_KEY, lang.code)
      await i18n.changeLanguage(lang.code)
      document.documentElement.lang = lang.code
      document.documentElement.dir = lang.code === 'ar' ? 'rtl' : 'ltr'
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-gray-400" />
      <select
        value={currentLang.code}
        onChange={handleChange}
        className="bg-transparent text-sm text-gray-300 border-none focus:outline-none cursor-pointer"
        aria-label="Select language"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-gray-900">
            {lang.flag} {lang.nativeName}
          </option>
        ))}
      </select>
    </div>
  )
}
