import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limiter
const ratelimit = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(
  request: NextRequest,
  limit: number = 10,
  window: number = 60000
): { success: boolean; remaining: number } {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()
  
  const record = ratelimit.get(ip)
  
  if (!record || now > record.resetTime) {
    ratelimit.set(ip, { count: 1, resetTime: now + window })
    return { success: true, remaining: limit - 1 }
  }
  
  if (record.count < limit) {
    record.count++
    return { success: true, remaining: limit - record.count }
  }
  
  return { success: false, remaining: 0 }
}

export function rateLimitResponse(remaining: number) {
  return NextResponse.json(
    { error: 'Trop de requêtes. Veuillez réessayer dans quelques instants.' },
    { 
      status: 429,
      headers: {
        'X-RateLimit-Remaining': remaining.toString(),
        'Retry-After': '60',
      }
    }
  )
}
