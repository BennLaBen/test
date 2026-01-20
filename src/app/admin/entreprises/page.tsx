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
  Loader2,
  Building2,
  ArrowUpDown,
  ExternalLink
} from 'lucide-react'
import { useToast } from '@/components/admin/Toast'
import { ConfirmModal } from '@/components/admin/ConfirmModal'

interface Company {
  id: string
  slug: string
  name: string
  tagline: string
  published: boolean
  order: number
  createdAt: string
}

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Company | null>(null)
  const toast = useToast()

  useEffect(() => {
    fetchCompanies()
  }, [])

  async function fetchCompanies() {
    try {
      const res = await fetch('/api/admin/companies')
      
      if (res.status === 401) {
        toast.error('Session expirée', 'Veuillez vous reconnecter')
        return
      }
      if (res.status === 403) {
        toast.error('Accès refusé', 'Droits administrateur requis')
        return
      }
      
      const data = await res.json()
      if (data.success) {
        setCompanies(data.companies)
      } else {
        toast.error('Erreur', data.error || 'Impossible de charger les entreprises')
      }
    } catch (err) {
      console.error('Error fetching companies:', err)
      toast.error('Erreur réseau', 'Impossible de contacter le serveur')
    } finally {
      setLoading(false)
    }
  }

  async function togglePublish(company: Company) {
    try {
      const res = await fetch(`/api/admin/companies/${company.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !company.published })
      })
      
      if (res.ok) {
        setCompanies(companies.map(c => 
          c.id === company.id ? { ...c, published: !c.published } : c
        ))
        toast.success(
          company.published ? 'Entreprise masquée' : 'Entreprise publiée',
          company.published ? `${company.name} n'est plus visible` : `${company.name} est maintenant visible`
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

  async function deleteCompany(company: Company) {
    setDeleting(company.id)
    try {
      const res = await fetch(`/api/admin/companies/${company.id}`, { method: 'DELETE' })
      if (res.ok) {
        setCompanies(companies.filter(c => c.id !== company.id))
        toast.success('Entreprise supprimée', `${company.name} a été supprimée`)
      } else {
        const data = await res.json()
        toast.error('Erreur', data.error || 'Impossible de supprimer')
      }
    } catch (err) {
      console.error('Error deleting company:', err)
      toast.error('Erreur', 'Impossible de supprimer l\'entreprise')
    } finally {
      setDeleting(null)
      setConfirmDelete(null)
    }
  }

  return (
    <div className="p-4 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-muted-strong">Entreprises du groupe</h1>
          <p className="text-muted mt-1">{companies.length} entreprise(s)</p>
        </div>
        <Link href="/admin/entreprises/nouveau" className="btn-primary flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Nouvelle entreprise
        </Link>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      ) : companies.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
          <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-muted mb-4">Aucune entreprise</p>
          <Link href="/admin/entreprises/nouveau" className="btn-primary">
            Créer une entreprise
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {companies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500">
                  <ArrowUpDown className="h-4 w-4" />
                  <span className="ml-1 text-sm font-bold">{company.order}</span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-muted-strong text-lg">{company.name}</h3>
                    <span className="text-sm text-muted">/{company.slug}</span>
                  </div>
                  <p className="text-sm text-muted">{company.tagline}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => togglePublish(company)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium ${
                    company.published 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {company.published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  {company.published ? 'Publié' : 'Masqué'}
                </button>

                {company.published && (
                  <a
                    href={`/societes/${company.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Voir sur le site"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}

                <Link
                  href={`/admin/entreprises/${company.id}/edit`}
                  className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </Link>
                
                <button
                  onClick={() => setConfirmDelete(company)}
                  disabled={deleting === company.id}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  {deleting === company.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && deleteCompany(confirmDelete)}
        title="Supprimer l'entreprise"
        message={`Êtes-vous sûr de vouloir supprimer "${confirmDelete?.name}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        variant="danger"
        loading={!!deleting}
      />
    </div>
  )
}
