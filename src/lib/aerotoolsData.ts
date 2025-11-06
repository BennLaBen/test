import { translateText, translateArray } from '@/lib/translator'

// Base de données des produits AEROTOOLS
// Source: https://lledo-industries.com/aerotools/

export interface AerotoolsProduct {
  id: string
  name: string
  category: 'barre-remorquage' | 'roller'
  title: string
  description: string
  helicopter: string[]
  specifications: {
    label: string
    value: string
  }[]
  certifications: string[]
  images: string[]
  variants?: {
    id: string
    name: string
    description: string
  }[]
  price?: string
  sku: string
  overview: {
    intro: string
    highlights: string[]
    applications: string[]
  }
  tutorial?: {
    title: string
    steps: {
      title: string
      description: string
    }[]
    duration?: string
  }
  resources?: {
    title: string
    items: {
      label: string
      description: string
      href?: string
    }[]
  }
}

export const aerotoolsProducts: AerotoolsProduct[] = [
  // BARRES DE REMORQUAGE
  {
    id: 'br-b332',
    name: 'BR-B332',
    category: 'barre-remorquage',
    title: 'Barre de remorquage EC225 / AS332',
    description: 'Barre de remorquage hydraulique spécialement conçue pour les hélicoptères Airbus EC225 et AS332 Super Puma. Système robuste et ergonomique pour déplacements au sol en toute sécurité.',
    helicopter: ['EC225', 'AS332 Super Puma'],
    specifications: [
      { label: 'CMU', value: '6000 kg' },
      { label: 'Diamètre patins', value: 'Ø120mm' },
      { label: 'Système hydraulique', value: '350 bar certifié' },
      { label: 'Poids', value: '145 kg' },
      { label: 'Dimensions', value: '1800 × 1000 × 600 mm' }
    ],
    certifications: ['Directive Machines 2006/42/CE', 'ISO 9667', 'EN 12312-1'],
    images: [
      '/images/aerotools/br-b332-01.jpg',
      '/images/aerotools/br-b332-02.jpg',
      '/images/aerotools/br-b332-03.jpg'
    ],
    variants: [
      { id: '01', name: 'BR-B332-01', description: 'Version standard avec pompe manuelle' },
      { id: '02', name: 'BR-B332-02', description: 'Version électrique avec batterie 72h' },
      { id: '03', name: 'BR-B332-03', description: 'Version télécommande sans fil' }
    ],
    sku: 'BR-B332',
    price: 'Nous consulter',
    overview: {
      intro: 'Conçue pour les plateformes heavy-lift EC225 et AS332, la BR-B332 combine un châssis renforcé et une hydraulique pilotée afin de déplacer les appareils en toute sécurité, même sur apron encombré.',
      highlights: [
        'Circuit hydraulique 350 bar avec clapets anti-retour intégrés',
        'Timons réglables pour adapter l’ergonomie aux opérateurs',
        'Structure acier/aluminium traitée anticorrosion pour usage offshore'
      ],
      applications: [
        'Remorquage hangar & tarmac pour les flottes Super Puma',
        'Missions offshore et SAR nécessitant des rotations rapides',
        'Maintenance lourde et opérations de levage contrôlé'
      ],
    },
    tutorial: {
      title: 'Mise en œuvre opérateur (≈10 min)',
      duration: '10 minutes',
      steps: [
        {
          title: 'Préparation & contrôle',
          description: 'Effectuez l’inspection visuelle, vérifiez la pression hydraulique et positionnez la barre à hauteur du train principal.'
        },
        {
          title: 'Accrochage sécuritaire',
          description: 'Alignez les fourches, engagez les axes de verrouillage et sécurisez les goupilles selon la procédure CMU 1,25×.'
        },
        {
          title: 'Levée contrôlée',
          description: 'Actionnez la pompe hydraulique jusqu’à dégagement des patins, contrôlez l’élévation puis verrouillez les clapets.'
        },
        {
          title: 'Déplacement & parcage',
          description: 'Remorquez à vitesse maîtrisée, effectuez les corrections via la tête pivotante et reposez l’appareil sur ses patins au point de stationnement.'
        }
      ],
    },
    resources: {
      title: 'Ressources & support',
      items: [
        {
          label: 'Fiche technique complète',
          description: 'Dimensions, couples de serrage et composition du kit opérateur.',
          href: 'mailto:contact@lledo-industries.com?subject=BR-B332%20-%20Fiche%20technique'
        },
        {
          label: 'Procédure contrôle CMU',
          description: 'Check-list de vérification et protocole d’essais 1,25×.',
          href: 'mailto:contact@lledo-industries.com?subject=BR-B332%20-%20Proc%C3%A9dure%20CMU'
        },
        {
          label: 'Assistance hotline 7j/7',
          description: 'Support opérateur et maintenance préventive personnalisée.',
          href: 'tel:+33442029674'
        }
      ],
    }
  },
  {
    id: 'br-h160',
    name: 'BR-H160',
    category: 'barre-remorquage',
    title: 'Barre de remorquage H160',
    description: 'Barre de remorquage dernière génération pour l\'Airbus H160. Design moderne et fonctionnalités avancées pour une manutention optimale de ce nouvel appareil.',
    helicopter: ['H160'],
    specifications: [
      { label: 'CMU', value: '4500 kg' },
      { label: 'Diamètre patins', value: 'Ø100mm' },
      { label: 'Système hydraulique', value: '350 bar' },
      { label: 'Poids', value: '110 kg' },
      { label: 'Options', value: 'Télécommande, Batterie Li-Ion' }
    ],
    certifications: ['Directive Machines 2006/42/CE', 'ISO 9667', 'EN 12312-1'],
    images: [
      '/images/aerotools/br-h160-01.jpg',
      '/images/aerotools/br-h160-02.jpg',
      '/images/aerotools/br-h160-03.jpg',
      '/images/aerotools/br-h160-04.jpg',
      '/images/aerotools/br-h160-05.jpg'
    ],
    variants: [
      { id: '01', name: 'BR-H160-01', description: 'Version standard' },
      { id: '02', name: 'BR-H160-02', description: 'Version électrique' },
      { id: '03', name: 'BR-H160-03', description: 'Version télécommande' },
      { id: '04', name: 'BR-H160-04', description: 'Version offshore (anti-corrosion)' },
      { id: '05', name: 'BR-H160-05', description: 'Version militaire' }
    ],
    sku: 'BR-H160',
    price: 'Nous consulter',
    overview: {
      intro: 'Développée en collaboration avec les équipes programmes H160, la BR-H160 reprend l’ergonomie futuriste de l’appareil et garantit des déplacements fluides en environnement industriel ou aéroportuaire.',
      highlights: [
        'Interface d’accrochage spécifique H160 à verrouillage semi-automatique',
        'Commande électrique optionnelle avec batterie Li-Ion 72 h',
        'Capteurs de charge intégrés pour surveiller les efforts de traction'
      ],
      applications: [
        'Opérations de remorquage en hangar H160',
        'Préparation de mission offshore et EMS',
        'Formations opérateurs pour flottes mixtes H160/H175'
      ],
    },
    tutorial: {
      title: 'Routine opérateur H160',
      steps: [
        {
          title: 'Alignement guidé',
          description: 'Positionnez la barre sur l’axe du train, utilisez les roulettes directrices pour aligner la tête d’arrimage sur le H160.'
        },
        {
          title: 'Verrouillage et diagnostics',
          description: 'Engagez le verrou multi-point, confirmez le signal lumineux de verrouillage et lancez l’auto-diagnostic (mode électrique).'
        },
        {
          title: 'Séquence de levage',
          description: 'Activez la pompe hydraulique, contrôlez l’élévation et sécurisez la position via la valve de maintien.'
        },
        {
          title: 'Remorquage sécurisé',
          description: 'Utilisez la poignée ergonomique pour diriger l’appareil, vitesse maxi 4 km/h, surveillez le retour force sur la poignée.'
        }
      ],
    },
    resources: {
      title: 'Kit documentaire',
      items: [
        {
          label: 'Notice opérateur H160',
          description: 'Guide illustré de mise en œuvre et recommandations Airbus.',
          href: 'mailto:contact@lledo-industries.com?subject=BR-H160%20-%20Notice%20op%C3%A9rateur'
        },
        {
          label: 'Programme de maintenance',
          description: 'Planning préventif 12/24 mois et références pièces détachées.',
          href: 'mailto:contact@lledo-industries.com?subject=BR-H160%20-%20Maintenance'
        },
        {
          label: 'Session de formation',
          description: 'Organisation d’une formation opérateur sur site MRO ou chez LLEDO.',
          href: 'mailto:contact@lledo-industries.com?subject=BR-H160%20-%20Formation'
        }
      ],
    }
  },
  {
    id: 'br-nh90',
    name: 'BR-NH90-01',
    category: 'barre-remorquage',
    title: 'Barre de remorquage NH90',
    description: 'Barre de remorquage spécialement développée pour le NH90, hélicoptère militaire multi-rôles. Conception renforcée pour usage intensif et conditions opérationnelles exigeantes.',
    helicopter: ['NH90', 'NH90 TTH', 'NH90 NFH'],
    specifications: [
      { label: 'CMU', value: '6500 kg' },
      { label: 'Diamètre patins', value: 'Ø120mm' },
      { label: 'Système hydraulique', value: '400 bar renforcé' },
      { label: 'Poids', value: '160 kg' },
      { label: 'Usage', value: 'Militaire / Opérations' }
    ],
    certifications: ['Directive Machines 2006/42/CE', 'ISO 9667', 'Agrément DGA'],
    images: ['/images/aerotools/br-nh90-01.jpg'],
    sku: 'BR-NH90-01',
    price: 'Nous consulter',
    overview: {
      intro: 'Barre renforcée conçue pour résister aux contraintes opérationnelles des forces armées utilisant le NH90 (TTH/NFH). Châssis haute résistance et protection anticorrosion marine.',
      highlights: [
        'Structure renforcée pour charges dynamiques et terrains dégradés',
        'Bloc hydraulique 400 bar avec soupapes redondantes',
        'Interfaces interchangeables pour configurations TTH et NFH'
      ],
      applications: [
        'Opérations militaires sur bases avancées',
        'Maintenance lourde ministère des Armées & DGA',
        'Transferts hangar / piste en conditions météo dégradées'
      ],
    },
    tutorial: {
      title: 'Séquence opérationnelle terrain',
      steps: [
        {
          title: 'Inspection militaire',
          description: 'Contrôlez l’état des axes, le serrage et la propreté conformément à la fiche DGA avant engagement.'
        },
        {
          title: 'Engagement sur train principal',
          description: 'Positionnez les mâchoires spécifiques NH90, vérifiez l’enclenchement total et sécurisez avec les goupilles auto-bloquantes.'
        },
        {
          title: 'Levage et verrouillage',
          description: 'Actionnez la pompe manuelle ou électrique, obtenez le dégagement souhaité puis verrouillez la vanne de sécurité double effet.'
        },
        {
          title: 'Transit & désengagement',
          description: 'Limitez la vitesse à 3 km/h en zone opérationnelle, puis relâchez la pression et retirez la barre dans l’ordre inverse.'
        }
      ],
    },
    resources: {
      title: 'Support opérationnel',
      items: [
        {
          label: 'Fiche DGA',
          description: 'Résumé des tests d’agrément DGA et de la conformité OTAN.',
          href: 'mailto:contact@lledo-industries.com?subject=BR-NH90%20-%20Fiche%20DGA'
        },
        {
          label: 'Procédure terrain',
          description: 'Guide d’utilisation en opérations extérieures (OPEX).',
          href: 'mailto:contact@lledo-industries.com?subject=BR-NH90%20-%20Proc%C3%A9dure%20terrain'
        },
        {
          label: 'Assistance mission critique',
          description: 'Hotline dédiée défense & remplacement express des pièces.',
          href: 'tel:+33442029674'
        }
      ],
    }
  },
  {
    id: 'br-h175',
    name: 'BR-H175',
    category: 'barre-remorquage',
    title: 'Barre de remorquage H175',
    description: 'Barre de remorquage pour Airbus H175, hélicoptère moyen-lourd de dernière génération. Système hydraulique haute performance pour manutention sécurisée.',
    helicopter: ['H175', 'H175M'],
    specifications: [
      { label: 'CMU', value: '5500 kg' },
      { label: 'Diamètre patins', value: 'Ø110mm' },
      { label: 'Système hydraulique', value: '350 bar' },
      { label: 'Poids', value: '135 kg' },
      { label: 'Applications', value: 'Civil / Offshore / SAR' }
    ],
    certifications: ['Directive Machines 2006/42/CE', 'ISO 9667', 'EN 12312-1'],
    images: [
      '/images/aerotools/br-h175-01.jpg',
      '/images/aerotools/br-h175-02.jpg'
    ],
    variants: [
      { id: '01', name: 'BR-H175-01', description: 'Version standard civile' },
      { id: '02', name: 'BR-H175-02', description: 'Version offshore anti-corrosion' }
    ],
    sku: 'BR-H175',
    price: 'Nous consulter',
    overview: {
      intro: 'Solution de remorquage dédiée au H175/H175M pour les opérateurs offshore, SAR et corporate. Equilibre entre compacité, robustesse et maniabilité.',
      highlights: [
        'Interface rapide adaptée aux trains H175 civils et militaires',
        'Hydraulique haute performance pour levée progressive',
        'Finition marine anti-corrosion pour environnements salins'
      ],
      applications: [
        'Bases offshore gaz & pétrole',
        'Opérations Search & Rescue côtières',
        'Déplacements en hangar corporate haut de gamme'
      ],
    },
    tutorial: {
      title: 'Procédure standard H175',
      steps: [
        {
          title: 'Alignement guidé',
          description: 'Repérez les repères au sol, alignez la barre avec les patins H175 et centrez la tête d’accrochage.'
        },
        {
          title: 'Verrouillage multipoint',
          description: 'Insérez les axes, verrouillez les manettes de sécurité puis effectuez le contrôle visuel 360°.'
        },
        {
          title: 'Levage et contrôle',
          description: 'Actionnez la pompe jusqu’au dégagement souhaité, surveillez l’indicateur de pression et stabilisez le rotor.'
        },
        {
          title: 'Transit',
          description: 'Remorquez avec une trajectoire progressive, utilisez la poignée secondaire pour corriger les écarts.'
        }
      ],
    },
    resources: {
      title: 'Documentation & services',
      items: [
        {
          label: 'Fiche produit H175',
          description: 'Spécifications complètes et options (anti-corrosion, militaire).',
          href: 'mailto:contact@lledo-industries.com?subject=BR-H175%20-%20Fiche%20produit'
        },
        {
          label: 'Programme offshore',
          description: 'Conseils de maintenance pour sites offshore et environnements salins.',
          href: 'mailto:contact@lledo-industries.com?subject=BR-H175%20-%20Programme%20offshore'
        },
        {
          label: 'Assistance pièces & SAV',
          description: 'Commande de pièces, rétrofit et upgrades H175M.',
          href: 'mailto:contact@lledo-industries.com?subject=BR-H175%20-%20Support'
        }
      ],
    }
  },
  {
    id: 'br-bhhl',
    name: 'BR-BHHL-01',
    category: 'barre-remorquage',
    title: 'Barre de remorquage Bell Heavy Helicopter',
    description: 'Barre de remorquage universelle pour hélicoptères lourds Bell (212, 412, 429). Système polyvalent et robuste adapté aux flottes mixtes.',
    helicopter: ['Bell 212', 'Bell 412', 'Bell 429'],
    specifications: [
      { label: 'CMU', value: '5000 kg' },
      { label: 'Diamètre patins', value: 'Ø100-110mm (réglable)' },
      { label: 'Système hydraulique', value: '350 bar' },
      { label: 'Poids', value: '125 kg' },
      { label: 'Type', value: 'Universel Bell' }
    ],
    certifications: ['Directive Machines 2006/42/CE', 'ISO 9667'],
    images: ['/images/aerotools/br-bhhl-01.jpg'],
    sku: 'BR-BHHL-01',
    price: 'Nous consulter',
    overview: {
      intro: 'Barre universelle conçue pour les hélicoptères lourds Bell 212/412/429. Adaptable et robuste, idéale pour les flottes mixtes civilo-militaires.',
      highlights: [
        'Large amplitude de réglage pour différents entraxes',
        'Hydraulique 350 bar fiable et simple à entretenir',
        'Timon pivotant à double poignée pour manœuvres précises'
      ],
      applications: [
        'Opérateurs parapublics et forces de sécurité',
        'Sociétés de transport utility & incendie',
        'Bases de maintenance multimarques Bell'
      ],
    },
    tutorial: {
      title: 'Routine polyvalente Bell',
      steps: [
        {
          title: 'Réglage patins',
          description: 'Sélectionnez l’entretoise adaptée, ajustez la largeur aux patins du modèle Bell visé.'
        },
        {
          title: 'Engagement',
          description: 'Placez la barre sous le train, verrouillez les griffes réglables et installez les goupilles de sécurité.'
        },
        {
          title: 'Levage progressif',
          description: 'Pompez jusqu’au dégagement désiré puis verrouillez la vanne de maintien pour sécuriser la position.'
        },
        {
          title: 'Déplacement',
          description: 'Utilisez le timon articulé pour tourner serré, surveillez la vitesse et la communication avec le tracteur.'
        }
      ],
    },
    resources: {
      title: 'Ressources universelles',
      items: [
        {
          label: 'Guide de réglage multi-modèles',
          description: 'Paramètres recommandés pour Bell 212, 412, 429.',
          href: 'mailto:contact@lledo-industries.com?subject=BR-BHHL%20-%20Guide%20r%C3%A9glage'
        },
        {
          label: 'Check-list de sécurité',
          description: 'Points de contrôle avant/après remorquage pour opérations mixtes.',
          href: 'mailto:contact@lledo-industries.com?subject=BR-BHHL%20-%20Check-list'
        },
        {
          label: 'Support pièces détachées',
          description: 'Kit joints, axes et flexibles disponibles sous 48 h.',
          href: 'mailto:contact@lledo-industries.com?subject=BR-BHHL%20-%20Pi%C3%A8ces%20d%C3%A9tach%C3%A9es'
        }
      ],
    }
  },

  // SYSTÈMES HYDRAULIQUES (ROLLERS)
  {
    id: 'rl-r125',
    name: 'RL-R125',
    category: 'roller',
    title: 'Rollers hydrauliques H125/AS350',
    description: 'Système de rollers hydrauliques spécialement conçu pour les H125/AS350 (Écureuil). Solution ergonomique pour déplacements au sol en hangar et sur apron.',
    helicopter: ['H125', 'AS350', 'EC130'],
    specifications: [
      { label: 'CMU', value: '3500 kg' },
      { label: 'Diamètre patins', value: 'Ø80mm' },
      { label: 'Système hydraulique', value: '350 bar certifié' },
      { label: 'Poids', value: '85 kg' },
      { label: 'Roues', value: 'Pivotantes verrouillables Ø125mm' }
    ],
    certifications: ['Directive Machines 2006/42/CE', 'ISO 9667', 'EN 12312-1', 'Airbus Helicopters'],
    images: [
      '/images/aerotools/rl-r125-02.jpg',
      '/images/aerotools/rl-r125-03.jpg'
    ],
    variants: [
      { id: '02', name: 'RL-R125-02', description: 'Version standard (identique RL125-02)' },
      { id: '03', name: 'RL-R125-03', description: 'Version électrique avec batterie' }
    ],
    sku: 'RL-R125',
    price: 'Nous consulter',
    overview: {
      intro: 'Rollers hydrauliques best-seller pour H125/AS350, permettant des déplacements ultra précis sur surface plane avec effort opérateur minimal.',
      highlights: [
        'Hydraulique 350 bar avec clapet de sécurité intégré',
        'Roues pivotantes Ø125 mm avec frein double action',
        'Kit patins Airbus homologué et traçabilité complète'
      ],
      applications: [
        'Positionnement précis dans les hangars d’entretien',
        'Rotation rapide d’appareils entre zones de service',
        'Opérations de maintenance avionique et cellule'
      ],
    },
    tutorial: {
      title: 'Déplacement H125 en 5 étapes',
      steps: [
        {
          title: 'Préparation & calage',
          description: 'Installez les cales roues, vérifiez la pression hydraulique et positionnez les patins sous le train.'
        },
        {
          title: 'Levée synchronisée',
          description: 'Actionnez la pompe pour lever progressivement, assurez-vous que les quatre patins quittent le sol uniformément.'
        },
        {
          title: 'Verrouillage des roues',
          description: 'Engagez les freins directionnels selon la trajectoire souhaitée (rotation / translation).'
        },
        {
          title: 'Déplacement contrôlé',
          description: 'Poussez en veillant à la communication équipe, utilisez les poignées latérales pour corriger la trajectoire.'
        },
        {
          title: 'Repose de l’appareil',
          description: 'Relâchez la pression, vérifiez le contact patins sol et retirez le système en suivant la check-list.'
        }
      ],
    },
    resources: {
      title: 'Documentation & assistance',
      items: [
        {
          label: 'Notice d’exploitation RL-R125',
          description: 'Guide complet, consignes de sécurité et couples recommandés.',
          href: 'mailto:contact@lledo-industries.com?subject=RL-R125%20-%20Notice'
        },
        {
          label: 'Tutoriel vidéo (sur demande)',
          description: 'Démonstration pas-à-pas pour les nouveaux opérateurs.',
          href: 'mailto:contact@lledo-industries.com?subject=RL-R125%20-%20Tutoriel%20vid%C3%A9o'
        },
        {
          label: 'Programme maintenance préventive',
          description: 'Planning graissage, contrôle joints et calibrage vérin.',
          href: 'mailto:contact@lledo-industries.com?subject=RL-R125%20-%20Maintenance'
        }
      ],
    }
  },
  {
    id: 'rl-r130',
    name: 'RL-R130-02',
    category: 'roller',
    title: 'Rollers hydrauliques EC130',
    description: 'Rollers hydrauliques optimisés pour l\'Airbus EC130. Design spécifique pour ce modèle mono-rotor avec empennage fenestron.',
    helicopter: ['EC130', 'EC130 T2'],
    specifications: [
      { label: 'CMU', value: '3200 kg' },
      { label: 'Diamètre patins', value: 'Ø80mm' },
      { label: 'Système hydraulique', value: '350 bar' },
      { label: 'Poids', value: '82 kg' },
      { label: 'Spécificité', value: 'Adapté EC130' }
    ],
    certifications: ['Directive Machines 2006/42/CE', 'ISO 9667', 'Airbus Helicopters'],
    images: ['/images/aerotools/rl-r130-02.jpg'],
    sku: 'RL-R130-02',
    price: 'Nous consulter',
    overview: {
      intro: 'Rollers hydrauliques conçus spécifiquement pour l’EC130 et son empennage fenestron. Optimisés pour les opérations de tourisme et de transport VIP.',
      highlights: [
        'Empattement adapté à la géométrie EC130',
        'Vérin hydraulique haute sensibilité pour levage progressif',
        'Patins avec revêtement anti-marques pour sols haut de gamme'
      ],
      applications: [
        'Bases touristiques et terminaux VIP',
        'Maintenance cellule et peinture EC130',
        'Positionnement en showroom / salons aéronautiques'
      ],
    },
    tutorial: {
      title: 'Procédure opérateur EC130',
      steps: [
        {
          title: 'Placement',
          description: 'Positionnez chaque module sous les zones de charge recommandées, contrôlez la répartition.'
        },
        {
          title: 'Levée uniforme',
          description: 'Pompez de façon alternée pour maintenir l’hélicoptère stable et éviter les torsions du fenestron.'
        },
        {
          title: 'Verrouillage',
          description: 'Bloquez les roues suivant la trajectoire souhaitée (rotation ou translation).'
        },
        {
          title: 'Déplacement silencieux',
          description: 'Déplacez doucement en profitant des roulettes silencieuses adaptées aux sols techniques.'
        },
        {
          title: 'Repose',
          description: 'Relâchez progressivement la pression, puis retirez chaque module en respectant la check-list.'
        }
      ],
    },
    resources: {
      title: 'Ressources premium',
      items: [
        {
          label: 'Fiche RL-R130-02',
          description: 'Dimensions, masses et options personnalisées.',
          href: 'mailto:contact@lledo-industries.com?subject=RL-R130-02%20-%20Fiche'
        },
        {
          label: 'Conseils sols délicats',
          description: 'Guide d’utilisation sur sols résine/époxy et moquettes techniques.',
          href: 'mailto:contact@lledo-industries.com?subject=RL-R130-02%20-%20Guide%20sols'
        },
        {
          label: 'Assistance VIP 24/7',
          description: 'Support dédié aux exploitants premium et charters.',
          href: 'tel:+33442029674'
        }
      ],
    }
  },
  {
    id: 'rl-gazelle',
    name: 'Rollers GAZELLE',
    category: 'roller',
    title: 'Rollers hydrauliques SA341/342 Gazelle',
    description: 'Rollers hydrauliques spécialement développés pour la Gazelle (SA341/342). Système compact adapté aux dimensions réduites de cet hélicoptère léger.',
    helicopter: ['SA341 Gazelle', 'SA342 Gazelle'],
    specifications: [
      { label: 'CMU', value: '2500 kg' },
      { label: 'Diamètre patins', value: 'Ø70mm' },
      { label: 'Système hydraulique', value: '300 bar' },
      { label: 'Poids', value: '65 kg' },
      { label: 'Type', value: 'Compact / Léger' }
    ],
    certifications: ['Directive Machines 2006/42/CE', 'ISO 9667'],
    images: [
      '/images/aerotools/rl-gazelle-02.jpg',
      '/images/aerotools/rl-gazelle-03.jpg'
    ],
    variants: [
      { id: '02', name: 'Rollers GAZELLE-02', description: 'Version militaire' },
      { id: '03', name: 'Rollers GAZELLE-03', description: 'Version civile' }
    ],
    sku: 'RL-GAZELLE',
    price: 'Nous consulter',
    overview: {
      intro: 'Rollers compacts développés pour les hélicoptères SA341/342 Gazelle. Idéals pour les sites à espace restreint et les opérations rapides.',
      highlights: [
        'Format compact compatible hangars exigus',
        'Hydraulique 300 bar assurant une levée progressive',
        'Patins à revêtement haute adhérence pour sols militaires'
      ],
      applications: [
        'Bases militaires et opérations tactiques',
        'Maintenances Gazelle (armée de terre / export)',
        'Déplacements sur remorques et transportables'
      ],
    },
    tutorial: {
      title: 'Procédure Gazelle terrain',
      steps: [
        {
          title: 'Préparation',
          description: 'Positionnez les modules sous les patins, vérifiez l’état des vérins et l’absence de débris.'
        },
        {
          title: 'Levée maîtrisée',
          description: 'Actionnez la pompe jusqu’à ce que les patins soient dégagés, contrôlez la stabilité latérale.'
        },
        {
          title: 'Translation',
          description: 'Dirigez l’appareil à faible vitesse, utilisez les poignées pour orienter la Gazelle dans les espaces réduits.'
        },
        {
          title: 'Repose & pliage',
          description: 'Relâchez la pression hydraulique, retirez les modules et rangez-les dans leur caisse de transport.'
        }
      ],
    },
    resources: {
      title: 'Support Gazelle',
      items: [
        {
          label: 'Guide opérateur SA341/342',
          description: 'Consignes spécifiques aux versions civiles et militaires.',
          href: 'mailto:contact@lledo-industries.com?subject=RL-GAZELLE%20-%20Guide%20op%C3%A9rateur'
        },
        {
          label: 'Plan de maintenance terrain',
          description: 'Kit joints et contrôle vérins pour opérations déployées.',
          href: 'mailto:contact@lledo-industries.com?subject=RL-GAZELLE%20-%20Maintenance'
        },
        {
          label: 'Assistance théâtre d’opérations',
          description: 'Hotline dédiée pour interventions urgentes et formation express.',
          href: 'tel:+33442029674'
        }
      ],
    }
  }
]

