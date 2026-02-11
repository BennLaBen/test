'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Part } from '@/lib/aerotools/types';
import { CATEGORY_LABELS, AVAILABILITY_LABELS } from '@/lib/aerotools/types';

interface PartCardProps {
  part: Part;
  onAdd?: (part: Part) => void;
  showAddButton?: boolean;
  compact?: boolean;
}

export default function PartCard({ part, onAdd, showAddButton = true, compact = false }: PartCardProps) {
  const availabilityColors: Record<Part['availability'], string> = {
    'in-stock': 'at-badge-green',
    'made-to-order': 'at-badge-amber',
    'discontinued': 'at-badge-red',
  };

  if (compact) {
    return (
      <div className="at-card at-card-interactive p-3 flex gap-3">
        <div className="relative w-16 h-16 flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-gray-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{part.name}</p>
          <p className="text-xs text-gray-400">Réf. {part.ref}</p>
          <div className="mt-1 flex items-center gap-2">
            <span className={`at-badge ${availabilityColors[part.availability]} text-[10px]`}>
              {AVAILABILITY_LABELS[part.availability]}
            </span>
          </div>
        </div>
        
        {showAddButton && onAdd && (
          <button
            onClick={() => onAdd(part)}
            className="at-btn at-btn-primary at-btn-sm flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="at-card at-card-interactive overflow-hidden">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-800">
        <div className="absolute inset-0 flex items-center justify-center text-gray-600">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        
        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <span className={`at-badge ${availabilityColors[part.availability]}`}>
            {AVAILABILITY_LABELS[part.availability]}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
          {CATEGORY_LABELS[part.category]}
        </p>
        
        <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">
          {part.name}
        </h3>
        
        <p className="text-sm text-gray-400 mb-3">
          Réf. {part.ref}
        </p>
        
        {/* Key specs */}
        <div className="space-y-1 mb-4">
          {Object.entries(part.specs).slice(0, 3).map(([key, value]) => (
            <div key={key} className="flex justify-between text-xs">
              <span className="text-gray-500 capitalize">{key}</span>
              <span className="text-gray-300">{value}</span>
            </div>
          ))}
        </div>
        
        {/* Certifications */}
        {part.certifications.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {part.certifications.slice(0, 2).map((cert) => (
              <span key={cert} className="at-badge at-badge-neutral text-[10px]">
                {cert}
              </span>
            ))}
          </div>
        )}
        
        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/aerotools/parts/${part.slug}`}
            className="at-btn at-btn-secondary at-btn-sm flex-1"
          >
            Détails
          </Link>
          
          {showAddButton && onAdd && (
            <button
              onClick={() => onAdd(part)}
              className="at-btn at-btn-primary at-btn-sm flex-1"
            >
              Ajouter
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
