"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Check, Info } from "lucide-react"
import { useOrder } from "@/hooks/use-order"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import EnhancedImageCarousel from "./enhanced-image-carousel"

interface MenuItemDetailProps {
  item: {
    id: string
    name: string
    description: string
    price: number
    images: string[]
    details?: string
    dietaryInfo?: string[]
  }
}

export default function MenuItemDetail({ item }: MenuItemDetailProps) {
  const [isAdding, setIsAdding] = useState(false)
  const { addToOrder, items: orderItems } = useOrder()
  const { showToast } = useToast()
  const router = useRouter()

  // Check if this item is already in the order
  const isInOrder = orderItems.some((orderItem) => orderItem.id === item.id)

  const handleAddToOrder = () => {
    setIsAdding(true)

    // Simulate a small delay for better UX
    setTimeout(() => {
      addToOrder({
        ...item,
        quantity: 1,
      })

      setIsAdding(false)

      showToast(`${item.name} added to your order!`, "success", 3000, {
        label: "View Order",
        onClick: () => router.push("/checkout"),
      })
    }, 500)
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-md">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{item.name}</h2>
          <p className="mt-1 text-gray-600">{item.description}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="rounded-full bg-black px-3 py-1 text-sm font-medium text-white">
              ${item.price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Enhanced Image Carousel */}
        <EnhancedImageCarousel images={item.images} alt={item.name} className="mb-6" />

        {/* Item details */}
        {item.details && (
          <div className="mb-6">
            <h3 className="mb-2 text-lg font-semibold">Details</h3>
            <p className="text-gray-600">{item.details}</p>
          </div>
        )}

        {/* Dietary information */}
        {item.dietaryInfo && item.dietaryInfo.length > 0 && (
          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-500" />
              <div>
                <h4 className="font-medium">Dietary Information</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.dietaryInfo.map((info, index) => (
                    <span key={index} className="rounded-full bg-gray-200 px-3 py-1 text-xs">
                      {info}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add to order button */}
        <Button
          onClick={handleAddToOrder}
          className={`w-full transition-all duration-200 ${
            isInOrder ? "bg-green-600 hover:bg-green-700" : "bg-black hover:bg-black/90"
          }`}
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
    </div>
  )
}
