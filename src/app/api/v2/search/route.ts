import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/v2/search?q=xxx&type=products|quotes|orders|all
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')
    const type = searchParams.get('type') || 'all'
    const limit = Math.min(30, parseInt(searchParams.get('limit') || '20'))

    if (!q || q.length < 2) {
      return NextResponse.json({ error: 'Requête trop courte (min 2 caractères)' }, { status: 400 })
    }

    const results: any = {}

    // Search products
    if (type === 'all' || type === 'products') {
      const products = await prisma.marketProduct.findMany({
        where: {
          published: true,
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
            { shortDescription: { contains: q, mode: 'insensitive' } },
            { sku: { contains: q, mode: 'insensitive' } },
            { compatibility: { hasSome: [q] } },
          ],
        },
        select: {
          id: true, slug: true, sku: true, name: true, shortDescription: true,
          image: true, inStock: true, compatibility: true,
          category: { select: { slug: true, label: true } },
        },
        take: limit,
      })
      results.products = { items: products, count: products.length }
    }

    // Search quotes
    if (type === 'all' || type === 'quotes') {
      const quotes = await prisma.quote.findMany({
        where: {
          OR: [
            { reference: { contains: q, mode: 'insensitive' } },
            { contactCompany: { contains: q, mode: 'insensitive' } },
            { contactName: { contains: q, mode: 'insensitive' } },
            { contactEmail: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true, reference: true, status: true, contactCompany: true,
          contactName: true, createdAt: true,
          _count: { select: { items: true } },
        },
        take: limit,
        orderBy: { createdAt: 'desc' },
      })
      results.quotes = { items: quotes, count: quotes.length }
    }

    // Search orders
    if (type === 'all' || type === 'orders') {
      const orders = await prisma.order.findMany({
        where: {
          OR: [
            { reference: { contains: q, mode: 'insensitive' } },
            { poNumber: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true, reference: true, status: true, totalAmount: true,
          createdAt: true, poNumber: true,
          _count: { select: { items: true } },
        },
        take: limit,
        orderBy: { createdAt: 'desc' },
      })
      results.orders = { items: orders, count: orders.length }
    }

    // Search serial numbers
    if (type === 'all' || type === 'serials') {
      const serials = await prisma.serialNumber.findMany({
        where: {
          OR: [
            { serial: { contains: q, mode: 'insensitive' } },
            { batchNumber: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true, serial: true, batchNumber: true, status: true,
          product: { select: { name: true, sku: true, slug: true } },
        },
        take: limit,
      })
      results.serials = { items: serials, count: serials.length }
    }

    const totalCount = Object.values(results).reduce((sum: number, r: any) => sum + (r?.count || 0), 0)

    return NextResponse.json({
      success: true,
      query: q,
      totalCount,
      results,
    })
  } catch (error) {
    console.error('[API v2] GET /search error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
