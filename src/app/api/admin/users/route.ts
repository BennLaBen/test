import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromRequest } from '@/lib/auth/admin-guard'

// GET /api/admin/users - Get all users (admin only)
export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest()
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')

    const where: any = {}
    if (role) where.role = role

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        company: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            applications: true,
            reviews: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des utilisateurs' },
      { status: 500 }
    )
  }
}
