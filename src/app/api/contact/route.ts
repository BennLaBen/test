import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit'

const resend = new Resend(process.env.RESEND_API_KEY)

const contactSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  company: z.string().optional(),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Le sujet est requis'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
  consent: z.boolean().refine(val => val === true, 'Vous devez accepter la politique de confidentialité'),
})

export async function POST(request: NextRequest) {
  const { success, remaining } = rateLimit(request, 5, 300000)
  
  if (!success) {
    return rateLimitResponse(remaining)
  }

  try {
    const body = await request.json()
    const validatedData = contactSchema.parse(body)
    
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY missing')
      return NextResponse.json(
        { success: false, message: 'Service email non configuré' },
        { status: 503 }
      )
    }

    await resend.emails.send({
      from: process.env.SMTP_FROM || 'noreply@mpeb13.com',
      to: process.env.CONTACT_EMAIL || 'contact@mpeb13.com',
      subject: `Nouveau message de contact - ${validatedData.subject}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom :</strong> ${validatedData.firstName} ${validatedData.lastName}</p>
        <p><strong>Email :</strong> ${validatedData.email}</p>
        <p><strong>Société :</strong> ${validatedData.company || 'Non renseigné'}</p>
        <p><strong>Téléphone :</strong> ${validatedData.phone || 'Non renseigné'}</p>
        <p><strong>Sujet :</strong> ${validatedData.subject}</p>
        <p><strong>Message :</strong></p>
        <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>Message envoyé depuis le formulaire de contact du site LLEDO Industries</em></p>
      `,
    })

    await resend.emails.send({
      from: process.env.SMTP_FROM || 'noreply@mpeb13.com',
      to: validatedData.email,
      subject: 'Confirmation de réception - LLEDO Industries',
      html: `
        <h2>Confirmation de réception</h2>
        <p>Bonjour ${validatedData.firstName},</p>
        <p>Nous avons bien reçu votre message concernant : <strong>${validatedData.subject}</strong></p>
        <p>Notre équipe vous répondra dans les plus brefs délais.</p>
        <p>Cordialement,<br>L'équipe LLEDO Industries</p>
        <hr>
        <p><em>Ce message a été envoyé automatiquement, merci de ne pas y répondre.</em></p>
      `,
    })

    return NextResponse.json(
      { success: true, message: 'Message envoyé avec succès' },
      { 
        status: 200,
        headers: { 'X-RateLimit-Remaining': remaining.toString() }
      }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Erreur lors de l\'envoi du message' },
      { status: 500 }
    )
  }
}
