import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromRequest } from '@/lib/auth/admin-guard'

// GET /api/admin/analytics?period=7d|30d|90d
export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest()
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Accès non autorisé' }, { status: 403 })
    }

    const period = request.nextUrl.searchParams.get('period') || '7d'
    const days = period === '90d' ? 90 : period === '30d' ? 30 : 7
    const since = new Date()
    since.setDate(since.getDate() - days)

    // Previous period for comparison
    const prevSince = new Date()
    prevSince.setDate(prevSince.getDate() - days * 2)

    // Total views this period
    const totalViews = await prisma.pageView.count({
      where: { createdAt: { gte: since } },
    })

    // Total views previous period
    const prevTotalViews = await prisma.pageView.count({
      where: { createdAt: { gte: prevSince, lt: since } },
    })

    // Unique visitors (by sessionId)
    const uniqueRaw = await prisma.pageView.findMany({
      where: { createdAt: { gte: since }, sessionId: { not: null } },
      select: { sessionId: true },
      distinct: ['sessionId'],
    })
    const uniqueVisitors = uniqueRaw.length

    const prevUniqueRaw = await prisma.pageView.findMany({
      where: { createdAt: { gte: prevSince, lt: since }, sessionId: { not: null } },
      select: { sessionId: true },
      distinct: ['sessionId'],
    })
    const prevUniqueVisitors = prevUniqueRaw.length

    // Views per day for chart
    const allViews = await prisma.pageView.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true, sessionId: true },
      orderBy: { createdAt: 'asc' },
    })

    const viewsByDay: Record<string, { views: number; visitors: Set<string> }> = {}
    for (let d = 0; d < days; d++) {
      const date = new Date(since)
      date.setDate(date.getDate() + d)
      const key = date.toISOString().slice(0, 10)
      viewsByDay[key] = { views: 0, visitors: new Set() }
    }

    for (const v of allViews) {
      const key = v.createdAt.toISOString().slice(0, 10)
      if (viewsByDay[key]) {
        viewsByDay[key].views++
        if (v.sessionId) viewsByDay[key].visitors.add(v.sessionId)
      }
    }

    const chart = Object.entries(viewsByDay).map(([date, data]) => ({
      date,
      views: data.views,
      visitors: data.visitors.size,
    }))

    // Top pages
    const topPagesRaw = await prisma.pageView.groupBy({
      by: ['path'],
      where: { createdAt: { gte: since } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    })
    const topPages = topPagesRaw.map(p => ({ path: p.path, views: p._count.id }))

    // Top referrers
    const topReferrersRaw = await prisma.pageView.groupBy({
      by: ['referrer'],
      where: { createdAt: { gte: since }, referrer: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    })
    const topReferrers = topReferrersRaw
      .filter(r => r.referrer)
      .map(r => ({ referrer: r.referrer!, views: r._count.id }))

    // Countries
    const countriesRaw = await prisma.pageView.groupBy({
      by: ['country'],
      where: { createdAt: { gte: since }, country: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    })
    const countries = countriesRaw
      .filter(c => c.country)
      .map(c => ({ country: c.country!, views: c._count.id }))

    // Devices
    const devicesRaw = await prisma.pageView.groupBy({
      by: ['device'],
      where: { createdAt: { gte: since }, device: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    })
    const devices = devicesRaw
      .filter(d => d.device)
      .map(d => ({ device: d.device!, views: d._count.id }))

    // Browsers
    const browsersRaw = await prisma.pageView.groupBy({
      by: ['browser'],
      where: { createdAt: { gte: since }, browser: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    })
    const browsers = browsersRaw
      .filter(b => b.browser)
      .map(b => ({ browser: b.browser!, views: b._count.id }))

    // Live visitors (last 5 min)
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000)
    const liveRaw = await prisma.pageView.findMany({
      where: { createdAt: { gte: fiveMinAgo }, sessionId: { not: null } },
      select: { sessionId: true },
      distinct: ['sessionId'],
    })
    const liveVisitors = liveRaw.length

    return NextResponse.json({
      success: true,
      data: {
        totalViews,
        prevTotalViews,
        uniqueVisitors,
        prevUniqueVisitors,
        liveVisitors,
        chart,
        topPages,
        topReferrers,
        countries,
        devices,
        browsers,
        period,
      },
    })
  } catch (error) {
    console.error('[Admin Analytics] Error:', error)
    return NextResponse.json({ success: false, error: 'Erreur analytics' }, { status: 500 })
  }
}
