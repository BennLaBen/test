'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { getHelicopters, getManufacturers } from '@/lib/aerotools/data';
import type { Helicopter } from '@/lib/aerotools/types';
import HelicopterCard from '@/components/aerotools/HelicopterCard';

const categoryLabels: Record<Helicopter['category'], string> = {
  light: 'Léger',
  medium: 'Intermédiaire',
  heavy: 'Lourd',
  military: 'Militaire',
};

export default function HelicosPage() {
  const helicopters = getHelicopters();
  const manufacturers = getManufacturers();
  
  const [search, setSearch] = useState('');
  const [manufacturerFilter, setManufacturerFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredHelicopters = useMemo(() => {
    return helicopters.filter((h) => {
      // Search filter
      if (search) {
        const q = search.toLowerCase();
        const searchable = [h.name, ...h.designations, h.manufacturer].join(' ').toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      
      // Manufacturer filter
      if (manufacturerFilter !== 'all' && h.manufacturer !== manufacturerFilter) {
        return false;
      }
      
      // Category filter
      if (categoryFilter !== 'all' && h.category !== categoryFilter) {
        return false;
      }
      
      return true;
    });
  }, [helicopters, search, manufacturerFilter, categoryFilter]);

  const categories = useMemo(() => {
    const cats = new Set(helicopters.map((h) => h.category));
    return Array.from(cats);
  }, [helicopters]);

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Hero */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 to-transparent" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }} />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/aerotools" className="hover:text-white transition-colors">Configurateur</Link>
            <span>/</span>
            <span className="text-white">Hélicoptères</span>
          </nav>
          
          <h1 className="at-hero-title mb-4">
            Catalogue Hélicoptères
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            Sélectionnez votre appareil pour accéder aux équipements sol compatibles. 
            {helicopters.length} modèles référencés.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-y border-gray-800 bg-gray-900/50 sticky top-16 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher : H160, EC145, Super Puma..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="at-input pl-10 w-full"
                />
              </div>
            </div>
            
            {/* Manufacturer filter */}
            <div className="w-full md:w-48">
              <select
                value={manufacturerFilter}
                onChange={(e) => setManufacturerFilter(e.target.value)}
                className="at-select w-full"
              >
                <option value="all">Tous constructeurs</option>
                {manufacturers.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
            
            {/* Category filter */}
            <div className="w-full md:w-40">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="at-select w-full"
              >
                <option value="all">Toutes gammes</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{categoryLabels[cat]}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-400">
              {filteredHelicopters.length} résultat{filteredHelicopters.length > 1 ? 's' : ''}
              {(manufacturerFilter !== 'all' || categoryFilter !== 'all' || search) && (
                <button
                  onClick={() => {
                    setSearch('');
                    setManufacturerFilter('all');
                    setCategoryFilter('all');
                  }}
                  className="ml-3 text-blue-400 hover:text-blue-300"
                >
                  Réinitialiser
                </button>
              )}
            </p>
          </div>

          {/* Grid */}
          {filteredHelicopters.length === 0 ? (
            <div className="at-card p-12 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gray-800 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Aucun résultat</h3>
              <p className="text-gray-400 mb-4">
                Aucun hélicoptère ne correspond à vos critères de recherche.
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setManufacturerFilter('all');
                  setCategoryFilter('all');
                }}
                className="at-btn at-btn-secondary"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredHelicopters.map((helicopter) => (
                <HelicopterCard key={helicopter.id} helicopter={helicopter} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="at-card p-8 text-center bg-gradient-to-r from-blue-950/50 to-gray-900">
            <h2 className="text-xl font-bold text-white mb-2">
              Votre hélicoptère n'est pas listé ?
            </h2>
            <p className="text-gray-400 mb-4">
              Contactez notre équipe technique pour une étude de compatibilité.
            </p>
            <Link href="/contact" className="at-btn at-btn-primary">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
