"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { MapPin, Clock, Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

// Vancouver addresses for autofill suggestions
const VANCOUVER_ADDRESSES = [
  "3437 W 2nd Avenue, Vancouver, BC",
  "1234 Robson Street, Vancouver, BC",
  "3456 Main Street, Vancouver, BC",
  "789 Granville Street, Vancouver, BC",
  "555 Burrard Street, Vancouver, BC",
  "321 Water Street, Vancouver, BC",
  "4567 Kingsway, Burnaby, BC",
  "2345 Commercial Drive, Vancouver, BC",
  "987 Denman Street, Vancouver, BC",
  "654 Davie Street, Vancouver, BC",
]

interface AddressSearchFormProps {
  defaultAddress?: string
}

export default function AddressSearchForm({ defaultAddress = "" }: AddressSearchFormProps) {
  const [address, setAddress] = useState(defaultAddress)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Filter suggestions based on input
  useEffect(() => {
    if (address.trim().length > 0) {
      const filtered = VANCOUVER_ADDRESSES.filter((item) => item.toLowerCase().includes(address.toLowerCase()))
      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
    setFocusedSuggestionIndex(-1)
  }, [address])

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle keyboard navigation for suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return

    // Arrow down
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setFocusedSuggestionIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
    }
    // Arrow up
    else if (e.key === "ArrowUp") {
      e.preventDefault()
      setFocusedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : 0))
    }
    // Enter
    else if (e.key === "Enter" && focusedSuggestionIndex >= 0) {
      e.preventDefault()
      setAddress(suggestions[focusedSuggestionIndex])
      setShowSuggestions(false)
    }
    // Escape
    else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Use the default address if the field is empty
    const searchAddress = address.trim() ? address : defaultAddress
    router.push(`/restaurants?address=${encodeURIComponent(searchAddress)}`)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setAddress(suggestion)
    setShowSuggestions(false)
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex w-full flex-col gap-4 md:flex-row">
      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <MapPin className="h-5 w-5 text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="Enter delivery address"
          className="w-full rounded-lg border-0 bg-white py-5 pl-12 pr-4 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-black"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onFocus={() => {
            if (address.trim()) {
              const filtered = VANCOUVER_ADDRESSES.filter((item) => item.toLowerCase().includes(address.toLowerCase()))
              setSuggestions(filtered)
              setShowSuggestions(filtered.length > 0)
            }
          }}
          onKeyDown={handleKeyDown}
        />

        {/* Address suggestions dropdown */}
        {showSuggestions && (
          <div
            ref={suggestionsRef}
            className="absolute left-0 right-0 top-full z-10 mt-1 max-h-60 overflow-y-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
          >
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${
                  index === focusedSuggestionIndex ? "bg-gray-100" : ""
                }`}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                  <span>{suggestion}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <div className="relative rounded-lg bg-white shadow-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Clock className="h-5 w-5 text-gray-500" />
          </div>
          <select
            className="h-full w-full appearance-none rounded-lg border-0 py-5 pl-12 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-black"
            defaultValue="now"
          >
            <option value="now">Deliver now</option>
            <option value="later">Schedule for later</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
            <ChevronDown className="h-5 w-5 text-gray-500" />
          </div>
        </div>

        <Button
          type="submit"
          className="bg-black px-8 py-5 text-white transition-colors hover:bg-black/90"
          style={{ height: "auto" }}
        >
          <Search className="h-5 w-5 md:mr-2" />
          <span className="hidden md:inline">Find Food</span>
        </Button>
      </div>
    </form>
  )
}
