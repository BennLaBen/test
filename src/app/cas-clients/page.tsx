'use client'

import { motion } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { Testimonials } from '@/components/sections/Testimonials'
import { BarChart3, ThumbsUp, Star, Award, Shield, Target } from 'lucide-react'

export default function CasClientsPage() {
  
  // Statistiques de satisfaction
  const satisfactionStats = [
    { label: 'Taux de satisfaction global', value: '98%', icon: ThumbsUp, color: 'from-green-500 to-green-600' },
    { label: 'Recommandation client', value: '96%', icon: Star, color: 'from-amber-500 to-amber-600' },
    { label: 'Respect des délais', value: '94%', icon: Target, color: 'from-blue-500 to-blue-600' },
    { label: 'Qualité produits', value: '99%', icon: Award, color: 'from-purple-500 to-purple-600' },
  ]

  // Sondages détaillés
  const surveys = [
    { question: 'Qualité de nos prestations', score: 4.9, max: 5 },
    { question: 'Réactivité et communication', score: 4.8, max: 5 },
    { question: 'Expertise technique', score: 4.9, max: 5 },
    { question: 'Rapport qualité/prix', score: 4.7, max: 5 },
    { question: 'Support après-vente', score: 4.8, max: 5 },
  ]

  // Secteurs d'activité (anonymisés)
  const sectors = [
    { name: 'Aéronautique', clients: '70+', satisfaction: '98%' },
    { name: 'Défense', clients: '25+', satisfaction: '97%' },
    { name: 'Industrie', clients: '40+', satisfaction: '96%' },
    { name: 'Énergie', clients: '15+', satisfaction: '95%' },
  ]
  
  return (
    <>
      <SEO
        title="Ils nous font confiance - Satisfaction Client"
        description="Découvrez les résultats de nos enquêtes de satisfaction client et pourquoi plus de 150 entreprises nous font confiance."
        canonical="/cas-clients"
      />

      {/* Hero */}
      <section id="clients-hero" className="bg-gradient-to-br from-primary-600 to-primary-800 py-20 text-white dark:from-primary-700 dark:to-primary-900 lg:py-32">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold backdrop-blur-sm">
              Satisfaction Client
            </span>
            <h1 className="mb-6 text-4xl font-bold lg:text-6xl">
              Ils nous font confiance
            </h1>
            <p className="text-lg text-primary-100 lg:text-xl">
              Plus de 150 clients dans 4 secteurs d'activité nous font confiance pour leurs projets critiques
            </p>
          </div>
        </div>
      </section>

      {/* Statistics de satisfaction */}
      <section id="statistiques" className="bg-white py-20 dark:bg-gray-900">
        <div className="container">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">
              Résultats de nos enquêtes de satisfaction
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Basés sur plus de 200 réponses collectées en 2024
            </p>
          </div>

          {/* Cards statistiques */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {satisfactionStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card group relative overflow-hidden p-6 text-center"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                  <div className="relative">
                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-750">
                      <Icon className={`h-8 w-8 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
                    </div>
                    <div className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Sondages détaillés */}
      <section id="sondages" className="bg-gray-50 py-20 dark:bg-gray-800">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                <BarChart3 className="mb-2 inline-block h-8 w-8 text-primary-600" />
                <br />
                Évaluations détaillées
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Notation moyenne sur 5 étoiles
              </p>
            </div>

            <div className="glass-card space-y-6 p-8">
              {surveys.map((survey, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {survey.question}
                    </span>
                    <span className="text-2xl font-bold text-primary-600">
                      {survey.score}/{survey.max}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(survey.score / survey.max) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Note de confidentialité */}
      <section id="confidentialite" className="bg-gradient-to-br from-gray-100 to-gray-50 py-16 dark:from-gray-800 dark:to-gray-900">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card mx-auto max-w-3xl p-8 text-center"
          >
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
              <Shield className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Confidentialité garantie
            </h3>
            <p className="leading-relaxed text-gray-600 dark:text-gray-300">
              Par respect pour nos clients et pour des raisons de confidentialité, nous ne mentionnons pas publiquement les noms de nos partenaires. Les données ci-dessous sont issues d'enquêtes réelles menées auprès de nos clients actifs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Secteurs d'activité */}
      <section id="secteurs" className="bg-white py-20 dark:bg-gray-900">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">
              Nos secteurs d'activité
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Clients confidentiels dans 4 secteurs stratégiques
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {sectors.map((sector, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <div className="mb-4 text-5xl font-bold text-gradient">{sector.clients}</div>
                <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{sector.name}</h3>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-300">
                  <ThumbsUp className="h-4 w-4" />
                  {sector.satisfaction} satisfaits
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages anonymisés */}
      <Testimonials />

    </>
  )
}
