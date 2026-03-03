import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { sendEmail } from '@/lib/email/mailer'

export const dynamic = 'force-dynamic'

const quoteSchema = z.object({
  contactName: z.string().min(1, 'Nom requis'),
  contactEmail: z.string().email('Email invalide'),
  contactPhone: z.string().optional(),
  contactCompany: z.string().min(1, 'Société requise'),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    notes: z.string().optional(),
  })).min(1, 'Au moins un produit requis'),
})

function generateReference(): string {
  const year = new Date().getFullYear()
  const rand = Math.floor(Math.random() * 9999).toString().padStart(4, '0')
  return `QUO-${year}-${rand}`
}

// GET /api/v2/quotes — List quotes (authenticated user or admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '20'))

    const where: any = {}
    if (status) where.status = status

    const [quotes, total] = await Promise.all([
      prisma.quote.findMany({
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
      prisma.quote.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: quotes,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('[API v2] GET /quotes error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST /api/v2/quotes — Create a new quote (RFQ)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = quoteSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { contactName, contactEmail, contactPhone, contactCompany, notes, items } = validation.data

    // Verify all products exist
    const productIds = items.map(i => i.productId)
    const products = await prisma.marketProduct.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, sku: true, priceDisplay: true },
    })

    if (products.length !== productIds.length) {
      return NextResponse.json({ error: 'Un ou plusieurs produits introuvables' }, { status: 400 })
    }

    // Find or create a guest user for unauthenticated quotes
    let user = await prisma.user.findUnique({ where: { email: contactEmail } })
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: contactEmail,
          password: '', // No password for guest users created via RFQ
          firstName: contactName.split(' ')[0] || contactName,
          lastName: contactName.split(' ').slice(1).join(' ') || '',
          company: contactCompany,
          phone: contactPhone || null,
          role: 'CLIENT',
        },
      })
    }

    // Create quote
    const reference = generateReference()
    const quote = await prisma.quote.create({
      data: {
        reference,
        userId: user.id,
        status: 'SUBMITTED',
        contactName,
        contactEmail,
        contactPhone: contactPhone || null,
        contactCompany,
        notes: notes || null,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            notes: item.notes || null,
          })),
        },
      },
      include: {
        items: {
          include: { product: { select: { name: true, sku: true } } },
        },
      },
    })

    // Send email notification to admin
    const itemsList = quote.items
      .map(i => `- ${i.product.name} (${i.product.sku}) × ${i.quantity}`)
      .join('\n')

    const adminEmail = (process.env.CONTACT_EMAIL || 'contact@mpeb13.com').trim()
    await sendEmail({
      to: adminEmail,
      subject: `[RFQ ${reference}] ${contactCompany} — ${items.length} produit(s)`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e3a8a, #0047FF); padding: 24px; color: white; border-radius: 12px 12px 0 0;">
            <h1 style="margin: 0; font-size: 20px;">Nouvelle demande de devis ${reference}</h1>
          </div>
          <div style="padding: 24px; background: #f9fafb; border-radius: 0 0 12px 12px;">
            <p><strong>Société :</strong> ${contactCompany}</p>
            <p><strong>Contact :</strong> ${contactName}</p>
            <p><strong>Email :</strong> <a href="mailto:${contactEmail}">${contactEmail}</a></p>
            ${contactPhone ? `<p><strong>Tél :</strong> ${contactPhone}</p>` : ''}
            <h3>Produits demandés (${items.length})</h3>
            <pre style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb;">${itemsList}</pre>
            ${notes ? `<h3>Message</h3><p>${notes}</p>` : ''}
          </div>
        </div>
      `,
      text: `Nouvelle RFQ ${reference}\nSociété: ${contactCompany}\nContact: ${contactName} (${contactEmail})\n\nProduits:\n${itemsList}\n\nMessage: ${notes || 'Aucun'}`,
    })

    // Send confirmation to client
    await sendEmail({
      to: contactEmail,
      subject: `Votre demande de devis ${reference} — LLEDO AEROTOOLS`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e3a8a, #0047FF); padding: 24px; color: white; border-radius: 12px 12px 0 0;">
            <h1 style="margin: 0; font-size: 20px;">Demande de devis reçue</h1>
            <p style="margin: 8px 0 0; opacity: 0.8;">Référence : ${reference}</p>
          </div>
          <div style="padding: 24px; background: #f9fafb; border-radius: 0 0 12px 12px;">
            <p>Bonjour <strong>${contactName}</strong>,</p>
            <p>Nous avons bien reçu votre demande pour ${items.length} produit(s). Un ingénieur commercial vous contactera sous <strong>24 à 48 heures ouvrées</strong>.</p>
            <h3>Récapitulatif</h3>
            <pre style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb;">${itemsList}</pre>
            <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">Besoin urgent ? Appelez-nous au <strong>+33 4 42 02 96 74</strong></p>
          </div>
        </div>
      `,
      text: `Bonjour ${contactName},\n\nDemande de devis ${reference} reçue.\n\nProduits:\n${itemsList}\n\nRéponse sous 24-48h ouvrées.\nTél: +33 4 42 02 96 74`,
    })

    console.log(`[RFQ] ${reference} from ${contactEmail} (${contactCompany}): ${items.length} items`)

    return NextResponse.json({
      success: true,
      data: {
        id: quote.id,
        reference: quote.reference,
        status: quote.status,
        itemCount: quote.items.length,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('[API v2] POST /quotes error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
