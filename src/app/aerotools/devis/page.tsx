'use client';

import Link from 'next/link';
import QuoteCartSummary from '@/components/aerotools/QuoteCartSummary';

export default function DevisPage() {
  return (
    <main className="min-h-screen bg-gray-950">
      {/* Header */}
      <section className="border-b border-gray-800 bg-gray-900/50">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href="/aerotools" className="hover:text-white transition-colors">Configurateur</Link>
            <span>/</span>
            <span className="text-white">Devis</span>
          </nav>
          
          <h1 className="text-3xl font-bold text-white">
            Demande de devis
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <QuoteCartSummary showFullDetails />
        </div>
      </section>

      {/* Trust indicators */}
      <section className="py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-600/20 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-white mb-1">Réponse sous 24h</h3>
              <p className="text-sm text-gray-400">Notre équipe commerciale vous répond rapidement.</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-green-600/20 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-white mb-1">Équipements certifiés</h3>
              <p className="text-sm text-gray-400">Tous nos produits sont conformes EASA/DGAC.</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-600/20 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-white mb-1">Support technique</h3>
              <p className="text-sm text-gray-400">Accompagnement expert pour vos choix d'équipements.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
