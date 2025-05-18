import type { MenuItem, MenuCategory, MenuItemWithAddOns } from "@/types"

// One Pot Family Meal Options
export const onePotMeals: MenuItemWithAddOns[] = [
  {
    id: "op1",
    name: "Spicy Stirfry Noodles",
    description: "Stir-fried egg noodles with vegetables, protein of your choice, and our signature spicy sauce",
    basePrice: 24.99,
    images: ["/spicy-stir-fry-noodles.png"],
    details:
      "A flavorful one-pot meal that's perfect for the whole family. Our spicy stir-fry noodles are made with fresh egg noodles, seasonal vegetables, and your choice of protein, all tossed in our signature spicy sauce.",
    dietaryInfo: ["Spicy", "Contains Gluten"],
    addOns: [
      {
        id: "op1-a1",
        name: "Extra Protein (Chicken)",
        price: 5.99,
        description: "Additional serving of marinated chicken",
      },
      {
        id: "op1-a2",
        name: "Extra Vegetables",
        price: 3.99,
        description: "Additional serving of seasonal vegetables",
      },
      {
        id: "op1-a3",
        name: "Reduce Spice Level",
        price: 0,
        description: "Prepare with mild spice level",
      },
    ],
    category: "One Pot Family Meals",
  },
  {
    id: "op2",
    name: "Classic Chowder Soup",
    description: "Creamy soup with seafood, potatoes, and vegetables in a rich broth",
    basePrice: 22.99,
    images: ["/seafood-chowder.png"],
    details:
      "Our classic chowder soup is made with fresh seafood, potatoes, and vegetables in a rich, creamy broth. Served with artisan bread on the side.",
    dietaryInfo: ["Contains Dairy", "Contains Seafood"],
    addOns: [
      {
        id: "op2-a1",
        name: "Extra Seafood",
        price: 7.99,
        description: "Additional serving of mixed seafood",
      },
      {
        id: "op2-a2",
        name: "Artisan Bread",
        price: 3.99,
        description: "Additional serving of fresh artisan bread",
      },
    ],
    category: "One Pot Family Meals",
  },
  {
    id: "op3",
    name: "Tuna TarTar",
    description: "Fresh raw tuna mixed with avocado, sesame oil, and Asian-inspired seasonings",
    basePrice: 26.99,
    images: ["/tuna-tartar-avocado.png"],
    details:
      "Our tuna tartar features fresh, sushi-grade tuna mixed with ripe avocado, sesame oil, and Asian-inspired seasonings. Served with crispy wonton chips.",
    dietaryInfo: ["Raw Fish", "Contains Sesame", "Gluten-Free Option Available"],
    addOns: [
      {
        id: "op3-a1",
        name: "Extra Tuna",
        price: 8.99,
        description: "Additional serving of fresh tuna",
      },
      {
        id: "op3-a2",
        name: "Wonton Chips",
        price: 2.99,
        description: "Additional serving of crispy wonton chips",
      },
    ],
    category: "One Pot Family Meals",
  },
  {
    id: "op4",
    name: "Chow Mein Noodles",
    description: "Stir-fried noodles with vegetables and your choice of protein in a savory sauce",
    basePrice: 23.99,
    images: ["/vegetable-chow-mein.png"],
    details:
      "Our chow mein features stir-fried noodles with a colorful mix of vegetables and your choice of protein, all tossed in a savory sauce.",
    dietaryInfo: ["Contains Gluten", "Vegetarian Option Available"],
    addOns: [
      {
        id: "op4-a1",
        name: "Extra Protein (Beef)",
        price: 6.99,
        description: "Additional serving of marinated beef",
      },
      {
        id: "op4-a2",
        name: "Extra Vegetables",
        price: 3.99,
        description: "Additional serving of stir-fried vegetables",
      },
    ],
    category: "One Pot Family Meals",
  },
]

