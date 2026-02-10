import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { prisma } from '../prisma'
import { hashToken, generateSecureToken, parseUserAgent, getGeoLocation } from './security'

// ============================================
// JWT CONFIGURATION
// ============================================

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
const JWT_EXPIRES_IN = '8h'
const REFRESH_TOKEN_EXPIRES_DAYS = 7

export interface JWTPayload {
  sub: string // admin ID
  email: string
  role: string
  company: string
  iat: number
  exp: number
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

// ============================================
// TOKEN GENERATION
// ============================================

export function generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: 'HS256',
  })
}

export function generateRefreshToken(): string {
  return generateSecureToken(64)
}

export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

// ============================================
// SESSION MANAGEMENT
// ============================================

export async function createSession(params: {
  adminId: string
  accessToken: string
  ipAddress: string
  userAgent: string | null
}): Promise<{ refreshToken: string; sessionId: string }> {
  const refreshToken = generateRefreshToken()
  const tokenHash = hashToken(params.accessToken)
  const deviceInfo = parseUserAgent(params.userAgent)
  const geoLocation = await getGeoLocation(params.ipAddress)
  
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS)
  
  const session = await prisma.adminSession.create({
    data: {
      adminId: params.adminId,
      tokenHash,
      refreshToken: hashToken(refreshToken),
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      location: geoLocation ? `${geoLocation.city}, ${geoLocation.country}` : null,
      device: deviceInfo.device,
      browser: deviceInfo.browser,
      expiresAt,
    },
  })
  
  return { refreshToken, sessionId: session.id }
}

export async function validateSession(accessToken: string): Promise<{
  isValid: boolean
  admin?: { id: string; email: string; role: string; company: string }
  sessionId?: string
}> {
  const payload = verifyAccessToken(accessToken)
  if (!payload) {
    return { isValid: false }
  }
  
  const tokenHash = hashToken(accessToken)
  const session = await prisma.adminSession.findFirst({
    where: {
      adminId: payload.sub,
      tokenHash,
      isActive: true,
      expiresAt: { gt: new Date() },
    },
    include: {
      admin: {
        select: {
          id: true,
          email: true,
          role: true,
          company: true,
          isActive: true,
        },
      },
    },
  })
  
  if (!session || !session.admin.isActive) {
    return { isValid: false }
  }
  
  // Update last activity
  await prisma.adminSession.update({
    where: { id: session.id },
    data: { lastActivity: new Date() },
  })
  
  return {
    isValid: true,
    admin: {
      id: session.admin.id,
      email: session.admin.email,
      role: session.admin.role,
      company: session.admin.company,
    },
    sessionId: session.id,
  }
}

export async function refreshSession(refreshToken: string, ipAddress: string, userAgent: string | null): Promise<{
  success: boolean
  accessToken?: string
  newRefreshToken?: string
  error?: string
}> {
  const hashedRefreshToken = hashToken(refreshToken)
  
  const session = await prisma.adminSession.findFirst({
    where: {
      refreshToken: hashedRefreshToken,
      isActive: true,
      expiresAt: { gt: new Date() },
    },
    include: {
      admin: {
        select: {
          id: true,
          email: true,
          role: true,
          company: true,
          isActive: true,
        },
      },
    },
  })
  
  if (!session || !session.admin.isActive) {
    return { success: false, error: 'Session invalide ou expirée' }
  }
  
  // Generate new tokens
  const newAccessToken = generateAccessToken({
    sub: session.admin.id,
    email: session.admin.email,
    role: session.admin.role,
    company: session.admin.company,
  })
  
  const newRefreshToken = generateRefreshToken()
  const newExpiresAt = new Date()
  newExpiresAt.setDate(newExpiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS)
  
  // Update session with new tokens
  await prisma.adminSession.update({
    where: { id: session.id },
    data: {
      tokenHash: hashToken(newAccessToken),
      refreshToken: hashToken(newRefreshToken),
      ipAddress,
      userAgent,
      lastActivity: new Date(),
      expiresAt: newExpiresAt,
    },
  })
  
  return {
    success: true,
    accessToken: newAccessToken,
    newRefreshToken,
  }
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await prisma.adminSession.update({
    where: { id: sessionId },
    data: { isActive: false },
  })
}

export async function invalidateAllSessions(adminId: string, exceptSessionId?: string): Promise<number> {
  const result = await prisma.adminSession.updateMany({
    where: {
      adminId,
      isActive: true,
      ...(exceptSessionId ? { id: { not: exceptSessionId } } : {}),
    },
    data: { isActive: false },
  })
  
  return result.count
}

export async function getActiveSessions(adminId: string) {
  return prisma.adminSession.findMany({
    where: {
      adminId,
      isActive: true,
      expiresAt: { gt: new Date() },
    },
    select: {
      id: true,
      ipAddress: true,
      location: true,
      device: true,
      browser: true,
      lastActivity: true,
      createdAt: true,
    },
    orderBy: { lastActivity: 'desc' },
  })
}

// ============================================
// COOKIE MANAGEMENT
// ============================================

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}

export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies()
  
  cookieStore.set('admin_access_token', accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 8 * 60 * 60, // 8 hours
  })
  
  cookieStore.set('admin_refresh_token', refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60,
  })
}

export async function clearAuthCookies() {
  const cookieStore = await cookies()
  
  cookieStore.delete('admin_access_token')
  cookieStore.delete('admin_refresh_token')
}

export async function getAccessTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('admin_access_token')?.value || null
}

export async function getRefreshTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('admin_refresh_token')?.value || null
}
