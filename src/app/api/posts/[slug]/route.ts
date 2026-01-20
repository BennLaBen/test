import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getPostBySlug } from '@/lib/posts'

// Force dynamic to ensure fresh data on each request
export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    // Try database first
    const dbPost = await prisma.blogPost.findUnique({
      where: { slug, published: true },
    })

    if (dbPost) {
      const post = {
        slug: dbPost.slug,
        title: dbPost.title,
        description: dbPost.excerpt || '',
        date: dbPost.publishedAt?.toISOString() || dbPost.createdAt.toISOString(),
        author: dbPost.authorName || 'LLEDO Industries',
        tags: dbPost.tags,
        locale: 'fr',
        featured: dbPost.featured,
        image: dbPost.image || '',
        content: dbPost.content,
        url: `/blog/${dbPost.slug}`,
        _id: dbPost.id,
      }
      return NextResponse.json({ post, success: true, source: 'database' })
    }

    // Fallback to MDX
    const mdxPost = getPostBySlug(slug)

    if (!mdxPost) {
      return NextResponse.json(
        { post: null, success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ post: mdxPost, success: true, source: 'mdx' })
  } catch (error) {
    console.error('Error fetching post:', error)
    
    // Fallback to MDX on error
    try {
      const mdxPost = getPostBySlug(params.slug)
      if (mdxPost) {
        return NextResponse.json({ post: mdxPost, success: true, source: 'mdx-fallback' })
      }
    } catch {}
    
    return NextResponse.json(
      { post: null, success: false, error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

