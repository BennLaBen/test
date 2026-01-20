import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// GET /api/admin/stats - Dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const [
      totalUsers,
      totalJobs,
      publishedJobs,
      totalApplications,
      newApplications,
      totalPosts,
      publishedPosts,
      totalReviews,
      pendingReviews,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.job.count(),
      prisma.job.count({ where: { published: true } }),
      prisma.application.count(),
      prisma.application.count({ where: { status: 'NEW' } }),
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { published: true } }),
      prisma.review.count(),
      prisma.review.count({ where: { approved: false } }),
    ])

    // Recent applications
    const recentApplications = await prisma.application.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        job: { select: { title: true } }
      }
    })

    // Applications by status
    const applicationsByStatus = await prisma.application.groupBy({
      by: ['status'],
      _count: { status: true }
    })

    return NextResponse.json({
      success: true,
      stats: {
        users: { total: totalUsers },
        jobs: { total: totalJobs, published: publishedJobs },
        applications: { 
          total: totalApplications, 
          new: newApplications,
          byStatus: applicationsByStatus
        },
        blog: { total: totalPosts, published: publishedPosts },
        reviews: { total: totalReviews, pending: pendingReviews },
      },
      recentApplications
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    )
  }
}
