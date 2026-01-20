'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { IndustrialBackground } from '@/components/IndustrialBackground'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  ArrowLeft,
  Upload,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  FileText,
  User,
  Mail,
  Phone,
  MessageSquare
} from 'lucide-react'

const applicationSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  message: z.string().optional(),
})

type ApplicationForm = z.infer<typeof applicationSchema>

interface Job {
  id: string
  title: string
  slug: string
  type: string
  location: string
}

export default function ApplyPage() {
  const params = useParams()
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [cvUploading, setCvUploading] = useState(false)
  const [cvUrl, setCvUrl] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema)
  })

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCvFile(file)
    setCvUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'cv')

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()

      if (data.success) {
        setCvUrl(data.url)
      } else {
        setError(data.error || 'Erreur lors de l\'upload du CV')
        setCvFile(null)
      }
    } catch (err) {
      setError('Erreur lors de l\'upload du CV')
      setCvFile(null)
    } finally {
      setCvUploading(false)
    }
  }

  const onSubmit = async (data: ApplicationForm) => {
    if (!cvUrl) {
      setError('Veuillez uploader votre CV')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          jobId: job?.id,
          cvUrl,
          cvName: cvFile?.name
        })
      })

      const result = await res.json()

      if (result.success) {
        setSuccess(true)
      } else {
        setError(result.error || 'Erreur lors de l\'envoi')
      }
    } catch (err) {
      setError('Erreur lors de l\'envoi de la candidature')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-muted-strong mb-4">Offre non trouvée</h1>
        <Link href="/carriere" className="btn-primary">
          Retour aux offres
        </Link>
      </div>
    )
  }

  if (success) {
    return (
      <>
        <SEO title="Candidature envoyée" />
        <section className="min-h-screen flex items-center justify-center py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 text-center max-w-lg"
          >
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-muted-strong mb-4">
              Candidature envoyée !
            </h1>
            <p className="text-muted mb-8">
              Merci pour votre candidature au poste de <strong>{job.title}</strong>. 
              Nous l'examinerons avec attention et reviendrons vers vous rapidement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/carriere" className="btn-secondary">
                Voir d'autres offres
              </Link>
              <Link href="/" className="btn-primary">
                Retour à l'accueil
              </Link>
            </div>
          </motion.div>
        </section>
      </>
    )
  }

  return (
    <>
      <SEO
        title={`Postuler - ${job.title}`}
        description={`Envoyez votre candidature pour le poste de ${job.title} chez LLEDO Industries.`}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-900 via-gray-900 to-gray-900 py-12 text-white overflow-hidden">
        <IndustrialBackground variant="grid" />
        
        <div className="container relative z-10">
          <Link 
            href={`/carriere/${job.slug}`}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'offre
          </Link>

          <h1 className="text-3xl lg:text-4xl font-bold mb-2">Postuler</h1>
          <p className="text-xl text-white/80">{job.title} • {job.location}</p>
        </div>
      </section>

      {/* Form */}
      <section className="py-16">
        <div className="container max-w-2xl">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="glass-card p-8 space-y-6"
          >
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3 text-red-700 dark:text-red-400">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-muted-strong mb-2">
                  <User className="h-4 w-4 inline mr-2" />
                  Prénom *
                </label>
                <input
                  {...register('firstName')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Votre prénom"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-strong mb-2">
                  <User className="h-4 w-4 inline mr-2" />
                  Nom *
                </label>
                <input
                  {...register('lastName')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Votre nom"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-strong mb-2">
                <Mail className="h-4 w-4 inline mr-2" />
                Email *
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="votre@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-strong mb-2">
                <Phone className="h-4 w-4 inline mr-2" />
                Téléphone
              </label>
              <input
                {...register('phone')}
                type="tel"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="06 12 34 56 78"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-strong mb-2">
                <FileText className="h-4 w-4 inline mr-2" />
                CV (PDF, DOC, DOCX) *
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="cv-upload"
                />
                <label
                  htmlFor="cv-upload"
                  className={`flex items-center justify-center gap-3 w-full px-4 py-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    cvUrl 
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary-500'
                  }`}
                >
                  {cvUploading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
                  ) : cvUrl ? (
                    <>
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <span className="text-green-700 dark:text-green-400">{cvFile?.name}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-gray-400" />
                      <span className="text-muted">Cliquez pour uploader votre CV</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-strong mb-2">
                <MessageSquare className="h-4 w-4 inline mr-2" />
                Message (optionnel)
              </label>
              <textarea
                {...register('message')}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder="Présentez-vous brièvement et expliquez votre motivation..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting || cvUploading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Envoyer ma candidature
                </>
              )}
            </button>
          </motion.form>
        </div>
      </section>
    </>
  )
}
