import * as otplib from 'otplib'
import QRCode from 'qrcode'
import { encrypt, decrypt, generateOTP, hashToken, generateBackupCodes } from './security'
import { prisma } from '../prisma'

// ============================================
// TOTP (Time-based One-Time Password)
// Compatible with Google Authenticator, Authy, etc.
// ============================================

const TOTP_ISSUER = 'LLEDO Industries Admin'

export interface TOTPSetup {
  secret: string
  otpauthUrl: string
  qrCodeDataUrl: string
}

export async function generateTOTPSecret(email: string): Promise<TOTPSetup> {
  const secret = otplib.generateSecret()
  const otpauthUrl = otplib.generateURI({
    issuer: TOTP_ISSUER,
    label: email,
    secret,
    algorithm: 'sha1',
    digits: 6,
    period: 30,
  })
  
  const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl, {
    width: 256,
    margin: 2,
    color: {
      dark: '#0047FF',
      light: '#FFFFFF',
    },
  })
  
  return {
    secret,
    otpauthUrl,
    qrCodeDataUrl,
  }
}

export async function verifyTOTP(secret: string, token: string): Promise<boolean> {
  try {
    const result = await otplib.verify({ token, secret })
    return result.valid
  } catch {
    return false
  }
}

export async function enableTOTP(adminId: string, secret: string): Promise<string[]> {
  const encryptedSecret = encrypt(secret)
  const backupCodes = generateBackupCodes(10)
  const hashedBackupCodes = backupCodes.map(code => hashToken(code))
  
  await prisma.admin.update({
    where: { id: adminId },
    data: {
      twoFactorEnabled: true,
      twoFactorSecret: encryptedSecret,
      twoFactorMethod: 'TOTP',
      backupCodes: hashedBackupCodes,
    },
  })
  
  return backupCodes
}

export async function disableTOTP(adminId: string): Promise<void> {
  await prisma.admin.update({
    where: { id: adminId },
    data: {
      twoFactorEnabled: false,
      twoFactorSecret: null,
      twoFactorMethod: null,
      backupCodes: [],
    },
  })
}

export function decryptTOTPSecret(encryptedSecret: string): string {
  return decrypt(encryptedSecret)
}

// ============================================
// EMAIL OTP
// ============================================

const EMAIL_OTP_EXPIRY = 10 * 60 * 1000 // 10 minutes
const MAX_OTP_ATTEMPTS = 5

export async function createEmailOTP(adminId: string): Promise<string> {
  // Invalidate any existing OTPs
  await prisma.emailOTP.deleteMany({
    where: { adminId },
  })
  
  const code = generateOTP()
  const hashedCode = hashToken(code)
  
  await prisma.emailOTP.create({
    data: {
      adminId,
      code: hashedCode,
      expiresAt: new Date(Date.now() + EMAIL_OTP_EXPIRY),
    },
  })
  
  return code
}

export async function verifyEmailOTP(adminId: string, code: string): Promise<{
  isValid: boolean
  error?: string
}> {
  const otp = await prisma.emailOTP.findFirst({
    where: {
      adminId,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  })
  
  if (!otp) {
    return { isValid: false, error: 'Code expiré ou invalide' }
  }
  
  if (otp.attempts >= MAX_OTP_ATTEMPTS) {
    await prisma.emailOTP.delete({ where: { id: otp.id } })
    return { isValid: false, error: 'Trop de tentatives. Demandez un nouveau code.' }
  }
  
  const hashedCode = hashToken(code)
  
  if (hashedCode !== otp.code) {
    await prisma.emailOTP.update({
      where: { id: otp.id },
      data: { attempts: otp.attempts + 1 },
    })
    return { isValid: false, error: 'Code incorrect' }
  }
  
  // Mark as used
  await prisma.emailOTP.update({
    where: { id: otp.id },
    data: { usedAt: new Date() },
  })
  
  return { isValid: true }
}

// ============================================
// BACKUP CODES
// ============================================

export async function verifyBackupCode(adminId: string, code: string): Promise<boolean> {
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    select: { backupCodes: true },
  })
  
  if (!admin || admin.backupCodes.length === 0) {
    return false
  }
  
  const hashedCode = hashToken(code.toUpperCase().replace('-', ''))
  const codeIndex = admin.backupCodes.findIndex(bc => bc === hashedCode)
  
  if (codeIndex === -1) {
    // Try with the original format
    const hashedCodeWithDash = hashToken(code.toUpperCase())
    const codeIndexAlt = admin.backupCodes.findIndex(bc => bc === hashedCodeWithDash)
    
    if (codeIndexAlt === -1) {
      return false
    }
    
    // Remove used code
    const updatedCodes = [...admin.backupCodes]
    updatedCodes.splice(codeIndexAlt, 1)
    
    await prisma.admin.update({
      where: { id: adminId },
      data: { backupCodes: updatedCodes },
    })
    
    return true
  }
  
  // Remove used code
  const updatedCodes = [...admin.backupCodes]
  updatedCodes.splice(codeIndex, 1)
  
  await prisma.admin.update({
    where: { id: adminId },
    data: { backupCodes: updatedCodes },
  })
  
  return true
}

export async function regenerateBackupCodes(adminId: string): Promise<string[]> {
  const backupCodes = generateBackupCodes(10)
  const hashedBackupCodes = backupCodes.map(code => hashToken(code))
  
  await prisma.admin.update({
    where: { id: adminId },
    data: { backupCodes: hashedBackupCodes },
  })
  
  return backupCodes
}

export async function getBackupCodesCount(adminId: string): Promise<number> {
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    select: { backupCodes: true },
  })
  
  return admin?.backupCodes.length || 0
}
