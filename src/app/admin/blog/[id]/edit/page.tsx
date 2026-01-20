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
  Star, 
  Loader2,
  ImageIcon,
  Tag,
  FileText,
  Trash2
} from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  image: string | null
  tags: string[]
  published: boolean
  featured: boolean
  authorName: string | null
}

export default function EditBlogPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    tags: '',
    published: false,
    featured: false,
    authorName: '',
  })

  useEffect(() => {
    fetchPost()
  }, [postId])

  async function fetchPost() {
    try {
      const res = await fetch(`/api/admin/blog/${postId}`)
      const data = await res.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Article non trouvé')
      }

      const post: BlogPost = data.post
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || '',
        content: post.content,
        image: post.image || '',
        tags: post.tags.join(', '),
        published: post.published,
        featured: post.featured,
        authorName: post.authorName || '',
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
      const res = await fetch(`/api/admin/blog/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la mise à jour')
      }

      router.push('/admin/blog')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return
    
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/blog/${postId}`, { method: 'DELETE' })
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la suppression')
      }
      
      router.push('/admin/blog')
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
          href="/admin/blog" 
          className="inline-flex items-center gap-2 text-muted hover:text-muted-strong mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux articles
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-muted-strong">Modifier l'article</h1>
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
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-muted-strong mb-2">
            Titre *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            placeholder="Le titre de votre article"
            required
          />
        </div>

        {/* Slug (read-only for edit) */}
        <div>
          <label className="block text-sm font-medium text-muted-strong mb-2">
            Slug (URL)
          </label>
          <div className="flex items-center">
            <span className="px-3 py-3 bg-gray-900 border border-r-0 border-gray-700 rounded-l-lg text-gray-500">
              /blog/
            </span>
            <input
              type="text"
              value={formData.slug}
              disabled
              className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-r-lg text-gray-400 cursor-not-allowed"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">Le slug ne peut pas être modifié</p>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-muted-strong mb-2">
            Extrait / Description
          </label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
            rows={2}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
            placeholder="Un court résumé de l'article (affiché dans les listes)"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-muted-strong mb-2">
            <FileText className="inline h-4 w-4 mr-1" />
            Contenu (Markdown) *
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            rows={15}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white font-mono text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            placeholder="# Mon titre&#10;&#10;Le contenu de votre article en Markdown..."
            required
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-muted-strong mb-2">
            <ImageIcon className="inline h-4 w-4 mr-1" />
            Image de couverture (URL)
          </label>
          <input
            type="text"
            value={formData.image}
            onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            placeholder="/images/blog/mon-image.jpg"
          />
          {formData.image && (
            <div className="mt-2">
              <img 
                src={formData.image} 
                alt="Preview" 
                className="h-32 w-auto object-cover rounded-lg border border-gray-700"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-muted-strong mb-2">
            <Tag className="inline h-4 w-4 mr-1" />
            Tags (séparés par des virgules)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            placeholder="Aéronautique, Usinage, Innovation"
          />
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-medium text-muted-strong mb-2">
            Auteur
          </label>
          <input
            type="text"
            value={formData.authorName}
            onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            placeholder="Nom de l'auteur"
          />
        </div>

        {/* Options */}
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
              className="w-5 h-5 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-blue-500"
            />
            <span className="flex items-center gap-2 text-muted-strong">
              {formData.published ? <Eye className="h-4 w-4 text-green-400" /> : <EyeOff className="h-4 w-4" />}
              Publié
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
              className="w-5 h-5 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-blue-500"
            />
            <span className="flex items-center gap-2 text-muted-strong">
              <Star className={`h-4 w-4 ${formData.featured ? 'text-yellow-400' : ''}`} />
              À la une
            </span>
          </label>
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold rounded-lg transition-colors"
          >
            {saving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <Link
            href="/admin/blog"
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  )
}
