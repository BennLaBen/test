# 🚂 RAILWAY — Setup complet (LLEDO Industries + Aerotools)

> **Repo GitHub:** `BennLaBen/test`
> **Tout est dans un seul projet Railway** — app + base de données

---

## 🏗️ ÉTAPE 1 — Créer le projet Railway (5 min)

1. Aller sur **https://railway.app** → Se connecter
2. **New Project** → **Deploy from GitHub repo** → sélectionner `BennLaBen/test`
3. Railway va créer un service "test" automatiquement
4. **Ajouter PostgreSQL** dans le même projet :
   - Cliquer **"+ New"** dans le projet → **"Database"** → **"PostgreSQL"**
   - Railway crée la DB et injecte automatiquement `DATABASE_URL`

---

## 🔧 ÉTAPE 2 — Variables d'environnement

Dans le service **test** → onglet **Variables**, ajouter :

```env
# ── Database (AUTO si PostgreSQL ajouté au projet) ──
DATABASE_URL=${{Postgres.DATABASE_URL}}

# ── Auth ──
JWT_SECRET=changer-ce-secret-en-production-64-chars-minimum
ENCRYPTION_KEY=changer-32-characters-encryption

# ── Site ──
NEXT_PUBLIC_APP_URL=https://lledo-industries.com
NODE_ENV=production

# ── Email (SMTP) ──
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-email-password
SMTP_FROM=noreply@lledo-industries.com

# ── SendGrid (optionnel) ──
SENDGRID_API_KEY=SG.xxxxxxxxxxxx

# ── Vercel Blob (pour turntable 3D) ──
BLOB_READ_WRITE_TOKEN=vercel_blob_xxxxx

# ── Seed secret (pour initialiser la DB) ──
SEED_SECRET=lledo-seed-2026
```

> ⚠️ Si tu as déjà un PostgreSQL Railway existant, utilise son URL directement au lieu de la référence `${{Postgres.DATABASE_URL}}`

---

## 🚀 ÉTAPE 3 — Deploy & Seed

Railway va build automatiquement grâce au `railway.toml` :
- `prisma db push` → crée les tables
- `prisma generate` → génère le client
- `next build` → build l'app

### Après le premier deploy réussi, initialiser les données :

Ouvrir dans le navigateur :
```
https://TON-URL-RAILWAY/api/setup/seed-all?key=lledo-seed-2026
```

Cela va créer :
- ✅ 1 admin user (`admin@lledo-industries.com` / `Admin123!`)
- ✅ 4 entreprises (MPEB, MGP, EGI, FREM)
- ✅ 2 offres d'emploi
- ✅ 1 article de blog
- ✅ 4 catégories marketplace
- ✅ 23 produits Aerotools

---

## ✅ VÉRIFICATIONS

| Test | URL |
|------|-----|
| Site | `https://TON-URL/` |
| Boutique | `https://TON-URL/boutique` |
| Admin login | `https://TON-URL/connexion` → `admin@lledo-industries.com` / `Admin123!` |
| API produits | `https://TON-URL/api/v2/products` |

---

## � CONTENU DU PROJET

### Base de données (30+ modèles Prisma) :
- **Auth** : User, Session, Account, EmailConfirmation, LoginOTP, PasswordReset
- **Admin** : Admin, AdminSession, SecurityLog, ActivationToken, EmailOTP
- **CMS** : BlogPost, Review, Company, ContactRequest, Media, Job, Application
- **Marketplace** : MarketProduct, MarketCategory, ProductDocument
- **B2B** : Organization, OrganizationUser, OrgAddress, Quote, QuoteItem, Order, OrderItem
- **Traçabilité** : SerialNumber, Notification
- **Analytics** : PageView, RateLimitRecord

### API (78 routes) :
- `/api/v2/products` — Produits marketplace (CRUD + filtres)
- `/api/v2/quotes` — Devis RFQ
- `/api/v2/orders` — Commandes
- `/api/v2/traceability` — Traçabilité par numéro de série
- `/api/admin/*` — Admin CMS (blog, reviews, companies, media)
- `/api/admin-auth/*` — Auth admin (login, 2FA, sessions)
- `/api/auth/*` — Auth client (register, login OTP, reset password)
- `/api/aerotools/*` — Turntable 3D, modèles STL
- `/api/contact` — Formulaire de contact
- `/api/analytics/*` — Tracking analytics

### Pages front :
- `/boutique` — Catalogue Aerotools
- `/boutique/[slug]` — Fiche produit (3D viewer, 360°, photos)
- `/rfq` — Demande de devis structurée
- `/certifications` — Page certifications
- `/traceability` — Recherche par n° de série
- `/dashboard/buyer` — Espace acheteur
- `/admin/*` — Dashboard admin complet

---

## 🚨 DÉPANNAGE

### Build failed
```
Vérifier que DATABASE_URL est défini dans les variables Railway
```

### Database connection error
```powershell
# Tester depuis local :
$env:DATABASE_URL="postgresql://postgres:XXX@HOST:PORT/railway"
npx prisma db push
npx prisma studio
```

### Re-seed la base
```
https://TON-URL/api/setup/seed-all?key=lledo-seed-2026
```
