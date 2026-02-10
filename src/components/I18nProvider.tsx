"use client"

import { useEffect, useState } from 'react'
import i18next, { Resource } from 'i18next'
import { initReactI18next, I18nextProvider } from 'react-i18next'

// FR
import frCommon from '@/i18n/locales/fr/common.json'
import frHomepage from '@/i18n/locales/fr/homepage.json'
import frExpertises from '@/i18n/locales/fr/expertises.json'
import frTestimonials from '@/i18n/locales/fr/testimonials.json'
import frBrochure from '@/i18n/locales/fr/brochure.json'
import frVision from '@/i18n/locales/fr/vision.json'
import frContact from '@/i18n/locales/fr/contact.json'
import frBlog from '@/i18n/locales/fr/blog.json'
import frCases from '@/i18n/locales/fr/cases.json'
import frCareers from '@/i18n/locales/fr/careers.json'
import frSeo from '@/i18n/locales/fr/seo.json'

// EN
import enCommon from '@/i18n/locales/en/common.json'
import enHomepage from '@/i18n/locales/en/homepage.json'
import enExpertises from '@/i18n/locales/en/expertises.json'
import enTestimonials from '@/i18n/locales/en/testimonials.json'
import enBrochure from '@/i18n/locales/en/brochure.json'
import enVision from '@/i18n/locales/en/vision.json'
import enContact from '@/i18n/locales/en/contact.json'
import enBlog from '@/i18n/locales/en/blog.json'
import enCases from '@/i18n/locales/en/cases.json'
import enCareers from '@/i18n/locales/en/careers.json'
import enSeo from '@/i18n/locales/en/seo.json'

// ES
import esCommon from '@/i18n/locales/es/common.json'
import esHomepage from '@/i18n/locales/es/homepage.json'
import esExpertises from '@/i18n/locales/es/expertises.json'
import esTestimonials from '@/i18n/locales/es/testimonials.json'
import esBrochure from '@/i18n/locales/es/brochure.json'
import esVision from '@/i18n/locales/es/vision.json'
import esContact from '@/i18n/locales/es/contact.json'
import esBlog from '@/i18n/locales/es/blog.json'
import esCases from '@/i18n/locales/es/cases.json'
import esCareers from '@/i18n/locales/es/careers.json'
import esSeo from '@/i18n/locales/es/seo.json'

// PT-BR
import ptBRCommon from '@/i18n/locales/pt-BR/common.json'
import ptBRHomepage from '@/i18n/locales/pt-BR/homepage.json'
import ptBRExpertises from '@/i18n/locales/pt-BR/expertises.json'
import ptBRTestimonials from '@/i18n/locales/pt-BR/testimonials.json'
import ptBRBrochure from '@/i18n/locales/pt-BR/brochure.json'
import ptBRVision from '@/i18n/locales/pt-BR/vision.json'
import ptBRContact from '@/i18n/locales/pt-BR/contact.json'
import ptBRBlog from '@/i18n/locales/pt-BR/blog.json'
import ptBRCases from '@/i18n/locales/pt-BR/cases.json'
import ptBRCareers from '@/i18n/locales/pt-BR/careers.json'
import ptBRSeo from '@/i18n/locales/pt-BR/seo.json'

// AR
import arCommon from '@/i18n/locales/ar/common.json'
import arHomepage from '@/i18n/locales/ar/homepage.json'
import arExpertises from '@/i18n/locales/ar/expertises.json'
import arTestimonials from '@/i18n/locales/ar/testimonials.json'
import arBrochure from '@/i18n/locales/ar/brochure.json'
import arVision from '@/i18n/locales/ar/vision.json'
import arContact from '@/i18n/locales/ar/contact.json'
import arBlog from '@/i18n/locales/ar/blog.json'
import arCases from '@/i18n/locales/ar/cases.json'
import arCareers from '@/i18n/locales/ar/careers.json'
import arSeo from '@/i18n/locales/ar/seo.json'

export type SupportedLocale = 'fr' | 'en' | 'es' | 'pt-BR' | 'ar'

