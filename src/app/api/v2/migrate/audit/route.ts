import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/v2/migrate/audit — List all data in Railway DB
export async function GET() {
  try {
    // Count all tables
    const [
      admins,
      adminSessions,
      users,
      sessions,
      jobs,
      applications,
      blogPosts,
      reviews,
      quotes,
      orders,
    ] = await Promise.all([
      prisma.admin.findMany({
        select: { id: true, email: true, firstName: true, lastName: true, role: true, company: true, isActive: true, emailVerified: true },
      }),
      prisma.adminSession.count(),
      prisma.user.findMany({
        select: { id: true, email: true, firstName: true, lastName: true, role: true, company: true },
      }),
      prisma.session.count(),
      prisma.job.count(),
      prisma.application.count(),
      prisma.blogPost.count(),
      prisma.review.count(),
      prisma.quote.count().catch(() => 0),
      prisma.order.count().catch(() => 0),
    ])

    return NextResponse.json({
      summary: {
        admins: admins.length,
        adminSessions,
        users: users.length,
        sessions,
        jobs,
        applications,
        blogPosts,
        reviews,
        quotes,
        orders,
      },
      data: {
        admins,
        users,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
