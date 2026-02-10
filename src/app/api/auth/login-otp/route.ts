import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { createAndSendLoginOTP, verifyLoginOTP } from '@/lib/auth/client-auth'
import { z } from 'zod'

// POST /api/auth/login-otp - Étape 1: vérifier email/password et envoyer OTP
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    // Vérifier que l'email est confirmé
    if (!user.emailVerified) {
      return NextResponse.json(
        { success: false, error: 'Veuillez confirmer votre adresse email avant de vous connecter.', needsConfirmation: true },
        { status: 403 }
      )
    }

    // Vérifier le mot de passe
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    // Envoyer le code OTP par email
    const sent = await createAndSendLoginOTP(user.id)
    if (!sent) {
      return NextResponse.json(
        { success: false, error: 'Erreur lors de l\'envoi du code de vérification' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      requiresOTP: true,
      userId: user.id,
      message: 'Un code de vérification a été envoyé à votre adresse email.',
    })
  } catch (error) {
    console.error('Login OTP error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
