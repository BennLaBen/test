import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  verifyPassword,
  isAccountLocked,
  handleFailedLogin,
  resetLoginAttempts,
  logSecurityEvent,
  getGeoLocation,
  parseUserAgent,
} from '@/lib/auth/security'
import { generateAccessToken, createSession, setAuthCookies } from '@/lib/auth/jwt'
import { createEmailOTP } from '@/lib/auth/two-factor'
import { z } from 'zod'

// Rate limiting - simple in-memory for demo, use Redis in production
const loginAttempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS_PER_IP = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const record = loginAttempts.get(ip)
  
  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true }
  }
  
  if (record.count >= MAX_ATTEMPTS_PER_IP) {
    return { allowed: false, retryAfter: Math.ceil((record.resetAt - now) / 1000) }
  }
  
  record.count++
  return { allowed: true }
}

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('x-real-ip') || 
             'unknown'
  const userAgent = request.headers.get('user-agent')
  
  // Rate limiting check
  const rateLimit = checkRateLimit(ip)
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Trop de tentatives. Réessayez plus tard.', retryAfter: rateLimit.retryAfter },
      { status: 429 }
    )
  }
  
  try {
    const body = await request.json()
    const validation = loginSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }
    
    const { email, password } = validation.data
    
    // Find admin
    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
    })
    
    // Generic error to prevent email enumeration
    if (!admin || !admin.passwordHash) {
      await logSecurityEvent({
        eventType: 'FAILED_LOGIN',
        ipAddress: ip,
        userAgent: userAgent || undefined,
        status: 'FAILED',
        details: { email, reason: 'user_not_found' },
      })
      
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }
    
    // Check if account is locked
    if (await isAccountLocked(admin)) {
      const lockRemaining = admin.lockedUntil 
        ? Math.ceil((admin.lockedUntil.getTime() - Date.now()) / 60000)
        : 30
      
      return NextResponse.json(
        { 
          error: `Compte temporairement bloqué. Réessayez dans ${lockRemaining} minutes.`,
          locked: true,
        },
        { status: 423 }
      )
    }
    
    // Check if account is active
    if (!admin.isActive) {
      return NextResponse.json(
        { error: 'Compte non activé. Vérifiez votre email.' },
        { status: 403 }
      )
    }
    
    // Verify password
    const isValidPassword = await verifyPassword(password, admin.passwordHash)
    
    if (!isValidPassword) {
      const lockResult = await handleFailedLogin(admin.id)
      
      await logSecurityEvent({
        adminId: admin.id,
        eventType: 'FAILED_LOGIN',
        ipAddress: ip,
        userAgent: userAgent || undefined,
        status: lockResult.isLocked ? 'BLOCKED' : 'FAILED',
        details: { attempts: lockResult.attempts },
      })
      
      if (lockResult.isLocked) {
        // Send notification email if enabled
        if (admin.notifyFailedLogin) {
          // TODO: Send email notification
        }
        
        return NextResponse.json(
          { 
            error: 'Trop de tentatives. Compte bloqué temporairement.',
            locked: true,
          },
          { status: 423 }
        )
      }
      
      return NextResponse.json(
        { 
          error: 'Email ou mot de passe incorrect',
          attemptsRemaining: MAX_ATTEMPTS_PER_IP - lockResult.attempts,
        },
        { status: 401 }
      )
    }
    
    // Reset login attempts on successful password
    await resetLoginAttempts(admin.id)
    
    // Check if 2FA is enabled
    if (admin.twoFactorEnabled) {
      // Generate temporary token for 2FA step
      const tempToken = Buffer.from(`${admin.id}:${Date.now()}`).toString('base64')
      
      // If email OTP is the method, send the code
      if (admin.twoFactorMethod === 'EMAIL') {
        const otp = await createEmailOTP(admin.id)
        const { sendEmail } = await import('@/lib/email/mailer')
        const { getEmailOTPEmail } = await import('@/lib/email/templates')
        const template = getEmailOTPEmail({
          firstName: admin.firstName,
          code: otp,
          expiresIn: '10 minutes',
        })
        await sendEmail({
          to: admin.email,
          subject: template.subject,
          html: template.html,
          text: template.text,
        })
      }
      
      return NextResponse.json({
        requires2FA: true,
        method: admin.twoFactorMethod,
        tempToken,
        message: admin.twoFactorMethod === 'EMAIL' 
          ? 'Code envoyé par email'
          : 'Entrez le code de votre application d\'authentification',
      })
    }
    
    // No 2FA - Generate tokens and create session
    const accessToken = generateAccessToken({
      sub: admin.id,
      email: admin.email,
      role: admin.role,
      company: admin.company,
    })
    
    const { refreshToken } = await createSession({
      adminId: admin.id,
      accessToken,
      ipAddress: ip,
      userAgent,
    })
    
    // Update last login
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() },
    })
    
    // Log successful login
    const geoLocation = await getGeoLocation(ip)
    await logSecurityEvent({
      adminId: admin.id,
      eventType: 'LOGIN',
      ipAddress: ip,
      userAgent: userAgent || undefined,
      location: geoLocation ? `${geoLocation.city}, ${geoLocation.country}` : undefined,
      status: 'SUCCESS',
    })
    
    // Build response with cookies set directly on NextResponse
    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        company: admin.company,
        role: admin.role,
      },
    })

    const isProduction = process.env.NODE_ENV === 'production'
    
    response.cookies.set('admin_access_token', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 8 * 60 * 60, // 8 hours
    })

    response.cookies.set('admin_refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
    
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur. Veuillez réessayer.' },
      { status: 500 }
    )
  }
}
