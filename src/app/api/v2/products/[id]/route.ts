import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/v2/products/:id — Get single product by slug or ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const product = await prisma.marketProduct.findFirst({
      where: {
        OR: [
          { slug: id },
          { id: id },
          { sku: id },
        ],
        published: true,
      },
      include: {
        category: true,
        documents: true,
        _count: {
          select: { quoteItems: true, orderItems: true },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 })
    }

    // Get related products (same category or same compatibility)
    const related = await prisma.marketProduct.findMany({
      where: {
        id: { not: product.id },
        published: true,
        OR: [
          { categoryId: product.categoryId },
          { compatibility: { hasSome: product.compatibility } },
        ],
      },
      take: 4,
      include: { category: true },
    })

    // Get bought together
    let boughtTogether: any[] = []
    if (product.boughtTogether.length > 0) {
      boughtTogether = await prisma.marketProduct.findMany({
        where: {
          sku: { in: product.boughtTogether },
          published: true,
        },
        include: { category: true },
      })
    }

    return NextResponse.json({
      success: true,
      data: product,
      related,
      boughtTogether,
    })
  } catch (error) {
    console.error('[API v2] GET /products/:id error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PATCH /api/v2/products/:id — Update product (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add admin auth check
    const body = await request.json()
    const { id } = params

    const product = await prisma.marketProduct.update({
      where: { id },
      data: body,
      include: { category: true, documents: true },
    })

    return NextResponse.json({ success: true, data: product })
  } catch (error) {
    console.error('[API v2] PATCH /products/:id error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE /api/v2/products/:id — Delete product (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add admin auth check
    await prisma.marketProduct.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API v2] DELETE /products/:id error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
