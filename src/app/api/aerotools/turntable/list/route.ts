import { NextRequest, NextResponse } from 'next/server'
import { list } from '@vercel/blob'

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  
  try {
    const prefix = slug ? `turntable/${slug}/` : 'turntable/'
    const result = await list({ prefix, limit: 10 })
    
    return NextResponse.json({
      blobs: result.blobs.map(b => ({ url: b.url, pathname: b.pathname, size: b.size })),
      hasMore: result.hasMore,
      cursor: result.cursor,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to list blobs' }, { status: 500 })
  }
}
