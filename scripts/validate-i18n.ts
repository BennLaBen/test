/**
 * Script de validation des traductions i18n
 * Vérifie que toutes les clés sont présentes dans toutes les langues
 * 
 * Usage: npx ts-node scripts/validate-i18n.ts
 */

import * as fs from 'fs'
import * as path from 'path'

const LOCALES_DIR = path.join(__dirname, '../src/i18n/locales')
const REFERENCE_LANG = 'fr'
const SUPPORTED_LANGS = ['fr', 'en', 'es', 'pt-BR', 'ar']

interface ValidationError {
  type: 'missing_file' | 'missing_key' | 'extra_key' | 'empty_value'
  lang: string
  namespace: string
  key?: string
  message: string
}

function getAllKeys(obj: any, prefix = ''): Map<string, any> {
  const keys = new Map<string, any>()
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const nested = getAllKeys(value, fullKey)
      nested.forEach((v, k) => keys.set(k, v))
    } else {
      keys.set(fullKey, value)
    }
  }
  
  return keys
}

function validateTranslations(): ValidationError[] {
  const errors: ValidationError[] = []
  
  // Récupérer tous les namespaces depuis la langue de référence
  const namespaces = fs.readdirSync(path.join(LOCALES_DIR, REFERENCE_LANG))
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''))

  console.log(`\n📋 Validating ${namespaces.length} namespaces across ${SUPPORTED_LANGS.length} languages...\n`)

  for (const ns of namespaces) {
    const refPath = path.join(LOCALES_DIR, REFERENCE_LANG, `${ns}.json`)
    
    if (!fs.existsSync(refPath)) {
      errors.push({
        type: 'missing_file',
        lang: REFERENCE_LANG,
        namespace: ns,
        message: `Reference file missing: ${REFERENCE_LANG}/${ns}.json`
      })
      continue
    }

    const refJson = JSON.parse(fs.readFileSync(refPath, 'utf-8'))
    const refKeys = getAllKeys(refJson)

    console.log(`  📁 ${ns}.json: ${refKeys.size} keys`)

    for (const lang of SUPPORTED_LANGS) {
      if (lang === REFERENCE_LANG) continue
      
      const langPath = path.join(LOCALES_DIR, lang, `${ns}.json`)
      
      if (!fs.existsSync(langPath)) {
        errors.push({
          type: 'missing_file',
          lang,
          namespace: ns,
          message: `Missing file: ${lang}/${ns}.json`
        })
        continue
      }

      const langJson = JSON.parse(fs.readFileSync(langPath, 'utf-8'))
      const langKeys = getAllKeys(langJson)

      // Vérifier les clés manquantes
      Array.from(refKeys.entries()).forEach(([key]) => {
        if (!langKeys.has(key)) {
          errors.push({
            type: 'missing_key',
            lang,
            namespace: ns,
            key,
            message: `Missing key in ${lang}/${ns}.json: "${key}"`
          })
        }
      })

      // Vérifier les clés en trop (potentiellement obsolètes)
      Array.from(langKeys.keys()).forEach((key) => {
        if (!refKeys.has(key)) {
          errors.push({
            type: 'extra_key',
            lang,
            namespace: ns,
            key,
            message: `Extra key in ${lang}/${ns}.json: "${key}" (not in reference)`
          })
        }
      })

      // Vérifier les valeurs vides
      Array.from(langKeys.entries()).forEach(([key, value]) => {
        if (value === '' || value === null || value === undefined) {
          errors.push({
            type: 'empty_value',
            lang,
            namespace: ns,
            key,
            message: `Empty value in ${lang}/${ns}.json: "${key}"`
          })
        }
      })
    }
  }

  return errors
}

function printResults(errors: ValidationError[]) {
  const missingFiles = errors.filter(e => e.type === 'missing_file')
  const missingKeys = errors.filter(e => e.type === 'missing_key')
  const extraKeys = errors.filter(e => e.type === 'extra_key')
  const emptyValues = errors.filter(e => e.type === 'empty_value')

  console.log('\n' + '='.repeat(60))
  console.log('📊 VALIDATION RESULTS')
  console.log('='.repeat(60))

  if (missingFiles.length > 0) {
    console.log(`\n❌ Missing Files (${missingFiles.length}):`)
    missingFiles.forEach(e => console.log(`   - ${e.message}`))
  }

  if (missingKeys.length > 0) {
    console.log(`\n❌ Missing Keys (${missingKeys.length}):`)
    // Grouper par langue
    const byLang = missingKeys.reduce((acc, e) => {
      if (!acc[e.lang]) acc[e.lang] = []
      acc[e.lang].push(e)
      return acc
    }, {} as Record<string, ValidationError[]>)
    
    for (const [lang, langErrors] of Object.entries(byLang)) {
      console.log(`   [${lang}] ${langErrors.length} missing keys`)
      langErrors.slice(0, 5).forEach(e => console.log(`      - ${e.namespace}:${e.key}`))
      if (langErrors.length > 5) {
        console.log(`      ... and ${langErrors.length - 5} more`)
      }
    }
  }

  if (extraKeys.length > 0) {
    console.log(`\n⚠️  Extra Keys (${extraKeys.length}):`)
    extraKeys.slice(0, 10).forEach(e => console.log(`   - ${e.message}`))
    if (extraKeys.length > 10) {
      console.log(`   ... and ${extraKeys.length - 10} more`)
    }
  }

  if (emptyValues.length > 0) {
    console.log(`\n⚠️  Empty Values (${emptyValues.length}):`)
    emptyValues.slice(0, 10).forEach(e => console.log(`   - ${e.message}`))
    if (emptyValues.length > 10) {
      console.log(`   ... and ${emptyValues.length - 10} more`)
    }
  }

  console.log('\n' + '='.repeat(60))
  
  const criticalErrors = missingFiles.length + missingKeys.length
  if (criticalErrors === 0) {
    console.log('✅ All translations are valid!')
    return true
  } else {
    console.log(`❌ Found ${criticalErrors} critical errors (missing files/keys)`)
    console.log(`⚠️  Found ${extraKeys.length + emptyValues.length} warnings`)
    return false
  }
}

// Exécution
const errors = validateTranslations()
const isValid = printResults(errors)

if (!isValid) {
  process.exit(1)
}
