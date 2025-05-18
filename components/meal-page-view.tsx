"use client"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import DetailedMealView from "./detailed-meal-view"
import type { MenuItemWithAddOns } from "@/types/menu"

interface MealPageViewProps {
  item: MenuItemWithAddOns
  chefId: string
  backUrl?: string
}

export default function MealPageView({ item, chefId, backUrl = "/chefs/dylan" }: MealPageViewProps) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="mx-auto max-w-4xl p-4">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href={backUrl}>
            <ArrowLeft className="h-4 w-4" />
            <span className="ml-1">Back to menu</span>
          </Link>
        </Button>

        <DetailedMealView item={item} chefId={chefId} />
      </div>
    </div>
  )
}
