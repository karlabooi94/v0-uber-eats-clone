"use client"

import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight, Plus, Check, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useOrder } from "@/hooks/use-order"
import { useToast } from "@/hooks/use-toast"
import type { MenuItemWithAddOns } from "@/types/menu"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface DishCarouselWithAddOnsProps {
  title: string
  description?: string
  items: MenuItemWithAddOns[]
}

export default function DishCarouselWithAddOns({ title, description, items }: DishCarouselWithAddOnsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, Record<string, number>>>({})
  const [selectedMainDishes, setSelectedMainDishes] = useState<Record<string, Record<string, number>>>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<MenuItemWithAddOns | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const { items: cartItems, addToOrder } = useOrder()
  const { showToast } = useToast()

  // Ensure we have valid items
  const validItems = Array.isArray(items) ? items : []

  // Check if an item is already in the cart
  const isInCart = (id: string) => cartItems.some((item) => item.id === id)

  // Handle next/previous slide
  const handleNext = () => {
    if (validItems.length <= 1) return
    setCurrentIndex((prevIndex) => (prevIndex + 1) % validItems.length)
  }

  const handlePrev = () => {
    if (validItems.length <= 1) return
    setCurrentIndex((prevIndex) => (prevIndex - 1 + validItems.length) % validItems.length)
  }

  // Open dialog with the selected item
  const openAddOnsDialog = (item: MenuItemWithAddOns) => {
    setCurrentItem(item)
    // Initialize selected add-ons for this item if not already done
    if (!selectedAddOns[item.id]) {
      setSelectedAddOns((prev) => ({ ...prev, [item.id]: {} }))
    }
    // Initialize selected main dishes for this item if not already done
    if (!selectedMainDishes[item.id]) {
      setSelectedMainDishes((prev) => ({ ...prev, [item.id]: {} }))
    }
    setIsDialogOpen(true)
  }

  // Update add-on quantity
  const updateAddOnQuantity = (itemId: string, addOnId: string, change: number) => {
    setSelectedAddOns((prev) => {
      const currentItemAddOns = prev[itemId] || {}
      const currentQuantity = currentItemAddOns[addOnId] || 0
      const newQuantity = Math.max(0, currentQuantity + change)

      return {
        ...prev,
        [itemId]: {
          ...currentItemAddOns,
          [addOnId]: newQuantity,
        },
      }
    })
  }

  // Update main dish quantity (for adding another main dish)
  const updateMainDishQuantity = (itemId: string, dishId: string, change: number) => {
    setSelectedMainDishes((prev) => {
      const currentMainDishes = prev[itemId] || {}
      const currentQuantity = currentMainDishes[dishId] || 0
      const newQuantity = Math.max(0, currentQuantity + change)

      return {
        ...prev,
        [itemId]: {
          ...currentMainDishes,
          [dishId]: newQuantity,
        },
      }
    })
  }

  // Calculate only the add-ons price
  const calculateAddOnsPrice = (item: MenuItemWithAddOns) => {
    if (!item) return 0

    let addOnsTotal = 0

    // Add selected add-ons prices with quantities
    const itemAddOns = selectedAddOns[item.id] || {}
    if (item.addOns) {
      item.addOns.forEach((addOn) => {
        const quantity = itemAddOns[addOn.id] || 0
        if (quantity > 0) {
          addOnsTotal += (addOn.price || 0) * quantity
        }
      })
    }

    return addOnsTotal
  }

  // Calculate price of additional main dishes
  const calculateMainDishesPrice = (item: MenuItemWithAddOns) => {
    if (!item) return 0

    let mainDishesTotal = 0

    // Add selected main dishes prices with quantities
    const mainDishes = selectedMainDishes[item.id] || {}

    // Find the matching dishes from the validItems array
    Object.entries(mainDishes).forEach(([dishId, quantity]) => {
      if (quantity > 0) {
        const dish = validItems.find((d) => d.id === dishId)
        if (dish) {
          mainDishesTotal += (dish.basePrice || 0) * quantity
        }
      }
    })

    return mainDishesTotal
  }

  // Calculate total price (add-ons + additional main dishes)
  const calculateTotalPrice = (item: MenuItemWithAddOns) => {
    if (!item) return 0
    return calculateAddOnsPrice(item) + calculateMainDishesPrice(item)
  }

  // Add item with selected add-ons to cart
  const handleAddToCart = (item: MenuItemWithAddOns) => {
    if (!item) return

    setIsAdding(true)

    try {
      // Get selected add-ons for this item with quantities
      const itemAddOns = selectedAddOns[item.id] || {}
      const selectedAddOnObjects = item.addOns
        ? item.addOns
            .filter((addOn) => (itemAddOns[addOn.id] || 0) > 0)
            .map((addOn) => ({
              ...addOn,
              quantity: itemAddOns[addOn.id] || 0,
            }))
        : []

      // Get selected main dishes with quantities
      const mainDishes = selectedMainDishes[item.id] || {}
      const selectedMainDishObjects = Object.entries(mainDishes)
        .filter(([_, quantity]) => quantity > 0)
        .map(([dishId, quantity]) => {
          const dish = validItems.find((d) => d.id === dishId)
          return {
            id: dishId,
            name: dish?.name || "Additional Dish",
            price: dish?.basePrice || 0,
            quantity,
            isMainDish: true,
          }
        })

      // Combine add-ons and main dishes
      const allAddOns = [...selectedAddOnObjects, ...selectedMainDishObjects]

      // Calculate total price
      const addOnsPrice = calculateAddOnsPrice(item)
      const mainDishesPrice = calculateMainDishesPrice(item)
      const totalPrice = item.basePrice + addOnsPrice + mainDishesPrice

      // Add to cart using the correct function from useOrder
      addToOrder({
        id: item.id,
        name: item.name,
        description: item.description,
        price: totalPrice,
        basePrice: item.basePrice,
        addOnsPrice: addOnsPrice + mainDishesPrice,
        image: item.images && item.images.length > 0 ? item.images[0] : "/diverse-food-spread.png",
        addOns: allAddOns,
        quantity: 1,
      })

      // Show success toast
      showToast(`${item.name} added to your cart!`, "success", 3000)

      // Close dialog if open
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error adding item to cart:", error)
      showToast("Failed to add item to cart. Please try again.", "error", 3000)
    } finally {
      setIsAdding(false)
    }
  }

  // Get the current item
  const currentDish = validItems[currentIndex] || null

  // Fallback for empty items
  if (validItems.length === 0) {
    return (
      <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold">{title}</h2>
        {description && <p className="mt-1 text-gray-600">{description}</p>}
        <div className="mt-4 flex h-64 items-center justify-center rounded-lg bg-gray-100">
          <p className="text-gray-500">No dishes available in this category</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-8 rounded-lg border bg-white shadow-sm">
      <div className="p-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        {description && <p className="mt-1 text-gray-600">{description}</p>}

        <div className="relative mt-4">
          {/* Navigation buttons */}
          {validItems.length > 2 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-md"
                aria-label="Previous dish"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-md"
                aria-label="Next dish"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Carousel container */}
          <div ref={carouselRef} className="overflow-hidden">
            {validItems.length === 2 ? (
              // Show two dishes side by side when there are exactly 2
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {validItems.map((dish) => (
                  <div key={dish.id} className="flex flex-col">
                    {/* Image */}
                    <div className="relative h-64 w-full overflow-hidden rounded-lg">
                      <OptimizedImage
                        src={
                          dish.images && dish.images.length > 0
                            ? dish.images[0]
                            : "/placeholder.svg?height=400&width=600&query=indian food dish"
                        }
                        alt={dish.name}
                        width={600}
                        height={400}
                        className="h-full w-full"
                        objectFit="cover"
                        fallbackSrc="/indian-food-dish.png"
                      />
                    </div>

                    {/* Dish info */}
                    <div className="mt-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold">{dish.name}</h3>
                          <p className="mt-1 text-gray-600">{dish.description}</p>

                          {/* Price display */}
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-lg font-semibold">
                              ${typeof dish.basePrice === "number" ? dish.basePrice.toFixed(2) : "0.00"}
                            </span>

                            {dish.dietaryInfo && dish.dietaryInfo.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {dish.dietaryInfo.map((info) => (
                                  <span
                                    key={info}
                                    className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-800"
                                  >
                                    {info}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Add to cart button */}
                        {dish.addOns && dish.addOns.length > 0 ? (
                          <Button
                            onClick={() => openAddOnsDialog(dish)}
                            className="ml-2 whitespace-nowrap"
                            disabled={isAdding}
                          >
                            <Plus className="mr-1 h-4 w-4" /> Customize
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleAddToCart(dish)}
                            className={`ml-2 whitespace-nowrap ${
                              isInCart(dish.id) ? "bg-green-600 hover:bg-green-700" : ""
                            }`}
                            disabled={isAdding}
                          >
                            {isInCart(dish.id) ? (
                              <>
                                <Check className="mr-1 h-4 w-4" /> Added
                              </>
                            ) : isAdding ? (
                              "Adding..."
                            ) : (
                              <>
                                <Plus className="mr-1 h-4 w-4" /> Add
                              </>
                            )}
                          </Button>
                        )}
                      </div>

                      {/* Additional dish details */}
                      {dish.details && (
                        <div className="mt-3 rounded-lg bg-gray-50 p-3">
                          <div className="flex items-start gap-2">
                            <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
                            <p className="text-sm text-gray-600">{dish.details}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Original carousel for 1 or 3+ items
              <div className="flex flex-col gap-4">
                {currentDish && (
                  <div key={currentDish.id} className="flex flex-col">
                    {/* Image */}
                    <div className="relative h-64 w-full overflow-hidden rounded-lg">
                      <OptimizedImage
                        src={
                          currentDish.images && currentDish.images.length > 0
                            ? currentDish.images[0]
                            : "/placeholder.svg?height=400&width=600&query=indian food dish"
                        }
                        alt={currentDish.name}
                        width={600}
                        height={400}
                        className="h-full w-full"
                        objectFit="cover"
                        fallbackSrc="/indian-food-dish.png"
                      />
                    </div>

                    {/* Dish info */}
                    <div className="mt-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold">{currentDish.name}</h3>
                          <p className="mt-1 text-gray-600">{currentDish.description}</p>

                          {/* Price display */}
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-lg font-semibold">
                              ${typeof currentDish.basePrice === "number" ? currentDish.basePrice.toFixed(2) : "0.00"}
                            </span>

                            {currentDish.dietaryInfo && currentDish.dietaryInfo.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {currentDish.dietaryInfo.map((info) => (
                                  <span
                                    key={info}
                                    className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-800"
                                  >
                                    {info}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Add to cart button */}
                        {currentDish.addOns && currentDish.addOns.length > 0 ? (
                          <Button
                            onClick={() => openAddOnsDialog(currentDish)}
                            className="ml-2 whitespace-nowrap"
                            disabled={isAdding}
                          >
                            <Plus className="mr-1 h-4 w-4" /> Customize
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleAddToCart(currentDish)}
                            className={`ml-2 whitespace-nowrap ${
                              isInCart(currentDish.id) ? "bg-green-600 hover:bg-green-700" : ""
                            }`}
                            disabled={isAdding}
                          >
                            {isInCart(currentDish.id) ? (
                              <>
                                <Check className="mr-1 h-4 w-4" /> Added
                              </>
                            ) : isAdding ? (
                              "Adding..."
                            ) : (
                              <>
                                <Plus className="mr-1 h-4 w-4" /> Add
                              </>
                            )}
                          </Button>
                        )}
                      </div>

                      {/* Additional dish details */}
                      {currentDish.details && (
                        <div className="mt-3 rounded-lg bg-gray-50 p-3">
                          <div className="flex items-start gap-2">
                            <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
                            <p className="text-sm text-gray-600">{currentDish.details}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pagination dots */}
          {validItems.length > 2 && (
            <div className="mt-4 flex justify-center gap-1">
              {validItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 w-2 rounded-full ${index === currentIndex ? "bg-black" : "bg-gray-300"}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add-ons dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{currentItem?.name}</DialogTitle>
            <DialogDescription>{currentItem?.description}</DialogDescription>
          </DialogHeader>

          {currentItem && currentItem.addOns && currentItem.addOns.length > 0 && (
            <div className="space-y-4 py-4">
              <h4 className="font-medium">Customize your dish:</h4>
              <div className="space-y-4">
                {currentItem.addOns.map((addOn) => {
                  const quantity = (selectedAddOns[currentItem.id] || {})[addOn.id] || 0
                  return (
                    <div key={addOn.id} className="flex items-center justify-between border-b pb-3">
                      <div className="flex-1">
                        <p className="font-medium">{addOn.name}</p>
                        {addOn.description && <p className="text-sm text-gray-500">{addOn.description}</p>}
                        <p className="text-sm font-medium mt-1">${addOn.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => updateAddOnQuantity(currentItem.id, addOn.id, -1)}
                          disabled={quantity === 0}
                          className={`h-8 w-8 flex items-center justify-center rounded-full border ${
                            quantity === 0
                              ? "border-gray-200 text-gray-300"
                              : "border-gray-300 text-gray-600 hover:bg-gray-100"
                          }`}
                          aria-label="Decrease quantity"
                        >
                          <span className="text-lg">-</span>
                        </button>
                        <span className="w-6 text-center">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateAddOnQuantity(currentItem.id, addOn.id, 1)}
                          className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
                          aria-label="Increase quantity"
                        >
                          <span className="text-lg">+</span>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Add another main dish section */}
              <div className="mt-6">
                <h4 className="font-medium mb-3">Add another main dish:</h4>
                <div className="space-y-4">
                  {validItems
                    .filter((dish) => dish.id !== currentItem.id) // Don't show the current dish
                    .map((dish) => {
                      const quantity = (selectedMainDishes[currentItem.id] || {})[dish.id] || 0
                      return (
                        <div key={dish.id} className="flex items-center justify-between border-b pb-3">
                          <div className="flex-1">
                            <p className="font-medium">{dish.name}</p>
                            {dish.description && (
                              <p className="text-sm text-gray-500 line-clamp-1">{dish.description}</p>
                            )}
                            <p className="text-sm font-medium mt-1">${(dish.basePrice || 0).toFixed(2)}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => updateMainDishQuantity(currentItem.id, dish.id, -1)}
                              disabled={quantity === 0}
                              className={`h-8 w-8 flex items-center justify-center rounded-full border ${
                                quantity === 0
                                  ? "border-gray-200 text-gray-300"
                                  : "border-gray-300 text-gray-600 hover:bg-gray-100"
                              }`}
                              aria-label="Decrease quantity"
                            >
                              <span className="text-lg">-</span>
                            </button>
                            <span className="w-6 text-center">{quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateMainDishQuantity(currentItem.id, dish.id, 1)}
                              className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
                              aria-label="Increase quantity"
                            >
                              <span className="text-lg">+</span>
                            </button>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <div>
                  <span className="font-medium">Base price:</span>
                  <span className="ml-2">${(currentItem?.basePrice || 0).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="font-medium">Additional cost:</span>
                <span className="text-lg font-bold text-green-600">${calculateTotalPrice(currentItem).toFixed(2)}</span>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    if (currentItem) {
                      // First check if all required add-ons are selected (if any)
                      const requiredAddOns = currentItem.addOns?.filter((addOn) => addOn.required) || []
                      const selectedAddOnIds = Object.keys(selectedAddOns[currentItem.id] || {}).filter(
                        (id) => (selectedAddOns[currentItem.id][id] || 0) > 0,
                      )

                      const missingRequired = requiredAddOns.filter((addOn) => !selectedAddOnIds.includes(addOn.id))

                      if (missingRequired.length > 0) {
                        showToast(
                          `Please select required add-ons: ${missingRequired.map((a) => a.name).join(", ")}`,
                          "error",
                          3000,
                        )
                        return
                      }

                      // All requirements met, add to cart
                      handleAddToCart(currentItem)
                    }
                  }}
                  className="w-full"
                  disabled={isAdding}
                >
                  {isAdding ? "Adding..." : "Add to Cart"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
