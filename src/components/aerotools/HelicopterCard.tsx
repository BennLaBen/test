'use client';

import Link from 'next/link';
import type { Helicopter } from '@/lib/aerotools/types';
import { getManufacturer, countCompatibleParts } from '@/lib/aerotools/data';

interface HelicopterCardProps {
  helicopter: Helicopter;
  showConfigureButton?: boolean;
}

const categoryLabels: Record<Helicopter['category'], string> = {
  light: 'Léger',
  medium: 'Intermédiaire',
  heavy: 'Lourd',
  military: 'Militaire',
};

const categoryColors: Record<Helicopter['category'], string> = {
  light: 'at-badge-green',
  medium: 'at-badge-blue',
  heavy: 'at-badge-amber',
  military: 'at-badge-red',
};

export default function HelicopterCard({ helicopter, showConfigureButton = true }: HelicopterCardProps) {
  const manufacturer = getManufacturer(helicopter.manufacturer);
  const partsCount = countCompatibleParts(helicopter.id);

  return (
    <div className="at-card at-card-interactive overflow-hidden group">
      {/* Image */}
      <div className="relative aspect-[16/10] bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
        {/* Placeholder silhouette */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-40 transition-opacity">
          <svg viewBox="0 0 200 100" className="w-4/5 h-auto text-blue-500">
            <path
              d="M180 50 L160 50 L150 45 L100 45 L90 40 L40 40 L30 45 L20 45 L10 50 L20 55 L40 55 L50 60 L100 60 L110 55 L160 55 L170 50 Z"
              fill="currentColor"
            />
            <ellipse cx="100" cy="25" rx="70" ry="2" fill="currentColor" opacity="0.5" />
          </svg>
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <span className={`at-badge ${categoryColors[helicopter.category]}`}>
            {categoryLabels[helicopter.category]}
          </span>
        </div>
        
        {/* Parts count */}
        <div className="absolute top-3 right-3">
          <span className="at-badge at-badge-neutral">
            {partsCount} équip.
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Manufacturer */}
        {manufacturer && (
          <p className="text-xs text-blue-400 uppercase tracking-wider mb-1">
            {manufacturer.name}
          </p>
        )}
        
        {/* Name */}
        <h3 className="text-xl font-bold text-white mb-1">
          {helicopter.name}
        </h3>
        
        {/* Designations */}
        {helicopter.designations.length > 0 && (
          <p className="text-sm text-gray-400 mb-3">
            {helicopter.designations.join(' • ')}
          </p>
        )}
        
        {/* Key specs */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-500">MTOW</span>
            <span className="text-gray-300">{helicopter.specs.mtow.toLocaleString()} kg</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Passagers</span>
            <span className="text-gray-300">{helicopter.specs.passengers}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Moteurs</span>
            <span className="text-gray-300">{helicopter.specs.engines}×</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Train</span>
            <span className="text-gray-300 capitalize">
              {helicopter.specs.landingGear === 'skid' ? 'Patins' : 
               helicopter.specs.landingGear === 'wheeled' ? 'Roues' : 'Rétractable'}
            </span>
          </div>
        </div>
        
        {/* Zones */}
        <div className="flex flex-wrap gap-1 mb-4">
          {helicopter.zones.slice(0, 3).map((zone) => (
            <span key={zone.id} className="at-chip text-[10px]">
              {zone.name}
            </span>
          ))}
          {helicopter.zones.length > 3 && (
            <span className="at-chip text-[10px]">
              +{helicopter.zones.length - 3}
            </span>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/aerotools/helicos/${helicopter.slug}`}
            className="at-btn at-btn-secondary at-btn-sm flex-1"
          >
            Fiche
          </Link>
          
          {showConfigureButton && (
            <Link
              href={`/aerotools/configurateur/${helicopter.slug}`}
              className="at-btn at-btn-primary at-btn-sm flex-1"
            >
              Configurer
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
