module.exports = {
  siteUrl: process.env.SITE_URL || 'https://lledo-industries.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/admin/*', '/api/*', '/private/*'],
  additionalPaths: async (config) => {
    const result = []
    
    // Add blog posts
    const { allPosts } = await import('./contentlayer/generated')
    allPosts.forEach((post) => {
      result.push({
        loc: `/blog/${post.slug}`,
        lastmod: new Date(post.date).toISOString(),
        changefreq: 'monthly',
        priority: 0.7,
      })
    })
    
    // Add products
    const { allProducts } = await import('./contentlayer/generated')
    allProducts.forEach((product) => {
      result.push({
        loc: `/produits/${product.slug}`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.8,
      })
    })
    
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