type Props = {
  children: React.ReactNode
  locale?: SupportedLocale
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
    careers: frCareers,
    seo: frSeo
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
    careers: enCareers,
    seo: enSeo
  },
  es: { 
    common: esCommon, 
    homepage: esHomepage,
    expertises: esExpertises,
    testimonials: esTestimonials,
    brochure: esBrochure,
    vision: esVision,
    contact: esContact,
    blog: esBlog,
    cases: esCases,
    careers: esCareers,
    seo: esSeo
  },
  'pt-BR': { 
    common: ptBRCommon, 
    homepage: ptBRHomepage,
    expertises: ptBRExpertises,
    testimonials: ptBRTestimonials,
    brochure: ptBRBrochure,
    vision: ptBRVision,
    contact: ptBRContact,
    blog: ptBRBlog,
    cases: ptBRCases,
    careers: ptBRCareers,
    seo: ptBRSeo
  },
  ar: { 
    common: arCommon, 
    homepage: arHomepage,
    expertises: arExpertises,
    testimonials: arTestimonials,
    brochure: arBrochure,
    vision: arVision,
    contact: arContact,
    blog: arBlog,
    cases: arCases,
    careers: arCareers,
    seo: arSeo
  },
}

// Configuration stricte pour détecter les clés manquantes
const isDev = process.env.NODE_ENV === 'development'

// Initialiser i18next une seule fois au chargement du module
if (!i18next.isInitialized) {
  i18next
    .use(initReactI18next)
    .init({
      lng: 'fr',
      // En dev: pas de fallback pour détecter les clés manquantes
      // En prod: fallback vers fr pour éviter les erreurs
      fallbackLng: isDev ? false : 'fr',
      defaultNS: 'common',
      ns: ['common', 'homepage', 'expertises', 'testimonials', 'brochure', 'vision', 'contact', 'blog', 'cases', 'careers', 'seo'],
      resources,
      
      // Configuration stricte
      returnEmptyString: false,
      returnNull: false,
      
      // Activer le tracking des clés manquantes
      saveMissing: isDev,
      missingKeyHandler: (lngs, ns, key, fallbackValue) => {
        if (isDev) {
          console.error(`\n🚨 [i18n] MISSING KEY DETECTED:`)
          console.error(`   Namespace: ${ns}`)
          console.error(`   Key: ${key}`)
          console.error(`   Languages: ${lngs.join(', ')}`)
          console.error(`   Fallback: ${fallbackValue}\n`)
        }
      },
      
      // Formater les clés manquantes de façon visible en dev
      parseMissingKeyHandler: (key: string) => {
        if (isDev) {
          return `⚠️ ${key}`
        }
        return key
      },
      
      interpolation: { escapeValue: false },
      react: { 
        useSuspense: false,
        bindI18n: 'languageChanged loaded',
        bindI18nStore: 'added removed',
      },
    })
    
  // Ensure admin nav keys are always present (workaround for webpack JSON cache)
  const adminNavKeys = { admins: 'Administrateurs' }
  const adminNavKeysEn = { admins: 'Administrators' }
  const adminNavKeysEs = { admins: 'Administradores' }
  const adminNavKeysPt = { admins: 'Administradores' }
  const adminNavKeysAr = { admins: 'المسؤولون' }
  i18next.addResourceBundle('fr', 'common', { admin: adminNavKeys }, true, true)
  i18next.addResourceBundle('en', 'common', { admin: adminNavKeysEn }, true, true)
  i18next.addResourceBundle('es', 'common', { admin: adminNavKeysEs }, true, true)
  i18next.addResourceBundle('pt-BR', 'common', { admin: adminNavKeysPt }, true, true)
  i18next.addResourceBundle('ar', 'common', { admin: adminNavKeysAr }, true, true)

  // Listener global pour les clés manquantes
  if (isDev) {
    i18next.on('missingKey', (lngs, namespace, key) => {
      console.warn(`🔍 [i18n] Missing: ${namespace}:${key} (${lngs})`)
    })
  }
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


