"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, ShoppingBag } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import LoginModal from "./login-modal"
import { useOrder } from "@/hooks/use-order"
import { useState, useEffect } from "react"

export default function UserHeader() {
  const { user } = useAuth()
  const { items, itemCount } = useOrder()
  const [isOrderUpdated, setIsOrderUpdated] = useState(false)

  // Animation effect when order count changes
  useEffect(() => {
    if (itemCount > 0) {
      setIsOrderUpdated(true)
      const timer = setTimeout(() => setIsOrderUpdated(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [itemCount])

  return (
    <header className="bg-white p-5 shadow-sm md:p-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold">Vancouver Chef Connect</span>
        </Link>

        <div className="relative hidden w-full max-w-md items-center rounded-full border bg-gray-50 px-4 py-2 md:mx-4 md:flex">
          <Search className="mr-2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search for chefs or cuisines..."
            className="w-full bg-transparent text-sm focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/checkout" className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-full transition-all duration-300 ${isOrderUpdated ? "bg-black text-white" : ""}`}
                >
                  <ShoppingBag className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span
                      className={`absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white ${
                        isOrderUpdated ? "animate-ping-once bg-white text-black" : ""
                      }`}
                    >
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>

              <Link href="/dashboard">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="h-8 w-8 overflow-hidden rounded-full border">
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </Button>
              </Link>
            </>
          ) : (
            <>
              <LoginModal>
                <Button variant="outline" className="border-2">
                  Log in
                </Button>
              </LoginModal>
              <Button className="bg-black text-white hover:bg-black/90">Sign up</Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
