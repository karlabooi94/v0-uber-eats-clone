"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { MealOption } from "@/types"
import type { AddOn } from "@/types/menu"

interface OrderItem extends MealOption {
  quantity?: number
  specialInstructions?: string
  basePrice?: number
  addOnsPrice?: number
  addOns?: AddOn[]
}

interface OrderContextType {
  items: OrderItem[]
  addToOrder: (item: OrderItem) => void
  updateQuantity: (id: string, quantity: number) => void
  removeFromOrder: (id: string) => void
  clearOrder: () => void
  subtotal: number
  itemCount: number
  hasItem: (id: string) => boolean
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export function OrderProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<OrderItem[]>([])

  // Load order from localStorage on mount
  useEffect(() => {
    const savedOrder = localStorage.getItem("order")
    if (savedOrder) {
      try {
        setItems(JSON.parse(savedOrder))
      } catch (e) {
        console.error("Failed to parse order from localStorage", e)
      }
    }
  }, [])

  // Save order to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("order", JSON.stringify(items))
  }, [items])

  const addToOrder = (item: OrderItem) => {
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
          // Update add-ons if provided
          addOns: item.addOns || existingItem.addOns,
          addOnsPrice: item.addOnsPrice || existingItem.addOnsPrice,
        }
        return updatedItems
      } else {
        // Add new item
        return [...prevItems, { ...item, quantity: item.quantity || 1 }]
      }
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const removeFromOrder = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const clearOrder = () => {
    setItems([])
  }

  const hasItem = (id: string) => {
    return items.some((item) => item.id === id)
  }

  // Calculate subtotal correctly based on base price, add-ons, and quantity
  const subtotal = items.reduce((sum, item) => {
    // If the item has a basePrice and addOnsPrice (new format)
    if (item.basePrice !== undefined) {
      const addOnsPrice = item.addOnsPrice || 0
      return sum + (item.basePrice + addOnsPrice) * (item.quantity || 1)
    }
    // Fallback to the old format (fixed $80 per person)
    return sum + 80 * (item.quantity || 1)
  }, 0)

  // Total number of items in the order
  const itemCount = items.reduce((count, item) => count + (item.quantity || 1), 0)

  return (
    <OrderContext.Provider
      value={{
        items,
        addToOrder,
        updateQuantity,
        removeFromOrder,
        clearOrder,
        subtotal,
        itemCount,
        hasItem,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export function useOrder() {
  const context = useContext(OrderContext)
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider")
  }
  return context
}
