"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react"
import type { Chef } from "@/types"
import { useOrder } from "@/hooks/use-order"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

interface OrderSidebarProps {
  chef: Chef
}

export default function OrderSidebar({ chef }: OrderSidebarProps) {
  const { items, updateQuantity, removeFromOrder, clearOrder, subtotal } = useOrder()
  const { showToast } = useToast()
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    setIsUpdating(id)

    // Simulate a small delay for better UX
    setTimeout(() => {
      if (newQuantity <= 0) {
        // If quantity is 0 or less, remove the item completely
        const itemToRemove = items.find((item) => item.id === id)
        if (itemToRemove) {
          removeFromOrder(id)
          showToast(`${itemToRemove.name} removed from your order`, "info")
        }
      } else {
        // Otherwise update the quantity
        updateQuantity(id, newQuantity)
      }
      setIsUpdating(null)
    }, 300)
  }

  const handleRemoveItem = (id: string, name: string) => {
    removeFromOrder(id)
    showToast(`${name} removed from your order`, "info")
  }

  // Helper function to calculate item price
  const calculateItemPrice = (item: any) => {
    // If the item has a basePrice (new format)
    if (item.basePrice !== undefined) {
      const basePrice = item.basePrice
      const addOnsPrice = item.addOnsPrice || 0
      return (basePrice + addOnsPrice) * (item.quantity || 1)
    }
    // Fallback to the old format (fixed $80 per person)
    return 80 * (item.quantity || 1)
  }

  if (items.length === 0) {
    return (
      <div className="sticky top-6 mt-8 w-full rounded-lg border bg-white p-6 shadow-sm lg:mt-0 lg:w-80">
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-gray-500">
          <ShoppingBag className="h-12 w-12 text-gray-300" />
          <p className="text-center text-gray-600">Your order is empty</p>
          <p className="text-center text-sm text-gray-500">Add a meal from Chef Dylan's menu to get started</p>
        </div>
      </div>
    )
  }

  const deliveryFee = 0 // Included in the $80 per person price
  const serviceFee = 0 // Included in the $80 per person price
  const tax = subtotal * 0.12 // 12% tax
  const total = subtotal + tax

  return (
    <div className="sticky top-6 mt-8 w-full rounded-lg border bg-white p-6 shadow-sm lg:mt-0 lg:w-80">
      <h3 className="mb-4 text-lg font-bold">Your order from Chef Dylan</h3>

      <div className="mb-4 max-h-[50vh] space-y-4 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 border-b pb-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6 rounded-full p-0"
                onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) - 1)}
                disabled={isUpdating === item.id}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-5 text-center text-sm">
                {isUpdating === item.id ? (
                  <span className="inline-block h-4 w-4 animate-pulse rounded-full bg-gray-200"></span>
                ) : (
                  item.quantity || 1
                )}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6 rounded-full p-0"
                onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                disabled={isUpdating === item.id}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <div className="flex flex-1 justify-between">
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                {/* Display base price and add-ons if available */}
                {item.basePrice !== undefined ? (
                  <div className="text-xs text-gray-500">
                    ${item.basePrice.toFixed(2)}
                    {item.addOnsPrice && item.addOnsPrice > 0 && <span> + ${item.addOnsPrice.toFixed(2)} add-ons</span>}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">$80 per person</p>
                )}
                {/* Display add-ons if any */}
                {item.addOns && item.addOns.length > 0 && (
                  <p className="text-xs text-gray-500 italic">
                    With: {item.addOns.map((addon) => addon.name).join(", ")}
                  </p>
                )}
                {item.specialInstructions && <p className="text-xs text-gray-500">{item.specialInstructions}</p>}
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sm">${calculateItemPrice(item).toFixed(2)}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full p-0 text-gray-400 hover:text-red-500"
                  onClick={() => handleRemoveItem(item.id, item.name)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4 border-t border-dashed pt-4">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
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
        <Button asChild className="w-full bg-black text-white hover:bg-black/90">
          <Link href="/checkout" className="flex items-center justify-center">
            Proceed to checkout
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>

        <Button
          variant="outline"
          className="w-full text-sm"
          onClick={() => {
            clearOrder()
            showToast("Your order has been cleared", "info")
          }}
        >
          Clear order
        </Button>
      </div>
    </div>
  )
}