// Fonction pour récupérer tous les produits
export function getAllAerotoolsProducts(): AerotoolsProduct[] {
  return aerotoolsProducts
}

export async function getLocalizedAerotoolsProducts(locale: 'fr' | 'en' = 'fr'): Promise<AerotoolsProduct[]> {
  if (locale === 'fr') {
    return aerotoolsProducts
  }

  return Promise.all(
    aerotoolsProducts.map(async (product) => {
      const [name, title, description] = await Promise.all([
        translateText(product.name, 'en'),
        translateText(product.title, 'en'),
        translateText(product.description, 'en'),
      ])

      const helicopter = await translateArray(product.helicopter, 'en')
      const specifications = await Promise.all(
        product.specifications.map(async (spec) => {
          const [label, value] = await Promise.all([
            translateText(spec.label, 'en'),
            translateText(spec.value, 'en'),
          ])
          return { label, value }
        })
      )

      const certifications = await translateArray(product.certifications, 'en')

      const overview = {
        intro: await translateText(product.overview.intro, 'en'),
        highlights: await translateArray(product.overview.highlights, 'en'),
        applications: await translateArray(product.overview.applications, 'en'),
      }

      const tutorial = product.tutorial
        ? {
            title: await translateText(product.tutorial.title, 'en'),
            duration: product.tutorial.duration
              ? await translateText(product.tutorial.duration, 'en')
              : undefined,
            steps: await Promise.all(
              product.tutorial.steps.map(async (step) => {
                const [stepTitle, stepDescription] = await Promise.all([
                  translateText(step.title, 'en'),
                  translateText(step.description, 'en'),
                ])
                return { title: stepTitle, description: stepDescription }
              })
            ),
          }
        : undefined

      const resources = product.resources
        ? {
            title: await translateText(product.resources.title, 'en'),
            items: await Promise.all(
              product.resources.items.map(async (item) => {
                const [label, resourceDescription] = await Promise.all([
                  translateText(item.label, 'en'),
                  translateText(item.description, 'en'),
                ])
                return {
                  label,
                  description: resourceDescription,
                  href: item.href,
                }
              })
            ),
          }
        : undefined

      const variants = product.variants
        ? await Promise.all(
            product.variants.map(async (variant) => {
              const [variantName, variantDescription] = await Promise.all([
                translateText(variant.name, 'en'),
                translateText(variant.description, 'en'),
              ])
              return {
                id: variant.id,
                name: variantName,
                description: variantDescription,
              }
            })
          )
        : undefined

      return {
        ...product,
        name,
        title,
        description,
        helicopter,
        specifications,
        certifications,
        variants,
        overview,
        tutorial,
        resources,
      }
    })
  )
}

