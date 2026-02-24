const fs = require('fs');
const products = JSON.parse(fs.readFileSync('./src/data/shop/products.json', 'utf8'));

const newProducts = [
  {
    "id": "RL-R125-03",
    "slug": "roller-petites-roues-h125",
    "name": "Roller Petites Roues H125",
    "category": "handling",
    "description": "Roller breveté version petites roues pour hélicoptères EC120, H125 et H130. Format compact facilitant le stockage dans l'appareil. Ergonomie améliorée avec utilisation debout et pompage au pied.",
    "shortDescription": "Roller compact breveté — Utilisation debout, pompage au pied",
    "features": [
      "Utilisation debout & pompage au pied",
      "Format compact — stockage dans l'appareil",
      "Passage direct sous le marchepied sans rotation",
      "Couleur de capot personnalisable",
      "Ergonomie améliorée — pénibilité réduite",
      "Accroche plus simple et plus rapide"
    ],
    "specs": {
      "Compatibilité": "EC120 / H125 / H130",
      "Poids": "21 kg",
      "Roues": "Ø 315 mm",
      "Encombrement": "645 x 420 x 420 mm",
      "Charge max": "2.2 tonnes",
      "Norme": "ISO 9667"
    },
    "image": "/images/products/roller-petites-roues.png",
    "gallery": [
      "/images/products/roller-petites-roues-installed.png"
    ],
    "priceDisplay": "SUR DEVIS",
    "priceRange": "medium",
    "compatibility": ["EC120", "H125", "H130"],
    "usage": ["civil"],
    "material": "steel-alu",
    "inStock": true,
    "isNew": true,
    "isFeatured": true,
    "datasheetUrl": null,
    "certifications": ["CE", "Directive Machines 2006/42/CE"],
    "standards": ["ISO 9667"],
    "applications": [
      "Roulage piste hélicoptères à patins",
      "Déplacement en hangar",
      "Stockage compact dans l'appareil",
      "Opérations mono-opérateur"
    ],
    "tolerances": {
      "Charge maximale": "2 200 kg",
      "Diamètre roues": "Ø 315 mm"
    },
    "materials": {
      "Structure": "Aluminium / Acier haute résistance",
      "Roues": "Pneumatique plein Ø 315",
      "Finition": "Peinture époxy — capot personnalisable"
    },
    "leadTime": "4 à 6 semaines",
    "minOrder": 1,
    "warranty": "24 mois",
    "faq": [
      { "q": "Quelle différence avec la version grandes roues ?", "a": "La version petites roues (Ø315 vs Ø415) est plus compacte et plus légère. Elle passe directement sous le marchepied sans rotation nécessaire." },
      { "q": "Le capot est-il personnalisable ?", "a": "Oui. La couleur du capot peut être personnalisée selon vos souhaits (livraison standard en bleu)." }
    ],
    "boughtTogether": ["BR-BHHL-02", "RL-R125-04"]
  },
  {
    "id": "RL-R125-04",
    "slug": "roller-mecanique-bras-h125",
    "name": "Roller Mécanique à Bras",
    "category": "handling",
    "description": "Roller mécanique à bras breveté avec système sécurisé anti-retour. Ultra-compact et démontable en deux parties. Idéal pour levage et manutention des hélicoptères légers à patins.",
    "shortDescription": "Roller ultra-compact démontable — Système anti-retour breveté",
    "features": [
      "Barre démontable anti-retour sécurisé",
      "Ultra-compact — faible encombrement",
      "Roues démontables",
      "Barre démontable en deux parties",
      "Mise en œuvre rapide",
      "Utilisation sous panier"
    ],
    "specs": {
      "Compatibilité": "H125 / H130 / Hélicos légers à patins",
      "Poids": "19 kg",
      "Roues": "Ø 315 mm",
      "Encombrement": "412 x 363 x 308 mm",
      "Charge max": "2.2 tonnes",
      "Norme": "ISO 9667"
    },
    "image": "/images/products/roller-mecanique-bras.png",
    "gallery": [
      "/images/products/roller-mecanique-installed.png"
    ],
    "priceDisplay": "SUR DEVIS",
    "priceRange": "medium",
    "compatibility": ["H125", "H130", "EC120"],
    "usage": ["civil"],
    "material": "steel-alu",
    "inStock": true,
    "isNew": true,
    "isFeatured": true,
    "datasheetUrl": null,
    "certifications": ["CE", "Directive Machines 2006/42/CE"],
    "standards": ["ISO 9667"],
    "applications": [
      "Levage et manutention hélicoptères légers",
      "Utilisation sous panier — espace restreint",
      "Transport et stockage compact",
      "Opérations terrain"
    ],
    "tolerances": {
      "Charge maximale": "2 200 kg (1 personne jusqu'à 1.8t)",
      "Diamètre roues": "Ø 315 mm"
    },
    "materials": {
      "Structure": "Aluminium / Acier traité",
      "Roues": "Pneumatique Ø 315 démontables",
      "Finition": "Peinture époxy jaune RAL"
    },
    "leadTime": "4 à 6 semaines",
    "minOrder": 1,
    "warranty": "24 mois",
    "faq": [
      { "q": "Peut-on l'utiliser sous le panier ?", "a": "Oui. Le format compact permet l'utilisation sous panier en espace restreint." },
      { "q": "Combien de personnes pour l'utilisation ?", "a": "1 personne jusqu'à 1.8 tonnes. Au-delà et jusqu'à 2.2t, l'utilisation à 2 personnes est conseillée." }
    ],
    "boughtTogether": ["RL-R125-03", "BR-BHHL-02"]
  },
  {
    "id": "BR-B365-01",
    "slug": "barre-remorquage-dauphin",
    "name": "Barre de Remorquage Dauphin",
    "category": "towing",
    "description": "Barre de remorquage brevetée à accrochage rapide pour SA365 Dauphin. Utilisation mono-opérateur avec commande de verrouillage déportée et fusibles de sécurité.",
    "shortDescription": "Accrochage rapide Dauphin — Mono-opérateur breveté",
    "features": [
      "Accrochage rapide breveté",
      "Utilisation mono-opérateur",
      "Commande de verrouillage déportée",
      "Fusibles de traction & torsion",
      "Hauteur réglable — 3 positions",
      "Amortisseur de timon"
    ],
    "specs": {
      "Compatibilité": "SA365 Dauphin",
      "Longueur": "2865 mm",
      "Ø de Roues": "160 mm",
      "Poids": "31 kg",
      "Norme": "ISO 9667",
      "Conformité": "Directive Machine 2006/42/CE"
    },
    "image": "/images/products/towbar-puma.svg",
    "gallery": [],
    "priceDisplay": "SUR DEVIS",
    "priceRange": "medium",
    "compatibility": ["SA365", "Dauphin"],
    "usage": ["civil", "military"],
    "material": "steel-alu",
    "inStock": true,
    "isNew": false,
    "isFeatured": false,
    "datasheetUrl": null,
    "certifications": ["CE", "Directive Machines 2006/42/CE"],
    "standards": ["ISO 9667"],
    "leadTime": "6 à 8 semaines",
    "minOrder": 1,
    "warranty": "24 mois"
  },
  {
    "id": "BR-B365-02",
    "slug": "barre-remorquage-panther",
    "name": "Barre de Remorquage Panther",
    "category": "towing",
    "description": "Version militaire avec cornes de la barre Dauphin pour AS565 Panther. Accrochage rapide mono-opérateur, fusibles de sécurité et hauteur réglable.",
    "shortDescription": "Version militaire Panther avec cornes — Mono-opérateur",
    "features": [
      "Version militaire avec cornes",
      "Accrochage rapide breveté",
      "Utilisation mono-opérateur",
      "Commande de verrouillage déportée",
      "Fusibles de traction & torsion",
      "Hauteur réglable — 3 positions",
      "Amortisseur de timon"
    ],
    "specs": {
      "Compatibilité": "AS565 Panther",
      "Longueur": "3057 mm",
      "Ø de Roues": "125 mm",
      "Poids": "32 kg",
      "Norme": "ISO 9667",
      "Conformité": "Directive Machine 2006/42/CE"
    },
    "image": "/images/products/towbar-puma.svg",
    "gallery": [],
    "priceDisplay": "SUR DEVIS",
    "priceRange": "medium",
    "compatibility": ["AS565", "Panther"],
    "usage": ["military", "naval"],
    "material": "steel-alu",
    "inStock": true,
    "isNew": false,
    "isFeatured": false,
    "datasheetUrl": null,
    "certifications": ["CE", "Directive Machines 2006/42/CE"],
    "standards": ["ISO 9667"],
    "leadTime": "8 à 10 semaines",
    "minOrder": 1,
    "warranty": "24 mois"
  },
  {
    "id": "BR-B330-01",
    "slug": "barre-remorquage-puma-standard",
    "name": "Barre de Remorquage Puma Standard",
    "category": "towing",
    "description": "Barre de remorquage brevetée à accrochage rapide pour SA330 Puma. Robuste et éprouvée en opérations civiles et militaires.",
    "shortDescription": "Accrochage rapide Puma — Version standard éprouvée",
    "features": [
      "Accrochage rapide breveté",
      "Utilisation mono-opérateur",
      "Commande de verrouillage déportée",
      "Fusibles de traction & torsion",
      "Hauteur réglable — 3 positions",
      "Amortisseur de timon"
    ],
    "specs": {
      "Compatibilité": "SA330 Puma",
      "Longueur": "3666 mm",
      "Ø de Roues": "160 mm",
      "Poids": "60 kg",
      "Norme": "ISO 9667",
      "Conformité": "Directive Machine 2006/42/CE"
    },
    "image": "/images/products/towbar-puma.svg",
    "gallery": [],
    "priceDisplay": "SUR DEVIS",
    "priceRange": "high",
    "compatibility": ["SA330", "Puma"],
    "usage": ["civil", "military"],
    "material": "steel",
    "inStock": true,
    "isNew": false,
    "isFeatured": false,
    "datasheetUrl": null,
    "certifications": ["CE", "Directive Machines 2006/42/CE"],
    "standards": ["ISO 9667"],
    "leadTime": "6 à 8 semaines",
    "minOrder": 1,
    "warranty": "24 mois"
  },
  {
    "id": "BR-B332-03",
    "slug": "barre-super-puma-flir",
    "name": "Barre Super Puma FLIR & Ravitaillement",
    "category": "towing",
    "description": "Barre de remorquage spéciale Super Puma pour versions équipées FLIR et perche de ravitaillement. Compatible AS332, AS532, EC225, EC725, H215, H225, H225M et Caracal.",
    "shortDescription": "Super Puma version FLIR/Perche — Compatible toute la famille",
    "features": [
      "Compatible FLIR & perche de ravitaillement",
      "Accrochage rapide breveté",
      "Utilisation mono-opérateur",
      "Commande de verrouillage déportée",
      "Fusibles de traction & torsion",
      "Hauteur réglable — 3 positions",
      "Amortisseur de timon"
    ],
    "specs": {
      "Compatibilité": "AS332 / AS532 / EC225 / EC725 / H215 / H225 / H225M / Caracal",
      "Longueur": "4036 mm",
      "Ø de Roues": "160 mm",
      "Poids": "70 kg",
      "Norme": "ISO 9667",
      "Conformité": "Directive Machine 2006/42/CE"
    },
    "image": "/images/products/towbar-puma.svg",
    "gallery": [],
    "priceDisplay": "SUR DEVIS",
    "priceRange": "high",
    "compatibility": ["AS332", "AS532", "EC225", "EC725", "H215", "H225", "Caracal"],
    "usage": ["military", "offshore"],
    "material": "steel",
    "inStock": true,
    "isNew": false,
    "isFeatured": true,
    "datasheetUrl": null,
    "certifications": ["CE", "Directive Machines 2006/42/CE"],
    "standards": ["ISO 9667"],
    "leadTime": "8 à 12 semaines",
    "minOrder": 1,
    "warranty": "24 mois"
  },
  {
    "id": "BR-BHHL-02",
    "slug": "barre-helicopteres-legers-universelle",
    "name": "Barre Hélicoptères Légers Universelle",
    "category": "towing",
    "description": "Barre de remorquage universelle pour hélicoptères légers à patins. Compatible H120 à H145, SA341/342, AW109/119 et Gazelle. Équipée d'un système hydraulique monte/baisse et roues pneumatiques pleines Ø250.",
    "shortDescription": "Universelle hélicos à patins — Hydraulique monte/baisse",
    "features": [
      "Polyvalente — compatible tous hélicos légers à patins",
      "Système monte/baisse arrière hydraulique",
      "Système monte/baisse avant manuel instantané",
      "Roues arrières pneumatique plein Ø250",
      "Amortisseur de timon",
      "Patins de protection jante",
      "Fusibles de traction & torsion",
      "Commande de verrouillage déportée"
    ],
    "specs": {
      "Compatibilité": "H120 / H125 / H130 / H135 / H145 / SA341 / SA342 / AW109 / AW119",
      "Longueur": "2955 mm",
      "Ø de Roues": "250 mm (arrière) / 160 mm (avant)",
      "Poids": "127 kg (version complète)",
      "Norme": "ISO 9667",
      "Conformité": "Directive Machine 2006/42/CE"
    },
    "image": "/images/products/barre-bhhl-02.png",
    "gallery": [],
    "priceDisplay": "SUR DEVIS",
    "priceRange": "high",
    "compatibility": ["H120", "H125", "H130", "H135", "H145", "SA341", "SA342", "AW109", "AW119", "Gazelle"],
    "usage": ["civil", "military"],
    "material": "steel",
    "inStock": true,
    "isNew": true,
    "isFeatured": true,
    "datasheetUrl": null,
    "certifications": ["CE", "Directive Machines 2006/42/CE"],
    "standards": ["ISO 9667"],
    "applications": [
      "Tractage tous hélicoptères légers à patins",
      "Opérations hangar et piste",
      "Compatible rollers RL-R125 / RL-R130",
      "Environnement civil et militaire"
    ],
    "leadTime": "8 à 10 semaines",
    "minOrder": 1,
    "warranty": "24 mois",
    "faq": [
      { "q": "Quels hélicoptères sont compatibles ?", "a": "Tous les hélicoptères légers à patins : H120, H125, H130, H135, H145, SA341/342 Gazelle, AW109, AW119 et Leonardo AW09." },
      { "q": "Le contrepoids de sécurité est-il inclus ?", "a": "Le contrepoids de 40 kg (BR-BHHL-OP5) est optionnel. Le support rollers (BR-BHHL-OP4) est également disponible en option." }
    ],
    "boughtTogether": ["RL-R125-03", "BR-BHHL-OP5"]
  },
  {
    "id": "BR-NH90-02",
    "slug": "barre-remorquage-nh90-courte",
    "name": "Barre de Remorquage NH90 Courte",
    "category": "towing",
    "description": "Version courte de la barre de remorquage NH90. Plus compacte pour les espaces restreints, conservant toutes les fonctionnalités de sécurité et le système mono-opérateur.",
    "shortDescription": "NH90 version courte — Compact pour espaces restreints",
    "features": [
      "Version courte compacte",
      "Accrochage rapide breveté",
      "Utilisation mono-opérateur",
      "Commande de verrouillage déportée",
      "Fusibles de traction & torsion",
      "Hauteur réglable — 3 positions",
      "Amortisseur de timon"
    ],
    "specs": {
      "Compatibilité": "NH90 TTH/NFH",
      "Longueur": "2336 mm",
      "Ø de Roues": "160 mm",
      "Poids": "55 kg",
      "Norme": "ISO 9667",
      "Conformité": "Directive Machine 2006/42/CE"
    },
    "image": "/images/products/towbar-nh90.svg",
    "gallery": [],
    "priceDisplay": "SUR DEVIS",
    "priceRange": "high",
    "compatibility": ["NH90"],
    "usage": ["military", "naval"],
    "material": "steel-alu",
    "inStock": true,
    "isNew": false,
    "isFeatured": false,
    "datasheetUrl": null,
    "certifications": ["CE", "Directive Machines 2006/42/CE"],
    "standards": ["ISO 9667"],
    "leadTime": "8 à 10 semaines",
    "minOrder": 1,
    "warranty": "24 mois"
  },
  {
    "id": "BR-B139-01",
    "slug": "barre-remorquage-aw139",
    "name": "Barre de Remorquage AW139",
    "category": "towing",
    "description": "Barre de remorquage brevetée à accrochage rapide pour Leonardo AW139. Mono-opérateur avec fusibles de sécurité, hauteur réglable et amortisseur de timon.",
    "shortDescription": "Accrochage rapide AW139 — Mono-opérateur breveté",
    "features": [
      "Accrochage rapide breveté",
      "Utilisation mono-opérateur",
      "Commande de verrouillage déportée",
      "Fusibles de traction & torsion",
      "Hauteur réglable — 3 positions",
      "Amortisseur de timon",
      "Patins de protection jante"
    ],
    "specs": {
      "Compatibilité": "Leonardo AW139",
      "Longueur": "3634 mm",
      "Ø de Roues": "160 mm",
      "Poids": "60 kg",
      "Norme": "ISO 9667",
      "Conformité": "Directive Machine 2006/42/CE"
    },
    "image": "/images/products/barre-aw139.png",
    "gallery": [],
    "priceDisplay": "SUR DEVIS",
    "priceRange": "high",
    "compatibility": ["AW139"],
    "usage": ["civil", "offshore", "sar"],
    "material": "steel",
    "inStock": true,
    "isNew": true,
    "isFeatured": true,
    "datasheetUrl": null,
    "certifications": ["CE", "Directive Machines 2006/42/CE"],
    "standards": ["ISO 9667"],
    "applications": [
      "Tractage AW139 sur piste et héliport",
      "Opérations offshore",
      "Recherche et sauvetage (SAR)",
      "Transport VIP et HEMS"
    ],
    "leadTime": "6 à 8 semaines",
    "minOrder": 1,
    "warranty": "24 mois",
    "faq": [
      { "q": "Le réducteur de timon est-il inclus ?", "a": "Non. Le réducteur de timon BR-COM6-01-K01 (douille de réduction du Ø76 au Ø42) est disponible séparément en accessoire." }
    ],
    "boughtTogether": ["BR-COM6-01", "ACC-FUSE-SET"]
  },
  {
    "id": "ACC-FUSE-SET",
    "slug": "lot-fusibles-traction-torsion",
    "name": "Lot de Fusibles Traction & Torsion",
    "category": "maintenance",
    "description": "Lot de 20 fusibles de sécurité (10 traction + 10 torsion) pour barres de remorquage. Pièces d'usure essentielles conformes ISO 9667.",
    "shortDescription": "20 fusibles (10 traction + 10 torsion) — Pièces d'usure ISO 9667",
    "features": [
      "10 fusibles de traction",
      "10 fusibles de torsion",
      "Compatible toutes barres de la gamme",
      "Conforme ISO 9667"
    ],
    "specs": {
      "Contenu": "10 fusibles traction + 10 fusibles torsion",
      "Compatibilité": "Toutes barres de remorquage",
      "Norme": "ISO 9667"
    },
    "image": "/images/products/fusibles-set.png",
    "gallery": [],
    "priceDisplay": "SUR DEVIS",
    "priceRange": "low",
    "compatibility": ["Universel"],
    "usage": ["civil", "military"],
    "material": "steel",
    "inStock": true,
    "isNew": false,
    "isFeatured": false,
    "datasheetUrl": null,
    "certifications": ["ISO 9667"],
    "standards": ["ISO 9667"],
    "leadTime": "1 à 2 semaines",
    "minOrder": 1,
    "warranty": "N/A — pièce d'usure"
  },
  {
    "id": "BR-COM6-01",
    "slug": "reducteur-timon-universel",
    "name": "Réducteur de Timon Universel",
    "category": "maintenance",
    "description": "Douille de réduction pour timon de barre de remorquage. Réduction du Ø76 au Ø42 pour adaptation aux différents véhicules tracteurs. Usiné en acier inox avec marquage LLEDO Aero Tools.",
    "shortDescription": "Douille réduction Ø76→Ø42 — Adaptation tracteur universelle",
    "features": [
      "Réduction Ø76 au Ø42",
      "Usinage précision acier inox",
      "Adaptation universelle tracteurs",
      "Marquage LLEDO Aero Tools + QR code"
    ],
    "specs": {
      "Diamètre entrée": "Ø 76 mm",
      "Diamètre sortie": "Ø 42 mm",
      "Matériau": "Acier inox usiné",
      "Marquage": "LLEDO Aero Tools + QR code traçabilité"
    },
    "image": "/images/products/reducteur-timon.png",
    "gallery": [],
    "priceDisplay": "SUR DEVIS",
    "priceRange": "low",
    "compatibility": ["Universel"],
    "usage": ["civil", "military"],
    "material": "steel",
    "inStock": true,
    "isNew": false,
    "isFeatured": false,
    "datasheetUrl": null,
    "leadTime": "2 à 4 semaines",
    "minOrder": 1,
    "warranty": "24 mois"
  }
];

// Add new products
const allProducts = [...products, ...newProducts];
fs.writeFileSync('./src/data/shop/products.json', JSON.stringify(allProducts, null, 2));
console.log(`Done: ${products.length} existing + ${newProducts.length} new = ${allProducts.length} total products`);
