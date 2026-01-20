'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  EyeOff,
  MapPin,
  Loader2,
  AlertCircle,
  Search,
  Calendar,
  ExternalLink
} from 'lucide-react'
import { useToast } from '@/components/admin/Toast'
import { ConfirmModal } from '@/components/admin/ConfirmModal'

interface Job {
  id: string
  title: string
  slug: string
  type: string
  location: string
  department?: string
  published: boolean
  featured: boolean
  createdAt: string
  _count: { applications: number }
}

export default function AdminOffresPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<Job | null>(null)
  const toast = useToast()

  useEffect(() => {
    fetchJobs()
  }, [])

  async function fetchJobs() {
    try {
      const res = await fetch('/api/jobs?all=true')
      
      if (res.status === 401) {
        toast.error('Session expirée', 'Veuillez vous reconnecter')
        return
      }
      if (res.status === 403) {
        toast.error('Accès refusé', 'Vous n\'avez pas les droits administrateur')
        return
      }
      
      const data = await res.json()
      if (data.success) {
        setJobs(data.jobs)
      } else {
        toast.error('Erreur', data.error || 'Impossible de charger les offres')
      }
    } catch (err) {
      console.error('Error fetching jobs:', err)
      toast.error('Erreur réseau', 'Impossible de contacter le serveur')
    } finally {
      setLoading(false)
    }
  }

  async function togglePublish(job: Job) {
    try {
      const res = await fetch(`/api/jobs/${job.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !job.published })
      })
      
      if (res.ok) {
        setJobs(jobs.map(j => 
          j.id === job.id ? { ...j, published: !j.published } : j
        ))
        toast.success(
          job.published ? 'Offre dépubliée' : 'Offre publiée',
          job.published ? 'L\'offre n\'est plus visible' : 'L\'offre est maintenant visible sur le site'
        )
      } else {
        const data = await res.json()
        toast.error('Erreur', data.error || 'Impossible de modifier le statut')
      }
    } catch (err) {
      console.error('Error toggling publish:', err)
      toast.error('Erreur', 'Impossible de modifier le statut')
    }
  }

  async function deleteJob(job: Job) {
    setDeleting(job.id)
    try {
      const res = await fetch(`/api/jobs/${job.slug}`, { method: 'DELETE' })
      if (res.ok) {
        setJobs(jobs.filter(j => j.id !== job.id))
        toast.success('Offre supprimée', `"${job.title}" a été supprimée`)
      } else {
        const data = await res.json()
        toast.error('Erreur', data.error || 'Impossible de supprimer l\'offre')
      }
    } catch (err) {
      console.error('Error deleting job:', err)
      toast.error('Erreur', 'Impossible de supprimer l\'offre')
    } finally {
      setDeleting(null)
      setConfirmDelete(null)
    }
  }

  // Filter jobs based on search and filters
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = search === '' || 
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase()) ||
      (job.department?.toLowerCase().includes(search.toLowerCase()) ?? false)
    
    const matchesType = filterType === '' || job.type === filterType
    const matchesStatus = filterStatus === '' || 
      (filterStatus === 'published' && job.published) ||
      (filterStatus === 'draft' && !job.published)
    
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="p-4 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-muted-strong">Offres d'emploi</h1>
          <p className="text-muted mt-1">{jobs.length} offre(s) au total</p>
        </div>
        <Link href="/admin/offres/nouveau" className="btn-primary flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Nouvelle offre
        </Link>
      </motion.div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par titre, lieu..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
        >
          <option value="">Tous les types</option>
          <option value="CDI">CDI</option>
          <option value="CDD">CDD</option>
          <option value="Stage">Stage</option>
          <option value="Alternance">Alternance</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
        >
          <option value="">Tous les statuts</option>
          <option value="published">Publiées</option>
          <option value="draft">Brouillons</option>
        </select>

        {(search || filterType || filterStatus) && (
          <button
            onClick={() => { setSearch(''); setFilterType(''); setFilterStatus(''); }}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
          <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-muted mb-4">
            {jobs.length === 0 ? 'Aucune offre d\'emploi' : 'Aucun résultat pour cette recherche'}
          </p>
          {jobs.length === 0 && (
            <Link href="/admin/offres/nouveau" className="btn-primary">
              Créer une offre
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-strong">Titre</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-strong">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-strong">Lieu</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-strong">Candidatures</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-strong">Statut</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-muted-strong">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-muted-strong">{job.title}</p>
                      {job.department && (
                        <p className="text-sm text-muted">{job.department}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted">{job.type}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-sm text-muted">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link 
                      href={`/admin/candidatures?jobId=${job.id}`}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {job._count.applications}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => togglePublish(job)}
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${
                        job.published 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {job.published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      {job.published ? 'Publiée' : 'Brouillon'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {job.published && (
                        <a
                          href={`/carriere/${job.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Voir sur le site"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <Link
                        href={`/admin/offres/${job.slug}`}
                        className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setConfirmDelete(job)}
                        disabled={deleting === job.id}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {deleting === job.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && deleteJob(confirmDelete)}
        title="Supprimer l'offre"
        message={`Êtes-vous sûr de vouloir supprimer "${confirmDelete?.title}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        variant="danger"
        loading={!!deleting}
      />
    </div>
  )
}
