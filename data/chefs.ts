import type { Chef } from "@/types"
import { chefDylan } from "./chef-dylan"

export const chefs: Chef[] = [
  chefDylan,
  {
    id: "c1",
    name: "Chef Maria Chen",
    image: "/chefs/chef-maria.png",
    coverImage: "/chefs/chef-maria-kitchen.png",
    cuisine: "West Coast Fusion",
    rating: 4.9,
    location: "Kitsilano",
    specialty: "Sustainable Seafood",
    bio: "Chef Maria combines Pacific Northwest ingredients with Asian influences, creating innovative dishes that showcase Vancouver's multicultural food scene.",
    longBio:
      "Born and raised in Vancouver, Chef Maria Chen developed her culinary skills at the Pacific Institute of Culinary Arts before honing her craft at several acclaimed restaurants in the city. Her cooking philosophy centers around sustainable, locally-sourced ingredients with a focus on BC's incredible seafood. Chef Maria's unique approach blends traditional Asian techniques with modern West Coast flavors, creating memorable dining experiences that tell the story of Vancouver's diverse culinary landscape.",
    specialties: ["Sustainable Seafood", "Asian Fusion", "Farm-to-Table", "Seasonal Menus"],
    reviewCount: 200,
  },
  {
    id: "c2",
    name: "Chef James Wilson",
    image: "/chefs/chef-james.png",
    coverImage: "/chefs/chef-james-plating.png",
    cuisine: "Modern Canadian",
    rating: 4.8,
    location: "Gastown",
    specialty: "Farm-to-Table",
    bio: "Chef James celebrates Canadian cuisine with a modern twist, focusing on hyperlocal ingredients from the Fraser Valley and Vancouver Island.",
    longBio:
      "After training in some of Europe's finest restaurants, Chef James Wilson returned to his native Vancouver to showcase the bounty of British Columbia through his thoughtfully crafted dishes. With over 15 years of culinary experience, he has developed strong relationships with local farmers, foragers, and producers throughout the Lower Mainland. Chef James is passionate about telling the story of Canadian cuisine through his innovative yet approachable cooking style, highlighting seasonal ingredients at their peak.",
    specialties: ["Heritage Cooking Techniques", "Wild Foraged Foods", "Nose-to-Tail Cooking", "Artisanal Preserves"],
    reviewCount: 180,
  },
]
