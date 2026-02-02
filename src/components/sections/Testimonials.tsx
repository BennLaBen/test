'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Star, Quote, Plane, Shield, Factory, Zap, MessageSquarePlus, Lock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { AuthModal } from '@/components/auth/AuthModal'

const iconMap: Record<string, any> = {
  aeronautique: Plane,
  defense: Shield,
  industrie: Factory,
  energie: Zap
}

interface TestimonialsProps {
  externalShowAuthModal?: boolean
  externalSetShowAuthModal?: (show: boolean) => void
  externalShowReviewForm?: boolean
  externalSetShowReviewForm?: (show: boolean) => void
}

export function Testimonials({
  externalShowAuthModal,
  externalSetShowAuthModal,
  externalShowReviewForm,
  externalSetShowReviewForm
}: TestimonialsProps = {}) {
  const { t } = useTranslation('testimonials')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [activeSector, setActiveSector] = useState<string>('all')
  
  // States internes (utilisés seulement si les props externes ne sont pas fournies)
  const [internalShowAuthModal, setInternalShowAuthModal] = useState(false)
  const [internalShowReviewForm, setInternalShowReviewForm] = useState(false)
  
  // Utiliser les props externes si fournies, sinon utiliser les states internes
  const showAuthModal = externalShowAuthModal ?? internalShowAuthModal
  const setShowAuthModal = externalSetShowAuthModal ?? setInternalShowAuthModal
  const showReviewForm = externalShowReviewForm ?? internalShowReviewForm
  const setShowReviewForm = externalSetShowReviewForm ?? setInternalShowReviewForm
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  
  const { isAuthenticated, user } = useAuth()

  const sectors = t('sectors', { returnObjects: true }) as any[]
  const testimonials = t('list', { returnObjects: true }) as any[]
  const satisfactionData = t('satisfaction', { returnObjects: true }) as any
  
  const filteredTestimonials = activeSector === 'all' 
    ? testimonials 
    : testimonials.filter((t: any) => t.sector === activeSector)

  const [reviewData, setReviewData] = useState({
    rating: 5,
    content: '',
    sector: 'industrie'
  })

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user.email,
          userName: `${user.firstName} ${user.lastName}`,
          company: user.company,
          rating: reviewData.rating,
          content: reviewData.content,
          sector: reviewData.sector
        })
      })

      const result = await response.json()

      if (result.success) {
        setSubmitSuccess(true)
        setReviewData({ rating: 5, content: '', sector: 'industrie' })
        setTimeout(() => {
          setShowReviewForm(false)
          setSubmitSuccess(false)
        }, 3000)
      }
    } catch (error) {
      console.error('Error submitting review:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddReviewClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
    } else {
      setShowReviewForm(true)
    }
  }

  return (
    <section id="testimonials" ref={ref} className="py-24 bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.4) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} className="h-full w-full" />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Tony Stark */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl mb-6 uppercase" style={{ textShadow: '0 0 30px rgba(59, 130, 246, 0.8)' }}>
            {t('title')}
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Satisfaction Survey */}
        {satisfactionData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <div className="glass-card p-8 lg:p-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-muted-strong mb-2">
                  {satisfactionData.title}
                </h3>
                <p className="text-muted">{satisfactionData.subtitle}</p>
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {satisfactionData.stats?.map((stat: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 p-6 dark:from-primary-900/30 dark:to-primary-800/20"
                  >
                    <div className="relative z-10">
                      <div className="mb-3 text-5xl font-bold text-primary-600 dark:text-primary-400">
                        {stat.value}%
                      </div>
                      <div className="mb-2 text-sm font-bold uppercase tracking-wider text-muted-strong">
                        {stat.label}
                      </div>
                      <div className="text-xs text-muted">{stat.description}</div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${stat.value}%` } : { width: 0 }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-primary-600 to-primary-400"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Sector Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          <button
            onClick={() => setActiveSector('all')}
            className={`chip cursor-pointer transition-all ${
              activeSector === 'all' 
                ? 'bg-primary-600 text-white hover:bg-primary-700' 
                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {t('filterAll')}
          </button>
          {sectors.map((sector: any) => {
            const Icon = iconMap[sector.id]
            return (
              <button
                key={sector.id}
                onClick={() => setActiveSector(sector.id)}
                className={`chip cursor-pointer transition-all inline-flex items-center gap-2 ${
                  activeSector === sector.id 
                    ? 'bg-primary-600 text-white hover:bg-primary-700' 
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {sector.name}
              </button>
            )
          })}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
          {filteredTestimonials.map((testimonial: any, index: number) => (
            <motion.div
              key={`${testimonial.company}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-card p-8 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-primary-200 dark:text-primary-900">
                <Quote className="h-12 w-12" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-muted mb-6 text-base leading-relaxed relative z-10">
                "{testimonial.content}"
              </blockquote>

              {/* Author */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="font-semibold text-muted-strong">{testimonial.author}</div>
                <div className="text-sm text-muted">{testimonial.role}</div>
                <div className="text-sm font-medium text-muted-strong mt-1">
                  {testimonial.company}
                </div>
                {testimonial.project && (
                  <div className="text-xs text-muted mt-2 italic">
                    {t('reviewForm.project')} : {testimonial.project}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA & Add Review Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={handleAddReviewClick}
            className="btn-primary inline-flex items-center gap-2"
          >
            {isAuthenticated ? (
              <>
                <MessageSquarePlus className="h-5 w-5" />
                {t('reviewForm.leaveReview')}
              </>
            ) : (
              <>
                <Lock className="h-5 w-5" />
                {t('reviewForm.loginToReview')}
              </>
            )}
          </button>
          <a href="/contact" className="btn-secondary">
            {t('cta.button')}
          </a>
        </motion.div>

        {/* Review Form Modal */}
        {showReviewForm && isAuthenticated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowReviewForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card w-full max-w-2xl p-8 tech-border relative"
            >
              {submitSuccess ? (
                <div className="text-center py-8">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 mb-4">
                    <Star className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-muted-strong mb-2">{t('reviewForm.thankYou')} {user?.firstName} !</h3>
                  <p className="text-muted">
                    {t('reviewForm.submittedMessage')}
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-muted-strong mb-6">{t('reviewForm.shareExperience')}</h3>
                  <form onSubmit={handleSubmitReview} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-muted-strong mb-2">
                        {t('reviewForm.yourRating')}
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setReviewData({ ...reviewData, rating })}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`h-8 w-8 ${
                                rating <= reviewData.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-strong mb-2">
                        {t('reviewForm.sector')}
                      </label>
                      <select
                        value={reviewData.sector}
                        onChange={(e) => setReviewData({ ...reviewData, sector: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-muted-strong focus:ring-2 focus:ring-primary-500"
                      >
                        {sectors.map((sector: any) => (
                          <option key={sector.id} value={sector.id}>{sector.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-strong mb-2">
                        {t('reviewForm.yourReview')}
                      </label>
                      <textarea
                        required
                        value={reviewData.content}
                        onChange={(e) => setReviewData({ ...reviewData, content: e.target.value })}
                        rows={5}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-muted-strong focus:ring-2 focus:ring-primary-500"
                        placeholder={t('reviewForm.placeholder')}
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary flex-1 disabled:opacity-50"
                      >
                        {isSubmitting ? t('reviewForm.sending') : t('reviewForm.publish')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="btn-secondary"
                      >
                        {t('reviewForm.cancel')}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Auth Modal */}
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          defaultMode="login"
        />
      </div>
    </section>
  )
}
