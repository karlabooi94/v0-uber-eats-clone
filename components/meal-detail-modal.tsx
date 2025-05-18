"use client"

import type React from "react"

import { useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import DetailedMealView from "./detailed-meal-view"
import type { MenuItemWithAddOns } from "@/types/menu"

interface MealDetailModalProps {
  item: MenuItemWithAddOns
  chefId: string
  onClose: () => void
}

export default function MealDetailModal({ item, chefId, onClose }: MealDetailModalProps) {
  const router = useRouter()
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle click outside the modal
  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      // Navigate to the meal page when clicking outside
      router.push(`/meals/${item.id}`)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-lg bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with prominent close button */}
        <div className="sticky top-0 z-10 flex justify-between items-center bg-white p-4 border-b">
          <h2 className="text-xl font-bold">{item.name}</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose} className="px-4 py-2 border-gray-300 hover:bg-gray-100">
              Cancel
            </Button>
          </div>
        </div>

        <DetailedMealView item={item} chefId={chefId} onClose={onClose} isModal={true} />
      </div>
    </div>
  )
}