// Fonction pour récupérer un produit par son ID
export function getAerotoolsProductById(id: string): AerotoolsProduct | undefined {
  return aerotoolsProducts.find(product => product.id === id)
}

export async function getLocalizedAerotoolsProductById(id: string, locale: 'fr' | 'en' = 'fr'): Promise<AerotoolsProduct | undefined> {
  if (locale === 'fr') {
    return getAerotoolsProductById(id)
  }

  const product = getAerotoolsProductById(id)
  if (!product) return undefined

  const [name, title, description] = await Promise.all([
    translateText(product.name, 'en'),
    translateText(product.title, 'en'),
    translateText(product.description, 'en'),
  ])

  const helicopter = await translateArray(product.helicopter, 'en')
  const specifications = await Promise.all(
    product.specifications.map(async (spec) => {
      const [label, value] = await Promise.all([
        translateText(spec.label, 'en'),
        translateText(spec.value, 'en'),
      ])
      return { label, value }
    })
  )

  const certifications = await translateArray(product.certifications, 'en')

  const overview = {
    intro: await translateText(product.overview.intro, 'en'),
    highlights: await translateArray(product.overview.highlights, 'en'),
    applications: await translateArray(product.overview.applications, 'en'),
  }

  const tutorial = product.tutorial
    ? {
        title: await translateText(product.tutorial.title, 'en'),
        duration: product.tutorial.duration
          ? await translateText(product.tutorial.duration, 'en')
          : undefined,
        steps: await Promise.all(
          product.tutorial.steps.map(async (step) => {
            const [stepTitle, stepDescription] = await Promise.all([
              translateText(step.title, 'en'),
              translateText(step.description, 'en'),
            ])
            return { title: stepTitle, description: stepDescription }
          })
        ),
      }
    : undefined

  const resources = product.resources
    ? {
        title: await translateText(product.resources.title, 'en'),
        items: await Promise.all(
          product.resources.items.map(async (item) => {
            const [label, resourceDescription] = await Promise.all([
              translateText(item.label, 'en'),
              translateText(item.description, 'en'),
            ])
            return {
              label,
              description: resourceDescription,
              href: item.href,
            }
          })
        ),
      }
    : undefined

  const variants = product.variants
    ? await Promise.all(
        product.variants.map(async (variant) => {
          const [variantName, variantDescription] = await Promise.all([
            translateText(variant.name, 'en'),
            translateText(variant.description, 'en'),
          ])
          return {
            id: variant.id,
            name: variantName,
            description: variantDescription,
          }
        })
      )
    : undefined

  return {
    ...product,
    name,
    title,
    description,
    helicopter,
    specifications,
    certifications,
    variants,
    overview,
    tutorial,
    resources,
  }
}

