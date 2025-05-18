export interface Restaurant {
  id: string
  name: string
  cuisine: string
  rating: number
  deliveryTime: string
  deliveryFee: string
  image: string
  heroImage: string
  address: string
  distance: string
  tags: string[]
  priceLevel: string
}

export interface Chef {
  id: string
  name: string
  cuisine: string
  rating: number
  location: string
  image: string
  coverImage?: string
  bio: string
  longBio?: string
  specialties?: string[]
  gallery?: string[]
  reviewCount?: number
  featured?: boolean
}

export interface MenuItem {
  id: string
  restaurantId: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

export interface MealOption {
  id: string
  chefId: string
  name: string
  description: string
  image: string
  appetizer: string
  mainCourse: string
  side: string
  dessert: string
  dietaryInfo: string[]
  price?: number
}

export interface CartItem {
  id: string
  chefId: string
  name: string
  description: string
  image: string
  appetizer: string
  mainCourse: string
  side: string
  dessert: string
  dietaryInfo: string[]
  quantity: number
  basePrice?: number
  addOnsPrice?: number
  addOns?: any[]
  specialInstructions?: string
}

export interface MenuCategory {
  id: string
  name: string
  description: string
}
