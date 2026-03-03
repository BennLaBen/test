import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/v2/orders — List orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '20'))

    const where: any = {}
    if (status) where.status = status

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: { product: { select: { name: true, sku: true, image: true } } },
          },
          user: { select: { firstName: true, lastName: true, email: true } },
          organization: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('[API v2] GET /orders error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST /api/v2/orders — Create order (from accepted quote)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { quoteId, poNumber, paymentMethod, shippingAddress, billingAddress } = body

    if (!quoteId) {
      return NextResponse.json({ error: 'quoteId requis' }, { status: 400 })
    }

    // Find the accepted quote
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        items: { include: { product: true } },
      },
    })

    if (!quote) {
      return NextResponse.json({ error: 'Devis introuvable' }, { status: 404 })
    }

    if (quote.status !== 'ACCEPTED') {
      return NextResponse.json({ error: 'Le devis doit être accepté avant de créer une commande' }, { status: 400 })
    }

    // Generate order reference
    const year = new Date().getFullYear()
    const rand = Math.floor(Math.random() * 9999).toString().padStart(4, '0')
    const reference = `ORD-${year}-${rand}`

    // Calculate total
    const totalAmount = quote.items.reduce((sum, item) => {
      const price = item.unitPrice ? Number(item.unitPrice) : 0
      return sum + price * item.quantity
    }, 0)

    // Create order
    const order = await prisma.order.create({
      data: {
        reference,
        quoteId: quote.id,
        organizationId: quote.organizationId,
        userId: quote.userId,
        status: 'PENDING',
        totalAmount,
        poNumber: poNumber || null,
        paymentMethod: paymentMethod || null,
        shippingAddress: shippingAddress || null,
        billingAddress: billingAddress || null,
        items: {
          create: quote.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice || 0,
          })),
        },
      },
      include: {
        items: { include: { product: { select: { name: true, sku: true } } } },
      },
    })

    // Update quote status to CONVERTED
    await prisma.quote.update({
      where: { id: quoteId },
      data: { status: 'CONVERTED' },
    })

    return NextResponse.json({ success: true, data: order }, { status: 201 })
  } catch (error) {
    console.error('[API v2] POST /orders error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
