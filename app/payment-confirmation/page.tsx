"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import UserHeader from "@/components/user-header"

export default function PaymentConfirmationPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />

      <div className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center p-4 text-center md:p-6">
        {isLoading ? (
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
            <p className="mt-4 text-lg">Processing your payment...</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="mb-2 text-3xl font-bold">Payment Successful!</h1>
            <p className="mb-6 text-lg text-gray-600">
              Your payment has been processed successfully. You'll receive a confirmation email shortly.
            </p>
            <div className="mb-8 w-full max-w-md rounded-lg border bg-white p-6">
              <div className="mb-4 flex justify-between">
                <span className="font-medium">Order ID:</span>
                <span>
                  ORD-
                  {Math.floor(Math.random() * 10000)
                    .toString()
                    .padStart(4, "0")}
                </span>
              </div>
              <div className="mb-4 flex justify-between">
                <span className="font-medium">Payment date:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="mb-4 flex justify-between">
                <span className="font-medium">Payment method:</span>
                <span>Credit Card</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Amount paid:</span>
                <span>$89.99</span>
              </div>
            </div>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button asChild className="bg-black text-white hover:bg-black/90">
                <Link href="/dashboard">View your orders</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Return to home</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
