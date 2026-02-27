import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

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
    
    // Récupérer et sauvegarder le fichier CV si présent
    const cvFile = formData.get('cv') as File | null
    let cvUrl = ''
    let cvName = ''
    
    if (cvFile && cvFile.size > 0) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ]
      if (!allowedTypes.includes(cvFile.type)) {
        return NextResponse.json(
          { success: false, error: 'Type de fichier non autorisé. Formats acceptés : PDF, DOC, DOCX' },
          { status: 400 }
        )
      }

      // Validate file size (10MB max)
      if (cvFile.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: 'Fichier trop volumineux. Taille maximale : 10 Mo' },
          { status: 400 }
        )
      }

      // Save file to disk
      const timestamp = Date.now()
      const safeName = cvFile.name.replace(/[^a-zA-Z0-9.-]/g, '_').slice(0, 50)
      const filename = `${timestamp}-${safeName}`
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'cvs')

      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true })
      }

      const bytes = await cvFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(path.join(uploadDir, filename), buffer)

      cvUrl = `/uploads/cvs/${filename}`
      cvName = cvFile.name
    }

    // Extraire prénom et nom depuis le champ name
    const nameParts = validated.name.trim().split(/\s+/)
    const firstName = nameParts[0] || validated.name
    const lastName = nameParts.slice(1).join(' ') || '-'

    // Chercher un job correspondant au poste sélectionné (optionnel)
    let jobId: string | null = null
    if (validated.position && validated.position !== 'spontanee') {
      const job = await prisma.job.findFirst({
        where: { title: validated.position, published: true }
      })
      if (job) jobId = job.id
    }

    // Si pas de job trouvé, chercher ou créer un job "Candidature spontanée"
    if (!jobId) {
      let spontaneousJob = await prisma.job.findFirst({
        where: { slug: 'candidature-spontanee' }
      })
      if (!spontaneousJob) {
        spontaneousJob = await prisma.job.create({
          data: {
            title: 'Candidature spontanée',
            slug: 'candidature-spontanee',
            type: 'Spontanée',
            location: 'Aix-en-Provence',
            department: 'Général',
            description: 'Candidature spontanée reçue via le formulaire rapide.',
            requirements: 'Aucun prérequis spécifique.',
            published: false,
          }
        })
      }
      jobId = spontaneousJob.id
    }

    // Sauvegarder la candidature en base de données
    const application = await prisma.application.create({
      data: {
        jobId,
        firstName,
        lastName,
        email: validated.email,
        phone: null,
        message: validated.message || null,
        cvUrl: cvUrl || '',
        cvName: cvName || null,
      },
      include: {
        job: { select: { title: true } }
      }
    })

    // Notifier les admins par email (en background, ne bloque pas la réponse)
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').trim()
    const positionLabel = validated.position === 'spontanee' ? 'Candidature spontanée' : validated.position

    try {
      const { sendEmail } = await import('@/lib/email/mailer')
      const activeAdmins = await prisma.admin.findMany({
        where: { isActive: true },
        select: { email: true, firstName: true }
      })

      for (const admin of activeAdmins) {
        await sendEmail({
          to: admin.email,
          subject: `[Candidature rapide] ${validated.name} - ${positionLabel}`,
          html: `
            <!DOCTYPE html>
            <html>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; padding: 30px 0; background: linear-gradient(135deg, #0047FF 0%, #002d99 100%); border-radius: 12px 12px 0 0;">
                  <h2 style="color: white; margin: 0;">📋 Nouvelle candidature rapide</h2>
                </div>
                <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb;">
                  <p>Bonjour ${admin.firstName},</p>
                  <p>Une nouvelle candidature a été reçue via le formulaire rapide :</p>
                  <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 4px 0;"><strong>Candidat :</strong> ${validated.name}</p>
                    <p style="margin: 4px 0;"><strong>Email :</strong> ${validated.email}</p>
                    <p style="margin: 4px 0;"><strong>Poste :</strong> ${positionLabel}</p>
                    ${cvUrl ? `<p style="margin: 4px 0;"><strong>CV :</strong> <a href="${baseUrl}${cvUrl}">${cvName}</a></p>` : '<p style="margin: 4px 0;"><strong>CV :</strong> Non joint</p>'}
                    ${validated.message ? `<p style="margin: 4px 0;"><strong>Message :</strong> ${validated.message}</p>` : ''}
                  </div>
                  <div style="text-align: center; margin: 20px 0;">
                    <a href="${baseUrl}/admin/candidatures" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #0047FF 0%, #002d99 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">Voir les candidatures</a>
                  </div>
                </div>
                <div style="background: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 12px 12px;">
                  <p>© ${new Date().getFullYear()} LLEDO Industries</p>
                </div>
              </div>
            </body>
            </html>
          `,
          text: `Nouvelle candidature rapide de ${validated.name} pour "${positionLabel}". Email: ${validated.email}. Voir: ${baseUrl}/admin/candidatures`,
        })
      }
      console.log(`[quick-apply] Notified ${activeAdmins.length} admins`)
    } catch (emailErr) {
      // Email failure should NOT block the application submission
      console.error('[quick-apply] Failed to notify admins:', emailErr)
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Votre candidature a été envoyée avec succès',
        applicationId: application.id,
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
