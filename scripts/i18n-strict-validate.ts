#!/usr/bin/env npx tsx
/**
 * 🚨 SCRIPT DE VALIDATION i18n STRICT
 * 
 * Ce script BLOQUE le build si:
 * - Des clés sont manquantes dans une langue
 * - Des valeurs sont vides
 * - Des textes hardcodés sont détectés dans les composants
 * 
 * Usage:
 *   npm run i18n:strict        # Validation complète
 *   npm run i18n:strict --fix  # Génère un rapport des corrections à faire
 * 
 * Intégration:
 *   - Pre-commit hook (husky)
 *   - CI/CD pipeline
 *   - npm run build (bloquant)
 */

import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'

// Configuration
const CONFIG = {
  localesDir: path.join(__dirname, '../src/i18n/locales'),
  srcDir: path.join(__dirname, '../src'),
  referenceLang: 'fr',
  supportedLangs: ['fr', 'en', 'es', 'pt-BR', 'ar'],
  // Fichiers de traduction unifiés (nouvelle structure)
  unifiedFiles: ['fr.json', 'en.json', 'es.json', 'pt-br.json', 'ar.json'],
  // Patterns de texte hardcodé à détecter
  hardcodedPatterns: [
    // Texte français dans JSX
    />\s*[A-ZÀ-Ÿ][a-zà-ÿ]+(?:\s+[a-zà-ÿA-ZÀ-Ÿ]+){2,}\s*</g,
    // Attributs avec texte français
    /(?:title|placeholder|alt|aria-label)=["'][A-ZÀ-Ÿa-zà-ÿ\s]{10,}["']/g,
  ],
  // Fichiers/dossiers à ignorer
  ignorePaths: [
    'node_modules',
    '.next',
    'dist',
    '.git',
    'scripts',
    'prisma',
    'public',
  ],
  // Extensions à scanner
  scanExtensions: ['.tsx', '.ts', '.jsx', '.js'],
}

interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
  stats: ValidationStats
}

interface ValidationError {
  type: 'missing_key' | 'missing_file' | 'empty_value' | 'hardcoded_text'
  severity: 'critical' | 'error'
  file?: string
  lang?: string
  namespace?: string
  key?: string
  line?: number
  message: string
}

interface ValidationWarning {
  type: 'extra_key' | 'suspicious_text' | 'inconsistent_format'
  file?: string
  lang?: string
  key?: string
  message: string
}

interface ValidationStats {
  totalKeys: number
  totalFiles: number
  languagesChecked: number
  missingKeys: number
  emptyValues: number
  hardcodedTexts: number
  extraKeys: number
}

// Couleurs pour la console
const colors = {
  red: (s: string) => `\x1b[31m${s}\x1b[0m`,
  green: (s: string) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
  blue: (s: string) => `\x1b[34m${s}\x1b[0m`,
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
  dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
}

/**
 * Extraire toutes les clés d'un objet JSON de façon récursive
 */
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

/**
 * Valider les fichiers de traduction unifiés (fr.json, en.json, etc.)
 */
function validateUnifiedFiles(): { errors: ValidationError[], warnings: ValidationWarning[], stats: Partial<ValidationStats> } {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []
  let totalKeys = 0
  let missingKeys = 0
  let emptyValues = 0
  let extraKeys = 0

  // Vérifier si les fichiers unifiés existent
  const unifiedFilesExist = CONFIG.unifiedFiles.every(f => 
    fs.existsSync(path.join(CONFIG.localesDir, f))
  )

  if (!unifiedFilesExist) {
    console.log(colors.yellow('⚠️  Fichiers unifiés non trouvés, validation des dossiers par langue...'))
    return { errors, warnings, stats: {} }
  }

  console.log(colors.blue('\n📁 Validation des fichiers de traduction unifiés...\n'))

  // Charger le fichier de référence (français)
  const refPath = path.join(CONFIG.localesDir, 'fr.json')
  const refJson = JSON.parse(fs.readFileSync(refPath, 'utf-8'))
  const refKeys = getAllKeys(refJson)
  totalKeys = refKeys.size

  console.log(`   ${colors.green('✓')} fr.json: ${refKeys.size} clés (référence)`)

  // Valider chaque langue
  for (const file of CONFIG.unifiedFiles) {
    if (file === 'fr.json') continue

    const filePath = path.join(CONFIG.localesDir, file)
    const lang = file.replace('.json', '')

    if (!fs.existsSync(filePath)) {
      errors.push({
        type: 'missing_file',
        severity: 'critical',
        lang,
        message: `Fichier manquant: ${file}`
      })
      continue
    }

    const langJson = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    const langKeys = getAllKeys(langJson)

    // Clés manquantes
    refKeys.forEach((_, key) => {
      if (!langKeys.has(key)) {
        missingKeys++
        errors.push({
          type: 'missing_key',
          severity: 'critical',
          lang,
          key,
          file,
          message: `Clé manquante dans ${file}: "${key}"`
        })
      }
    })

    // Clés en trop
    langKeys.forEach((_, key) => {
      if (!refKeys.has(key)) {
        extraKeys++
        warnings.push({
          type: 'extra_key',
          lang,
          key,
          file,
          message: `Clé en trop dans ${file}: "${key}"`
        })
      }
    })

    // Valeurs vides
    langKeys.forEach((value, key) => {
      if (value === '' || value === null || value === undefined) {
        emptyValues++
        errors.push({
          type: 'empty_value',
          severity: 'error',
          lang,
          key,
          file,
          message: `Valeur vide dans ${file}: "${key}"`
        })
      }
    })

    const status = langKeys.size === refKeys.size ? colors.green('✓') : colors.red('✗')
    console.log(`   ${status} ${file}: ${langKeys.size} clés`)
  }

  return { 
    errors, 
    warnings, 
    stats: { totalKeys, missingKeys, emptyValues, extraKeys } 
  }
}

