import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

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

    // Sanitize slug
    const safeSlug = slug.replace(/[^a-z0-9-]/g, '')
    if (!safeSlug) {
      return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
    }

    const dir = path.join(process.cwd(), 'public', 'images', 'aerotools', '360', safeSlug)
    await mkdir(dir, { recursive: true })

    const filename = `${safeSlug}_e${elevation}_h${String(angle).padStart(3, '0')}.webp`
    const filepath = path.join(dir, filename)

    const buffer = Buffer.from(await image.arrayBuffer())
    await writeFile(filepath, buffer)

    return NextResponse.json({ ok: true, filename })
  } catch (err) {
    console.error('Turntable upload error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// Save metadata after all frames are uploaded
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { slug, hFrames, vLevels, elevations, format, resolution } = body

    const safeSlug = (slug as string).replace(/[^a-z0-9-]/g, '')
    const dir = path.join(process.cwd(), 'public', 'images', 'aerotools', '360', safeSlug)
    await mkdir(dir, { recursive: true })

    const metadata = {
      slug: safeSlug,
      hFrames,
      vLevels,
      elevations,
      format: format || 'webp',
      resolution: resolution || 1200,
      totalFrames: hFrames * vLevels,
      generatedAt: new Date().toISOString(),
      filePattern: `${safeSlug}_e{elevation}_h{angle}.webp`,
    }

    const filepath = path.join(dir, 'metadata.json')
    await writeFile(filepath, JSON.stringify(metadata, null, 2))

    return NextResponse.json({ ok: true, metadata })
  } catch (err) {
    console.error('Metadata save error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
