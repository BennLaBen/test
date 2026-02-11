import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email/mailer'
import { z } from 'zod'

const quoteSchema = z.object({
  company: z.string().min(1, 'Société requise'),
  name: z.string().min(1, 'Nom requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  message: z.string().optional(),
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    quantity: z.number().min(1),
    price_display: z.string(),
  })).min(1, 'Panier vide'),
})

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

    const { company, name, email, phone, message, items } = validation.data

    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">${item.name}</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">${item.id}</td>
      </tr>
    `).join('')

    const itemsText = items.map(item => `- ${item.name} (x${item.quantity}) [REF: ${item.id}]`).join('\n')

    // Email to admin
    const adminHtml = `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1e3a8a, #0047FF); padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 2px;">NOUVELLE DEMANDE DE DEVIS</h1>
          <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 14px;">LLEDO AEROTOOLS — Catalogue en ligne</p>
        </div>
        
        <div style="padding: 32px;">
          <h2 style="font-size: 16px; color: #374151; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 1px;">Informations client</h2>
          <table style="width: 100%; margin-bottom: 24px;">
            <tr><td style="padding: 8px 0; color: #6b7280; width: 120px;">Société</td><td style="padding: 8px 0; font-weight: 600; color: #111827;">${company}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Contact</td><td style="padding: 8px 0; font-weight: 600; color: #111827;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #0047FF;">${email}</a></td></tr>
            ${phone ? `<tr><td style="padding: 8px 0; color: #6b7280;">Téléphone</td><td style="padding: 8px 0; font-weight: 600; color: #111827;">${phone}</td></tr>` : ''}
          </table>

          <h2 style="font-size: 16px; color: #374151; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 1px;">Équipements demandés (${items.length})</h2>
          <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="padding: 12px 16px; text-align: left; font-size: 12px; color: #6b7280; text-transform: uppercase;">Produit</th>
                <th style="padding: 12px 16px; text-align: center; font-size: 12px; color: #6b7280; text-transform: uppercase;">Qté</th>
                <th style="padding: 12px 16px; text-align: left; font-size: 12px; color: #6b7280; text-transform: uppercase;">Réf.</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          ${message ? `
            <h2 style="font-size: 16px; color: #374151; margin: 24px 0 12px; text-transform: uppercase; letter-spacing: 1px;">Message</h2>
            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; color: #374151;">${message}</div>
          ` : ''}
        </div>

        <div style="background: #f3f4f6; padding: 16px 32px; text-align: center; font-size: 12px; color: #9ca3af;">
          Demande envoyée depuis le catalogue LLEDO AEROTOOLS
        </div>
      </div>
    `

    // Email to client (confirmation)
    const clientHtml = `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1e3a8a, #0047FF); padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 22px; font-weight: 800;">DEMANDE DE DEVIS REÇUE</h1>
          <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 14px;">LLEDO AEROTOOLS</p>
        </div>
        
        <div style="padding: 32px;">
          <p style="color: #374151; font-size: 16px; margin: 0 0 16px;">Bonjour <strong>${name}</strong>,</p>
          <p style="color: #6b7280; line-height: 1.6; margin: 0 0 24px;">
            Nous avons bien reçu votre demande de devis pour ${items.length} équipement(s). 
            Un ingénieur commercial vous contactera sous <strong>24 à 48 heures ouvrées</strong>.
          </p>

          <h3 style="font-size: 14px; color: #374151; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 1px;">Récapitulatif</h3>
          <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
            <tbody>${itemsHtml}</tbody>
          </table>

          <div style="margin-top: 32px; padding: 20px; background: #eff6ff; border-radius: 8px; border-left: 4px solid #0047FF;">
            <p style="margin: 0; color: #1e40af; font-size: 14px;">
              <strong>Besoin urgent ?</strong><br>
              Contactez-nous directement au <strong>+33 4 42 02 96 74</strong>
            </p>
          </div>
        </div>

        <div style="background: #f3f4f6; padding: 16px 32px; text-align: center; font-size: 12px; color: #9ca3af;">
          © ${new Date().getFullYear()} LLEDO Industries — Division AEROTOOLS
        </div>
      </div>
    `

    const contactEmail = (process.env.CONTACT_EMAIL || 'contact@mpeb13.com').trim()

    // Send to admin
    const adminSent = await sendEmail({
      to: contactEmail,
      subject: `[DEVIS AEROTOOLS] ${company} — ${items.length} équipement(s)`,
      html: adminHtml,
      text: `Nouvelle demande de devis AEROTOOLS\n\nSociété: ${company}\nContact: ${name}\nEmail: ${email}\nTéléphone: ${phone || 'N/A'}\n\nÉquipements:\n${itemsText}\n\nMessage: ${message || 'Aucun'}`,
    })

    // Send confirmation to client
    await sendEmail({
      to: email,
      subject: `Votre demande de devis LLEDO AEROTOOLS — Confirmation`,
      html: clientHtml,
      text: `Bonjour ${name},\n\nNous avons bien reçu votre demande de devis pour ${items.length} équipement(s).\nUn ingénieur commercial vous contactera sous 24 à 48 heures ouvrées.\n\nRécapitulatif:\n${itemsText}\n\nBesoin urgent ? +33 4 42 02 96 74\n\n© LLEDO Industries — Division AEROTOOLS`,
    })

    console.log(`[quote] Quote request from ${email} (${company}): ${items.length} items, adminSent=${adminSent}`)

    return NextResponse.json({
      success: true,
      message: 'Demande de devis envoyée avec succès.',
    })

  } catch (error) {
    console.error('Quote API error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur. Veuillez réessayer.' },
      { status: 500 }
    )
  }
}
