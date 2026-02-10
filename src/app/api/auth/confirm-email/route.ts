import { NextRequest, NextResponse } from 'next/server'
import { verifyEmailConfirmationToken, sendConfirmationEmail } from '@/lib/auth/client-auth'
import { prisma } from '@/lib/prisma'

// GET /api/auth/confirm-email?token=xxx - Vérifier le token de confirmation
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.json(
      { success: false, error: 'Token manquant' },
      { status: 400 }
    )
  }

  const result = await verifyEmailConfirmationToken(token)

  if (!result.valid) {
    return NextResponse.json(
      { success: false, error: result.error },
      { status: 400 }
    )
  }

  return NextResponse.json({
    success: true,
    message: 'Adresse email confirmée avec succès',
  })
}

// POST /api/auth/confirm-email - Renvoyer l'email de confirmation
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email requis' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })

    if (!user) {
      // Ne pas révéler si l'email existe
      return NextResponse.json({
        success: true,
        message: 'Si un compte existe avec cet email, un lien de confirmation a été envoyé.',
      })
    }

    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        message: 'Votre adresse email est déjà confirmée.',
      })
    }

    await sendConfirmationEmail(user.id)

    return NextResponse.json({
      success: true,
      message: 'Si un compte existe avec cet email, un lien de confirmation a été envoyé.',
    })
  } catch (error) {
    console.error('Resend confirmation error:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
