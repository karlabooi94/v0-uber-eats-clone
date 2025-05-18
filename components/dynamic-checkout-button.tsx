"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingBag, ArrowRight } from "lucide-react"
import { useOrder } from "@/hooks/use-order"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function DynamicCheckoutButton() {
  const { items, subtotal } = useOrder()
  const [hasItems, setHasItems] = useState(false)

  // Check if there are items in the order
  useEffect(() => {
    setHasItems(items.length > 0)
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
                  {items.length} {items.length === 1 ? "item" : "items"} selected
                </span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">${subtotal.toFixed(2)}</span>
                <ArrowRight className="h-5 w-5" />
              </div>
            </Link>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
