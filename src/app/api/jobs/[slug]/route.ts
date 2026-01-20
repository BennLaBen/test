import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

// Force dynamic to ensure fresh data on each request
export const dynamic = 'force-dynamic'

// GET /api/jobs/[slug] - Get a single job
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const job = await prisma.job.findUnique({
      where: { slug: params.slug },
      include: {
        _count: {
          select: { applications: true }
        }
      }
    })

    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Offre non trouvée' },
        { status: 404 }
      )
    }

    // Check if unpublished job - only admin can see
    if (!job.published) {
      const session = await auth()
      if (session?.user?.role !== 'ADMIN') {
        return NextResponse.json(
          { success: false, error: 'Offre non trouvée' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json({ success: true, job })
  } catch (error) {
    console.error('Error fetching job:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération de l\'offre' },
      { status: 500 }
    )
  }
}

// PUT /api/jobs/[slug] - Update a job (admin only)
const updateJobSchema = z.object({
  title: z.string().min(1).optional(),
  type: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  department: z.string().optional(),
  salary: z.string().optional(),
  description: z.string().min(10).optional(),
  requirements: z.string().min(10).optional(),
  benefits: z.string().optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const data = updateJobSchema.parse(body)

    const job = await prisma.job.update({
      where: { slug: params.slug },
      data,
    })

    // Revalidate career pages for instant public update
    revalidatePath('/carriere')
    revalidatePath(`/carriere/${job.slug}`)

    return NextResponse.json({ success: true, job })
  } catch (error) {
    console.error('Error updating job:', error)
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

// DELETE /api/jobs/[slug] - Delete a job (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    // Get job before delete for slug
    const job = await prisma.job.findUnique({ where: { slug: params.slug } })
    
    await prisma.job.delete({ where: { slug: params.slug } })

    // Revalidate career pages for instant public update
    revalidatePath('/carriere')
    if (job?.slug) {
      revalidatePath(`/carriere/${job.slug}`)
    }

    return NextResponse.json({ success: true, message: 'Offre supprimée' })
  } catch (error) {
    console.error('Error deleting job:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}
