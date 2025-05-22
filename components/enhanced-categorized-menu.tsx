"use client"

import { useState } from "react"
import { useOrder } from "@/hooks/use-order"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import MenuItemDetailView from "@/components/menu-item-detail-view"

// Sample menu data structure - replace with your actual data
const menuCategories = [
  {
    id: "appetizers",
    name: "Appetizers",
    items: [
      {
        id: "spring-rolls",
        name: "Spring Rolls",
        description: "Crispy vegetable spring rolls served with sweet chili sauce",
        price: 8.99,
        image: "/vegetable-pakora-1.png",
        images: ["/vegetable-pakora-1.png", "/vegetable-pakora-2.png", "/vegetable-pakora-3.png"],
        ingredients: ["Cabbage", "Carrots", "Bean sprouts", "Rice paper", "Vegetable oil"],
        allergens: ["Gluten", "Soy"],
        nutritionalInfo: {
          calories: 320,
          protein: 4,
          carbs: 28,
          fat: 12,
        },
        preparationTime: 15,
        servingSize: "4 pieces",
      },
      {
        id: "kimchi",
        name: "Kimchi",
        description: "Traditional Korean fermented cabbage with spices",
        price: 6.99,
        image: "/kimchi.png",
        ingredients: ["Napa cabbage", "Korean chili flakes", "Garlic", "Ginger", "Fish sauce"],
        allergens: ["Fish"],
        nutritionalInfo: {
          calories: 150,
          protein: 2,
          carbs: 10,
          fat: 1,
        },
        preparationTime: 5,
        servingSize: "4 oz",
      },
    ],
  },
  {
    id: "main-courses",
    name: "Main Courses",
    items: [
      {
        id: "stir-fry-noodles",
        name: "Stir-Fry Noodles",
        description: "Egg noodles stir-fried with vegetables in a savory sauce",
        price: 14.99,
        image: "/spicy-stir-fry-noodles.png",
        images: ["/spicy-stir-fry-noodles.png", "/vegetable-chow-mein.png"],
        ingredients: ["Egg noodles", "Bell peppers", "Carrots", "Onions", "Soy sauce", "Sesame oil"],
        allergens: ["Gluten", "Egg", "Soy"],
        nutritionalInfo: {
          calories: 450,
          protein: 12,
          carbs: 65,
          fat: 18,
        },
        preparationTime: 20,
        servingSize: "1 plate",
      },
      {
        id: "white-rice",
        name: "Steamed White Rice",
        description: "Perfectly steamed jasmine rice",
        price: 3.99,
        image: "/steamed-white-rice.png",
        ingredients: ["Jasmine rice"],
        nutritionalInfo: {
          calories: 200,
          protein: 4,
          carbs: 45,
          fat: 0,
        },
        preparationTime: 10,
        servingSize: "1 cup",
      },
    ],
  },
  {
    id: "desserts",
    name: "Desserts",
    items: [
      {
        id: "mango-pudding",
        name: "Mango Pudding",
        description: "Creamy mango pudding topped with fresh fruit",
        price: 7.99,
        image: "/placeholder.svg?height=300&width=400&query=mango pudding",
        ingredients: ["Mango puree", "Cream", "Sugar", "Gelatin", "Fresh mango"],
        allergens: ["Dairy"],
        nutritionalInfo: {
          calories: 280,
          protein: 3,
          carbs: 42,
          fat: 10,
        },
        preparationTime: 10,
        servingSize: "1 cup",
      },
    ],
  },
]

export default function EnhancedCategorizedMenu() {
  const { addToCart, items: cartItems } = useOrder()
  const { showToast } = useToast()
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const handleAddToCart = (item: any) => {
    addToCart(item)
    showToast(`${item.name} added to your cart!`, "success")
  }

  const isInCart = (id: string) => cartItems.some((item) => item.id === id)

  const handleItemClick = (item: any) => {
    setSelectedItem(item)
  }

  const handleBackToMenu = () => {
    setSelectedItem(null)
  }

  if (selectedItem) {
    return <MenuItemDetailView item={selectedItem} onBack={handleBackToMenu} />
  }

  return (
    <div className="space-y-8">
      {menuCategories.map((category) => (
        <div key={category.id} className="rounded-lg border bg-white shadow-sm">
          <div className="border-b p-6">
            <h2 className="text-2xl font-bold">{category.name}</h2>
          </div>
          <div className="divide-y">
            {category.items.map((item) => (
              <div key={item.id} className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  {item.image && (
                    <div className="mb-4 sm:mb-0 sm:mr-6 sm:w-1/4">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="h-40 w-full rounded-lg object-cover sm:h-32"
                        onClick={() => handleItemClick(item)}
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="mb-2 flex items-start justify-between">
                      <h3
                        className="text-lg font-bold hover:cursor-pointer hover:text-gray-700"
                        onClick={() => handleItemClick(item)}
                      >
                        {item.name}
                      </h3>
                      <span className="font-medium">${item.price.toFixed(2)}</span>
                    </div>
                    <p className="mb-4 text-gray-600">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm" onClick={() => handleItemClick(item)}>
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(item)}
                        className={isInCart(item.id) ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        {isInCart(item.id) ? (
                          <>
                            <Check className="mr-1 h-4 w-4" /> Added
                          </>
                        ) : (
                          <>
                            <PlusCircle className="mr-1 h-4 w-4" /> Add to Cart
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
