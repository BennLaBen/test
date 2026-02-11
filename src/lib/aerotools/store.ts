/**
 * AEROTOOL Configurator — Quote Cart Store (Zustand)
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Part, QuoteCartItem, Configuration, ConfigurationItem } from './types';

interface QuoteState {
  items: QuoteCartItem[];
  currentConfig: {
    helicopterId: string;
    helicopterName: string;
  } | null;
  
  // Actions
  setCurrentConfig: (helicopterId: string, helicopterName: string) => void;
  clearCurrentConfig: () => void;
  
  addItem: (item: Omit<QuoteCartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (partId: string, zoneId: string) => void;
  updateQuantity: (partId: string, zoneId: string, quantity: number) => void;
  clearCart: () => void;
  
  getItemsByHelicopter: (helicopterId: string) => QuoteCartItem[];
  getItemCount: () => number;
  getTotalItems: () => number;
  
  exportConfig: () => string;
  importConfig: (json: string) => boolean;
}

export const useQuoteStore = create<QuoteState>()(
  persist(
    (set, get) => ({
      items: [],
      currentConfig: null,
      
      setCurrentConfig: (helicopterId, helicopterName) => {
        set({ currentConfig: { helicopterId, helicopterName } });
      },
      
      clearCurrentConfig: () => {
        set({ currentConfig: null });
      },
      
      addItem: (item) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.part.id === item.part.id && i.zoneId === item.zoneId
          );
          
          if (existingIndex >= 0) {
            const updated = [...state.items];
            updated[existingIndex].quantity += item.quantity || 1;
            return { items: updated };
          }
          
          return {
            items: [
              ...state.items,
              { ...item, quantity: item.quantity || 1 },
            ],
          };
        });
      },
      
      removeItem: (partId, zoneId) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.part.id === partId && i.zoneId === zoneId)
          ),
        }));
      },
      
      updateQuantity: (partId, zoneId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(partId, zoneId);
          return;
        }
        
        set((state) => ({
          items: state.items.map((i) =>
            i.part.id === partId && i.zoneId === zoneId
              ? { ...i, quantity }
              : i
          ),
        }));
      },
      
      clearCart: () => {
        set({ items: [], currentConfig: null });
      },
      
      getItemsByHelicopter: (helicopterId) => {
        return get().items.filter((i) => i.helicopterId === helicopterId);
      },
      
      getItemCount: () => {
        return get().items.length;
      },
      
      getTotalItems: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },
      
      exportConfig: () => {
        const state = get();
        const config = {
          version: '1.0',
          exportedAt: new Date().toISOString(),
          items: state.items.map((i) => ({
            partId: i.part.id,
            partRef: i.part.ref,
            partName: i.part.name,
            helicopterId: i.helicopterId,
            helicopterName: i.helicopterName,
            zoneId: i.zoneId,
            zoneName: i.zoneName,
            quantity: i.quantity,
          })),
        };
        return JSON.stringify(config, null, 2);
      },
      
      importConfig: (json) => {
        try {
          const config = JSON.parse(json);
          if (!config.items || !Array.isArray(config.items)) {
            return false;
          }
          // Note: Full import would require looking up parts by ID
          // This is a simplified version
          console.log('Import config:', config);
          return true;
        } catch {
          return false;
        }
      },
    }),
    {
      name: 'aerotool-quote-cart',
    }
  )
);

// Selector hooks
export const useCartItemCount = () => useQuoteStore((s) => s.items.length);
export const useTotalItems = () => useQuoteStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
export const useCurrentConfig = () => useQuoteStore((s) => s.currentConfig);
