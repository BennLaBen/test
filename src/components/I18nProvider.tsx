"use client"

import { useEffect, useState } from 'react'
import i18next, { Resource } from 'i18next'
import { initReactI18next, I18nextProvider } from 'react-i18next'
import frCommon from '@/i18n/locales/fr/common.json'
import enCommon from '@/i18n/locales/en/common.json'
import frHomepage from '@/i18n/locales/fr/homepage.json'
import enHomepage from '@/i18n/locales/en/homepage.json'
import frExpertises from '@/i18n/locales/fr/expertises.json'
import enExpertises from '@/i18n/locales/en/expertises.json'
import frTestimonials from '@/i18n/locales/fr/testimonials.json'
import enTestimonials from '@/i18n/locales/en/testimonials.json'
import frBrochure from '@/i18n/locales/fr/brochure.json'
import enBrochure from '@/i18n/locales/en/brochure.json'
import frVision from '@/i18n/locales/fr/vision.json'
import enVision from '@/i18n/locales/en/vision.json'
import frContact from '@/i18n/locales/fr/contact.json'
import enContact from '@/i18n/locales/en/contact.json'
import frBlog from '@/i18n/locales/fr/blog.json'
import enBlog from '@/i18n/locales/en/blog.json'
import frCases from '@/i18n/locales/fr/cases.json'
import enCases from '@/i18n/locales/en/cases.json'
import frCareers from '@/i18n/locales/fr/careers.json'
import enCareers from '@/i18n/locales/en/careers.json'

type Props = {
  children: React.ReactNode
  locale?: 'fr' | 'en'
}

const resources: Resource = {
  fr: { 
    common: frCommon, 
    homepage: frHomepage,
    expertises: frExpertises,
    testimonials: frTestimonials,
    brochure: frBrochure,
    vision: frVision,
    contact: frContact,
    blog: frBlog,
    cases: frCases,
    careers: frCareers
  },
  en: { 
    common: enCommon, 
    homepage: enHomepage,
    expertises: enExpertises,
    testimonials: enTestimonials,
    brochure: enBrochure,
    vision: enVision,
    contact: enContact,
    blog: enBlog,
    cases: enCases,
    careers: enCareers
  },
}

// Initialiser i18next une seule fois au chargement du module
if (!i18next.isInitialized) {
  i18next
    .use(initReactI18next)
    .init({
      lng: 'fr',
      fallbackLng: 'fr',
      defaultNS: 'common',
      ns: ['common', 'homepage', 'expertises', 'testimonials', 'brochure', 'vision', 'contact', 'blog', 'cases', 'careers'],
      resources,
      interpolation: { escapeValue: false },
      react: { 
        useSuspense: false,
        bindI18n: 'languageChanged loaded',
        bindI18nStore: 'added removed',
      },
    })
}

export function I18nProvider({ children, locale = 'fr' }: Props) {
  const [ready, setReady] = useState(false)
  const [currentLang, setCurrentLang] = useState(locale)

  useEffect(() => {
    console.log('🔧 [I18nProvider] Current i18next language:', i18next.language)
    console.log('🔧 [I18nProvider] Target locale:', locale)
    
    // Changer la langue et forcer le re-render
    if (i18next.language !== locale) {
      console.log('🔧 [I18nProvider] Changing language to:', locale)
      i18next.changeLanguage(locale).then(() => {
        console.log('✅ [I18nProvider] Language changed successfully to:', locale)
        setCurrentLang(locale)
        setReady(true)
      })
    } else {
      console.log('✅ [I18nProvider] Language already set to:', locale)
      setReady(true)
    }
  }, [locale])

  // Utiliser currentLang comme clé pour forcer le re-render complet
  if (!ready) return null

  return <I18nextProvider i18n={i18next} key={currentLang}>{children}</I18nextProvider>
}


