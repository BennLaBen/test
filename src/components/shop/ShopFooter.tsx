'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Shield, Truck } from 'lucide-react'

export function ShopFooter() {
  return (
    <footer className="bg-gray-950 border-t border-gray-900 text-gray-400 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="relative h-20 w-64 mb-6">
               {/* Fond blanc arrondi pour le logo */}
               <div className="absolute inset-1 bg-white rounded-lg" />
               <Image 
                 src="/images/aerotools/lledoaerotols-logo.jpg"
                 alt="LLEDO Aerotools GSE Logo"
                 fill
                 className="object-contain object-left relative z-10 rounded-lg"
               />
            </div>
            <p className="text-sm text-gray-500 mb-6 max-w-xs leading-relaxed">
              Division spécialisée du Groupe LLEDO. Fourniture d'équipements de support au sol (GSE) et d'outillages de maintenance aéronautique certifiés.
            </p>
            <div className="flex gap-4">
              <span className="px-2 py-1 bg-gray-900 border border-gray-800 rounded text-[10px] uppercase tracking-wider text-gray-500">
                ISO 9001
              </span>
              <span className="px-2 py-1 bg-gray-900 border border-gray-800 rounded text-[10px] uppercase tracking-wider text-gray-500">
                EN 9100
              </span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold uppercase text-xs tracking-wider mb-6">Navigation</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/boutique" className="hover:text-blue-400 transition-colors">Catalogue Complet</Link></li>
              <li><Link href="/boutique/panier" className="hover:text-blue-400 transition-colors">Demander un Devis</Link></li>
              <li><Link href="/aerotools" className="hover:text-blue-400 transition-colors">À propos d'Aerotools</Link></li>
              <li><Link href="/" className="hover:text-blue-400 transition-colors">Groupe LLEDO</Link></li>
            </ul>
          </div>

          {/* Contact / Legal */}
          <div>
            <h4 className="text-white font-bold uppercase text-xs tracking-wider mb-6">Support & Légal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Service Client</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Conditions Générales</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Politique de Confidentialité</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Documentation Technique</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} LLEDO AEROTOOLS. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
                <Shield className="h-3 w-3 text-green-500" />
                <span>Paiement Sécurisé (Devis)</span>
             </div>
             <div className="flex items-center gap-2">
                <Truck className="h-3 w-3 text-blue-500" />
                <span>Livraison Mondiale</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

