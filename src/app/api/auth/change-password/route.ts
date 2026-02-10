import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { changePassword } from '@/lib/auth/client-auth'
import { z } from 'zod'

// POST /api/auth/change-password - Changer le mot de passe (utilisateur connecté)
const changeSchema = z.object({
  currentPassword: z.string().min(1, 'Mot de passe actuel requis'),
  newPassword: z.string().min(6, 'Le nouveau mot de passe doit contenir au moins 6 caractères'),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { currentPassword, newPassword } = changeSchema.parse(body)

    const result = await changePassword(session.user.id, currentPassword, newPassword)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Mot de passe modifié avec succès. Un email de confirmation a été envoyé.',
    })
  } catch (error) {
    console.error('Change password error:', error)
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
