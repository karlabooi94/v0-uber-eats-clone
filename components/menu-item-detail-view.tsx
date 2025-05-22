"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import DishCarousel from "@/components/dish-carousel"
import { useOrder } from "@/hooks/use-order"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image?: string
  images?: string[]
  ingredients?: string[]
  nutritionalInfo?: {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
  }
  allergens?: string[]
  preparationTime?: number
  servingSize?: string
}

interface MenuItemDetailViewProps {
  item: MenuItem
  onBack: () => void
}

export default function MenuItemDetailView({ item, onBack }: MenuItemDetailViewProps) {
  const { addToCart, items: cartItems } = useOrder()
  const [quantity, setQuantity] = useState(1)

  const isInCart = cartItems.some((cartItem) => cartItem.id === item.id)

  const handleAddToCart = () => {
    addToCart({
      ...item,
      quantity,
    })
  }

  const images = item.images || (item.image ? [item.image] : [])

  return (
    <div className="animate-in fade-in duration-300">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to menu
      </Button>

      <div className="rounded-lg border bg-white shadow-sm">
        {images.length > 0 ? (
          <DishCarousel images={images} alt={item.name} className="h-64 w-full rounded-t-lg object-cover sm:h-80" />
        ) : (
          <div className="flex h-64 w-full items-center justify-center rounded-t-lg bg-gray-100 sm:h-80">
            <p className="text-gray-500">No image available</p>
          </div>
        )}

        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">{item.name}</h2>
            <span className="text-xl font-semibold">${item.price.toFixed(2)}</span>
          </div>

          <p className="mb-6 text-gray-600">{item.description}</p>

          {item.ingredients && item.ingredients.length > 0 && (
            <div className="mb-4">
              <h3 className="mb-2 text-lg font-semibold">Ingredients</h3>
              <ul className="list-inside list-disc space-y-1 text-gray-600">
                {item.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
          )}

          {item.allergens && item.allergens.length > 0 && (
            <div className="mb-4">
              <h3 className="mb-2 text-lg font-semibold">Allergens</h3>
              <div className="flex flex-wrap gap-2">
                {item.allergens.map((allergen, index) => (
                  <span key={index} className="rounded-full bg-red-50 px-3 py-1 text-xs text-red-600">
                    {allergen}
                  </span>
                ))}
              </div>
            </div>
          )}

          {item.nutritionalInfo && (
            <div className="mb-6">
              <h3 className="mb-2 text-lg font-semibold">Nutritional Information</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {item.nutritionalInfo.calories !== undefined && (
                  <div className="rounded-lg bg-gray-50 p-3 text-center">
                    <p className="text-lg font-semibold">{item.nutritionalInfo.calories}</p>
                    <p className="text-xs text-gray-500">Calories</p>
                  </div>
                )}
                {item.nutritionalInfo.protein !== undefined && (
                  <div className="rounded-lg bg-gray-50 p-3 text-center">
                    <p className="text-lg font-semibold">{item.nutritionalInfo.protein}g</p>
                    <p className="text-xs text-gray-500">Protein</p>
                  </div>
                )}
                {item.nutritionalInfo.carbs !== undefined && (
                  <div className="rounded-lg bg-gray-50 p-3 text-center">
                    <p className="text-lg font-semibold">{item.nutritionalInfo.carbs}g</p>
                    <p className="text-xs text-gray-500">Carbs</p>
                  </div>
                )}
                {item.nutritionalInfo.fat !== undefined && (
                  <div className="rounded-lg bg-gray-50 p-3 text-center">
                    <p className="text-lg font-semibold">{item.nutritionalInfo.fat}g</p>
                    <p className="text-xs text-gray-500">Fat</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-md border">
              <button
                className="px-3 py-2 text-gray-600 hover:bg-gray-50"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="px-3 py-2">{quantity}</span>
              <button className="px-3 py-2 text-gray-600 hover:bg-gray-50" onClick={() => setQuantity(quantity + 1)}>
                +
              </button>
            </div>

            <Button className="flex-1" onClick={handleAddToCart}>
              {isInCart ? "Update in Cart" : "Add to Cart"}
            </Button>
          </div>

          {item.preparationTime && (
            <p className="mt-4 text-sm text-gray-500">Preparation time: {item.preparationTime} minutes</p>
          )}

          {item.servingSize && <p className="mt-1 text-sm text-gray-500">Serving size: {item.servingSize}</p>}
        </div>
      </div>
    </div>
  )
}
