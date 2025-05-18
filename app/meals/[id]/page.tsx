"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import UserHeader from "@/components/user-header"
import MealPageView from "@/components/meal-page-view"
import { allMenuItems } from "@/data/menu-items"
import type { MenuItemWithAddOns } from "@/types/menu"

export default function MealDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const [meal, setMeal] = useState<MenuItemWithAddOns | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Find the meal by ID
    const foundMeal = allMenuItems.find((item) => item.id === params.id)
    setMeal(foundMeal || null)
    setLoading(false)
  }, [params.id])

  if (!loading && !meal) {
    notFound()
  }

  return (
    <>
      <UserHeader />
      {meal ? (
        <MealPageView item={meal} chefId="dylan" />
      ) : (
        <div className="flex h-[70vh] items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="h-8 w-48 rounded-full bg-gray-200 mx-auto"></div>
            <div className="mt-4 h-4 w-64 rounded-full bg-gray-200 mx-auto"></div>
          </div>
        </div>
      )}
    </>
  )
}
