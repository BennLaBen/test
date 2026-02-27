import { NextRequest, NextResponse } from 'next/server'
import { put, list } from '@vercel/blob'
import type { ShopProduct } from '@/lib/shop/types'

const IS_VERCEL = !!process.env.VERCEL
const BLOB_PATH = 'data/products.json'

// GET /api/products - Read products (public)
export async function GET() {
  try {
    if (IS_VERCEL) {
      // Production: try reading from Vercel Blob first
      try {
        const { blobs } = await list({ prefix: BLOB_PATH, limit: 1 })
        if (blobs.length > 0) {
          const response = await fetch(blobs[0].url, { cache: 'no-store' })
          if (response.ok) {
            const products = await response.json()
            return NextResponse.json({ success: true, products, source: 'blob' })
          }
        }
      } catch {
        // Blob not found or not configured — fall through to static
      }
    } else {
      // Dev: try reading the saved override file first
      try {
        const fs = await import('fs')
        const path = await import('path')
        const overridePath = path.join(process.cwd(), 'src', 'data', 'shop', 'products-override.json')
        if (fs.existsSync(overridePath)) {
          const data = fs.readFileSync(overridePath, 'utf-8')
          const products = JSON.parse(data)
          return NextResponse.json({ success: true, products, source: 'override' })
        }
      } catch {
        // No override file — fall through to static
      }
    }

    // Fallback: return static products.json
    const productsData = (await import('@/data/shop/products.json')).default
    return NextResponse.json({ success: true, products: productsData, source: 'static' })
  } catch (error) {
    console.error('[products] GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lecture produits' },
      { status: 500 }
    )
  }
}

// POST /api/products - Save products (called from admin panel)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const products = body?.products as ShopProduct[] | undefined
    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ success: false, error: 'Format invalide ou vide' }, { status: 400 })
    }

    const jsonStr = JSON.stringify(products, null, 2)

    if (IS_VERCEL) {
      // Production: save to Vercel Blob
      const blob = await put(BLOB_PATH, jsonStr, {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: 'application/json',
      })
      console.log(`[products] POST OK — ${products.length} products saved to blob: ${blob.url}`)
    } else {
      // Dev: save to local override file
      const fs = await import('fs/promises')
      const path = await import('path')
      const overridePath = path.join(process.cwd(), 'src', 'data', 'shop', 'products-override.json')
      await fs.writeFile(overridePath, jsonStr, 'utf-8')
      console.log(`[products] POST OK — ${products.length} products saved to ${overridePath}`)
    }

    return NextResponse.json({ success: true, count: products.length })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[products] POST error:', msg)
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    )
  }
}
