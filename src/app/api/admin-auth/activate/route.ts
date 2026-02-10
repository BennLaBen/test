import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashToken, hashPassword, validatePassword, logSecurityEvent } from '@/lib/auth/security'
import { z } from 'zod'

const activateSchema = z.object({
  token: z.string().min(1, 'Token requis'),
  password: z.string().min(12, 'Mot de passe requis (min 12 caractères)'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const userAgent = request.headers.get('user-agent')
  
  try {
    const body = await request.json()
    const validation = activateSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }
    
    const { token, password } = validation.data
    
    // Validate password strength
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.errors[0], errors: passwordValidation.errors },
        { status: 400 }
      )
    }
    
    // Find activation token
    const tokenHash = hashToken(token)
    const activationToken = await prisma.activationToken.findUnique({
      where: { tokenHash },
      include: { admin: true },
    })
    
    if (!activationToken) {
      return NextResponse.json(
        { error: 'Lien d\'activation invalide ou expiré' },
        { status: 400 }
      )
    }
    
    // Check if token is expired
    if (new Date() > activationToken.expiresAt) {
      return NextResponse.json(
        { error: 'Lien d\'activation expiré. Contactez un administrateur.' },
        { status: 400 }
      )
    }
    
    // Check if token was already used
    if (activationToken.usedAt) {
      return NextResponse.json(
        { error: 'Ce lien a déjà été utilisé' },
        { status: 400 }
      )
    }
    
    // Check if admin is already active
    if (activationToken.admin.isActive) {
      return NextResponse.json(
        { error: 'Ce compte est déjà activé' },
        { status: 400 }
      )
    }
    
    // Hash the password
    const passwordHash = await hashPassword(password)
    
    // Update admin and mark token as used
    await prisma.$transaction([
      prisma.admin.update({
        where: { id: activationToken.adminId },
        data: {
          passwordHash,
          isActive: true,
          emailVerified: true,
        },
      }),
      prisma.activationToken.update({
        where: { id: activationToken.id },
        data: { usedAt: new Date() },
      }),
    ])
    
    // Log the event
    await logSecurityEvent({
      adminId: activationToken.adminId,
      eventType: 'ACCOUNT_ACTIVATED',
      ipAddress: ip,
      userAgent: userAgent || undefined,
      status: 'SUCCESS',
    })
    
    return NextResponse.json({
      success: true,
      message: 'Compte activé avec succès. Vous pouvez maintenant vous connecter.',
    })
    
  } catch (error) {
    console.error('Activation error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur. Veuillez réessayer.' },
      { status: 500 }
    )
  }
}

// GET to check if token is valid
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  
  if (!token) {
    return NextResponse.json(
      { error: 'Token manquant' },
      { status: 400 }
    )
  }
  
  try {
    const tokenHash = hashToken(token)
    const activationToken = await prisma.activationToken.findUnique({
      where: { tokenHash },
      include: {
        admin: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            company: true,
            isActive: true,
          },
        },
      },
    })
    
    if (!activationToken) {
      return NextResponse.json(
        { valid: false, error: 'Lien invalide' },
        { status: 400 }
      )
    }
    
    if (new Date() > activationToken.expiresAt) {
      return NextResponse.json(
        { valid: false, error: 'Lien expiré' },
        { status: 400 }
      )
    }
    
    if (activationToken.usedAt || activationToken.admin.isActive) {
      return NextResponse.json(
        { valid: false, error: 'Compte déjà activé' },
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      valid: true,
      admin: {
        email: activationToken.admin.email,
        firstName: activationToken.admin.firstName,
        lastName: activationToken.admin.lastName,
        company: activationToken.admin.company,
      },
    })
    
  } catch (error) {
    console.error('Token check error:', error)
    return NextResponse.json(
      { valid: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
