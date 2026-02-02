# Stratégie i18n - LLEDO Industries

## Vue d'ensemble

Cette documentation décrit la stratégie d'internationalisation mise en place pour garantir que :
- **Aucune page ne peut s'afficher sans passer par la couche i18n**
- **Aucun composant ne peut afficher du texte hors dictionnaire**
- **Les clés manquantes sont automatiquement détectées**

## Architecture

```
src/
├── i18n/
│   └── locales/
│       ├── fr/          # Langue de référence
│       ├── en/
│       ├── es/
│       ├── pt-BR/
│       └── ar/
├── hooks/
│   └── useStrictTranslation.ts   # Hook strict
├── components/
│   └── I18nProvider.tsx          # Provider configuré
├── types/
│   └── i18n-keys.d.ts            # Types auto-générés
└── app/
    └── api/i18n/missing/         # API de logging
```

## 1. Forcer l'usage de `t()` partout

### ESLint Rule

La règle `react/jsx-no-literals` est configurée dans `.eslintrc.json` pour détecter les textes hardcodés :

```json
{
  "rules": {
    "react/jsx-no-literals": ["warn", {
      "noStrings": true,
      "allowedStrings": ["•", "/", "-", ":", "|", "×"],
      "ignoreProps": true
    }]
  }
}
```

### Hook `useStrictTranslation`

Utiliser ce hook au lieu de `useTranslation` pour une détection stricte :

```tsx
import { useStrictTranslation } from '@/hooks/useStrictTranslation'

function MyComponent() {
  const { t, hasKey } = useStrictTranslation('common')
  
  return <h1>{t('title')}</h1>
}
```

**Fonctionnalités :**
- Log les clés manquantes en console
- Affiche `⚠️ MISSING: key` en dev
- Reporte les clés manquantes à l'API

## 2. Bloquer les Fallback Silencieux

### Configuration i18next

Dans `I18nProvider.tsx` :

```typescript
i18next.init({
  // En dev: pas de fallback pour détecter les clés manquantes
  fallbackLng: isDev ? false : 'fr',
  
  // Configuration stricte
  returnEmptyString: false,
  returnNull: false,
  
  // Tracking des clés manquantes
  saveMissing: isDev,
  missingKeyHandler: (lngs, ns, key) => {
    console.error(`🚨 [i18n] MISSING: ${ns}:${key}`)
  },
  
  // Marqueur visuel en dev
  parseMissingKeyHandler: (key) => {
    return isDev ? `⚠️ ${key}` : key
  }
})
```

## 3. Détection Automatique des Clés Manquantes

### Script de Validation (Build-time)

```bash
npm run i18n:validate
```

Ce script vérifie :
- ✅ Tous les fichiers de traduction existent
- ✅ Toutes les clés de `fr/` sont présentes dans les autres langues
- ⚠️ Détecte les clés obsolètes
- ⚠️ Détecte les valeurs vides

### Génération de Types

```bash
npm run i18n:types
```

Génère `src/types/i18n-keys.d.ts` avec les types stricts pour l'autocomplétion.

### API de Logging (Runtime)

En développement, les clés manquantes sont automatiquement loggées :

```
GET  /api/i18n/missing     # Liste les clés manquantes
POST /api/i18n/missing     # Ajoute une clé manquante
DELETE /api/i18n/missing   # Efface le fichier
```

Le fichier `missing-i18n-keys.json` est créé à la racine du projet.

## 4. Workflow de Développement

### Ajouter une nouvelle traduction

1. **Ajouter la clé dans `fr/namespace.json`** (langue de référence)
2. **Exécuter `npm run i18n:validate`** pour voir les clés manquantes
3. **Ajouter les traductions** dans les autres langues
4. **Exécuter `npm run i18n:types`** pour mettre à jour les types

### Avant un commit

```bash
npm run i18n:check  # Valide + génère les types
```

### Avant un build (automatique)

Le script `i18n:validate` est exécuté automatiquement avant chaque build.

## 5. Compatibilité SSR/SSG (Vercel)

### Server Components

Pour les Server Components, utiliser les traductions côté serveur :

```typescript
// Dans un Server Component
import { getServerTranslations } from '@/lib/getServerTranslations'

export async function generateMetadata({ params }) {
  const t = getServerTranslations(params.locale, 'seo')
  return {
    title: t('home.title'),
    description: t('home.description')
  }
}
```

### Client Components

Tous les composants utilisant `useTranslation` ou `useStrictTranslation` doivent être marqués `'use client'`.

## 6. Scripts NPM

| Script | Description |
|--------|-------------|
| `npm run i18n:validate` | Valide toutes les traductions |
| `npm run i18n:types` | Génère les types TypeScript |
| `npm run i18n:check` | Validation + types |
| `npm run build` | Inclut automatiquement la validation |

## 7. Bonnes Pratiques

### ✅ À faire

- Utiliser `useStrictTranslation` pour les nouveaux composants
- Toujours ajouter les clés dans `fr/` en premier
- Exécuter `i18n:validate` régulièrement
- Utiliser des clés descriptives : `page.section.element`

### ❌ À éviter

- Textes hardcodés dans JSX
- Clés génériques comme `text1`, `label`
- Oublier de traduire dans toutes les langues
- Ignorer les warnings ESLint

## 8. Dépannage

### "Missing key" en console

1. Vérifier que la clé existe dans le bon namespace
2. Vérifier l'orthographe exacte
3. Exécuter `npm run i18n:validate`

### Build échoue sur Vercel

1. Vérifier les clés manquantes avec `npm run i18n:validate`
2. Ajouter les traductions manquantes
3. Commit et push

### Types non à jour

```bash
npm run i18n:types
```
