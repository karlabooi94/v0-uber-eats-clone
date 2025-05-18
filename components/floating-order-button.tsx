"use client"

import { useOrder } from "@/hooks/use-order"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function FloatingOrderButton() {
  const { itemCount, subtotal } = useOrder()
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Only show when there are items in the order
    setIsVisible(itemCount > 0)

    // Animate when items are added
    if (itemCount > 0) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [itemCount])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 mx-auto w-full max-w-md px-4 md:hidden">
      <Button
        asChild
        className={`w-full justify-between rounded-full bg-black py-6 shadow-lg transition-all duration-300 ${
          isAnimating ? "scale-105" : ""
        }`}
      >
        <Link href="/checkout">
          <div className="flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" />
            <span>
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          </div>
          <span>${subtotal.toFixed(2)}</span>
        </Link>
      </Button>
    </div>
  )
}
