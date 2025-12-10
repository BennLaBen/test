'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { Testimonials } from '@/components/sections/Testimonials'
import { BarChart3, ThumbsUp, Star, Award, Shield, Target } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function CasClientsPage() {
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

      {/* Hero - Style Tony Stark */}
      <section id="clients-hero" className="relative bg-gradient-to-br from-blue-900 via-gray-900 to-gray-900 py-24 text-white lg:py-32 overflow-hidden">
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
                Satisfaction Client
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
              Ils nous font confiance
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-10"
            >
              Plus de 150 clients dans 4 secteurs d'activité nous font confiance pour leurs projets critiques
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
                {isAuthenticated ? 'Évaluer nos services' : 'Se connecter pour évaluer'}
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
              Résultats de nos enquêtes
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-300">
              Basés sur plus de 200 réponses collectées en 2024
            </p>
          </motion.div>

          {/* Cards statistiques */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
              Analyse Détaillée
            </h2>
            <p className="text-blue-400 font-mono text-sm uppercase tracking-widest">
              Données temps réel • Base de sondage 2024
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {surveys.map((survey, index) => {
              const percentage = (survey.score / survey.max) * 100
              const radius = 30
              const circumference = 2 * Math.PI * radius
              const strokeDashoffset = circumference - (percentage / 100) * circumference

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

                  {/* Jauge Circulaire */}
                  <div className="relative h-32 w-32 flex items-center justify-center mb-4">
                    {/* Cercle de fond */}
                    <svg className="absolute inset-0 h-full w-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        className="text-gray-700"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="50"
                        cy="50"
                      />
                      {/* Cercle de progression */}
                      <motion.circle
                        className="text-blue-500"
                        strokeWidth="8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="50"
                        cy="50"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        whileInView={{ strokeDashoffset: strokeDashoffset }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                      />
                    </svg>
                    
                    {/* Score au centre */}
                    <div className="flex flex-col items-center">
                      <span className="text-3xl font-black text-white">{survey.score}</span>
                      <span className="text-[10px] text-gray-500 font-bold">SUR 5</span>
                    </div>
                  </div>

                  {/* Barre visuelle bas */}
                  <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden mt-auto">
                    <motion.div 
                      className="h-full bg-blue-500"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${percentage}%` }}
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
              Confidentialité garantie
            </h3>
            <p className="leading-relaxed text-gray-400">
              Par respect pour nos clients et pour des raisons de confidentialité, nous ne mentionnons pas publiquement les noms de nos partenaires. Les données ci-dessous sont issues d'enquêtes réelles menées auprès de nos clients actifs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Secteurs d'activité - Dark Mode */}
      <section id="secteurs" className="bg-gradient-to-b from-gray-900 to-gray-800 py-24 relative overflow-hidden">
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
              Nos secteurs d'activité
            </h2>
            <p className="text-gray-300 text-lg">
              Clients confidentiels dans 4 secteurs stratégiques
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {sectors.map((sector, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -8 }}
                className="p-8 text-center bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-2xl relative overflow-hidden"
                style={{ boxShadow: '0 8px 32px rgba(59, 130, 246, 0.15)', willChange: 'transform' }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: index * 1 }}
                  style={{ willChange: 'transform' }}
                />
                
                <div className="relative z-10">
                  <div className="mb-4 text-6xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{sector.clients}</div>
                  <h3 className="mb-4 text-2xl font-black text-white uppercase">{sector.name}</h3>
                  <div className="inline-flex items-center gap-2 rounded-full bg-green-500/20 backdrop-blur-sm border border-green-400/30 px-5 py-2.5 text-sm font-bold text-green-300">
                    <ThumbsUp className="h-4 w-4" />
                    {sector.satisfaction} satisfaits
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages anonymisés */}
      <Testimonials 
        externalShowAuthModal={showAuthModal}
        externalSetShowAuthModal={setShowAuthModal}
        externalShowReviewForm={showReviewForm}
        externalSetShowReviewForm={setShowReviewForm}
      />

    </>
  )
}
