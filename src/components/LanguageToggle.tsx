'use client'

import { useState, useEffect, useRef } from 'react'
import { Globe, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
]

export function LanguageToggle() {
  const [isOpen, setIsOpen] = useState(false)
  const [isChanging, setIsChanging] = useState(false)
  const { t, i18n } = useTranslation('common')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLanguage = i18n.language

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
    console.log('🔄 [LanguageToggle] Changement de langue vers:', langCode)
    console.log('🔄 [LanguageToggle] Current language:', currentLanguage)
    
    setIsOpen(false)

    if (langCode === currentLanguage) {
      console.log('⚠️ [LanguageToggle] Langue déjà sélectionnée, aucun changement')
      return
    }

    setIsChanging(true)

    // Changer la langue dans i18next (SANS navigation)
    await i18n.changeLanguage(langCode)
    console.log('✅ [LanguageToggle] Langue changée avec succès vers:', langCode)

    // Réinitialiser après un délai court
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
