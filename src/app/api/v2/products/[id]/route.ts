import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getAdminFromRequest } from '@/lib/auth/admin-guard'

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
    const admin = await getAdminFromRequest()
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Accès non autorisé' }, { status: 403 })
    }

    const body = await request.json()
    const { id } = params

    // Handle nullable JSON fields — Prisma requires DbNull instead of plain null
    const data = { ...body }
    const jsonFields = ['turntable', 'specs', 'tolerances', 'materialsData', 'faq', 'priceTiers']
    for (const field of jsonFields) {
      if (field in data && data[field] === null) {
        data[field] = Prisma.DbNull
      }
    }

    const product = await prisma.marketProduct.update({
      where: { id },
      data,
      include: { category: true, documents: true },
    })

    return NextResponse.json({ success: true, data: product })
  } catch (error: any) {
    console.error('[API v2] PATCH /products/:id error:', error)
    if (error?.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Produit introuvable' }, { status: 404 })
    }
    return NextResponse.json({ success: false, error: 'Erreur lors de la mise à jour du produit' }, { status: 500 })
  }
}

// DELETE /api/v2/products/:id — Delete product (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminFromRequest()
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Accès non autorisé' }, { status: 403 })
    }

    const { id } = params

    // Verify product exists before attempting delete
    const product = await prisma.marketProduct.findUnique({ where: { id } })
    if (!product) {
      return NextResponse.json({ success: false, error: 'Produit introuvable' }, { status: 404 })
    }

    // Use a transaction to delete related records first, then the product
    // (QuoteItem, OrderItem, SerialNumber, ProductDocument don't all have onDelete: Cascade)
    await prisma.$transaction(async (tx) => {
      // Delete related serial numbers
      await tx.serialNumber.deleteMany({ where: { productId: id } })
      // Delete related order items
      await tx.orderItem.deleteMany({ where: { productId: id } })
      // Delete related quote items
      await tx.quoteItem.deleteMany({ where: { productId: id } })
      // Delete related documents (has cascade but explicit for safety)
      await tx.productDocument.deleteMany({ where: { productId: id } })
      // Finally delete the product
      await tx.marketProduct.delete({ where: { id } })
    })

    console.log(`[API v2] ✅ Product deleted: ${product.name} (${id})`)
    return NextResponse.json({ success: true, message: `Produit "${product.name}" supprimé avec succès` })
  } catch (error: any) {
    console.error('[API v2] DELETE /products/:id error:', error)
    if (error?.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Produit introuvable' }, { status: 404 })
    }
    if (error?.code === 'P2003') {
      return NextResponse.json({ success: false, error: 'Impossible de supprimer : ce produit est référencé par des commandes ou devis existants' }, { status: 409 })
    }
    return NextResponse.json({ success: false, error: 'Erreur lors de la suppression du produit' }, { status: 500 })
  }
}
