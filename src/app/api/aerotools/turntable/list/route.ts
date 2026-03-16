import { NextRequest, NextResponse } from 'next/server'
import { list } from '@vercel/blob'

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  const mode = req.nextUrl.searchParams.get('mode') // 'folders' = list unique slugs, 'all' = all prefixes
  const folder = req.nextUrl.searchParams.get('folder') // override prefix (e.g. 'products/')
  
  try {
    const prefix = folder ? folder : (slug ? `turntable/${slug}/` : 'turntable/')
    
    if (mode === 'folders') {
      // List all blobs and extract unique folder names (product slugs)
      const slugs = new Set<string>()
      let cursor: string | undefined
      do {
        const result = await list({ prefix: 'turntable/', limit: 1000, cursor })
        for (const b of result.blobs) {
          const parts = b.pathname.split('/')
          if (parts.length >= 2) slugs.add(parts[1])
        }
        cursor = result.hasMore ? result.cursor : undefined
      } while (cursor)
      
      return NextResponse.json({ folders: Array.from(slugs).sort(), count: slugs.size })
    }
    
    const result = await list({ prefix, limit: 200 })
    
    return NextResponse.json({
      blobs: result.blobs.map(b => ({ url: b.url, pathname: b.pathname, size: b.size })),
      count: result.blobs.length,
      hasMore: result.hasMore,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to list blobs' }, { status: 500 })
  }
}
