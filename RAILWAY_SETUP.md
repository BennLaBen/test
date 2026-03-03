# 🚂 CONFIGURATION RAILWAY - ÉTAPE PAR ÉTAPE

## 1️⃣ CRÉER LA BASE DE DONNÉES (2 min)

### Actions à faire:
1. Aller sur **https://railway.app**
2. Se connecter / Créer un compte
3. Cliquer sur **"New Project"**
4. Sélectionner **"Provision PostgreSQL"**
5. Attendre 30 secondes (création automatique)

---

## 2️⃣ RÉCUPÉRER L'URL DE CONNEXION (1 min)

### Dans Railway Dashboard:
1. Cliquer sur votre **PostgreSQL** (icône violette)
2. Aller dans l'onglet **"Connect"**
3. Copier la **"Postgres Connection URL"**

**Format de l'URL:**
```
postgresql://postgres:XXXXX@containers-us-west-123.railway.app:5432/railway
```

⚠️ **IMPORTANT:** Garde cette URL, tu en auras besoin pour Vercel !

---

## 3️⃣ INITIALISER LA BASE DE DONNÉES (2 min)

### Depuis PowerShell (dans d:\MPEB):

```powershell
# Remplacer TON_URL_RAILWAY par l'URL copiée
$env:DATABASE_URL="postgresql://postgres:XXXXX@containers-us-west-123.railway.app:5432/railway"

# Créer les tables
npx prisma db push

# Ajouter les données de test (admin + exemples)
npm run db:seed
```

### Vérifier que ça marche:
```powershell
# Ouvrir Prisma Studio pour voir les données
npx prisma studio
```

Tu devrais voir:
- ✅ Table `User` avec admin
- ✅ Table `Post` avec articles
- ✅ Table `Job` avec offres
- ✅ Table `Company` avec entreprises

---

## 4️⃣ CONFIGURER VERCEL (3 min)

### Vercel devrait déjà être connecté à ton GitHub

1. Aller sur **https://vercel.com/dashboard**
2. Ton projet "test" devrait apparaître
3. Cliquer dessus → **Settings** → **Environment Variables**

### Ajouter ces variables:

```env
# Base de données (copier depuis Railway)
DATABASE_URL=postgresql://postgres:XXXXX@containers-us-west-123.railway.app:5432/railway

# NextAuth (IMPORTANT)
NEXTAUTH_URL=https://test-xxx.vercel.app
NEXTAUTH_SECRET=GENERER_UN_SECRET

# Site
NEXT_PUBLIC_SITE_URL=https://test-xxx.vercel.app
```

### Générer NEXTAUTH_SECRET:
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

---

## 5️⃣ REDÉPLOYER VERCEL (1 min)

### Après avoir ajouté les variables:

1. Aller dans **Deployments**
2. Cliquer sur le dernier déploiement
3. Cliquer sur **"Redeploy"**

Ou depuis PowerShell:
```powershell
vercel --prod
```

---

## ✅ VÉRIFICATIONS

### Tester le site:
```
https://test-xxx.vercel.app
```

### Tester la connexion admin:
```
URL: https://test-xxx.vercel.app/connexion
Email: admin@lledo.com
Password: Admin123!
```

### Vérifier l'admin:
```
https://test-xxx.vercel.app/admin
```

---

## 🚨 SI PROBLÈME

### "Database connection failed"
```powershell
# Vérifier que DATABASE_URL est correct dans Vercel
# Tester depuis local:
$env:DATABASE_URL="ton_url"
npx prisma db push
```

### "NextAuth error"
```
Vérifier que:
- NEXTAUTH_URL = URL exacte Vercel (avec https://)
- NEXTAUTH_SECRET est défini
```

### "Build failed"
```powershell
# Forcer rebuild
vercel --prod --force
```

---

## 📊 RÉSUMÉ

- [x] Code sur GitHub ✅
- [x] Railway PostgreSQL créé (projet: **aerotools-marketplace**)
- [x] DATABASE_URL récupérée et configurée dans `.env.local`
- [x] Base de données initialisée (schema marketplace poussé)
- [x] 24 produits + 4 catégories migrés de JSON vers PostgreSQL
- [ ] Variables Vercel configurées avec Railway URL
- [ ] Site redéployé
- [ ] Tests OK

**Temps total:** ~10 minutes

---

## 🚀 PROJET RAILWAY MARKETPLACE

- **Nom:** aerotools-marketplace
- **ID:** 77815f03-db01-411b-b157-5c7d6b06f7c4
- **URL:** https://railway.com/project/77815f03-db01-411b-b157-5c7d6b06f7c4
- **DB Host:** interchange.proxy.rlwy.net:26967
- **DB Name:** railway

### Modèles marketplace ajoutés au schema Prisma:
- `MarketProduct` — Produits en base (remplace le JSON)
- `MarketCategory` — Catégories produits
- `ProductDocument` — Fiches techniques, certificats PDF
- `Organization` — Comptes entreprise B2B
- `OrganizationUser` — Liaison user ↔ entreprise
- `OrgAddress` — Adresses entreprise
- `Quote` + `QuoteItem` — Devis / RFQ
- `Order` + `OrderItem` — Commandes
- `SerialNumber` — Traçabilité pièces
- `Notification` — Notifications in-app

### API v2 créées:
- `GET/POST /api/v2/products` — Liste + filtres + pagination
- `GET/PATCH/DELETE /api/v2/products/:id` — Produit individuel (slug/id/sku)
- `GET /api/v2/products/categories` — Catégories avec compteurs
- `GET/POST /api/v2/quotes` — Devis RFQ
- `GET/PATCH /api/v2/quotes/:id` — Détail + changement statut
- `GET/POST /api/v2/orders` — Commandes
- `GET /api/v2/traceability?serial=XXX` — Traçabilité

### Pages front créées:
- `/rfq` — Formulaire de demande de devis structuré
- `/certifications` — Page certifications avec PDFs
- `/traceability` — Recherche par numéro de série
- `/dashboard/buyer` — Espace acheteur (devis + commandes)
- `/admin/quotes` — Dashboard admin gestion devis

### Commande seed:
```powershell
$env:DATABASE_URL="postgresql://postgres:XXX@interchange.proxy.rlwy.net:26967/railway"
npx tsx prisma/seed-marketplace.ts
```
