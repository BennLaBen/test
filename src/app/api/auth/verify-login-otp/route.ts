import { NextRequest, NextResponse } from 'next/server'
import { verifyLoginOTP } from '@/lib/auth/client-auth'
import { z } from 'zod'

// POST /api/auth/verify-login-otp - Étape 2: vérifier le code OTP
const verifySchema = z.object({
  userId: z.string().min(1),
  code: z.string().length(6, 'Le code doit contenir 6 chiffres'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, code } = verifySchema.parse(body)

    const result = await verifyLoginOTP(userId, code)

    if (!result.valid) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      )
    }

    // OTP vérifié — le frontend peut maintenant appeler NextAuth signIn
    return NextResponse.json({
      success: true,
      verified: true,
      message: 'Code vérifié avec succès',
    })
  } catch (error) {
    console.error('Verify login OTP error:', error)
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
