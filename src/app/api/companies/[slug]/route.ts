import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force dynamic to ensure fresh data on each request
export const dynamic = 'force-dynamic'

// GET /api/companies/[slug] - Get a single company by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const company = await prisma.company.findUnique({
      where: { slug: params.slug, published: true },
    })

    if (!company) {
      return NextResponse.json(
        { success: false, error: 'Entreprise non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, company })
  } catch (error) {
    console.error('Error fetching company:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération' },
      { status: 500 }
    )
  }
}
