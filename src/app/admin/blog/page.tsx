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
  Calendar,
  Loader2,
  FileText,
  Search,
  Star,
  ExternalLink,
  RefreshCw
} from 'lucide-react'
import { useToast } from '@/components/admin/Toast'
import { ConfirmModal } from '@/components/admin/ConfirmModal'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  published: boolean
  featured: boolean
  authorName?: string
  publishedAt?: string
  createdAt: string
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterFeatured, setFilterFeatured] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<BlogPost | null>(null)
  const toast = useToast()

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    try {
      const res = await fetch('/api/admin/blog')
      
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
        setPosts(data.posts)
      } else {
        toast.error('Erreur', data.error || 'Impossible de charger les articles')
      }
    } catch (err) {
      console.error('Error fetching posts:', err)
      toast.error('Erreur réseau', 'Impossible de contacter le serveur')
    } finally {
      setLoading(false)
    }
  }

  async function togglePublish(post: BlogPost) {
    try {
      const res = await fetch(`/api/admin/blog/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !post.published })
      })
      
      if (res.ok) {
        setPosts(posts.map(p => 
          p.id === post.id ? { ...p, published: !p.published } : p
        ))
        toast.success(
          post.published ? 'Article dépublié' : 'Article publié',
          post.published ? 'L\'article n\'est plus visible' : 'L\'article est maintenant visible'
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

  async function deletePost(post: BlogPost) {
    setDeleting(post.id)
    try {
      const res = await fetch(`/api/admin/blog/${post.id}`, { method: 'DELETE' })
      if (res.ok) {
        setPosts(posts.filter(p => p.id !== post.id))
        toast.success('Article supprimé', `"${post.title}" a été supprimé`)
      } else {
        const data = await res.json()
        toast.error('Erreur', data.error || 'Impossible de supprimer l\'article')
      }
    } catch (err) {
      console.error('Error deleting post:', err)
      toast.error('Erreur', 'Impossible de supprimer l\'article')
    } finally {
      setDeleting(null)
      setConfirmDelete(null)
    }
  }

  // Filter posts based on search and filters
  const filteredPosts = posts.filter(post => {
    const matchesSearch = search === '' || 
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      (post.excerpt?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (post.authorName?.toLowerCase().includes(search.toLowerCase()) ?? false)
    
    const matchesStatus = filterStatus === '' || 
      (filterStatus === 'published' && post.published) ||
      (filterStatus === 'draft' && !post.published)
    
    const matchesFeatured = filterFeatured === '' ||
      (filterFeatured === 'featured' && post.featured) ||
      (filterFeatured === 'normal' && !post.featured)
    
    return matchesSearch && matchesStatus && matchesFeatured
  })

  return (
    <div className="p-4 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-muted-strong">Articles de blog</h1>
          <p className="text-muted mt-1">{posts.length} article(s)</p>
        </div>
        <Link href="/admin/blog/nouveau" className="btn-primary flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Nouvel article
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
            placeholder="Rechercher par titre, extrait..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
        >
          <option value="">Tous les statuts</option>
          <option value="published">Publiés</option>
          <option value="draft">Brouillons</option>
        </select>

        <select
          value={filterFeatured}
          onChange={(e) => setFilterFeatured(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
        >
          <option value="">Tous les articles</option>
          <option value="featured">En vedette</option>
          <option value="normal">Standard</option>
        </select>

        {(search || filterStatus || filterFeatured) && (
          <button
            onClick={() => { setSearch(''); setFilterStatus(''); setFilterFeatured(''); }}
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
      ) : filteredPosts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-muted mb-4">
            {posts.length === 0 ? 'Aucun article' : 'Aucun résultat pour cette recherche'}
          </p>
          {posts.length === 0 && (
            <Link href="/admin/blog/nouveau" className="btn-primary">
              Créer un article
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-muted-strong">{post.title}</h3>
                  {post.featured && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                      En vedette
                    </span>
                  )}
                </div>
                {post.excerpt && (
                  <p className="text-sm text-muted line-clamp-1 mb-2">{post.excerpt}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                  {post.authorName && (
                    <span>Par {post.authorName}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 ml-4">
                <button
                  onClick={() => togglePublish(post)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium ${
                    post.published 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {post.published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  {post.published ? 'Publié' : 'Brouillon'}
                </button>

                {post.published && (
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Voir sur le site"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}

                <Link
                  href={`/admin/blog/${post.id}/edit`}
                  className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </Link>
                
                <button
                  onClick={() => setConfirmDelete(post)}
                  disabled={deleting === post.id}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  {deleting === post.id ? (
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
        onConfirm={() => confirmDelete && deletePost(confirmDelete)}
        title="Supprimer l'article"
        message={`Êtes-vous sûr de vouloir supprimer "${confirmDelete?.title}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        variant="danger"
        loading={!!deleting}
      />
    </div>
  )
}
