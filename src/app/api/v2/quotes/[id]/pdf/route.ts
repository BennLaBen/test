import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import PDFDocument from 'pdfkit'

export const dynamic = 'force-dynamic'

// GET /api/v2/quotes/:id/pdf — Generate PDF quote
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
              select: { name: true, sku: true, priceDisplay: true, shortDescription: true, certifications: true },
            },
          },
        },
        user: { select: { firstName: true, lastName: true, email: true, company: true } },
        organization: { select: { name: true, siret: true, vatNumber: true } },
      },
    })

    if (!quote) {
      return NextResponse.json({ error: 'Devis introuvable' }, { status: 404 })
    }

    // Generate PDF
    const chunks: Buffer[] = []
    const doc = new PDFDocument({ size: 'A4', margin: 50, bufferPages: true })

    doc.on('data', (chunk: Buffer) => chunks.push(chunk))

    const pdfReady = new Promise<Buffer>((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)))
    })

    // ── HEADER ──
    doc.fontSize(10).fillColor('#6b7280').text('LLEDO AEROTOOLS', 50, 50)
    doc.fontSize(7).text('Groupe LLEDO Industries — ZI Les Paluds — 13400 Aubagne — France', 50, 65)
    doc.text('Tél: +33 4 42 02 96 74 — Email: contact@mpeb13.com', 50, 75)
    doc.text('SIRET: XXX XXX XXX XXXXX — TVA: FR XX XXX XXX XXX', 50, 85)

    // Blue line
    doc.moveTo(50, 100).lineTo(545, 100).strokeColor('#2563eb').lineWidth(2).stroke()

    // ── TITLE ──
    doc.fontSize(22).fillColor('#111827').text('DEVIS', 50, 120)
    doc.fontSize(12).fillColor('#2563eb').text(quote.reference, 130, 126)

    // Status + Date
    const statusLabels: Record<string, string> = {
      DRAFT: 'Brouillon', SUBMITTED: 'Soumis', IN_REVIEW: 'En analyse',
      QUOTED: 'Devis envoyé', ACCEPTED: 'Accepté', REJECTED: 'Refusé',
      EXPIRED: 'Expiré', CONVERTED: 'Converti en commande',
    }
    doc.fontSize(9).fillColor('#6b7280')
      .text(`Statut: ${statusLabels[quote.status] || quote.status}`, 50, 150)
      .text(`Date: ${new Date(quote.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`, 50, 163)

    if (quote.validUntil) {
      doc.text(`Valide jusqu'au: ${new Date(quote.validUntil).toLocaleDateString('fr-FR')}`, 50, 176)
    }

    // ── CLIENT INFO ──
    const clientY = 150
    doc.fontSize(9).fillColor('#9ca3af').text('DESTINATAIRE', 350, clientY)
    doc.fontSize(10).fillColor('#111827')
      .text(quote.contactCompany || quote.organization?.name || '', 350, clientY + 15)
    doc.fontSize(9).fillColor('#374151')
      .text(quote.contactName || `${quote.user?.firstName} ${quote.user?.lastName}`, 350, clientY + 30)
      .text(quote.contactEmail || quote.user?.email || '', 350, clientY + 43)

    if (quote.contactPhone) {
      doc.text(quote.contactPhone, 350, clientY + 56)
    }

    // ── TABLE HEADER ──
    const tableTop = 220
    doc.moveTo(50, tableTop).lineTo(545, tableTop).strokeColor('#e5e7eb').lineWidth(1).stroke()

    doc.fontSize(8).fillColor('#6b7280')
      .text('#', 50, tableTop + 8)
      .text('RÉFÉRENCE', 70, tableTop + 8)
      .text('DÉSIGNATION', 160, tableTop + 8)
      .text('QTÉ', 400, tableTop + 8, { width: 40, align: 'center' })
      .text('P.U.', 440, tableTop + 8, { width: 50, align: 'right' })
      .text('TOTAL', 495, tableTop + 8, { width: 50, align: 'right' })

    doc.moveTo(50, tableTop + 22).lineTo(545, tableTop + 22).strokeColor('#e5e7eb').stroke()

    // ── TABLE ROWS ──
    let y = tableTop + 30
    let grandTotal = 0

    quote.items.forEach((item, index) => {
      const unitPrice = item.unitPrice ? Number(item.unitPrice) : 0
      const lineTotal = unitPrice * item.quantity
      grandTotal += lineTotal

      // Zebra striping
      if (index % 2 === 0) {
        doc.rect(50, y - 4, 495, 28).fillColor('#f9fafb').fill()
      }

      doc.fontSize(9).fillColor('#374151')
        .text(`${index + 1}`, 50, y)
        .text(item.product.sku, 70, y)

      doc.fontSize(8).fillColor('#111827')
        .text(item.product.name, 160, y, { width: 230 })

      doc.fontSize(9).fillColor('#374151')
        .text(`${item.quantity}`, 400, y, { width: 40, align: 'center' })
        .text(unitPrice > 0 ? `${unitPrice.toLocaleString('fr-FR')} €` : 'Sur devis', 440, y, { width: 50, align: 'right' })
        .text(lineTotal > 0 ? `${lineTotal.toLocaleString('fr-FR')} €` : '—', 495, y, { width: 50, align: 'right' })

      if (item.notes) {
        doc.fontSize(7).fillColor('#9ca3af').text(`Note: ${item.notes}`, 160, y + 13, { width: 230 })
        y += 32
      } else {
        y += 24
      }
    })

    // ── TOTAL ──
    doc.moveTo(350, y + 5).lineTo(545, y + 5).strokeColor('#e5e7eb').stroke()

    if (grandTotal > 0) {
      doc.fontSize(9).fillColor('#6b7280').text('Sous-total HT', 350, y + 15)
      doc.fontSize(10).fillColor('#111827').text(`${grandTotal.toLocaleString('fr-FR')} €`, 495, y + 15, { width: 50, align: 'right' })

      const tva = grandTotal * 0.2
      doc.fontSize(9).fillColor('#6b7280').text('TVA (20%)', 350, y + 32)
      doc.fontSize(10).fillColor('#111827').text(`${tva.toLocaleString('fr-FR')} €`, 495, y + 32, { width: 50, align: 'right' })

      doc.moveTo(350, y + 48).lineTo(545, y + 48).strokeColor('#2563eb').lineWidth(1.5).stroke()

      doc.fontSize(12).fillColor('#111827').text('TOTAL TTC', 350, y + 55)
      doc.fontSize(12).fillColor('#2563eb').text(`${(grandTotal + tva).toLocaleString('fr-FR')} €`, 470, y + 55, { width: 75, align: 'right' })

      y += 80
    } else {
      doc.fontSize(10).fillColor('#6b7280').text('Prix: SUR DEVIS — Un commercial vous contactera sous 24-48h.', 50, y + 15)
      y += 45
    }

    // ── NOTES ──
    if (quote.notes) {
      doc.fontSize(9).fillColor('#9ca3af').text('MESSAGE DU CLIENT', 50, y + 10)
      doc.fontSize(9).fillColor('#374151').text(quote.notes, 50, y + 25, { width: 495 })
      y += 50
    }

    // ── CONDITIONS ──
    const condY = Math.max(y + 20, 620)
    doc.moveTo(50, condY).lineTo(545, condY).strokeColor('#e5e7eb').lineWidth(0.5).stroke()

    doc.fontSize(7).fillColor('#9ca3af')
      .text('CONDITIONS GÉNÉRALES', 50, condY + 8)
    doc.fontSize(6.5).fillColor('#9ca3af')
      .text('• Validité du devis : 30 jours à compter de la date d\'émission.', 50, condY + 22)
      .text('• Conditions de paiement : Net 30 jours par virement bancaire, sauf accord contraire.', 50, condY + 32)
      .text('• Délai de livraison : indiqué à titre indicatif, confirmé à la commande.', 50, condY + 42)
      .text('• Garantie : 24 mois pièces et main-d\'œuvre, sauf mention contraire.', 50, condY + 52)
      .text('• Conformité : Tous les produits sont conformes CE, Directive Machines 2006/42/CE.', 50, condY + 62)
      .text('• Juridiction : Tribunal de Commerce de Marseille.', 50, condY + 72)

    // ── FOOTER ──
    doc.fontSize(7).fillColor('#2563eb')
      .text('LLEDO AEROTOOLS — La marketplace outillage sol hélicoptères', 50, 770, { align: 'center', width: 495 })
    doc.fontSize(6).fillColor('#9ca3af')
      .text('www.lledo-industries.com — contact@mpeb13.com — +33 4 42 02 96 74', 50, 782, { align: 'center', width: 495 })

    doc.end()

    const pdfBuffer = await pdfReady

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="devis-${quote.reference}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('[API v2] GET /quotes/:id/pdf error:', error)
    return NextResponse.json({ error: 'Erreur génération PDF' }, { status: 500 })
  }
}