// Sit Down Course Dinners - Indian
export const indianDinner: MenuItemWithAddOns[] = [
  {
    id: "im1",
    name: "Vegetable Pakora",
    description: "Chickpea batter–fried seasonal vegetables served with tangy mint chutney",
    basePrice: 12,
    images: ["/indian-vegetable-pakora.png", "/meals/vegetable-pakora-1.png", "/meals/vegetable-pakora-2.png"],
    details:
      "Our vegetable pakoras are made with a mix of seasonal vegetables like cauliflower, onions, spinach, and bell peppers, dipped in a spiced chickpea batter and fried to golden perfection. Served with our house-made mint chutney.",
    dietaryInfo: ["Vegetarian", "Vegan Option Available"],
    addOns: [
      {
        id: "im1-a1",
        name: "Extra Mint Chutney",
        price: 2,
        description: "Additional serving of our house-made mint chutney",
      },
      {
        id: "im1-a2",
        name: "Tamarind Chutney",
        price: 2,
        description: "Sweet and tangy tamarind sauce",
      },
    ],
    category: "Indian",
  },
  {
    id: "im2",
    name: "Chicken Biryani",
    description: "Basmati rice with aromatic spice blend, saffron, and crispy fried onions",
    basePrice: 24,
    images: ["/meals/chicken-biryani.png", "/meals/biryani-plate.png", "/placeholder-9bdye.png"],
    details:
      "Our signature biryani features fragrant basmati rice layered with tender chicken pieces marinated in a blend of 16 spices. Slow-cooked with saffron and finished with crispy fried onions and fresh cilantro.",
    dietaryInfo: ["Contains Gluten", "Contains Dairy"],
    addOns: [
      {
        id: "im2-a1",
        name: "Extra Chicken",
        price: 5,
        description: "Additional portion of tandoori-spiced chicken",
      },
      {
        id: "im2-a2",
        name: "Raita",
        price: 3,
        description: "Cooling yogurt with cucumber and mint",
      },
    ],
    category: "Indian",
  },
  {
    id: "im3",
    name: "Chicken Tandoori",
    description: "Yogurt marinade with garlic, ginger, tandoori masala, and charred peppers",
    basePrice: 22,
    images: ["/meals/chicken-tandoori-1.png", "/tandoori-chicken-lemon.png"],
    details:
      "Chicken marinated for 24 hours in yogurt, garlic, ginger, and our house-made tandoori masala. Cooked in a traditional clay oven and served with charred peppers, lemon wedges, and mint chutney.",
    dietaryInfo: ["Contains Dairy", "Gluten-Free"],
    addOns: [
      {
        id: "im3-a1",
        name: "Extra Chicken Piece",
        price: 6,
        description: "Additional tandoori chicken piece",
      },
      {
        id: "im3-a2",
        name: "Mint Chutney",
        price: 2,
        description: "House-made mint chutney",
      },
    ],
    category: "Indian",
  },
  {
    id: "im4",
    name: "Garlic Naan Bread",
    description: "Leavened flatbread with roasted garlic, butter, and fresh cilantro",
    basePrice: 6,
    images: ["/garlic-naan-with-butter.png", "/garlic-naan-basket.png"],
    details:
      "Hand-stretched and baked to order in our clay oven. Our naan is brushed with garlic butter and sprinkled with fresh cilantro and a touch of sea salt.",
    dietaryInfo: ["Vegetarian", "Contains Gluten", "Contains Dairy"],
    addOns: [
      {
        id: "im4-a1",
        name: "Butter Topping",
        price: 1,
        description: "Extra melted butter",
      },
      {
        id: "im4-a2",
        name: "Cheese Stuffing",
        price: 3,
        description: "Stuffed with melted cheese",
      },
    ],
    category: "Indian",
  },
  {
    id: "im5",
    name: "Gulab Jamun",
    description: "Milk dumplings in rose-scented syrup with cardamom and pistachio crush",
    basePrice: 10,
    images: ["/gulab-jamun-pistachios.png", "/placeholder-4s4im.png"],
    details:
      "Traditional Indian dessert made with milk solids, flour, and a hint of cardamom, deep-fried until golden and soaked in a rose-scented sugar syrup. Garnished with crushed pistachios.",
    dietaryInfo: ["Vegetarian", "Contains Dairy", "Contains Nuts"],
    addOns: [
      {
        id: "im5-a1",
        name: "Ice Cream",
        price: 3,
        description: "Vanilla ice cream on the side",
      },
      {
        id: "im5-a2",
        name: "Extra Syrup",
        price: 1,
        description: "Additional rose-scented syrup",
      },
    ],
    category: "Indian",
  },
]

