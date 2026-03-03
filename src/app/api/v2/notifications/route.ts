import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/v2/notifications — List notifications for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '20'))

    if (!userId) {
      return NextResponse.json({ success: true, data: [], unreadCount: 0, total: 0 })
    }

    const where: any = { userId }
    if (unreadOnly) where.read = false

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId, read: false } }),
    ])

    return NextResponse.json({
      success: true,
      data: notifications,
      unreadCount,
      total,
    })
  } catch (error) {
    console.error('[API v2] GET /notifications error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST /api/v2/notifications — Create a notification (internal use)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type, title, message, link, metadata } = body

    if (!userId || !type || !title) {
      return NextResponse.json({ error: 'userId, type et title requis' }, { status: 400 })
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message: message || null,
        link: link || null,
        metadata: metadata || null,
      },
    })

    return NextResponse.json({ success: true, data: notification }, { status: 201 })
  } catch (error) {
    console.error('[API v2] POST /notifications error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PATCH /api/v2/notifications — Mark notifications as read
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { ids, markAllRead, userId } = body

    if (markAllRead && userId) {
      await prisma.notification.updateMany({
        where: { userId, readAt: null },
        data: { readAt: new Date() },
      })
      return NextResponse.json({ success: true })
    }

    if (ids && Array.isArray(ids)) {
      await prisma.notification.updateMany({
        where: { id: { in: ids } },
        data: { readAt: new Date() },
      })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'ids ou markAllRead requis' }, { status: 400 })
  } catch (error) {
    console.error('[API v2] PATCH /notifications error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
