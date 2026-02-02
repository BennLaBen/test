# ✅ CHECKLIST DE VALIDATION i18n - LLEDO Industries

> **Objectif**: IMPOSSIBLE de passer une page en production si elle n'est pas traduite à 100%

---

## 🚨 RÈGLES ABSOLUES

| Règle | Description | Vérification |
|-------|-------------|--------------|
| ❌ **Aucun texte hardcodé** | Tout texte visible doit passer par `t()` | ESLint + scan automatique |
| ❌ **Aucune clé manquante** | Toutes les clés FR doivent exister dans EN/ES/PT-BR/AR | Script de validation |
| ❌ **Aucune valeur vide** | Pas de `""` ou `null` dans les fichiers JSON | Script de validation |
| ❌ **Aucun fallback silencieux** | Mode strict = erreur si clé absente | `useStrictTranslation` |
| ✅ **Build bloqué si erreur** | `npm run build` échoue si i18n invalide | `prebuild` hook |

---

## 📋 CHECKLIST PRÉ-DÉPLOIEMENT

### 1. Validation automatique (OBLIGATOIRE)

```bash
# Exécuter AVANT tout commit/push
npm run i18n:check
```

Cette commande vérifie:
- [x] Toutes les clés présentes dans toutes les langues
- [x] Aucune valeur vide
- [x] Aucun texte hardcodé dans le code
- [x] Structure JSON valide

### 2. Vérification manuelle

#### Pages à vérifier (changer de langue et vérifier visuellement):

| Page | Route | FR | EN | ES | PT-BR | AR |
|------|-------|----|----|----|----|-----|
| Accueil | `/` | ☐ | ☐ | ☐ | ☐ | ☐ |
| Nos Expertises | `/nos-expertises` | ☐ | ☐ | ☐ | ☐ | ☐ |
| Notre Vision | `/notre-vision` | ☐ | ☐ | ☐ | ☐ | ☐ |
| Contact | `/contact` | ☐ | ☐ | ☐ | ☐ | ☐ |
| Carrières | `/carriere` | ☐ | ☐ | ☐ | ☐ | ☐ |
| Blog | `/blog` | ☐ | ☐ | ☐ | ☐ | ☐ |
| Cas Clients | `/cas-clients` | ☐ | ☐ | ☐ | ☐ | ☐ |
| Aerotools | `/aerotools` | ☐ | ☐ | ☐ | ☐ | ☐ |
| MPEB | `/societes/mpeb` | ☐ | ☐ | ☐ | ☐ | ☐ |
| EGI | `/societes/egi` | ☐ | ☐ | ☐ | ☐ | ☐ |
| FREM | `/societes/frem` | ☐ | ☐ | ☐ | ☐ | ☐ |
| MGP | `/societes/mgp` | ☐ | ☐ | ☐ | ☐ | ☐ |
| Connexion | `/connexion` | ☐ | ☐ | ☐ | ☐ | ☐ |
| Inscription | `/inscription` | ☐ | ☐ | ☐ | ☐ | ☐ |

#### Éléments à vérifier sur chaque page:

- [ ] **Titre de page** (balise `<title>`)
- [ ] **Meta description**
- [ ] **Textes de navigation** (header, footer)
- [ ] **Titres et sous-titres** (h1, h2, h3...)
- [ ] **Paragraphes de contenu**
- [ ] **Boutons et CTA**
- [ ] **Labels de formulaires**
- [ ] **Messages d'erreur**
- [ ] **Placeholders**
- [ ] **Tooltips et aria-labels**
- [ ] **Messages de succès/erreur**

### 3. Vérification des marqueurs visuels

En mode développement, les clés manquantes apparaissent avec:
- `🔴 MISSING: key.name` dans l'interface
- Console rouge avec détails
- Panneau de debug en bas à droite

**Si vous voyez ces marqueurs → NE PAS DÉPLOYER**

---

## 🛠️ COMMANDES i18n

