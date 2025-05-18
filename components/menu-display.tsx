"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Check, ChevronDown, ChevronUp } from "lucide-react"
import { useOrder } from "@/hooks/use-order"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image?: string
}

interface MenuDisplayProps {
  title: string
  items: MenuItem[]
  description?: string
}

export default function MenuDisplay({ title, items, description }: MenuDisplayProps) {
  const [expanded, setExpanded] = useState(false)
  const { addToCart, items: cartItems } = useOrder()
  const { showToast } = useToast()
  const router = useRouter()

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item)
    showToast(`${item.name} added to your cart!`, "success", 3000, {
      label: "View Cart",
      onClick: () => router.push("/checkout"),
    })
  }

  const isInCart = (id: string) => cartItems.some((item) => item.id === id)

  return (
    <div className="mb-8 rounded-lg border bg-white shadow-sm">
      <div className="flex cursor-pointer items-center justify-between p-6" onClick={() => setExpanded(!expanded)}>
        <h2 className="text-2xl font-bold">{title}</h2>
        <Button variant="ghost" size="sm" className="ml-2">
          {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </Button>
      </div>

      {description && (
        <div className="px-6 pb-4">
          <p className="text-gray-600">{description}</p>
        </div>
      )}

      <div className={`overflow-hidden transition-all duration-300 ${expanded ? "max-h-[2000px]" : "max-h-0"}`}>
        <div className="space-y-6 p-6 pt-0">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row md:items-center md:gap-6">
              {item.image && (
                <div className="mb-4 md:mb-0 md:w-1/4">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="h-48 w-full rounded-lg object-cover md:h-32"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="text-lg font-bold">{item.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">${item.price.toFixed(2)}</span>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(item)}
                      className={isInCart(item.id) ? "bg-green-600 hover:bg-green-700" : "bg-black hover:bg-black/90"}
                    >
                      {isInCart(item.id) ? (
                        <>
                          <Check className="mr-1 h-4 w-4" /> Added
                        </>
                      ) : (
                        <>
                          <PlusCircle className="mr-1 h-4 w-4" /> Add
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <p className="mt-1 text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
