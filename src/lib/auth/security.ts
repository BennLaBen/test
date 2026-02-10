import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { prisma } from '../prisma'
import type { Admin, SecurityEvent, SecurityStatus } from '@prisma/client'

// ============================================
// PASSWORD SECURITY
// ============================================

const BCRYPT_ROUNDS = 12
const COMMON_PASSWORDS = [
  'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', 'master',
  'dragon', 'letmein', 'login', 'admin', 'welcome', 'passw0rd', 'password1',
  'lledo', 'mpeb', 'aerotools', 'industries'
]

export interface PasswordValidation {
  isValid: boolean
  errors: string[]
  strength: 'weak' | 'medium' | 'strong'
}

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = []
  
  if (password.length < 12) {
    errors.push('Le mot de passe doit contenir au moins 12 caractères')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule')
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre')
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*)')
  }
  
  const lowerPassword = password.toLowerCase()
  if (COMMON_PASSWORDS.some(common => lowerPassword.includes(common))) {
    errors.push('Le mot de passe contient des mots trop communs')
  }
  
  // Calculate strength
  let strength: 'weak' | 'medium' | 'strong' = 'weak'
  const strengthScore = [
    password.length >= 12,
    password.length >= 16,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    password.length >= 20,
  ].filter(Boolean).length
  
  if (strengthScore >= 6) strength = 'strong'
  else if (strengthScore >= 4) strength = 'medium'
  
  return {
    isValid: errors.length === 0,
    errors,
    strength,
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// ============================================
// TOKEN GENERATION
// ============================================

export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex')
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = []
  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase()
    codes.push(`${code.slice(0, 4)}-${code.slice(4)}`)
  }
  return codes
}

// ============================================
// ACCOUNT LOCKING
// ============================================

const MAX_LOGIN_ATTEMPTS = 5
const LOCK_DURATION_30_MIN = 30 * 60 * 1000
const LOCK_DURATION_24_HOURS = 24 * 60 * 60 * 1000

export async function handleFailedLogin(adminId: string): Promise<{
  isLocked: boolean
  lockDuration: number | null
  attempts: number
}> {
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    select: { loginAttempts: true, lockedUntil: true },
  })
  
  if (!admin) {
    return { isLocked: false, lockDuration: null, attempts: 0 }
  }
  
  const newAttempts = admin.loginAttempts + 1
  let lockedUntil: Date | null = null
  let lockDuration: number | null = null
  
  if (newAttempts >= 10) {
    lockedUntil = new Date(Date.now() + LOCK_DURATION_24_HOURS)
    lockDuration = LOCK_DURATION_24_HOURS
  } else if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
    lockedUntil = new Date(Date.now() + LOCK_DURATION_30_MIN)
    lockDuration = LOCK_DURATION_30_MIN
  }
  
  await prisma.admin.update({
    where: { id: adminId },
    data: {
      loginAttempts: newAttempts,
      lockedUntil,
    },
  })
  
  return {
    isLocked: lockedUntil !== null,
    lockDuration,
    attempts: newAttempts,
  }
}

export async function resetLoginAttempts(adminId: string): Promise<void> {
  await prisma.admin.update({
    where: { id: adminId },
    data: {
      loginAttempts: 0,
      lockedUntil: null,
    },
  })
}

export async function isAccountLocked(admin: Admin): Promise<boolean> {
  if (!admin.lockedUntil) return false
  
  if (new Date() > admin.lockedUntil) {
    await resetLoginAttempts(admin.id)
    return false
  }
  
  return true
}

// ============================================
// SECURITY LOGGING
// ============================================

export async function logSecurityEvent(params: {
  adminId?: string
  eventType: SecurityEvent
  ipAddress?: string
  userAgent?: string
  location?: string
  status: SecurityStatus
  details?: Record<string, unknown>
}): Promise<void> {
  await prisma.securityLog.create({
    data: {
      adminId: params.adminId,
      eventType: params.eventType,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      location: params.location,
      status: params.status,
      details: params.details as any,
    },
  })
}

// ============================================
// GEO IP DETECTION
// ============================================

export interface GeoLocation {
  city?: string
  country?: string
  countryCode?: string
  region?: string
}

export async function getGeoLocation(ip: string): Promise<GeoLocation | null> {
  if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return { city: 'Local', country: 'Development', countryCode: 'DEV' }
  }
  
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      signal: AbortSignal.timeout(3000),
    })
    
    if (!response.ok) return null
    
    const data = await response.json()
    return {
      city: data.city,
      country: data.country_name,
      countryCode: data.country_code,
      region: data.region,
    }
  } catch {
    return null
  }
}

// ============================================
// DEVICE DETECTION
// ============================================

export interface DeviceInfo {
  device: string
  browser: string
  os: string
}

export function parseUserAgent(userAgent: string | null): DeviceInfo {
  if (!userAgent) {
    return { device: 'Unknown', browser: 'Unknown', os: 'Unknown' }
  }
  
  let device = 'Desktop'
  if (/mobile/i.test(userAgent)) device = 'Mobile'
  else if (/tablet|ipad/i.test(userAgent)) device = 'Tablet'
  
  let browser = 'Unknown'
  if (/chrome/i.test(userAgent) && !/edge/i.test(userAgent)) browser = 'Chrome'
  else if (/firefox/i.test(userAgent)) browser = 'Firefox'
  else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) browser = 'Safari'
  else if (/edge/i.test(userAgent)) browser = 'Edge'
  else if (/opera|opr/i.test(userAgent)) browser = 'Opera'
  
  let os = 'Unknown'
  if (/windows/i.test(userAgent)) os = 'Windows'
  else if (/macintosh|mac os/i.test(userAgent)) os = 'macOS'
  else if (/linux/i.test(userAgent)) os = 'Linux'
  else if (/android/i.test(userAgent)) os = 'Android'
  else if (/iphone|ipad|ipod/i.test(userAgent)) os = 'iOS'
  
  return { device, browser, os }
}

// ============================================
// ENCRYPTION FOR 2FA SECRETS
// ============================================

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex')
const IV_LENGTH = 16

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH)
  const key = Buffer.from(ENCRYPTION_KEY.slice(0, 32), 'utf-8')
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return iv.toString('hex') + ':' + encrypted
}

export function decrypt(encryptedText: string): string {
  const [ivHex, encrypted] = encryptedText.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const key = Buffer.from(ENCRYPTION_KEY.slice(0, 32), 'utf-8')
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}
