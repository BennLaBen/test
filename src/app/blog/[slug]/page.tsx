'use client'

import { useEffect, useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import { SEO } from '@/components/SEO'
import { motion } from 'framer-motion'
import { IndustrialBackground } from '@/components/IndustrialBackground'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import type { Post } from '@/lib/posts'
import {
  Clock,
  Calendar,
  User,
  ArrowLeft,
  Share2,
  Twitter,
  Linkedin,
  Mail,
  Tag,
  ArrowRight,
  CheckCircle2,
  Award,
  Sparkles,
  Zap
} from 'lucide-react'

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const { t, i18n } = useTranslation('blog')
  
  const [post, setPost] = useState<Post | null>(null)
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        // Récupérer le post
        const postResponse = await fetch(`/api/posts/${slug}`)
        const postData = await postResponse.json()
        
        if (!postData.success || !postData.post) {
          notFound()
        }
        
        setPost(postData.post)
        
        // Récupérer tous les posts pour navigation et articles connexes
        const postsResponse = await fetch(`/api/posts`)
        const postsData = await postsResponse.json()
        
        if (postsData.success) {
          setAllPosts(postsData.posts)
        }
      } catch (error) {
        console.error('Error fetching post:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!post) {
    return notFound()
  }

  // Calculer le temps de lecture (moyenne 200 mots/min)
  const wordCount = post.content.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / 200)

  // Navigation entre articles
  const currentIndex = allPosts.findIndex(p => p.slug === post.slug)
  const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
  
  // Articles connexes (même tags)
  const relatedPosts = allPosts
    .filter(p => p.slug !== post.slug && p.tags?.some(tag => post.tags?.includes(tag)))
    .slice(0, 3)

  // Partage social
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = post.title

  return (
    <>
      <SEO
        title={`${post.title} - LLEDO Industries`}
        description={post.description}
        canonical={`/blog/${post.slug}`}
      />
      
      <article className="bg-gray-900">
        {/* Hero Section avec Image - Tony Stark */}
        {post.image && (
          <div className="relative h-[350px] lg:h-[400px] overflow-hidden bg-gradient-to-br from-blue-900 via-gray-900 to-gray-900">
            {/* Image de fond */}
            <motion.img
              src={post.image}
              alt={post.title}
              className="absolute inset-0 h-full w-full object-cover opacity-50"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8 }}
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
            
            {/* Contenu */}
            <div className="relative h-full">
              <div className="container flex h-full flex-col justify-end pb-8 lg:pb-10">
                {/* Breadcrumb - COMPACT */}
                <motion.nav 
                  className="mb-3" 
                  aria-label="Breadcrumb"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <ol className="flex items-center space-x-2 text-xs text-gray-300">
                    <li>
                      <Link href="/" className="hover:text-white transition-colors">
                        LLEDO
                      </Link>
                    </li>
                    <li className="flex items-center">
                      <ArrowRight className="mx-1 h-3 w-3" />
                      <Link href="/blog" className="hover:text-white transition-colors">
                        Blog
                      </Link>
                    </li>
                  </ol>
                </motion.nav>

                {/* Badge langue + Tags - COMPACT */}
                <motion.div 
                  className="mb-3 flex flex-wrap gap-1.5"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  {/* Badge "Article en français" si interface en anglais */}
                  {i18n.language === 'en' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent-500/90 backdrop-blur-sm px-2.5 py-0.5 text-xs font-semibold text-white shadow-md">
                      🇫🇷 FR
                    </span>
                  )}
                  
                  {/* Tags - Limité à 3 pour compacité */}
                  {post.tags && post.tags.slice(0, 3).map((tag, idx) => (
                    <motion.span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full bg-primary-500/90 backdrop-blur-sm px-2.5 py-0.5 text-xs font-semibold text-white shadow-md"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 + idx * 0.05 }}
                    >
                      <Tag className="h-2.5 w-2.5" />
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>

                {/* Titre - COMPACT */}
                <motion.h1 
                  className="mb-4 text-3xl font-bold text-white lg:text-4xl leading-tight max-w-5xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {post.title}
                </motion.h1>

                {/* Meta info - COMPACT */}
                <motion.div 
                  className="flex flex-wrap items-center gap-4 text-xs text-gray-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    <span className="font-medium">{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </time>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{readingTime} min</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        )}

        {/* Description en vedette - Tony Stark */}
        {post.description && (
          <motion.div 
            className="border-l-4 border-blue-500 bg-blue-500/10 backdrop-blur-sm py-6 -mt-6 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ boxShadow: '0 0 30px rgba(59, 130, 246, 0.2)' }}
          >
            <div className="container">
              <p className="text-base lg:text-lg text-white font-semibold leading-relaxed max-w-4xl">
                {post.description}
              </p>
            </div>
          </motion.div>
        )}

        {/* Layout deux colonnes - COMPACT */}
        <div className="container py-8 lg:py-10">
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Sidebar gauche (sticky) - VERSION COMPACTE */}
            <aside className="lg:col-span-3 lg:sticky lg:top-24 lg:self-start space-y-4">
              {/* Auteur & Lecture - COMBINÉ */}
              <motion.div 
                className="glass-card rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950/20 dark:to-primary-900/20 p-4 shadow-md tech-border"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-primary-200 dark:border-primary-800">
                  <motion.div 
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-lg font-bold text-white shadow-lg flex-shrink-0"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {post.author.charAt(0)}
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{post.author}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.date).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-accent-600" />
                    <span className="text-xl font-bold text-gray-900 dark:text-white">{readingTime} min</span>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">lecture rapide</span>
                </div>
              </motion.div>

              {/* Mots-clés compacts */}
              {post.tags && post.tags.length > 0 && (
                <motion.div 
                  className="glass-card rounded-xl p-4 shadow-md tech-border"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="h-4 w-4 text-primary-600" />
                    <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase">Thèmes</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag, idx) => (
                      <motion.span
                        key={tag}
                        className="inline-block rounded-md bg-primary-100 dark:bg-primary-900/30 px-2 py-1 text-xs font-medium text-primary-700 dark:text-primary-300"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 + idx * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Mini CTA - COMPACT */}
              <motion.div 
                className="glass-card rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 shadow-md border border-gray-200 dark:border-gray-700 tech-border relative overflow-hidden"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  className="absolute inset-0 opacity-0"
                  whileHover={{ opacity: 1 }}
                  style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), transparent)' }}
                />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-primary-600" />
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Un projet ?</h3>
                  </div>
                  <p className="mb-3 text-xs text-gray-600 dark:text-gray-400">
                    Contactez nos experts
                  </p>
                  <Link
                    href="/contact"
                    className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 px-3 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg group"
                  >
                    <span>Nous contacter</span>
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            </aside>

            {/* Contenu principal */}
            <div className="lg:col-span-9">
              {/* Mots-clés en évidence */}
              {post.tags && post.tags.length > 0 && (
                <motion.div 
                  className="mb-6 glass-card p-4 tech-border rounded-lg"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <Sparkles className="h-4 w-4 text-primary-600 flex-shrink-0" />
                    <span className="text-xs font-semibold text-muted-strong uppercase">Mots-clés :</span>
                    {post.tags.map((tag, idx) => (
                      <motion.span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-3 py-1 text-xs font-semibold text-white shadow-sm"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                        whileHover={{ scale: 1.1, y: -2 }}
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Article content - VERSION ULTRA COMPACTE ET RAPIDE */}
              <motion.div 
                className="prose prose-sm prose-primary dark:prose-invert max-w-none
                  prose-headings:font-bold prose-headings:scroll-mt-24
                  prose-h2:text-xl prose-h2:mb-3 prose-h2:mt-6 prose-h2:border-l-4 prose-h2:border-primary-500 prose-h2:pl-3 prose-h2:bg-gradient-to-r prose-h2:from-primary-50 prose-h2:to-transparent dark:prose-h2:from-primary-950/20 prose-h2:py-2 prose-h2:rounded-r-lg
                  prose-h3:text-lg prose-h3:mb-2 prose-h3:mt-4 prose-h3:text-primary-700 dark:prose-h3:text-primary-400 prose-h3:flex prose-h3:items-center prose-h3:gap-2 prose-h3:before:content-['▸'] prose-h3:before:text-primary-500
                  prose-h4:text-base prose-h4:mb-2 prose-h4:mt-3 prose-h4:text-gray-900 dark:prose-h4:text-gray-100 prose-h4:font-semibold
                  prose-p:text-sm prose-p:leading-[1.6] prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:mb-3
                  prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-a:no-underline prose-a:font-semibold hover:prose-a:underline
                  prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-bold prose-strong:bg-yellow-100 dark:prose-strong:bg-yellow-900/30 prose-strong:px-1 prose-strong:rounded prose-strong:text-sm
                  prose-ul:my-3 prose-ul:space-y-1 prose-ul:list-none prose-ul:pl-0
                  prose-li:text-sm prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:leading-relaxed prose-li:pl-6 prose-li:relative prose-li:before:content-['✓'] prose-li:before:absolute prose-li:before:left-0 prose-li:before:text-primary-500 prose-li:before:font-bold
                  prose-blockquote:border-l-4 prose-blockquote:border-accent-500 prose-blockquote:bg-gradient-to-r prose-blockquote:from-accent-50 prose-blockquote:to-transparent dark:prose-blockquote:from-accent-950/20 prose-blockquote:py-2 prose-blockquote:pr-3 prose-blockquote:my-4 prose-blockquote:italic prose-blockquote:font-medium prose-blockquote:text-gray-800 dark:prose-blockquote:text-gray-200 prose-blockquote:shadow-sm prose-blockquote:rounded-r-lg prose-blockquote:text-sm
                  prose-code:bg-primary-100 dark:prose-code:bg-primary-900/30 prose-code:text-primary-700 dark:prose-code:text-primary-300 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-semibold prose-code:before:content-[''] prose-code:after:content-['']
                  prose-pre:bg-gray-900 dark:prose-pre:bg-gray-800 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:shadow-lg prose-pre:border prose-pre:border-gray-700 prose-pre:text-xs prose-pre:p-3
                  prose-img:rounded-lg prose-img:shadow-xl prose-img:border-2 prose-img:border-white dark:prose-img:border-gray-800 prose-img:my-4
                  prose-table:border-collapse prose-table:w-full prose-table:shadow-md prose-table:rounded-lg prose-table:overflow-hidden prose-table:text-xs
                  prose-thead:bg-primary-500 prose-thead:text-white
                  prose-th:p-2 prose-th:font-bold prose-th:text-left prose-th:text-xs
                  prose-td:p-2 prose-td:border-b prose-td:border-gray-200 dark:prose-td:border-gray-700 prose-td:text-xs
                  prose-tr:hover:bg-primary-50 dark:prose-tr:hover:bg-primary-950/20 prose-tr:transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </motion.div>

              {/* Résumé des points clés - NOUVEAU */}
              <motion.div 
                className="mt-8 glass-card p-6 tech-border rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950/20 dark:to-primary-900/20"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white m-0">Points clés de l'article</h3>
                </div>
                <div className="grid gap-3 text-sm text-gray-700 dark:text-gray-300">
                  {post.tags && post.tags.slice(0, 5).map((tag, idx) => (
                    <motion.div 
                      key={idx}
                      className="flex items-start gap-2"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                    >
                      <Zap className="h-4 w-4 text-primary-600 flex-shrink-0 mt-0.5" />
                      <span className="font-medium">{tag}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Call-out boxes - VERSION COMPACTE */}
              <motion.div 
                className="mt-8 grid gap-4 md:grid-cols-2"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className="glass-card rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950/20 dark:to-primary-900/20 p-4 shadow-md border-l-4 border-primary-500 tech-border relative overflow-hidden"
                  whileHover={{ scale: 1.03, y: -3 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-0"
                    whileHover={{ opacity: 1 }}
                    style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), transparent)' }}
                  />
                  <div className="flex items-center gap-2 relative z-10">
                    <motion.div
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 text-white flex-shrink-0"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Zap className="h-4 w-4" />
                    </motion.div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">Expertise Technique</h3>
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        Accompagnement projets complexes
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="glass-card rounded-lg bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-950/20 dark:to-accent-900/20 p-4 shadow-md border-l-4 border-accent-500 tech-border relative overflow-hidden"
                  whileHover={{ scale: 1.03, y: -3 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-0"
                    whileHover={{ opacity: 1 }}
                    style={{ background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.08), transparent)' }}
                  />
                  <div className="flex items-center gap-2 relative z-10">
                    <motion.div
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500 text-white flex-shrink-0"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Award className="h-4 w-4" />
                    </motion.div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">Certifié EN 9100</h3>
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        Standards aéronautiques exigeants
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Partage social - COMPACT */}
              <motion.div 
                className="mt-8 glass-card rounded-lg p-4 shadow-md tech-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-primary-600" />
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Partager</h3>
                  </div>
                </div>
                <div className="flex gap-2">
                  <motion.a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-[#1DA1F2] px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-[#1a8cd8] flex-1"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Twitter className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Twitter</span>
                  </motion.a>
                  <motion.a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-[#0A66C2] px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-[#084d92] flex-1"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Linkedin className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">LinkedIn</span>
                  </motion.a>
                  <motion.a
                    href={`mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareUrl)}`}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-gray-700 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-gray-600 flex-1"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Email</span>
                  </motion.a>
                </div>
              </motion.div>

              {/* Navigation entre articles - COMPACT */}
              {(previousPost || nextPost) && (
                <motion.div 
                  className="mt-10 grid gap-3 border-t border-gray-200 dark:border-gray-700 pt-8 md:grid-cols-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  {previousPost && (
                    <motion.div whileHover={{ x: -5 }} transition={{ duration: 0.3 }}>
                      <Link
                        href={`/blog/${previousPost.slug}`}
                        className="group flex flex-col glass-card rounded-lg p-4 shadow-md transition-all hover:shadow-lg tech-border h-full"
                      >
                        <span className="mb-1 text-xs font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-1">
                          <ArrowLeft className="h-3 w-3" />
                          Précédent
                        </span>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                          {previousPost.title}
                        </h4>
                      </Link>
                    </motion.div>
                  )}
                  {nextPost && (
                    <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.3 }}>
                      <Link
                        href={`/blog/${nextPost.slug}`}
                        className="group flex flex-col glass-card rounded-lg p-4 shadow-md transition-all hover:shadow-lg tech-border text-right h-full"
                      >
                        <span className="mb-1 text-xs font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-1 justify-end">
                          Suivant
                          <ArrowRight className="h-3 w-3" />
                        </span>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                          {nextPost.title}
                        </h4>
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Articles connexes - COMPACT */}
              {relatedPosts.length > 0 && (
                <motion.div 
                  className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-8"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="h-5 w-5 text-primary-600" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Articles connexes</h3>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    {relatedPosts.map((relatedPost, idx) => (
                      <motion.div
                        key={relatedPost.slug}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                      >
                        <Link
                          href={`/blog/${relatedPost.slug}`}
                          className="group overflow-hidden rounded-lg glass-card shadow-md transition-all hover:shadow-xl tech-border block h-full"
                        >
                          {relatedPost.image && (
                            <div className="relative h-32 overflow-hidden">
                              <motion.img
                                src={relatedPost.image}
                                alt={relatedPost.title}
                                className="h-full w-full object-cover"
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.6 }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                            </div>
                          )}
                          <div className="p-3">
                            <motion.h4 
                              className="mb-1 text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2"
                              whileHover={{ x: 3 }}
                            >
                              {relatedPost.title}
                            </motion.h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                              {relatedPost.description}
                            </p>
                            {relatedPost.tags && relatedPost.tags[0] && (
                              <span className="inline-block mt-2 rounded-md bg-primary-100 dark:bg-primary-900/30 px-2 py-0.5 text-xs font-medium text-primary-700 dark:text-primary-300">
                                {relatedPost.tags[0]}
                              </span>
                            )}
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Retour au blog - COMPACT */}
              <motion.div 
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg tech-border group"
                  >
                    <motion.div
                      whileHover={{ x: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </motion.div>
                    Retour au blog
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
