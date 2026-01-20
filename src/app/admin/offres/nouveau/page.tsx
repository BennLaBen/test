'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle
} from 'lucide-react'

const jobSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  slug: z.string().min(1, 'Le slug est requis'),
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

export default function NouvelleOffrePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<JobForm>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      published: false,
      featured: false,
    }
  })

  const title = watch('title')

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const onSubmit = async (data: JobForm) => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await res.json()

      if (result.success) {
        router.push('/admin/offres')
      } else {
        setError(result.error || 'Erreur lors de la création')
      }
    } catch (err) {
      setError('Erreur lors de la création')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl">
      <Link 
        href="/admin/offres"
        className="inline-flex items-center gap-2 text-muted hover:text-primary-600 mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux offres
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-muted-strong mb-8">Nouvelle offre d'emploi</h1>

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
                  onChange={(e) => {
                    register('title').onChange(e)
                    setValue('slug', generateSlug(e.target.value))
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  placeholder="Ex: Ingénieur Mécanique"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Slug *</label>
                <input
                  {...register('slug')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  placeholder="ingenieur-mecanique"
                />
                {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
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
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Salaire</label>
              <input
                {...register('salary')}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                placeholder="35-45K€"
              />
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
                <span className="text-sm font-medium">Publier immédiatement</span>
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
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Créer l'offre
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
