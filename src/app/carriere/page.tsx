'use client'

import { SEO } from '@/components/SEO'
import { useTranslation } from 'react-i18next'

export default function CareersPage() {
  const { t } = useTranslation('careers')
  
  return (
    <>
      <SEO
        title={t('title')}
        description={t('description')}
        canonical="/carriere"
      />
      
      <div className="bg-white dark:bg-gray-900">
        <div className="container section-padding">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
              {t('hero.title')}
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              {t('hero.subtitle')}
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Company Culture */}
            <div className="space-y-8">
              <div>
                <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                  Notre culture d'entreprise
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900">
                      <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Innovation</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Nous encourageons la créativité et l'innovation pour développer des solutions techniques de pointe.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900">
                      <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Équipe</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Nous travaillons ensemble dans un environnement collaboratif et bienveillant.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900">
                      <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Qualité</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Nous nous engageons pour l'excellence et la qualité dans tous nos projets.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900">
                      <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Formation</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Nous investissons dans la formation et le développement de nos collaborateurs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                  Nos avantages
                </h2>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center space-x-3">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Mutuelle d'entreprise</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Prévoyance</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Ticket restaurant</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Formation continue</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Horaires flexibles</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Parking gratuit</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Job Openings & Contact */}
            <div className="space-y-8">
              <div>
                <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                  Postes disponibles
                </h2>
                <div className="space-y-4">
                  <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Ingénieur Mécanique
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                      CDI • Temps plein • Les Pennes-Mirabeau
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      Conception et développement d'outillages aéronautiques
                    </p>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Technicien Usinage
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                      CDI • Temps plein • Les Pennes-Mirabeau
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      Usinage de précision sur machines 5 axes
                    </p>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Commercial Technique
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                      CDI • Temps plein • Région Sud
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      Développement commercial secteur aéronautique
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-primary-50 p-8 dark:bg-primary-900/20">
                <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                  Candidature spontanée
                </h2>
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                  Vous ne trouvez pas le poste qui vous correspond ? Envoyez-nous votre candidature spontanée.
                </p>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      <a href="mailto:rh@lledo-industries.com" className="hover:text-primary-600">
                        rh@lledo-industries.com
                      </a>
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Téléphone</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      <a href="tel:+33442029674" className="hover:text-primary-600">
                        +33 (4) 42 02 96 74
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
