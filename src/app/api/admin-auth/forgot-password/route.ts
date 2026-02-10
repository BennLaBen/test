import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateSecureToken, hashToken, logSecurityEvent } from '@/lib/auth/security'
import { z } from 'zod'

// Rate limiting for password reset requests
const resetAttempts = new Map<string, { count: number; resetAt: number }>()
const MAX_RESET_ATTEMPTS = 3
const WINDOW_MS = 60 * 60 * 1000 // 1 hour

function checkResetRateLimit(email: string): boolean {
  const now = Date.now()
  const key = email.toLowerCase()
  const record = resetAttempts.get(key)
  
  if (!record || now > record.resetAt) {
    resetAttempts.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  
  if (record.count >= MAX_RESET_ATTEMPTS) {
    return false
  }
  
  record.count++
  return true
}

const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide'),
})

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const userAgent = request.headers.get('user-agent')
  
  try {
    const body = await request.json()
    const validation = forgotPasswordSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }
    
    const { email } = validation.data
    const normalizedEmail = email.toLowerCase()
    
    // Rate limit check - always return same message to prevent enumeration
    if (!checkResetRateLimit(normalizedEmail)) {
      // Still return success to prevent enumeration
      return NextResponse.json({
        success: true,
        message: 'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.',
      })
    }
    
    // Find admin
    const admin = await prisma.admin.findUnique({
      where: { email: normalizedEmail },
    })
    
    // Always return same message to prevent email enumeration
    if (!admin || !admin.isActive) {
      await logSecurityEvent({
        eventType: 'PASSWORD_RESET_REQUEST',
        ipAddress: ip,
        userAgent: userAgent || undefined,
        status: 'FAILED',
        details: { email: normalizedEmail, reason: 'user_not_found' },
      })
      
      return NextResponse.json({
        success: true,
        message: 'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.',
      })
    }
    
    // Invalidate any existing reset tokens
    await prisma.passwordReset.updateMany({
      where: {
        adminId: admin.id,
        usedAt: null,
      },
      data: { usedAt: new Date() },
    })
    
    // Generate new reset token (valid for 1 hour)
    const resetToken = generateSecureToken(32)
    const tokenHash = hashToken(resetToken)
    
    await prisma.passwordReset.create({
      data: {
        adminId: admin.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    })
    
    // Log the event
    await logSecurityEvent({
      adminId: admin.id,
      eventType: 'PASSWORD_RESET_REQUEST',
      ipAddress: ip,
      userAgent: userAgent || undefined,
      status: 'SUCCESS',
    })
    
    // Generate reset URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const resetUrl = `${baseUrl}/admin/reset-password?token=${resetToken}`
    
    // TODO: Send password reset email
    console.log(`[DEV] Password reset URL for ${email}: ${resetUrl}`)
    
    return NextResponse.json({
      success: true,
      message: 'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.',
      // Only in dev mode
      ...(process.env.NODE_ENV === 'development' && { resetUrl }),
    })
    
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur. Veuillez réessayer.' },
      { status: 500 }
    )
  }
}
