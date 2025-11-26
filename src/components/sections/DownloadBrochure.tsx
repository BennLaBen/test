'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { 
  Download, 
  FileText, 
  Factory,
  Award,
  Ruler,
  MonitorCheck,
  Settings,
  Lock
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { AuthModal } from '@/components/auth/AuthModal'

const iconMap = [Factory, MonitorCheck, Award, Ruler, Settings, Factory]

export function DownloadBrochure() {
  const { t } = useTranslation('brochure')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [showAuthModal, setShowAuthModal] = useState(false)
  
  const { isAuthenticated, user } = useAuth()
  const items = t('items', { returnObjects: true }) as any[]

  const handleDownload = (itemTitle: string) => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    
    // Simulation de téléchargement
    alert(`✅ Téléchargement démarré !\n\n📄 ${itemTitle}\n👤 ${user?.firstName} ${user?.lastName}\n📧 ${user?.email}\n\nMerci de votre confiance !`)
  }

  const handleDownloadComplete = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    
    alert(`✅ Téléchargement de la plaquette complète démarré !\n\n👤 ${user?.firstName} ${user?.lastName}\n📧 ${user?.email}\n\nMerci de votre confiance !`)
  }

  return (
    <section id="telechargements" ref={ref} className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="chip mb-4 inline-flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {t('badge')}
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-muted-strong sm:text-4xl mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-muted max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {items.map((item: any, index: number) => {
            const Icon = iconMap[index]
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card group p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-500/15 text-primary-600 group-hover:bg-primary-500/25 transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-muted-strong mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted">
                      {item.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-muted">{item.size}</span>
                  <button
                    onClick={() => handleDownload(item.title)}
                    className="btn-secondary btn-secondary--sm inline-flex items-center gap-2"
                  >
                    {isAuthenticated ? (
                      <>
                        <Download className="h-4 w-4" />
                        {t('downloadButton')}
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        Se connecter
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Download Complete Brochure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <button
            onClick={handleDownloadComplete}
            className="btn-primary inline-flex items-center gap-2"
          >
            {isAuthenticated ? (
              <>
                <Download className="h-5 w-5" />
                {t('downloadAll')}
              </>
            ) : (
              <>
                <Lock className="h-5 w-5" />
                Se connecter pour télécharger
              </>
            )}
          </button>
          {isAuthenticated && user && (
            <p className="mt-4 text-sm text-muted">
              Connecté en tant que <span className="font-semibold text-primary-600">{user.firstName} {user.lastName}</span>
            </p>
          )}
        </motion.div>

        {/* Auth Modal */}
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          defaultMode="signup"
        />
      </div>
    </section>
  )
}
