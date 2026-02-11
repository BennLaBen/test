'use client';

import Link from 'next/link';
import { useQuoteStore } from '@/lib/aerotools/store';
import { CATEGORY_LABELS } from '@/lib/aerotools/types';

interface QuoteCartSummaryProps {
  showFullDetails?: boolean;
}

export default function QuoteCartSummary({ showFullDetails = false }: QuoteCartSummaryProps) {
  const { items, removeItem, updateQuantity, clearCart, exportConfig } = useQuoteStore();
  
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  
  const handleExport = () => {
    const json = exportConfig();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aerotool-config-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (items.length === 0) {
    return (
      <div className="at-card p-6 text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-gray-800 flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <p className="text-gray-400 text-sm">Votre demande de devis est vide</p>
        <Link href="/aerotools/helicos" className="at-btn at-btn-primary at-btn-sm mt-4">
          Parcourir les hélicoptères
        </Link>
      </div>
    );
  }

  // Group items by helicopter
  const groupedItems = items.reduce((acc, item) => {
    const key = item.helicopterId;
    if (!acc[key]) {
      acc[key] = {
        helicopterName: item.helicopterName,
        items: [],
      };
    }
    acc[key].items.push(item);
    return acc;
  }, {} as Record<string, { helicopterName: string; items: typeof items }>);

  if (!showFullDetails) {
    return (
      <div className="at-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white">Devis en cours</h3>
          <span className="at-badge at-badge-blue">{totalItems} article{totalItems > 1 ? 's' : ''}</span>
        </div>
        
        <div className="space-y-2 mb-4">
          {items.slice(0, 3).map((item) => (
            <div key={`${item.part.id}-${item.zoneId}`} className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">×{item.quantity}</span>
              <span className="text-white truncate flex-1">{item.part.name}</span>
            </div>
          ))}
          {items.length > 3 && (
            <p className="text-xs text-gray-500">+{items.length - 3} autres articles</p>
          )}
        </div>
        
        <div className="flex gap-2">
          <Link href="/aerotools/devis" className="at-btn at-btn-primary at-btn-sm flex-1">
            Voir le devis
          </Link>
          <button onClick={handleExport} className="at-btn at-btn-secondary at-btn-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Votre demande de devis</h2>
          <p className="text-sm text-gray-400">{totalItems} article{totalItems > 1 ? 's' : ''} • {Object.keys(groupedItems).length} configuration{Object.keys(groupedItems).length > 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="at-btn at-btn-secondary at-btn-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Exporter JSON
          </button>
          <button onClick={clearCart} className="at-btn at-btn-ghost at-btn-sm text-red-400 hover:text-red-300">
            Vider
          </button>
        </div>
      </div>

      {/* Grouped items */}
      {Object.entries(groupedItems).map(([helicopterId, { helicopterName, items: heliItems }]) => (
        <div key={helicopterId} className="at-card">
          <div className="at-card-header border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">{helicopterName}</h3>
                  <p className="text-xs text-gray-400">{heliItems.length} équipement{heliItems.length > 1 ? 's' : ''}</p>
                </div>
              </div>
              <Link
                href={`/aerotools/configurateur/${helicopterId}`}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Modifier
              </Link>
            </div>
          </div>

          <div className="divide-y divide-gray-800">
            {heliItems.map((item) => (
              <div key={`${item.part.id}-${item.zoneId}`} className="p-4 flex items-center gap-4">
                {/* Thumbnail */}
                <div className="w-16 h-16 flex-shrink-0 bg-gray-800 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white">{item.part.name}</p>
                  <p className="text-xs text-gray-400">
                    Réf. {item.part.ref} • Zone: {item.zoneName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {CATEGORY_LABELS[item.part.category]}
                  </p>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-1 bg-gray-800 rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.part.id, item.zoneId, item.quantity - 1)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-8 text-center text-sm font-medium text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.part.id, item.zoneId, item.quantity + 1)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.part.id, item.zoneId)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Actions */}
      <div className="at-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/aerotools/helicos" className="at-btn at-btn-secondary flex-1">
            Ajouter une configuration
          </Link>
          <Link href="/aerotools/devis/demande" className="at-btn at-btn-primary flex-1">
            Demander un devis
          </Link>
        </div>
        <p className="text-xs text-gray-500 text-center mt-3">
          Le devis sera établi sous 24h ouvrées par notre équipe commerciale.
        </p>
      </div>
    </div>
  );
}
