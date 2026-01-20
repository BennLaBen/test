'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  EyeOff, 
  Loader2,
  ImageIcon,
  Building2,
  Trash2
} from 'lucide-react'

interface Company {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  logoUrl: string | null
  heroImage: string | null
  galleryImages: string[]
  capabilities: Record<string, string> | null
  expertise: string[]
  certifications: string[]
  stats: Array<{ label: string; value: string; icon: string; color: string }> | null
  contactEmail: string | null
  contactPhone: string | null
  address: string | null
  published: boolean
  order: number
}

export default function EditCompanyPage() {
  const router = useRouter()
  const params = useParams()
  const companyId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    logoUrl: '',
    heroImage: '',
    galleryImages: '',
    capabilities: '',
    expertise: '',
    certifications: '',
    stats: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    published: true,
    order: 0,
  })

  useEffect(() => {
    fetchCompany()
  }, [companyId])

  async function fetchCompany() {
    try {
      const res = await fetch(`/api/admin/companies/${companyId}`)
      const data = await res.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Entreprise non trouvée')
      }

      const company: Company = data.company
      setFormData({
        name: company.name,
        tagline: company.tagline,
        description: company.description,
        logoUrl: company.logoUrl || '',
        heroImage: company.heroImage || '',
        galleryImages: company.galleryImages.join('\n'),
        capabilities: company.capabilities ? JSON.stringify(company.capabilities, null, 2) : '',
        expertise: company.expertise.join('\n'),
        certifications: company.certifications.join(', '),
        stats: company.stats ? JSON.stringify(company.stats, null, 2) : '',
        contactEmail: company.contactEmail || '',
        contactPhone: company.contactPhone || '',
        address: company.address || '',
        published: company.published,
        order: company.order,
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const payload: any = {
        name: formData.name,
        tagline: formData.tagline,
        description: formData.description,
        logoUrl: formData.logoUrl || null,
        heroImage: formData.heroImage || null,
        galleryImages: formData.galleryImages.split('\n').map(s => s.trim()).filter(Boolean),
        expertise: formData.expertise.split('\n').map(s => s.trim()).filter(Boolean),
        certifications: formData.certifications.split(',').map(s => s.trim()).filter(Boolean),
        contactEmail: formData.contactEmail || null,
        contactPhone: formData.contactPhone || null,
        address: formData.address || null,
        published: formData.published,
        order: formData.order,
      }

      if (formData.capabilities) {
        try {
          payload.capabilities = JSON.parse(formData.capabilities)
        } catch {
          throw new Error('Format JSON invalide pour les capacités')
        }
      }

      if (formData.stats) {
        try {
          payload.stats = JSON.parse(formData.stats)
        } catch {
          throw new Error('Format JSON invalide pour les statistiques')
        }
      }

      const res = await fetch(`/api/admin/companies/${companyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la mise à jour')
      }

      router.push('/admin/entreprises')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette entreprise ?')) return
    
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/companies/${companyId}`, { method: 'DELETE' })
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la suppression')
      }
      
      router.push('/admin/entreprises')
    } catch (err: any) {
      setError(err.message)
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link 
          href="/admin/entreprises" 
          className="inline-flex items-center gap-2 text-muted hover:text-muted-strong mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux entreprises
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-muted-strong">Modifier l'entreprise</h1>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 rounded-lg transition-colors"
          >
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Supprimer
          </button>
        </div>
      </motion.div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-muted-strong mb-2">Nom *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-sm font-medium text-muted-strong mb-2">Tagline *</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-muted-strong mb-2">Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={5}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Hero Image */}
          <div>
            <label className="block text-sm font-medium text-muted-strong mb-2">
              <ImageIcon className="inline h-4 w-4 mr-1" />
              Image Hero (URL)
            </label>
            <input
              type="text"
              value={formData.heroImage}
              onChange={(e) => setFormData(prev => ({ ...prev, heroImage: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="/images/societes/mpeb-hero.jpg"
            />
          </div>

          {/* Logo */}
          <div>
            <label className="block text-sm font-medium text-muted-strong mb-2">Logo (URL)</label>
            <input
              type="text"
              value={formData.logoUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Expertise */}
        <div>
          <label className="block text-sm font-medium text-muted-strong mb-2">
            Expertises (une par ligne)
          </label>
          <textarea
            value={formData.expertise}
            onChange={(e) => setFormData(prev => ({ ...prev, expertise: e.target.value }))}
            rows={4}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white font-mono text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Usinage 3, 4 et 5 axes&#10;Tournage et fraisage&#10;..."
          />
        </div>

        {/* Certifications */}
        <div>
          <label className="block text-sm font-medium text-muted-strong mb-2">
            Certifications (séparées par virgules)
          </label>
          <input
            type="text"
            value={formData.certifications}
            onChange={(e) => setFormData(prev => ({ ...prev, certifications: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="EN 9100, ISO 9001, NADCAP"
          />
        </div>

        {/* Capabilities JSON */}
        <div>
          <label className="block text-sm font-medium text-muted-strong mb-2">
            Capacités (JSON)
          </label>
          <textarea
            value={formData.capabilities}
            onChange={(e) => setFormData(prev => ({ ...prev, capabilities: e.target.value }))}
            rows={4}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white font-mono text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder='{"capacity": "100 000h/an", "precision": "±0.01mm"}'
          />
        </div>

        {/* Stats JSON */}
        <div>
          <label className="block text-sm font-medium text-muted-strong mb-2">
            Statistiques (JSON array)
          </label>
          <textarea
            value={formData.stats}
            onChange={(e) => setFormData(prev => ({ ...prev, stats: e.target.value }))}
            rows={6}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white font-mono text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder='[{"label": "Années", "value": "36+", "icon": "TrendingUp", "color": "from-blue-500 to-blue-600"}]'
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Contact Email */}
          <div>
            <label className="block text-sm font-medium text-muted-strong mb-2">Email contact</label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Contact Phone */}
          <div>
            <label className="block text-sm font-medium text-muted-strong mb-2">Téléphone</label>
            <input
              type="text"
              value={formData.contactPhone}
              onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Order */}
          <div>
            <label className="block text-sm font-medium text-muted-strong mb-2">Ordre d'affichage</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Published */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={formData.published}
            onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
            className="w-5 h-5 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-blue-500"
          />
          <span className="flex items-center gap-2 text-muted-strong">
            {formData.published ? <Eye className="h-4 w-4 text-green-400" /> : <EyeOff className="h-4 w-4" />}
            Publié sur le site
          </span>
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold rounded-lg transition-colors"
          >
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <Link
            href="/admin/entreprises"
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  )
}
