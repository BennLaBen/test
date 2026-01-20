# 🚀 COMMANDES DE DÉPLOIEMENT - COPIER/COLLER

## ⚡ DÉPLOIEMENT AUTOMATIQUE (RECOMMANDÉ)

### Windows PowerShell
```powershell
.\deploy.ps1
```

---

## 📝 DÉPLOIEMENT MANUEL (ÉTAPE PAR ÉTAPE)

### 1️⃣ RAILWAY - Base de données (5 min)

**Actions à faire sur https://railway.app:**
1. Créer un compte / Se connecter
2. Cliquer sur "New Project"
3. Sélectionner "Provision PostgreSQL"
4. Attendre la création (30 secondes)
5. Cliquer sur PostgreSQL → "Connect" → Copier "Postgres Connection URL"

**Exemple d'URL:**
```
postgresql://postgres:aBcD1234@containers-us-west-123.railway.app:5432/railway
```

---

### 2️⃣ GITHUB - Push du code (2 min)

```powershell
# Initialiser Git (si pas déjà fait)
git init
git add .
git commit -m "deploy: initial deployment"

# Créer un repo sur GitHub puis:
git remote add origin https://github.com/TON-USERNAME/lledo-industries.git
git branch -M main
git push -u origin main
```

---

### 3️⃣ VERCEL - Déploiement frontend (5 min)

#### Option A: Via Dashboard (Plus simple)
1. Aller sur https://vercel.com/new
2. Se connecter avec GitHub
3. Importer le repo "lledo-industries"
4. Configurer les variables d'environnement (voir ci-dessous)
5. Cliquer "Deploy"

#### Option B: Via CLI
```powershell
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
vercel --prod
```

---

### 4️⃣ VARIABLES D'ENVIRONNEMENT VERCEL

**À ajouter dans Vercel Dashboard → Settings → Environment Variables:**

```env
# Base de données (copier depuis Railway)
DATABASE_URL=postgresql://postgres:xxx@containers-us-west-xxx.railway.app:5432/railway

# NextAuth (IMPORTANT)
NEXTAUTH_URL=https://TON-PROJET.vercel.app
NEXTAUTH_SECRET=GENERER_UN_SECRET_ICI

# Site
NEXT_PUBLIC_SITE_URL=https://TON-PROJET.vercel.app

# Email (Optionnel - pour formulaire contact)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=ton-email@gmail.com
EMAIL_SERVER_PASSWORD=ton-mot-de-passe-app
EMAIL_FROM=noreply@lledo-industries.com
```

**Générer NEXTAUTH_SECRET:**
```powershell
# PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

---

### 5️⃣ INITIALISER LA BASE DE DONNÉES (3 min)

```powershell
# Remplacer URL_RAILWAY par ton URL Railway
$env:DATABASE_URL="postgresql://postgres:xxx@containers-us-west-xxx.railway.app:5432/railway"

# Pousser le schéma
npx prisma db push

# Seed les données (admin + exemples)
npm run db:seed

# Vérifier (optionnel)
npx prisma studio
```

---

## ✅ VÉRIFICATIONS POST-DÉPLOIEMENT

### Tester le site
```
https://ton-projet.vercel.app
```

**Checklist:**
- [ ] Page d'accueil charge
- [ ] Navigation fonctionne
- [ ] Images s'affichent
- [ ] Connexion admin: `/connexion`
  - Email: `admin@lledo.com`
  - Password: `Admin123!`
- [ ] Interface admin: `/admin`
- [ ] Blog affiche articles
- [ ] Responsive mobile

### Voir les logs
```powershell
# Vercel logs
vercel logs

# Ou dans Dashboard
# https://vercel.com/dashboard → Deployments → Logs
```

---

## 🔄 REDÉPLOYER APRÈS MODIFICATIONS

```powershell
# Méthode rapide
git add .
git commit -m "fix: correction bug"
git push origin main
# Vercel redéploie automatiquement

# Ou avec le script
.\deploy.ps1
```

---

## 🌍 DOMAINE PERSONNALISÉ (Optionnel)

### Ajouter lledo-industries.com

1. Vercel Dashboard → Settings → Domains
2. Ajouter "lledo-industries.com"
3. Configurer DNS chez ton registrar:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

4. Attendre propagation DNS (5-30 min)

---

## 🚨 PROBLÈMES COURANTS

### "Database connection failed"
```powershell
# Vérifier DATABASE_URL dans Vercel
# Tester connexion:
$env:DATABASE_URL="ton_url"
npx prisma db push
```

### "NextAuth configuration error"
```
Vérifier que NEXTAUTH_URL = URL exacte Vercel
Vérifier que NEXTAUTH_SECRET est défini
```

### "Build failed"
```powershell
# Forcer rebuild
vercel --prod --force
```

### "Module not found"
```powershell
# Nettoyer et réinstaller
rm -rf node_modules
rm package-lock.json
npm install
git add .
git commit -m "fix: dependencies"
git push
```

---

## 📞 LIENS UTILES

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Railway Dashboard:** https://railway.app/dashboard
- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **Prisma Docs:** https://prisma.io/docs

---

## ⏱️ TEMPS ESTIMÉ

- Railway setup: **5 min**
- GitHub push: **2 min**
- Vercel deploy: **5 min**
- Database init: **3 min**
- **TOTAL: ~15 minutes**

---

## 🎯 COMMANDE ULTRA-RAPIDE (tout en une fois)

```powershell
# 1. Configurer Railway (manuel)
# 2. Copier DATABASE_URL
# 3. Exécuter:

git add . && git commit -m "deploy: production" && git push origin main
$env:DATABASE_URL="TON_URL_RAILWAY"
npx prisma db push
npm run db:seed
vercel --prod

# 4. Ajouter variables dans Vercel Dashboard
# 5. Redéployer: vercel --prod
```

---

**✨ C'est tout ! Ton site sera en ligne en 15 minutes.**
