export interface AddOn {
  id: string
  name: string
  price: number
  description?: string
}

export interface MenuItemWithAddOns {
  id: string
  name: string
  description: string
  basePrice: number
  images: string[]
  details?: string
  dietaryInfo?: string[]
  addOns?: AddOn[]
  category: string
}

export interface MenuCategory {
  id: string
  name: string
  description: string
}
