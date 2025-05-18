"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, PlusCircle, Check, X } from "lucide-react"
import { useOrder } from "@/hooks/use-order"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import MenuItemDetail from "./menu-item-detail"

interface DishItem {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  details?: string
  dietaryInfo?: string[]
}

interface DishCarouselProps {
  title: string
  items: DishItem[]
  description?: string
}

export default function DishCarousel({ title, items, description }: DishCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { addToOrder, items: orderItems } = useOrder()
  const { showToast } = useToast()
  const router = useRouter()
  const [selectedItem, setSelectedItem] = useState<DishItem | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Check scroll possibilities on mount and when items change
  useEffect(() => {
    checkScroll()
    window.addEventListener("resize", checkScroll)
    return () => window.removeEventListener("resize", checkScroll)
  }, [items])

  // Check if scrolling is possible and update state
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth)
      setScrollProgress(scrollLeft / (scrollWidth - clientWidth))
    }
  }

  const handleAddToOrder = (item: DishItem) => {
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
      setTimeout(checkScroll, 300)
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" })
      setTimeout(checkScroll, 300)
    }
  }

  // Handle scroll events to update scroll indicators
  const handleScroll = () => {
    checkScroll()
  }

  return (
    <div className="mb-8 relative">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {description && <p className="mt-1 text-gray-600">{description}</p>}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className={`h-8 w-8 rounded-full transition-opacity ${canScrollLeft ? "opacity-100" : "opacity-50"}`}
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={`h-8 w-8 rounded-full transition-opacity ${canScrollRight ? "opacity-100" : "opacity-50"}`}
            onClick={scrollRight}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Scroll progress indicator */}
      <div className="h-1 w-full bg-gray-100 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-black transition-all duration-300 ease-out rounded-full"
          style={{ width: `${scrollProgress * 100}%` }}
        ></div>
      </div>

      {/* Scroll hint overlay - only shown if can scroll right */}
      {canScrollRight && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-full z-10 pointer-events-none bg-gradient-to-l from-white to-transparent flex items-center justify-end">
          <div className="animate-pulse mr-2 bg-white rounded-full p-1 shadow-md">
            <ChevronRight className="h-5 w-5 text-black" />
          </div>
        </div>
      )}

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        onScroll={handleScroll}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            className="flex-shrink-0 snap-start rounded-lg bg-white shadow-sm w-[280px] overflow-hidden"
          >
            {/* Main dish image with multiple image indicator */}
            <div className="relative aspect-square w-full overflow-hidden">
              <img src={item.images[0] || "/placeholder.svg"} alt={item.name} className="h-full w-full object-cover" />

              {/* Multiple images indicator */}
              {item.images.length > 1 && (
                <div className="absolute bottom-3 right-3 rounded-full bg-black/70 px-2 py-1 text-xs text-white">
                  {item.images.length} photos
                </div>
              )}

              {/* Image navigation dots */}
              {item.images.length > 1 && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
                  {item.images.map((_, idx) => (
                    <div key={idx} className="h-1.5 w-1.5 rounded-full bg-white/80" aria-hidden="true" />
                  ))}
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-bold">{item.name}</h3>
              <p className="mt-1 text-sm text-gray-600 line-clamp-2">{item.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-medium">${item.price.toFixed(2)}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setSelectedItem(item)} className="px-2 py-1 h-8">
                    View
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAddToOrder(item)}
                    className={`px-2 py-1 h-8 ${
                      isInOrder(item.id) ? "bg-green-600 hover:bg-green-700" : "bg-black hover:bg-black/90"
                    }`}
                  >
                    {isInOrder(item.id) ? (
                      <>
                        <Check className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <PlusCircle className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Item detail modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-auto rounded-lg bg-white">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-10 rounded-full bg-white/80 p-1"
              onClick={() => setSelectedItem(null)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
            <MenuItemDetail item={selectedItem} />
          </div>
        </div>
      )}
    </div>
  )
}
