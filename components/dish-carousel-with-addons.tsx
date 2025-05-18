"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import DishCardWithAddOns from "./dish-card-with-addons"
import type { MenuItemWithAddOns } from "@/types/menu"

interface DishCarouselWithAddOnsProps {
  title: string
  items: MenuItemWithAddOns[]
  description?: string
}

export default function DishCarouselWithAddOns({ title, items, description }: DishCarouselWithAddOnsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
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
        {items.map((item) => (
          <DishCardWithAddOns key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
