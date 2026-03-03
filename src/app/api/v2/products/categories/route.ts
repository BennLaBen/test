import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/v2/products/categories — List all categories with product counts
export async function GET() {
  try {
    const categories = await prisma.marketCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: { select: { products: true } },
      },
    })

    return NextResponse.json({
      success: true,
      data: categories.map((c) => ({
        id: c.id,
        slug: c.slug,
        label: c.label,
        description: c.description,
        icon: c.icon,
        count: c._count.products,
      })),
    })
  } catch (error) {
    console.error('[API v2] GET /products/categories error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
