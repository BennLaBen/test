'use client';

import { useState } from 'react';
import type { Part, Zone } from '@/lib/aerotools/types';
import { CATEGORY_LABELS, AVAILABILITY_LABELS } from '@/lib/aerotools/types';
import PartCard from './PartCard';

interface ConfiguratorSidePanelProps {
  selectedZone: Zone | null;
  compatibleParts: Part[];
  equippedParts: Map<string, { part: Part; quantity: number }>;
  onAddPart: (part: Part) => void;
  onRemovePart: (partId: string) => void;
  onUpdateQuantity: (partId: string, quantity: number) => void;
  onClose: () => void;
}

export default function ConfiguratorSidePanel({
  selectedZone,
  compatibleParts,
  equippedParts,
  onAddPart,
  onRemovePart,
  onUpdateQuantity,
  onClose,
}: ConfiguratorSidePanelProps) {
  const [filter, setFilter] = useState<string>('all');

  if (!selectedZone) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Sélectionnez une zone
        </h3>
        <p className="text-sm text-gray-400">
          Cliquez sur un point d'équipement sur le modèle 3D pour voir les pièces compatibles.
        </p>
      </div>
    );
  }

  const categories = Array.from(
    new Set(compatibleParts.map((p) => p.category))
  );

  const filteredParts = filter === 'all'
    ? compatibleParts
    : compatibleParts.filter((p) => p.category === filter);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-700">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-blue-400 uppercase tracking-wider mb-1">
              Zone sélectionnée
            </p>
            <h3 className="text-lg font-bold text-white">
              {selectedZone.name}
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              {selectedZone.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Category filter */}
        {categories.length > 1 && (
          <div className="mt-3 flex flex-wrap gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`at-chip text-xs ${filter === 'all' ? 'bg-blue-600 text-white' : ''}`}
            >
              Tous ({compatibleParts.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`at-chip text-xs ${filter === cat ? 'bg-blue-600 text-white' : ''}`}
              >
                {CATEGORY_LABELS[cat]} ({compatibleParts.filter((p) => p.category === cat).length})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Parts list */}
      <div className="flex-1 overflow-y-auto at-scrollbar p-4 space-y-3">
        {filteredParts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Aucun équipement disponible pour cette zone.</p>
          </div>
        ) : (
          filteredParts.map((part) => {
            const equipped = equippedParts.get(part.id);
            const isEquipped = !!equipped;

            return (
              <div
                key={part.id}
                className={`at-card p-3 transition-all ${isEquipped ? 'ring-2 ring-green-500/50 bg-green-900/10' : ''}`}
              >
                <div className="flex gap-3">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white line-clamp-1">
                      {part.name}
                    </p>
                    <p className="text-xs text-gray-400">Réf. {part.ref}</p>
                    
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`at-badge text-[10px] ${
                        part.availability === 'in-stock' ? 'at-badge-green' :
                        part.availability === 'made-to-order' ? 'at-badge-amber' : 'at-badge-red'
                      }`}>
                        {AVAILABILITY_LABELS[part.availability]}
                      </span>
                      {part.leadTime && (
                        <span className="text-[10px] text-gray-500">
                          {part.leadTime}j
                        </span>
                      )}
                    </div>

                    {/* Key spec */}
                    {part.specs.chargeMax && (
                      <p className="text-xs text-gray-500 mt-1">
                        Charge max: {part.specs.chargeMax}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3 flex items-center gap-2">
                  {isEquipped ? (
                    <>
                      <div className="flex items-center gap-1 bg-gray-800 rounded-lg">
                        <button
                          onClick={() => onUpdateQuantity(part.id, equipped.quantity - 1)}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-white">
                          {equipped.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(part.id, equipped.quantity + 1)}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                      <button
                        onClick={() => onRemovePart(part.id)}
                        className="at-btn at-btn-danger at-btn-sm"
                      >
                        Retirer
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => onAddPart(part)}
                      className="at-btn at-btn-primary at-btn-sm flex-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Ajouter au devis
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer with count */}
      <div className="flex-shrink-0 p-4 border-t border-gray-700 bg-gray-900/50">
        <p className="text-sm text-gray-400">
          {filteredParts.length} équipement{filteredParts.length > 1 ? 's' : ''} compatible{filteredParts.length > 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
