'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Star, 
  Check, 
  X, 
  Trash2, 
  User,
  Building2,
  Calendar,
  Loader2,
  Filter
} from 'lucide-react'

interface Review {
  id: string
  rating: number
  content: string
  company?: string
  sector?: string
  approved: boolean
  featured: boolean
  createdAt: string
  user: {
    firstName: string
    lastName: string
    email: string
  }
}

export default function AdminAvisPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all')

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
                      {review.user.firstName} {review.user.lastName}
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
    </div>
  )
}
