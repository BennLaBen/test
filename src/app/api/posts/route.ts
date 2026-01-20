import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAllPosts } from '@/lib/posts'

// Force dynamic to ensure fresh data on each request
export const dynamic = 'force-dynamic'

// Check if we should use database (after migration) or MDX files (fallback)
async function getPostsFromDB() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
  })
  
  return posts.map(post => ({
    slug: post.slug,
    title: post.title,
    description: post.excerpt || '',
    date: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
    author: post.authorName || 'LLEDO Industries',
    tags: post.tags,
    locale: 'fr',
    featured: post.featured,
    image: post.image || '',
    content: post.content,
    url: `/blog/${post.slug}`,
    _id: post.id,
  }))
}

export async function GET(request: Request) {
  try {
    // Try database first (after migration)
    const dbPosts = await getPostsFromDB()
    
    if (dbPosts.length > 0) {
      return NextResponse.json({ posts: dbPosts, success: true, source: 'database' })
    }
    
    // Fallback to MDX files if database is empty
    const mdxPosts = getAllPosts()
    return NextResponse.json({ posts: mdxPosts, success: true, source: 'mdx' })
  } catch (error) {
    console.error('Error fetching posts:', error)
    
    // Final fallback to MDX if database error
    try {
      const mdxPosts = getAllPosts()
      return NextResponse.json({ posts: mdxPosts, success: true, source: 'mdx-fallback' })
    } catch {
      return NextResponse.json(
        { posts: [], success: false, error: 'Failed to fetch posts' },
        { status: 500 }
      )
    }
  }
}

