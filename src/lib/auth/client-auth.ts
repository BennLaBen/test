import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email/mailer'
import {
  getEmailConfirmationTemplate,
  getClientLoginOTPTemplate,
  getClientPasswordResetTemplate,
  getClientPasswordChangedTemplate,
} from '@/lib/email/client-templates'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

const APP_URL = process.env.NEXTAUTH_URL || process.env.APP_URL || 'http://localhost:3000'
const BCRYPT_ROUNDS = 12

// ============================================
// EMAIL CONFIRMATION (inscription)
// ============================================

export async function createEmailConfirmationToken(userId: string): Promise<string> {
  // Invalider les anciens tokens
  await prisma.emailConfirmationToken.updateMany({
    where: { userId, used: false },
    data: { used: true },
  })

  const token = crypto.randomBytes(32).toString('hex')

  await prisma.emailConfirmationToken.create({
    data: {
      userId,
      token,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
    },
  })

  return token
}

export async function sendConfirmationEmail(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return false

  const token = await createEmailConfirmationToken(userId)
  const confirmUrl = `${APP_URL}/confirmer-email?token=${token}`

  const template = getEmailConfirmationTemplate({
    firstName: user.firstName,
    confirmUrl,
    expiresIn: '24 heures',
  })

  return sendEmail({
    to: user.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  })
}

export async function verifyEmailConfirmationToken(token: string): Promise<{ valid: boolean; error?: string }> {
  const record = await prisma.emailConfirmationToken.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!record) return { valid: false, error: 'Token invalide' }
  if (record.used) return { valid: false, error: 'Ce lien a déjà été utilisé' }
  if (record.expires < new Date()) return { valid: false, error: 'Ce lien a expiré' }

  // Marquer le token comme utilisé et vérifier l'email
  await prisma.$transaction([
    prisma.emailConfirmationToken.update({
      where: { id: record.id },
      data: { used: true },
    }),
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: new Date() },
    }),
  ])

  return { valid: true }
}

// ============================================
// LOGIN OTP (à chaque connexion client)
// ============================================

export async function createAndSendLoginOTP(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return false

  // Invalider les anciens OTP
  await prisma.clientLoginOTP.updateMany({
    where: { userId, used: false },
    data: { used: true },
  })

  // Générer un code à 6 chiffres
  const code = Math.floor(100000 + Math.random() * 900000).toString()

  await prisma.clientLoginOTP.create({
    data: {
      userId,
      code,
      expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    },
  })

  const template = getClientLoginOTPTemplate({
    firstName: user.firstName,
    code,
    expiresIn: '10 minutes',
  })

  return sendEmail({
    to: user.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  })
}

export async function verifyLoginOTP(userId: string, code: string): Promise<{ valid: boolean; error?: string }> {
  const record = await prisma.clientLoginOTP.findFirst({
    where: {
      userId,
      code,
      used: false,
      expires: { gt: new Date() },
    },
  })

  if (!record) return { valid: false, error: 'Code incorrect ou expiré' }

  await prisma.clientLoginOTP.update({
    where: { id: record.id },
    data: { used: true },
  })

  return { valid: true }
}

// ============================================
// PASSWORD RESET (mot de passe oublié)
// ============================================

export async function sendPasswordResetEmail(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  if (!user) return true // Ne pas révéler si l'email existe

  // Invalider les anciens tokens
  await prisma.clientPasswordReset.updateMany({
    where: { userId: user.id, used: false },
    data: { used: true },
  })

  const token = crypto.randomBytes(32).toString('hex')

  await prisma.clientPasswordReset.create({
    data: {
      userId: user.id,
      token,
      expires: new Date(Date.now() + 60 * 60 * 1000), // 1h
    },
  })

  const resetUrl = `${APP_URL}/reinitialiser-mot-de-passe?token=${token}`

  const template = getClientPasswordResetTemplate({
    firstName: user.firstName,
    resetUrl,
    expiresIn: '1 heure',
  })

  return sendEmail({
    to: user.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  })
}

export async function verifyPasswordResetToken(token: string): Promise<{ valid: boolean; userId?: string; error?: string }> {
  const record = await prisma.clientPasswordReset.findUnique({
    where: { token },
  })

  if (!record) return { valid: false, error: 'Token invalide' }
  if (record.used) return { valid: false, error: 'Ce lien a déjà été utilisé' }
  if (record.expires < new Date()) return { valid: false, error: 'Ce lien a expiré' }

  return { valid: true, userId: record.userId }
}

export async function resetPassword(token: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  const verification = await verifyPasswordResetToken(token)
  if (!verification.valid || !verification.userId) {
    return { success: false, error: verification.error }
  }

  const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_ROUNDS)

  await prisma.$transaction([
    prisma.clientPasswordReset.update({
      where: { token },
      data: { used: true },
    }),
    prisma.user.update({
      where: { id: verification.userId },
      data: { password: hashedPassword },
    }),
  ])

  // Envoyer email de confirmation de changement
  const user = await prisma.user.findUnique({ where: { id: verification.userId } })
  if (user) {
    const template = getClientPasswordChangedTemplate({ firstName: user.firstName })
    await sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
  }

  return { success: true }
}

// ============================================
// CHANGE PASSWORD (depuis le compte)
// ============================================

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return { success: false, error: 'Utilisateur non trouvé' }

  const isValid = await bcrypt.compare(currentPassword, user.password)
  if (!isValid) return { success: false, error: 'Mot de passe actuel incorrect' }

  const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_ROUNDS)

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  })

  const template = getClientPasswordChangedTemplate({ firstName: user.firstName })
  await sendEmail({
    to: user.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  })

  return { success: true }
}
