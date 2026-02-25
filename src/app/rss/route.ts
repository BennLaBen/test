import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/posts'

export const runtime = 'nodejs'

function escapeXml(unsafe: string) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://lledo-industries.com').trim()
  
  // Récupérer tous les posts
  const allPosts = getAllPosts()
  
  // Filtrer uniquement les posts en français
  const frenchPosts = allPosts.filter((post) => post.locale === 'fr')
  
  const items = frenchPosts
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .map((post) => {
      const url = `${siteUrl}${post.url}`
      return `
        <item>
          <title>${escapeXml(post.title)}</title>
          <link>${url}</link>
          <guid>${url}</guid>
          <description>${escapeXml(post.description)}</description>
          <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        </item>`
    })
    .join('')

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>LLEDO Industries - Blog</title>
      <link>${siteUrl}</link>
      <description>Expertise en usinage de précision, tôlerie, maintenance industrielle et conception mécanique</description>
      <language>fr-FR</language>
      ${items}
    </channel>
  </rss>`

  return new NextResponse(rss, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}


