'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  FileText
} from 'lucide-react'

export default function NewBlogPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la création')
      }

      router.push('/admin/blog')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
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
        <h1 className="text-3xl font-bold text-muted-strong">Nouvel article</h1>
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
            onChange={handleTitleChange}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            placeholder="Le titre de votre article"
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-muted-strong mb-2">
            Slug (URL) *
          </label>
          <div className="flex items-center">
            <span className="px-3 py-3 bg-gray-900 border border-r-0 border-gray-700 rounded-l-lg text-gray-500">
              /blog/
            </span>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-r-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="mon-article"
              required
            />
          </div>
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
            placeholder="Laissez vide pour utiliser votre nom"
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
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold rounded-lg transition-colors"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            {loading ? 'Création...' : 'Créer l\'article'}
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
