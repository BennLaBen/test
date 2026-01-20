'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { IndustrialBackground } from '@/components/IndustrialBackground'
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Building2, 
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  FileText,
  Send,
  Loader2
} from 'lucide-react'

interface Job {
  id: string
  title: string
  slug: string
  type: string
  location: string
  department?: string
  salary?: string
  description: string
  requirements: string
  benefits?: string
  published: boolean
  createdAt: string
}

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await fetch(`/api/jobs/${params.slug}`)
        const data = await res.json()
        
        if (data.success) {
          setJob(data.job)
        } else {
          setError('Offre non trouvée')
        }
      } catch (err) {
        setError('Erreur lors du chargement')
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchJob()
    }
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-muted-strong mb-4">Offre non trouvée</h1>
        <Link href="/carriere" className="btn-primary">
          Retour aux offres
        </Link>
      </div>
    )
  }

  return (
    <>
      <SEO
        title={`${job.title} - Carrières`}
        description={`Postulez à l'offre ${job.title} chez LLEDO Industries. ${job.type} à ${job.location}.`}
        canonical={`/carriere/${job.slug}`}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-900 via-gray-900 to-gray-900 py-16 text-white overflow-hidden">
        <IndustrialBackground variant="grid" />
        
        <div className="container relative z-10">
          <Link 
            href="/carriere" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux offres
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm font-medium">
                {job.type}
              </span>
              {job.department && (
                <span className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-sm">
                  {job.department}
                </span>
              )}
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold mb-6">{job.title}</h1>

            <div className="flex flex-wrap gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                <span>{job.type}</span>
              </div>
              {job.salary && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  <span>{job.salary}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="glass-card p-8"
              >
                <h2 className="text-2xl font-bold text-muted-strong mb-6 flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary-600" />
                  Description du poste
                </h2>
                <div className="prose prose-lg max-w-none text-muted">
                  {job.description.split('\n').map((line, i) => {
                    if (line.startsWith('## ')) {
                      return <h3 key={i} className="text-xl font-bold text-muted-strong mt-6 mb-3">{line.replace('## ', '')}</h3>
                    }
                    if (line.startsWith('- ')) {
                      return <li key={i} className="ml-4">{line.replace('- ', '')}</li>
                    }
                    return line ? <p key={i}>{line}</p> : null
                  })}
                </div>
              </motion.div>

              {/* Requirements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="glass-card p-8"
              >
                <h2 className="text-2xl font-bold text-muted-strong mb-6 flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  Profil recherché
                </h2>
                <div className="prose prose-lg max-w-none text-muted">
                  {job.requirements.split('\n').map((line, i) => {
                    if (line.startsWith('## ')) {
                      return <h3 key={i} className="text-xl font-bold text-muted-strong mt-6 mb-3">{line.replace('## ', '')}</h3>
                    }
                    if (line.startsWith('- ')) {
                      return <li key={i} className="ml-4">{line.replace('- ', '')}</li>
                    }
                    return line ? <p key={i}>{line}</p> : null
                  })}
                </div>
              </motion.div>

              {/* Benefits */}
              {job.benefits && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="glass-card p-8"
                >
                  <h2 className="text-2xl font-bold text-muted-strong mb-6 flex items-center gap-3">
                    <Building2 className="h-6 w-6 text-amber-600" />
                    Ce que nous offrons
                  </h2>
                  <div className="prose prose-lg max-w-none text-muted">
                    {job.benefits.split('\n').map((line, i) => {
                      if (line.startsWith('## ')) {
                        return <h3 key={i} className="text-xl font-bold text-muted-strong mt-6 mb-3">{line.replace('## ', '')}</h3>
                      }
                      if (line.startsWith('- ')) {
                        return <li key={i} className="ml-4">{line.replace('- ', '')}</li>
                      }
                      return line ? <p key={i}>{line}</p> : null
                    })}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="glass-card p-8 sticky top-24"
              >
                <h3 className="text-xl font-bold text-muted-strong mb-6">
                  Postuler à cette offre
                </h3>
                
                <p className="text-muted mb-6">
                  Cette offre vous intéresse ? Envoyez-nous votre candidature !
                </p>

                <Link
                  href={`/carriere/postuler/${job.slug}`}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Send className="h-5 w-5" />
                  Postuler maintenant
                </Link>

                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-muted-strong mb-4">Partager cette offre</h4>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => navigator.share?.({ title: job.title, url: window.location.href })}
                      className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      Partager
                    </button>
                    <button 
                      onClick={() => navigator.clipboard.writeText(window.location.href)}
                      className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      Copier le lien
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
