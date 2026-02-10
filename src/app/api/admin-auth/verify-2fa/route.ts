import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logSecurityEvent, getGeoLocation } from '@/lib/auth/security'
import { generateAccessToken, createSession, setAuthCookies } from '@/lib/auth/jwt'
import { verifyTOTP, decryptTOTPSecret, verifyEmailOTP, verifyBackupCode } from '@/lib/auth/two-factor'
import { z } from 'zod'

const verify2FASchema = z.object({
  tempToken: z.string(),
  code: z.string().min(6).max(10),
  isBackupCode: z.boolean().optional().default(false),
})

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('x-real-ip') || 
             'unknown'
  const userAgent = request.headers.get('user-agent')
  
  try {
    const body = await request.json()
    const validation = verify2FASchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }
    
    const { tempToken, code, isBackupCode } = validation.data
    
    // Decode temp token to get admin ID
    let adminId: string
    let tokenTimestamp: number
    
    try {
      const decoded = Buffer.from(tempToken, 'base64').toString('utf-8')
      const [id, timestamp] = decoded.split(':')
      adminId = id
      tokenTimestamp = parseInt(timestamp, 10)
    } catch {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 400 }
      )
    }
    
    // Check if temp token is expired (5 minutes max)
    if (Date.now() - tokenTimestamp > 5 * 60 * 1000) {
      return NextResponse.json(
        { error: 'Session expirée. Veuillez vous reconnecter.' },
        { status: 401 }
      )
    }
    
    // Get admin
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    })
    
    if (!admin || !admin.twoFactorEnabled) {
      return NextResponse.json(
        { error: 'Authentification invalide' },
        { status: 401 }
      )
    }
    
    let isValid = false
    
    // Verify based on method
    if (isBackupCode) {
      isValid = await verifyBackupCode(adminId, code)
      
      if (isValid) {
        await logSecurityEvent({
          adminId,
          eventType: 'TWO_FACTOR_VERIFIED',
          ipAddress: ip,
          userAgent: userAgent || undefined,
          status: 'SUCCESS',
          details: { method: 'backup_code' },
        })
      }
    } else if (admin.twoFactorMethod === 'TOTP' && admin.twoFactorSecret) {
      const secret = decryptTOTPSecret(admin.twoFactorSecret)
      isValid = await verifyTOTP(secret, code)
    } else if (admin.twoFactorMethod === 'EMAIL') {
      const result = await verifyEmailOTP(adminId, code)
      isValid = result.isValid
      
      if (!isValid) {
        return NextResponse.json(
          { error: result.error || 'Code incorrect' },
          { status: 401 }
        )
      }
    }
    
    if (!isValid) {
      await logSecurityEvent({
        adminId,
        eventType: 'TWO_FACTOR_VERIFIED',
        ipAddress: ip,
        userAgent: userAgent || undefined,
        status: 'FAILED',
        details: { method: isBackupCode ? 'backup_code' : admin.twoFactorMethod },
      })
      
      return NextResponse.json(
        { error: 'Code incorrect' },
        { status: 401 }
      )
    }
    
    // 2FA verified - Generate tokens and create session
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
      details: { with2FA: true, method: admin.twoFactorMethod },
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
      maxAge: 8 * 60 * 60,
    })

    response.cookies.set('admin_refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
    
  } catch (error) {
    console.error('2FA verification error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur. Veuillez réessayer.' },
      { status: 500 }
    )
  }
}
