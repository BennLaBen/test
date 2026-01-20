import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

// Force dynamic to ensure fresh data on each request
export const dynamic = 'force-dynamic'

// GET /api/jobs - Get all published jobs (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeUnpublished = searchParams.get('all') === 'true'
    
    // Check if admin for unpublished jobs
    const session = await auth()
    const isAdmin = session?.user?.role === 'ADMIN'

    const jobs = await prisma.job.findMany({
      where: includeUnpublished && isAdmin ? {} : { published: true },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { applications: true }
        }
      }
    })

    return NextResponse.json({ success: true, jobs })
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des offres' },
      { status: 500 }
    )
  }
}

// POST /api/jobs - Create a new job (admin only)
const createJobSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  slug: z.string().min(1, 'Le slug est requis'),
  type: z.string().min(1, 'Le type est requis'),
  location: z.string().min(1, 'La localisation est requise'),
  department: z.string().optional(),
  salary: z.string().optional(),
  description: z.string().min(10, 'La description est requise'),
  requirements: z.string().min(10, 'Les prérequis sont requis'),
  benefits: z.string().optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
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
    const data = createJobSchema.parse(body)

    // Check if slug already exists
    const existing = await prisma.job.findUnique({ where: { slug: data.slug } })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Ce slug existe déjà' },
        { status: 400 }
      )
    }

    const job = await prisma.job.create({
      data: {
        title: data.title,
        slug: data.slug,
        type: data.type,
        location: data.location,
        department: data.department,
        salary: data.salary,
        description: data.description,
        requirements: data.requirements,
        benefits: data.benefits,
        published: data.published,
        featured: data.featured,
      }
    })

    // Revalidate career pages for instant public update
    revalidatePath('/carriere')
    revalidatePath(`/carriere/${job.slug}`)

    return NextResponse.json({ success: true, job }, { status: 201 })
  } catch (error) {
    console.error('Error creating job:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création de l\'offre' },
      { status: 500 }
    )
  }
}
