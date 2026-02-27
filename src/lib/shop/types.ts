export interface ShopProduct {
  id: string
  slug: string
  name: string
  category: string
  description: string
  shortDescription: string
  features: string[]
  specs: Record<string, string>
  image: string
  gallery: string[]
  priceDisplay: string
  priceRange: 'low' | 'medium' | 'high'
  compatibility: string[]
  usage: string[]
  material: string
  inStock: boolean
  isNew: boolean
  isFeatured: boolean
  datasheetUrl: string | null
  model3d?: string | null
  // Extended B2B fields (optional for backward compat)
  certifications?: string[]
  standards?: string[]
  applications?: string[]
  tolerances?: Record<string, string>
  materials?: Record<string, string>
  leadTime?: string
  minOrder?: number
  warranty?: string
  faq?: { q: string; a: string }[]
  boughtTogether?: string[]
}

export interface ShopCategory {
  id: string
  label: string
  slug: string
  description: string
  icon: string
  count: number
}

export interface FilterOption {
  id: string
  label: string
}

export interface ShopFilters {
  usage: FilterOption[]
  material: FilterOption[]
  priceRange: FilterOption[]
  helicopters: string[]
}

export interface CartItem {
  product: ShopProduct
  quantity: number
}

export interface ActiveFilters {
  category: string
  search: string
  usage: string[]
  material: string[]
  priceRange: string[]
  compatibility: string
  inStockOnly: boolean
}

export const defaultFilters: ActiveFilters = {
  category: 'all',
  search: '',
  usage: [],
  material: [],
  priceRange: [],
  compatibility: '',
  inStockOnly: false,
}
