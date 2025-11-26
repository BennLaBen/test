# 🏭 LLEDO Industries - Site Web Officiel

Site web moderne et performant pour LLEDO Industries, leader français en usinage de précision, tôlerie, maintenance industrielle et conception mécanique pour l'aéronautique et la défense.

## 🚀 Technologies

- **Next.js 14** - App Router, React Server Components
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling moderne
- **Framer Motion** - Animations fluides
- **React i18next** - Internationalisation (FR/EN)
- **Lucide Icons** - Icônes modernes

## ✨ Fonctionnalités

### 🎨 Design & UX
- ✅ Design industriel moderne avec glass-morphism
- ✅ Animations Framer Motion ultra-fluides
- ✅ Dark mode & Light mode
- ✅ Effets industriels (tech-corners, circuits, grilles)
- ✅ **100% Responsive** - Optimisé mobile (iOS & Android)
- ✅ Touch-optimized (44px tap targets)

### 🔐 Authentification
- ✅ Système d'inscription/connexion
- ✅ Profil utilisateur avec avatar
- ✅ Modals modernes avec validation
- ✅ Stockage sécurisé (localStorage)

### ⭐ Avis Clients
- ✅ Système de notation 5 étoiles
- ✅ Formulaire d'avis protégé (connexion requise)
- ✅ Filtrage par secteur d'activité
- ✅ Modération avant publication

### 📥 Téléchargements Protégés
- ✅ Plaquettes commerciales
- ✅ Documents techniques
- ✅ Accès après connexion uniquement

### 📱 Mobile-First
- ✅ Menu hamburger moderne
- ✅ Navigation tactile optimale
- ✅ Safe areas iPhone (notch)
- ✅ Smooth scroll Android
- ✅ Performance GPU optimisée

### 🌐 SEO & Performance
- ✅ Métadonnées optimisées
- ✅ Open Graph & Twitter Cards
- ✅ JSON-LD structured data
- ✅ Sitemap.xml dynamique
- ✅ Robots.txt
- ✅ RSS Feed
- ✅ Image optimization
- ✅ Lazy loading

### 📝 Blog
- ✅ Articles MDX
- ✅ Tags et catégories
- ✅ Articles à la une
- ✅ Lecture estimée
- ✅ Partage social
- ✅ Articles connexes
- ✅ Navigation précédent/suivant

### 🏢 Pages
- ✅ Homepage avec sections animées
- ✅ Notre Vision
- ✅ Nos Expertises
- ✅ Cas Clients avec statistiques
- ✅ Carrière avec formulaire
- ✅ Contact avec carte
- ✅ Blog avec filtres
- ✅ Pages filiales (MPEB, MGP, EGI, FREM)
- ✅ LLEDO Aerotools (produits GSE)

## 📦 Installation

```bash
# Cloner le repo
git clone https://github.com/votre-username/lledo-industries.git
cd lledo-industries

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build pour production
npm run build

# Démarrer en production
npm start
```

## 🌍 Variables d'Environnement

Créer un fichier `.env.local` :

```env
# Site URL
NEXT_PUBLIC_SITE_URL=https://lledo-industries.com

# Google Tag Manager (optionnel)
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Contact Email
NEXT_PUBLIC_CONTACT_EMAIL=contact@lledo-industries.com
```

## 📁 Structure du Projet

```
lledo-industries/
├── src/
│   ├── app/                    # App Router (Next.js 14)
│   │   ├── page.tsx           # Homepage
│   │   ├── notre-vision/      # Notre Vision
│   │   ├── nos-expertises/    # Nos Expertises
│   │   ├── cas-clients/       # Cas Clients
│   │   ├── carriere/          # Recrutement
│   │   ├── contact/           # Contact
│   │   ├── blog/              # Blog
│   │   └── api/               # API Routes
│   │       └── reviews/       # API Avis clients
│   ├── components/            # Composants React
│   │   ├── auth/              # Auth components
│   │   │   └── AuthModal.tsx  # Modal connexion/inscription
│   │   ├── sections/          # Sections homepage
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   └── DownloadBrochure.tsx
│   │   ├── Navigation.tsx     # Navigation responsive
│   │   ├── Footer.tsx
│   │   └── SEO.tsx
│   ├── contexts/              # React Contexts
│   │   └── AuthContext.tsx   # Authentification
│   ├── lib/                   # Utilitaires
│   │   ├── posts.ts          # Blog utilities
│   │   ├── jsonLd.ts         # SEO structured data
│   │   └── i18n.ts           # i18n config
│   └── styles/
│       └── globals.css       # Styles globaux + Mobile
├── content/
│   └── blog/                 # Articles MDX
├── public/
│   ├── images/              # Images
│   └── logo.png
├── next.config.js
├── tailwind.config.js
└── package.json
```

## 🚀 Déploiement sur Vercel

### Option 1 : Via l'interface Vercel (Recommandé)

1. Aller sur [vercel.com](https://vercel.com)
2. Cliquer "Import Project"
3. Connecter votre repo GitHub
4. Configurer :
   - **Framework Preset** : Next.js
   - **Build Command** : `npm run build`
   - **Output Directory** : `.next`
5. Ajouter les variables d'environnement
6. Cliquer "Deploy" 🚀

### Option 2 : Via Vercel CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Déployer en production
vercel --prod
```

## 📊 Performance

- ✅ **Lighthouse Score** : 95+ sur tous les critères
- ✅ **First Contentful Paint** : < 1.5s
- ✅ **Time to Interactive** : < 3s
- ✅ **Cumulative Layout Shift** : < 0.1
- ✅ **Mobile Optimized** : 100%

## 🔧 Scripts Disponibles

```bash
npm run dev          # Développement (localhost:3000)
npm run build        # Build production
npm start            # Démarrer production
npm run lint         # Linter ESLint
npm run type-check   # TypeScript check
```

## 📱 Support Mobile

### iOS (Safari, Chrome)
- ✅ iPhone SE → iPhone 15 Pro Max
- ✅ iPad & iPad Pro
- ✅ Safe areas (notch)
- ✅ Webkit optimizations
- ✅ No zoom sur inputs

### Android (Chrome, Samsung Internet)
- ✅ Tous modèles (Samsung, Google, OnePlus, etc.)
- ✅ Smooth scrolling
- ✅ Touch optimizations
- ✅ Hardware acceleration

## 🌐 Internationalisation

Le site supporte :
- 🇫🇷 **Français** (par défaut)
- 🇬🇧 **Anglais**

Traductions dans : `public/locales/`

## 🔒 Sécurité

- ✅ Headers de sécurité (CSP, X-Frame-Options)
- ✅ Validation des formulaires
- ✅ Protection CSRF
- ✅ Sanitization des inputs
- ✅ HTTPS uniquement

## 📞 Contact

**LLEDO Industries**
- 🌐 Site : [lledo-industries.com](https://lledo-industries.com)
- 📧 Email : contact@lledo-industries.com
- 📍 Adresse : 9-11 Boulevard de la Capelane, 13170 Les Pennes-Mirabeau
- 📞 Téléphone : +33 (4) 42 02 96 74

## 📄 Licence

© 2024 LLEDO Industries. Tous droits réservés.

---

**Développé avec ❤️ pour LLEDO Industries**
*36 ans d'excellence industrielle française*
