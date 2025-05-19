"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingBag, ArrowRight } from "lucide-react"
import { useOrder } from "@/hooks/use-order"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

// Constants
const MINIMUM_PEOPLE = 2
const PRICE_PER_PERSON = 80
const TAX_RATE = 0.12 // 12% tax rate

export default function DynamicCheckoutButton() {
  const { items, subtotal } = useOrder()
  const [hasItems, setHasItems] = useState(false)
  const [peopleCount, setPeopleCount] = useState(MINIMUM_PEOPLE)
  const [totalPrice, setTotalPrice] = useState(0)

  // Get the quantity of the main dish (assuming all items have the same quantity)
  const getMainQuantity = () => {
    if (items.length === 0) return MINIMUM_PEOPLE

    const mainItem = items.find((item) => item.courseType === "main" && !item.isCustomization)
    return mainItem ? Math.max(mainItem.quantity || MINIMUM_PEOPLE, MINIMUM_PEOPLE) : MINIMUM_PEOPLE
  }

  // Calculate the correct price based on people count
  const calculateCorrectPrice = () => {
    if (items.length === 0) return PRICE_PER_PERSON * MINIMUM_PEOPLE * (1 + TAX_RATE)

    // Get the current people count
    const currentPeopleCount = getMainQuantity()

    // For the standard meal package, we charge per person
    const standardMealPrice = PRICE_PER_PERSON * currentPeopleCount

    // Add any extra items or customizations
    const extraItemsPrice = items
      .filter((item) => item.isCustomization || item.isExtraItem)
      .reduce((total, item) => {
        // If this is a customization, only charge for the add-ons
        if (item.isCustomization) {
          return total + (item.addOnsPrice || 0) * (item.quantity || 1)
        }

        // If this is an extra item
        if (item.isExtraItem && item.basePrice !== undefined) {
          const basePrice = item.basePrice
          const addOnsPrice = item.addOnsPrice || 0
          return total + (basePrice + addOnsPrice) * (item.quantity || MINIMUM_PEOPLE)
        }

        return total
      }, 0)

    // Calculate subtotal
    const subtotal = standardMealPrice + extraItemsPrice

    // Add tax to get the total
    return subtotal * (1 + TAX_RATE)
  }

  // Check if there are items in the order and update the people count
  useEffect(() => {
    setHasItems(items.length > 0)
    if (items.length > 0) {
      setPeopleCount(getMainQuantity())
      setTotalPrice(calculateCorrectPrice())
    }
  }, [items])

  return (
    <AnimatePresence>
      {hasItems && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="sticky bottom-6 left-0 right-0 z-30 mx-auto w-full max-w-md px-4"
        >
          <Button asChild className="w-full justify-between rounded-full bg-black py-6 shadow-lg">
            <Link href="/checkout">
              <div className="flex items-center">
                <ShoppingBag className="mr-2 h-5 w-5" />
                <span>
                  {peopleCount} {peopleCount === 1 ? "person" : "people"} selected
                </span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">${totalPrice.toFixed(2)} (incl. tax)</span>
                <ArrowRight className="h-5 w-5" />
              </div>
            </Link>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
