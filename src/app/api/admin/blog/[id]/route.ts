import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getAdminFromRequest } from '@/lib/auth/admin-guard'
import { z } from 'zod'

// GET /api/admin/blog/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminFromRequest()
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const post = await prisma.blogPost.findUnique({
      where: { id: params.id }
    })

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Article non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/blog/[id]
const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  excerpt: z.string().optional(),
  content: z.string().min(10).optional(),
  image: z.string().optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
  authorName: z.string().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminFromRequest()
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const data = updatePostSchema.parse(body)

    // Check if post exists
    const existing = await prisma.blogPost.findUnique({ where: { id: params.id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Article non trouvé' },
        { status: 404 }
      )
    }

    // Handle publishedAt
    const updateData: any = { ...data }
    if (data.published === true && !existing.publishedAt) {
      updateData.publishedAt = new Date()
    } else if (data.published === false) {
      updateData.publishedAt = null
    }

    const post = await prisma.blogPost.update({
      where: { id: params.id },
      data: updateData,
    })

    // Revalidate blog pages for instant update
    revalidatePath('/blog')
    revalidatePath(`/blog/${post.slug}`)

    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error('Error updating blog post:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/blog/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminFromRequest()
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    // Get post before delete for slug
    const post = await prisma.blogPost.findUnique({ where: { id: params.id } })
    
    await prisma.blogPost.delete({ where: { id: params.id } })

    // Revalidate blog pages
    revalidatePath('/blog')
    if (post?.slug) {
      revalidatePath(`/blog/${post.slug}`)
    }

    return NextResponse.json({ success: true, message: 'Article supprimé' })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}
