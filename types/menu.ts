export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image?: string
  additionalImages?: string[]
  category?: string
  courseType?: string
  dietaryInfo?: string[]
  allergens?: string[]
  ingredients?: string[]
  nutritionFacts?: Record<string, string>
  isCustomization?: boolean
  quantity?: number
}

export interface MenuCategory {
  id: string
  name: string
  items: MenuItem[]
}
