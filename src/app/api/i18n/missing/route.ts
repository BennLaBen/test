import { NextRequest, NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'

const MISSING_KEYS_FILE = path.join(process.cwd(), 'missing-i18n-keys.json')

interface MissingKeyEntry {
  key: string
  lang: string
  timestamp: string
  count: number
}

/**
 * API endpoint pour logger les clés i18n manquantes en développement
 * POST /api/i18n/missing
 */
export async function POST(req: NextRequest) {
  // Seulement en développement
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Only available in development mode' },
      { status: 403 }
    )
  }

  try {
    const { key, lang, timestamp } = await req.json()

    if (!key || !lang) {
      return NextResponse.json(
        { error: 'Missing required fields: key, lang' },
        { status: 400 }
      )
    }

    // Lire le fichier existant ou créer un nouveau
    let existing: Record<string, MissingKeyEntry> = {}
    
    if (fs.existsSync(MISSING_KEYS_FILE)) {
      try {
        existing = JSON.parse(fs.readFileSync(MISSING_KEYS_FILE, 'utf-8'))
      } catch {
        existing = {}
      }
    }

    // Ajouter ou mettre à jour l'entrée
    if (existing[key]) {
      existing[key].count += 1
      existing[key].timestamp = timestamp
    } else {
      existing[key] = {
        key,
        lang,
        timestamp,
        count: 1
      }
    }

    // Sauvegarder
    fs.writeFileSync(MISSING_KEYS_FILE, JSON.stringify(existing, null, 2))

    console.log(`📝 [i18n] Logged missing key: ${key}`)

    return NextResponse.json({ success: true, key })
  } catch (error) {
    console.error('[i18n] Error logging missing key:', error)
    return NextResponse.json(
      { error: 'Failed to log missing key' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/i18n/missing - Récupérer toutes les clés manquantes
 */
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Only available in development mode' },
      { status: 403 }
    )
  }

  try {
    if (!fs.existsSync(MISSING_KEYS_FILE)) {
      return NextResponse.json({ keys: [], count: 0 })
    }

    const data = JSON.parse(fs.readFileSync(MISSING_KEYS_FILE, 'utf-8'))
    const keys = Object.values(data) as MissingKeyEntry[]

    return NextResponse.json({
      keys: keys.sort((a, b) => b.count - a.count),
      count: keys.length
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read missing keys' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/i18n/missing - Effacer le fichier des clés manquantes
 */
export async function DELETE() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Only available in development mode' },
      { status: 403 }
    )
  }

  try {
    if (fs.existsSync(MISSING_KEYS_FILE)) {
      fs.unlinkSync(MISSING_KEYS_FILE)
    }
    return NextResponse.json({ success: true, message: 'Missing keys file cleared' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to clear missing keys' },
      { status: 500 }
    )
  }
}
