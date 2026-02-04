import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

// Initialisation lazy de Resend pour éviter l'erreur au build
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured')
  }
  return new Resend(apiKey)
}

// Schéma de validation pour candidature rapide
const quickApplicationSchema = z.object({
  name: z.string().min(2, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  position: z.string().min(1, 'Le poste est requis'),
  message: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Parse form data (pour supporter l'upload de fichier)
    const formData = await request.formData()
    
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      position: formData.get('position') as string,
      message: formData.get('message') as string || '',
    }
    
    // Validation
    const validated = quickApplicationSchema.parse(data)
    
    // Récupérer le fichier CV si présent
    const cvFile = formData.get('cv') as File | null
    let cvInfo = 'Aucun CV joint'
    
    if (cvFile && cvFile.size > 0) {
      cvInfo = `CV joint: ${cvFile.name} (${(cvFile.size / 1024).toFixed(1)} Ko)`
    }

    // Construire le contenu de l'email
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 30px; }
          .field { margin-bottom: 20px; }
          .label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
          .value { font-size: 16px; color: #1f2937; padding: 12px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #3b82f6; }
          .message-box { background: #eff6ff; padding: 20px; border-radius: 8px; margin-top: 20px; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
          .badge { display: inline-block; background: #3b82f6; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 Nouvelle Candidature</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Via le formulaire rapide</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Candidat</div>
              <div class="value">${validated.name}</div>
            </div>
            <div class="field">
              <div class="label">Email</div>
              <div class="value"><a href="mailto:${validated.email}" style="color: #3b82f6;">${validated.email}</a></div>
            </div>
            <div class="field">
              <div class="label">Poste souhaité</div>
              <div class="value"><span class="badge">${validated.position === 'spontanee' ? 'Candidature spontanée' : validated.position}</span></div>
            </div>
            <div class="field">
              <div class="label">CV</div>
              <div class="value">${cvInfo}</div>
            </div>
            ${validated.message ? `
            <div class="message-box">
              <div class="label">Message</div>
              <p style="margin: 10px 0 0; color: #374151; line-height: 1.6;">${validated.message}</p>
            </div>
            ` : ''}
          </div>
          <div class="footer">
            <p>Candidature reçue le ${new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            <p>LLEDO Industries - Groupe Industriel</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Envoyer l'email via Resend
    const resend = getResend()
    const { data: emailResult, error: emailError } = await resend.emails.send({
      from: process.env.SMTP_FROM || 'noreply@mpeb13.com',
      to: ['rh@lledo-industries.com'],
      replyTo: validated.email,
      subject: `[Candidature] ${validated.name} - ${validated.position === 'spontanee' ? 'Candidature spontanée' : validated.position}`,
      html: emailHtml,
    })

    if (emailError) {
      console.error('Resend error:', emailError)
      return NextResponse.json(
        { success: false, error: 'Erreur lors de l\'envoi de l\'email' },
        { status: 500 }
      )
    }

    // Envoyer un email de confirmation au candidat
    await resend.emails.send({
      from: process.env.SMTP_FROM || 'noreply@mpeb13.com',
      to: [validated.email],
      subject: 'Confirmation de votre candidature - LLEDO Industries',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 40px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { padding: 40px; text-align: center; }
            .checkmark { width: 80px; height: 80px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Candidature reçue !</h1>
            </div>
            <div class="content">
              <p style="font-size: 18px; color: #374151; margin-bottom: 20px;">
                Bonjour <strong>${validated.name}</strong>,
              </p>
              <p style="color: #6b7280; line-height: 1.8;">
                Nous avons bien reçu votre candidature pour le poste de <strong>${validated.position === 'spontanee' ? 'Candidature spontanée' : validated.position}</strong>.
              </p>
              <p style="color: #6b7280; line-height: 1.8;">
                Notre équipe RH examinera votre profil et reviendra vers vous dans les meilleurs délais.
              </p>
              <p style="margin-top: 30px; color: #374151;">
                À très bientôt,<br>
                <strong>L'équipe LLEDO Industries</strong>
              </p>
            </div>
            <div class="footer">
              <p>LLEDO Industries - Groupe Industriel</p>
              <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    return NextResponse.json(
      { 
        success: true, 
        message: 'Votre candidature a été envoyée avec succès',
        emailId: emailResult?.id
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error processing quick application:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'envoi de la candidature' },
      { status: 500 }
    )
  }
}
