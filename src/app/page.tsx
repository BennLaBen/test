'use client'

import { Hero } from '@/components/sections/Hero'
import { Features } from '@/components/sections/Features'
import { Process } from '@/components/sections/Process'
import { CTA } from '@/components/sections/CTA'
import { SEO } from '@/components/SEO'
import { generateJsonLd } from '@/lib/jsonLd'
import { useTranslation } from 'react-i18next'

export default function HomePage() {
  const { t } = useTranslation('common')
  const jsonLd = generateJsonLd({
    type: 'Organization',
    data: {
      name: 'LLEDO Industries',
      url: 'https://lledo-industries.com',
      logo: 'https://lledo-industries.com/logo.png',
      description: 'LLEDO Industries - Groupe industriel intégré : ingénierie, usinage de précision et maintenance pour l\'aéronautique et la défense.',
      address: {
        streetAddress: '9-11 Boulevard de la Capelane',
        addressLocality: 'Les Pennes-Mirabeau',
        postalCode: '13170',
        addressCountry: 'FR',
      },
      contactPoint: {
        telephone: '+33-4-42-02-96-74',
        contactType: 'customer service',
        email: 'contact@mpeb13.com',
      },
      sameAs: [
        'https://www.linkedin.com/company/lledo-industries',
        'https://www.youtube.com/channel/lledo-industries',
      ],
    },
  })

  return (
    <>
      <SEO
        title={t('seo.home.title')}
        description={t('seo.home.description')}
        canonical="/"
        jsonLd={jsonLd}
      />
      <Hero />
      <Features />
      <Process />
      <CTA />
    </>
  )
}
