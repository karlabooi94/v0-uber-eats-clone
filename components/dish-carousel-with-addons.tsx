"use client"

import { useRef } from "react"
import type { MenuItem } from "@/types"
import DishCardWithAddOns from "./dish-card-with-addons"

interface DishCarouselWithAddOnsProps {
  title: string
  description: string
  items: MenuItem[]
  onDishSelect?: (dish: MenuItem) => void
}

export default function DishCarouselWithAddOns({
  title,
  description,
  items,
  onDishSelect,
}: DishCarouselWithAddOnsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -280,
        behavior: "smooth",
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 280,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="mb-12">
      <div className="mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>

      <div className="relative">
        <div ref={scrollContainerRef} className="flex space-x-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
          {items.map((item) => (
            <div key={item.id} className="min-w-[280px] max-w-[280px] snap-start">
              <DishCardWithAddOns item={item} onDishSelect={onDishSelect} />
            </div>
          ))}
        </div>

        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