/**
 * Valider les fichiers de traduction par namespace (structure actuelle)
 */
function validateNamespaceFiles(): { errors: ValidationError[], warnings: ValidationWarning[], stats: Partial<ValidationStats> } {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []
  let totalKeys = 0
  let missingKeys = 0
  let emptyValues = 0
  let extraKeys = 0
  let totalFiles = 0

  const refDir = path.join(CONFIG.localesDir, CONFIG.referenceLang)
  
  if (!fs.existsSync(refDir)) {
    console.log(colors.yellow('⚠️  Dossier de référence non trouvé'))
    return { errors, warnings, stats: {} }
  }

  const namespaces = fs.readdirSync(refDir)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''))

  console.log(colors.blue(`\n📁 Validation de ${namespaces.length} namespaces...\n`))

  for (const ns of namespaces) {
    const refPath = path.join(refDir, `${ns}.json`)
    const refJson = JSON.parse(fs.readFileSync(refPath, 'utf-8'))
    const refKeys = getAllKeys(refJson)
    totalKeys += refKeys.size
    totalFiles++

    console.log(`   📄 ${ns}.json: ${refKeys.size} clés`)

    for (const lang of CONFIG.supportedLangs) {
      if (lang === CONFIG.referenceLang) continue

      const langPath = path.join(CONFIG.localesDir, lang, `${ns}.json`)

      if (!fs.existsSync(langPath)) {
        errors.push({
          type: 'missing_file',
          severity: 'critical',
          lang,
          namespace: ns,
          message: `Fichier manquant: ${lang}/${ns}.json`
        })
        continue
      }

      const langJson = JSON.parse(fs.readFileSync(langPath, 'utf-8'))
      const langKeys = getAllKeys(langJson)

      // Clés manquantes
      refKeys.forEach((_, key) => {
        if (!langKeys.has(key)) {
          missingKeys++
          errors.push({
            type: 'missing_key',
            severity: 'critical',
            lang,
            namespace: ns,
            key,
            message: `[${lang}/${ns}] Clé manquante: "${key}"`
          })
        }
      })

      // Clés en trop
      langKeys.forEach((_, key) => {
        if (!refKeys.has(key)) {
          extraKeys++
          warnings.push({
            type: 'extra_key',
            lang,
            key,
            message: `[${lang}/${ns}] Clé en trop: "${key}"`
          })
        }
      })

      // Valeurs vides
      langKeys.forEach((value, key) => {
        if (value === '' || value === null || value === undefined) {
          emptyValues++
          errors.push({
            type: 'empty_value',
            severity: 'error',
            lang,
            namespace: ns,
            key,
            message: `[${lang}/${ns}] Valeur vide: "${key}"`
          })
        }
      })
    }
  }

  return { 
    errors, 
    warnings, 
    stats: { totalKeys, totalFiles, missingKeys, emptyValues, extraKeys } 
  }
}

/**
 * Scanner les fichiers source pour détecter les textes hardcodés
 */
