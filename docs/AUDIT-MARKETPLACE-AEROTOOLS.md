# 🔎 AUDIT STRATÉGIQUE COMPLET — MARKETPLACE AEROTOOLS

> **Date** : Mars 2026
> **Périmètre** : Analyse complète du codebase `lledo-industries` (Next.js 14 / PostgreSQL / Vercel)
> **Objectif** : Transformer la vitrine Aerotools en marketplace B2B aéronautique compétitive

---

## TABLE DES MATIÈRES

1. [Audit Structurel — Pages existantes vs manquantes](#1-audit-structurel)
2. [Audit Fonctionnel — Features B2B](#2-audit-fonctionnel)
3. [Audit UX/UI — Est-ce une vraie marketplace ?](#3-audit-uxui)
4. [Audit Technique](#4-audit-technique)
5. [Audit Business Model](#5-audit-business-model)
6. [Stratégie pour concurrencer Airbus](#6-stratégie-concurrentielle)
7. [Architecture idéale du site final](#7-architecture-cible)
8. [Roadmap de transformation](#8-roadmap)
9. [Synthèse & Livrables](#9-synthèse)

---

## 1. AUDIT STRUCTUREL

### 1.1 Pages actuellement existantes

| Route | Fichier | Description | Statut |
|-------|---------|-------------|--------|
| `/` | `app/page.tsx` | Page d'accueil Groupe LLEDO | ✅ Existe |
| `/boutique` | `app/boutique/page.tsx` | Vitrine Aerotools (hero + catalogue inline) | ✅ Existe |
| `/boutique/[slug]` | `app/boutique/[slug]/page.tsx` | Fiche produit détaillée | ✅ Existe |
| `/boutique/catalogue` | `app/boutique/catalogue/page.tsx` | Catalogue avec filtres avancés | ✅ Existe |
| `/boutique/panier` | `app/boutique/panier/page.tsx` | Panier / liste de devis | ✅ Existe |
| `/boutique/checkout` | `app/boutique/checkout/page.tsx` | Formulaire demande de devis | ✅ Existe |
| `/boutique/admin` | `app/boutique/admin/page.tsx` | Admin produits Aerotools | ✅ Existe |
| `/aerotools` | `app/aerotools/page.tsx` | Page vitrine Aerotools (landing) | ✅ Existe |
| `/contact` | `app/contact/page.tsx` | Formulaire de contact | ✅ Existe |
| `/blog` | `app/blog/page.tsx` | Blog / actualités | ✅ Existe |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | Article de blog | ✅ Existe |
| `/connexion` | `app/connexion/page.tsx` | Connexion client | ✅ Existe |
| `/inscription` | `app/inscription/page.tsx` | Inscription client | ✅ Existe |
| `/espace-client` | `app/espace-client/page.tsx` | Dashboard client (candidatures) | ✅ Existe |
| `/espace-client/profil` | `app/espace-client/profil/page.tsx` | Profil client | ✅ Existe |
| `/admin` | `app/admin/page.tsx` | Dashboard admin général | ✅ Existe |
| `/admin/aerotools` | `app/admin/aerotools/page.tsx` | Gestion produits Aerotools | ✅ Existe |
| `/admin/blog` | `app/admin/blog/page.tsx` | Gestion blog | ✅ Existe |
| `/admin/entreprises` | `app/admin/entreprises/page.tsx` | Gestion sociétés du groupe | ✅ Existe |
| `/admin/medias` | `app/admin/medias/page.tsx` | Médiathèque | ✅ Existe |
| `/admin/analytics` | `app/admin/analytics/page.tsx` | Analytics | ✅ Existe |
| `/admin/security` | `app/admin/security/page.tsx` | Dashboard sécurité | ✅ Existe |
| `/admin/admins` | `app/admin/admins/page.tsx` | Gestion des admins | ✅ Existe |
| `/admin/avis` | `app/admin/avis/page.tsx` | Modération avis | ✅ Existe |
| `/carriere` | `app/carriere/page.tsx` | Offres d'emploi | ✅ Existe |
| `/nos-expertises` | `app/nos-expertises/page.tsx` | Expertises du groupe | ✅ Existe |
| `/notre-vision` | `app/notre-vision/page.tsx` | Vision du groupe | ✅ Existe |
| `/societes/[slug]` | `app/societes/[slug]/page.tsx` | Pages sociétés (MPEB, EGI, FREM) | ✅ Existe |
| `/plaquette` | `app/plaquette/page.tsx` | Plaquette téléchargeable | ✅ Existe |
| `/cas-clients` | `app/cas-clients/page.tsx` | Cas clients / témoignages | ✅ Existe |

### 1.2 Pages MANQUANTES — Critiques pour une marketplace B2B

| Page manquante | Priorité | Pourquoi c'est essentiel |
|----------------|----------|--------------------------|
| **`/rfq` (Request For Quotation)** | 🔴 CRITIQUE | Standard B2B aéro. Les acheteurs veulent soumettre un RFQ structuré (pas juste un formulaire contact). Doit inclure : type d'appareil, quantités, délai souhaité, pièces jointes (plans, specs). C'est le nerf de la guerre en B2B industriel. |
| **`/certifications`** | 🔴 CRITIQUE | Page dédiée aux certifications (EN 9100, ISO 9001, Directive 2006/42/CE, marquage CE). Doit permettre le téléchargement des certificats PDF. En aéro, **pas de certificat = pas de confiance = pas de commande**. |
| **`/traceability` (Traçabilité)** | 🔴 CRITIQUE | Traçabilité des pièces par numéro de série / lot. Essentiel pour MRO et conformité EASA. Airbus impose la traçabilité complète à ses fournisseurs. |
| **`/compliance` (Conformité & Export)** | 🔴 CRITIQUE | Page conformité ITAR, EAR, réglementation export contrôle. Si vous vendez à l'international (militaire notamment), cette page est légalement obligatoire. |
| **`/dashboard/buyer`** | 🔴 CRITIQUE | Espace acheteur professionnel : historique de devis, commandes en cours, documents reçus, suivi livraisons. L'espace client actuel (`/espace-client`) ne gère que les candidatures emploi — **il n'y a aucun lien avec la boutique**. |
| **`/documentation`** | 🟠 IMPORTANT | Centre de documentation technique : manuels d'utilisation, fiches d'entretien, bulletins de service. Les acheteurs MRO ont besoin d'accéder aux docs avant achat. |
| **`/support`** | 🟠 IMPORTANT | Support technique dédié : FAQ, tickets, base de connaissances. Le lien "Contacter un expert" sur la fiche produit mène juste à `/contact` générique. |
| **`/logistics`** | 🟠 IMPORTANT | Page logistique : zones de livraison, fret aéro, conditions d'expédition, délais par zone géographique, Incoterms. |
| **`/sav`** | 🟠 IMPORTANT | SAV & retours industriels : procédure de retour, conditions de garantie, formulaire de réclamation. Absent actuellement. |
| **`/partners`** | 🟡 UTILE | Espace partenaires industriels : distributeurs agréés, intégrateurs, programme de partenariat. Renforce la crédibilité. |
| **`/api-docs`** | 🟡 UTILE | Documentation API & intégrations ERP. Pour les gros acheteurs qui veulent connecter leur SAP/Oracle. C'est un différenciateur face aux concurrents. |
| **`/vendors`** | 🟡 PHASE 2 | Espace vendeur (si marketplace multi-vendeur). Pas prioritaire si mono-fournisseur au départ. |
| **`/appels-offres`** | 🟡 PHASE 2 | Page appels d'offres publics/privés. Permet d'attirer des acheteurs institutionnels (militaire, DGAC). |

### 1.3 Verdict structurel

> **Score : 4/10** — Le site a une bonne base de site corporate (blog, carrière, sociétés) mais la partie marketplace est une **vitrine produit basique** sans les briques B2B essentielles. L'espace client est 100% orienté recrutement, sans aucun lien avec la boutique.

---

## 2. AUDIT FONCTIONNEL — Features B2B

### 2.1 Ce qui EXISTE déjà

| Fonctionnalité | Fichier | Évaluation |
|----------------|---------|------------|
| **Catalogue produits** | `data/shop/products.json` + `useProducts.ts` | ✅ Fonctionne. Données en JSON/Blob. ~10 produits. |
| **Filtres par catégorie** | `CategoryFilter.tsx` + `AdvancedFilters.tsx` | ✅ Catégorie, usage, matériau, prix, hélicoptère, stock. Bien fait. |
| **Filtrage par hélicoptère** | `boutique/page.tsx` | ✅ Filtre par type d'appareil compatible. Très pertinent pour l'aéro. |
| **Fiche produit détaillée** | `boutique/[slug]/page.tsx` | ✅ Specs, tolérances, matériaux, applications, FAQ, galerie, vue 3D. **C'est la page la plus aboutie du site.** |
| **Demande de devis** | `api/shop/quote/route.ts` | ✅ Envoi email à l'admin + confirmation client. Validation Zod. |
| **Panier / Liste de devis** | `QuoteContext` + `panier/page.tsx` | ✅ Ajout/suppression/quantité. Stockage localStorage. |
| **Fiche technique (bouton)** | `boutique/[slug]/page.tsx:567` | ⚠️ Le bouton "Fiche technique PDF" existe mais **ne fait rien** (`datasheetUrl` rarement rempli). |
| **Galerie produit** | `ProductGallery` dans `[slug]/page.tsx` | ✅ Carrousel, zoom lightbox, vue hélicoptère avec overlay équipement. |
| **Vue 3D** | `ModelViewer3D.tsx` | ✅ Intégré avec `@google/model-viewer`. Champ `model3d` dans le type produit. |
| **Admin produits** | `admin/aerotools/page.tsx` | ✅ CRUD complet : ajout, édition, suppression, duplication, réordonnement, import/export JSON. 1296 lignes. Bien fait. |
| **Produits "bought together"** | `data.ts:getBoughtTogether` | ✅ Suggestion de produits complémentaires sur la fiche. |

### 2.2 Ce qui MANQUE — Fonctionnalités B2B indispensables

| Fonctionnalité manquante | Priorité | Impact business |
|--------------------------|----------|----------------|
| **Système RFQ structuré** | 🔴 | Le devis actuel est un simple formulaire email. Un vrai RFQ B2B doit inclure : sélection d'appareil, quantités, délai souhaité, pièces jointes (plans), historique des demandes, statut de traitement, relance automatique. |
| **Téléchargement fiches techniques PDF** | 🔴 | Le bouton existe mais ne fonctionne pas. En aéro, les acheteurs **doivent** pouvoir télécharger la fiche technique avant de passer commande. C'est un prérequis absolu. |
| **Certificats téléchargeables par produit** | 🔴 | Champ `certifications` existe dans le type (`string[]`) mais c'est juste du texte. Doit être lié à des PDFs téléchargeables (certificat CE, rapport d'essai, déclaration de conformité). |
| **Tarification dégressive / MOQ** | 🟠 | Le champ `minOrder` existe mais n'est pas exploité côté UX. Pas de tarification dégressive visible. `priceDisplay` est un string ("SUR DEVIS") — **il n'y a aucun prix réel**. |
| **Gestion comptes entreprise multi-utilisateurs** | 🔴 | Le modèle `User` n'a pas de champ `companyId` reliant plusieurs utilisateurs à une même entreprise. Chaque acheteur est isolé. Impossible de partager un panier ou un historique entre collègues. |
| **Historique de commandes / devis** | 🔴 | **Aucun modèle Prisma pour les commandes ou devis.** Les demandes de devis partent par email et disparaissent. Pas de suivi, pas d'historique, pas de statut. |
| **Paiement par bon de commande** | 🟠 | Pas de gestion de bon de commande. En B2B industriel, 90% des paiements se font par bon de commande (pas CB). |
| **Paiement différé (Net 30/60)** | 🟠 | Aucun système de crédit ou conditions de paiement. Standard en B2B. |
| **Numéro de série / batch tracking** | 🔴 | Aucune traçabilité. En aéro, chaque pièce doit être traçable (exigence EASA Part 21, EN 9100). |
| **Gestion des stocks en temps réel** | 🟠 | Le champ `inStock: boolean` est binaire. Pas de quantité en stock réelle. Pas de notification de réapprovisionnement. |
| **Intégration ERP (SAP, Oracle)** | 🟡 | Aucune API structurée pour intégration ERP. L'API actuelle (`/api/products`) est basique (GET/POST du JSON entier). |
| **Module conformité ITAR / export control** | 🔴 | Aucun contrôle d'exportation. Si LLEDO vend du matériel militaire (EC725 Caracal, NH90), c'est une obligation légale. |
| **Messagerie interne fournisseur-client** | 🟡 | Aucune messagerie. Toute communication passe par email externe. |
| **Notifications (email/push)** | 🟠 | Seule notification : l'email de confirmation devis. Pas de notification de stock, de nouveau produit, de changement de statut. |

### 2.3 Verdict fonctionnel

> **Score : 3/10** — Le catalogue et les fiches produit sont bien faits visuellement, mais il manque **toute la couche transactionnelle B2B**. Pas de modèle de commande en base, pas de suivi de devis, pas de compte acheteur, pas de traçabilité. C'est une vitrine, pas une marketplace.

---

## 3. AUDIT UX/UI

### 3.1 Est-ce juste un catalogue statique ?

**Oui, fondamentalement.** Voici l'analyse :

- **Données** : Les produits sont stockés en JSON (`data/shop/products.json`) avec un override Vercel Blob. Pas de base de données relationnelle pour les produits.
- **Panier** : Stocké en `localStorage` via le `QuoteContext`. Si l'utilisateur change de navigateur ou vide son cache → panier perdu.
- **Devis** : Le "checkout" envoie un email. Aucune persistance. L'admin ne peut pas suivre les demandes de devis dans son dashboard.
- **Compte client** : L'espace client (`/espace-client`) **ne montre que les candidatures emploi**. Un acheteur qui se connecte ne voit rien lié à ses achats/devis.

### 3.2 Le design inspire-t-il confiance industrielle ?

| Aspect | Évaluation |
|--------|------------|
| **Identité visuelle** | ✅ Design dark/industriel cohérent (gray-950, bleu LLEDO). HUD corners, grid overlays, police bold uppercase. Ça fait sérieux et technique. |
| **Fiche produit** | ✅ Excellente. Specs en tableau, compatibilité hélicoptère avec image, galerie, vue 3D, FAQ. C'est le point fort du site. |
| **Navigation** | ⚠️ La nav boutique (`ShopNavigation.tsx`) est séparée de la nav principale. Rupture d'expérience entre le site corporate et la boutique. |
| **Mobile** | ⚠️ Le catalogue avec filtres latéraux (`AdvancedFilters`) peut être problématique sur mobile. Pas de mode responsive dédié visible. |
| **Confiance** | ⚠️ Pas de page certifications dédiée. Les badges trust ("Certifié EN 9100") sont dans la TrustBar mais renvoient nulle part. **Aucune preuve téléchargeable.** |
| **Comparaison produits** | ❌ Impossible de comparer deux barres de remorquage côte à côte. Fonctionnalité standard en B2B industriel. |

### 3.3 Moteur de recherche avancé

- **Recherche texte** : ✅ Présente (recherche dans nom, description, compatibilité, specs).
- **Recherche par référence** : ⚠️ Pas de champ de recherche par numéro de référence/P/N dédié. En aéro, les acheteurs cherchent souvent par Part Number.
- **Autocomplétion** : ❌ Absente.
- **Recherche facettée** : ⚠️ Les filtres existent (usage, matériau, prix, stock) mais pas de vraie recherche facettée avec compteurs dynamiques.

### 3.4 Parcours d'achat B2B — Analyse critique

```
PARCOURS ACTUEL :
/boutique → scroll → voir produits → clic → fiche → "Ajouter au devis" → /panier → formulaire → email envoyé → FIN (aucun suivi)

PARCOURS IDÉAL B2B :
/marketplace → recherche/filtre → fiche produit → comparer → ajouter au RFQ → 
/rfq → spécifier quantités/délais → soumettre → 
/dashboard/buyer → suivre statut → recevoir offre → négocier → valider → bon de commande → suivi livraison
```

**Gap critique** : Le parcours actuel s'arrête à l'envoi d'email. Il n'y a **aucun suivi post-soumission**. Le client ne peut pas :
- Voir l'historique de ses demandes
- Suivre le statut d'un devis
- Recevoir une offre formelle dans la plateforme
- Passer commande directement

### 3.5 Comparaison avec Airbus Helicopters Parts / Satair

| Critère | Aerotools actuel | Airbus Marketplace |
|---------|------------------|--------------------|
| Recherche par P/N | ❌ | ✅ |
| Disponibilité temps réel | ❌ (booléen) | ✅ (quantité exacte) |
| Prix en ligne | ❌ ("SUR DEVIS") | ✅ (prix net affiché) |
| Commande en ligne | ❌ | ✅ |
| Suivi commande | ❌ | ✅ |
| Certificats en ligne | ❌ | ✅ |
| Compte entreprise multi-user | ❌ | ✅ |
| Intégration ERP | ❌ | ✅ (API + EDI) |
| Traçabilité | ❌ | ✅ |
| RFQ structuré | ❌ | ✅ |
| Chat / messagerie | ❌ | ✅ |
| Multi-langue | ⚠️ (i18n existe mais partiel) | ✅ |
| Multi-devise | ❌ | ✅ |

### 3.6 Verdict UX/UI

> **Score : 5/10** — Le design est bon et l'identité visuelle est forte. Les fiches produit sont au-dessus de la moyenne. Mais le parcours d'achat est incomplet et il manque toutes les fonctionnalités post-devis. C'est un bon catalogue, pas une marketplace.

---

## 4. AUDIT TECHNIQUE

### 4.1 Stack actuelle

| Composant | Technologie | Version |
|-----------|------------|---------|
| Framework | Next.js (App Router) | 14.2.35 |
| Base de données | PostgreSQL (Prisma) | Prisma 6.19 |
| Auth clients | NextAuth.js | 5.0.0-beta.30 |
| Auth admin | JWT custom + 2FA | Maison |
| Stockage fichiers | Vercel Blob | 2.3.0 |
| Email | Nodemailer / Resend | 7.0 / 6.9 |
| Animations | Framer Motion | 10.16 |
| 3D | Three.js + Google Model Viewer | 0.182 / 4.1 |
| i18n | react-i18next | 16.2 |
| Validation | Zod | 3.22 |
| Hébergement | Vercel | - |

### 4.2 Sécurité ✅ (Point fort)

Le système de sécurité admin est **excellent** pour un site de cette taille :

- **Authentification admin** : JWT custom avec sessions en base, rotation de tokens, IP tracking, device fingerprinting
- **2FA** : TOTP (Google Authenticator) + Email OTP + Backup codes. Implémentation complète et correcte.
- **Verrouillage de compte** : 5 tentatives → lock 30min, 10 tentatives → lock 24h
- **Logs de sécurité** : Audit trail complet en base (SecurityLog) avec événements, IP, user-agent, géolocalisation
- **Mots de passe** : bcrypt 12 rounds, validation forte (12 chars min, majuscule, minuscule, chiffre, spécial)
- **Chiffrement** : AES-256-CBC pour les secrets 2FA
- **Rate limiting** : Modèle en base pour limiter les requêtes
- **Gestion des sessions admin** : Sessions trackées avec possibilité de kill à distance

**Faiblesses identifiées** :
- `ENCRYPTION_KEY` fallback à `crypto.randomBytes(32)` si non défini → **les secrets 2FA deviennent indéchiffrables après un redéploiement**
- Pas de CSRF protection explicite (Next.js offre une protection partielle)
- Pas de Content Security Policy (CSP) headers configurés
- NextAuth en **beta** (5.0.0-beta.30) — risque de breaking changes

### 4.3 Architecture des données produits ⚠️ (Point faible majeur)

```
PROBLÈME FONDAMENTAL :
Les produits ne sont PAS en base de données PostgreSQL.
Ils sont en JSON statique (products.json) avec override Vercel Blob.
```

Conséquences :
- **Pas de relations** : impossible de lier un produit à des commandes, des devis, des certificats
- **Pas de recherche SQL** : tout le filtrage est côté client (JavaScript)
- **Pas de transactions** : pas de gestion de stock fiable
- **Pas de scalabilité** : 10 produits OK, 1000 produits → problème de performance
- **Pas d'audit trail** : pas de log de modification des produits

### 4.4 Modèle Prisma — Ce qui existe vs ce qui manque

**Modèles existants** (13) :
`User`, `Account`, `Session`, `Admin`, `AdminSession`, `SecurityLog`, `Job`, `Application`, `BlogPost`, `Review`, `Company`, `Media`, `ContactRequest`, `PageView`, `RateLimitRecord`, `PasswordReset`, `ActivationToken`, `EmailOTP`, `ClientLoginOTP`, `ClientPasswordReset`, `EmailConfirmationToken`, `VerificationToken`

**Modèles MANQUANTS pour une marketplace** :

```prisma
// À CRÉER :
model Product {}          // Produits en base (remplacer le JSON)
model ProductCategory {}  // Catégories
model ProductDocument {}  // Fiches techniques, certificats
model Quote {}            // Demandes de devis (persistées)
model QuoteItem {}        // Lignes de devis
model Order {}            // Commandes
model OrderItem {}        // Lignes de commande
model Organization {}     // Entreprises clientes (multi-user)
model OrganizationUser {} // Liaison user <-> entreprise
model Address {}          // Adresses de livraison/facturation
model SerialNumber {}     // Traçabilité N° série
model Notification {}     // Notifications in-app
model Message {}          // Messagerie interne
model Comparison {}       // Comparaisons sauvegardées
model PriceList {}        // Tarifs dégressifs par client/volume
model Shipment {}         // Suivi des expéditions
```

### 4.5 API — État actuel

| Endpoint | Méthode | Description | Qualité |
|----------|---------|-------------|---------|
| `/api/products` | GET/POST | CRUD produits (JSON entier) | ⚠️ Pas RESTful. Remplace tout le JSON à chaque POST. |
| `/api/shop/quote` | POST | Envoi email devis | ✅ Bien validé (Zod). Mais pas de persistence. |
| `/api/admin/*` | CRUD | Blog, companies, medias, stats, users, reviews | ✅ Complet et bien structuré. |
| `/api/admin-auth/*` | Auth | Login, register, 2FA, sessions, password reset | ✅ Très bien fait. |
| `/api/auth/*` | Auth | NextAuth routes clients | ✅ Standard. |
| `/api/contact` | POST | Formulaire contact | ✅ |
| `/api/applications` | GET/POST | Candidatures | ✅ |
| `/api/jobs` | GET | Offres d'emploi + feeds RSS/JSON | ✅ |

**Ce qui manque côté API** :
- API RESTful produits (`GET /api/products/:id`, `PATCH`, `DELETE`)
- API devis (`POST /api/quotes`, `GET /api/quotes/:id`, `PATCH status`)
- API commandes
- API traçabilité
- API documents/certificats
- Webhooks pour intégration ERP
- API de recherche avec pagination, tri, facettes

### 4.6 Performance & SEO

| Critère | État |
|---------|------|
| **SSR/SSG** | ⚠️ Toutes les pages boutique sont `'use client'`. Pas de SSR pour le SEO. Les bots ne voient pas les produits. |
| **Sitemap** | ✅ `next-sitemap` configuré |
| **JSON-LD** | ✅ Présent sur `/aerotools` (Organization). Absent sur les fiches produit (`Product` schema). |
| **Images** | ✅ `next/image` utilisé partout |
| **Cache** | ⚠️ `cache: 'no-store'` sur l'API produits. Pas de stratégie de cache pour les assets statiques. |
| **Bundle** | ⚠️ Framer Motion + Three.js + model-viewer = bundle JS lourd pour les pages boutique |

### 4.7 Verdict technique

> **Score : 5/10** — Excellente sécurité admin. Bon framework (Next.js + Prisma). Mais l'architecture données produits (JSON au lieu de DB) est un **blocage structurel** pour toute évolution marketplace. L'absence de modèles Order/Quote/Organization en base rend impossible le suivi transactionnel.

---

## 5. AUDIT BUSINESS MODEL

### 5.1 Modèle actuel

| Aspect | Réalité |
|--------|---------|
| **Type** | Mono-fournisseur (LLEDO uniquement) |
| **Modèle de revenus** | Aucun via la plateforme. Les devis partent par email, la négociation/facturation se fait hors ligne. |
| **Paiement en ligne** | ❌ Inexistant |
| **Commission** | N/A (pas de marketplace multi-vendeur) |
| **Données collectées** | Nom, email, société, téléphone (formulaire devis). Pas de tracking des comportements d'achat. |

### 5.2 Analyse du positionnement

**Forces** :
- Niche ultra-spécialisée (outillage hélicoptères)
- Expertise technique réelle (barres de remorquage certifiées, rollers hydrauliques)
- Couverture large des types d'hélicoptères (Airbus, Leonardo, NH90, Gazelle)
- Fabrication française (argument commercial fort en aéro)

**Faiblesses** :
- Catalogue très restreint (~10 produits)
- Aucune transaction en ligne
- Pas de récurrence (pas d'abonnement, pas de consommables)
- Dépendance totale au processus offline pour conclure une vente

### 5.3 Verdict business

> **Score : 2/10** — En l'état, le site **ne génère aucun revenu direct**. C'est une plaquette commerciale interactive. Le parcours client s'interrompt après l'envoi d'un email, sans aucun suivi ni conversion trackée.

---

## 6. STRATÉGIE POUR CONCURRENCER AIRBUS

### 6.1 Réalité : vous ne concurrencerez PAS Airbus frontalement

Airbus Helicopters dispose de :
- Budget R&D > 2 milliards €/an
- Catalogue de > 100 000 références
- Réseau de distribution mondial
- Plateforme logistique intégrée
- EDI avec tous les opérateurs majeurs

### 6.2 Avantage concurrentiel réaliste : la niche

| Stratégie | Description |
|-----------|-------------|
| **Spécialisation GSE/outillage** | Airbus vend des pièces détachées d'hélicoptères. LLEDO vend de l'outillage sol (GSE). Ce n'est PAS le même marché. Airbus ne fabrique pas de barres de remorquage. |
| **Fabrication sur-mesure** | LLEDO peut fabriquer des outillages spécifiques qu'Airbus ne propose pas. C'est un avantage énorme pour les opérateurs de flottes mixtes. |
| **Réactivité PME** | Délai de réponse de 24-48h vs semaines chez les grands groupes. Flexibilité de production. |
| **Prix** | Les outillages indépendants sont généralement 30-50% moins chers que les solutions OEM. |
| **Multi-constructeur** | LLEDO couvre Airbus, Leonardo, NH90, Gazelle. Airbus ne couvre que ses propres appareils. |

### 6.3 Niche stratégique recommandée

```
POSITIONNEMENT : "La marketplace de référence pour l'outillage sol hélicoptères — 
tous constructeurs confondus"

CIBLE : Opérateurs MRO, forces armées, opérateurs offshore, SAMU/hélicoptères sanitaires
GÉOGRAPHIE : France → Europe → International
```

### 6.4 Différenciateurs à construire

1. **Configurateur intelligent** : "Sélectionnez votre hélicoptère → voici tous les outillages compatibles avec vos besoins"
2. **IA de compatibilité** : Suggestion automatique de produits complémentaires basée sur le type d'appareil et l'usage
3. **Documentation technique supérieure** : Manuels d'utilisation, vidéos de démonstration, fiches d'entretien — mieux que ce qu'Airbus propose pour le GSE
4. **Comparateur de produits** : Permettre de comparer 2-3 barres de remorquage côte à côte (specs, prix, compatibilité)
5. **Module de stock prédictif** : Alerter les clients quand un produit qu'ils utilisent arrive en fin de vie ou quand un remplacement est recommandé

---

## 7. ARCHITECTURE CIBLE

### 7.1 Structure de routes proposée

```
/                           → Accueil Groupe LLEDO (existant)
/aerotools                  → Landing page Aerotools (existant, à enrichir)

# ══ MARKETPLACE ══
/marketplace                → Catalogue avancé (remplace /boutique)
/marketplace/[slug]         → Fiche produit ultra-détaillée (existe, à enrichir)
/marketplace/compare        → Comparateur de produits (NOUVEAU)
/marketplace/configurator   → Configurateur par hélicoptère (NOUVEAU)

# ══ PROCESSUS D'ACHAT ══
/rfq                        → Demande de devis structurée (NOUVEAU)
/rfq/[id]                   → Suivi d'un devis spécifique (NOUVEAU)
/cart                       → Panier (existe, à migrer)

# ══ ESPACES UTILISATEURS ══
/dashboard                  → Redirect vers le bon dashboard selon le rôle
/dashboard/buyer            → Dashboard acheteur (NOUVEAU)
/dashboard/buyer/quotes     → Historique devis (NOUVEAU)
/dashboard/buyer/orders     → Historique commandes (NOUVEAU)
/dashboard/buyer/documents  → Documents reçus (NOUVEAU)
/dashboard/buyer/company    → Gestion entreprise multi-user (NOUVEAU)
/dashboard/admin            → Dashboard admin (existe)
/dashboard/admin/products   → Gestion produits (existe /admin/aerotools)
/dashboard/admin/quotes     → Gestion devis reçus (NOUVEAU)
/dashboard/admin/orders     → Gestion commandes (NOUVEAU)
/dashboard/admin/analytics  → Analytics (existe)

# ══ CONFIANCE & CONFORMITÉ ══
/certifications             → Page certifications avec PDFs (NOUVEAU)
/traceability               → Recherche traçabilité par N° série (NOUVEAU)
/compliance                 → Conformité export / ITAR (NOUVEAU)
/documentation              → Centre de docs techniques (NOUVEAU)

# ══ SUPPORT ══
/support                    → FAQ + tickets (NOUVEAU)
/logistics                  → Info logistique & délais (NOUVEAU)

# ══ CONTENU ══
/blog                       → Blog/actualités (existe)
/partners                   → Partenaires industriels (NOUVEAU)
/cas-clients                → Témoignages (existe)

# ══ API ══
/api/v2/products            → API RESTful produits
/api/v2/products/:id        → Produit individuel
/api/v2/quotes              → CRUD devis
/api/v2/orders              → CRUD commandes
/api/v2/search              → Recherche avec facettes
/api/v2/traceability/:sn    → Traçabilité par N° série
/api/v2/documents/:id       → Téléchargement documents
/api/v2/webhooks            → Webhooks pour ERP
```

### 7.2 Modèle de données cible (Prisma)

```prisma
// ── PRODUITS (remplacer le JSON) ──
model Product {
  id              String   @id @default(cuid())
  slug            String   @unique
  name            String
  sku             String   @unique  // Part Number
  categoryId      String
  category        ProductCategory @relation(fields: [categoryId], references: [id])
  description     String   @db.Text
  shortDescription String
  features        String[]
  specs           Json
  tolerances      Json?
  materials       Json?
  image           String
  gallery         String[]
  priceDisplay    String?
  priceNet        Decimal?  // Prix réel (caché ou visible selon config)
  priceTiers      Json?     // [{qty: 5, price: 1200}, {qty: 10, price: 1000}]
  compatibility   String[]  // Types d'hélicoptères
  usage           String[]
  material        String
  inStock         Boolean   @default(true)
  stockQuantity   Int       @default(0)
  minOrder        Int       @default(1)
  leadTime        String?
  warranty        String?
  weight          Decimal?
  dimensions      Json?     // {length, width, height}
  isNew           Boolean   @default(false)
  isFeatured      Boolean   @default(false)
  published       Boolean   @default(true)
  model3d         String?
  boughtTogether  String[]
  faq             Json?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  documents       ProductDocument[]
  quoteItems      QuoteItem[]
  orderItems      OrderItem[]
  serialNumbers   SerialNumber[]
}

model ProductCategory {
  id          String    @id @default(cuid())
  slug        String    @unique
  label       String
  description String?
  icon        String?
  order       Int       @default(0)
  products    Product[]
}

model ProductDocument {
  id          String   @id @default(cuid())
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  type        DocumentType  // DATASHEET, CERTIFICATE, MANUAL, DRAWING
  title       String
  url         String
  fileSize    Int?
  createdAt   DateTime @default(now())
}

enum DocumentType {
  DATASHEET
  CERTIFICATE
  MANUAL
  DRAWING
  TEST_REPORT
  DECLARATION_OF_CONFORMITY
}

// ── ORGANISATIONS (comptes entreprise) ──
model Organization {
  id            String   @id @default(cuid())
  name          String
  siret         String?  @unique
  vatNumber     String?
  industry      String?
  size          String?  // PME, ETI, GE
  creditTerms   String?  // Net30, Net60
  creditLimit   Decimal?
  addresses     Address[]
  users         OrganizationUser[]
  quotes        Quote[]
  orders        Order[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model OrganizationUser {
  id             String       @id @default(cuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  userId         String
  user           User         @relation(fields: [userId], references: [id])
  role           OrgRole      @default(BUYER)

  @@unique([organizationId, userId])
}

enum OrgRole {
  ADMIN
  BUYER
  VIEWER
}

// ── DEVIS ──
model Quote {
  id             String      @id @default(cuid())
  reference      String      @unique  // QUO-2026-0001
  organizationId String?
  organization   Organization? @relation(fields: [organizationId], references: [id])
  userId         String
  user           User        @relation(fields: [userId], references: [id])
  status         QuoteStatus @default(DRAFT)
  items          QuoteItem[]
  notes          String?     @db.Text
  validUntil     DateTime?
  totalAmount    Decimal?
  currency       String      @default("EUR")
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt
}

enum QuoteStatus {
  DRAFT
  SUBMITTED
  IN_REVIEW
  QUOTED        // Prix envoyé au client
  ACCEPTED
  REJECTED
  EXPIRED
  CONVERTED     // Converti en commande
}

model QuoteItem {
  id        String  @id @default(cuid())
  quoteId   String
  quote     Quote   @relation(fields: [quoteId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  unitPrice Decimal?
  notes     String?
}

// ── COMMANDES ──
model Order {
  id             String      @id @default(cuid())
  reference      String      @unique  // ORD-2026-0001
  quoteId        String?     // Lien vers le devis d'origine
  organizationId String?
  organization   Organization? @relation(fields: [organizationId], references: [id])
  userId         String
  user           User        @relation(fields: [userId], references: [id])
  status         OrderStatus @default(PENDING)
  items          OrderItem[]
  shippingAddress Json?
  billingAddress  Json?
  totalAmount    Decimal
  currency       String      @default("EUR")
  paymentMethod  String?     // PO, WIRE, CB
  poNumber       String?     // N° bon de commande client
  trackingNumber String?
  shippedAt      DateTime?
  deliveredAt    DateTime?
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt
}

enum OrderStatus {
  PENDING
  CONFIRMED
  IN_PRODUCTION
  SHIPPED
  DELIVERED
  CANCELLED
}

model OrderItem {
  id           String  @id @default(cuid())
  orderId      String
  order        Order   @relation(fields: [orderId], references: [id])
  productId    String
  product      Product @relation(fields: [productId], references: [id])
  quantity     Int
  unitPrice    Decimal
  serialNumbers SerialNumber[]
}

// ── TRAÇABILITÉ ──
model SerialNumber {
  id          String     @id @default(cuid())
  serial      String     @unique
  productId   String
  product     Product    @relation(fields: [productId], references: [id])
  orderItemId String?
  orderItem   OrderItem? @relation(fields: [orderItemId], references: [id])
  batchNumber String?
  manufacturedAt DateTime?
  status      String     @default("IN_STOCK") // IN_STOCK, SOLD, RETURNED, SCRAPPED
  createdAt   DateTime   @default(now())
}
```

---

## 8. ROADMAP DE TRANSFORMATION

### Phase 1 : Fondations B2B (2-3 mois)

**Objectif** : Passer de "vitrine" à "e-commerce B2B fonctionnel"

| Tâche | Priorité | Effort |
|-------|----------|--------|
| Migrer les produits de JSON vers PostgreSQL (modèle `Product`) | 🔴 | 2 semaines |
| Créer le modèle `Quote` + `QuoteItem` en base | 🔴 | 1 semaine |
| Créer `/rfq` — formulaire RFQ structuré (lié au modèle Quote) | 🔴 | 2 semaines |
| Créer `/dashboard/buyer` — espace acheteur (historique devis, profil) | 🔴 | 2 semaines |
| Ajouter `ProductDocument` — fiches techniques + certificats téléchargeables | 🔴 | 1 semaine |
| Créer `/certifications` — page certifications avec PDFs | 🔴 | 3 jours |
| Admin : Dashboard devis reçus (suivi, changement de statut, réponse) | 🟠 | 2 semaines |
| SSR pour les pages produit (SEO : JSON-LD Product schema) | 🟠 | 1 semaine |
| Emails transactionnels : confirmation devis, changement de statut, relance | 🟠 | 1 semaine |

### Phase 2 : Marketplace avancée (3-4 mois)

**Objectif** : Ajouter les briques de confiance et de conversion

| Tâche | Priorité | Effort |
|-------|----------|--------|
| Modèle `Organization` — comptes entreprise multi-utilisateurs | 🔴 | 2 semaines |
| Modèle `Order` + workflow de commande complet | 🔴 | 3 semaines |
| `/traceability` — recherche par N° série | 🔴 | 2 semaines |
| Comparateur de produits (`/marketplace/compare`) | 🟠 | 2 semaines |
| Configurateur hélicoptère (`/marketplace/configurator`) | 🟠 | 3 semaines |
| Messagerie interne (conversation devis/commande) | 🟠 | 2 semaines |
| Notifications in-app + email (statut devis, stock, nouveau produit) | 🟠 | 2 semaines |
| `/compliance` — page conformité export | 🟠 | 1 semaine |
| `/documentation` — centre de docs techniques | 🟠 | 1 semaine |
| `/support` — FAQ structurée + formulaire ticket | 🟡 | 1 semaine |
| Tarification dégressive visible (grille de prix par volume) | 🟡 | 1 semaine |
| Gestion de stock réelle (quantités, alertes) | 🟡 | 2 semaines |

### Phase 3 : Scalabilité & Intelligence (4-6 mois)

**Objectif** : Automatiser et différencier

| Tâche | Effort |
|-------|--------|
| API v2 RESTful + documentation OpenAPI | 3 semaines |
| Webhooks pour intégration ERP (SAP, Oracle) | 3 semaines |
| IA : suggestion de produits compatibles basée sur la flotte du client | 4 semaines |
| Recherche full-text avec Elasticsearch ou Meilisearch | 2 semaines |
| Dashboard analytics avancé (funnel de conversion, produits les plus consultés) | 2 semaines |
| Module de paiement (Stripe B2B, virement, bon de commande) | 4 semaines |
| Génération automatique de devis PDF (avec logo, CGV, specs) | 2 semaines |

### Phase 4 : Internationalisation (6-12 mois)

| Tâche | Effort |
|-------|--------|
| Multi-devise (EUR, USD, GBP) | 2 semaines |
| Traduction complète EN/FR/DE/ES | 4 semaines |
| Gestion des zones export (restrictions ITAR par pays) | 3 semaines |
| Adaptation fiscale (TVA intracommunautaire, export hors-UE) | 2 semaines |
| CDN/Edge pour performances internationales | 1 semaine |
| Marketplace multi-vendeur (si stratégie validée) | 8 semaines |

---

## 9. SYNTHÈSE & LIVRABLES

### 9.1 Scores récapitulatifs

| Domaine | Score | Commentaire |
|---------|-------|-------------|
| Structure (pages) | **4/10** | Bon site corporate, vitrine produit basique |
| Fonctionnel (B2B) | **3/10** | Catalogue OK, zéro transactionnel |
| UX/UI | **5/10** | Design pro, parcours incomplet |
| Technique | **5/10** | Sécurité excellente, architecture données à refaire |
| Business model | **2/10** | Aucun revenu via la plateforme |
| **GLOBAL** | **3.8/10** | **Vitrine marketing, pas marketplace** |

### 9.2 Top 5 des actions prioritaires

1. **Migrer les produits en base PostgreSQL** — Sans ça, rien d'autre n'est possible
2. **Créer le modèle Quote en base + dashboard devis** — Pour suivre les demandes
3. **Construire l'espace acheteur** — Le client doit voir ses devis/commandes
4. **Rendre les fiches techniques téléchargeables** — Le bouton existe, il doit fonctionner
5. **Page certifications avec preuves** — Sans ça, pas de crédibilité en aéro

### 9.3 Ce qui est BIEN et à garder

- ✅ Design industriel dark cohérent et professionnel
- ✅ Fiches produit très détaillées (specs, tolérances, FAQ, 3D, galerie)
- ✅ Filtre par type d'hélicoptère (unique selling point)
- ✅ Système de sécurité admin (2FA, audit trail, verrouillage)
- ✅ Stack technique moderne (Next.js 14, Prisma, TypeScript)
- ✅ i18n déjà en place (à compléter)
- ✅ Admin produits complet (CRUD, import/export)

### 9.4 Positionnement stratégique recommandé

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   "LLEDO AEROTOOLS — La marketplace outillage sol           │
│    pour hélicoptères, tous constructeurs confondus"         │
│                                                             │
│   NICHE : GSE / outillage sol / manutention hélicoptères   │
│   CIBLE : MRO, forces armées, offshore, SAMU               │
│   AVANTAGE : Multi-constructeur + sur-mesure + fabricant    │
│   MODÈLE : B2B avec RFQ → Devis → Commande → Traçabilité  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

> **Conclusion** : Le site a de bonnes fondations techniques et un design solide. Mais il fonctionne comme une plaquette commerciale interactive, pas comme une marketplace. La transformation nécessite principalement un travail de **backend et modélisation de données** (produits en DB, devis, commandes, organisations) avant d'ajouter les pages front manquantes. La Phase 1 (2-3 mois) suffit à passer d'une vitrine à un vrai outil de vente B2B.
