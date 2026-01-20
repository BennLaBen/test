# 🚀 Guide d'installation - LLEDO Industries

Ce guide explique comment configurer et déployer le site LLEDO Industries avec les espaces Recrutement, Client et Admin.

## Prérequis

- Node.js 18+
- PostgreSQL (Supabase ou Neon recommandé)
- npm ou yarn

## 1. Installation des dépendances

```bash
npm install
```

## 2. Configuration de l'environnement

Copier le fichier d'exemple et configurer les variables :

```bash
cp env.example .env
```

### Variables obligatoires :

```env
# Base de données PostgreSQL
DATABASE_URL="postgresql://user:password@host:5432/database"

# Secret NextAuth (générer avec: openssl rand -base64 32)
AUTH_SECRET="votre-secret-de-32-caracteres-minimum"
NEXTAUTH_URL=http://localhost:3000

# Compte administrateur initial
ADMIN_EMAIL=admin@lledo-industries.com
ADMIN_PASSWORD=VotreMotDePasseSecurise123!
```

## 3. Configuration de la base de données

### Option A : Développement rapide (db push)

```bash
npm run db:push
```

### Option B : Production (migrations)

```bash
npm run db:migrate
```

### Générer le client Prisma

```bash
npm run db:generate
```

### Créer le compte admin + données de test

```bash
npm run db:seed
```

## 4. Lancer le serveur de développement

```bash
npm run dev
```

Le site est accessible sur http://localhost:3000

## 📁 Structure des nouvelles fonctionnalités

```
src/
├── app/
│   ├── admin/                 # 🔐 Back-office admin
│   │   ├── page.tsx           # Dashboard
│   │   ├── offres/            # CRUD offres d'emploi
│   │   ├── candidatures/      # Gestion candidatures
│   │   ├── blog/              # CRUD articles
│   │   └── avis/              # Modération avis
│   │
│   ├── espace-client/         # 👤 Espace client authentifié
│   │   ├── page.tsx           # Dashboard client
│   │   └── profil/            # Gestion profil
│   │
│   ├── carriere/              # 💼 Section recrutement (public)
│   │   ├── page.tsx           # Liste des offres
│   │   ├── [slug]/            # Détail offre
│   │   └── postuler/[slug]/   # Formulaire candidature
│   │
│   ├── connexion/             # 🔑 Page de connexion
│   ├── inscription/           # 📝 Page d'inscription
│   │
│   └── api/
│       ├── auth/              # NextAuth endpoints
│       ├── jobs/              # API offres d'emploi
│       ├── applications/      # API candidatures
│       ├── upload/            # Upload fichiers (CV)
│       └── admin/             # API admin protégées
│
├── lib/
│   ├── prisma.ts              # Client Prisma
│   └── auth.ts                # Configuration NextAuth
│
└── middleware.ts              # Protection des routes
```

## 🔐 Accès et rôles

### Client (role: CLIENT)
- Créer un compte / se connecter
- Postuler aux offres d'emploi
- Suivre ses candidatures
- Gérer son profil
- Laisser des avis

### Admin (role: ADMIN)
- Accès au dashboard `/admin`
- CRUD complet sur les offres d'emploi
- Gestion des candidatures (statuts, notes)
- CRUD articles de blog
- Modération des avis clients
- Gestion des utilisateurs

## 📦 Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lancer en développement |
| `npm run build` | Build production |
| `npm run db:generate` | Générer le client Prisma |
| `npm run db:push` | Synchroniser le schéma (dev) |
| `npm run db:migrate` | Créer une migration (prod) |
| `npm run db:seed` | Peupler la BDD (admin + données test) |
| `npm run db:studio` | Interface visuelle Prisma |

## 🚀 Déploiement sur Vercel

1. Connecter le repo à Vercel
2. Ajouter les variables d'environnement :
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
3. Dans les Build Settings, ajouter :
   ```
   Build Command: prisma generate && next build
   ```
4. Déployer !

### Post-déploiement

Exécuter le seed pour créer l'admin :
```bash
npx prisma db seed
```

## 📱 Routes principales

| Route | Accès | Description |
|-------|-------|-------------|
| `/` | Public | Page d'accueil |
| `/carriere` | Public | Liste des offres |
| `/carriere/[slug]` | Public | Détail d'une offre |
| `/carriere/postuler/[slug]` | Public | Formulaire candidature |
| `/connexion` | Public | Connexion |
| `/inscription` | Public | Inscription |
| `/espace-client` | Auth | Dashboard client |
| `/espace-client/profil` | Auth | Profil utilisateur |
| `/admin` | Admin | Dashboard admin |
| `/admin/offres` | Admin | Gestion offres |
| `/admin/candidatures` | Admin | Gestion candidatures |
| `/admin/blog` | Admin | Gestion blog |
| `/admin/avis` | Admin | Modération avis |

## 🔧 Dépannage

### Erreur "PrismaClient not found"
```bash
npm run db:generate
```

### Erreur de connexion à la BDD
Vérifier que `DATABASE_URL` est correctement configuré dans `.env`

### Erreur d'authentification
Vérifier que `AUTH_SECRET` est défini (min 32 caractères)

### Le seed ne fonctionne pas
```bash
npm install -D ts-node
npm run db:seed
```

## 📞 Support

Pour toute question, contacter : contact@mpeb13.com
