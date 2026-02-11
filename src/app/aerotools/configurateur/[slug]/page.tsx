'use client';

import { use, useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getHelicopterBySlug, getManufacturer, getCompatibleParts } from '@/lib/aerotools/data';
import { useQuoteStore } from '@/lib/aerotools/store';
import type { Part, Zone } from '@/lib/aerotools/types';
import ConfiguratorSidePanel from '@/components/aerotools/ConfiguratorSidePanel';

const HelicopterViewer3D = dynamic(
  () => import('@/components/aerotools/HelicopterViewer3D'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[400px] bg-gray-900 rounded-xl flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Chargement du viewer 3D...</p>
        </div>
      </div>
    ),
  }
);

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ConfigurateurPage({ params }: PageProps) {
  const { slug } = use(params);
  const searchParams = useSearchParams();
  const initialZone = searchParams.get('zone');
  
  const helicopter = getHelicopterBySlug(slug);
  
  if (!helicopter) {
    notFound();
  }
  
  const manufacturer = getManufacturer(helicopter.manufacturer);
  
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(initialZone);
  const [sidePanelOpen, setSidePanelOpen] = useState(!!initialZone);
  
  const { items, addItem, removeItem, updateQuantity, setCurrentConfig } = useQuoteStore();
  
  useEffect(() => {
    setCurrentConfig(helicopter.id, helicopter.name);
  }, [helicopter.id, helicopter.name, setCurrentConfig]);

  const selectedZone = useMemo(() => {
    if (!selectedZoneId) return null;
    return helicopter.zones.find((z) => z.id === selectedZoneId) || null;
  }, [helicopter.zones, selectedZoneId]);

  const compatibleParts = useMemo(() => {
    if (!selectedZoneId) return [];
    return getCompatibleParts(helicopter.id, selectedZoneId);
  }, [helicopter.id, selectedZoneId]);

  const equippedParts = useMemo(() => {
    const map = new Map<string, { part: Part; quantity: number }>();
    items
      .filter((i) => i.helicopterId === helicopter.id && i.zoneId === selectedZoneId)
      .forEach((i) => {
        map.set(i.part.id, { part: i.part, quantity: i.quantity });
      });
    return map;
  }, [items, helicopter.id, selectedZoneId]);

  const equippedZones = useMemo(() => {
    return Array.from(
      new Set(
        items
          .filter((i) => i.helicopterId === helicopter.id)
          .map((i) => i.zoneId)
      )
    );
  }, [items, helicopter.id]);

  const currentHelicopterItems = items.filter((i) => i.helicopterId === helicopter.id);
  const totalQuantity = currentHelicopterItems.reduce((sum, i) => sum + i.quantity, 0);

  const handleZoneClick = (zoneId: string) => {
    setSelectedZoneId(zoneId);
    setSidePanelOpen(true);
  };

  const handleAddPart = (part: Part) => {
    if (!selectedZone) return;
    addItem({
      part,
      helicopterId: helicopter.id,
      helicopterName: helicopter.name,
      zoneId: selectedZone.id,
      zoneName: selectedZone.name,
      quantity: 1,
    });
  };

  const handleRemovePart = (partId: string) => {
    if (!selectedZoneId) return;
    removeItem(partId, selectedZoneId);
  };

  const handleUpdateQuantity = (partId: string, quantity: number) => {
    if (!selectedZoneId) return;
    updateQuantity(partId, selectedZoneId, quantity);
  };

  const handleCloseSidePanel = () => {
    setSidePanelOpen(false);
    setSelectedZoneId(null);
  };

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Header */}
      <section className="border-b border-gray-800 bg-gray-900/50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-3">
            <Link href="/aerotools" className="hover:text-white transition-colors">Configurateur</Link>
            <span>/</span>
            <Link href="/aerotools/helicos" className="hover:text-white transition-colors">Hélicoptères</Link>
            <span>/</span>
            <Link href={`/aerotools/helicos/${helicopter.slug}`} className="hover:text-white transition-colors">{helicopter.name}</Link>
            <span>/</span>
            <span className="text-white">Configuration</span>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              {manufacturer && (
                <p className="text-xs text-blue-400 uppercase tracking-wider">
                  {manufacturer.name}
                </p>
              )}
              <h1 className="text-2xl font-bold text-white">
                Configurer {helicopter.name}
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              {totalQuantity > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">{totalQuantity} équipement{totalQuantity > 1 ? 's' : ''}</span>
                  <span className="at-badge at-badge-green">{equippedZones.length}/{helicopter.zones.length} zones</span>
                </div>
              )}
              <Link href="/aerotools/devis" className="at-btn at-btn-primary at-btn-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Voir le devis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-220px)] min-h-[600px]">
            {/* 3D Viewer */}
            <div className={`${sidePanelOpen ? 'lg:col-span-2' : 'lg:col-span-3'} transition-all`}>
              <div className="h-full">
                <HelicopterViewer3D
                  helicopterId={helicopter.id}
                  zones={helicopter.zones}
                  selectedZone={selectedZoneId}
                  equippedZones={equippedZones}
                  onZoneClick={handleZoneClick}
                  modelPath={helicopter.images.model3d}
                />
              </div>
            </div>

            {/* Side Panel */}
            {sidePanelOpen && (
              <div className="at-card overflow-hidden h-full">
                <ConfiguratorSidePanel
                  selectedZone={selectedZone}
                  compatibleParts={compatibleParts}
                  equippedParts={equippedParts}
                  onAddPart={handleAddPart}
                  onRemovePart={handleRemovePart}
                  onUpdateQuantity={handleUpdateQuantity}
                  onClose={handleCloseSidePanel}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Zone selector (mobile alternative) */}
      <section className="lg:hidden border-t border-gray-800 bg-gray-900/50">
        <div className="container mx-auto px-4 py-4">
          <p className="text-sm text-gray-400 mb-3">Sélectionner une zone :</p>
          <div className="flex flex-wrap gap-2">
            {helicopter.zones.map((zone) => {
              const isSelected = selectedZoneId === zone.id;
              const isEquipped = equippedZones.includes(zone.id);
              
              return (
                <button
                  key={zone.id}
                  onClick={() => handleZoneClick(zone.id)}
                  className={`at-chip ${
                    isSelected ? 'bg-blue-600 text-white' : 
                    isEquipped ? 'bg-green-600/20 text-green-400 border-green-600' : ''
                  }`}
                >
                  {isEquipped && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {zone.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Summary bar */}
      {currentHelicopterItems.length > 0 && (
        <section className="fixed bottom-0 left-0 right-0 border-t border-gray-700 bg-gray-900/95 backdrop-blur-sm z-40">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">
                  {totalQuantity} équipement{totalQuantity > 1 ? 's' : ''} sélectionné{totalQuantity > 1 ? 's' : ''}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {currentHelicopterItems.map((i) => i.part.ref).join(', ')}
                </p>
              </div>
              <div className="flex gap-2">
                <Link href="/aerotools/helicos" className="at-btn at-btn-secondary at-btn-sm">
                  + Autre hélicoptère
                </Link>
                <Link href="/aerotools/devis" className="at-btn at-btn-primary at-btn-sm">
                  Demander un devis
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
