import type { Restaurant } from "@/types"

export const restaurants: Restaurant[] = [
  {
    id: "r1",
    name: "Burger Palace",
    image: "/restaurants/burger-palace.png",
    heroImage: "/restaurants/burger-palace-hero.png",
    cuisines: ["Burgers", "American", "Fast Food"],
    rating: 4.7,
    deliveryTime: 25,
    deliveryFee: 0,
    promotion: "Free delivery on orders $15+",
    description:
      "Gourmet burgers made with premium ingredients. Our patties are made from 100% grass-fed beef and served on freshly baked brioche buns.",
  },
  {
    id: "r2",
    name: "Sushi Express",
    image: "/restaurants/sushi-express.png",
    heroImage: "/restaurants/sushi-express-hero.png",
    cuisines: ["Japanese", "Sushi", "Asian"],
    rating: 4.5,
    deliveryTime: 35,
    deliveryFee: 2.99,
    description:
      "Fresh, authentic Japanese cuisine featuring hand-rolled sushi, sashimi, and traditional hot dishes prepared by our expert chefs.",
  },
  {
    id: "r3",
    name: "Pizza Heaven",
    image: "/restaurants/pizza-heaven.png",
    heroImage: "/restaurants/pizza-heaven-hero.png",
    cuisines: ["Pizza", "Italian"],
    rating: 4.3,
    deliveryTime: 30,
    deliveryFee: 1.99,
    promotion: "20% off on orders $25+",
    description:
      "Authentic Italian pizzas baked in a wood-fired oven. We use imported Italian ingredients and homemade dough prepared fresh daily.",
  },
  {
    id: "r4",
    name: "Taco Fiesta",
    image: "/restaurants/taco-fiesta.png",
    heroImage: "/restaurants/taco-fiesta-hero.png",
    cuisines: ["Mexican", "Tacos", "Latin American"],
    rating: 4.6,
    deliveryTime: 20,
    deliveryFee: 0.99,
    description:
      "Authentic Mexican street food featuring hand-made tortillas, slow-cooked meats, and fresh salsas prepared daily.",
  },
  {
    id: "r5",
    name: "Green Bowl",
    image: "/restaurants/green-bowl.png",
    heroImage: "/restaurants/green-bowl-hero.png",
    cuisines: ["Healthy", "Salads", "Bowls"],
    rating: 4.8,
    deliveryTime: 15,
    deliveryFee: 1.49,
    description:
      "Nutritious and delicious salads, grain bowls, and smoothies made with locally-sourced organic ingredients. Perfect for a healthy meal on the go.",
  },
  {
    id: "r6",
    name: "Noodle House",
    image: "/restaurants/noodle-house.png",
    heroImage: "/restaurants/noodle-house-hero.png",
    cuisines: ["Chinese", "Noodles", "Asian"],
    rating: 4.4,
    deliveryTime: 25,
    deliveryFee: 0.99,
    description:
      "Authentic Chinese noodles and dumplings made from scratch. Our recipes have been passed down through generations for an authentic taste.",
  },
]