// Sit Down Course Dinners - Cantonese
export const cantoneseDinner: MenuItemWithAddOns[] = [
  {
    id: "cn1",
    name: "White Rice",
    description: "Steamed jasmine rice, perfectly cooked and fluffy",
    basePrice: 4.99,
    images: ["/steamed-white-rice.png"],
    details: "Premium jasmine rice, steamed to perfection with just the right amount of moisture for a fluffy texture.",
    dietaryInfo: ["Vegan", "Gluten-Free"],
    addOns: [
      {
        id: "cn1-a1",
        name: "Extra Serving",
        price: 2.99,
        description: "Additional serving of steamed rice",
      },
    ],
    category: "Cantonese",
  },
  {
    id: "cn2",
    name: "Crispy Pork Belly",
    description: "Slow-roasted pork belly with crispy skin and tender meat",
    basePrice: 18.99,
    images: ["/cantonese-crispy-pork-belly.png"],
    details:
      "Our pork belly is marinated for 24 hours, then slow-roasted to achieve the perfect balance of crispy skin and tender, juicy meat. Served with a side of hoisin dipping sauce.",
    dietaryInfo: ["Contains Pork"],
    addOns: [
      {
        id: "cn2-a1",
        name: "Extra Sauce",
        price: 1.99,
        description: "Additional hoisin dipping sauce",
      },
      {
        id: "cn2-a2",
        name: "Extra Portion",
        price: 8.99,
        description: "Additional serving of crispy pork belly",
      },
    ],
    category: "Cantonese",
  },
  {
    id: "cn3",
    name: "Kimchi",
    description: "Traditional fermented cabbage with chili and garlic",
    basePrice: 6.99,
    images: ["/placeholder.svg?height=400&width=600&query=kimchi in bowl"],
    details:
      "Our house-made kimchi is fermented to perfection, offering the perfect balance of spicy, sour, and umami flavors. Made with Napa cabbage, Korean chili flakes, garlic, and ginger.",
    dietaryInfo: ["Vegan", "Gluten-Free", "Spicy"],
    addOns: [
      {
        id: "cn3-a1",
        name: "Extra Spicy",
        price: 0,
        description: "Prepared with extra chili for more heat",
      },
    ],
    category: "Cantonese",
  },
  {
    id: "cn4",
    name: "Teriyaki Pork Tenderloin",
    description: "Grilled pork tenderloin glazed with sweet and savory teriyaki sauce",
    basePrice: 19.99,
    images: ["/placeholder.svg?height=400&width=600&query=teriyaki pork tenderloin sliced"],
    details:
      "Our pork tenderloin is marinated in a house-made teriyaki sauce, then grilled to juicy perfection and glazed with additional sauce. Served sliced with green onions and sesame seeds.",
    dietaryInfo: ["Contains Pork", "Contains Soy", "Contains Sesame"],
    addOns: [
      {
        id: "cn4-a1",
        name: "Extra Sauce",
        price: 1.99,
        description: "Additional teriyaki sauce on the side",
      },
      {
        id: "cn4-a2",
        name: "Extra Portion",
        price: 9.99,
        description: "Additional serving of teriyaki pork",
      },
    ],
    category: "Cantonese",
  },
  {
    id: "cn5",
    name: "Cantonese Style Beef and Broccoli",
    description: "Tender beef slices stir-fried with broccoli in a savory brown sauce",
    basePrice: 17.99,
    images: ["/placeholder.svg?height=400&width=600&query=beef and broccoli stir fry"],
    details:
      "Thinly sliced beef is marinated and stir-fried with fresh broccoli florets in a savory brown sauce with garlic and ginger. A classic Cantonese dish that's both nutritious and delicious.",
    dietaryInfo: ["Contains Soy", "Contains Beef"],
    addOns: [
      {
        id: "cn5-a1",
        name: "Extra Beef",
        price: 6.99,
        description: "Additional serving of marinated beef",
      },
      {
        id: "cn5-a2",
        name: "Extra Vegetables",
        price: 3.99,
        description: "Additional serving of stir-fried vegetables",
      },
    ],
    category: "Cantonese",
  },
  {
    id: "cn6",
    name: "Fortune Cookies",
    description: "Crisp vanilla-flavored cookies with fortunes inside",
    basePrice: 3.99,
    images: ["/placeholder.svg?height=400&width=600&query=fortune cookies on plate"],
    details:
      "Traditional crisp, vanilla-flavored cookies with fortunes inside. Each cookie contains a unique message for a fun end to your meal.",
    dietaryInfo: ["Vegetarian", "Contains Gluten", "Contains Eggs"],
    addOns: [
      {
        id: "cn6-a1",
        name: "Extra Cookies",
        price: 2.99,
        description: "Additional serving of fortune cookies",
      },
    ],
    category: "Cantonese",
  },
  {
    id: "cn7",
    name: "Green Tea",
    description: "Premium Japanese green tea, served hot",
    basePrice: 4.99,
    images: ["/placeholder.svg?height=400&width=600&query=japanese green tea in traditional cup"],
    details: "Premium Japanese green tea with a delicate flavor and aroma. Served hot in a traditional teapot.",
    dietaryInfo: ["Vegan", "Gluten-Free", "Caffeine"],
    addOns: [
      {
        id: "cn7-a1",
        name: "Honey",
        price: 0.99,
        description: "Side of honey for sweetening",
      },
    ],
    category: "Cantonese",
  },
  {
    id: "cn8",
    name: "Chow Mein Noodles",
    description: "Stir-fried egg noodles with vegetables in a savory sauce",
    basePrice: 14.99,
    images: ["/vegetable-chow-mein.png"],
    details:
      "Egg noodles stir-fried with a colorful mix of vegetables including bean sprouts, carrots, and cabbage in a savory sauce.",
    dietaryInfo: ["Vegetarian", "Contains Gluten", "Contains Eggs"],
    addOns: [
      {
        id: "cn8-a1",
        name: "Add Chicken",
        price: 4.99,
        description: "Add stir-fried chicken",
      },
      {
        id: "cn8-a2",
        name: "Add Beef",
        price: 5.99,
        description: "Add stir-fried beef",
      },
      {
        id: "cn8-a3",
        name: "Add Shrimp",
        price: 6.99,
        description: "Add stir-fried shrimp",
      },
    ],
    category: "Cantonese",
  },
]

