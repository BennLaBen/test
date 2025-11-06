'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { SEO } from '@/components/SEO'
import { useTranslation } from 'react-i18next'
import type { BlogPost } from '@/lib/posts'

export default function BlogPage() {
  const { t, i18n } = useTranslation('blog')
  const [posts, setPosts] = useState<BlogPost[]>([])
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
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 py-16 text-white dark:from-primary-700 dark:to-primary-900 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[url('/images/grid.svg')] bg-center" />
        </div>
        
        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex items-center justify-center gap-3">
              <div className="h-1 w-12 bg-white/60 rounded-full" />
              <span className="text-sm font-semibold uppercase tracking-wider text-primary-100">
                {t('hero.badge')}
              </span>
              <div className="h-1 w-12 bg-white/60 rounded-full" />
            </div>
            
            {/* Badge "Articles en français" si interface en anglais */}
            {i18n.language === 'en' && (
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent-500/90 backdrop-blur-sm px-6 py-2 text-sm font-semibold text-white shadow-lg">
                🇫🇷 Articles available in French only
              </div>
            )}
            
            <h1 className="mb-6 text-4xl font-bold lg:text-6xl">
              {t('hero.title')}
            </h1>
            
            <p className="mx-auto max-w-2xl text-lg text-primary-100 lg:text-xl">
              {t('hero.subtitle')}
            </p>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold">{posts.length}</div>
                <div className="mt-1 text-sm text-primary-200">{t('hero.stats.articles')}</div>
              </div>
              <div>
                <div className="text-4xl font-bold">5</div>
                <div className="mt-1 text-sm text-primary-200">{t('hero.stats.entities')}</div>
              </div>
              <div>
                <div className="text-4xl font-bold">36</div>
                <div className="mt-1 text-sm text-primary-200">{t('hero.stats.experience')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="container py-16 lg:py-24">
          <div className="mb-12">
            <div className="flex items-center gap-4">
              <div className="h-1 w-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">
                {t('sections.latestArticles')}
              </h2>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            {/* Premier article à la une - Span 8 colonnes */}
            {featuredPosts[0] && (
              <Link
                href={`/blog/${featuredPosts[0].slug}`}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:bg-gray-800 lg:col-span-8"
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
            )}

            {/* Deuxième article à la une - Span 4 colonnes */}
            {featuredPosts[1] && (
              <Link
                href={`/blog/${featuredPosts[1].slug}`}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:bg-gray-800 lg:col-span-4"
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
            )}
          </div>
        </section>
      )}

      {/* All Articles Grid */}
      <section className="container py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="mb-12">
          <div className="flex items-center gap-4">
            <div className="h-1 w-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">
              {t('sections.allArticles')}
            </h2>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {regularPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:bg-gray-800"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                
                {/* Tags sur l'image */}
                <div className="absolute left-4 top-4">
                  {post.tags?.[0] && (
                    <span className="rounded-full bg-primary-500 px-3 py-1 text-xs font-medium text-white shadow-lg">
                      {post.tags[0]}
                    </span>
                  )}
                </div>
                
                {/* Date en bas */}
                <div className="absolute bottom-4 left-4 text-sm font-medium text-white">
                  {new Date(post.date).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>

              <div className="p-6">
                <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                  {post.title}
                </h3>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                  {post.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {post.author}
                  </span>
                  <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                    {t('cardCta')} →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