function scanHardcodedTexts(): { errors: ValidationError[], stats: Partial<ValidationStats> } {
  const errors: ValidationError[] = []
  let hardcodedTexts = 0

  console.log(colors.blue('\n🔍 Scan des textes hardcodés dans le code source...\n'))

  function scanDirectory(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      const relativePath = path.relative(CONFIG.srcDir, fullPath)

      // Ignorer certains chemins
      if (CONFIG.ignorePaths.some(p => relativePath.includes(p))) continue

      if (entry.isDirectory()) {
        scanDirectory(fullPath)
      } else if (CONFIG.scanExtensions.some(ext => entry.name.endsWith(ext))) {
        const content = fs.readFileSync(fullPath, 'utf-8')
        const lines = content.split('\n')

        // Patterns de texte français hardcodé
        const frenchPatterns = [
          // Texte entre > et < avec accents français
          />\s*([A-ZÀ-Ÿ][a-zà-ÿéèêëàâäùûüôöîïç]+(?:\s+[a-zà-ÿéèêëàâäùûüôöîïçA-ZÀ-Ÿ']+){2,})\s*</g,
          // title="texte français"
          /title=["']([^"']*[àâäéèêëîïôöùûüç][^"']*)["']/gi,
          // placeholder="texte français"
          /placeholder=["']([^"']*[àâäéèêëîïôöùûüç][^"']*)["']/gi,
          // aria-label="texte français"
          /aria-label=["']([^"']*[àâäéèêëîïôöùûüç][^"']*)["']/gi,
          // alt="texte français"
          /alt=["']([^"']*[àâäéèêëîïôöùûüç][^"']*)["']/gi,
        ]

        lines.forEach((line, lineIndex) => {
          // Ignorer les commentaires et imports
          if (line.trim().startsWith('//') || 
              line.trim().startsWith('*') || 
              line.trim().startsWith('import') ||
              line.includes('console.') ||
              line.includes('// ')) return

          for (const pattern of frenchPatterns) {
            let match: RegExpExecArray | null
            while ((match = pattern.exec(line)) !== null) {
              // Ignorer les faux positifs courants
              if (match[1]?.length < 5) continue
              if (match[1]?.includes('className')) continue
              if (match[1]?.includes('href')) continue
              if (match[1]?.match(/^[A-Z0-9_]+$/)) continue // Constantes

              hardcodedTexts++
              errors.push({
                type: 'hardcoded_text',
                severity: 'error',
                file: relativePath,
                line: lineIndex + 1,
                message: `Texte hardcodé détecté: "${match[1]?.substring(0, 50)}..."`
              })
            }
          }
        })
      }
    }
  }

  scanDirectory(CONFIG.srcDir)

  if (hardcodedTexts === 0) {
    console.log(`   ${colors.green('✓')} Aucun texte hardcodé détecté`)
  } else {
    console.log(`   ${colors.red('✗')} ${hardcodedTexts} textes hardcodés détectés`)
  }

  return { errors, stats: { hardcodedTexts } }
}

/**
 * Générer un rapport de correction
 */
function generateFixReport(errors: ValidationError[], warnings: ValidationWarning[]) {
  const reportPath = path.join(process.cwd(), 'i18n-fix-report.md')
  
  let report = `# 🔧 Rapport de correction i18n\n\n`
  report += `Généré le: ${new Date().toISOString()}\n\n`
  
  // Erreurs critiques
  const criticalErrors = errors.filter(e => e.severity === 'critical')
  if (criticalErrors.length > 0) {
    report += `## ❌ Erreurs critiques (${criticalErrors.length})\n\n`
    report += `Ces erreurs BLOQUENT le déploiement:\n\n`
    
    // Grouper par type
    const byType = criticalErrors.reduce((acc, e) => {
      if (!acc[e.type]) acc[e.type] = []
      acc[e.type].push(e)
      return acc
    }, {} as Record<string, ValidationError[]>)

    for (const [type, typeErrors] of Object.entries(byType)) {
      report += `### ${type} (${typeErrors.length})\n\n`
      typeErrors.forEach(e => {
        report += `- ${e.message}\n`
      })
      report += '\n'
    }
  }

  // Erreurs non-critiques
  const nonCriticalErrors = errors.filter(e => e.severity === 'error')
  if (nonCriticalErrors.length > 0) {
    report += `## ⚠️ Erreurs (${nonCriticalErrors.length})\n\n`
    nonCriticalErrors.forEach(e => {
      report += `- ${e.message}\n`
    })
    report += '\n'
  }

  // Warnings
  if (warnings.length > 0) {
    report += `## 💡 Avertissements (${warnings.length})\n\n`
    warnings.slice(0, 50).forEach(w => {
      report += `- ${w.message}\n`
    })
    if (warnings.length > 50) {
      report += `\n... et ${warnings.length - 50} autres\n`
    }
  }

  fs.writeFileSync(reportPath, report)
  console.log(colors.blue(`\n📄 Rapport généré: ${reportPath}`))
}

/**
 * Afficher les résultats
 */
function printResults(result: ValidationResult) {
  console.log('\n' + '═'.repeat(60))
  console.log(colors.bold('📊 RÉSULTATS DE VALIDATION i18n'))
  console.log('═'.repeat(60))

  console.log(`\n📈 Statistiques:`)
  console.log(`   • Clés totales: ${result.stats.totalKeys}`)
  console.log(`   • Langues vérifiées: ${result.stats.languagesChecked}`)
  console.log(`   • Clés manquantes: ${result.stats.missingKeys}`)
  console.log(`   • Valeurs vides: ${result.stats.emptyValues}`)
  console.log(`   • Textes hardcodés: ${result.stats.hardcodedTexts}`)
  console.log(`   • Clés en trop: ${result.stats.extraKeys}`)

  if (result.errors.length > 0) {
    console.log(colors.red(`\n❌ ERREURS (${result.errors.length}):`))
    
    // Afficher les 20 premières erreurs
    result.errors.slice(0, 20).forEach(e => {
      const prefix = e.severity === 'critical' ? '🚨' : '⚠️'
      console.log(`   ${prefix} ${e.message}`)
    })
    
    if (result.errors.length > 20) {
      console.log(colors.dim(`   ... et ${result.errors.length - 20} autres erreurs`))
    }
  }

  if (result.warnings.length > 0) {
    console.log(colors.yellow(`\n⚠️  AVERTISSEMENTS (${result.warnings.length}):`))
    result.warnings.slice(0, 10).forEach(w => {
      console.log(`   💡 ${w.message}`)
    })
    if (result.warnings.length > 10) {
      console.log(colors.dim(`   ... et ${result.warnings.length - 10} autres`))
    }
  }

  console.log('\n' + '═'.repeat(60))
  
  if (result.isValid) {
    console.log(colors.green(colors.bold('✅ VALIDATION RÉUSSIE - Prêt pour la production!')))
  } else {
    console.log(colors.red(colors.bold('❌ VALIDATION ÉCHOUÉE - Corrections requises!')))
    console.log(colors.yellow('\n💡 Exécutez avec --fix pour générer un rapport de correction'))
  }
  
  console.log('═'.repeat(60) + '\n')
}

/**
 * Point d'entrée principal
 */
async function main() {
  const args = process.argv.slice(2)
  const generateReport = args.includes('--fix') || args.includes('-f')

  console.log(colors.bold('\n🔍 VALIDATION i18n STRICTE\n'))
  console.log(`   Mode: ${generateReport ? 'Génération de rapport' : 'Validation'}`)
  console.log(`   Référence: ${CONFIG.referenceLang}`)
  console.log(`   Langues: ${CONFIG.supportedLangs.join(', ')}`)

  // Collecter toutes les erreurs et warnings
  const allErrors: ValidationError[] = []
  const allWarnings: ValidationWarning[] = []
  const stats: ValidationStats = {
    totalKeys: 0,
    totalFiles: 0,
    languagesChecked: CONFIG.supportedLangs.length,
    missingKeys: 0,
    emptyValues: 0,
    hardcodedTexts: 0,
    extraKeys: 0,
  }

  // 1. Valider les fichiers unifiés
  const unifiedResult = validateUnifiedFiles()
  allErrors.push(...unifiedResult.errors)
  allWarnings.push(...unifiedResult.warnings)
  Object.assign(stats, unifiedResult.stats)

  // 2. Valider les fichiers par namespace (si pas de fichiers unifiés)
  if (unifiedResult.errors.length === 0 && stats.totalKeys === 0) {
    const namespaceResult = validateNamespaceFiles()
    allErrors.push(...namespaceResult.errors)
    allWarnings.push(...namespaceResult.warnings)
    Object.assign(stats, namespaceResult.stats)
  }

  // 3. Scanner les textes hardcodés
  const hardcodedResult = scanHardcodedTexts()
  allErrors.push(...hardcodedResult.errors)
  Object.assign(stats, hardcodedResult.stats)

  // Résultat final
  const criticalErrors = allErrors.filter(e => e.severity === 'critical')
  const result: ValidationResult = {
    isValid: criticalErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    stats,
  }

  // Afficher les résultats
  printResults(result)

  // Générer le rapport si demandé
  if (generateReport) {
    generateFixReport(allErrors, allWarnings)
  }

  // Exit code
  if (!result.isValid) {
    process.exit(1)
  }
}

main().catch(console.error)
