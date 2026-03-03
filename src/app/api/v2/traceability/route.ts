import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/v2/traceability?serial=XXX — Search by serial number
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const serial = searchParams.get('serial')

    if (!serial || serial.length < 3) {
      return NextResponse.json({ error: 'Numéro de série requis (min 3 caractères)' }, { status: 400 })
    }

    const result = await prisma.serialNumber.findFirst({
      where: {
        OR: [
          { serial: { equals: serial, mode: 'insensitive' } },
          { serial: { contains: serial, mode: 'insensitive' } },
        ],
      },
      include: {
        product: {
          select: {
            name: true,
            sku: true,
            slug: true,
            image: true,
            certifications: true,
            warranty: true,
          },
        },
        orderItem: {
          include: {
            order: {
              select: {
                reference: true,
                status: true,
                createdAt: true,
                deliveredAt: true,
              },
            },
          },
        },
      },
    })

    if (!result) {
      return NextResponse.json({
        success: true,
        found: false,
        message: 'Aucune pièce trouvée avec ce numéro de série',
      })
    }

    return NextResponse.json({
      success: true,
      found: true,
      data: {
        serial: result.serial,
        batchNumber: result.batchNumber,
        manufacturedAt: result.manufacturedAt,
        status: result.status,
        product: result.product,
        order: result.orderItem?.order || null,
      },
    })
  } catch (error) {
    console.error('[API v2] GET /traceability error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
