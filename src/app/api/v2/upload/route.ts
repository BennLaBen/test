import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

// POST /api/v2/upload — Upload product image to public/images/products/
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier envoyé' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Type de fichier non autorisé. Formats acceptés: JPG, PNG, WebP, SVG, GIF' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Fichier trop volumineux (max 5 Mo)' }, { status: 400 })
    }

    // Generate unique filename
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const timestamp = Date.now()
    const safeName = file.name
      .replace(/\.[^.]+$/, '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    const filename = `${safeName}-${timestamp}.${ext}`

    // Ensure directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'products')
    await mkdir(uploadDir, { recursive: true })

    // Write file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = path.join(uploadDir, filename)
    await writeFile(filePath, buffer)

    const url = `/images/products/${filename}`

    return NextResponse.json({
      success: true,
      url,
      filename,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error('[API v2] POST /upload error:', error)
    return NextResponse.json({ error: 'Erreur upload' }, { status: 500 })
  }
}

// DELETE /api/v2/upload — Delete an uploaded image
export async function DELETE(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || !url.startsWith('/images/products/')) {
      return NextResponse.json({ error: 'URL invalide' }, { status: 400 })
    }

    const filePath = path.join(process.cwd(), 'public', url)
    const { unlink } = await import('fs/promises')
    await unlink(filePath).catch(() => {})

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API v2] DELETE /upload error:', error)
    return NextResponse.json({ error: 'Erreur suppression' }, { status: 500 })
  }
}
