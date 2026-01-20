import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// POST /api/upload - Upload files (CVs, images)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const type = formData.get('type') as string || 'cv' // cv or image

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes: Record<string, string[]> = {
      cv: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    }

    if (!allowedTypes[type]?.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: `Type de fichier non autorisé. Types acceptés: ${type === 'cv' ? 'PDF, DOC, DOCX' : 'JPEG, PNG, WEBP, GIF'}` },
        { status: 400 }
      )
    }

    // Validate file size (10MB max for CV, 5MB for images)
    const maxSize = type === 'cv' ? 10 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: `Fichier trop volumineux. Taille maximale: ${type === 'cv' ? '10MB' : '5MB'}` },
        { status: 400 }
      )
    }

    // Create unique filename
    const timestamp = Date.now()
    const ext = path.extname(file.name)
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').slice(0, 50)
    const filename = `${timestamp}-${safeName}`

    // Determine upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', type === 'cv' ? 'cvs' : 'images')

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
    const url = `/uploads/${type === 'cv' ? 'cvs' : 'images'}/${filename}`

    return NextResponse.json({
      success: true,
      url,
      filename: file.name,
      size: file.size
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'upload du fichier' },
      { status: 500 }
    )
  }
}
