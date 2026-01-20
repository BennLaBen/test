'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  Trash2,
  Eye,
  ExternalLink
} from 'lucide-react'

const jobSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  type: z.string().min(1, 'Le type est requis'),
  location: z.string().min(1, 'La localisation est requise'),
  department: z.string().optional(),
  salary: z.string().optional(),
  description: z.string().min(10, 'La description est requise'),
  requirements: z.string().min(10, 'Les prérequis sont requis'),
  benefits: z.string().optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
})

type JobForm = z.infer<typeof jobSchema>

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
  featured: boolean
  createdAt: string
  updatedAt: string
}

export default function EditOffrePage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [job, setJob] = useState<Job | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<JobForm>({
    resolver: zodResolver(jobSchema),
  })

  useEffect(() => {
    fetchJob()
  }, [slug])

  async function fetchJob() {
    try {
      const res = await fetch(`/api/jobs/${slug}`)
      const data = await res.json()
      
      if (!data.success) {
        setError('Offre non trouvée')
        return
      }

      setJob(data.job)
      reset({
        title: data.job.title,
        type: data.job.type,
        location: data.job.location,
        department: data.job.department || '',
        salary: data.job.salary || '',
        description: data.job.description,
        requirements: data.job.requirements,
        benefits: data.job.benefits || '',
        published: data.job.published,
        featured: data.job.featured,
      })
    } catch (err) {
      setError('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: JobForm) => {
    setSaving(true)
    setError('')

    try {
      const res = await fetch(`/api/jobs/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await res.json()

      if (result.success) {
        router.push('/admin/offres')
      } else {
        setError(result.error || 'Erreur lors de la mise à jour')
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/jobs/${slug}`, { method: 'DELETE' })
      const data = await res.json()

      if (data.success) {
        router.push('/admin/offres')
      } else {
        setError(data.error || 'Erreur lors de la suppression')
      }
    } catch (err) {
      setError('Erreur lors de la suppression')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="p-8 max-w-4xl">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-700 dark:text-red-400 mb-4">{error || 'Offre non trouvée'}</p>
          <Link href="/admin/offres" className="btn-primary">
            Retour aux offres
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <Link 
          href="/admin/offres"
          className="inline-flex items-center gap-2 text-muted hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux offres
        </Link>

        <div className="flex items-center gap-3">
          {job.published && (
            <a
              href={`/carriere/${job.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
            >
              <Eye className="h-4 w-4" />
              Voir sur le site
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Supprimer
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-muted-strong mb-2">Modifier l'offre</h1>
        <p className="text-muted mb-8">/{job.slug}</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3 text-red-700 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Titre *</label>
                <input
                  {...register('title')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  placeholder="Ex: Ingénieur Mécanique"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Type *</label>
                <select
                  {...register('type')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                >
                  <option value="">Sélectionner</option>
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                  <option value="Stage">Stage</option>
                  <option value="Alternance">Alternance</option>
                </select>
                {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Localisation *</label>
                <input
                  {...register('location')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  placeholder="Les Pennes-Mirabeau (13)"
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Département</label>
                <select
                  {...register('department')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                >
                  <option value="">Sélectionner</option>
                  <option value="MPEB">MPEB</option>
                  <option value="MGP">MGP</option>
                  <option value="EGI">EGI</option>
                  <option value="FREM">FREM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Salaire</label>
                <input
                  {...register('salary')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  placeholder="35-45K€"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                {...register('description')}
                rows={8}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 resize-none"
                placeholder="Description du poste (supporte le Markdown)"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Prérequis *</label>
              <textarea
                {...register('requirements')}
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 resize-none"
                placeholder="Profil recherché (supporte le Markdown)"
              />
              {errors.requirements && <p className="text-red-500 text-sm mt-1">{errors.requirements.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Avantages</label>
              <textarea
                {...register('benefits')}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 resize-none"
                placeholder="Ce que nous offrons (supporte le Markdown)"
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('published')}
                  className="w-5 h-5 rounded border-gray-300"
                />
                <span className="text-sm font-medium">Publier l'offre</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('featured')}
                  className="w-5 h-5 rounded border-gray-300"
                />
                <span className="text-sm font-medium">Offre mise en avant</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Link href="/admin/offres" className="btn-secondary">
              Annuler
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Enregistrer
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
