import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/v2/analytics — Dashboard analytics data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d'

    // Calculate date range
    const now = new Date()
    let since: Date
    switch (period) {
      case '7d': since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); break
      case '30d': since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); break
      case '90d': since = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000); break
      case '1y': since = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000); break
      default: since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    // Parallel queries
    const [
      totalProducts,
      publishedProducts,
      totalQuotes,
      recentQuotes,
      quotesByStatus,
      totalOrders,
      recentOrders,
      ordersByStatus,
      topProducts,
      topCategories,
      lowStockProducts,
    ] = await Promise.all([
      // Product counts
      prisma.marketProduct.count(),
      prisma.marketProduct.count({ where: { published: true } }),

      // Quote totals
      prisma.quote.count(),
      prisma.quote.count({ where: { createdAt: { gte: since } } }),

      // Quotes by status
      prisma.quote.groupBy({
        by: ['status'],
        _count: { id: true },
      }),

      // Order totals
      prisma.order.count(),
      prisma.order.count({ where: { createdAt: { gte: since } } }),

      // Orders by status
      prisma.order.groupBy({
        by: ['status'],
        _count: { id: true },
        _sum: { totalAmount: true },
      }),

      // Top quoted products
      prisma.quoteItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),

      // Products per category
      prisma.marketProduct.groupBy({
        by: ['categoryId'],
        _count: { id: true },
        where: { published: true },
      }),

      // Low stock alerts
      prisma.marketProduct.findMany({
        where: { published: true, inStock: true, stockQuantity: { lte: 3 } },
        select: { id: true, sku: true, name: true, stockQuantity: true },
        orderBy: { stockQuantity: 'asc' },
      }),
    ])

    // Enrich top products with names
    const topProductIds = topProducts.map(p => p.productId)
    const productNames = await prisma.marketProduct.findMany({
      where: { id: { in: topProductIds } },
      select: { id: true, name: true, sku: true },
    })
    const productNameMap = new Map<string, { id: string; name: string; sku: string }>(productNames.map(p => [p.id, p]))

    // Enrich categories with names
    const categoryIds = topCategories.map(c => c.categoryId).filter(Boolean) as string[]
    const categoryNames = await prisma.marketCategory.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, label: true },
    })
    const categoryNameMap = new Map(categoryNames.map(c => [c.id, c.label]))

    // Build funnel
    const quoteStatusMap = new Map<string, number>(quotesByStatus.map(q => [q.status, q._count.id]))
    const funnel = {
      submitted: (quoteStatusMap.get('SUBMITTED') || 0) + (quoteStatusMap.get('IN_REVIEW') || 0) + (quoteStatusMap.get('QUOTED') || 0) + (quoteStatusMap.get('ACCEPTED') || 0) + (quoteStatusMap.get('CONVERTED') || 0),
      reviewed: (quoteStatusMap.get('IN_REVIEW') || 0) + (quoteStatusMap.get('QUOTED') || 0) + (quoteStatusMap.get('ACCEPTED') || 0) + (quoteStatusMap.get('CONVERTED') || 0),
      quoted: (quoteStatusMap.get('QUOTED') || 0) + (quoteStatusMap.get('ACCEPTED') || 0) + (quoteStatusMap.get('CONVERTED') || 0),
      accepted: (quoteStatusMap.get('ACCEPTED') || 0) + (quoteStatusMap.get('CONVERTED') || 0),
      converted: quoteStatusMap.get('CONVERTED') || 0,
    }

    // Revenue from orders
    const orderStatusMap = new Map(ordersByStatus.map(o => [o.status, { count: o._count.id, revenue: Number(o._sum.totalAmount || 0) }]))
    const totalRevenue = ordersByStatus.reduce((sum, o) => sum + Number(o._sum.totalAmount || 0), 0)

    return NextResponse.json({
      success: true,
      period,
      data: {
        overview: {
          totalProducts,
          publishedProducts,
          totalQuotes,
          recentQuotes,
          totalOrders,
          recentOrders,
          totalRevenue,
        },
        funnel,
        quotesByStatus: Object.fromEntries(quotesByStatus.map(q => [q.status, q._count.id])),
        ordersByStatus: Object.fromEntries(ordersByStatus.map(o => [o.status, { count: o._count.id, revenue: Number(o._sum.totalAmount || 0) }])),
        topProducts: topProducts.map(p => ({
          productId: p.productId,
          name: productNameMap.get(p.productId)?.name || 'Unknown',
          sku: productNameMap.get(p.productId)?.sku || '',
          quoteCount: p._count.id,
          totalQuantity: p._sum.quantity || 0,
        })),
        categoriesBreakdown: topCategories.map(c => ({
          categoryId: c.categoryId,
          label: categoryNameMap.get(c.categoryId || '') || 'Non catégorisé',
          productCount: c._count.id,
        })),
        alerts: {
          lowStock: lowStockProducts,
        },
      },
    })
  } catch (error) {
    console.error('[API v2] GET /analytics error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
