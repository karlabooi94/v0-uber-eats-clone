"use client"
import Link from "next/link"
import type React from "react"

import { Button } from "@/components/ui/button"
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, AlertCircle, ChevronDown, ChevronUp } from "lucide-react"
import type { Chef } from "@/types"
import { useOrder } from "@/hooks/use-order"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

// Constants
const MINIMUM_PEOPLE = 2
const PRICE_PER_PERSON = 80

// Default menu items for 2 people
const DEFAULT_MENU_ITEMS = [
  {
    id: "vegetable-pakora",
    name: "Vegetable Pakora",
    description: "Chickpea Batter–Fried Seasonal Vegetables / Tangy Mint Chutney",
    price: 80,
    basePrice: 80,
    image: "/meals/vegetable-pakora-1.png",
    quantity: MINIMUM_PEOPLE,
    courseType: "appetizer",
  },
  {
    id: "chicken-biryani",
    name: "Chicken Biryani",
    description: "Basmati Rice / Aromatic Spice Blend / Saffron / Crispy Fried Onions",
    price: 80,
    basePrice: 80,
    image: "/meals/chicken-biryani-2.png",
    quantity: MINIMUM_PEOPLE,
    courseType: "main",
  },
  {
    id: "garlic-naan",
    name: "Garlic Naan Bread",
    description: "Leavened Flatbread / Roasted Garlic / Butter / Fresh Cilantro",
    price: 80,
    basePrice: 80,
    image: "/meals/garlic-naan-1.png",
    quantity: MINIMUM_PEOPLE,
    courseType: "side",
  },
  {
    id: "gulab-jamun",
    name: "Gulab Jamun",
    description: "Milk Dumplings / Rose-Scented Syrup / Cardamom / Pistachio Crush",
    price: 80,
    basePrice: 80,
    image: "/meals/gulab-jamun-1.png",
    quantity: MINIMUM_PEOPLE,
    courseType: "dessert",
  },
]

// Add initialPeopleCount prop to the component
interface OrderSidebarProps {
  chef: Chef
  initialPeopleCount?: number
  maxPeopleCount?: number
  pricePerPerson?: number
}

