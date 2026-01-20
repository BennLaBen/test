import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force dynamic to ensure fresh data on each request
export const dynamic = 'force-dynamic'

// GET /api/companies - Get all published companies
export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ success: true, companies })
  } catch (error) {
    console.error('Error fetching companies:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des entreprises' },
      { status: 500 }
    )
  }
}
