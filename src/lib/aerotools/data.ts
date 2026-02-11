/**
 * AEROTOOL Configurator — Data Helpers
 */

import helicoptersData from '@/data/aerotools/helicopters.json';
import partsData from '@/data/aerotools/parts.json';
import compatibilityData from '@/data/aerotools/compatibility.json';
import type { Helicopter, Part, Manufacturer, Zone, CompatibilityEntry } from './types';

// ============================================
// MANUFACTURERS
// ============================================

export function getManufacturers(): Manufacturer[] {
  return helicoptersData.manufacturers as Manufacturer[];
}

export function getManufacturer(id: string): Manufacturer | undefined {
  return helicoptersData.manufacturers.find((m) => m.id === id) as Manufacturer | undefined;
}

// ============================================
// HELICOPTERS
// ============================================

export function getHelicopters(): Helicopter[] {
  return helicoptersData.helicopters as Helicopter[];
}

export function getHelicopter(id: string): Helicopter | undefined {
  return helicoptersData.helicopters.find((h) => h.id === id) as Helicopter | undefined;
}

export function getHelicopterBySlug(slug: string): Helicopter | undefined {
  return helicoptersData.helicopters.find((h) => h.slug === slug) as Helicopter | undefined;
}

export function getHelicoptersByManufacturer(manufacturerId: string): Helicopter[] {
  return helicoptersData.helicopters.filter(
    (h) => h.manufacturer === manufacturerId
  ) as Helicopter[];
}

export function getHelicoptersByCategory(category: Helicopter['category']): Helicopter[] {
  return helicoptersData.helicopters.filter((h) => h.category === category) as Helicopter[];
}

export function searchHelicopters(query: string): Helicopter[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  
  return helicoptersData.helicopters.filter((h) => {
    const searchable = [
      h.name,
      h.slug,
      ...h.designations,
      h.manufacturer,
    ].join(' ').toLowerCase();
    return searchable.includes(q);
  }) as Helicopter[];
}

// ============================================
// PARTS
// ============================================

export function getParts(): Part[] {
  return partsData.parts as Part[];
}

export function getPart(id: string): Part | undefined {
  return partsData.parts.find((p) => p.id === id) as Part | undefined;
}

export function getPartBySlug(slug: string): Part | undefined {
  return partsData.parts.find((p) => p.slug === slug) as Part | undefined;
}

export function getPartsByCategory(category: Part['category']): Part[] {
  return partsData.parts.filter((p) => p.category === category) as Part[];
}

export function searchParts(query: string): Part[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  
  return partsData.parts.filter((p) => {
    const searchable = [p.name, p.ref, p.slug, p.category].join(' ').toLowerCase();
    return searchable.includes(q);
  }) as Part[];
}

// ============================================
// COMPATIBILITY
// ============================================

export function getCompatibility(): CompatibilityEntry[] {
  return compatibilityData.compatibility as CompatibilityEntry[];
}

export function getCompatibleParts(helicopterId: string, zoneId: string): Part[] {
  const entry = compatibilityData.compatibility.find(
    (c) => c.helicopterId === helicopterId && c.zoneId === zoneId
  );
  
  if (!entry) return [];
  
  return entry.partIds
    .map((id) => getPart(id))
    .filter((p): p is Part => p !== undefined);
}

export function getCompatibleHelicopters(partId: string): Helicopter[] {
  const helicopterIds = new Set<string>();
  
  compatibilityData.compatibility.forEach((entry) => {
    if (entry.partIds.includes(partId)) {
      helicopterIds.add(entry.helicopterId);
    }
  });
  
  return Array.from(helicopterIds)
    .map((id) => getHelicopter(id))
    .filter((h): h is Helicopter => h !== undefined);
}

export function getZonesWithParts(helicopterId: string): Array<{ zone: Zone; parts: Part[] }> {
  const helicopter = getHelicopter(helicopterId);
  if (!helicopter) return [];
  
  return helicopter.zones.map((zone) => ({
    zone,
    parts: getCompatibleParts(helicopterId, zone.id),
  }));
}

export function countCompatibleParts(helicopterId: string): number {
  const partIds = new Set<string>();
  
  compatibilityData.compatibility
    .filter((c) => c.helicopterId === helicopterId)
    .forEach((c) => {
      c.partIds.forEach((id) => partIds.add(id));
    });
  
  return partIds.size;
}

// ============================================
// CATEGORY HELPERS
// ============================================

export function getPartCategories(): Array<{ id: Part['category']; count: number }> {
  const counts = new Map<Part['category'], number>();
  
  partsData.parts.forEach((p) => {
    const cat = p.category as Part['category'];
    counts.set(cat, (counts.get(cat) || 0) + 1);
  });
  
  return Array.from(counts.entries()).map(([id, count]) => ({ id, count }));
}

export function getHelicopterCategories(): Array<{ id: Helicopter['category']; count: number }> {
  const counts = new Map<Helicopter['category'], number>();
  
  helicoptersData.helicopters.forEach((h) => {
    const cat = h.category as Helicopter['category'];
    counts.set(cat, (counts.get(cat) || 0) + 1);
  });
  
  return Array.from(counts.entries()).map(([id, count]) => ({ id, count }));
}
