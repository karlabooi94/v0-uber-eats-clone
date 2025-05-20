"use client"

import type React from "react"

import { useState } from "react"
import { MapPin, Calendar, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface AddressSearchFormProps {
  defaultAddress?: string
}

export default function AddressSearchForm({ defaultAddress = "" }: AddressSearchFormProps) {
  const [address, setAddress] = useState(defaultAddress)
  const router = useRouter()

  // Get tomorrow's date as the minimum selectable date
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowFormatted = tomorrow.toISOString().split("T")[0]

  // Default to tomorrow
  const [selectedDate, setSelectedDate] = useState(tomorrowFormatted)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Use the default address if the field is empty
    const searchAddress = address.trim() ? address : defaultAddress
    router.push(`/restaurants?address=${encodeURIComponent(searchAddress)}&date=${selectedDate}`)
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex w-full flex-col gap-4 md:flex-row">
      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <MapPin className="h-5 w-5 text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="Enter your address for delivery"
          className="w-full rounded-lg border-0 bg-white py-5 pl-12 pr-4 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-black"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <div className="relative rounded-lg bg-white shadow-md">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Calendar className="h-5 w-5 text-gray-500" />
        </div>
        <input
          type="date"
          min={tomorrowFormatted}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="h-full w-full appearance-none rounded-lg border-0 py-5 pl-12 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-black"
        />
        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs text-green-600 font-medium">
          {/* Different availability indicators based on the date */}
          {new Date(selectedDate).getDay() === 5 || new Date(selectedDate).getDay() === 6
            ? "High Availability"
            : new Date(selectedDate).getDay() === 0
              ? "Medium Availability"
              : "Limited Availability"}
        </div>
      </div>

      <Button
        type="submit"
        className="bg-black px-8 py-5 text-white transition-all hover:bg-black/90 hover:scale-105"
        style={{ height: "auto" }}
      >
        <Search className="h-5 w-5 md:mr-2" />
        <span className="hidden md:inline">Find Your Chef</span>
      </Button>
    </form>
  )
}
