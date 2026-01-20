import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { unlink } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// GET /api/admin/media/[id] - Get single media
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const media = await prisma.media.findUnique({
      where: { id: params.id }
    })

    if (!media) {
      return NextResponse.json(
        { success: false, error: 'Média non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, media })
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/media/[id] - Update media metadata
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { alt, caption, folder } = body

    const media = await prisma.media.update({
      where: { id: params.id },
      data: {
        ...(alt !== undefined && { alt }),
        ...(caption !== undefined && { caption }),
        ...(folder !== undefined && { folder }),
      },
    })

    return NextResponse.json({ success: true, media })
  } catch (error) {
    console.error('Error updating media:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/media/[id] - Delete media
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    // Get media to find file path
    const media = await prisma.media.findUnique({
      where: { id: params.id }
    })

    if (!media) {
      return NextResponse.json(
        { success: false, error: 'Média non trouvé' },
        { status: 404 }
      )
    }

    // Delete from database
    await prisma.media.delete({
      where: { id: params.id }
    })

    // Delete file from disk
    const filePath = path.join(process.cwd(), 'public', media.path)
    if (existsSync(filePath)) {
      await unlink(filePath)
    }

    return NextResponse.json({ success: true, message: 'Média supprimé' })
  } catch (error) {
    console.error('Error deleting media:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}
