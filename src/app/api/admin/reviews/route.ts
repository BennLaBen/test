import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromRequest } from '@/lib/auth/admin-guard'
import { z } from 'zod'

// GET /api/admin/reviews - Get all reviews (admin only)
export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest()
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const reviews = await prisma.review.findMany({
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, reviews })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des avis' },
      { status: 500 }
    )
  }
}

// POST /api/admin/reviews - Create a manual review (admin only)
const createReviewSchema = z.object({
  authorName: z.string().min(1, 'Le nom est requis'),
  authorRole: z.string().optional(),
  rating: z.number().min(1).max(5),
  content: z.string().min(5, 'Le contenu est requis'),
  company: z.string().optional(),
  sector: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest()
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const data = createReviewSchema.parse(body)

    const review = await prisma.review.create({
      data: {
        authorName: data.authorName,
        authorRole: data.authorRole,
        rating: data.rating,
        content: data.content,
        company: data.company,
        sector: data.sector,
        approved: true,
        featured: false,
      },
    })

    return NextResponse.json({ success: true, review }, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création' },
      { status: 500 }
    )
  }
}
