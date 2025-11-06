module.exports = {
  siteUrl: process.env.SITE_URL || 'https://lledo-industries.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/admin/*', '/api/*', '/private/*'],
  additionalPaths: async (config) => {
    const result = []
    
    // Add blog posts
    try {
      const { getAllPosts } = await import('./src/lib/posts.ts')
      const allPosts = getAllPosts()
      allPosts.forEach((post) => {
        result.push({
          loc: `/blog/${post.slug}`,
          lastmod: new Date(post.date).toISOString(),
          changefreq: 'monthly',
          priority: 0.7,
        })
      })
    } catch (error) {
      console.warn('Could not load blog posts for sitemap:', error.message)
    }
    
    return result
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/private/'],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
      {
        userAgent: 'Claude-Web',
        disallow: '/',
      },
    ],
    additionalSitemaps: [
      'https://lledo-industries.com/sitemap.xml',
    ],
  },
}