// Sit Down Course Dinners - Backyard BBQ
export const bbqDinner: MenuItemWithAddOns[] = [
  {
    id: "bbq1",
    name: "Grilled Chicken Thighs",
    description: "Juicy chicken thighs marinated and grilled to perfection",
    basePrice: 16.99,
    images: ["/placeholder.svg?height=400&width=600&query=grilled chicken thighs with herbs"],
    details:
      "Our chicken thighs are marinated in a blend of herbs and spices, then grilled to juicy perfection. Served with a side of our signature BBQ sauce.",
    dietaryInfo: ["Gluten-Free"],
    addOns: [
      {
        id: "bbq1-a1",
        name: "Extra Sauce",
        price: 1.99,
        description: "Additional BBQ sauce on the side",
      },
      {
        id: "bbq1-a2",
        name: "Extra Portion",
        price: 7.99,
        description: "Additional serving of grilled chicken thighs",
      },
    ],
    category: "Backyard BBQ",
  },
  {
    id: "bbq2",
    name: "Smoked Brisket",
    description: "Slow-smoked beef brisket with a flavorful bark and tender interior",
    basePrice: 22.99,
    images: ["/placeholder.svg?height=400&width=600&query=sliced smoked beef brisket"],
    details:
      "Our beef brisket is rubbed with our special spice blend and slow-smoked for 12 hours until it develops a flavorful bark and tender, juicy interior. Sliced and served with our house BBQ sauce.",
    dietaryInfo: ["Gluten-Free", "Contains Beef"],
    addOns: [
      {
        id: "bbq2-a1",
        name: "Extra Sauce",
        price: 1.99,
        description: "Additional BBQ sauce on the side",
      },
      {
        id: "bbq2-a2",
        name: "Extra Portion",
        price: 10.99,
        description: "Additional serving of smoked brisket",
      },
    ],
    category: "Backyard BBQ",
  },
  {
    id: "bbq3",
    name: "Pork Sausages",
    description: "House-made pork sausages, grilled and juicy",
    basePrice: 14.99,
    images: ["/placeholder.svg?height=400&width=600&query=grilled pork sausages"],
    details:
      "Our house-made pork sausages are crafted with a blend of spices and herbs, then grilled until juicy and flavorful. Served with mustard and relish on the side.",
    dietaryInfo: ["Contains Pork"],
    addOns: [
      {
        id: "bbq3-a1",
        name: "Extra Mustard",
        price: 0.99,
        description: "Additional mustard on the side",
      },
      {
        id: "bbq3-a2",
        name: "Extra Portion",
        price: 6.99,
        description: "Additional serving of pork sausages",
      },
    ],
    category: "Backyard BBQ",
  },
  {
    id: "bbq4",
    name: "Corn Bread",
    description: "Sweet and savory corn bread with honey butter",
    basePrice: 7.99,
    images: ["/placeholder.svg?height=400&width=600&query=corn bread with honey butter"],
    details:
      "Our corn bread is baked fresh with a perfect balance of sweet and savory flavors. Served warm with honey butter on the side.",
    dietaryInfo: ["Vegetarian", "Contains Gluten", "Contains Dairy"],
    addOns: [
      {
        id: "bbq4-a1",
        name: "Extra Honey Butter",
        price: 1.99,
        description: "Additional honey butter on the side",
      },
      {
        id: "bbq4-a2",
        name: "Extra Portion",
        price: 3.99,
        description: "Additional serving of corn bread",
      },
    ],
    category: "Backyard BBQ",
  },
  {
    id: "bbq5",
    name: "Grilled Vegetables",
    description: "Seasonal vegetables grilled with olive oil, salt, and pepper",
    basePrice: 9.99,
    images: ["/placeholder.svg?height=400&width=600&query=grilled vegetable medley"],
    details:
      "A colorful medley of seasonal vegetables including zucchini, bell peppers, asparagus, and mushrooms, lightly seasoned and grilled to perfection.",
    dietaryInfo: ["Vegan", "Gluten-Free"],
    addOns: [
      {
        id: "bbq5-a1",
        name: "Herb Butter",
        price: 1.99,
        description: "Add herb butter to your vegetables",
      },
      {
        id: "bbq5-a2",
        name: "Extra Portion",
        price: 4.99,
        description: "Additional serving of grilled vegetables",
      },
    ],
    category: "Backyard BBQ",
  },
  {
    id: "bbq6",
    name: "Corn",
    description: "Grilled corn on the cob with butter and salt",
    basePrice: 5.99,
    images: ["/placeholder.svg?height=400&width=600&query=grilled corn on the cob with butter"],
    details: "Sweet corn on the cob, grilled to bring out its natural sweetness and served with butter and salt.",
    dietaryInfo: ["Vegetarian", "Gluten-Free", "Contains Dairy"],
    addOns: [
      {
        id: "bbq6-a1",
        name: "Chili Lime Butter",
        price: 1.99,
        description: "Upgrade to chili lime butter",
      },
      {
        id: "bbq6-a2",
        name: "Extra Corn",
        price: 2.99,
        description: "Additional ear of corn",
      },
    ],
    category: "Backyard BBQ",
  },
  {
    id: "bbq7",
    name: "Chocolate & Caramel Cake",
    description: "Rich chocolate cake with layers of caramel and chocolate ganache",
    basePrice: 12.99,
    images: ["/placeholder.svg?height=400&width=600&query=chocolate caramel layer cake slice"],
    details:
      "Our decadent chocolate cake features layers of moist chocolate cake, rich caramel, and smooth chocolate ganache. The perfect sweet ending to your BBQ feast.",
    dietaryInfo: ["Vegetarian", "Contains Gluten", "Contains Dairy", "Contains Eggs"],
    addOns: [
      {
        id: "bbq7-a1",
        name: "Vanilla Ice Cream",
        price: 2.99,
        description: "Add a scoop of vanilla ice cream",
      },
      {
        id: "bbq7-a2",
        name: "Extra Slice",
        price: 5.99,
        description: "Additional slice of cake",
      },
    ],
    category: "Backyard BBQ",
  },
]

