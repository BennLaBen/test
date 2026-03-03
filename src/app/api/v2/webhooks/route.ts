import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

// In-memory webhook registry (in production, store in DB)
// For now we use a simple approach; will be migrated to a Prisma model later
const webhookStore: Map<string, { id: string; url: string; events: string[]; secret: string; active: boolean; createdAt: Date }> = new Map()

const VALID_EVENTS = [
  'quote.created',
  'quote.status_changed',
  'order.created',
  'order.status_changed',
  'order.shipped',
  'order.delivered',
  'product.created',
  'product.updated',
  'product.deleted',
  'stock.low',
  'stock.out',
]

// GET /api/v2/webhooks — List registered webhooks
export async function GET() {
  try {
    const hooks = Array.from(webhookStore.values()).map(h => ({
      id: h.id,
      url: h.url,
      events: h.events,
      active: h.active,
      createdAt: h.createdAt,
    }))
    return NextResponse.json({ success: true, data: hooks })
  } catch (error) {
    console.error('[API v2] GET /webhooks error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST /api/v2/webhooks — Register a new webhook
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, events, secret } = body

    if (!url || !events || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ error: 'url et events[] requis' }, { status: 400 })
    }

    // Validate URL
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: 'URL invalide' }, { status: 400 })
    }

    // Validate events
    const invalidEvents = events.filter((e: string) => !VALID_EVENTS.includes(e))
    if (invalidEvents.length > 0) {
      return NextResponse.json({
        error: `Événements invalides: ${invalidEvents.join(', ')}`,
        validEvents: VALID_EVENTS,
      }, { status: 400 })
    }

    const id = crypto.randomUUID()
    const webhookSecret = secret || crypto.randomBytes(32).toString('hex')

    webhookStore.set(id, {
      id,
      url,
      events,
      secret: webhookSecret,
      active: true,
      createdAt: new Date(),
    })

    console.log(`[Webhook] Registered: ${id} → ${url} (${events.join(', ')})`)

    return NextResponse.json({
      success: true,
      data: {
        id,
        url,
        events,
        secret: webhookSecret,
        active: true,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('[API v2] POST /webhooks error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE /api/v2/webhooks — Delete a webhook
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id requis' }, { status: 400 })
    }

    if (!webhookStore.has(id)) {
      return NextResponse.json({ error: 'Webhook introuvable' }, { status: 404 })
    }

    webhookStore.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API v2] DELETE /webhooks error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

/**
 * Utility: Dispatch webhook events to registered endpoints.
 * Called internally by other API routes when events occur.
 */
export async function dispatchWebhook(event: string, payload: any) {
  const hooks = Array.from(webhookStore.values()).filter(
    h => h.active && h.events.includes(event)
  )

  for (const hook of hooks) {
    try {
      const body = JSON.stringify({ event, timestamp: new Date().toISOString(), data: payload })
      const signature = crypto.createHmac('sha256', hook.secret).update(body).digest('hex')

      await fetch(hook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Event': event,
          'X-Webhook-Signature': `sha256=${signature}`,
          'X-Webhook-Id': hook.id,
        },
        body,
        signal: AbortSignal.timeout(10000),
      })

      console.log(`[Webhook] ${event} → ${hook.url} ✅`)
    } catch (err) {
      console.error(`[Webhook] ${event} → ${hook.url} ❌`, err)
    }
  }
}
