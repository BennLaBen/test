import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/v2/migrate/fix-turntable — Re-link turntable images to products
export async function GET() {
  try {
    // Known turntables that were generated before the DB re-seed
    const turntables = [
      {
        sku: 'RL-R125-02-000',
        slug: 'roller-h125',
        config: { enabled: true, hFrames: 36, vLevels: 3, format: 'webp', baseUrl: '/images/aerotools/360/roller-h125' },
      },
    ]

    const results = []

    for (const t of turntables) {
      const product = await prisma.marketProduct.findFirst({ where: { sku: t.sku } })
      if (!product) {
        results.push({ sku: t.sku, status: 'not_found' })
        continue
      }

      await prisma.marketProduct.update({
        where: { id: product.id },
        data: { turntable: t.config },
      })

      results.push({ sku: t.sku, name: product.name, status: 'linked', turntable: t.config })
    }

    return NextResponse.json({ success: true, results })
  } catch (error: any) {
    console.error('[FIX-TURNTABLE] Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
