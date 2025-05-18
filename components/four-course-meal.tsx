"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { menuItems } from "@/data/menu-items"
import { useOrder } from "@/hooks/use-order"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Check, PlusCircle } from "lucide-react"

interface FourCourseMealProps {
  restaurantId: string
}

export default function FourCourseMeal({ restaurantId }: FourCourseMealProps) {
  const { addToOrder, items } = useOrder()
  const { showToast } = useToast()
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)

  // Get one item from each category for a 4-course meal
  const appetizer = menuItems.find((item) => item.restaurantId === restaurantId && item.category === "Appetizers")
  const mainCourse = menuItems.find((item) => item.restaurantId === restaurantId && item.category === "Main Dishes")
  const side = menuItems.find((item) => item.restaurantId === restaurantId && item.category === "Sides")
  const dessert = menuItems.find((item) => item.restaurantId === restaurantId && item.category === "Desserts")

  const courses = [
    { type: "Appetizer", item: appetizer },
    { type: "Main Course", item: mainCourse },
    { type: "Side", item: side },
    { type: "Dessert", item: dessert },
  ].filter((course) => course.item) // Filter out any undefined items

  const totalPrice = courses.reduce((sum, course) => sum + (course.item?.price || 0), 0)
  const discountedPrice = totalPrice * 0.85 // 15% discount

  // Check if any of the course items are already in the order
  const isAnyItemInOrder = courses.some(
    (course) => course.item && items.some((orderItem) => orderItem.id === course.item?.id),
  )

  const handleAddMealToCart = () => {
    setIsAdding(true)

    // Simulate a small delay for better UX
    setTimeout(() => {
      courses.forEach((course) => {
        if (course.item) {
          addToOrder({
            ...course.item,
            quantity: 1,
            specialInstructions: "Part of 4-course meal special",
          })
        }
      })

      setIsAdding(false)

      showToast("4-Course Meal added to your order!", "success", 3000, {
        label: "View Order",
        onClick: () => router.push("/checkout"),
      })
    }, 800)
  }

  return (
    <div id="four-course" className="scroll-mt-16">
      <div className="mb-4 rounded-lg bg-yellow-50 p-3 text-sm">
        <p className="font-medium text-yellow-800">Save 15% when you order our special 4-course meal!</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {courses.map((course, index) => (
          <div key={index} className="rounded-lg border bg-white p-3 shadow-sm">
            <div className="text-sm font-medium text-gray-500">{course.type}</div>
            <div className="mt-1 font-medium">{course.item?.name}</div>
            <div className="mt-2 text-sm text-gray-600">${course.item?.price.toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <div className="text-lg font-bold">
            ${discountedPrice.toFixed(2)}
            <span className="ml-2 text-sm font-normal text-gray-500 line-through">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="text-sm text-green-600">You save: ${(totalPrice - discountedPrice).toFixed(2)}</div>
        </div>

        <Button
          onClick={handleAddMealToCart}
          className={`transition-all duration-200 ${isAnyItemInOrder ? "bg-green-600 hover:bg-green-700" : "bg-black hover:bg-black/90"}`}
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
          ) : isAnyItemInOrder ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Update order
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add 4-Course Meal to Order
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
