import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const MODEL_SECRET = process.env.MODEL_SECRET || 'lledo-aerotools-3d-secure-2024'

const VALID_SLUGS = ['roller-h125', 'test-model']

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (!slug || !VALID_SLUGS.includes(slug)) {
    return NextResponse.json({ error: 'Invalid model' }, { status: 400 })
  }

  // Generate time-limited HMAC token
  const timestamp = Math.floor(Date.now() / 1000)
  const payload = `${slug}:${timestamp}`
  const hmac = crypto.createHmac('sha256', MODEL_SECRET).update(payload).digest('hex')
  const token = Buffer.from(`${payload}:${hmac}`).toString('base64url')

  return NextResponse.json(
    { token },
    {
      headers: {
        'Cache-Control': 'no-store, private',
      },
    }
  )
}
