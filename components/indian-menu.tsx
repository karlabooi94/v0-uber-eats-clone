"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Check, Info } from "lucide-react"
import { useOrder } from "@/hooks/use-order"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import EnhancedImageCarousel from "./enhanced-image-carousel"
import DishCarouselWithAddOns from "./dish-carousel-with-addons"
import DynamicCheckoutButton from "./dynamic-checkout-button"
import { indianDinner, mealPackages } from "@/data/menu-items"

// Define the complete meal package
const indianMealPackage = mealPackages.find((item) => item.name === "Indian Fusion Experience")

export default function IndianMenu() {
  const [isAdding, setIsAdding] = useState(false)
  const { addToOrder, items } = useOrder()
  const { showToast } = useToast()
  const router = useRouter()

  // Check if this meal is already in the order
  const isInOrder = items.some((item) => item.id === "mp1")

  const handleAddToOrder = () => {
    setIsAdding(true)

    // Simulate a small delay for better UX
    setTimeout(() => {
      addToOrder({
        id: "mp1",
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
        quantity: 1,
        basePrice: 80,
        addOnsPrice: 0,
        addOns: [],
      })

      setIsAdding(false)

      showToast("Indian Fusion Experience added to your order!", "success", 3000, {
        label: "View Order",
        onClick: () => router.push("/checkout"),
      })
    }, 500)
  }

  return (
    <div className="space-y-8 relative pb-20">
      {/* Featured meal package with enhanced image carousel */}
      <div className="overflow-hidden rounded-lg border bg-white shadow-md">
        <div className="p-6">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold">Indian Fusion Experience</h2>
              <p className="mt-1 text-gray-600">
                A vibrant celebration of Indian flavors with Chef Dylan's signature fusion twist
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="rounded-full bg-black px-3 py-1 text-sm font-medium text-white">$80 per person</span>
                <span className="text-sm text-gray-500">Includes delivery</span>
              </div>
            </div>
            <Button
              onClick={handleAddToOrder}
              className={`transition-all duration-200 ${isInOrder ? "bg-green-600 hover:bg-green-700" : "bg-black hover:bg-black/90"}`}
              disabled={isAdding}
              size="lg"
            >
              {isAdding ? (
                <span className="flex items-center">
                  <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Adding...
                </span>
              ) : isInOrder ? (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Added to order
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Add to order
                </>
              )}
            </Button>
          </div>

          {/* Enhanced image carousel for the meal package */}
          <EnhancedImageCarousel
            images={indianMealPackage?.images || ["/meals/indian-fusion.png"]}
            alt="Indian Fusion Experience"
            className="mb-6"
          />

          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold">What's Included</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-3">
                <h4 className="font-medium">Appetizer</h4>
                <p className="text-sm text-gray-600">
                  VEGETABLE PAKORA - Chickpea Batter–Fried Seasonal Vegetables / Tangy Mint Chutney
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <h4 className="font-medium">Main Course</h4>
                <p className="text-sm text-gray-600">
                  CHICKEN BIRYANI - Basmati Rice / Aromatic Spice Blend / Saffron / Crispy Fried Onions
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <h4 className="font-medium">Side</h4>
                <p className="text-sm text-gray-600">
                  GARLIC NAAN BREAD - Leavened Flatbread / Roasted Garlic / Butter / Fresh Cilantro
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <h4 className="font-medium">Dessert</h4>
                <p className="text-sm text-gray-600">
                  GULAB JAMUN - Milk Dumplings / Rose-Scented Syrup / Cardamom / Pistachio Crush
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-500" />
              <div>
                <h4 className="font-medium">Dietary Information</h4>
                <p className="mt-1 text-sm text-gray-600">
                  Contains gluten, dairy, and nuts. Please inform your chef of any allergies or dietary restrictions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dish carousels by category */}
      <DishCarouselWithAddOns
        title="Appetizers"
        description="Start your meal with these flavorful options"
        items={indianDinner.filter((item) => item.name === "Vegetable Pakora")}
      />

      <DishCarouselWithAddOns
        title="Main Courses"
        description="Signature dishes crafted with authentic spices"
        items={indianDinner.filter((item) => item.name === "Chicken Biryani" || item.name === "Chicken Tandoori")}
      />

      <DishCarouselWithAddOns
        title="Sides"
        description="Perfect accompaniments to your main course"
        items={indianDinner.filter((item) => item.name === "Garlic Naan Bread")}
      />

      <DishCarouselWithAddOns
        title="Desserts"
        description="Sweet endings to your culinary journey"
        items={indianDinner.filter((item) => item.name === "Gulab Jamun")}
      />

      {/* Dynamic checkout button */}
      <DynamicCheckoutButton />
    </div>
  )
}
