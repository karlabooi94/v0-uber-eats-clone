"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Minus, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useOrder } from "@/hooks/use-order"
import { EnhancedImageCarousel } from "./enhanced-image-carousel"
import type { MenuItemWithAddOns, OrderItem } from "@/types/menu"

interface DetailedMealViewProps {
  item: MenuItemWithAddOns
  chefId: string
  onClose?: () => void
  isModal?: boolean
}

export default function DetailedMealView({ item, chefId, onClose, isModal = false }: DetailedMealViewProps) {
  const router = useRouter()
  const { addItem, updateItem, items: orderItems } = useOrder()

  // Find if this item is already in the order
  const existingOrderItem = orderItems.find((orderItem) => orderItem.id === item.id)

  // State for quantity and selected add-ons
  const [quantity, setQuantity] = useState(existingOrderItem?.quantity || 1)
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(existingOrderItem?.selectedAddOns || [])
  const [specialInstructions, setSpecialInstructions] = useState(existingOrderItem?.specialInstructions || "")
  const [activeTab, setActiveTab] = useState("included")

  // Calculate total price
  const calculateTotalPrice = () => {
    let total = item.basePrice * quantity

    // Add the price of selected add-ons
    if (item.addOns) {
      item.addOns.forEach((addOn) => {
        if (selectedAddOns.includes(addOn.id)) {
          total += addOn.price * quantity
        }
      })
    }

    return total
  }

  // Handle add-on selection
  const handleAddOnToggle = (addOnId: string) => {
    setSelectedAddOns((prev) => {
      if (prev.includes(addOnId)) {
        return prev.filter((id) => id !== addOnId)
      } else {
        return [...prev, addOnId]
      }
    })
  }

  // Handle adding to order
  const handleAddToOrder = () => {
    const orderItem: OrderItem = {
      ...item,
      quantity,
      selectedAddOns,
      specialInstructions,
      totalPrice: calculateTotalPrice(),
    }

    if (existingOrderItem) {
      updateItem(orderItem)
    } else {
      addItem(orderItem)
    }

    // If in modal, close it after adding to order
    if (isModal && onClose) {
      onClose()
    } else {
      // Navigate back to the chef page
      router.push(`/chefs/${chefId}`)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    if (onClose) {
      onClose()
    } else {
      router.push(`/chefs/${chefId}`)
    }
  }

  // Get add-on details by ID
  const getAddOnById = (id: string) => {
    return item.addOns?.find((addOn) => addOn.id === id)
  }

  // Calculate add-ons total
  const calculateAddOnsTotal = () => {
    let total = 0
    selectedAddOns.forEach((addOnId) => {
      const addOn = getAddOnById(addOnId)
      if (addOn) {
        total += addOn.price * quantity
      }
    })
    return total
  }

  return (
    <div className="flex flex-col md:flex-row">
      {/* Left side - Images */}
      <div className="w-full md:w-1/2 p-4">
        <EnhancedImageCarousel images={item.images} />
      </div>

      {/* Right side - Details */}
      <div className="w-full md:w-1/2 p-4 space-y-6">
        {!isModal && (
          <div>
            <h1 className="text-2xl font-bold">{item.name}</h1>
            <p className="text-gray-600 mt-1">{item.description}</p>
          </div>
        )}

        {/* Tabbed interface */}
        <Tabs defaultValue="included" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="included">What's Included</TabsTrigger>
            <TabsTrigger value="expect">What to Expect</TabsTrigger>
            <TabsTrigger value="customize">Meal Edits</TabsTrigger>
          </TabsList>

          {/* What's Included Tab */}
          <TabsContent value="included" className="mt-4 space-y-4">
            <div>
              {item.ingredients && (
                <div className="mb-3">
                  <h4 className="font-medium mb-1">Ingredients:</h4>
                  <p className="text-gray-700">{item.ingredients}</p>
                </div>
              )}

              {item.serves && (
                <div className="mb-3">
                  <h4 className="font-medium mb-1">Serves:</h4>
                  <p className="text-gray-700">{item.serves} people</p>
                </div>
              )}

              {item.dietaryInfo && item.dietaryInfo.length > 0 && (
                <div className="mb-3">
                  <h4 className="font-medium mb-1">Dietary Information:</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.dietaryInfo.map((info, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        {info}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {item.courses ? (
                // For complete meals with courses
                <div className="space-y-3">
                  {Object.entries(item.courses).map(([courseType, dishes]) => (
                    <div key={courseType} className="space-y-1">
                      <h4 className="font-medium capitalize">{courseType}:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {dishes.map((dish, index) => (
                          <li key={index} className="text-gray-700">
                            {dish}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <p className="text-gray-700">Serves: {item.serves || 1} people</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* What to Expect Tab */}
          <TabsContent value="expect" className="mt-4 space-y-4">
            {/* Preparation */}
            <div>
              <h4 className="font-medium">Preparation:</h4>
              <p className="text-gray-700 mt-1">
                {item.preparation ||
                  `Our chef will prepare this ${
                    item.category === "indian"
                      ? "authentic Indian"
                      : item.category === "cantonese"
                        ? "traditional Cantonese"
                        : item.category === "bbq"
                          ? "classic BBQ"
                          : "gourmet"
                  } meal fresh on the day of delivery. All ingredients are sourced from local suppliers where possible.`}
              </p>
            </div>

            {/* Ingredients */}
            <div>
              <h4 className="font-medium">Ingredients:</h4>
              <p className="text-gray-700 mt-1">
                {item.ingredients ||
                  `We use only premium quality ingredients. ${
                    item.category === "indian"
                      ? "Our spices are imported directly from India to ensure authentic flavor."
                      : item.category === "cantonese"
                        ? "Our sauces are made in-house following traditional recipes."
                        : item.category === "bbq"
                          ? "Our meats are locally sourced and smoked using traditional methods."
                          : "All ingredients are carefully selected for freshness and quality."
                  }`}
              </p>
            </div>

            {/* Service */}
            <div>
              <h4 className="font-medium">Service:</h4>
              <p className="text-gray-700 mt-1">
                {item.service ||
                  `Your meal will be delivered in temperature-controlled containers to ensure optimal freshness. ${
                    item.category === "indian"
                      ? "Each dish is packaged separately to maintain its distinct flavors."
                      : item.category === "cantonese"
                        ? "All dishes are arranged for family-style serving."
                        : item.category === "bbq"
                          ? "The BBQ items come with heating instructions for the perfect finish."
                          : "Detailed heating and serving instructions are included."
                  }`}
              </p>
            </div>

            {/* Clean-up */}
            <div>
              <h4 className="font-medium">Clean-up:</h4>
              <p className="text-gray-700 mt-1">
                {item.cleanup ||
                  "All packaging is eco-friendly and either recyclable or biodegradable. Simply rinse and recycle according to your local guidelines."}
              </p>
            </div>
          </TabsContent>

          {/* Meal Edits Tab */}
          <TabsContent value="customize" className="mt-4 space-y-4">
            {/* Quantity selector */}
            <div>
              <h4 className="font-medium">Quantity:</h4>
              <div className="flex items-center mt-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="h-8 w-8"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="mx-3 w-8 text-center">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)} className="h-8 w-8">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Add-ons */}
            {item.addOns && item.addOns.length > 0 && (
              <div>
                <h4 className="font-medium">Add-ons:</h4>
                <div className="space-y-2 mt-2">
                  {item.addOns.map((addOn) => (
                    <div key={addOn.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`addon-${addOn.id}`}
                          checked={selectedAddOns.includes(addOn.id)}
                          onCheckedChange={() => handleAddOnToggle(addOn.id)}
                        />
                        <div>
                          <Label htmlFor={`addon-${addOn.id}`} className="font-medium cursor-pointer">
                            {addOn.name}
                          </Label>
                          <p className="text-sm text-gray-600">{addOn.description}</p>
                        </div>
                      </div>
                      <span className="font-medium">+${addOn.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Special instructions */}
            <div>
              <h4 className="font-medium">Special Instructions:</h4>
              <textarea
                className="w-full mt-2 p-3 border rounded-md h-24 resize-none"
                placeholder="Any special requests or dietary concerns?"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
              />
            </div>

            {/* Price breakdown */}
            <div className="bg-gray-50 p-4 rounded-md space-y-2">
              <div className="flex justify-between">
                <span>Base price:</span>
                <span>${(item.basePrice * quantity).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Add-ons:</span>
                <span>${calculateAddOnsTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>Total:</span>
                <span>${calculateTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action buttons */}
        <div className="flex gap-4">
          {/* Cancel button */}
          <Button variant="outline" className="w-1/3" onClick={handleCancel}>
            <X className="mr-2 h-5 w-5" />
            Cancel
          </Button>

          {/* Add to order button */}
          <Button className="w-2/3" onClick={handleAddToOrder}>
            <Check className="mr-2 h-5 w-5" />
            {existingOrderItem ? "Update order" : "Add to order"} • ${calculateTotalPrice().toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  )
}
