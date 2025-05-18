import type { Chef } from "@/types"

// Default chef data
export const defaultChef: Chef = {
  id: "default",
  name: "Chef",
  cuisine: "Various Cuisines",
  image: "/diverse-chef-preparing-food.png",
  coverImage: "/food-background.png",
  rating: 4.5,
  location: "Vancouver, BC",
  specialty: "Various Specialties",
  bio: "Our talented chef brings a unique perspective to Vancouver's culinary scene.",
  longBio:
    "With years of culinary experience, our chef has developed a distinctive cooking style that harmoniously bridges various culinary traditions.",
  specialties: ["Various Cuisines", "Seasonal Menus", "Custom Experiences"],
}

// Dylan's chef data
export const chefDylan: Chef = {
  id: "dylan",
  name: "Chef Dylan Storey",
  image: "/chefs/chef-dylan-storey.png",
  coverImage: "/chefs/chef-dylan-kitchen.png",
  cuisine: "Asian-European Fusion",
  rating: 4.9,
  location: "Kitsilano, Vancouver",
  specialty: "Fusion Cuisine",
  bio: "Chef Dylan Storey brings a unique perspective to Vancouver's culinary scene, blending Asian techniques with European traditions to create innovative, unforgettable dining experiences.",
  longBio:
    "With over 15 years of culinary experience spanning across Asia and Europe, Chef Dylan Storey has developed a distinctive cooking style that harmoniously bridges Eastern and Western culinary traditions. After training in prestigious kitchens in Paris and Tokyo, Dylan settled in Vancouver, drawn by the city's multicultural food scene and access to exceptional Pacific Northwest ingredients.\n\nChef Dylan's approach celebrates the art of fusion without confusion, respecting traditional techniques while creating innovative flavor combinations. His dishes tell a story of cultural exchange, featuring elements like miso-infused French sauces, sake-poached seafood, and delicate Asian aromatics paired with robust European foundations.\n\nA passionate advocate for sustainable cooking, Dylan works closely with local farmers, foragers, and fishermen to source the finest seasonal ingredients from across British Columbia. His commitment to culinary excellence has earned him numerous accolades and a devoted following among Vancouver's food enthusiasts.",
  specialties: [
    "Asian-European Fusion",
    "Sustainable Seafood",
    "Seasonal Tasting Menus",
    "Molecular Gastronomy",
    "Artisanal Fermentation",
  ],
}

// Map of all chefs by ID for easy lookup
export const chefsMap: Record<string, Chef> = {
  default: defaultChef,
  dylan: chefDylan,
  // Add more chefs here as needed
}

// Function to get chef data by ID with fallback
export function getChefById(id: string): Chef {
  return chefsMap[id] || defaultChef
}
