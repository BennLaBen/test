import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'

export const dynamic = 'force-dynamic'

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'lledo-industries-secret-key-2026'
)

// POST /api/v2/auth/login — Secure login with bcrypt + JWT session in DB
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        role: true,
        company: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 })
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 })
    }

    // Generate JWT token (expires in 7 days)
    const token = await new SignJWT({ userId: user.id, email: user.email, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET)

    // Create session in DB
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const session = await prisma.session.create({
      data: {
        sessionToken: token,
        userId: user.id,
        expires: expiresAt,
      },
    })

    // Set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        company: user.company,
      },
    })

    response.cookies.set('session-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    console.log(`[auth] ✅ User logged in: ${user.email}`)

    // Send login notification email for ADMIN users (async, don't block response)
    if (user.role === 'ADMIN') {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'IP inconnue'
      const ua = request.headers.get('user-agent') || ''
      const now = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris', dateStyle: 'full', timeStyle: 'short' })

      // Parse user-agent for device/browser
      const browser = ua.includes('Edg/') ? 'Microsoft Edge'
        : ua.includes('Chrome/') ? 'Google Chrome'
        : ua.includes('Firefox/') ? 'Mozilla Firefox'
        : ua.includes('Safari/') ? 'Safari'
        : 'Navigateur inconnu'
      const device = ua.includes('Mobile') ? 'Mobile' : ua.includes('Tablet') ? 'Tablette' : 'Ordinateur'

      sendLoginNotification(user.email, user.firstName, now, ip, browser, device).catch(err =>
        console.error('[auth] Failed to send login notification email:', err)
      )
    }

    return response
  } catch (error) {
    console.error('[API v2] POST /auth/login error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

async function sendLoginNotification(email: string, firstName: string, datetime: string, ip: string, browser: string, device: string) {
  const { sendEmail } = await import('@/lib/email/mailer')
  const { getNewLoginEmail } = await import('@/lib/email/templates')

  const template = getNewLoginEmail({
    firstName,
    datetime,
    city: 'Non disponible',
    country: 'France',
    device,
    browser,
    ip,
    viewSessionsUrl: 'https://www.lledo-industries.com/admin',
  })

  await sendEmail({ to: email, subject: template.subject, html: template.html, text: template.text })
  console.log(`[auth] 📧 Login notification sent to ${email}`)
}
