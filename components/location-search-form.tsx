"use client"

import type React from "react"

import { useState } from "react"
import { MapPin, Clock, Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function LocationSearchForm() {
  const [location, setLocation] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (location.trim()) {
      // In a real app, we would encode the location properly
      router.push(`/chefs?location=${encodeURIComponent(location)}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 md:flex-row">
      <div className="relative flex-1 rounded-lg bg-white shadow-md">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <MapPin className="h-5 w-5 text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="Enter delivery address"
          className="w-full rounded-lg border-0 py-5 pl-12 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-black"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>

      <div className="flex gap-4">
        <div className="relative rounded-lg bg-white shadow-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Clock className="h-5 w-5 text-gray-500" />
          </div>
          <select
            className="h-full w-full appearance-none rounded-lg border-0 py-5 pl-12 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-black"
            defaultValue="anytime"
          >
            <option value="anytime">Deliver now</option>
            <option value="today">Later today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="this-week">This week</option>
            <option value="next-week">Next week</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
            <ChevronDown className="h-5 w-5 text-gray-500" />
          </div>
        </div>

        <Button type="submit" className="bg-black px-8 py-5 text-white hover:bg-black/90" style={{ height: "auto" }}>
          <Search className="h-5 w-5 md:mr-2" />
          <span className="hidden md:inline">Search here</span>
        </Button>
      </div>
    </form>
  )
}
