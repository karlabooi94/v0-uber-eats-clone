"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Check, Plus, Minus } from "lucide-react"
import { useOrder } from "@/hooks/use-order"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { MenuItemWithAddOns, AddOn } from "@/types/menu"

interface MenuItemWithAddOnsProps {
  item: MenuItemWithAddOns
  onClose?: () => void
  isModal?: boolean
}

export default function MenuItemWithAddOns({ item, onClose, isModal = false }: MenuItemWithAddOnsProps) {
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [activeTab, setActiveTab] = useState("included")
  const { addToOrder, items: orderItems } = useOrder()
  const { showToast } = useToast()
  const router = useRouter()

  // Calculate add-ons total price
  const addOnsTotal = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0)

  // Calculate price per item (base + selected add-ons)
  const pricePerItem = item.basePrice + addOnsTotal

  // Calculate total price based on quantity
  const totalPrice = pricePerItem * quantity

  // Check if this item is already in the order
  const isInOrder = orderItems.some((orderItem) => orderItem.id === item.id)

  // Toggle add-on selection
  const toggleAddOn = (addon: AddOn) => {
    setSelectedAddOns((prev) => {
      const isSelected = prev.some((a) => a.id === addon.id)
      if (isSelected) {
        return prev.filter((a) => a.id !== addon.id)
      } else {
        return [...prev, addon]
      }
    })
  }

  // Handle adding to order
  const handleAddToOrder = () => {
    setIsAdding(true)

    // Create a description that includes selected add-ons
    const addOnsDescription = selectedAddOns.length > 0 ? `With: ${selectedAddOns.map((a) => a.name).join(", ")}` : ""

    // Simulate a small delay for better UX
    setTimeout(() => {
      addToOrder({
        id: item.id,
        chefId: "dylan",
        name: item.name,
        description: item.description,
        image: item.images ? item.images[0] : item.image,
        appetizer: "",
        mainCourse: item.name,
        side: addOnsDescription,
        dessert: "",
        dietaryInfo: item.dietaryInfo || [],
        quantity: quantity,
        // Pass the base price and add-ons separately to prevent doubling
        basePrice: item.basePrice,
        addOnsPrice: addOnsTotal,
        // We'll use this in the cart to calculate the correct total
        addOns: selectedAddOns,
        specialInstructions: specialInstructions,
      })

      setIsAdding(false)

      showToast(`${item.name} added to your order!`, "success", 3000, {
        label: "View Order",
        onClick: () => router.push("/checkout"),
      })

      if (onClose) {
        onClose()
      }
    }, 500)
  }

  // Increment quantity
  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  // Decrement quantity
  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  return (
    <div className={`overflow-hidden rounded-lg border bg-white ${isModal ? "" : "shadow-md"}`}>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{item.name}</h2>
          <p className="mt-1 text-gray-600">{item.description}</p>

          {/* Only show base price if there are add-ons */}
          {item.addOns && item.addOns.length > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-lg font-medium">Base price: ${item.basePrice.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Image carousel */}
        <div className="mb-6 overflow-hidden rounded-lg">
          <OptimizedImage
            src={item.images ? item.images[0] : item.image || "/placeholder.svg?height=300&width=600&query=food"}
            alt={item.name}
            width={600}
            height={300}
            className="h-64 w-full object-cover"
          />
        </div>

        {/* Tabbed interface */}
        <Tabs defaultValue="included" value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
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

              {item.courses && (
                <div className="space-y-2">
                  {Object.entries(item.courses).map(([courseType, dishes]: [string, any]) => (
                    <div key={courseType}>
                      <h4 className="font-medium capitalize">{courseType}:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {dishes.map((dish: string, index: number) => (
                          <li key={index} className="text-gray-700">
                            {dish}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* What to Expect Tab */}
          <TabsContent value="expect" className="mt-4 space-y-4">
            <div>
              <h4 className="font-medium mb-1">Preparation:</h4>
              <p className="text-gray-700">
                {item.preparation ||
                  `Our chef will prepare this ${
                    item.category === "indian"
                      ? "authentic Indian"
                      : item.category === "cantonese"
                        ? "traditional Cantonese"
                        : "gourmet"
                  } meal fresh on the day of delivery. All ingredients are sourced from local suppliers where possible.`}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-1">Delivery:</h4>
              <p className="text-gray-700">
                Your order will be delivered in temperature-controlled containers to ensure optimal freshness.
                {item.category === "indian"
                  ? " Each dish is packaged separately to maintain its distinct flavors."
                  : item.category === "cantonese"
                    ? " All dishes are arranged for family-style serving."
                    : " Detailed heating and serving instructions are included."}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-1">Storage:</h4>
              <p className="text-gray-700">
                {item.storage ||
                  "For best results, consume within 24 hours of delivery. If needed, refrigerate promptly and consume within 2-3 days."}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-1">Reheating:</h4>
              <p className="text-gray-700">
                {item.reheating ||
                  `${
                    item.category === "indian"
                      ? "Microwave for 1-2 minutes or warm in a pan over medium heat."
                      : item.category === "cantonese"
                        ? "Steam for 3-5 minutes or microwave with a damp paper towel cover."
                        : "Follow the included heating instructions for best results."
                  }`}
              </p>
            </div>
          </TabsContent>

          {/* Customize Item Tab */}
          <TabsContent value="customize" className="mt-4 space-y-4">
            {/* Quantity selector */}
            <div>
              <h4 className="font-medium mb-2">Quantity:</h4>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="h-8 w-8 rounded-full"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="mx-3 w-8 text-center">{quantity}</span>
                <Button variant="outline" size="icon" onClick={incrementQuantity} className="h-8 w-8 rounded-full">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Add-ons section */}
            {item.addOns && item.addOns.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Add-ons:</h4>
                <div className="space-y-2">
                  {item.addOns.map((addon) => (
                    <div
                      key={addon.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id={`addon-${addon.id}`}
                          checked={selectedAddOns.some((a) => a.id === addon.id)}
                          onCheckedChange={() => toggleAddOn(addon)}
                        />
                        <div>
                          <Label htmlFor={`addon-${addon.id}`} className="font-medium cursor-pointer">
                            {addon.name}
                          </Label>
                          {addon.description && <p className="text-sm text-gray-500">{addon.description}</p>}
                        </div>
                      </div>
                      <span className="font-medium text-gray-900">+${addon.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Special instructions */}
            <div>
              <h4 className="font-medium mb-2">Special Instructions:</h4>
              <Textarea
                placeholder="Any special requests or dietary concerns?"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full"
                rows={3}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Total price and add to order button */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-2xl font-bold">
            Total: ${totalPrice.toFixed(2)}
            {selectedAddOns.length > 0 && (
              <div className="text-sm font-normal text-gray-500">
                Base: ${(item.basePrice * quantity).toFixed(2)} + Add-ons: ${(addOnsTotal * quantity).toFixed(2)}
              </div>
            )}
          </div>

          <Button
            onClick={handleAddToOrder}
            className={`transition-all duration-200 ${
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
                Update order
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
    </div>
  )
}
