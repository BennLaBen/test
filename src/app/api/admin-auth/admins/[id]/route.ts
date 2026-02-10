import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromRequest } from '@/lib/auth/admin-guard'

// PATCH /api/admin-auth/admins/[id] - Update admin role
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentAdmin = await getAdminFromRequest()
    if (!currentAdmin) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      )
    }

    if (currentAdmin.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Droits insuffisants' },
        { status: 403 }
      )
    }

    const { id } = params
    const body = await request.json()
    const { role } = body

    if (!role || !['ADMIN', 'VIEWER'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Rôle invalide' },
        { status: 400 }
      )
    }

    // Cannot modify a super-admin
    const targetAdmin = await prisma.admin.findUnique({ where: { id } })
    if (!targetAdmin) {
      return NextResponse.json(
        { success: false, error: 'Administrateur introuvable' },
        { status: 404 }
      )
    }

    if (targetAdmin.role === 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Impossible de modifier un Super Admin' },
        { status: 403 }
      )
    }

    const updated = await prisma.admin.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: `Rôle de ${updated.firstName} ${updated.lastName} mis à jour en ${role}`,
      admin: updated,
    })
  } catch (error) {
    console.error('Error updating admin:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin-auth/admins/[id] - Delete admin permanently
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentAdmin = await getAdminFromRequest()
    if (!currentAdmin) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      )
    }

    if (currentAdmin.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Droits insuffisants' },
        { status: 403 }
      )
    }

    const { id } = params

    // Cannot delete yourself
    if (id === currentAdmin.sub) {
      return NextResponse.json(
        { success: false, error: 'Impossible de supprimer votre propre compte' },
        { status: 400 }
      )
    }

    // Cannot delete a super-admin
    const targetAdmin = await prisma.admin.findUnique({ where: { id } })
    if (!targetAdmin) {
      return NextResponse.json(
        { success: false, error: 'Administrateur introuvable' },
        { status: 404 }
      )
    }

    if (targetAdmin.role === 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Impossible de supprimer un Super Admin' },
        { status: 403 }
      )
    }

    // Delete the admin (AdminSession & ActivationToken cascade, SecurityLog sets null)
    await prisma.admin.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: `${targetAdmin.firstName} ${targetAdmin.lastName} a été supprimé définitivement`,
    })
  } catch (error) {
    console.error('Error deleting admin:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
