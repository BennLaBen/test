'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { SEO } from '@/components/SEO'
import { motion } from 'framer-motion'
import { IndustrialBackground } from '@/components/IndustrialBackground'
import { useTranslation } from 'react-i18next'
import type { Post } from '@/lib/posts'
import { 
  BookOpen, 
  TrendingUp, 
  Calendar, 
  User, 
  ArrowRight, 
  Tag,
  Star,
  Sparkles,
  Zap,
  Award
} from 'lucide-react'

export default function BlogPage() {
  const { t, i18n } = useTranslation('blog')
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true)
        const response = await fetch(`/api/posts`)
        const data = await response.json()
        if (data.success) {
          setPosts(data.posts)
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const featuredPosts = posts.filter((post) => post.featured)
  const regularPosts = posts.filter((post) => !post.featured)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <>
      <SEO
        title={t('title')}
        description={t('description')}
        canonical="/blog"
      />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 py-20 text-white dark:from-primary-700 dark:to-primary-900 lg:py-32 overflow-hidden">
        <IndustrialBackground variant="circuit" className="opacity-20" />
        
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full industrial-grid bg-center" />
        </div>

        {/* Animated corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32 tech-corner opacity-30" />
        <div className="absolute top-0 right-0 w-32 h-32 tech-corner opacity-30 rotate-90" />
        <div className="absolute bottom-0 left-0 w-32 h-32 tech-corner opacity-30 -rotate-90" />
        <div className="absolute bottom-0 right-0 w-32 h-32 tech-corner opacity-30 rotate-180" />
        
        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <motion.span 
              className="chip mb-6 inline-flex bg-white/20 text-white backdrop-blur-sm tech-border"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              {t('hero.badge')}
            </motion.span>
            
            {/* Badge "Articles en français" si interface en anglais */}
            {i18n.language === 'en' && (
              <motion.div 
                className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent-500/90 backdrop-blur-sm px-6 py-2 text-sm font-semibold text-white shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                🇫🇷 Articles available in French only
              </motion.div>
            )}
            
            <motion.h1 
              className="mb-6 text-5xl font-bold tracking-tight lg:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t('hero.title')}
            </motion.h1>
            
            <motion.p 
              className="mx-auto max-w-2xl text-xl opacity-90 leading-relaxed mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {t('hero.subtitle')}
            </motion.p>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.div 
                className="relative group"
                whileHover={{ scale: 1.1, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-white/5 rounded-lg tech-border opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-4xl font-bold relative z-10 shimmer-text">{posts.length}</div>
                <div className="mt-1 text-sm opacity-80 relative z-10">{t('hero.stats.articles')}</div>
              </motion.div>
              <motion.div 
                className="relative group"
                whileHover={{ scale: 1.1, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-white/5 rounded-lg tech-border opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-4xl font-bold relative z-10 shimmer-text">5</div>
                <div className="mt-1 text-sm opacity-80 relative z-10">{t('hero.stats.entities')}</div>
              </motion.div>
              <motion.div 
                className="relative group"
                whileHover={{ scale: 1.1, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-white/5 rounded-lg tech-border opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-4xl font-bold relative z-10 shimmer-text">36</div>
                <div className="mt-1 text-sm opacity-80 relative z-10">{t('hero.stats.experience')}</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-20 lg:py-32 relative overflow-hidden">
          <IndustrialBackground variant="grid" />
          
          <div className="container relative z-10">
            <motion.div 
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="chip mb-4 tech-border">
                <Star className="h-4 w-4 mr-2 inline-block" />
                Articles à la une
              </span>
              <h2 className="text-3xl font-bold text-muted-strong lg:text-5xl">
                {t('sections.latestArticles')}
              </h2>
            </motion.div>

          <div className="grid gap-8 lg:grid-cols-12">
            {/* Premier article à la une - Span 8 colonnes */}
            {featuredPosts[0] && (
              <motion.div 
                className="lg:col-span-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Link
                  href={`/blog/${featuredPosts[0].slug}`}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-lg glass-card transition-all duration-300 hover:shadow-2xl dark:bg-gray-800 block tech-border"
                >
                <div className="relative h-80 lg:h-96 overflow-hidden">
                  <img
                    src={featuredPosts[0].image}
                    alt={featuredPosts[0].title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                  
                  {/* Badge "À LA UNE" */}
                  <div className="absolute left-6 top-6">
                    <span className="inline-flex items-center rounded-full bg-accent-500 px-4 py-1.5 text-sm font-semibold text-white shadow-lg">
                      {t('hero.featured')}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="absolute right-6 top-6 flex flex-wrap gap-2">
                    {featuredPosts[0].tags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Contenu */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="mb-3 flex items-center gap-4 text-sm text-gray-300">
                      <span>{new Date(featuredPosts[0].date).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      <span>•</span>
                      <span>{featuredPosts[0].author}</span>
                    </div>
                    <h3 className="mb-3 text-2xl font-bold text-white lg:text-3xl">
                      {featuredPosts[0].title}
                    </h3>
                    <p className="text-base text-gray-200 line-clamp-2">
                      {featuredPosts[0].description}
                    </p>
                  </div>
                </div>
                </Link>
              </motion.div>
            )}

            {/* Deuxième article à la une - Span 4 colonnes */}
            {featuredPosts[1] && (
              <motion.div 
                className="lg:col-span-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Link
                  href={`/blog/${featuredPosts[1].slug}`}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-lg glass-card transition-all duration-300 hover:shadow-2xl dark:bg-gray-800 block tech-border"
                >
                <div className="relative h-80 lg:h-96 overflow-hidden">
                  <img
                    src={featuredPosts[1].image}
                    alt={featuredPosts[1].title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                  
                  {/* Badge "À LA UNE" */}
                  <div className="absolute left-6 top-6">
                    <span className="inline-flex items-center rounded-full bg-accent-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                      {t('hero.featured')}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="absolute right-6 top-6 flex flex-wrap gap-2">
                    {featuredPosts[1].tags?.slice(0, 1).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/20 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Contenu */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="mb-2 flex items-center gap-3 text-xs text-gray-300">
                      <span>{new Date(featuredPosts[1].date).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-white">
                      {featuredPosts[1].title}
                    </h3>
                    <p className="text-sm text-gray-200 line-clamp-2">
                      {featuredPosts[1].description}
                    </p>
                  </div>
                </div>
                </Link>
              </motion.div>
            )}
          </div>
          </div>
        </section>
      )}

      {/* All Articles Grid */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 dark:from-gray-800 dark:to-gray-900 lg:py-32 relative overflow-hidden">
        <IndustrialBackground variant="blueprint" />
        
        <div className="container relative z-10">
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="chip mb-4 tech-border">
              <TrendingUp className="h-4 w-4 mr-2 inline-block" />
              Tous nos articles
            </span>
            <h2 className="text-3xl font-bold text-muted-strong lg:text-5xl">
              {t('sections.allArticles')}
            </h2>
          </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {regularPosts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.15,
                type: "spring",
                stiffness: 80
              }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-xl glass-card transition-all duration-300 hover:shadow-2xl block h-full tech-border"
              >
                <div className="relative h-56 overflow-hidden">
                  <motion.img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                  
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 -translate-x-full"
                    animate={{
                      translateX: ['100%', '-100%']
                    }}
                    transition={{
                      duration: 2.5,
                      delay: index * 0.3 + 1.5,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "easeInOut"
                    }}
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
                      pointerEvents: 'none'
                    }}
                  />
                  
                  {/* Tags sur l'image */}
                  <div className="absolute left-4 top-4 z-10">
                    {post.tags?.[0] && (
                      <motion.span 
                        className="rounded-full bg-primary-500 px-3 py-1 text-xs font-medium text-white shadow-lg flex items-center gap-1"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Tag className="h-3 w-3" />
                        {post.tags[0]}
                      </motion.span>
                    )}
                  </div>
                  
                  {/* Date en bas */}
                  <div className="absolute bottom-4 left-4 text-sm font-medium text-white z-10 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.date).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>

                <div className="p-6 relative">
                  <motion.h3 
                    className="mb-3 text-xl font-bold text-muted-strong group-hover:text-primary-600 transition-colors line-clamp-2"
                    whileHover={{ x: 5 }}
                  >
                    {post.title}
                  </motion.h3>
                  <p className="mb-4 text-sm text-muted line-clamp-3">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-strong flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {post.author}
                    </span>
                    <motion.span 
                      className="text-sm font-semibold text-primary-600 flex items-center gap-1"
                      whileHover={{ x: 5 }}
                    >
                      {t('cardCta')}
                      <ArrowRight className="h-4 w-4" />
                    </motion.span>
                  </div>
                  
                  {/* Sparkle effect */}
                  <motion.div
                    className="absolute top-2 right-2"
                    animate={{ 
                      scale: [0, 1, 0],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 2,
                      delay: index * 0.3 + 0.5,
                      repeat: Infinity,
                      repeatDelay: 4,
                      ease: "easeOut"
                    }}
                  >
                    <Sparkles className="h-4 w-4 text-yellow-400" />
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        </div>
      </section>
    </>
  )
}
