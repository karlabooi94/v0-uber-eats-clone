"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Check, ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { useOrder } from "@/hooks/use-order"
import { toast } from "@/hooks/use-toast"

interface MenuItemModalProps {
  isOpen: boolean
  onClose: () => void
  item: any
}

export default function MenuItemModal({ isOpen, onClose, item }: MenuItemModalProps) {
  const [activeTab, setActiveTab] = useState("included")
  const [quantity, setQuantity] = useState(1)
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isAdding, setIsAdding] = useState(false)
  const { addToCart } = useOrder()

  // Handle image navigation
  const nextImage = () => {
    if (item.images && item.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % item.images.length)
    }
  }

  const prevImage = () => {
    if (item.images && item.images.length > 0) {
      setCurrentImageIndex((prev) => (prev === 0 ? item.images.length - 1 : prev - 1))
    }
  }

  // Handle add-on selection
  const toggleAddOn = (addonId: string) => {
    setSelectedAddOns((prev) => {
      if (prev.includes(addonId)) {
        return prev.filter((id) => id !== addonId)
      } else {
        return [...prev, addonId]
      }
    })
  }

  // Calculate total price
  const calculateTotal = () => {
    let total = (item.price || item.basePrice || 0) * quantity

    // Add selected add-ons
    if (item.addOns) {
      item.addOns.forEach((addon: any) => {
        if (selectedAddOns.includes(addon.id)) {
          total += addon.price * quantity
        }
      })
    }

    return total
  }

  // Handle add to cart
  const handleAddToCart = () => {
    setIsAdding(true)

    // Get selected add-ons objects
    const addOns = item.addOns ? item.addOns.filter((addon: any) => selectedAddOns.includes(addon.id)) : []

    // Create cart item
    const cartItem = {
      ...item,
      quantity,
      addOns,
      addOnsPrice: addOns.reduce((sum: number, addon: any) => sum + addon.price, 0),
      specialInstructions,
    }

    // Add to cart
    setTimeout(() => {
      addToCart(cartItem)
      setIsAdding(false)
      onClose()
      toast.success(`${item.name} added to your order!`)
    }, 500)
  }

  if (!item) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="p-4 md:p-6">
          <DialogTitle className="text-xl md:text-2xl">{item.name}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Image carousel */}
          <div className="relative">
            <div className="relative h-64 md:h-80 w-full">
              <OptimizedImage
                src={
                  item.images && item.images.length > 0
                    ? item.images[currentImageIndex]
                    : item.image || "/placeholder.svg?height=320&width=480&query=food"
                }
                alt={item.name}
                width={480}
                height={320}
                className="w-full h-full object-cover"
              />

              {/* Image navigation buttons */}
              {item.images && item.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  {/* Image counter */}
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    {currentImageIndex + 1} / {item.images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail navigation */}
            {item.images && item.images.length > 1 && (
              <div className="flex gap-2 mt-2 px-4">
                {item.images.map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-16 w-16 overflow-hidden rounded-md border-2 ${
                      index === currentImageIndex ? "border-black" : "border-transparent"
                    }`}
                  >
                    <OptimizedImage
                      src={img}
                      alt={`${item.name} thumbnail ${index + 1}`}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item details and tabs */}
          <div className="p-4 md:p-6 pt-0 md:pt-6">
            <p className="text-gray-700 mb-4">{item.description}</p>
            <p className="text-lg font-semibold mb-4">${(item.price || item.basePrice || 0).toFixed(2)}</p>

            <Tabs defaultValue="included" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="included">What's Included</TabsTrigger>
                <TabsTrigger value="expect">What to Expect</TabsTrigger>
                <TabsTrigger value="customize">Meal Edits</TabsTrigger>
              </TabsList>

              {/* What's Included Tab */}
              <TabsContent value="included" className="space-y-4">
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
                        {item.dietaryInfo.map((info: string, index: number) => (
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
              <TabsContent value="expect" className="space-y-4">
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

              {/* Meal Edits Tab */}
              <TabsContent value="customize" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Quantity:</h4>
                  <div className="flex items-center">
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

                {item.addOns && item.addOns.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Add-ons:</h4>
                    <div className="space-y-2">
                      {item.addOns.map((addon: any) => (
                        <div key={addon.id} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`addon-${addon.id}`}
                              checked={selectedAddOns.includes(addon.id)}
                              onCheckedChange={() => toggleAddOn(addon.id)}
                            />
                            <div>
                              <Label htmlFor={`addon-${addon.id}`} className="font-medium cursor-pointer">
                                {addon.name}
                              </Label>
                              {addon.description && <p className="text-sm text-gray-600">{addon.description}</p>}
                            </div>
                          </div>
                          <span className="font-medium">+${addon.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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

            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Total:</span>
                <span className="font-bold text-lg">${calculateTotal().toFixed(2)}</span>
              </div>

              <Button className="w-full bg-black hover:bg-black/90" onClick={handleAddToCart} disabled={isAdding}>
                {isAdding ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Adding to cart...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Check className="mr-2 h-5 w-5" />
                    Add to cart
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
