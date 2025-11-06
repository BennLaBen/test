# 🚁 LLEDO Industries - Site Web Officiel

Site web premium pour **LLEDO Industries**, leader français des outillages aéronautiques et équipements GSE pour hélicoptères.

![Next.js](https://img.shields.io/badge/Next.js-14.0.4-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.0-06B6D4?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-Proprietary-red?style=flat-square)

## 🎯 Aperçu

Site vitrine haute performance avec :
- ✅ **AEROTOOLS** : 8 produits GSE (barres de remorquage + rollers hydrauliques)
- ✅ **4 Filiales** : AEROTOOLS, ENERGY, DEFENSE, MARINE
- ✅ **Blog** : 8 articles (FR + EN) ~20 000 mots
- ✅ **Cas clients** : 3 études de cas détaillées
- ✅ **SEO maximal** : Lighthouse 100, JSON-LD, sitemap, RSS
- ✅ **i18n** : Français/Anglais
- ✅ **Dark mode** : Avec persistence
- ✅ **Animations** : Framer Motion

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+ 
- npm ou yarn

### Installation

\`\`\`bash
# Cloner le repo
git clone https://github.com/lledo-industries/website.git
cd website

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
\`\`\`

Ouvrir [http://localhost:3000](http://localhost:3000)

### Build production

\`\`\`bash
# Build optimisé
npm run build

# Lancer en production
npm run start
\`\`\`

## 📁 Structure du projet

\`\`\`
lledo-industries/
├── src/
│   ├── app/                    # App Router Next.js 14
│   │   ├── aerotools/          # 🆕 Produits GSE
│   │   │   ├── [slug]/         # Pages produits dynamiques
│   │   │   └── page.tsx        # Liste produits
│   │   ├── filiales/           # 4 filiales détaillées
│   │   ├── cas-clients/        # Études de cas
│   │   ├── blog/               # Blog MDX
│   │   │   ├── [slug]/         # Articles individuels
│   │   │   └── page.tsx        # Liste articles
│   │   ├── contact/            # Formulaire contact
│   │   ├── carriere/           # Recrutement
│   │   ├── sitemap.ts          # Sitemap dynamique
│   │   ├── robots.ts           # Robots.txt
│   │   └── feed.xml/           # RSS feed
│   ├── components/             # Composants réutilisables
│   │   ├── sections/           # Sections homepage
│   │   ├── Navigation.tsx      # Header sticky
│   │   ├── Footer.tsx          # Footer complet
│   │   ├── SEO.tsx             # Composant SEO
│   │   └── ProductImagePlaceholder.tsx  # Images produits
│   ├── lib/                    # Utilitaires
│   │   ├── aerotoolsData.ts   # 🆕 Base produits AEROTOOLS
│   │   ├── blogData.ts         # Base articles blog
│   │   ├── jsonLd.ts           # Générateur JSON-LD
│   │   └── i18n.ts             # Config i18n
│   └── styles/
│       └── globals.css         # Styles globaux
├── content/
│   └── posts/                  # Articles blog (MDX)
│       ├── fr/                 # 5 articles français
│       └── en/                 # 3 articles anglais
├── public/
│   ├── images/
│   │   └── aerotools/          # 🆕 Images produits GSE
│   └── favicon.ico
├── scripts/
│   └── download-aerotools-images.js  # Script téléchargement images
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
\`\`\`

## 🛠️ Technologies

### Core
- **Next.js 14** - App Router, React Server Components
- **TypeScript 5.3** - Type safety strict
- **React 18** - Concurrent features

### Styling
- **TailwindCSS 3.4** - Utility-first CSS
- **Framer Motion 10** - Animations fluides
- **next-themes** - Dark mode

### Content & Data
- **MDX** - Markdown avec composants React
- **Zod** - Validation schéma
- **React Hook Form** - Formulaires performants

### SEO & Analytics
- **next-seo** - Metadata API
- **JSON-LD** - Structured data (7 types)
- **Sitemap dynamique** - Auto-généré
- **RSS feed** - Blog syndication
- **Google Tag Manager** - Analytics

### i18n
- **i18next** - Internationalisation
- **react-i18next** - React bindings

### Dev Tools
- **ESLint** - Linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking

## 📦 AEROTOOLS - Produits GSE

### 8 produits disponibles

#### Barres de remorquage (5)
1. **BR-B332** - EC225 / AS332 (3 variantes)
2. **BR-H160** - H160 (5 variantes)
3. **BR-NH90** - NH90 militaire
4. **BR-H175** - H175 (2 variantes)
5. **BR-BHHL** - Bell 212/412/429

#### Rollers hydrauliques (3)
1. **RL-R125** - H125/AS350/EC130 - **16 500 €**
2. **RL-R130** - EC130 - **15 800 €**
3. **RL-GAZELLE** - SA341/342 - **12 500 €**

### Routes

\`\`\`
/aerotools                    → Liste produits
/aerotools/rl-r125           → Détail RL-R125
/aerotools/br-h160           → Détail BR-H160
/aerotools/br-b332           → Détail BR-B332
/aerotools/br-nh90           → Détail BR-NH90
/aerotools/br-h175           → Détail BR-H175
/aerotools/br-bhhl           → Détail BR-BHHL
/aerotools/rl-r130           → Détail RL-R130
/aerotools/rl-gazelle        → Détail Rollers GAZELLE
\`\`\`

## 🎨 Design

### Thème
- **Primary** : Blue-700 (#0c4a6e)
- **Accent** : Primary-600
- **Gradient** : from-primary-600 to-primary-800
- **Dark mode** : Automatic avec toggle

### Typography
- **Font** : Inter (Variable font)
- **Headings** : Bold, tracking-tight
- **Body** : Regular, leading-relaxed

### Composants
- Cards avec hover effects
- Breadcrumbs
- Badges & Pills
- Accordéons (FAQ)
- Formulaires validés
- Modals
- Toasts (à implémenter)

## 🔍 SEO

### Metadata
- **Title** : Optimisés pour chaque page
- **Description** : 150-160 caractères
- **Open Graph** : Images, title, description
- **Twitter Cards** : Summary large image

### JSON-LD (7 types)
1. **Organization** - Infos entreprise
2. **Product** - Fiches produits
3. **Article** - Articles blog
4. **FAQPage** - Questions/réponses
5. **BreadcrumbList** - Fil d'Ariane
6. **WebPage** - Pages génériques
7. **LocalBusiness** - Infos locales

### Performance
- **Images** : Next/Image avec lazy loading
- **Fonts** : font-display: swap
- **Code splitting** : Automatique
- **Prefetching** : Links automatiques

### Fichiers SEO
- \`sitemap.xml\` - Toutes les pages
- \`robots.txt\` - Directives crawlers
- \`feed.xml\` - RSS blog

## 📝 Blog

### Structure
- **8 articles** (~20 000 mots)
- **5 français** : Guide GSE, Maintenance, RL125-02, etc.
- **3 anglais** : Traductions + contenu original

### Fonctionnalités
- Liste avec filtres
- Pages détails avec breadcrumbs
- Estimated reading time
- Tags
- Social sharing
- RSS feed
- JSON-LD Article

## 🌍 Internationalisation

### Locales supportées
- 🇫🇷 **Français** (par défaut)
- 🇬🇧 **Anglais**

### Détection
- URL-based : \`/en/...\`
- Fallback : Français

### Traductions
- Navigation
- Footer
- CTA
- Formulaires
- Messages d'erreur

## 📧 Contact

### Formulaire
- **Validation** : Zod + React Hook Form
- **Champs** : Nom, Email, Entreprise, Message
- **Envoi** : Nodemailer (API route)
- **Captcha** : À implémenter (hCaptcha/reCAPTCHA)

### Infos contact
- **Téléphone** : +33 4 42 02 96 74
- **Email** : contact@lledo-industries.com
- **Adresse** : 9-11 Bd de la Capelane, 13170 Les Pennes-Mirabeau
- **Horaires** : Lun-Ven 8h-18h

## 🚢 Déploiement

### Vercel (recommandé)

\`\`\`bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
\`\`\`

### Variables d'environnement

\`\`\`.env.local
# Google Tag Manager
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Email (Nodemailer)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=contact@lledo-industries.com
EMAIL_PASSWORD=your-password
EMAIL_FROM=contact@lledo-industries.com
EMAIL_TO=contact@lledo-industries.com
\`\`\`

### Autres plateformes
- **Netlify** : Compatible
- **AWS Amplify** : Compatible
- **Docker** : Dockerfile disponible

## 🧪 Tests

\`\`\`bash
# Linting
npm run lint

# Type checking
npm run type-check

# Build test
npm run build
\`\`\`

## 📊 Lighthouse Scores (objectifs)

- ⚡ **Performance** : 90+
- ♿ **Accessibility** : 95+
- 🎯 **Best Practices** : 95+
- 🔍 **SEO** : 100

## 🤝 Contribution

Ce projet est propriétaire de LLEDO Industries.

## 📄 License

© 2024 LLEDO Industries. Tous droits réservés.

## 🔗 Liens

- **Site web** : https://lledo-industries.com
- **AEROTOOLS** : https://lledo-industries.com/aerotools
- **LinkedIn** : https://www.linkedin.com/company/lledo-industries
- **YouTube** : https://www.youtube.com/channel/lledo-industries

---

**Développé avec ❤️ pour LLEDO Industries**

_L'esprit Métal au service de l'aéronautique_ ✈️🔧
