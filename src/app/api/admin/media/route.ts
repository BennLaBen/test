import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import sharp from 'sharp'

const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads')
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
]

// GET /api/admin/media - List all media
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const folder = searchParams.get('folder')
    const type = searchParams.get('type') // images, documents, all

    const where: any = {}
    if (folder) where.folder = folder
    if (type === 'images') where.mimeType = { startsWith: 'image/' }
    if (type === 'documents') where.mimeType = 'application/pdf'

    const media = await prisma.media.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    return NextResponse.json({ success: true, media })
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération' },
      { status: 500 }
    )
  }
}

// POST /api/admin/media - Upload new media
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'general'
    const alt = formData.get('alt') as string | null

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Type de fichier non autorisé' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Fichier trop volumineux (max 10MB)' },
        { status: 400 }
      )
    }

    // Create upload directory structure: /uploads/YYYY/MM/
    const now = new Date()
    const year = now.getFullYear().toString()
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const uploadPath = path.join(UPLOAD_DIR, year, month)

    if (!existsSync(uploadPath)) {
      await mkdir(uploadPath, { recursive: true })
    }

    // Generate unique filename
    const ext = path.extname(file.name)
    const baseName = path.basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50)
    const uniqueName = `${baseName}-${Date.now()}${ext}`
    const filePath = path.join(uploadPath, uniqueName)
    const relativePath = `/uploads/${year}/${month}/${uniqueName}`

    // Get file buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Get image dimensions if applicable
    let width: number | undefined
    let height: number | undefined

    if (file.type.startsWith('image/') && file.type !== 'image/svg+xml') {
      try {
        const metadata = await sharp(buffer).metadata()
        width = metadata.width
        height = metadata.height

        // Optimize and resize large images
        if (width && width > 2000) {
          const optimized = await sharp(buffer)
            .resize(2000, undefined, { withoutEnlargement: true })
            .jpeg({ quality: 85 })
            .toBuffer()
          await writeFile(filePath, optimized)
        } else {
          await writeFile(filePath, buffer)
        }
      } catch {
        await writeFile(filePath, buffer)
      }
    } else {
      await writeFile(filePath, buffer)
    }

    // Save to database
    const media = await prisma.media.create({
      data: {
        filename: file.name,
        path: relativePath,
        url: relativePath,
        mimeType: file.type,
        size: file.size,
        width,
        height,
        alt,
        folder,
        uploadedBy: session.user.id,
      },
    })

    return NextResponse.json({ success: true, media }, { status: 201 })
  } catch (error) {
    console.error('Error uploading media:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'upload' },
      { status: 500 }
    )
  }
}
