import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import crypto from 'crypto'

// Secret key for model access tokens
const MODEL_SECRET = process.env.MODEL_SECRET || 'lledo-aerotools-3d-secure-2024'

// Allowed model slugs → file mapping (whitelist approach)
const MODEL_MAP: Record<string, string> = {
  'roller-h125': 'roller-h125.glb',
  'test-model': 'roller-h125.glb', // Alias for testing
}

/**
 * Generate a time-limited access token for a model
 */
function generateModelToken(slug: string): string {
  const timestamp = Math.floor(Date.now() / 1000)
  // Token valid for 10 minutes
  const payload = `${slug}:${timestamp}`
  const hmac = crypto.createHmac('sha256', MODEL_SECRET).update(payload).digest('hex')
  return Buffer.from(`${payload}:${hmac}`).toString('base64url')
}

/**
 * Verify a model access token
 */
function verifyModelToken(token: string, slug: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64url').toString()
    const parts = decoded.split(':')
    if (parts.length !== 3) return false

    const [tokenSlug, timestampStr, receivedHmac] = parts
    if (tokenSlug !== slug) return false

    const timestamp = parseInt(timestampStr, 10)
    const now = Math.floor(Date.now() / 1000)
    // Token expires after 10 minutes
    if (now - timestamp > 600) return false

    // Verify HMAC
    const expectedHmac = crypto
      .createHmac('sha256', MODEL_SECRET)
      .update(`${tokenSlug}:${timestampStr}`)
      .digest('hex')

    return crypto.timingSafeEqual(
      Buffer.from(receivedHmac, 'hex'),
      Buffer.from(expectedHmac, 'hex')
    )
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const token = searchParams.get('token')

  // Validate params
  if (!slug || !token) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  // Check slug exists in whitelist
  const filename = MODEL_MAP[slug]
  if (!filename) {
    return NextResponse.json({ error: 'Model not found' }, { status: 404 })
  }

  // Verify token
  if (!verifyModelToken(token, slug)) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 403 })
  }

  // Read model file from secure directory (outside public/)
  const modelPath = path.join(process.cwd(), 'models', filename)

  if (!existsSync(modelPath)) {
    return NextResponse.json({ error: 'Model file not found' }, { status: 404 })
  }

  try {
    const fileBuffer = await readFile(modelPath)

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'model/gltf-binary',
        'Content-Length': fileBuffer.length.toString(),
        // Anti-download headers
        'Content-Disposition': 'inline', // NOT attachment
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        'Pragma': 'no-cache',
        'Expires': '0',
        // Anti-hotlinking
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        // CORS: same origin only
        'Access-Control-Allow-Origin': request.headers.get('origin') || '',
      },
    })
  } catch (error) {
    console.error('Error serving model:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
