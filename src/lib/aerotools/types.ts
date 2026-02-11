/**
 * AEROTOOL Configurator — Type Definitions
 * Helicopters, Parts, Zones, Compatibility
 */

// ============================================
// MANUFACTURER
// ============================================

export interface Manufacturer {
  id: string;
  name: string;
  logo?: string;
  country: string;
}

// ============================================
// HELICOPTER
// ============================================

export interface Helicopter {
  id: string;
  slug: string;
  manufacturer: string; // Manufacturer ID
  name: string;
  designations: string[]; // Alternative names (EC145, BK117, etc.)
  category: 'light' | 'medium' | 'heavy' | 'military';
  specs: HelicopterSpecs;
  zones: Zone[];
  images: {
    thumbnail: string;
    gallery: string[];
    model3d?: string; // GLB/GLTF path
  };
  description: string;
  inService: boolean;
}

export interface HelicopterSpecs {
  mtow: number; // Max takeoff weight (kg)
  maxSpeed: number; // km/h
  range: number; // km
  passengers: number;
  crew: number;
  engines: number;
  landingGear: 'skid' | 'wheeled' | 'retractable';
  length: number; // m
  height: number; // m
  rotorDiameter: number; // m
}

// ============================================
// ZONE (Equipment mounting point)
// ============================================

export interface Zone {
  id: string;
  name: string;
  description: string;
  position: {
    x: number; // 0-100 (% from left)
    y: number; // 0-100 (% from top)
    z: number; // 3D depth for hotspot
  };
  rotation?: {
    x: number;
    y: number;
    z: number;
  };
  compatibleCategories: PartCategory[];
}

// ============================================
// PART (Equipment)
// ============================================

export type PartCategory =
  | 'towbar'
  | 'jack'
  | 'wheel'
  | 'dolly'
  | 'ground-handler'
  | 'maintenance-kit'
  | 'cover'
  | 'stand'
  | 'accessory';

export interface Part {
  id: string;
  slug: string;
  ref: string; // Product reference (BR-H160)
  name: string;
  category: PartCategory;
  description: string;
  specs: Record<string, string | number>;
  certifications: string[];
  availability: 'in-stock' | 'made-to-order' | 'discontinued';
  leadTime?: number; // Days if made-to-order
  images: {
    thumbnail: string;
    gallery: string[];
    model3d?: string;
  };
  documents: {
    name: string;
    url: string;
    type: 'pdf' | 'dwg' | 'step';
  }[];
  price?: number; // Optional, B2B = quote-based
}

// ============================================
// COMPATIBILITY
// ============================================

export interface CompatibilityEntry {
  helicopterId: string;
  zoneId: string;
  partIds: string[];
}

export interface CompatibilityMatrix {
  entries: CompatibilityEntry[];
}

// ============================================
// CONFIGURATION (User selection)
// ============================================

export interface ConfigurationItem {
  helicopterId: string;
  zoneId: string;
  partId: string;
  quantity: number;
}

export interface Configuration {
  id: string;
  name: string;
  helicopterId: string;
  items: ConfigurationItem[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// QUOTE CART
// ============================================

export interface QuoteCartItem {
  part: Part;
  helicopterId: string;
  helicopterName: string;
  zoneId: string;
  zoneName: string;
  quantity: number;
}

export interface QuoteCart {
  items: QuoteCartItem[];
  configurations: Configuration[];
}

// ============================================
// CATEGORY LABELS (FR)
// ============================================

export const CATEGORY_LABELS: Record<PartCategory, string> = {
  towbar: 'Barres de remorquage',
  jack: 'Vérins hydrauliques',
  wheel: 'Roues & roulettes',
  dolly: 'Chariots',
  'ground-handler': 'Tracteurs',
  'maintenance-kit': 'Kits maintenance',
  cover: 'Housses & protections',
  stand: 'Béquilles & trépieds',
  accessory: 'Accessoires',
};

export const AVAILABILITY_LABELS: Record<Part['availability'], string> = {
  'in-stock': 'En stock',
  'made-to-order': 'Sur commande',
  discontinued: 'Arrêté',
};

export const CATEGORY_COLORS: Record<PartCategory, string> = {
  towbar: 'blue',
  jack: 'amber',
  wheel: 'green',
  dolly: 'purple',
  'ground-handler': 'red',
  'maintenance-kit': 'cyan',
  cover: 'gray',
  stand: 'orange',
  accessory: 'pink',
};