// Sit Down Course Dinners - Italian
export const italianDinner: MenuItemWithAddOns[] = [
  {
    id: "it1",
    name: "Home made Focaccia",
    description: "Freshly baked focaccia with olive oil, rosemary, and sea salt",
    basePrice: 8.99,
    images: ["/placeholder.svg?height=400&width=600&query=homemade focaccia bread with rosemary"],
    details:
      "Our focaccia is made fresh daily with high-quality flour, extra virgin olive oil, fresh rosemary, and flaky sea salt. Baked to perfection with a crisp exterior and soft, airy interior.",
    dietaryInfo: ["Vegetarian", "Contains Gluten"],
    addOns: [
      {
        id: "it1-a1",
        name: "Balsamic & Olive Oil",
        price: 2.99,
        description: "Premium balsamic vinegar and olive oil for dipping",
      },
      {
        id: "it1-a2",
        name: "Extra Portion",
        price: 4.99,
        description: "Additional serving of focaccia",
      },
    ],
    category: "Italian",
  },
  {
    id: "it2",
    name: "Olives",
    description: "Marinated mixed olives with herbs and citrus",
    basePrice: 6.99,
    images: ["/placeholder.svg?height=400&width=600&query=marinated mixed olives in bowl"],
    details:
      "A selection of premium olives marinated in extra virgin olive oil, herbs, garlic, and citrus zest. The perfect appetizer to start your Italian feast.",
    dietaryInfo: ["Vegan", "Gluten-Free"],
    addOns: [
      {
        id: "it2-a1",
        name: "Extra Portion",
        price: 3.99,
        description: "Additional serving of marinated olives",
      },
    ],
    category: "Italian",
  },
  {
    id: "it3",
    name: "Bruschetta",
    description: "Toasted bread topped with fresh tomatoes, basil, and garlic",
    basePrice: 9.99,
    images: ["/placeholder.svg?height=400&width=600&query=tomato bruschetta on toasted bread"],
    details:
      "Our bruschetta features toasted artisan bread topped with a flavorful mix of diced fresh tomatoes, basil, garlic, and extra virgin olive oil. Finished with a drizzle of balsamic glaze.",
    dietaryInfo: ["Vegetarian", "Contains Gluten"],
    addOns: [
      {
        id: "it3-a1",
        name: "Add Mozzarella",
        price: 2.99,
        description: "Add fresh mozzarella cheese",
      },
      {
        id: "it3-a2",
        name: "Extra Portion",
        price: 4.99,
        description: "Additional serving of bruschetta",
      },
    ],
    category: "Italian",
  },
  {
    id: "it4",
    name: "Fried Brussel Sprouts & Squash Sauce",
    description: "Crispy fried brussels sprouts served with creamy butternut squash sauce",
    basePrice: 12.99,
    images: ["/placeholder.svg?height=400&width=600&query=fried brussels sprouts with squash sauce"],
    details:
      "Our brussels sprouts are fried until crispy and golden, then tossed with a touch of balsamic glaze. Served with a creamy, house-made butternut squash sauce for dipping.",
    dietaryInfo: ["Vegetarian", "Gluten-Free", "Contains Dairy"],
    addOns: [
      {
        id: "it4-a1",
        name: "Add Pancetta",
        price: 3.99,
        description: "Add crispy pancetta bits",
      },
      {
        id: "it4-a2",
        name: "Extra Sauce",
        price: 1.99,
        description: "Additional butternut squash sauce",
      },
    ],
    category: "Italian",
  },
  {
    id: "it5",
    name: "Eggplant Parmesan",
    description: "Layers of breaded eggplant, marinara sauce, and melted cheese",
    basePrice: 18.99,
    images: ["/placeholder.svg?height=400&width=600&query=eggplant parmesan with melted cheese"],
    details:
      "Our eggplant parmesan features layers of lightly breaded eggplant, house-made marinara sauce, and a blend of melted mozzarella and parmesan cheeses. Baked until bubbly and golden.",
    dietaryInfo: ["Vegetarian", "Contains Gluten", "Contains Dairy"],
    addOns: [
      {
        id: "it5-a1",
        name: "Extra Cheese",
        price: 2.99,
        description: "Additional cheese topping",
      },
      {
        id: "it5-a2",
        name: "Side of Pasta",
        price: 4.99,
        description: "Side of spaghetti with marinara",
      },
    ],
    category: "Italian",
  },
  {
    id: "it6",
    name: "Beef Cheek",
    description: "Slow-braised beef cheek in red wine sauce with root vegetables",
    basePrice: 24.99,
    images: ["/placeholder.svg?height=400&width=600&query=braised beef cheek with vegetables"],
    details:
      "Our beef cheek is slow-braised for hours in a rich red wine sauce with aromatic herbs and root vegetables until fork-tender. Served with creamy polenta to soak up the delicious sauce.",
    dietaryInfo: ["Contains Beef", "Contains Alcohol", "Contains Dairy"],
    addOns: [
      {
        id: "it6-a1",
        name: "Extra Sauce",
        price: 2.99,
        description: "Additional red wine sauce",
      },
      {
        id: "it6-a2",
        name: "Extra Polenta",
        price: 3.99,
        description: "Additional serving of creamy polenta",
      },
    ],
    category: "Italian",
  },
  {
    id: "it7",
    name: "Tiramisu",
    description: "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream",
    basePrice: 10.99,
    images: ["/placeholder.svg?height=400&width=600&query=tiramisu dessert in glass"],
    details:
      "Our classic tiramisu features layers of coffee-soaked ladyfingers and light, creamy mascarpone, dusted with cocoa powder. A perfect balance of coffee flavor and creamy sweetness.",
    dietaryInfo: ["Vegetarian", "Contains Gluten", "Contains Dairy", "Contains Eggs", "Contains Alcohol"],
    addOns: [
      {
        id: "it7-a1",
        name: "Chocolate Shavings",
        price: 1.99,
        description: "Additional dark chocolate shavings on top",
      },
      {
        id: "it7-a2",
        name: "Extra Portion",
        price: 5.99,
        description: "Additional serving of tiramisu",
      },
    ],
    category: "Italian",
  },
]

