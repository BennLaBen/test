import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { z } from 'zod'

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

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the form data
    const validatedData = contactSchema.parse(body)
    
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Email content
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@lledo-industries.com',
      to: process.env.CONTACT_EMAIL || 'contact@lledo-industries.com',
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
    }

    // Send email
    await transporter.sendMail(mailOptions)

    // Send confirmation email to user
    const confirmationOptions = {
      from: process.env.SMTP_FROM || 'noreply@lledo-industries.com',
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
    }

    await transporter.sendMail(confirmationOptions)

    return NextResponse.json(
      { success: true, message: 'Message envoyé avec succès' },
      { status: 200 }
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
