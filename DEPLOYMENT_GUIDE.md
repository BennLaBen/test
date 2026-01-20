# 🚀 GUIDE DE DÉPLOIEMENT - LLEDO Industries

## Architecture de Déploiement

- **Frontend (Next.js)** → Vercel
- **Base de données (PostgreSQL)** → Railway
- **API Routes** → Vercel (intégré avec Next.js)

---

## 📋 PRÉREQUIS

### Comptes nécessaires
1. ✅ Compte Vercel (https://vercel.com)
2. ✅ Compte Railway (https://railway.app)
3. ✅ Compte GitHub (pour connecter les repos)

### Variables d'environnement à préparer
```env
# Base de données (Railway fournira)
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="https://votre-domaine.vercel.app"
NEXTAUTH_SECRET="générer avec: openssl rand -base64 32"

# Email (optionnel)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="votre-email@gmail.com"
EMAIL_SERVER_PASSWORD="votre-mot-de-passe-app"
EMAIL_FROM="noreply@lledo-industries.com"

# Site
NEXT_PUBLIC_SITE_URL="https://votre-domaine.vercel.app"
```

---

## 🗄️ ÉTAPE 1 : DÉPLOYER LA BASE DE DONNÉES SUR RAILWAY

### 1.1 Créer un nouveau projet Railway

```bash
# Aller sur https://railway.app
# Cliquer sur "New Project"
# Sélectionner "Provision PostgreSQL"
```

### 1.2 Récupérer l'URL de connexion

1. Dans Railway, cliquer sur votre base PostgreSQL
2. Aller dans l'onglet **"Connect"**
3. Copier la **"Postgres Connection URL"**
   ```
   postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway
   ```

### 1.3 Configurer les variables Railway

Dans Railway, onglet **"Variables"**, ajouter:
```env
DATABASE_URL=postgresql://... (déjà présent)
```

---

## 🌐 ÉTAPE 2 : DÉPLOYER LE FRONTEND SUR VERCEL

### 2.1 Connecter le repository GitHub

```bash
# Option A : Via GitHub (recommandé)
1. Push ton code sur GitHub
2. Aller sur https://vercel.com/new
3. Importer ton repository GitHub
4. Sélectionner "lledo-industries"

# Option B : Via Vercel CLI
npm i -g vercel
vercel login
vercel
```

### 2.2 Configurer les variables d'environnement Vercel

Dans Vercel Dashboard → Settings → Environment Variables:

```env
# Base de données (copier depuis Railway)
DATABASE_URL=postgresql://postgres:xxx@containers-us-west-xxx.railway.app:5432/railway

# NextAuth
NEXTAUTH_URL=https://lledo-industries.vercel.app
NEXTAUTH_SECRET=ton_secret_genere_avec_openssl

# Email (optionnel)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=ton-email@gmail.com
EMAIL_SERVER_PASSWORD=ton-mot-de-passe-app
EMAIL_FROM=noreply@lledo-industries.com

# Site
NEXT_PUBLIC_SITE_URL=https://lledo-industries.vercel.app
```

### 2.3 Configurer le Build

Vercel détecte automatiquement Next.js, mais vérifie:

**Build Command:**
```bash
prisma generate && next build
```

**Output Directory:**
```
.next
```

**Install Command:**
```bash
npm install
```

---

## 🔧 ÉTAPE 3 : INITIALISER LA BASE DE DONNÉES

### 3.1 Depuis ton local (recommandé)

```bash
# 1. Créer un fichier .env.production
DATABASE_URL="postgresql://postgres:xxx@containers-us-west-xxx.railway.app:5432/railway"

# 2. Pousser le schéma Prisma
npx prisma db push --schema=./prisma/schema.prisma

# 3. Générer le client Prisma
npx prisma generate

# 4. (Optionnel) Seed la base de données
npm run db:seed
```

### 3.2 Vérifier la connexion

```bash
# Ouvrir Prisma Studio pour voir les données
npx prisma studio
```

---

## ✅ ÉTAPE 4 : VÉRIFICATIONS POST-DÉPLOIEMENT

### 4.1 Tests à effectuer

- [ ] Page d'accueil charge correctement
- [ ] Navigation fonctionne
- [ ] Images s'affichent
- [ ] Connexion admin fonctionne (`/connexion`)
- [ ] Interface admin accessible (`/admin`)
- [ ] Blog affiche les articles
- [ ] Formulaire de contact fonctionne
- [ ] Responsive sur mobile

### 4.2 Vérifier les logs

**Vercel:**
```
Dashboard → Deployments → [Dernier déploiement] → Logs
```

**Railway:**
```
Dashboard → PostgreSQL → Logs
```

---

## 🔄 ÉTAPE 5 : DÉPLOIEMENT CONTINU (CI/CD)

### Configuration automatique

Une fois connecté à GitHub, Vercel déploie automatiquement:

- ✅ **Production** : Push sur `main` → https://lledo-industries.vercel.app
- ✅ **Preview** : Pull Request → URL temporaire

### Commandes Git

```bash
# Déployer en production
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin main

# Vercel déploie automatiquement en ~2 minutes
```

---

## 🛠️ COMMANDES UTILES

### Vercel CLI

```bash
# Déployer manuellement
vercel --prod

# Voir les logs en temps réel
vercel logs

# Lister les déploiements
vercel ls

# Rollback vers un déploiement précédent
vercel rollback
```

### Railway CLI

```bash
# Installer Railway CLI
npm i -g @railway/cli

# Login
railway login

# Voir les logs
railway logs

# Ouvrir la base de données
railway connect postgres
```

---

## 🔐 SÉCURITÉ

### Variables sensibles

⚠️ **NE JAMAIS COMMIT:**
- `.env`
- `.env.local`
- `.env.production`

✅ **Ajouter au `.gitignore`:**
```gitignore
.env
.env.local
.env.production
.env.*.local
```

### Générer NEXTAUTH_SECRET

```bash
# Générer un secret sécurisé
openssl rand -base64 32
```

---

## 🌍 DOMAINE PERSONNALISÉ

### Configurer lledo-industries.com sur Vercel

1. Vercel Dashboard → Settings → Domains
2. Ajouter `lledo-industries.com`
3. Suivre les instructions DNS
4. Ajouter les enregistrements chez ton registrar:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 📊 MONITORING

### Vercel Analytics

Déjà intégré via `@vercel/analytics` dans le code.

### Logs d'erreurs

- **Vercel:** Dashboard → Logs
- **Railway:** Dashboard → PostgreSQL → Logs

---

## 🚨 TROUBLESHOOTING

### Erreur: "Database connection failed"

```bash
# Vérifier que DATABASE_URL est correct dans Vercel
# Tester la connexion depuis local
npx prisma db push
```

### Erreur: "Module not found"

```bash
# Rebuild sur Vercel
vercel --prod --force
```

### Erreur: "NextAuth configuration error"

```bash
# Vérifier que NEXTAUTH_URL et NEXTAUTH_SECRET sont définis
# NEXTAUTH_URL doit correspondre à l'URL de production
```

---

## 📝 CHECKLIST FINALE

- [ ] Code pushé sur GitHub
- [ ] Base de données PostgreSQL créée sur Railway
- [ ] DATABASE_URL récupérée depuis Railway
- [ ] Projet Vercel créé et connecté au repo GitHub
- [ ] Variables d'environnement configurées sur Vercel
- [ ] Schéma Prisma poussé vers Railway (`prisma db push`)
- [ ] Premier déploiement Vercel réussi
- [ ] Site accessible sur l'URL Vercel
- [ ] Tests fonctionnels OK
- [ ] Domaine personnalisé configuré (optionnel)

---

## 🎯 COMMANDES RAPIDES

### Déploiement complet en une fois

```bash
# 1. Push sur GitHub
git add .
git commit -m "deploy: initial deployment"
git push origin main

# 2. Vercel déploie automatiquement

# 3. Initialiser la base de données
DATABASE_URL="railway_url" npx prisma db push
DATABASE_URL="railway_url" npm run db:seed
```

---

## 📞 SUPPORT

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs

---

**Status:** ✅ Prêt pour le déploiement
**Temps estimé:** 15-20 minutes
