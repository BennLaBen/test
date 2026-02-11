'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getHelicopterBySlug, getManufacturer, getZonesWithParts } from '@/lib/aerotools/data';
import { CATEGORY_LABELS } from '@/lib/aerotools/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const categoryLabels = {
  light: 'Léger',
  medium: 'Intermédiaire',
  heavy: 'Lourd',
  military: 'Militaire',
};

const gearLabels = {
  skid: 'Patins',
  wheeled: 'Roues fixes',
  retractable: 'Train rétractable',
};

export default function HelicopterDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const helicopter = getHelicopterBySlug(slug);
  
  if (!helicopter) {
    notFound();
  }
  
  const manufacturer = getManufacturer(helicopter.manufacturer);
  const zonesWithParts = getZonesWithParts(helicopter.id);
  const totalParts = zonesWithParts.reduce((sum, z) => sum + z.parts.length, 0);

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Hero */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 to-transparent" />
        
        <div className="container mx-auto px-4 relative">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/aerotools" className="hover:text-white transition-colors">Configurateur</Link>
            <span>/</span>
            <Link href="/aerotools/helicos" className="hover:text-white transition-colors">Hélicoptères</Link>
            <span>/</span>
            <span className="text-white">{helicopter.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Image */}
            <div className="at-card overflow-hidden">
              <div className="relative aspect-[16/10] bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                  <svg viewBox="0 0 200 100" className="w-4/5 h-auto text-blue-500">
                    <path
                      d="M180 50 L160 50 L150 45 L100 45 L90 40 L40 40 L30 45 L20 45 L10 50 L20 55 L40 55 L50 60 L100 60 L110 55 L160 55 L170 50 Z"
                      fill="currentColor"
                    />
                    <ellipse cx="100" cy="25" rx="70" ry="2" fill="currentColor" opacity="0.5" />
                  </svg>
                </div>
                
                {/* Category badge */}
                <div className="absolute top-4 left-4">
                  <span className="at-badge at-badge-blue">
                    {categoryLabels[helicopter.category]}
                  </span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div>
              {manufacturer && (
                <p className="text-sm text-blue-400 uppercase tracking-wider mb-2">
                  {manufacturer.name}
                </p>
              )}
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {helicopter.name}
              </h1>
              
              {helicopter.designations.length > 0 && (
                <p className="text-lg text-gray-400 mb-6">
                  {helicopter.designations.join(' • ')}
                </p>
              )}
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                {helicopter.description}
              </p>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="at-card p-4 text-center">
                  <p className="text-3xl font-bold text-white">{helicopter.zones.length}</p>
                  <p className="text-sm text-gray-400">Zones équipables</p>
                </div>
                <div className="at-card p-4 text-center">
                  <p className="text-3xl font-bold text-white">{totalParts}</p>
                  <p className="text-sm text-gray-400">Équipements compatibles</p>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/aerotools/configurateur/${helicopter.slug}`}
                  className="at-btn at-btn-primary at-btn-lg flex-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  Configurer cet appareil
                </Link>
                <button className="at-btn at-btn-secondary at-btn-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Fiche technique
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="at-section-title mb-8">Spécifications techniques</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="at-card p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Masse max. (MTOW)</p>
              <p className="text-2xl font-bold text-white">{helicopter.specs.mtow.toLocaleString()} kg</p>
            </div>
            <div className="at-card p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Vitesse max.</p>
              <p className="text-2xl font-bold text-white">{helicopter.specs.maxSpeed} km/h</p>
            </div>
            <div className="at-card p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Autonomie</p>
              <p className="text-2xl font-bold text-white">{helicopter.specs.range} km</p>
            </div>
            <div className="at-card p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Capacité</p>
              <p className="text-2xl font-bold text-white">{helicopter.specs.passengers + helicopter.specs.crew} pers.</p>
            </div>
          </div>

          <div className="mt-6 at-card overflow-hidden">
            <table className="at-table w-full">
              <tbody>
                <tr>
                  <td className="at-specs-key">Constructeur</td>
                  <td className="at-specs-value">{manufacturer?.name || helicopter.manufacturer}</td>
                </tr>
                <tr>
                  <td className="at-specs-key">Catégorie</td>
                  <td className="at-specs-value">{categoryLabels[helicopter.category]}</td>
                </tr>
                <tr>
                  <td className="at-specs-key">Moteurs</td>
                  <td className="at-specs-value">{helicopter.specs.engines}× turbine</td>
                </tr>
                <tr>
                  <td className="at-specs-key">Train d'atterrissage</td>
                  <td className="at-specs-value">{gearLabels[helicopter.specs.landingGear]}</td>
                </tr>
                <tr>
                  <td className="at-specs-key">Longueur</td>
                  <td className="at-specs-value">{helicopter.specs.length} m</td>
                </tr>
                <tr>
                  <td className="at-specs-key">Hauteur</td>
                  <td className="at-specs-value">{helicopter.specs.height} m</td>
                </tr>
                <tr>
                  <td className="at-specs-key">Diamètre rotor</td>
                  <td className="at-specs-value">{helicopter.specs.rotorDiameter} m</td>
                </tr>
                <tr>
                  <td className="at-specs-key">Équipage</td>
                  <td className="at-specs-value">{helicopter.specs.crew} pilote(s)</td>
                </tr>
                <tr>
                  <td className="at-specs-key">Passagers</td>
                  <td className="at-specs-value">{helicopter.specs.passengers} max.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Zones & Parts */}
      <section className="py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="at-section-title mb-8">Zones d'équipement</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {zonesWithParts.map(({ zone, parts }) => (
              <div key={zone.id} className="at-card overflow-hidden">
                <div className="at-card-header border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{zone.name}</h3>
                      <p className="text-sm text-gray-400">{zone.description}</p>
                    </div>
                    <span className="at-badge at-badge-blue">
                      {parts.length} équip.
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  {parts.length === 0 ? (
                    <p className="text-sm text-gray-500">Aucun équipement disponible</p>
                  ) : (
                    <div className="space-y-2">
                      {parts.slice(0, 3).map((part) => (
                        <div key={part.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">{part.ref}</span>
                            <span className="text-white">{part.name}</span>
                          </div>
                          <span className={`at-badge text-[10px] ${
                            part.availability === 'in-stock' ? 'at-badge-green' : 'at-badge-amber'
                          }`}>
                            {part.availability === 'in-stock' ? 'Stock' : 'Commande'}
                          </span>
                        </div>
                      ))}
                      {parts.length > 3 && (
                        <p className="text-xs text-gray-500">+{parts.length - 3} autres équipements</p>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="px-4 pb-4">
                  <Link
                    href={`/aerotools/configurateur/${helicopter.slug}?zone=${zone.id}`}
                    className="at-btn at-btn-secondary at-btn-sm w-full"
                  >
                    Voir les équipements
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="at-card p-8 text-center bg-gradient-to-r from-blue-950/50 to-gray-900">
            <h2 className="text-2xl font-bold text-white mb-4">
              Prêt à équiper votre {helicopter.name} ?
            </h2>
            <p className="text-gray-400 mb-6 max-w-lg mx-auto">
              Accédez au configurateur 3D pour visualiser les zones d'équipement 
              et sélectionner les pièces compatibles.
            </p>
            <Link
              href={`/aerotools/configurateur/${helicopter.slug}`}
              className="at-btn at-btn-primary at-btn-lg"
            >
              Lancer le configurateur
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
