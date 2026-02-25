import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { getAdminFromRequest } from '@/lib/auth/admin-guard'
import { z } from 'zod'

// GET /api/applications - Get applications (admin: all, user: own)
export async function GET(request: NextRequest) {
  try {
    // Check admin JWT first, then NextAuth session
    const adminUser = await getAdminFromRequest()
    const session = !adminUser ? await auth() : null
    
    if (!adminUser && !session?.user) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const isAdmin = !!adminUser || session?.user?.role === 'ADMIN'
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const jobId = searchParams.get('jobId')

    const where: any = {}
    
    // Non-admin can only see their own applications
    if (!isAdmin) {
      where.userId = session.user.id
    }
    
    if (status) where.status = status
    if (jobId) where.jobId = jobId

    const applications = await prisma.application.findMany({
      where,
      include: {
        job: {
          select: { title: true, slug: true, type: true, location: true }
        },
        user: isAdmin ? {
          select: { firstName: true, lastName: true, email: true }
        } : false
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, applications })
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des candidatures' },
      { status: 500 }
    )
  }
}

// POST /api/applications - Submit an application (public)
const applicationSchema = z.object({
  jobId: z.string().min(1, 'L\'offre est requise'),
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  message: z.string().optional(),
  cvUrl: z.string().url('URL du CV invalide'),
  cvName: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = applicationSchema.parse(body)

    // Check if job exists and is published
    const job = await prisma.job.findUnique({ where: { id: data.jobId } })
    if (!job || !job.published) {
      return NextResponse.json(
        { success: false, error: 'Offre non trouvée ou non disponible' },
        { status: 404 }
      )
    }

    // Check if user is logged in
    const session = await auth()
    const userId = session?.user?.id || null

    // Check for duplicate application
    const existing = await prisma.application.findFirst({
      where: {
        jobId: data.jobId,
        email: data.email,
      }
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Vous avez déjà postulé à cette offre' },
        { status: 400 }
      )
    }

    const application = await prisma.application.create({
      data: {
        jobId: data.jobId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        message: data.message,
        cvUrl: data.cvUrl,
        cvName: data.cvName,
        userId,
      },
      include: {
        job: { select: { title: true } }
      }
    })

    // Notify all active admins by email
    try {
      const { sendEmail } = await import('@/lib/email/mailer')
      const activeAdmins = await prisma.admin.findMany({
        where: { isActive: true },
        select: { email: true, firstName: true }
      })
      const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').trim()
      
      for (const admin of activeAdmins) {
        await sendEmail({
          to: admin.email,
          subject: `Nouvelle candidature : ${data.firstName} ${data.lastName} - ${application.job.title}`,
          html: `
            <!DOCTYPE html>
            <html>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; padding: 30px 0; background: linear-gradient(135deg, #0047FF 0%, #002d99 100%); border-radius: 12px 12px 0 0;">
                  <h2 style="color: white; margin: 0;">📋 Nouvelle candidature</h2>
                </div>
                <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb;">
                  <p>Bonjour ${admin.firstName},</p>
                  <p>Une nouvelle candidature a été reçue :</p>
                  <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 4px 0;"><strong>Candidat :</strong> ${data.firstName} ${data.lastName}</p>
                    <p style="margin: 4px 0;"><strong>Email :</strong> ${data.email}</p>
                    ${data.phone ? `<p style="margin: 4px 0;"><strong>Téléphone :</strong> ${data.phone}</p>` : ''}
                    <p style="margin: 4px 0;"><strong>Poste :</strong> ${application.job.title}</p>
                    ${data.message ? `<p style="margin: 4px 0;"><strong>Message :</strong> ${data.message}</p>` : ''}
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
          text: `Nouvelle candidature de ${data.firstName} ${data.lastName} pour le poste "${application.job.title}". Email: ${data.email}. Voir: ${baseUrl}/admin/candidatures`,
        })
      }
      console.log(`[applications] Notified ${activeAdmins.length} admins about new application`)
    } catch (emailErr) {
      console.error('[applications] Failed to notify admins:', emailErr)
    }

    return NextResponse.json(
      { 
        success: true, 
        application,
        message: 'Votre candidature a été envoyée avec succès'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating application:', error)
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
