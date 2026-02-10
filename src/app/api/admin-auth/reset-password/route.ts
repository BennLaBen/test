import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashToken, hashPassword, validatePassword, logSecurityEvent } from '@/lib/auth/security'
import { invalidateAllSessions } from '@/lib/auth/jwt'
import { z } from 'zod'

const resetPasswordSchema = z.object({
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
    const validation = resetPasswordSchema.safeParse(body)
    
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
    
    // Find reset token
    const tokenHash = hashToken(token)
    const resetToken = await prisma.passwordReset.findUnique({
      where: { tokenHash },
      include: { admin: true },
    })
    
    if (!resetToken) {
      return NextResponse.json(
        { error: 'Lien de réinitialisation invalide ou expiré' },
        { status: 400 }
      )
    }
    
    // Check if token is expired
    if (new Date() > resetToken.expiresAt) {
      return NextResponse.json(
        { error: 'Lien de réinitialisation expiré. Demandez un nouveau lien.' },
        { status: 400 }
      )
    }
    
    // Check if token was already used
    if (resetToken.usedAt) {
      return NextResponse.json(
        { error: 'Ce lien a déjà été utilisé' },
        { status: 400 }
      )
    }
    
    // Hash the new password
    const passwordHash = await hashPassword(password)
    
    // Update admin password and mark token as used
    await prisma.$transaction([
      prisma.admin.update({
        where: { id: resetToken.adminId },
        data: { passwordHash },
      }),
      prisma.passwordReset.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
    ])
    
    // Invalidate all active sessions for security
    const invalidatedCount = await invalidateAllSessions(resetToken.adminId)
    
    // Log the event
    await logSecurityEvent({
      adminId: resetToken.adminId,
      eventType: 'PASSWORD_RESET_COMPLETE',
      ipAddress: ip,
      userAgent: userAgent || undefined,
      status: 'SUCCESS',
      details: { sessionsInvalidated: invalidatedCount },
    })
    
    // TODO: Send confirmation email if notifications enabled
    if (resetToken.admin.notifyPasswordChange) {
      console.log(`[DEV] Password changed notification for ${resetToken.admin.email}`)
    }
    
    return NextResponse.json({
      success: true,
      message: 'Mot de passe modifié avec succès. Toutes vos sessions ont été déconnectées.',
    })
    
  } catch (error) {
    console.error('Reset password error:', error)
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
      { valid: false, error: 'Token manquant' },
      { status: 400 }
    )
  }
  
  try {
    const tokenHash = hashToken(token)
    const resetToken = await prisma.passwordReset.findUnique({
      where: { tokenHash },
      include: {
        admin: {
          select: { email: true, firstName: true },
        },
      },
    })
    
    if (!resetToken) {
      return NextResponse.json(
        { valid: false, error: 'Lien invalide' },
        { status: 400 }
      )
    }
    
    if (new Date() > resetToken.expiresAt) {
      return NextResponse.json(
        { valid: false, error: 'Lien expiré' },
        { status: 400 }
      )
    }
    
    if (resetToken.usedAt) {
      return NextResponse.json(
        { valid: false, error: 'Lien déjà utilisé' },
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      valid: true,
      email: resetToken.admin.email,
    })
    
  } catch (error) {
    console.error('Token check error:', error)
    return NextResponse.json(
      { valid: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
