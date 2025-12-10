'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Product } from '@/data/aerotools-products'

interface QuoteItem extends Product {
  quantity: number
}

interface QuoteContextType {
  items: QuoteItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearQuote: () => void
  itemCount: number
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined)

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([])

  // Charger le panier depuis le localStorage au démarrage
  useEffect(() => {
    const savedQuote = localStorage.getItem('lledo-quote-cart')
    if (savedQuote) {
      try {
        setItems(JSON.parse(savedQuote))
      } catch (e) {
        console.error('Erreur chargement panier:', e)
      }
    }
  }, [])

  // Sauvegarder le panier à chaque modification
  useEffect(() => {
    localStorage.setItem('lledo-quote-cart', JSON.stringify(items))
  }, [items])

  const addItem = (product: Product) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === product.id)
      if (existingItem) {
        return currentItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...currentItems, { ...product, quantity: 1 }]
    })
  }

  const removeItem = (productId: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId)
      return
    }
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearQuote = () => {
    setItems([])
  }

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <QuoteContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearQuote, itemCount }}>
      {children}
    </QuoteContext.Provider>
  )
}

export function useQuote() {
  const context = useContext(QuoteContext)
  if (context === undefined) {
    throw new Error('useQuote must be used within a QuoteProvider')
  }
  return context
}