| Commande | Description |
|----------|-------------|
| `npm run i18n:validate` | Validation basique des fichiers JSON |
| `npm run i18n:strict` | Validation stricte (bloque si erreur) |
| `npm run i18n:strict:fix` | Génère un rapport de correction |
| `npm run i18n:check` | Validation complète (strict + ESLint) |
| `npm run lint:i18n` | Scan ESLint pour textes hardcodés |
| `npm run build` | Build (inclut validation i18n) |

---

## 📁 STRUCTURE DES FICHIERS DE TRADUCTION

### Fichiers unifiés (recommandé)
```
src/i18n/locales/
├── fr.json      # Source française (référence)
├── en.json      # Anglais (langue principale)
├── es.json      # Espagnol
├── pt-br.json   # Portugais Brésil
└── ar.json      # Arabe
```

### Structure des clés
```json
{
  "common": {},      // Éléments communs (nav, footer, etc.)
  "layout": {},      // Structure de page
  "home": {},        // Page d'accueil
  "services": {},    // Pages services/expertises
  "recruitment": {}, // Page carrières
  "contact": {},     // Page contact
  "blog": {},        // Section blog
  "forms": {},       // Formulaires
  "errors": {},      // Messages d'erreur
  "ui": {},          // Éléments UI génériques
  "seo": {}          // Métadonnées SEO
}
```

---

## 🔧 COMMENT AJOUTER UNE NOUVELLE TRADUCTION

### 1. Ajouter la clé dans `fr.json` (source)

```json
{
  "home": {
    "newSection": {
      "title": "Nouveau titre",
      "description": "Nouvelle description"
    }
  }
}
```

### 2. Ajouter dans TOUTES les autres langues

```bash
# Vérifier les clés manquantes
npm run i18n:strict:fix
```

### 3. Utiliser dans le code

```tsx
import { useStrictTranslation } from '@/hooks/useStrictTranslation'

function MyComponent() {
  const { t } = useStrictTranslation('home')
  
  return (
    <div>
      <h1>{t('newSection.title')}</h1>
      <p>{t('newSection.description')}</p>
    </div>
  )
}
```

### 4. Valider

```bash
npm run i18n:check
```

---

## ⚠️ ERREURS COURANTES À ÉVITER

### ❌ Texte hardcodé
```tsx
// MAUVAIS
<h1>Bienvenue sur notre site</h1>

// BON
<h1>{t('home.hero.title')}</h1>
```

### ❌ Attributs hardcodés
```tsx
// MAUVAIS
<input placeholder="Votre email" />

// BON
<input placeholder={t('forms.placeholders.email')} />
```

### ❌ Concaténation de chaînes
```tsx
// MAUVAIS
<p>{"Bonjour " + userName}</p>

// BON
<p>{t('greeting', { name: userName })}</p>
```

### ❌ useTranslation standard
```tsx
// MAUVAIS - pas de détection des clés manquantes
import { useTranslation } from 'react-i18next'

// BON - détection stricte
import { useStrictTranslation } from '@/hooks/useStrictTranslation'
```

---

## 🚀 WORKFLOW DE DÉPLOIEMENT

```
1. Développement local
   └── Voir les marqueurs visuels 🔴 MISSING
   
2. Avant commit
   └── npm run i18n:check ✓
   
3. CI/CD Pipeline
   └── npm run build (inclut i18n:strict)
   └── Si erreur → Build échoue ❌
   
4. Production
   └── NEXT_PUBLIC_I18N_STRICT=true
   └── Erreur fatale si clé manquante
```

---

## 📊 MÉTRIQUES DE QUALITÉ

| Métrique | Objectif | Actuel |
|----------|----------|--------|
| Clés totales | - | 400+ |
| Langues supportées | 5 | 5 ✓ |
| Clés manquantes | 0 | - |
| Valeurs vides | 0 | - |
| Textes hardcodés | 0 | - |
| Couverture | 100% | - |

---

## 📞 SUPPORT

En cas de problème avec les traductions:

1. Exécuter `npm run i18n:strict:fix` pour un rapport détaillé
2. Consulter le fichier `i18n-fix-report.md` généré
3. Vérifier la console développeur pour les clés manquantes
4. Contacter l'équipe technique si blocage

---

**Dernière mise à jour**: Février 2026
**Responsable**: Équipe LLEDO Industries
