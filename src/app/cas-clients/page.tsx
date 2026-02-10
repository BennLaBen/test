'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { Testimonials } from '@/components/sections/Testimonials'
import { BarChart3, ThumbsUp, Star, Award, Shield, Target } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from 'react-i18next'

export default function CasClientsPage() {
  const { t } = useTranslation('testimonials')
  const { isAuthenticated } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)

  // Fonction pour ouvrir le formulaire d'avis (ou la modale de connexion si non connecté)
  const handleAddReviewClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
    } else {
      setShowReviewForm(true)
    }
  }
  
  
  // Points forts qualitatifs
  const satisfactionStats = [
    { label: t('page.stats.satisfaction.label'), value: t('page.stats.satisfaction.value'), icon: ThumbsUp, color: 'from-green-500 to-green-600' },
    { label: t('page.stats.recommendation.label'), value: t('page.stats.recommendation.value'), icon: Star, color: 'from-amber-500 to-amber-600' },
    { label: t('page.stats.deadlines.label'), value: t('page.stats.deadlines.value'), icon: Target, color: 'from-blue-500 to-blue-600' },
    { label: t('page.stats.quality.label'), value: t('page.stats.quality.value'), icon: Award, color: 'from-purple-500 to-purple-600' },
  ]

  // Critères qualitatifs
  const surveys = [
    { question: t('page.surveys.quality.question'), score: t('page.surveys.quality.score') },
    { question: t('page.surveys.reactivity.question'), score: t('page.surveys.reactivity.score') },
    { question: t('page.surveys.expertise.question'), score: t('page.surveys.expertise.score') },
    { question: t('page.surveys.value.question'), score: t('page.surveys.value.score') },
    { question: t('page.surveys.support.question'), score: t('page.surveys.support.score') },
  ]

  // Secteurs d'activité
  const sectors = [
    { name: t('page.sectors.aeronautics.name'), clients: t('page.sectors.aeronautics.clients'), satisfaction: t('page.sectors.aeronautics.satisfaction') },
    { name: t('page.sectors.defense.name'), clients: t('page.sectors.defense.clients'), satisfaction: t('page.sectors.defense.satisfaction') },
    { name: t('page.sectors.industry.name'), clients: t('page.sectors.industry.clients'), satisfaction: t('page.sectors.industry.satisfaction') },
    { name: t('page.sectors.energy.name'), clients: t('page.sectors.energy.clients'), satisfaction: t('page.sectors.energy.satisfaction') },
  ]
  
  return (
    <>
      <SEO
        title={t('page.seoTitle')}
        description={t('page.seoDescription')}
        canonical="/cas-clients"
      />

      {/* Hero - Style Tony Stark */}
      <section id="clients-hero" className="relative bg-gradient-to-br from-blue-900 via-gray-900 to-gray-900 py-12 text-white lg:py-16 overflow-hidden">
        {/* Grille industrielle */}
        <div className="absolute inset-0 opacity-10">
          <div 
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.4) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.4) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
            className="h-full w-full"
          />
        </div>

        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="mb-8 inline-flex items-center gap-3 px-6 py-3 bg-blue-500/20 backdrop-blur-xl border-2 border-blue-400/50 rounded-full"
              style={{
                boxShadow: '0 0 30px rgba(59, 130, 246, 0.6)'
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <ThumbsUp className="h-5 w-5 text-blue-300" />
              </motion.div>
              <span className="font-black text-white text-sm uppercase tracking-widest">
                {t('page.heroBadge')}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6 text-5xl font-black lg:text-7xl uppercase"
              style={{
                textShadow: '0 0 40px rgba(59, 130, 246, 0.8)',
                lineHeight: '1.2'
              }}
            >
              {t('page.heroTitle')}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-10"
            >
              {t('page.heroSubtitle')}
            </motion.p>

            {/* Bouton d'action Rapide - Donner un avis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <button 
                onClick={handleAddReviewClick}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-wider rounded-lg transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_50px_rgba(37,99,235,0.5)] hover:scale-105"
              >
                <Star className="h-5 w-5 fill-current" />
                {isAuthenticated ? t('page.evaluateServices') : t('page.loginToEvaluate')}
                <div className="absolute inset-0 rounded-lg ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics de satisfaction - Dark Mode */}
      <section id="statistiques" className="bg-gradient-to-b from-gray-900 to-gray-800 py-24 relative overflow-hidden">
        {/* Grille industrielle */}
        <div className="absolute inset-0 opacity-5">
          <div 
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.4) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.4) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
            className="h-full w-full"
          />
        </div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20 text-center"
          >
            <h2 className="mb-6 text-4xl font-black text-white lg:text-6xl uppercase"
              style={{
                textShadow: '0 0 30px rgba(59, 130, 246, 0.8)'
              }}
            >
              {t('page.surveysTitle')}
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-300">
              {t('page.surveysSubtitle')}
            </p>
          </motion.div>

          {/* Cards statistiques */}
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
            {satisfactionStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.05, y: -8 }}
                  className="relative overflow-hidden p-8 text-center bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-2xl"
                  style={{
                    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.15)',
                    willChange: 'transform'
                  }}
                >
                  {/* Scan line */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: index * 0.7 }}
                    style={{ willChange: 'transform' }}
                  />
                  
                  <div className="relative z-10">
                    <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="mb-3 text-5xl font-black text-white">{stat.value}</div>
                    <div className="text-sm text-gray-400 font-semibold uppercase tracking-wider">{stat.label}</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Sondages détaillés - Style Dashboard Industriel */}
      <section id="sondages" className="bg-gray-900 py-24 relative overflow-hidden border-t border-gray-800">
        <div className="absolute inset-0 opacity-5">
          <div style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.4) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} className="h-full w-full" />
        </div>

        <div className="container relative z-10">
          <motion.div 
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="mb-6 inline-block"
            >
              <BarChart3 className="h-12 w-12 text-blue-500" />
            </motion.div>
            <h2 className="mb-4 text-4xl font-black text-white uppercase tracking-tight lg:text-5xl">
              {t('page.analysisTitle')}
            </h2>
            <p className="text-blue-400 font-mono text-sm uppercase tracking-widest">
              {t('page.analysisSubtitle')}
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {surveys.map((survey, index) => {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, boxShadow: '0 10px 40px -10px rgba(59, 130, 246, 0.3)' }}
                  className="group relative flex flex-col items-center justify-center p-6 bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl hover:border-blue-500/50 transition-colors"
                >
                  {/* Titre */}
                  <h3 className="mb-6 h-12 flex items-center justify-center text-center font-bold text-white uppercase text-sm tracking-wider">
                    {survey.question}
                  </h3>

                  {/* Badge qualitatif */}
                  <div className="relative h-32 w-32 flex items-center justify-center mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-500/30" />
                    <div className="absolute inset-2 rounded-full border-2 border-blue-400/20" />
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-black text-white text-center">{survey.score}</span>
                    </div>
                  </div>

                  {/* Barre visuelle bas */}
                  <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden mt-auto">
                    <motion.div 
                      className="h-full bg-blue-500"
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      transition={{ duration: 1, delay: 1 }}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Note de confidentialité - Dark Mode */}
      <section id="confidentialite" className="bg-gray-900 py-16 border-t border-gray-800">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card mx-auto max-w-3xl p-8 text-center bg-blue-900/10 border border-blue-500/20 rounded-2xl"
          >
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 border border-blue-400/30">
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="mb-4 text-2xl font-black text-white uppercase">
              {t('page.confidentialityTitle')}
            </h3>
            <p className="leading-relaxed text-gray-400">
              {t('page.confidentialityText')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Témoignages anonymisés */}
      <Testimonials 
        externalShowAuthModal={showAuthModal}
        externalSetShowAuthModal={setShowAuthModal}
        externalShowReviewForm={showReviewForm}
        externalSetShowReviewForm={setShowReviewForm}
      />

      {/* Nos secteurs d'activité */}
      <section id="secteurs" className="bg-gradient-to-b from-gray-800 to-gray-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.4) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} className="h-full w-full" />
        </div>

        <div className="container relative z-10">
          <motion.div 
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-4xl font-black text-white lg:text-6xl uppercase"
              style={{ textShadow: '0 0 30px rgba(59, 130, 246, 0.8)' }}
            >
              {t('page.sectorsTitle')}
            </h2>
            <p className="text-gray-300 text-lg">
              {t('page.sectorsSubtitle')}
            </p>
          </motion.div>

          <div className="grid gap-6 sm:gap-8 grid-cols-2 lg:grid-cols-4">
            {sectors.map((sector, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="p-6 sm:p-8 text-center bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-2xl relative overflow-hidden"
                style={{ boxShadow: '0 8px 32px rgba(59, 130, 246, 0.15)', willChange: 'transform' }}
              >
                <div className="relative z-10">
                  <h3 className="mb-3 text-xl sm:text-2xl font-black text-white uppercase">{sector.name}</h3>
                  <div className="text-sm text-blue-300 font-semibold">{sector.clients}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </>
  )
}
