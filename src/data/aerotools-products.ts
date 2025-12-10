export interface Product {
  id: string
  name: string
  category: 'towing' | 'handling' | 'maintenance'
  description: string
  features: string[]
  specs: Record<string, string>
  image: string
  price_display: string
  compatibility: string[] // Liste des hélicoptères compatibles
}

export const products: Product[] = [
  // --- BARRES DE REMORQUAGE ---
  {
    id: 'BR-H160',
    name: 'BARRE DE REMORQUAGE H160',
    category: 'towing',
    description: 'Solution de tractage certifiée pour Airbus Helicopters H160. Conception ergonomique et sécurisée pour opérations sur piste et hangar.',
    features: [
      'Système de verrouillage rapide double sécurité',
      'Amortisseur de chocs intégré',
      'Roues pivotantes haute résistance',
      'Fusible de cisaillement calibré'
    ],
    specs: {
      'Compatibilité': 'Airbus H160',
      'Poids': '45 kg',
      'Longueur': '4.2 m',
      'Certifications': 'CE, EN 12312'
    },
    image: '/images/products/towbar-h160.jpg', // Placeholder
    price_display: 'SUR DEVIS',
    compatibility: ['H160']
  },
  {
    id: 'BR-H175',
    name: 'BARRE DE REMORQUAGE H175',
    category: 'towing',
    description: 'Barre de manœuvre lourde pour H175. Structure renforcée pour opérations offshore et SAR.',
    features: [
      'Tube principal en alliage aéronautique',
      'Pompe hydraulique manuelle de levage',
      'Indicateur de verrouillage visuel',
      'Peinture résistante Skydrol'
    ],
    specs: {
      'Compatibilité': 'Airbus H175',
      'Capacité': '8 tonnes',
      'Type': 'Hydraulique',
      'Norme': 'EN 1915'
    },
    image: '/images/products/towbar-h175.jpg',
    price_display: 'SUR DEVIS',
    compatibility: ['H175']
  },
  {
    id: 'BR-NH90-01',
    name: 'BARRE DE REMORQUAGE NH90',
    category: 'towing',
    description: 'Équipement militaire pour NH90 (TTH/NFH). Conçu pour les environnements sévères et opérations embarquées.',
    features: [
      'Repliable pour transport aisé',
      'Traitement anti-corrosion marine',
      'Anneau de remorquage OTAN',
      'Maintenance simplifiée sans outils'
    ],
    specs: {
      'Compatibilité': 'NH90',
      'Classe': 'Militaire',
      'Matériau': 'Acier HR / Alu 7075',
      'NATO Stock Number': 'Disponible'
    },
    image: '/images/products/towbar-nh90.jpg',
    price_display: 'SUR DEVIS',
    compatibility: ['NH90']
  },
  {
    id: 'BR-B332',
    name: 'BARRE SUPER PUMA / COUGAR',
    category: 'towing',
    description: 'La référence pour la famille Super Puma (AS332, EC225, H215, H225). Robustesse éprouvée depuis 30 ans.',
    features: [
      'Système universel famille Puma',
      'Roues larges pour terrain sommaire',
      'Protection tête d\'attelage',
      'Levier d\'assistance au levage'
    ],
    specs: {
      'Compatibilité': 'AS332, EC225, H215',
      'Charge Max': '11 tonnes',
      'Longueur': '5.5 m',
      'Finition': 'Jaune Aéro'
    },
    image: '/images/products/towbar-puma.jpg',
    price_display: 'SUR DEVIS',
    compatibility: ['Super Puma', 'Cougar', 'Caracal']
  },
  {
    id: 'BR-BHHL-01',
    name: 'BARRE DE REMORQUAGE GAZELLE',
    category: 'towing',
    description: 'Barre légère et maniable pour hélicoptère Gazelle. Idéale pour les espaces exigus.',
    features: [
      'Ultra-légère (structure alu)',
      'Mise en place par un seul opérateur',
      'Verrouillage mécanique simple',
      'Poignées ergonomiques'
    ],
    specs: {
      'Compatibilité': 'SA341/342 Gazelle',
      'Poids': '25 kg',
      'Type': 'Mécanique',
      'Transport': 'Démontable'
    },
    image: '/images/products/towbar-gazelle.jpg',
    price_display: 'SUR DEVIS',
    compatibility: ['Gazelle']
  },

  // --- ROLLERS HYDRAULIQUES ---
  {
    id: 'RL-R125',
    name: 'ROLLERS HYDRAULIQUES ÉCUREUIL',
    category: 'handling',
    description: 'Système de levage et déplacement pour famille Écureuil (H125, AS350, AS355).',
    features: [
      'Levage hydraulique manuel ou électrique',
      'Frein de parc positif',
      'Garde au sol réglable',
      'Adaptation rapide sur patins'
    ],
    specs: {
      'Compatibilité': 'H125 / AS350',
      'Capacité': '3 tonnes / paire',
      'Levée': '150 mm',
      'Roues': 'Bandage Polyuréthane'
    },
    image: '/images/products/roller-h125.jpg',
    price_display: 'SUR DEVIS',
    compatibility: ['H125', 'AS350', 'Ecureuil']
  },
  {
    id: 'RL-R130-02',
    name: 'ROLLERS HYDRAULIQUES H130',
    category: 'handling',
    description: 'Roues de manutention spécifiques pour EC130 / H130. Stabilité accrue pour patins larges.',
    features: [
      'Double vérin de levage',
      'Barre de liaison sécurisée',
      'Pompe à double vitesse',
      'Protection anti-dérapante'
    ],
    specs: {
      'Compatibilité': 'EC130 / H130',
      'Charge': '3.5 tonnes',
      'Sécurité': 'Clapet anti-retour',
      'Finition': 'Zingué / Peint'
    },
    image: '/images/products/roller-h130.jpg',
    price_display: 'SUR DEVIS',
    compatibility: ['H130', 'EC130']
  },
  {
    id: 'RL-GAZELLE',
    name: 'ROLLERS GAZELLE',
    category: 'handling',
    description: 'Dispositif de mise sur roues pour SA341/342. Indispensable pour la maintenance en hangar.',
    features: [
      'Système compact',
      'Levage mécanique par vis',
      'Roues jumelées',
      'Attache rapide sur tubes patins'
    ],
    specs: {
      'Compatibilité': 'Gazelle',
      'Poids': '15 kg / unité',
      'Manœuvre': 'Manivelle',
      'Kit': 'Paire + Timon'
    },
    image: '/images/products/roller-gazelle.jpg',
    price_display: 'SUR DEVIS',
    compatibility: ['Gazelle']
  }
]
