import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

// GET /api/admin/blog - Get all blog posts (admin)
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, posts })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des articles' },
      { status: 500 }
    )
  }
}

// POST /api/admin/blog - Create blog post (admin)
const createPostSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  slug: z.string().min(1, 'Le slug est requis'),
  excerpt: z.string().optional(),
  content: z.string().min(10, 'Le contenu est requis'),
  image: z.string().optional(),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  authorName: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const data = createPostSchema.parse(body)

    // Check if slug exists
    const existing = await prisma.blogPost.findUnique({ where: { slug: data.slug } })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Ce slug existe déjà' },
        { status: 400 }
      )
    }

    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        image: data.image,
        tags: data.tags,
        published: data.published,
        featured: data.featured,
        authorName: data.authorName || `${session.user.firstName} ${session.user.lastName}`,
        publishedAt: data.published ? new Date() : null,
      }
    })

    // Revalidate blog pages for instant update
    revalidatePath('/blog')
    revalidatePath(`/blog/${post.slug}`)

    return NextResponse.json({ success: true, post }, { status: 201 })
  } catch (error) {
    console.error('Error creating blog post:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création de l\'article' },
      { status: 500 }
    )
  }
}
