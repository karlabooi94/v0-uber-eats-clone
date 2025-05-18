// Default meals data
export const defaultMeals = [
  {
    category: "Popular Items",
    items: [
      {
        id: "default-1",
        name: "Signature Dish",
        description: "Our chef's signature creation with seasonal ingredients",
        price: 24.99,
        image: "/diverse-food-spread.png",
      },
      {
        id: "default-2",
        name: "Chef's Special",
        description: "A special creation featuring the finest local ingredients",
        price: 29.99,
        image: "/diverse-chef-preparing-food.png",
      },
    ],
  },
]

// Dylan's meals data
export const dylanMeals = [
  {
    category: "Appetizers",
    items: [
      {
        id: "dylan-app-1",
        name: "Vegetable Pakora",
        description: "Crispy vegetable fritters served with mint chutney",
        price: 12.99,
        image: "/meals/vegetable-pakora-1.png",
        addOns: [
          { id: "extra-chutney", name: "Extra Mint Chutney", price: 1.99 },
          { id: "spicy", name: "Extra Spicy", price: 0 },
        ],
      },
      {
        id: "dylan-app-2",
        name: "Tuna Tartar",
        description: "Fresh tuna with avocado and citrus dressing",
        price: 16.99,
        image: "/tuna-tartar-avocado.png",
      },
    ],
  },
  {
    category: "Main Courses",
    items: [
      {
        id: "dylan-main-1",
        name: "Tandoori Chicken",
        description: "Marinated chicken cooked in a traditional clay oven",
        price: 22.99,
        image: "/meals/chicken-tandoori-1.png",
        addOns: [
          { id: "naan", name: "Garlic Naan", price: 3.99 },
          { id: "rice", name: "Basmati Rice", price: 2.99 },
          { id: "extra-sauce", name: "Extra Sauce", price: 1.99 },
        ],
      },
      {
        id: "dylan-main-2",
        name: "Chicken Biryani",
        description: "Fragrant rice dish with chicken and aromatic spices",
        price: 24.99,
        image: "/meals/chicken-biryani.png",
      },
    ],
  },
  {
    category: "Desserts",
    items: [
      {
        id: "dylan-dessert-1",
        name: "Gulab Jamun",
        description: "Sweet milk dumplings soaked in rose-scented syrup",
        price: 8.99,
        image: "/meals/gulab-jamun-1.png",
      },
    ],
  },
]

// Map of all meals by chef ID for easy lookup
export const mealsMap: Record<string, any[]> = {
  default: defaultMeals,
  dylan: dylanMeals,
  // Add more chef meals here as needed
}

// Function to get meals data by chef ID with fallback
export function getMealsByChefId(chefId: string): any[] {
  return mealsMap[chefId] || defaultMeals
}

// Function to get all menu items for a chef (flattened)
export function getAllMenuItemsByChefId(chefId: string): any[] {
  const meals = getMealsByChefId(chefId)
  return meals.flatMap((category) => category.items || [])
}
