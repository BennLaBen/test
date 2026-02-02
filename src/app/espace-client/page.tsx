'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { 
  User, 
  Briefcase, 
  FileText, 
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Loader2
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface Application {
  id: string
  firstName: string
  lastName: string
  email: string
  status: string
  createdAt: string
  job: {
    title: string
    slug: string
  }
}

const statusLabels: Record<string, { label: string; color: string; icon: any }> = {
  NEW: { label: 'Nouvelle', color: 'bg-blue-100 text-blue-700', icon: Clock },
  IN_REVIEW: { label: 'En cours d\'examen', color: 'bg-amber-100 text-amber-700', icon: FileText },
  INTERVIEW: { label: 'Entretien prévu', color: 'bg-purple-100 text-purple-700', icon: User },
  ACCEPTED: { label: 'Acceptée', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  REJECTED: { label: 'Refusée', color: 'bg-red-100 text-red-700', icon: XCircle },
}

export default function EspaceClientPage() {
  const { data: session } = useSession()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation('common')

  useEffect(() => {
    async function fetchApplications() {
      try {
        const res = await fetch('/api/applications')
        const data = await res.json()
        if (data.success) {
          setApplications(data.applications)
        }
      } catch (err) {
        console.error('Error fetching applications:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  return (
    <>
      <SEO
        title={t('clientArea.title')}
        description={t('clientArea.description')}
      />

      <section className="py-12 lg:py-16">
        <div className="container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-3xl lg:text-4xl font-bold text-muted-strong mb-2">
              {t('clientArea.welcome')}, {session?.user?.firstName} !
            </h1>
            <p className="text-muted text-lg">
              {t('clientArea.description')}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="glass-card p-6 space-y-4">
                <h2 className="text-xl font-bold text-muted-strong mb-4">{t('clientArea.quickActions')}</h2>
                
                <Link
                  href="/espace-client/profil"
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-primary-600" />
                    <span className="font-medium">{t('auth.myProfile')}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
                </Link>

                <Link
                  href="/carriere"
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-primary-600" />
                    <span className="font-medium">{t('clientArea.viewOffers')}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
                </Link>

                <Link
                  href="/contact"
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary-600" />
                    <span className="font-medium">{t('nav.contact')}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
                </Link>
              </div>
            </motion.div>

            {/* Applications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-muted-strong mb-6">
                  {t('clientArea.myApplications')} ({applications.length})
                </h2>

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                  </div>
                ) : applications.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-muted mb-4">{t('clientArea.noApplications')}</p>
                    <Link href="/carriere" className="btn-primary">
                      {t('clientArea.viewJobOffers')}
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => {
                      const status = statusLabels[app.status] || statusLabels.NEW
                      const StatusIcon = status.icon

                      return (
                        <div
                          key={app.id}
                          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-muted-strong">
                                {app.job.title}
                              </h3>
                              <p className="text-sm text-muted mt-1">
                                Candidature envoyée le {new Date(app.createdAt).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                              <StatusIcon className="h-4 w-4" />
                              {status.label}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
