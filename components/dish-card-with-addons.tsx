"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { normalizeImagePath } from "@/utils/image-utils"
import { useOrder } from "@/hooks/use-order"
import { Plus, Minus } from "lucide-react"

interface Addon {
  id: string
  name: string
  price: number | undefined
}

interface DishCardWithAddOnsProps {
  id: string
  name: string
  description: string
  price: number | undefined
  image: string
  addons?: Addon[]
}

export default function DishCardWithAddOns({
  id,
  name,
  description,
  price = 0, // Default to 0 if undefined
  image,
  addons = [],
}: DishCardWithAddOnsProps) {
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)
  const { addToOrder } = useOrder()

  // Ensure price is a number
  const safePrice = typeof price === "number" ? price : 0

  const handleAddonChange = (addonId: string, checked: boolean) => {
    if (checked) {
      setSelectedAddons([...selectedAddons, addonId])
    } else {
      setSelectedAddons(selectedAddons.filter((id) => id !== addonId))
    }
  }

  const handleAddToOrder = () => {
    const selectedAddonItems = addons.filter((addon) => selectedAddons.includes(addon.id))

    // Calculate add-ons total safely
    const addonsTotal = selectedAddonItems.reduce((sum, addon) => {
      const addonPrice = typeof addon.price === "number" ? addon.price : 0
      return sum + addonPrice
    }, 0)

    addToOrder({
      id,
      name,
      price: safePrice,
      image: normalizeImagePath(image),
      quantity,
      addons: selectedAddonItems,
      totalPrice: safePrice + addonsTotal,
    })
  }

  const incrementQuantity = () => setQuantity(quantity + 1)
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  // Calculate total price safely
  const totalPrice = (() => {
    const addonsTotal = addons
      .filter((addon) => selectedAddons.includes(addon.id))
      .reduce((sum, addon) => {
        const addonPrice = typeof addon.price === "number" ? addon.price : 0
        return sum + addonPrice
      }, 0)

    return (safePrice + addonsTotal) * quantity
  })()

  // Use a fallback image if the provided image is missing
  const imageSrc = image || `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(name)}`

  // Helper function to safely format prices
  const formatPrice = (value: number | undefined) => {
    if (typeof value !== "number") return "0.00"
    return value.toFixed(2)
  }

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative overflow-hidden">
        <OptimizedImage
          src={normalizeImagePath(imageSrc)}
          alt={name}
          width={600}
          height={400}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          fallbackSrc={`/placeholder.svg?height=400&width=600&query=${encodeURIComponent(name)}`}
        />
      </div>
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-gray-600 mt-1">{description}</p>
          <p className="text-lg font-semibold mt-2">${formatPrice(safePrice)}</p>
        </div>

        {addons.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium mb-2">Add-ons:</h4>
            <div className="space-y-2">
              {addons.map((addon) => (
                <div key={addon.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`addon-${addon.id}`}
                    checked={selectedAddons.includes(addon.id)}
                    onCheckedChange={(checked) => handleAddonChange(addon.id, checked === true)}
                  />
                  <label
                    htmlFor={`addon-${addon.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {addon.name} (+${formatPrice(addon.price)})
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
              <span className="sr-only">Decrease quantity</span>
            </Button>
            <span className="w-8 text-center">{quantity}</span>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={incrementQuantity}>
              <Plus className="h-4 w-4" />
              <span className="sr-only">Increase quantity</span>
            </Button>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">${formatPrice(totalPrice)}</div>
            <Button onClick={handleAddToOrder} className="mt-2">
              Add to Order
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
