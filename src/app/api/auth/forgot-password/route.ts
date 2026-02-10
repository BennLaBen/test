import { NextRequest, NextResponse } from 'next/server'
import { sendPasswordResetEmail } from '@/lib/auth/client-auth'
import { z } from 'zod'

// POST /api/auth/forgot-password - Envoyer un email de réinitialisation
export async function POST(request: NextRequest) {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(await request.json())

    await sendPasswordResetEmail(email)

    // Toujours retourner succès pour ne pas révéler si l'email existe
    return NextResponse.json({
      success: true,
      message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Email invalide' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
