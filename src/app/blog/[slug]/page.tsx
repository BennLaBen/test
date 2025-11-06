'use client'

import { useEffect, useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import { SEO } from '@/components/SEO'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import type { BlogPost } from '@/lib/posts'
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
  CheckCircle2
} from 'lucide-react'

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const { t, i18n } = useTranslation('blog')
  
  const [post, setPost] = useState<BlogPost | null>(null)
  const [allPosts, setAllPosts] = useState<BlogPost[]>([])
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
      
      <article className="bg-white dark:bg-gray-900">
        {/* Hero Section avec Image */}
        {post.image && (
          <div className="relative h-[400px] lg:h-[500px] overflow-hidden bg-gray-900">
            {/* Image de fond */}
            <img
              src={post.image}
              alt={post.title}
              className="absolute inset-0 h-full w-full object-cover opacity-50"
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
            
            {/* Contenu */}
            <div className="relative h-full">
              <div className="container flex h-full flex-col justify-end pb-12 lg:pb-16">
                {/* Breadcrumb */}
                <nav className="mb-6" aria-label="Breadcrumb">
                  <ol className="flex items-center space-x-2 text-sm text-gray-300">
                    <li>
                      <Link href="/" className="hover:text-white transition-colors">
                        LLEDO Industries
                      </Link>
                    </li>
                    <li className="flex items-center">
                      <ArrowRight className="mx-2 h-4 w-4" />
                      <Link href="/blog" className="hover:text-white transition-colors">
                        Blog
                      </Link>
                    </li>
                    <li className="flex items-center">
                      <ArrowRight className="mx-2 h-4 w-4" />
                      <span className="text-white font-medium line-clamp-1">{post.title}</span>
                    </li>
                  </ol>
                </nav>

                {/* Badge langue + Tags */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {/* Badge "Article en français" si interface en anglais */}
                  {i18n.language === 'en' && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-500/90 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-white shadow-lg">
                      🇫🇷 Article available in French
                    </span>
                  )}
                  
                  {/* Tags */}
                  {post.tags && post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary-500/90 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-white shadow-lg"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Titre */}
                <h1 className="mb-6 text-4xl font-bold text-white lg:text-5xl xl:text-6xl leading-tight max-w-5xl">
                  {post.title}
                </h1>

                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{readingTime} min de lecture</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Description en vedette */}
        {post.description && (
          <div className="border-l-4 border-primary-500 bg-primary-50 dark:bg-primary-950/20 py-6 -mt-8 relative z-10">
            <div className="container">
              <p className="text-lg lg:text-xl text-gray-700 dark:text-gray-300 font-medium leading-relaxed max-w-4xl">
                {post.description}
              </p>
            </div>
          </div>
        )}

        {/* Layout deux colonnes */}
        <div className="container py-12 lg:py-16">
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Sidebar gauche (sticky) */}
            <aside className="lg:col-span-3 lg:sticky lg:top-24 lg:self-start space-y-6">
              {/* Auteur */}
              <div className="rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950/20 dark:to-primary-900/20 p-6 shadow-md">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-500 text-2xl font-bold text-white shadow-lg">
                  {post.author.charAt(0)}
                </div>
                <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">{post.author}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(post.date).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              {/* Temps de lecture */}
              <div className="rounded-xl bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-950/20 dark:to-accent-900/20 p-6 shadow-md">
                <div className="mb-3 flex items-center justify-center">
                  <div className="rounded-full bg-accent-500 p-3 shadow-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="text-center text-3xl font-bold text-gray-900 dark:text-white">{readingTime} min</p>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">de lecture</p>
              </div>

              {/* Mini CTA */}
              <div className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="mb-2 text-sm font-bold text-gray-900 dark:text-white">Un projet ?</h3>
                <p className="mb-4 text-xs text-gray-600 dark:text-gray-400">
                  Contactez nos experts pour discuter de vos besoins
                </p>
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-600 hover:shadow-lg"
                >
                  Nous contacter
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </aside>

            {/* Contenu principal */}
            <div className="lg:col-span-9">
              {/* Article content avec styling premium */}
              <div className="prose prose-lg prose-primary dark:prose-invert max-w-none
                prose-headings:font-bold
                prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-12 prose-h2:border-l-4 prose-h2:border-primary-500 prose-h2:pl-6 prose-h2:bg-gradient-to-r prose-h2:from-primary-50 prose-h2:to-transparent dark:prose-h2:from-primary-950/20 prose-h2:py-4 prose-h2:rounded-r-lg prose-h2:shadow-sm
                prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:text-primary-700 dark:prose-h3:text-primary-400 prose-h3:flex prose-h3:items-center prose-h3:gap-3 prose-h3:before:content-[''] prose-h3:before:h-1 prose-h3:before:w-8 prose-h3:before:bg-gradient-to-r prose-h3:before:from-primary-500 prose-h3:before:to-accent-500 prose-h3:before:rounded-full
                prose-h4:text-xl prose-h4:mb-3 prose-h4:mt-6 prose-h4:text-gray-900 dark:prose-h4:text-gray-100
                prose-p:text-xl prose-p:leading-[1.8] prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:mb-6
                prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-a:no-underline prose-a:font-semibold hover:prose-a:underline hover:prose-a:text-primary-700
                prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-bold prose-strong:bg-yellow-100 dark:prose-strong:bg-yellow-900/30 prose-strong:px-1 prose-strong:py-0.5 prose-strong:rounded
                prose-ul:my-6 prose-ul:space-y-2
                prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:leading-relaxed prose-li:marker:text-primary-500 prose-li:marker:text-xl
                prose-blockquote:border-l-4 prose-blockquote:border-accent-500 prose-blockquote:bg-gradient-to-r prose-blockquote:from-accent-50 prose-blockquote:to-transparent dark:prose-blockquote:from-accent-950/20 prose-blockquote:py-4 prose-blockquote:pr-6 prose-blockquote:my-8 prose-blockquote:italic prose-blockquote:font-medium prose-blockquote:text-gray-800 dark:prose-blockquote:text-gray-200 prose-blockquote:shadow-md prose-blockquote:rounded-r-lg
                prose-code:bg-gray-900 dark:prose-code:bg-gray-800 prose-code:text-primary-400 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-[''] prose-code:after:content-['']
                prose-pre:bg-gray-900 dark:prose-pre:bg-gray-800 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:shadow-xl prose-pre:border prose-pre:border-gray-700
                prose-img:rounded-xl prose-img:shadow-2xl prose-img:border-4 prose-img:border-white dark:prose-img:border-gray-800
                prose-table:border-collapse prose-table:w-full prose-table:shadow-lg prose-table:rounded-lg prose-table:overflow-hidden
                prose-thead:bg-primary-500 prose-thead:text-white
                prose-th:p-4 prose-th:font-bold prose-th:text-left
                prose-td:p-4 prose-td:border-b prose-td:border-gray-200 dark:prose-td:border-gray-700
                prose-tr:hover:bg-primary-50 dark:prose-tr:hover:bg-primary-950/20 prose-tr:transition-colors
                first-letter:text-7xl first-letter:font-bold first-letter:text-primary-500 first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:mt-1"
              >
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>

              {/* Call-out boxes */}
              <div className="mt-12 grid gap-6 md:grid-cols-2">
                <div className="rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950/20 dark:to-primary-900/20 p-6 shadow-lg border-l-4 border-primary-500">
                  <div className="mb-3 flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Expertise Technique</h3>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Nos équipes d'experts sont à votre disposition pour vous accompagner dans vos projets les plus complexes.
                  </p>
                </div>

                <div className="rounded-xl bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-950/20 dark:to-accent-900/20 p-6 shadow-lg border-l-4 border-accent-500">
                  <div className="mb-3 flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-accent-600 dark:text-accent-400" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Certifié EN 9100</h3>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Nos processus sont certifiés selon les standards aéronautiques les plus exigeants.
                  </p>
                </div>
              </div>

              {/* Partage social */}
              <div className="mt-12 rounded-xl bg-gray-50 dark:bg-gray-800 p-6 shadow-md">
                <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Partager cet article</h3>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-[#1DA1F2] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#1a8cd8] hover:shadow-lg"
                  >
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-[#0A66C2] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#084d92] hover:shadow-lg"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                  <a
                    href={`mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareUrl)}`}
                    className="flex items-center gap-2 rounded-lg bg-gray-700 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-gray-600 hover:shadow-lg"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </a>
                </div>
              </div>

              {/* Navigation entre articles */}
              {(previousPost || nextPost) && (
                <div className="mt-16 grid gap-6 border-t border-gray-200 dark:border-gray-700 pt-12 md:grid-cols-2">
                  {previousPost && (
                    <Link
                      href={`/blog/${previousPost.slug}`}
                      className="group flex flex-col rounded-xl bg-white dark:bg-gray-800 p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl border border-gray-200 dark:border-gray-700"
                    >
                      <span className="mb-2 text-sm font-semibold text-primary-600 dark:text-primary-400">← Article précédent</span>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {previousPost.title}
                      </h4>
                    </Link>
                  )}
                  {nextPost && (
                    <Link
                      href={`/blog/${nextPost.slug}`}
                      className="group flex flex-col rounded-xl bg-white dark:bg-gray-800 p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl border border-gray-200 dark:border-gray-700 text-right"
                    >
                      <span className="mb-2 text-sm font-semibold text-primary-600 dark:text-primary-400">Article suivant →</span>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {nextPost.title}
                      </h4>
                    </Link>
                  )}
                </div>
              )}

              {/* Articles connexes */}
              {relatedPosts.length > 0 && (
                <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-12">
                  <h3 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">Articles connexes</h3>
                  <div className="grid gap-6 md:grid-cols-3">
                    {relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost.slug}
                        href={`/blog/${relatedPost.slug}`}
                        className="group overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-md transition-all hover:-translate-y-2 hover:shadow-xl"
                      >
                        {relatedPost.image && (
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={relatedPost.image}
                              alt={relatedPost.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h4 className="mb-2 text-base font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                            {relatedPost.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {relatedPost.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Retour au blog */}
              <div className="mt-12 text-center">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-8 py-3 text-base font-semibold text-white transition-all hover:bg-primary-600 hover:shadow-lg"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Retour au blog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
