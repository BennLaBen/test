import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jwtVerify } from 'jose'

export const dynamic = 'force-dynamic'

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'lledo-industries-secret-key-2026'
)

// GET /api/v2/auth/session — Check if user is authenticated
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('session-token')?.value

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // Verify JWT
    const { payload } = await jwtVerify(token, JWT_SECRET)

    // Check session exists in DB and not expired
    const session = await prisma.session.findUnique({
      where: { sessionToken: token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            company: true,
          },
        },
      },
    })

    if (!session || session.expires < new Date()) {
      // Session expired or doesn't exist
      if (session) {
        await prisma.session.delete({ where: { id: session.id } })
      }
      const response = NextResponse.json({ authenticated: false }, { status: 401 })
      response.cookies.delete('session-token')
      return response
    }

    return NextResponse.json({
      authenticated: true,
      user: session.user,
    })
  } catch (error) {
    console.error('[API v2] GET /auth/session error:', error)
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
