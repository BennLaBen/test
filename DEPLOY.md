# 🚀 Guide de Déploiement - LLEDO Industries

## Étape 1 : Préparer le Projet

### 1.1 Vérifier que tout est prêt
```bash
# Dans le dossier D:\MPEB
npm run build
```

Si le build passe sans erreur, vous êtes prêt ! ✅

---

## Étape 2 : GitHub

### 2.1 Créer un nouveau repository sur GitHub

1. Aller sur https://github.com
2. Cliquer sur le bouton **"New"** (ou le **"+"** en haut à droite)
3. Nommer le repo : **`lledo-industries`**
4. **NE PAS** cocher "Initialize with README"
5. Cliquer **"Create repository"**

### 2.2 Initialiser Git localement

```bash
# Ouvrir PowerShell dans D:\MPEB
cd D:\MPEB

# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "🎉 Initial commit - LLEDO Industries Website"

# Renommer la branche en 'main'
git branch -M main

# Lier au repo GitHub (REMPLACER par votre URL)
git remote add origin https://github.com/VOTRE-USERNAME/lledo-industries.git

# Pousser sur GitHub
git push -u origin main
```

### 2.3 Vérifier sur GitHub

Actualiser votre page GitHub, tous les fichiers doivent apparaître ! ✅

---

## Étape 3 : Déployer sur Vercel

### Option A : Via l'interface Vercel (RECOMMANDÉ)

#### 3.1 Créer un compte Vercel
1. Aller sur https://vercel.com
2. Cliquer **"Sign Up"**
3. Choisir **"Continue with GitHub"**
4. Autoriser Vercel à accéder à vos repos

#### 3.2 Importer le projet
1. Sur le dashboard Vercel, cliquer **"Add New..."** → **"Project"**
2. Trouver **`lledo-industries`** dans la liste
3. Cliquer **"Import"**

#### 3.3 Configurer le projet
**Framework Preset** : Next.js (détecté automatiquement) ✅

**Build Settings** (vérifier) :
- Build Command : `npm run build` ✅
- Output Directory : `.next` ✅
- Install Command : `npm install` ✅

**Environment Variables** (optionnel) :
```
NEXT_PUBLIC_SITE_URL = https://lledo-industries.vercel.app
NEXT_PUBLIC_CONTACT_EMAIL = contact@lledo-industries.com
```

#### 3.4 Déployer
1. Cliquer **"Deploy"** 🚀
2. Attendre 2-3 minutes
3. Vercel va :
   - Installer les dépendances
   - Builder le site
   - Déployer automatiquement

#### 3.5 C'est en ligne ! 🎉
Vercel vous donne une URL : `https://lledo-industries.vercel.app`

---

### Option B : Via Vercel CLI (Avancé)

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer (suivre les prompts)
vercel

# Déployer en production
vercel --prod
```

---

## Étape 4 : Configurer le Domaine Custom (lledo-industries.com)

### 4.1 Dans Vercel
1. Aller dans votre projet sur Vercel
2. Cliquer sur **"Settings"** → **"Domains"**
3. Ajouter votre domaine : `lledo-industries.com`
4. Vercel vous donne des **DNS records** à configurer

### 4.2 Chez votre registrar (OVH, Gandi, etc.)
Ajouter ces DNS records :

**Type A** :
```
@ → 76.76.21.21
```

**Type CNAME** :
```
www → cname.vercel-dns.com
```

**Attendre 24-48h** pour la propagation DNS

---

## Étape 5 : Mises à Jour Futures

### Workflow de développement

```bash
# 1. Faire vos modifications dans VS Code

# 2. Tester localement
npm run dev

# 3. Commiter les changements
git add .
git commit -m "✨ Description de vos changements"

# 4. Pousser sur GitHub
git push

# 5. Vercel redéploie AUTOMATIQUEMENT ! 🚀
```

**Note** : Vercel détecte automatiquement les push sur GitHub et redéploie le site ! Aucune action manuelle nécessaire.

---

## 📊 Vérifications Post-Déploiement

### ✅ Checklist

- [ ] Site accessible sur l'URL Vercel
- [ ] Homepage s'affiche correctement
- [ ] Navigation fonctionne
- [ ] Blog accessible
- [ ] Formulaires fonctionnent
- [ ] Authentification marche
- [ ] Responsive sur mobile (tester sur téléphone)
- [ ] Dark mode fonctionne
- [ ] i18n FR/EN marche
- [ ] Images se chargent
- [ ] Pas d'erreurs console

### 🔍 Outils de Test

**Lighthouse** (dans Chrome DevTools) :
```
1. Ouvrir votre site
2. F12 → Onglet "Lighthouse"
3. Cliquer "Generate report"
4. Viser 90+ sur tous les scores
```

**Mobile Test** :
```
1. Ouvrir sur votre téléphone
2. Tester le menu hamburger
3. Tester les formulaires
4. Vérifier le scroll
5. Tester la connexion
```

---

## 🐛 Résolution de Problèmes

### Build Error sur Vercel

**Problème** : Le build échoue

**Solution** :
```bash
# Tester le build localement
npm run build

# Si erreur, corriger et recommiter
git add .
git commit -m "🐛 Fix build error"
git push
```

### Variables d'Environnement

**Problème** : Fonctionnalités ne marchent pas en prod

**Solution** :
1. Aller dans Vercel → Settings → Environment Variables
2. Ajouter les variables nécessaires
3. Redéployer : Settings → Deployments → ... → Redeploy

### Domaine Custom ne marche pas

**Problème** : Le domaine ne pointe pas vers Vercel

**Solution** :
1. Vérifier les DNS records chez votre registrar
2. Utiliser https://dnschecker.org pour vérifier la propagation
3. Attendre 24-48h max

---

## 📞 Support

**Vercel Documentation** : https://vercel.com/docs
**Next.js Documentation** : https://nextjs.org/docs

**En cas de problème** :
- Vérifier les logs Vercel
- Tester en local avec `npm run build`
- Consulter la console du navigateur (F12)

---

## 🎉 Félicitations !

Votre site LLEDO Industries est maintenant :
- ✅ Sur GitHub (code versionné)
- ✅ Sur Vercel (hébergé)
- ✅ Déployé automatiquement à chaque push
- ✅ Performant et sécurisé
- ✅ Accessible 24/7
- ✅ Certificat SSL gratuit

**URL temporaire** : https://lledo-industries.vercel.app
**URL finale** : https://lledo-industries.com (après config DNS)

---

*Guide créé pour LLEDO Industries*
*36 ans d'excellence industrielle française* 🏭🇫🇷

