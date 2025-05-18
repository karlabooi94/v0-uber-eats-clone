"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export default function RestaurantFilters() {
  const [sortBy, setSortBy] = useState("recommended")

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center rounded-full border bg-white px-4 py-2">
        <span className="mr-2 text-sm font-medium">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="appearance-none bg-transparent text-sm focus:outline-none"
        >
          <option value="recommended">Recommended</option>
          <option value="rating">Highest Rated</option>
          <option value="delivery-time">Delivery Time</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
        <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
      </div>

      <Button variant="outline" className="rounded-full bg-white">
        Price Range
        <ChevronDown className="ml-2 h-4 w-4" />
      </Button>

      <Button variant="outline" className="rounded-full bg-white">
        Dietary
        <ChevronDown className="ml-2 h-4 w-4" />
      </Button>

      <Button variant="outline" className="rounded-full bg-white">
        Max Delivery Fee
        <ChevronDown className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}
