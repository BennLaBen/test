'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { getParts, getPartCategories } from '@/lib/aerotools/data';
import { CATEGORY_LABELS, AVAILABILITY_LABELS } from '@/lib/aerotools/types';
import type { Part } from '@/lib/aerotools/types';
import PartCard from '@/components/aerotools/PartCard';

export default function PartsPage() {
  const parts = getParts();
  const categories = getPartCategories();
  
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');

  const filteredParts = useMemo(() => {
    return parts.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        const searchable = [p.name, p.ref, p.slug, p.category].join(' ').toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      
      if (categoryFilter !== 'all' && p.category !== categoryFilter) {
        return false;
      }
      
      if (availabilityFilter !== 'all' && p.availability !== availabilityFilter) {
        return false;
      }
      
      return true;
    });
  }, [parts, search, categoryFilter, availabilityFilter]);

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
            <span className="text-white">Équipements</span>
          </nav>
          
          <h1 className="at-hero-title mb-4">
            Catalogue Équipements
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            Parcourez notre gamme complète d'équipements sol pour hélicoptères. 
            {parts.length} références disponibles.
          </p>
        </div>
      </section>

      {/* Categories overview */}
      <section className="border-y border-gray-800 bg-gray-900/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`at-chip ${categoryFilter === 'all' ? 'bg-blue-600 text-white' : ''}`}
            >
              Tous ({parts.length})
            </button>
            {categories.map(({ id, count }) => (
              <button
                key={id}
                onClick={() => setCategoryFilter(id)}
                className={`at-chip ${categoryFilter === id ? 'bg-blue-600 text-white' : ''}`}
              >
                {CATEGORY_LABELS[id]} ({count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-gray-800 bg-gray-900/50 sticky top-16 z-30">
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
                  placeholder="Rechercher : BR-H160, vérin, roues..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="at-input pl-10 w-full"
                />
              </div>
            </div>
            
            {/* Availability filter */}
            <div className="w-full md:w-48">
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="at-select w-full"
              >
                <option value="all">Disponibilité</option>
                <option value="in-stock">En stock</option>
                <option value="made-to-order">Sur commande</option>
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
              {filteredParts.length} résultat{filteredParts.length > 1 ? 's' : ''}
              {(categoryFilter !== 'all' || availabilityFilter !== 'all' || search) && (
                <button
                  onClick={() => {
                    setSearch('');
                    setCategoryFilter('all');
                    setAvailabilityFilter('all');
                  }}
                  className="ml-3 text-blue-400 hover:text-blue-300"
                >
                  Réinitialiser
                </button>
              )}
            </p>
          </div>

          {/* Grid */}
          {filteredParts.length === 0 ? (
            <div className="at-card p-12 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gray-800 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Aucun résultat</h3>
              <p className="text-gray-400 mb-4">
                Aucun équipement ne correspond à vos critères de recherche.
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setCategoryFilter('all');
                  setAvailabilityFilter('all');
                }}
                className="at-btn at-btn-secondary"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredParts.map((part) => (
                <PartCard key={part.id} part={part} showAddButton={false} />
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
              Besoin d'un équipement spécifique ?
            </h2>
            <p className="text-gray-400 mb-4">
              Notre bureau d'études peut concevoir des solutions sur-mesure.
            </p>
            <Link href="/contact" className="at-btn at-btn-primary">
              Demander une étude
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
