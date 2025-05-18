"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { MenuItem } from "@/types"
import { useCart } from "@/hooks/use-cart"
import MenuItemModal from "./menu-item-modal"

interface MenuSectionProps {
  id: string
  title: string
  items: MenuItem[]
}

export default function MenuSection({ id, title, items }: MenuSectionProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const { addToCart } = useCart()

  return (
    <section id={id} className="scroll-mt-16">
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex cursor-pointer gap-3 rounded-lg border bg-white p-3 hover:shadow-md"
            onClick={() => setSelectedItem(item)}
          >
            <div className="flex-1">
              <h3 className="font-medium">{item.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-gray-600">{item.description}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-medium">${item.price.toFixed(2)}</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 rounded-full p-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    addToCart(item)
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {item.image && (
              <div className="h-24 w-24 overflow-hidden rounded-md">
                <img src={item.image || "/placeholder.svg"} alt={item.name} className="h-full w-full object-cover" />
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedItem && <MenuItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </section>
  )
}
