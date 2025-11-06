import { Hero } from '@/components/sections/Hero'
import { Features } from '@/components/sections/Features'
import { Expertises } from '@/components/sections/Expertises'
import { Process } from '@/components/sections/Process'
import { Testimonials } from '@/components/sections/Testimonials'
import { DownloadBrochure } from '@/components/sections/DownloadBrochure'
import { FAQ } from '@/components/sections/FAQ'
import { CTA } from '@/components/sections/CTA'
import { SEO } from '@/components/SEO'
import { generateJsonLd } from '@/lib/jsonLd'

export default function HomePage() {
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
        title="LLEDO Industries - Ingénierie, Usinage & Maintenance | Aéronautique & Défense"
        description="LLEDO Industries - Groupe industriel intégré : ingénierie, usinage de précision et maintenance pour l'aéronautique et la défense. 70 collaborateurs, certifié ISO 9001 & EN 9100."
        canonical="/"
        jsonLd={jsonLd}
      />
      <Hero />
      <Features />
      <Expertises />
      <Process />
      <Testimonials />
      <DownloadBrochure />
      <FAQ />
      <CTA />
    </>
  )
}
