import { NextRequest, NextResponse } from 'next/server'
import { verifyPasswordResetToken, resetPassword } from '@/lib/auth/client-auth'
import { z } from 'zod'

// GET /api/auth/reset-password?token=xxx - Vérifier la validité du token
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.json(
      { success: false, error: 'Token manquant' },
      { status: 400 }
    )
  }

  const result = await verifyPasswordResetToken(token)

  return NextResponse.json({
    success: result.valid,
    error: result.error,
  })
}

// POST /api/auth/reset-password - Réinitialiser le mot de passe
const resetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = resetSchema.parse(body)

    const result = await resetPassword(token, password)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.',
    })
  } catch (error) {
    console.error('Reset password error:', error)
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
