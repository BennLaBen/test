import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const createReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  content: z.string().min(10),
  company: z.string().optional(),
})

export async function GET() {
  try {
    // Only return approved reviews for public display
    const reviews = await prisma.review.findMany({
      where: { approved: true },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    // Transform to include author name
    const formattedReviews = reviews.map(r => ({
      id: r.id,
      authorName: r.user ? `${r.user.firstName} ${r.user.lastName}`.trim() : (r.authorName || 'Client'),
      authorRole: r.authorRole || undefined,
      authorCompany: r.company || 'Client LLEDO',
      rating: r.rating,
      content: r.content,
      createdAt: r.createdAt,
      featured: r.featured,
    }))

    return NextResponse.json({ success: true, reviews: formattedReviews })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des avis' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Vous devez être connecté pour laisser un avis' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createReviewSchema.parse(body)

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { firstName: true, lastName: true, company: true },
    })

    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        rating: validatedData.rating,
        content: validatedData.content,
        company: validatedData.company || user?.company,
        approved: false, // Needs admin approval
      },
    })

    return NextResponse.json({ 
      success: true, 
      review,
      message: 'Votre avis a été soumis et sera publié après validation par notre équipe.' 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating review:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la soumission de l\'avis' },
      { status: 500 }
    )
  }
}

