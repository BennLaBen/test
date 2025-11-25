'use client'

import { Expertises } from '@/components/sections/Expertises'
import { Process } from '@/components/sections/Process'
import { DownloadBrochure } from '@/components/sections/DownloadBrochure'
import { SEO } from '@/components/SEO'
import { generateJsonLd } from '@/lib/jsonLd'
import { useTranslation } from 'react-i18next'

export default function ExpertisesPage() {
  const { t } = useTranslation('expertises')
  
  const jsonLd = generateJsonLd({
    type: 'Organization',
    data: {
      name: 'LLEDO Industries - Groupe Industriel',
      url: 'https://lledo-industries.com/nos-expertises',
      logo: 'https://lledo-industries.com/logo.png',
      description: 'Groupe industriel intégré : MPEB (usinage), EGI (études), FREM (maintenance), MGP (tôlerie)',
      address: {
        streetAddress: '9-11 Boulevard de la Capelane',
        addressLocality: 'Les Pennes-Mirabeau',
        postalCode: '13170',
        addressCountry: 'FR',
      },
      contactPoint: {
        telephone: '+33-4-42-02-96-74',
        contactType: 'customer service',
        email: 'contact@lledo-industries.com',
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
        title={t('title')}
        description={t('subtitle')}
        canonical="/nos-expertises"
        jsonLd={jsonLd}
      />
      <div className="pt-20">
        <Expertises />
        <Process />
        <DownloadBrochure />
      </div>
    </>
  )
}

