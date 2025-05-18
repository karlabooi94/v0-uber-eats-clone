"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Check, X } from "lucide-react"
import type { MealOption } from "@/types"
import { useOrder } from "@/hooks/use-order"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import EnhancedImageCarousel from "./enhanced-image-carousel"
import { generateMealImages } from "@/utils/image-helpers"

interface MealOptionCardProps {
  meal: MealOption
}

export default function MealOptionCard({ meal }: MealOptionCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [showFullDetails, setShowFullDetails] = useState(false)
  const { addToOrder, items } = useOrder()
  const { showToast } = useToast()
  const router = useRouter()

  // Check if this meal is already in the order
  const isInOrder = items.some((item) => item.id === meal.id)

  // Check if this is the Indian meal option
  const isIndianMeal = meal.id === "d5"

  // Generate multiple images for the meal
  const mealImages = isIndianMeal
    ? [
        "/meals/indian-fusion.png",
        "/meals/chicken-biryani.png",
        "/meals/biryani-plate.png",
        "/indian-vegetable-pakora.png",
      ]
    : generateMealImages(meal.image || "", 3)

  const handleAddToOrder = () => {
    setIsAdding(true)

    // Simulate a small delay for better UX
    setTimeout(() => {
      addToOrder({
        ...meal,
        quantity: 1,
      })

      setIsAdding(false)

      showToast(`${meal.name} added to your order!`, "success", 3000, {
        label: "View Order",
        onClick: () => router.push("/checkout"),
      })
    }, 500)
  }

  // Helper function to format the meal description items
  const formatMealItem = (item: string) => {
    if (isIndianMeal) {
      // For Indian meal, the format is already stylized
      return item
    }
    return item
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="flex flex-col">
        {/* Enhanced Image Carousel */}
        <EnhancedImageCarousel images={mealImages} alt={meal.name} />

        <div className="flex flex-1 flex-col p-4">
          <div className="mb-4">
            <h3 className="text-xl font-bold">{meal.name}</h3>
            <p className="mt-1 text-gray-600">{meal.description}</p>
          </div>

          <div className="mt-auto flex items-center justify-between">
            <Button variant="ghost" onClick={() => setExpanded(!expanded)} className="text-sm underline">
              {expanded ? "Hide details" : "View full menu"}
            </Button>

            <Button
              onClick={handleAddToOrder}
              className={`transition-all duration-200 ${isInOrder ? "bg-green-600 hover:bg-green-700" : "bg-black hover:bg-black/90"}`}
              disabled={isAdding}
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
                  <Check className="mr-2 h-4 w-4" />
                  Added to order
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add to order
                </>
              )}
            </Button>
          </div>

          {expanded && (
            <div className="mt-4 border-t pt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium">Appetizer</h4>
                  <p className="text-sm text-gray-600">{formatMealItem(meal.appetizer)}</p>
                </div>
                <div>
                  <h4 className="font-medium">Main Course</h4>
                  <p className="text-sm text-gray-600">{formatMealItem(meal.mainCourse)}</p>
                </div>
                <div>
                  <h4 className="font-medium">Side</h4>
                  <p className="text-sm text-gray-600">{formatMealItem(meal.side)}</p>
                </div>
                <div>
                  <h4 className="font-medium">Dessert</h4>
                  <p className="text-sm text-gray-600">{formatMealItem(meal.dessert)}</p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium">Dietary Information</h4>
                <div className="mt-1 flex flex-wrap gap-2">
                  {meal.dietaryInfo.map((info, index) => (
                    <span key={index} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                      {info}
                    </span>
                  ))}
                </div>
              </div>

              {isIndianMeal && (
                <Button variant="outline" className="mt-4 w-full" onClick={() => setShowFullDetails(true)}>
                  View detailed images
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Full details modal */}
      {showFullDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-auto rounded-lg bg-white">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-10 rounded-full bg-white/80 p-1"
              onClick={() => setShowFullDetails(false)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>

            <div className="p-6">
              <h2 className="mb-4 text-2xl font-bold">{meal.name}</h2>
              <EnhancedImageCarousel images={mealImages} alt={meal.name} className="mb-6" />

              <p className="mb-6 text-gray-600">{meal.description}</p>

              <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold">What's Included</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <h4 className="font-medium">Appetizer</h4>
                    <p className="text-sm text-gray-600">{formatMealItem(meal.appetizer)}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <h4 className="font-medium">Main Course</h4>
                    <p className="text-sm text-gray-600">{formatMealItem(meal.mainCourse)}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <h4 className="font-medium">Side</h4>
                    <p className="text-sm text-gray-600">{formatMealItem(meal.side)}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <h4 className="font-medium">Dessert</h4>
                    <p className="text-sm text-gray-600">{formatMealItem(meal.dessert)}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium">Dietary Information</h4>
                <div className="mt-1 flex flex-wrap gap-2">
                  {meal.dietaryInfo.map((info, index) => (
                    <span key={index} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                      {info}
                    </span>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleAddToOrder}
                className={`w-full transition-all duration-200 ${
                  isInOrder ? "bg-green-600 hover:bg-green-700" : "bg-black hover:bg-black/90"
                }`}
                disabled={isAdding}
                size="lg"
              >
                {isInOrder ? "Added to order" : "Add to order - $80.00"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
