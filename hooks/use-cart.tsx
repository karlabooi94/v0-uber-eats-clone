"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { MenuItem } from "@/types"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

interface CartItem extends MenuItem {
  quantity?: number
  specialInstructions?: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  updateQuantity: (id: string, quantity: number) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  subtotal: number
  isLoading: boolean
  error: string | null
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Get toast context safely
  const toast = useToast()

  // Load cart from localStorage on mount and when user changes
  useEffect(() => {
    const loadCart = () => {
      setIsLoading(true)
      setError(null)

      try {
        console.log("Loading cart for user:", user?.id || "anonymous")

        // Try to load user-specific cart if logged in
        if (user) {
          const userCart = localStorage.getItem(`cart_${user.id}`)
          console.log("User cart from localStorage:", userCart)

          if (userCart) {
            const parsedCart = JSON.parse(userCart)
            console.log("Parsed user cart:", parsedCart)
            setItems(parsedCart)
            setIsLoading(false)
            return
          }
        }

        // Fall back to anonymous cart
        const anonymousCart = localStorage.getItem("cart")
        console.log("Anonymous cart from localStorage:", anonymousCart)

        if (anonymousCart) {
          const parsedCart = JSON.parse(anonymousCart)
          console.log("Parsed anonymous cart:", parsedCart)
          setItems(parsedCart)
        } else {
          // Initialize with empty array if no cart exists
          setItems([])
        }
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e)
        setError("Failed to load your cart. Please try refreshing the page.")

        toast.showToast("There was an issue loading your cart", "error")

        // Initialize with empty array on error
        setItems([])
      } finally {
        setIsLoading(false)
      }
    }

    loadCart()
  }, [user, toast])

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (isLoading) return // Don't save during initial load

    try {
      console.log("Saving cart:", items)

      // Save to user-specific cart if logged in
      if (user) {
        localStorage.setItem(`cart_${user.id}`, JSON.stringify(items))
      }

      // Always save to anonymous cart as well
      localStorage.setItem("cart", JSON.stringify(items))
    } catch (e) {
      console.error("Failed to save cart to localStorage", e)
      setError("Failed to save your cart. Please try again.")
    }
  }, [items, user, isLoading])

  const addToCart = useCallback((item: CartItem) => {
    console.log("Adding item to cart:", item)

    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id)

      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...prevItems]
        const existingItem = updatedItems[existingItemIndex]
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: (existingItem.quantity || 1) + (item.quantity || 1),
          specialInstructions: item.specialInstructions || existingItem.specialInstructions,
        }
        return updatedItems
      } else {
        // Add new item
        return [...prevItems, { ...item, quantity: item.quantity || 1 }]
      }
    })
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    console.log("Updating quantity for item:", id, "to", quantity)

    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }, [])

  const removeFromCart = useCallback((id: string) => {
    console.log("Removing item from cart:", id)

    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }, [])

  const clearCart = useCallback(() => {
    console.log("Clearing cart")

    setItems([])
  }, [])

  // Calculate subtotal with null checks
  const subtotal = items.reduce((sum, item) => {
    const price = item.price || item.basePrice || 0
    const quantity = item.quantity || 1
    return sum + price * quantity
  }, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        isLoading,
        error,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
