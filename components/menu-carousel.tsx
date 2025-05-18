"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, PlusCircle, Check } from "lucide-react"
import { useOrder } from "@/hooks/use-order"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import ImageCarousel from "./image-carousel"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  images: string[]
}

interface MenuCarouselProps {
  title: string
  items: MenuItem[]
  description?: string
}

export default function MenuCarousel({ title, items, description }: MenuCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { addToOrder, items: orderItems } = useOrder()
  const { showToast } = useToast()
  const router = useRouter()

  const handleAddToOrder = (item: MenuItem) => {
    addToOrder({
      ...item,
      quantity: 1,
    })
    showToast(`${item.name} added to your order!`, "success", 3000, {
      label: "View Order",
      onClick: () => router.push("/checkout"),
    })
  }

  const isInOrder = (id: string) => orderItems.some((item) => item.id === id)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {description && <p className="mt-1 text-gray-600">{description}</p>}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={scrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={scrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div ref={scrollContainerRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 snap-start rounded-lg bg-white shadow-sm w-[280px] overflow-hidden"
          >
            <ImageCarousel images={item.images} alt={item.name} aspectRatio="square" />
            <div className="p-4">
              <h3 className="font-bold">{item.name}</h3>
              <p className="mt-1 text-sm text-gray-600 line-clamp-2">{item.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-medium">${item.price.toFixed(2)}</span>
                <Button
                  size="sm"
                  onClick={() => handleAddToOrder(item)}
                  className={isInOrder(item.id) ? "bg-green-600 hover:bg-green-700" : "bg-black hover:bg-black/90"}
                >
                  {isInOrder(item.id) ? (
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
          </div>
        ))}
      </div>
    </div>
  )
}