// Complete meal packages
export const mealPackages: MenuItemWithAddOns[] = [
  {
    id: "mp1",
    name: "Indian Fusion Experience",
    description: "A vibrant celebration of Indian flavors with Chef Dylan's signature fusion twist",
    basePrice: 80,
    images: [
      "/meals/indian-fusion.png",
      "/meals/chicken-biryani.png",
      "/meals/biryani-plate.png",
      "/indian-vegetable-pakora.png",
    ],
    details:
      "Our Indian Fusion Experience is a complete 4-course meal showcasing the best of Indian cuisine with Chef Dylan's unique twist. The meal includes vegetable pakoras as an appetizer, chicken biryani as the main course, garlic naan bread as a side, and gulab jamun for dessert. All meals are prepared fresh and delivered to your door.",
    dietaryInfo: ["Contains Gluten", "Contains Dairy", "Contains Nuts"],
    addOns: [
      {
        id: "mp1-a1",
        name: "Wine Pairing",
        price: 25,
        description: "Curated wine selection to complement your meal",
      },
      {
        id: "mp1-a2",
        name: "Extra Dessert",
        price: 10,
        description: "Additional dessert portion",
      },
    ],
    category: "Meal Packages",
  },
  {
    id: "mp2",
    name: "Cantonese Feast",
    description: "A traditional Cantonese dining experience with authentic flavors",
    basePrice: 85,
    images: ["/placeholder.svg?height=400&width=600&query=cantonese feast with multiple dishes"],
    details:
      "Our Cantonese Feast includes white rice, crispy pork belly, kimchi, teriyaki pork tenderloin, Cantonese style beef and broccoli, fortune cookies, green tea, and chow mein noodles. A complete authentic dining experience for four people.",
    dietaryInfo: ["Contains Pork", "Contains Beef", "Contains Soy", "Contains Gluten"],
    addOns: [
      {
        id: "mp2-a1",
        name: "Extra Rice",
        price: 5,
        description: "Additional serving of white rice",
      },
      {
        id: "mp2-a2",
        name: "Chinese Beer Pairing",
        price: 20,
        description: "Four bottles of premium Chinese beer",
      },
    ],
    category: "Meal Packages",
  },
  {
    id: "mp3",
    name: "Backyard BBQ Experience",
    description: "A complete BBQ feast with all the fixings",
    basePrice: 90,
    images: ["/placeholder.svg?height=400&width=600&query=backyard bbq spread with meats and sides"],
    details:
      "Our Backyard BBQ Experience includes grilled chicken thighs, smoked brisket, pork sausages, corn bread, grilled vegetables, corn on the cob, and chocolate & caramel cake for dessert. Everything you need for a perfect BBQ feast for four people.",
    dietaryInfo: ["Contains Pork", "Contains Beef", "Contains Gluten", "Contains Dairy"],
    addOns: [
      {
        id: "mp3-a1",
        name: "Craft Beer Pairing",
        price: 24,
        description: "Four bottles of local craft beer",
      },
      {
        id: "mp3-a2",
        name: "Extra Brisket",
        price: 15,
        description: "Additional serving of smoked brisket",
      },
    ],
    category: "Meal Packages",
  },
  {
    id: "mp4",
    name: "Italian Dinner Experience",
    description: "A traditional Italian multi-course dinner",
    basePrice: 95,
    images: ["/placeholder.svg?height=400&width=600&query=italian dinner spread with multiple courses"],
    details:
      "Our Italian Dinner Experience includes homemade focaccia, marinated olives, bruschetta, fried brussels sprouts with squash sauce, eggplant parmesan, braised beef cheek, and tiramisu for dessert. A complete authentic Italian dining experience for four people.",
    dietaryInfo: ["Contains Beef", "Contains Gluten", "Contains Dairy", "Contains Alcohol"],
    addOns: [
      {
        id: "mp4-a1",
        name: "Italian Wine Pairing",
        price: 30,
        description: "Bottle of premium Italian red wine",
      },
      {
        id: "mp4-a2",
        name: "Extra Focaccia",
        price: 8,
        description: "Additional serving of homemade focaccia",
      },
    ],
    category: "Meal Packages",
  },
]

