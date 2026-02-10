import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { getAdminFromRequest } from '@/lib/auth/admin-guard'
import { z } from 'zod'

// GET /api/applications/[id] - Get single application
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminUser = await getAdminFromRequest()
    const session = !adminUser ? await auth() : null
    
    if (!adminUser && !session?.user) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const isAdmin = !!adminUser || session?.user?.role === 'ADMIN'

    const application = await prisma.application.findUnique({
      where: { id: params.id },
      include: {
        job: true,
        user: isAdmin ? {
          select: { firstName: true, lastName: true, email: true, phone: true }
        } : false
      }
    })

    if (!application) {
      return NextResponse.json(
        { success: false, error: 'Candidature non trouvée' },
        { status: 404 }
      )
    }

    // Check access rights
    const isOwner = session?.user?.id ? application.userId === session.user.id : false

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    return NextResponse.json({ success: true, application })
  } catch (error) {
    console.error('Error fetching application:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération' },
      { status: 500 }
    )
  }
}

// PUT /api/applications/[id] - Update application status (admin only)
const updateSchema = z.object({
  status: z.enum(['NEW', 'IN_REVIEW', 'INTERVIEW', 'ACCEPTED', 'REJECTED']).optional(),
  notes: z.string().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminUser = await getAdminFromRequest()
    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const data = updateSchema.parse(body)

    const application = await prisma.application.update({
      where: { id: params.id },
      data,
      include: {
        job: { select: { title: true } }
      }
    })

    return NextResponse.json({ success: true, application })
  } catch (error) {
    console.error('Error updating application:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    )
  }
}

// DELETE /api/applications/[id] - Delete application (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminUser = await getAdminFromRequest()
    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    await prisma.application.delete({ where: { id: params.id } })

    return NextResponse.json({ success: true, message: 'Candidature supprimée' })
  } catch (error) {
    console.error('Error deleting application:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}
