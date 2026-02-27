import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// POST /api/upload - Upload files (CVs, images, aerotools media)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const type = formData.get('type') as string || 'cv' // cv, image, or aerotools

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes: Record<string, string[]> = {
      cv: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      aerotools: [
        'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif',
        'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv',
      ]
    }

    if (!allowedTypes[type]?.includes(file.type)) {
      const accepted: Record<string, string> = {
        cv: 'PDF, DOC, DOCX',
        image: 'JPEG, PNG, WEBP, GIF',
        aerotools: 'JPEG, PNG, WEBP, GIF, MP4, WEBM, MOV, AVI',
      }
      return NextResponse.json(
        { success: false, error: `Type de fichier non autorisé. Types acceptés: ${accepted[type] || accepted.image}` },
        { status: 400 }
      )
    }

    // Validate file size (10MB for CV, 5MB for images, 200MB for aerotools media)
    const maxSizes: Record<string, number> = {
      cv: 10 * 1024 * 1024,
      image: 5 * 1024 * 1024,
      aerotools: 200 * 1024 * 1024,
    }
    const maxSize = maxSizes[type] || maxSizes.image
    if (file.size > maxSize) {
      const maxLabel = type === 'aerotools' ? '200 Mo' : type === 'cv' ? '10 Mo' : '5 Mo'
      return NextResponse.json(
        { success: false, error: `Fichier trop volumineux. Taille maximale : ${maxLabel}` },
        { status: 400 }
      )
    }

    // Create unique filename
    const timestamp = Date.now()
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').slice(0, 50)
    const filename = `${timestamp}-${safeName}`

    // Determine upload directory
    const dirMap: Record<string, string> = {
      cv: 'cvs',
      image: 'images',
      aerotools: 'aerotools',
    }
    const subDir = dirMap[type] || 'images'
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', subDir)

    // Create directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Write file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = path.join(uploadDir, filename)
    await writeFile(filePath, buffer)

    // Return URL
    const url = `/uploads/${subDir}/${filename}`

    // Detect if file is a video
    const isVideo = file.type.startsWith('video/')

    return NextResponse.json({
      success: true,
      url,
      filename: file.name,
      size: file.size,
      isVideo,
      mimeType: file.type,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'upload du fichier' },
      { status: 500 }
    )
  }
}
