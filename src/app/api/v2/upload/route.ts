import { NextRequest, NextResponse } from 'next/server'
import { put, del } from '@vercel/blob'

export const dynamic = 'force-dynamic'

const IS_VERCEL = !!process.env.VERCEL

// POST /api/v2/upload — Upload product image (Vercel Blob in prod, filesystem in dev)
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

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Fichier trop volumineux (max 10 Mo)' }, { status: 400 })
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

    let url: string

    if (IS_VERCEL) {
      // ═══ PRODUCTION: Vercel Blob (persistent CDN storage) ═══
      const blob = await put(`products/${filename}`, file, {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: file.type,
      })
      url = blob.url
    } else {
      // ═══ LOCAL DEV: filesystem ═══
      const { writeFile, mkdir } = await import('fs/promises')
      const path = await import('path')
      const uploadDir = path.join(process.cwd(), 'public', 'images', 'products')
      await mkdir(uploadDir, { recursive: true })
      const bytes = await file.arrayBuffer()
      await writeFile(path.join(uploadDir, filename), Buffer.from(bytes))
      url = `/images/products/${filename}`
    }

    return NextResponse.json({
      success: true,
      url,
      filename,
      size: file.size,
      type: file.type,
    })
  } catch (error: any) {
    console.error('[API v2] POST /upload error:', error?.message || error)
    return NextResponse.json({ error: `Erreur upload: ${error?.message || 'inconnu'}` }, { status: 500 })
  }
}

// DELETE /api/v2/upload — Delete an uploaded image
export async function DELETE(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL invalide' }, { status: 400 })
    }

    if (IS_VERCEL) {
      // ═══ PRODUCTION: delete from Vercel Blob ═══
      if (url.includes('blob.vercel-storage.com')) {
        await del(url)
      }
      // Static images (/images/products/...) can't be deleted from Vercel — ignore silently
    } else {
      // ═══ LOCAL DEV: delete from filesystem ═══
      if (url.startsWith('/images/products/')) {
        const path = await import('path')
        const { unlink } = await import('fs/promises')
        const filePath = path.join(process.cwd(), 'public', url)
        await unlink(filePath).catch(() => {})
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[API v2] DELETE /upload error:', error?.message || error)
    return NextResponse.json({ error: 'Erreur suppression' }, { status: 500 })
  }
}
