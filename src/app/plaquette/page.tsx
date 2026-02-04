'use client'

import { motion } from 'framer-motion'
import { FileText, Download, Clock, Bell, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { SEO } from '@/components/SEO'

export default function PlaquettePage() {
  const { t } = useTranslation('common')

  return (
    <>
      <SEO 
        title={t('brochure.pageTitle')} 
        description={t('brochure.pageDescription')} 
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 text-white overflow-hidden">
        {/* Fond animé */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Grille */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          
          {/* Particules flottantes */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -50, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}

          {/* Cercles lumineux */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          />
        </div>

        {/* Contenu principal */}
        <div className="relative z-10 container mx-auto px-4 py-20 min-h-screen flex flex-col items-center justify-center">
          
          {/* Bouton retour */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-8 left-4 sm:left-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('brochure.backHome')}
            </Link>
          </motion.div>

          {/* Icône animée */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative mb-8"
          >
            {/* Cercle pulsant */}
            <motion.div
              className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0.2, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Icône document */}
            <div className="relative w-32 h-32 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/30 border border-blue-400/30">
              <FileText className="h-16 w-16 text-white" />
              
              {/* Badge horloge */}
              <motion.div
                className="absolute -top-2 -right-2 w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center shadow-lg"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Clock className="h-5 w-5 text-white" />
              </motion.div>
            </div>
          </motion.div>

          {/* Titre principal */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-center mb-4 uppercase tracking-tight"
          >
            <span className="bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
              {t('brochure.title')}
            </span>
          </motion.h1>

          {/* Sous-titre */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl sm:text-2xl text-blue-300 font-light text-center mb-8"
          >
            {t('brochure.subtitle')}
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 text-center max-w-2xl mb-12 text-lg"
          >
            {t('brochure.description')}
          </motion.p>

          {/* Barre de progression animée */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: '100%' }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="w-full max-w-md mb-8"
          >
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 rounded-full"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{ width: '50%' }}
              />
            </div>
            <p className="text-center text-sm text-gray-500 mt-2 font-mono">
              {t('brochure.inProgress')}
            </p>
          </motion.div>

          {/* Bouton notification */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl font-bold uppercase tracking-wider text-white shadow-xl shadow-blue-500/30 overflow-hidden"
          >
            {/* Effet shine */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-200%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
            
            <Bell className="h-5 w-5 relative z-10" />
            <span className="relative z-10">{t('brochure.notifyMe')}</span>
          </motion.button>

          {/* Info supplémentaire */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 flex flex-wrap justify-center gap-8 text-center"
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-2">
                <Download className="h-6 w-6 text-blue-400" />
              </div>
              <p className="text-sm text-gray-400">{t('brochure.feature1')}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-2">
                <FileText className="h-6 w-6 text-blue-400" />
              </div>
              <p className="text-sm text-gray-400">{t('brochure.feature2')}</p>
            </div>
          </motion.div>

        </div>
      </div>
    </>
  )
}
