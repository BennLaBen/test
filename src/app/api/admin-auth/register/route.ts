import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateSecureToken, hashToken, logSecurityEvent } from '@/lib/auth/security'
import { validateSession, getAccessTokenFromCookie } from '@/lib/auth/jwt'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  firstName: z.string().min(2, 'Prénom requis (min 2 caractères)'),
  lastName: z.string().min(2, 'Nom requis (min 2 caractères)'),
  company: z.enum(['MPEB', 'EGI', 'FREM', 'MGP', 'Aerotools', 'Groupe']),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'VIEWER']).optional().default('ADMIN'),
})

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const userAgent = request.headers.get('user-agent')
  
  try {
    // Verify super admin authentication
    const accessToken = await getAccessTokenFromCookie()
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      )
    }
    
    const session = await validateSession(accessToken)
    if (!session.isValid || !session.admin) {
      return NextResponse.json(
        { error: 'Session invalide' },
        { status: 401 }
      )
    }
    
    // Only super admins can create new admin accounts
    if (session.admin.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Droits insuffisants. Seul un super-admin peut créer des comptes.' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    const validation = registerSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }
    
    const { email, firstName, lastName, company, role } = validation.data
    
    // Check if email already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
    })
    
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Un compte avec cet email existe déjà' },
        { status: 409 }
      )
    }
    
    // Create the admin account (inactive until email verification)
    const admin = await prisma.admin.create({
      data: {
        email: email.toLowerCase(),
        firstName,
        lastName,
        company,
        role,
        isActive: false,
        emailVerified: false,
        createdBy: session.admin.id,
      },
    })
    
    // Generate activation token (valid for 24 hours)
    const activationToken = generateSecureToken(32)
    const tokenHash = hashToken(activationToken)
    
    await prisma.activationToken.create({
      data: {
        adminId: admin.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    })
    
    // Log the event
    await logSecurityEvent({
      adminId: admin.id,
      eventType: 'ACCOUNT_CREATED',
      ipAddress: ip,
      userAgent: userAgent || undefined,
      status: 'SUCCESS',
      details: { createdBy: session.admin.email, company, role },
    })
    
    // Generate activation URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const activationUrl = `${baseUrl}/admin/activate?token=${activationToken}`
    
    // Envoyer l'email d'activation/invitation
    const { sendEmail } = await import('@/lib/email/mailer')
    const { getActivationEmail } = await import('@/lib/email/templates')
    const template = getActivationEmail({
      firstName,
      company,
      activationUrl,
      expiresIn: '24 heures',
    })
    const emailSent = await sendEmail({
      to: email.toLowerCase(),
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
    
    console.log(`[register] Email sent to ${email}: ${emailSent}`)
    
    return NextResponse.json({
      success: true,
      message: emailSent 
        ? 'Compte créé. Un email d\'activation a été envoyé.'
        : 'Compte créé mais l\'email n\'a pas pu être envoyé. Vérifiez la configuration SMTP.',
      emailSent,
      admin: {
        id: admin.id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        company: admin.company,
        role: admin.role,
      },
      // Only in dev mode
      ...(process.env.NODE_ENV === 'development' && { activationUrl }),
    })
    
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur. Veuillez réessayer.' },
      { status: 500 }
    )
  }
}
