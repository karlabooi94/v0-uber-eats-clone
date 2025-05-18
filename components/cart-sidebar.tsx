"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Plus, Minus, Trash2, RefreshCw } from "lucide-react"
import type { Restaurant } from "@/types"
import { useCart } from "@/hooks/use-cart"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface CartSidebarProps {
  restaurant: Restaurant
}

export default function CartSidebar({ restaurant }: CartSidebarProps) {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal, isLoading, error } = useCart()
  const { showToast } = useToast()
  const [cartChecked, setCartChecked] = useState(false)
  const [cartRetryCount, setCartRetryCount] = useState(0)

  // Check if cart is empty but should have items
  useEffect(() => {
    if (!isLoading && items.length === 0 && !cartChecked && cartRetryCount < 3) {
      console.log("Cart sidebar: Cart appears empty, checking localStorage directly...")

      try {
        // Try to load cart directly from localStorage
        const storedCart = localStorage.getItem("cart")

        if (storedCart) {
          const parsedCart = JSON.parse(storedCart)
          console.log("Cart sidebar: Found cart in localStorage:", parsedCart)

          if (parsedCart && Array.isArray(parsedCart) && parsedCart.length > 0) {
            console.log("Cart sidebar: Cart has items but useCart reports empty")
            showToast("Please refresh the page to see your cart items", "info", 5000, {
              label: "Refresh",
              onClick: () => window.location.reload(),
            })
          }
        }
      } catch (e) {
        console.error("Cart sidebar: Error checking localStorage cart:", e)
      }

      setCartRetryCount((prev) => prev + 1)
      setCartChecked(true)
    }
  }, [isLoading, items, showToast, cartChecked, cartRetryCount])

  const handleRetryLoadCart = () => {
    window.location.reload()
  }

  if (isLoading) {
    return (
      <div className="sticky top-6 mt-8 w-full rounded-lg border bg-white p-6 shadow-sm lg:mt-0 lg:w-80">
        <div className="flex items-center justify-center gap-2 py-8 text-gray-500">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-black"></div>
          <p>Loading cart...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="sticky top-6 mt-8 w-full rounded-lg border bg-white p-6 shadow-sm lg:mt-0 lg:w-80">
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-gray-500">
          <p className="text-red-500">{error}</p>
          <Button onClick={handleRetryLoadCart} variant="outline" size="sm" className="mt-2">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="sticky top-6 mt-8 w-full rounded-lg border bg-white p-6 shadow-sm lg:mt-0 lg:w-80">
        <div className="flex items-center justify-center gap-2 py-8 text-gray-500">
          <ShoppingBag className="h-6 w-6" />
          <p>Your cart is empty</p>
        </div>
      </div>
    )
  }

  const deliveryFee = restaurant.deliveryFee
  const serviceFee = subtotal * 0.05 // 5% service fee
  const tax = subtotal * 0.12 // 12% tax
  const total = subtotal + deliveryFee + serviceFee + tax

  return (
    <div className="sticky top-6 mt-8 w-full rounded-lg border bg-white p-6 shadow-sm lg:mt-0 lg:w-80">
      <h3 className="mb-4 text-lg font-bold">Your order</h3>

      <div className="mb-4 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6 rounded-full p-0"
                onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-5 text-center text-sm">{item.quantity || 1}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6 rounded-full p-0"
                onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <div className="flex flex-1 justify-between">
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                {item.specialInstructions && <p className="text-xs text-gray-500">{item.specialInstructions}</p>}
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sm">
                  ${((item.price || item.basePrice || 0) * (item.quantity || 1)).toFixed(2)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full p-0 text-gray-400 hover:text-red-500"
                  onClick={() => removeFromCart(item.id)}
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
          <span>{deliveryFee === 0 ? "Free" : `$${deliveryFee.toFixed(2)}`}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span>Service Fee</span>
          <span>${serviceFee.toFixed(2)}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="mt-3 flex justify-between font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <Button asChild className="w-full bg-black text-white hover:bg-black/90">
        <Link href="/checkout">Go to checkout</Link>
      </Button>
    </div>
  )
}
