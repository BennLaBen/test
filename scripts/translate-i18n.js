#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const fetch = global.fetch || require('node-fetch')

const ROOT = path.join(__dirname, '..')
const FR_DIR = path.join(ROOT, 'src', 'i18n', 'locales', 'fr')
const EN_DIR = path.join(ROOT, 'src', 'i18n', 'locales', 'en')

const API_URL = process.env.LIBRE_TRANSLATE_URL || 'https://libretranslate.com/translate'
const SOURCE_LANG = 'fr'
const TARGET_LANG = 'en'

const cache = new Map()

async function translateText(text) {
  if (!text || typeof text !== 'string') return text

  const trimmed = text.trim()
  if (trimmed.length === 0) return text

  if (cache.has(text)) {
    return cache.get(text)
  }

  const body = {
    q: text,
    source: SOURCE_LANG,
    target: TARGET_LANG,
    format: 'text'
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    throw new Error(`Erreur de traduction (${response.status}) pour: ${text}`)
  }

  const data = await response.json()
  const translated = data.translatedText || text
  cache.set(text, translated)
  await new Promise((resolve) => setTimeout(resolve, 250))
  return translated
}

async function translateNode(node, existingNode) {
  if (typeof node === 'string') {
    if (existingNode && typeof existingNode === 'string' && existingNode.trim().length > 0) {
      return existingNode
    }
    return translateText(node)
  }

  if (Array.isArray(node)) {
    const result = []
    for (let i = 0; i < node.length; i++) {
      const child = node[i]
      const existingChild = existingNode ? existingNode[i] : undefined
      result[i] = await translateNode(child, existingChild)
    }
    return result
  }

  if (typeof node === 'object' && node !== null) {
    const result = {}
    for (const key of Object.keys(node)) {
      const child = node[key]
      const existingChild = existingNode ? existingNode[key] : undefined
      result[key] = await translateNode(child, existingChild)
    }
    return result
  }

  return node
}

async function translateFile(fileName) {
  const frPath = path.join(FR_DIR, fileName)
  const enPath = path.join(EN_DIR, fileName)

  const frContent = JSON.parse(fs.readFileSync(frPath, 'utf-8'))
  let existingEn = {}
  if (fs.existsSync(enPath)) {
    existingEn = JSON.parse(fs.readFileSync(enPath, 'utf-8'))
  }

  const translated = await translateNode(frContent, existingEn)
  const formatted = JSON.stringify(translated, null, 2)
  fs.writeFileSync(enPath, formatted + '\n', 'utf-8')
  console.log(`✅ ${fileName} traduit`)
}

async function main() {
  const files = fs.readdirSync(FR_DIR).filter((file) => file.endsWith('.json'))

  for (const file of files) {
    await translateFile(file)
  }

  console.log('\n🎉 Traduction i18n terminée !')
}

main().catch((err) => {
  console.error('❌ Erreur durant la traduction:', err)
  process.exit(1)
})