// Fonction pour récupérer les produits par catégorie
export function getAerotoolsProductsByCategory(category: 'barre-remorquage' | 'roller'): AerotoolsProduct[] {
  return aerotoolsProducts.filter(product => product.category === category)
}

export async function getLocalizedAerotoolsProductsByCategory(category: 'barre-remorquage' | 'roller', locale: 'fr' | 'en' = 'fr'): Promise<AerotoolsProduct[]> {
  const products = aerotoolsProducts.filter(product => product.category === category)
  if (locale === 'fr') return products
  return getLocalizedAerotoolsProducts(locale).then((all) => all.filter((product) => product.category === category))
}

// Fonction pour récupérer les produits compatibles avec un hélicoptère
export function getAerotoolsProductsByHelicopter(helicopterModel: string): AerotoolsProduct[] {
  return aerotoolsProducts.filter(product =>
    product.helicopter.some(h => h.toLowerCase().includes(helicopterModel.toLowerCase()))
  )
}

export async function getLocalizedAerotoolsProductsByHelicopter(helicopterModel: string, locale: 'fr' | 'en' = 'fr'): Promise<AerotoolsProduct[]> {
  const products = getAerotoolsProductsByHelicopter(helicopterModel)
  if (locale === 'fr') return products
  const localized = await getLocalizedAerotoolsProducts(locale)
  return localized.filter((product) => product.helicopter.some(h => h.toLowerCase().includes(helicopterModel.toLowerCase())))
}

