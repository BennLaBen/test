import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

const IS_VERCEL = !!process.env.VERCEL

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const slug = formData.get('slug') as string
    const elevation = formData.get('elevation') as string
    const angle = formData.get('angle') as string
    const image = formData.get('image') as File

    if (!slug || elevation === null || angle === null || !image) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const safeSlug = slug.replace(/[^a-z0-9-]/g, '')
    if (!safeSlug) {
      return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
    }

    const filename = `${safeSlug}_e${elevation}_h${String(angle).padStart(3, '0')}.webp`

    let url: string

    if (IS_VERCEL) {
      const blob = await put(`turntable/${safeSlug}/${filename}`, image, {
        access: 'public',
        addRandomSuffix: false,
        contentType: 'image/webp',
      })
      url = blob.url
    } else {
      const { writeFile, mkdir } = await import('fs/promises')
      const path = await import('path')
      const dir = path.join(process.cwd(), 'public', 'images', 'aerotools', '360', safeSlug)
      await mkdir(dir, { recursive: true })
      const buffer = Buffer.from(await image.arrayBuffer())
      await writeFile(path.join(dir, filename), buffer)
      url = `/images/aerotools/360/${safeSlug}/${filename}`
    }

    return NextResponse.json({ ok: true, filename, url })
  } catch (err: any) {
    console.error('Turntable upload error:', err?.message || err, err?.stack?.slice(0, 500))
    return NextResponse.json({ error: err?.message || 'Server error', detail: String(err) }, { status: 500 })
  }
}

// Save metadata + return baseUrl for the turntable images
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { slug, hFrames, vLevels, elevations, format, resolution } = body

    const safeSlug = (slug as string).replace(/[^a-z0-9-]/g, '')

    let baseUrl: string

    if (IS_VERCEL) {
      // On Vercel, images are stored in Blob — derive the base URL
      // Upload a metadata file to blob to get the base URL prefix
      const metaBlob = await put(`turntable/${safeSlug}/metadata.json`, JSON.stringify({
        slug: safeSlug,
        hFrames,
        vLevels,
        elevations,
        format: format || 'webp',
        resolution: resolution || 1200,
        totalFrames: hFrames * vLevels,
        generatedAt: new Date().toISOString(),
      }), {
        access: 'public',
        addRandomSuffix: false,
        contentType: 'application/json',
      })
      // Base URL is the blob URL without the filename
      baseUrl = metaBlob.url.replace('/metadata.json', '')
    } else {
      const { writeFile, mkdir } = await import('fs/promises')
      const path = await import('path')
      const dir = path.join(process.cwd(), 'public', 'images', 'aerotools', '360', safeSlug)
      await mkdir(dir, { recursive: true })
      await writeFile(path.join(dir, 'metadata.json'), JSON.stringify({
        slug: safeSlug, hFrames, vLevels, elevations,
        format: format || 'webp', resolution: resolution || 1200,
        totalFrames: hFrames * vLevels, generatedAt: new Date().toISOString(),
      }, null, 2))
      baseUrl = `/images/aerotools/360/${safeSlug}`
    }

    return NextResponse.json({ ok: true, baseUrl })
  } catch (err: any) {
    console.error('Metadata save error:', err?.message || err)
    return NextResponse.json({ error: err?.message || 'Server error', detail: String(err) }, { status: 500 })
  }
}
