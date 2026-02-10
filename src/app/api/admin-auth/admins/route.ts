import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromRequest } from '@/lib/auth/admin-guard'

// GET /api/admin-auth/admins - List all admins (super-admin only)
export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest()
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Only super-admins can list all admins
    if (admin.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Droits insuffisants' },
        { status: 403 }
      )
    }

    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        company: true,
        role: true,
        isActive: true,
        emailVerified: true,
        lastLogin: true,
        createdAt: true,
        twoFactorEnabled: true,
      },
      orderBy: [
        { role: 'asc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json({ success: true, admins })
  } catch (error) {
    console.error('Error fetching admins:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