// Export all menu items
export const allMenuItems: MenuItemWithAddOns[] = [
  ...onePotMeals,
  ...indianDinner,
  ...cantoneseDinner,
  ...bbqDinner,
  ...italianDinner,
  ...mealPackages,
]

// Export menu categories
export const menuCategories: MenuCategory[] = [
  {
    id: "one-pot",
    name: "One Pot Family Meal Options",
    description: "Quick and easy one-pot meals perfect for busy weeknights",
  },
  {
    id: "indian",
    name: "Indian Dinner for 4",
    description: "A complete Indian dining experience with authentic flavors",
  },
  {
    id: "cantonese",
    name: "Cantonese Dinner for 4",
    description: "Traditional Cantonese cuisine with modern touches",
  },
  {
    id: "bbq",
    name: "Backyard BBQ Dinner for 4",
    description: "Classic American BBQ favorites for the whole family",
  },
  {
    id: "italian",
    name: "Italian Dinner for 4",
    description: "Authentic Italian multi-course dining experience",
  },
  {
    id: "packages",
    name: "Complete Meal Packages",
    description: "Pre-selected meal combinations for a full dining experience",
  },
]

// Add the missing menuItems export for backward compatibility
export const menuItems: MenuItem[] = allMenuItems.map((item) => ({
  id: item.id,
  restaurantId: "chef-dylan", // Assuming all items belong to Chef Dylan
  name: item.name,
  description: item.description,
  price: item.basePrice,
  image: item.images[0],
  category: item.category,
}))
