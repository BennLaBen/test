import 'server-only'

const API_URL = process.env.LIBRE_TRANSLATE_URL || 'https://libretranslate.com/translate'
const SOURCE_LANG = 'fr'
const TARGET_LANG = 'en'

const cache = new Map<string, string>()

async function requestTranslation(text: string, source: string, target: string): Promise<string> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      q: text,
      source,
      target,
      format: 'text'
    })
  })

  if (!response.ok) {
    console.error('Translation error', response.status, response.statusText)
    return text
  }

  const data = await response.json()
  const translated = typeof data.translatedText === 'string' ? data.translatedText : text
  return translated
}

export async function translateText(text: string, target: 'en' | 'fr' = 'en', source: 'fr' | 'en' = 'fr'): Promise<string> {
  if (!text || source === target) return text
  const key = `${source}|${target}|${text}`
  if (cache.has(key)) {
    return cache.get(key) as string
  }

  try {
    const translated = await requestTranslation(text, source, target)
    cache.set(key, translated)
    return translated
  } catch (error) {
    console.error('translateText error:', error)
    return text
  }
}

export async function translateArray(values: string[], target: 'en' | 'fr' = 'en', source: 'fr' | 'en' = 'fr'): Promise<string[]> {
  const results: string[] = []
  for (const value of values) {
    // eslint-disable-next-line no-await-in-loop
    results.push(await translateText(value, target, source))
  }
  return results
}
