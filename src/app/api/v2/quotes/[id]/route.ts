import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/v2/quotes/:id — Get single quote by ID or reference
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quote = await prisma.quote.findFirst({
      where: {
        OR: [{ id: params.id }, { reference: params.id }],
      },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, sku: true, image: true, priceDisplay: true, slug: true },
            },
          },
        },
        user: { select: { firstName: true, lastName: true, email: true, company: true } },
        organization: { select: { name: true } },
      },
    })

    if (!quote) {
      return NextResponse.json({ error: 'Devis introuvable' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: quote })
  } catch (error) {
    console.error('[API v2] GET /quotes/:id error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PATCH /api/v2/quotes/:id — Update quote status (admin)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, internalNotes, totalAmount, validUntil } = body

    const data: any = {}
    if (status) data.status = status
    if (internalNotes !== undefined) data.internalNotes = internalNotes
    if (totalAmount !== undefined) data.totalAmount = totalAmount
    if (validUntil) data.validUntil = new Date(validUntil)

    const quote = await prisma.quote.update({
      where: { id: params.id },
      data,
      include: {
        items: { include: { product: { select: { name: true, sku: true } } } },
      },
    })

    return NextResponse.json({ success: true, data: quote })
  } catch (error) {
    console.error('[API v2] PATCH /quotes/:id error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
