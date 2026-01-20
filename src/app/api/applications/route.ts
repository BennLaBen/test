import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

// GET /api/applications - Get applications (admin: all, user: own)
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const isAdmin = session.user.role === 'ADMIN'
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const jobId = searchParams.get('jobId')

    const where: any = {}
    
    // Non-admin can only see their own applications
    if (!isAdmin) {
      where.userId = session.user.id
    }
    
    if (status) where.status = status
    if (jobId) where.jobId = jobId

    const applications = await prisma.application.findMany({
      where,
      include: {
        job: {
          select: { title: true, slug: true, type: true, location: true }
        },
        user: isAdmin ? {
          select: { firstName: true, lastName: true, email: true }
        } : false
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, applications })
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des candidatures' },
      { status: 500 }
    )
  }
}

// POST /api/applications - Submit an application (public)
const applicationSchema = z.object({
  jobId: z.string().min(1, 'L\'offre est requise'),
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  message: z.string().optional(),
  cvUrl: z.string().url('URL du CV invalide'),
  cvName: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = applicationSchema.parse(body)

    // Check if job exists and is published
    const job = await prisma.job.findUnique({ where: { id: data.jobId } })
    if (!job || !job.published) {
      return NextResponse.json(
        { success: false, error: 'Offre non trouvée ou non disponible' },
        { status: 404 }
      )
    }

    // Check if user is logged in
    const session = await auth()
    const userId = session?.user?.id || null

    // Check for duplicate application
    const existing = await prisma.application.findFirst({
      where: {
        jobId: data.jobId,
        email: data.email,
      }
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Vous avez déjà postulé à cette offre' },
        { status: 400 }
      )
    }

    const application = await prisma.application.create({
      data: {
        jobId: data.jobId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        message: data.message,
        cvUrl: data.cvUrl,
        cvName: data.cvName,
        userId,
      },
      include: {
        job: { select: { title: true } }
      }
    })

    return NextResponse.json(
      { 
        success: true, 
        application,
        message: 'Votre candidature a été envoyée avec succès'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating application:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'envoi de la candidature' },
      { status: 500 }
    )
  }
}
