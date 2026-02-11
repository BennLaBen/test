import type { ShopProduct, CartItem } from './types'

const STORAGE_KEY = 'aerotool-cart'

export function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function addToCart(items: CartItem[], product: ShopProduct): CartItem[] {
  const existing = items.find(i => i.product.id === product.id)
  if (existing) {
    return items.map(i =>
      i.product.id === product.id
        ? { ...i, quantity: i.quantity + 1 }
        : i
    )
  }
  return [...items, { product, quantity: 1 }]
}

export function removeFromCart(items: CartItem[], productId: string): CartItem[] {
  return items.filter(i => i.product.id !== productId)
}

export function updateCartQuantity(items: CartItem[], productId: string, qty: number): CartItem[] {
  if (qty < 1) return removeFromCart(items, productId)
  return items.map(i =>
    i.product.id === productId ? { ...i, quantity: qty } : i
  )
}

export function getCartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0)
}