export default function OrderSidebar({
  chef,
  initialPeopleCount = MINIMUM_PEOPLE,
  maxPeopleCount = 8,
  pricePerPerson = PRICE_PER_PERSON,
}: OrderSidebarProps) {
  const { items, addToOrder, updateQuantity, removeFromOrder, clearOrder, subtotal } = useOrder()
  const { showToast } = useToast()
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [isIncompleteOrderDialogOpen, setIsIncompleteOrderDialogOpen] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  // Pre-fill cart with default items for initialPeopleCount people if empty
  useEffect(() => {
    if (!hasInitialized && items.length === 0) {
      // Add default menu items with the correct quantity
      DEFAULT_MENU_ITEMS.forEach((item) => {
        addToOrder({
          ...item,
          quantity: Math.max(initialPeopleCount, MINIMUM_PEOPLE),
        })
      })

      // Show a welcome toast
      showToast(
        `Welcome! We've pre-filled your cart with our Indian Fusion Experience for ${Math.max(initialPeopleCount, MINIMUM_PEOPLE)} people.`,
        "info",
        5000,
      )
      setHasInitialized(true)
    } else if (!hasInitialized) {
      // If there are already items in the cart, just mark as initialized
      setHasInitialized(true)
    }
  }, [items, addToOrder, showToast, hasInitialized, initialPeopleCount])

  // Ensure the UI reflects the current state of the order
  useEffect(() => {
    // Force a re-render when items change to ensure quantities are displayed correctly
    if (items.length > 0) {
      setIsUpdating(null)
    }
  }, [items])

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    setIsUpdating(id)

    // Enforce minimum quantity of 2 for each item
    if (newQuantity < MINIMUM_PEOPLE) {
      showToast(`Minimum order is for ${MINIMUM_PEOPLE} people`, "warning", 3000)
      setIsUpdating(null)
      return
    }

    // Update immediately to ensure UI is responsive
    updateQuantity(id, newQuantity)

    // Clear updating state after a short delay
    setTimeout(() => {
      setIsUpdating(null)
    }, 300)
  }

  const handleRemoveItem = (id: string, name: string) => {
    // Remove the item first
    removeFromOrder(id)
    showToast(`${name} removed from your order`, "info")

    // Then check if the order is now incomplete and show a warning if needed
    setTimeout(() => {
      if (!isOrderComplete()) {
        showToast("Your order is now incomplete. Please add all required courses.", "warning", 5000)
      }
    }, 300)
  }

  // Helper function to calculate item price
  const calculateItemPrice = (item: any) => {
    // If this is a customization, only charge for the add-ons
    if (item.isCustomization) {
      return (item.addOnsPrice || 0) * (item.quantity || 1)
    }

    // If the item has a basePrice (new format)
    if (item.basePrice !== undefined) {
      // Only add the add-on price if it exists
      const addOnsPrice = item.addOnsPrice || 0

      // If this is just a customization (not an extra item), we only charge for the add-ons
      // Otherwise, we charge the base price plus add-ons
      if (item.isExtraItem) {
        return (item.basePrice + addOnsPrice) * (item.quantity || MINIMUM_PEOPLE)
      } else {
        // For regular menu items, we charge per person but only once per course type
        // This ensures we don't multiply the price by the number of items
        return pricePerPerson
      }
    }

    // Fallback to the old format (fixed price per person)
    return pricePerPerson
  }

  // Check if order is complete (has all required courses)
  const isOrderComplete = () => {
    // Check if we have at least one of each course type
    const hasAppetizer = items.some((item) => item.courseType === "appetizer")
    const hasMain = items.some((item) => item.courseType === "main")
    const hasSide = items.some((item) => item.courseType === "side")
    const hasDessert = items.some((item) => item.courseType === "dessert")

    return hasAppetizer && hasMain && hasSide && hasDessert
  }

  // Handle checkout button click
  const handleCheckoutClick = (e: React.MouseEvent) => {
    if (!isOrderComplete()) {
      e.preventDefault()
      setIsIncompleteOrderDialogOpen(true)
    }
    // Otherwise, proceed to checkout normally
  }

  // Get the quantity of the main dish (assuming all items have the same quantity)
  const getMainQuantity = () => {
    if (items.length === 0) return MINIMUM_PEOPLE

    const mainItem = items.find((item) => item.courseType === "main" && !item.isCustomization)
    return mainItem ? Math.max(mainItem.quantity || MINIMUM_PEOPLE, MINIMUM_PEOPLE) : MINIMUM_PEOPLE
  }

  // Calculate total price for all items
  const calculateTotalPrice = () => {
    if (items.length === 0) return pricePerPerson * MINIMUM_PEOPLE

    // Get the current people count directly
    const currentPeopleCount = getMainQuantity()

    // For the standard meal package, we charge per person
    const standardMealPrice = pricePerPerson * currentPeopleCount

    // Add any extra items or customizations
    const extraItemsPrice = items
      .filter((item) => item.isCustomization || item.isExtraItem)
      .reduce((total, item) => {
        return total + calculateItemPrice(item)
      }, 0)

    return standardMealPrice + extraItemsPrice
  }

  // Handle clear order
  const handleClearOrder = () => {
    if (window.confirm("Are you sure you want to clear your order? This will remove all items.")) {
      clearOrder()
      showToast("Your order has been cleared", "info")
      // Reset initialization flag so cart will be pre-filled again
      setHasInitialized(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="sticky top-6 mt-8 w-full rounded-lg border bg-white p-6 shadow-sm lg:mt-0 lg:w-80">
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-gray-500">
          <ShoppingBag className="h-12 w-12 text-gray-300" />
          <p className="text-center text-gray-600">Preparing your order...</p>
          <p className="text-center text-sm text-gray-500">Loading Chef Dylan's Indian Fusion Experience</p>
        </div>
      </div>
    )
  }

  const deliveryFee = 0 // Included in the $80 per person price
  const serviceFee = 0 // Included in the $80 per person price
  const peopleCount = getMainQuantity()
  const mealSubtotal = calculateTotalPrice()
  const tax = mealSubtotal * 0.12 // 12% tax
  const total = mealSubtotal + tax

  return (
    <div className="sticky top-6 mt-8 w-full rounded-lg border bg-white p-6 shadow-sm lg:mt-0 lg:w-80">
      <h3 className="mb-4 text-lg font-bold">Your order from Chef Dylan</h3>

      <div className="mb-4 space-y-4">
        {/* Main Experience Package */}
        <div className="border-b pb-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Indian Fusion Experience</h4>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full p-0 text-gray-400 hover:text-red-500"
                  onClick={() => handleClearOrder()}
                  title="Remove all items"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-sm text-gray-500">Complete 4-course meal</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6 rounded-full p-0"
                onClick={() => {
                  // Update quantity for all items
                  const newQuantity = peopleCount - 1
                  if (newQuantity < MINIMUM_PEOPLE) {
                    showToast(`Minimum order is for ${MINIMUM_PEOPLE} people`, "warning", 3000)
                    return
                  }

                  items.forEach((item) => {
                    if (!item.isCustomization) {
                      updateQuantity(item.id, newQuantity)
                    }
                  })
                }}
                disabled={peopleCount <= MINIMUM_PEOPLE}
                title={
                  peopleCount <= MINIMUM_PEOPLE ? `Minimum order is for ${MINIMUM_PEOPLE} people` : "Decrease quantity"
                }
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-6 text-center text-sm font-medium">{peopleCount}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6 rounded-full p-0"
                onClick={() => {
                  // Update quantity for all items
                  const newQuantity = peopleCount + 1

                  // Check if we've reached the maximum number of people
                  if (newQuantity > maxPeopleCount) {
                    showToast(`Maximum order is for ${maxPeopleCount} people`, "warning", 3000)
                    return
                  }

                  // First update all existing non-customization items
                  items.forEach((item) => {
                    if (!item.isCustomization) {
                      updateQuantity(item.id, newQuantity)
                    }
                  })

                  // If we don't have all required courses, add the missing ones
                  const hasAppetizer = items.some((item) => item.courseType === "appetizer" && !item.isCustomization)
                  const hasMain = items.some((item) => item.courseType === "main" && !item.isCustomization)
                  const hasSide = items.some((item) => item.courseType === "side" && !item.isCustomization)
                  const hasDessert = items.some((item) => item.courseType === "dessert" && !item.isCustomization)

                  // Add any missing default items with the new quantity
                  DEFAULT_MENU_ITEMS.forEach((defaultItem) => {
                    if (
                      (defaultItem.courseType === "appetizer" && !hasAppetizer) ||
                      (defaultItem.courseType === "main" && !hasMain) ||
                      (defaultItem.courseType === "side" && !hasSide) ||
                      (defaultItem.courseType === "dessert" && !hasDessert)
                    ) {
                      addToOrder({
                        ...defaultItem,
                        quantity: newQuantity,
                      })
                    }
                  })

                  showToast(`Updated order for ${newQuantity} people`, "info", 2000)
                }}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <span className="text-sm font-medium">${calculateTotalPrice().toFixed(2)}</span>
          </div>

          {/* Toggle details button */}
          <Button
            variant="ghost"
            className="w-full mt-2 text-xs flex items-center justify-center text-gray-500 hover:text-gray-700"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? (
              <>
                Hide details <ChevronUp className="ml-1 h-3 w-3" />
              </>
            ) : (
              <>
                Show details <ChevronDown className="ml-1 h-3 w-3" />
              </>
            )}
          </Button>

          {/* Detailed items (only shown when expanded) */}
          {showDetails && (
            <div className="mt-3 pl-2 space-y-2 text-sm">
              {items
                .filter((item) => !item.isCustomization)
                .map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span className="text-gray-600">{item.name}</span>
                    <span className="text-gray-500">{item.quantity}x</span>
                  </div>
                ))}

              {/* Show customizations if any */}
              {items.some((item) => item.isCustomization || (item.addOns && item.addOns.length > 0)) && (
                <div className="mt-2 pt-2 border-t border-dashed">
                  <p className="text-xs font-medium text-gray-600 mb-1">Customizations:</p>
                  {items
                    .filter((item) => item.isCustomization || (item.addOns && item.addOns.length > 0))
                    .map((item) => (
                      <div key={`custom-${item.id}`} className="flex justify-between items-center">
                        <span className="text-gray-600 text-xs">
                          {item.isCustomization ? item.name : `${item.name} add-ons`}
                        </span>
                        <span className="text-gray-500 text-xs">
                          $
                          {item.isCustomization
                            ? (item.addOnsPrice || 0).toFixed(2)
                            : (item.addOnsPrice || 0).toFixed(2)}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mb-4 border-t border-dashed pt-4">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>${mealSubtotal.toFixed(2)}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span>Delivery Fee</span>
          <span>Included</span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span>Service Fee</span>
          <span>Included</span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span>Tax (12%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="mt-3 flex justify-between font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-3">
        <Button asChild className="w-full bg-black text-white hover:bg-black/90" onClick={handleCheckoutClick}>
          <Link href="/checkout" className="flex items-center justify-center">
            Proceed to checkout
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>

        <Button variant="outline" className="w-full text-sm" onClick={handleClearOrder}>
          Clear order
        </Button>
      </div>

      {/* Incomplete Order Dialog */}
      <Dialog open={isIncompleteOrderDialogOpen} onOpenChange={setIsIncompleteOrderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Your Order</DialogTitle>
            <DialogDescription>
              Your order must include all courses from the Indian Fusion Experience.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Your order is incomplete</p>
                <p className="text-sm text-gray-500 mt-1">
                  The Indian Fusion Experience includes an appetizer, main course, side, and dessert for a minimum of{" "}
                  {MINIMUM_PEOPLE} people.
                </p>
              </div>
            </div>

            <div className="rounded-lg border p-4 mt-4">
              <h4 className="font-medium mb-2">Required courses:</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${items.some((i) => i.courseType === "appetizer") ? "bg-green-500" : "bg-red-500"}`}
                  ></div>
                  <span>Appetizer (min. {MINIMUM_PEOPLE})</span>
                </li>
                <li className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${items.some((i) => i.courseType === "main") ? "bg-green-500" : "bg-red-500"}`}
                  ></div>
                  <span>Main Course (min. {MINIMUM_PEOPLE})</span>
                </li>
                <li className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${items.some((i) => i.courseType === "side") ? "bg-green-500" : "bg-red-500"}`}
                  ></div>
                  <span>Side (min. {MINIMUM_PEOPLE})</span>
                </li>
                <li className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${items.some((i) => i.courseType === "dessert") ? "bg-green-500" : "bg-red-500"}`}
                  ></div>
                  <span>Dessert (min. {MINIMUM_PEOPLE})</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsIncompleteOrderDialogOpen(false)}>
              Cancel
            </Button>
            <Button asChild>
              <Link href="/chefs/dylan-storey">Complete Your Order</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
