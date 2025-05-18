import type { MealOption } from "@/types"

export const dylanMeals: MealOption[] = [
  {
    id: "d1",
    chefId: "dylan",
    name: "Pacific Rim Fusion Experience",
    description:
      "A harmonious blend of Asian and European flavors featuring the finest seasonal ingredients from the Pacific Northwest.",
    image: "/meals/pacific-rim-fusion.png",
    appetizer: "Miso-Glazed Scallops with Champagne Beurre Blanc and Crispy Shallots",
    mainCourse: "Sake-Marinated Black Cod with Truffle Dashi, Confit Fingerling Potatoes, and Seasonal Vegetables",
    side: "Wasabi Pea Purée with Crispy Pancetta and Micro Herbs",
    dessert: "Matcha Crème Brûlée with Sesame Tuile and Berry Compote",
    dietaryInfo: ["Pescatarian", "Gluten-Free Option Available"],
  },
  {
    id: "d2",
    chefId: "dylan",
    name: "East Meets West Tasting Menu",
    description:
      "A culinary journey that bridges continents, featuring innovative techniques and bold flavor combinations.",
    image: "/meals/east-meets-west.png",
    appetizer: "Hamachi Crudo with Yuzu Kosho, Pickled Fennel, and Crispy Capers",
    mainCourse: "Five-Spice Duck Breast with Port Wine Reduction, Parsnip Purée, and Bok Choy",
    side: "Wild Mushroom Gyoza with Black Garlic Aioli",
    dessert: "Lychee Panna Cotta with Raspberry Coulis and Almond Brittle",
    dietaryInfo: ["Contains Gluten", "Contains Nuts"],
  },
  {
    id: "d3",
    chefId: "dylan",
    name: "Vegetarian Fusion Feast",
    description:
      "A plant-based celebration showcasing the versatility of local produce through an Asian-European lens.",
    image: "/meals/vegetarian-fusion.png",
    appetizer: "Tempura Seasonal Vegetables with Yuzu Aioli and Micro Herbs",
    mainCourse: "Miso-Glazed Eggplant with Truffle Risotto and Charred Broccolini",
    side: "Kimchi Arancini with Gochujang Aioli",
    dessert: "Coconut Mango Panna Cotta with Passion Fruit Coulis and Sesame Brittle",
    dietaryInfo: ["Vegetarian", "Vegan Option Available"],
  },
  {
    id: "d4",
    chefId: "dylan",
    name: "Coastal Luxury Experience",
    description:
      "A premium seafood-focused menu highlighting the bounty of BC's coastline with Asian and European influences.",
    image: "/meals/coastal-luxury.png",
    appetizer: "Dungeness Crab Cake with Wasabi Aioli and Pickled Ginger Slaw",
    mainCourse: "Miso-Butter Poached Lobster with Saffron Risotto and Sea Asparagus",
    side: "Tempura Spot Prawns with Yuzu Kosho Dipping Sauce",
    dessert: "White Chocolate Yuzu Mousse with Raspberry Gel and Shortbread Crumble",
    dietaryInfo: ["Contains Shellfish", "Contains Gluten"],
  },
  {
    id: "d5",
    chefId: "dylan",
    name: "Indian Fusion Experience",
    description:
      "A vibrant celebration of Indian flavors with Chef Dylan's signature fusion twist, combining traditional techniques with local ingredients.",
    image: "/meals/indian-fusion.png",
    appetizer: "VEGETABLE PAKORA - Chickpea Batter–Fried Seasonal Vegetables / Tangy Mint Chutney",
    mainCourse: "CHICKEN BIRYANI - Basmati Rice / Aromatic Spice Blend / Saffron / Crispy Fried Onions",
    side: "GARLIC NAAN BREAD - Leavened Flatbread / Roasted Garlic / Butter / Fresh Cilantro",
    dessert: "GULAB JAMUN - Milk Dumplings / Rose-Scented Syrup / Cardamom / Pistachio Crush",
    dietaryInfo: ["Contains Gluten", "Contains Dairy", "Contains Nuts"],
  },
]
