"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Minus, Info, Settings, Package } from "lucide-react"
import { OptimizedImage } from "@/components/ui/optimized-image"
import type { AddOn } from "@/types/menu"

interface TabbedMenuItemViewProps {
  item: {
    id: string
    name: string
    description?: string
    image: string
    basePrice: number
    ingredients?: string[]
    dietaryInfo?: string[]
    preparationMethod?: string
    servingSize?: string
    addOnOptions?: AddOn[]
    storageInstructions?: string
    reheatingInstructions?: string
    deliveryInfo?: string
  }
  onAddToCart: (item: any) => void
  onCancel: () => void
}

export function TabbedMenuItemView({ item, onAddToCart, onCancel }: TabbedMenuItemViewProps) {
  const [activeTab, setActiveTab] = useState("whats-included")
  const [quantity, setQuantity] = useState(1)
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([])
  const [specialInstructions, setSpecialInstructions] = useState("")

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return
    setQuantity(newQuantity)
  }

  const handleToggleAddOn = (addon: AddOn) => {
    setSelectedAddOns((prev) => {
      const exists = prev.some((a) => a.id === addon.id)
      if (exists) {
        return prev.filter((a) => a.id !== addon.id)
      } else {
        return [...prev, addon]
      }
    })
  }

  const calculateAddOnsPrice = () => {
    return selectedAddOns.reduce((sum, addon) => sum + (addon.price || 0), 0)
  }

  const calculateTotal = () => {
    const basePrice = item.basePrice || 0
    const addOnsPrice = calculateAddOnsPrice()
    return (basePrice + addOnsPrice) * quantity
  }

  const handleAddToCart = () => {
    const addOnsPrice = calculateAddOnsPrice()

    const cartItem = {
      ...item,
      quantity,
      addOns: selectedAddOns,
      addOnsPrice,
      specialInstructions: specialInstructions.trim() || undefined,
    }

    onAddToCart(cartItem)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{item.name}</h2>
        <Button variant="ghost" size="sm" onClick={onCancel} className="text-gray-500">
          Cancel
        </Button>
      </div>

      <div className="relative mb-6 rounded-lg overflow-hidden">
        <OptimizedImage
          src={item.image || "/placeholder.svg?height=300&width=600&query=food"}
          alt={item.name}
          width={600}
          height={300}
          className="w-full h-64 object-cover"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="whats-included" className="flex items-center">
            <Package className="mr-2 h-4 w-4" />
            <span>What's Included</span>
          </TabsTrigger>
          <TabsTrigger value="what-to-expect" className="flex items-center">
            <Info className="mr-2 h-4 w-4" />
            <span>What to Expect</span>
          </TabsTrigger>
          <TabsTrigger value="meal-edits" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Meal Edits</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="whats-included" className="mt-4 space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="text-gray-700">{item.description}</p>
          </div>

          {item.ingredients && item.ingredients.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Ingredients</h3>
              <ul className="list-disc pl-5 space-y-1">
                {item.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-gray-700">
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {item.servingSize && (
            <div>
              <h3 className="text-lg font-medium mb-2">Serving Size</h3>
              <p className="text-gray-700">{item.servingSize}</p>
            </div>
          )}

          {item.dietaryInfo && item.dietaryInfo.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Dietary Information</h3>
              <div className="flex flex-wrap gap-2">
                {item.dietaryInfo.map((info, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                    {info}
                  </span>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="what-to-expect" className="mt-4 space-y-4">
          {item.preparationMethod && (
            <div>
              <h3 className="text-lg font-medium mb-2">Preparation Method</h3>
              <p className="text-gray-700">{item.preparationMethod}</p>
            </div>
          )}

          {item.deliveryInfo && (
            <div>
              <h3 className="text-lg font-medium mb-2">Delivery Information</h3>
              <p className="text-gray-700">{item.deliveryInfo}</p>
            </div>
          )}

          {item.storageInstructions && (
            <div>
              <h3 className="text-lg font-medium mb-2">Storage Instructions</h3>
              <p className="text-gray-700">{item.storageInstructions}</p>
            </div>
          )}

          {item.reheatingInstructions && (
            <div>
              <h3 className="text-lg font-medium mb-2">Reheating Instructions</h3>
              <p className="text-gray-700">{item.reheatingInstructions}</p>
            </div>
          )}

          {!item.preparationMethod &&
            !item.deliveryInfo &&
            !item.storageInstructions &&
            !item.reheatingInstructions && (
              <div className="py-8 text-center text-gray-500">
                <p>No additional information available for this item.</p>
              </div>
            )}
        </TabsContent>

        <TabsContent value="meal-edits" className="mt-4 space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Quantity:</h3>
            <div className="flex items-center">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="mx-6 w-8 text-center text-lg">{quantity}</span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {item.addOnOptions && item.addOnOptions.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">Add-ons:</h3>
              <div className="space-y-4">
                {item.addOnOptions.map((addon) => (
                  <div key={addon.id} className="flex items-start space-x-3 border-b pb-3">
                    <Checkbox
                      id={`addon-${addon.id}`}
                      checked={selectedAddOns.some((a) => a.id === addon.id)}
                      onCheckedChange={() => handleToggleAddOn(addon)}
                      className="mt-1"
                    />
                    <div className="flex flex-1 justify-between">
                      <label
                        htmlFor={`addon-${addon.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        <div className="font-medium">{addon.name}</div>
                        <p className="text-sm text-gray-500 mt-1">{addon.description}</p>
                      </label>
                      <span className="text-sm font-medium">+${(addon.price || 0).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-medium mb-3">Special Instructions:</h3>
            <Textarea
              placeholder="Any special requests or dietary concerns?"
              className="w-full"
              rows={3}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
            />
          </div>

          <div className="rounded-md bg-gray-50 p-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Base price:</span>
              <span>${(item.basePrice || 0).toFixed(2)}</span>
            </div>
            {selectedAddOns.length > 0 && (
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Add-ons:</span>
                <span>${calculateAddOnsPrice().toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Quantity:</span>
              <span>×{quantity}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 pt-4 border-t">
        <Button onClick={handleAddToCart} className="w-full bg-black text-white hover:bg-black/90">
          Add to Order - ${calculateTotal().toFixed(2)}
        </Button>
      </div>
    </div>
  )
}
