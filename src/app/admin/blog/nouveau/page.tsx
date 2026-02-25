'use client'

import { useState, useRef } from 'react'
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
  FileText,
  Upload,
  AlertCircle
} from 'lucide-react'

export default function NewBlogPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
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
      slug: generateSlug(title)
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) {
        setFormData(prev => ({ ...prev, image: data.url }))
      }
    } catch (err) {
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const slug = formData.slug || generateSlug(formData.title)
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          slug,
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
    <div className="p-8 max-w-4xl">
      <Link 
        href="/admin/blog" 
        className="inline-flex items-center gap-2 text-muted hover:text-primary-600 mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux articles
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-muted-strong mb-8">Nouvel article</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3 text-red-700 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Titre de l'article *</label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                placeholder="Le titre de votre article"
                required
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium mb-2">Extrait / Description</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={2}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 resize-none"
                placeholder="Un court résumé de l'article (affiché dans les listes)"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <FileText className="inline h-4 w-4 mr-1" />
                Contenu (Markdown) *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={15}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 font-mono text-sm"
                placeholder="# Mon titre&#10;&#10;Le contenu de votre article en Markdown..."
                required
              />
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <ImageIcon className="inline h-4 w-4 mr-1" />
                Image de couverture
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  placeholder="URL de l'image ou uploadez ci-dessous"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploading ? 'Upload...' : 'Upload'}
                </button>
              </div>
              {formData.image && (
                <div className="mt-3 relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img src={formData.image} alt="Preview" className="w-full h-48 object-cover" />
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Tag className="inline h-4 w-4 mr-1" />
                  Tags (séparés par des virgules)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  placeholder="Aéronautique, Usinage, Innovation"
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium mb-2">Auteur</label>
                <input
                  type="text"
                  value={formData.authorName}
                  onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  placeholder="Laissez vide pour utiliser votre nom"
                />
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                  className="w-5 h-5 rounded border-gray-300"
                />
                <span className="flex items-center gap-2 text-sm font-medium">
                  {formData.published ? <Eye className="h-4 w-4 text-green-500" /> : <EyeOff className="h-4 w-4" />}
                  Publier immédiatement
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="w-5 h-5 rounded border-gray-300"
                />
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Star className={`h-4 w-4 ${formData.featured ? 'text-yellow-400 fill-yellow-400' : ''}`} />
                  Article mis en avant
                </span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Link href="/admin/blog" className="btn-secondary">Annuler</Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              {loading ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Création...</>
              ) : (
                <><Save className="h-5 w-5" /> Créer l'article</>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
