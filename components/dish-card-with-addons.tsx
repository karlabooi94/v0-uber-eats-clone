"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useOrder } from "@/hooks/use-order"
import type { MenuItem } from "@/types/menu"
import { Plus, Minus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DishCardWithAddonsProps {
  item: MenuItem
  onDishSelect?: (dish: MenuItem) => void
}

export default function DishCardWithAddons({ item, onDishSelect }: DishCardWithAddonsProps) {
  const { addItem } = useOrder()
  const { toast } = useToast()
  const [quantity, setQuantity] = useState(1)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const handleAddToCart = () => {
    // Ensure item has a valid price before adding to cart
    const validItem = {
      ...item,
      price: typeof item.price === "number" ? item.price : 0,
      quantity,
    }
    addItem(validItem)
    toast({
      title: "Added to cart",
      description: `${quantity} × ${item.name} added to your order`,
    })
  }

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  return (
    <>
      <div className="group relative flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md">
        <div className="relative h-48 overflow-hidden">
          <img
            src={item.image || "/placeholder.svg?height=300&width=400&query=food"}
            alt={item.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          {item.dietaryInfo && item.dietaryInfo.length > 0 && (
            <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
              {item.dietaryInfo.map((info, index) => (
                <span
                  key={index}
                  className="rounded-full bg-black/70 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm"
                >
                  {info}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="mb-2 flex items-start justify-between">
            <h3 className="font-medium">{item.name}</h3>
            <span className="font-semibold">${typeof item.price === "number" ? item.price.toFixed(2) : "0.00"}</span>
          </div>
          <p className="mb-4 text-sm text-gray-600 line-clamp-2">{item.description}</p>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center rounded-md border">
              <button
                onClick={decrementQuantity}
                className="flex h-8 w-8 items-center justify-center rounded-l-md border-r text-gray-600 hover:bg-gray-50"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="flex h-8 w-8 items-center justify-center text-sm">{quantity}</span>
              <button
                onClick={incrementQuantity}
                className="flex h-8 w-8 items-center justify-center rounded-r-md border-l text-gray-600 hover:bg-gray-50"
                aria-label="Increase quantity"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <div className="flex gap-2">
              {onDishSelect && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onDishSelect(item)
                  }}
                  className="flex items-center gap-1"
                >
                  <span>View Details</span>
                </Button>
              )}
              <Button size="sm" onClick={handleAddToCart}>
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed View Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{item.name}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="overflow-hidden rounded-lg">
                <img
                  src={item.image || "/placeholder.svg?height=400&width=600&query=food"}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {item.additionalImages && item.additionalImages.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {item.additionalImages.map((img, idx) => (
                    <div key={idx} className="overflow-hidden rounded-md">
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`${item.name} view ${idx + 1}`}
                        className="h-20 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Tabs defaultValue="details">
                <TabsList className="w-full">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                  <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Description</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>

                  {item.dietaryInfo && item.dietaryInfo.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium">Dietary Information</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {item.dietaryInfo.map((info, index) => (
                          <span key={index} className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                            {info}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.allergens && item.allergens.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium">Allergens</h3>
                      <p className="text-gray-600">{item.allergens.join(", ")}</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="ingredients">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Ingredients</h3>
                    {item.ingredients ? (
                      <ul className="list-inside list-disc space-y-1 text-gray-600">
                        {item.ingredients.map((ingredient, idx) => (
                          <li key={idx}>{ingredient}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">Ingredient information not available.</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="nutrition">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Nutrition Facts</h3>
                    {item.nutritionFacts ? (
                      <div className="space-y-2">
                        {Object.entries(item.nutritionFacts).map(([key, value]) => (
                          <div key={key} className="flex justify-between border-b pb-1">
                            <span className="capitalize">{key}</span>
                            <span>{value}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">Nutrition information not available.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center rounded-md border">
                  <button
                    onClick={decrementQuantity}
                    className="flex h-10 w-10 items-center justify-center rounded-l-md border-r text-gray-600 hover:bg-gray-50"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="flex h-10 w-10 items-center justify-center text-sm">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    className="flex h-10 w-10 items-center justify-center rounded-r-md border-l text-gray-600 hover:bg-gray-50"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-xl font-bold">
                  ${(typeof item.price === "number" ? item.price * quantity : 0).toFixed(2)}
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  handleAddToCart()
                  setIsDetailOpen(false)
                }}
              >
                Add to Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
