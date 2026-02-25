'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, 
  Check, 
  X, 
  Trash2, 
  User,
  Building2,
  Calendar,
  Loader2,
  Filter,
  Plus,
  MessageSquarePlus
} from 'lucide-react'

interface Review {
  id: string
  rating: number
  content: string
  company?: string
  sector?: string
  authorName?: string
  authorRole?: string
  approved: boolean
  featured: boolean
  createdAt: string
  user?: {
    firstName: string
    lastName: string
    email: string
  } | null
}

export default function AdminAvisPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newReview, setNewReview] = useState({
    authorName: '',
    authorRole: '',
    rating: 5,
    content: '',
    company: '',
    sector: '',
  })

  useEffect(() => {
    fetchReviews()
  }, [])

  async function fetchReviews() {
    try {
      const res = await fetch('/api/admin/reviews')
      const data = await res.json()
      if (data.success) {
        setReviews(data.reviews)
      }
    } catch (err) {
      console.error('Error fetching reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  async function updateReview(id: string, data: Partial<Review>) {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (res.ok) {
        setReviews(reviews.map(r => 
          r.id === id ? { ...r, ...data } : r
        ))
      }
    } catch (err) {
      console.error('Error updating review:', err)
    }
  }

  async function deleteReview(id: string) {
    if (!confirm('Supprimer cet avis ?')) return
    
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setReviews(reviews.filter(r => r.id !== id))
      }
    } catch (err) {
      console.error('Error deleting review:', err)
    }
  }

  async function createReview(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      })
      const data = await res.json()
      if (data.success) {
        setShowAddModal(false)
        setNewReview({ authorName: '', authorRole: '', rating: 5, content: '', company: '', sector: '' })
        fetchReviews()
      }
    } catch (err) {
      console.error('Error creating review:', err)
    } finally {
      setCreating(false)
    }
  }

  const filteredReviews = reviews.filter(r => {
    if (filter === 'pending') return !r.approved
    if (filter === 'approved') return r.approved
    return true
  })

  const pendingCount = reviews.filter(r => !r.approved).length

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-muted-strong">Avis clients</h1>
          <p className="text-muted mt-1">
            {reviews.length} avis au total • {pendingCount} en attente de validation
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            >
              <option value="all">Tous les avis</option>
              <option value="pending">En attente ({pendingCount})</option>
              <option value="approved">Approuvés</option>
            </select>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Ajouter un avis
          </button>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
          <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-muted">Aucun avis à afficher</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredReviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white dark:bg-gray-800 rounded-xl p-6 border-l-4 ${
                review.approved ? 'border-green-500' : 'border-amber-500'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= review.rating 
                            ? 'text-amber-400 fill-amber-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-muted">({review.rating}/5)</span>
                  </div>

                  {/* Content */}
                  <p className="text-muted-strong mb-4">{review.content}</p>

                  {/* Author Info */}
                  <div className="flex items-center gap-6 text-sm text-muted">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {review.user ? `${review.user.firstName} ${review.user.lastName}` : review.authorName || 'Anonyme'}
                      {review.authorRole && <span className="text-xs text-gray-400 ml-1">— {review.authorRole}</span>}
                    </span>
                    {review.company && (
                      <span className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {review.company}
                      </span>
                    )}
                    {review.sector && (
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                        {review.sector}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {!review.approved ? (
                    <button
                      onClick={() => updateReview(review.id, { approved: true })}
                      className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Check className="h-4 w-4" />
                      Approuver
                    </button>
                  ) : (
                    <button
                      onClick={() => updateReview(review.id, { approved: false })}
                      className="flex items-center gap-1 px-3 py-2 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg text-sm font-medium transition-colors"
                    >
                      <X className="h-4 w-4" />
                      Retirer
                    </button>
                  )}

                  <button
                    onClick={() => updateReview(review.id, { featured: !review.featured })}
                    className={`p-2 rounded-lg transition-colors ${
                      review.featured 
                        ? 'bg-amber-100 text-amber-600' 
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                    title={review.featured ? 'Retirer de la une' : 'Mettre en une'}
                  >
                    <Star className={`h-4 w-4 ${review.featured ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={() => deleteReview(review.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Review Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                    <MessageSquarePlus className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Ajouter un avis</h3>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <form onSubmit={createReview} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom complet *</label>
                    <input
                      required
                      value={newReview.authorName}
                      onChange={(e) => setNewReview({ ...newReview, authorName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Poste / Rôle</label>
                    <input
                      value={newReview.authorRole}
                      onChange={(e) => setNewReview({ ...newReview, authorRole: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                      placeholder="Technicien CNC"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Entreprise</label>
                    <select
                      value={newReview.company}
                      onChange={(e) => setNewReview({ ...newReview, company: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                    >
                      <option value="">Sélectionner</option>
                      <option value="MPEB">MPEB</option>
                      <option value="EGI">EGI</option>
                      <option value="FREM">FREM</option>
                      <option value="MGP">MGP</option>
                      <option value="LLEDO Aerotools">LLEDO Aerotools</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Secteur</label>
                    <select
                      value={newReview.sector}
                      onChange={(e) => setNewReview({ ...newReview, sector: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                    >
                      <option value="">Sélectionner</option>
                      <option value="Aéronautique">Aéronautique</option>
                      <option value="Défense">Défense</option>
                      <option value="Industrie">Industrie</option>
                      <option value="Énergie">Énergie</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Note *</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="p-1"
                      >
                        <Star className={`h-7 w-7 transition-colors ${star <= newReview.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-500">{newReview.rating}/5</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contenu de l'avis *</label>
                  <textarea
                    required
                    rows={4}
                    value={newReview.content}
                    onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm resize-none"
                    placeholder="Excellent travail, pièces de qualité..."
                  />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-medium transition-all disabled:opacity-50"
                  >
                    {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    {creating ? 'Création...' : 'Publier l\'avis'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
