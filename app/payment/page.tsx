"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, CreditCard, Check, Lock } from "lucide-react"
import UserHeader from "@/components/user-header"

export default function PaymentPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setIsComplete(true)
    }, 2000)
  }

  if (isComplete) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <UserHeader />

        <div className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center p-4 text-center md:p-6">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="mb-2 text-2xl font-bold">Payment Successful!</h1>
          <p className="mb-6 text-gray-600">
            Your payment has been processed successfully. You'll receive a confirmation email shortly.
          </p>
          <Button asChild className="bg-black text-white hover:bg-black/90">
            <Link href="/dashboard">View your orders</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />

      <div className="mx-auto max-w-md p-4 md:p-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/checkout">
            <ArrowLeft className="h-4 w-4" />
            <span className="ml-1">Back to checkout</span>
          </Link>
        </Button>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-xl font-bold">Payment</h1>
            <div className="flex items-center text-sm text-green-600">
              <Lock className="mr-1 h-4 w-4" />
              Secure Payment
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Card Number</label>
                <Input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Cardholder Name</label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Expiry Date</label>
                  <Input
                    type="text"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">CVV</label>
                  <Input
                    type="text"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
              </div>

              <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Note:</span> Your card will be charged only after the order is confirmed
                  by Chef Dylan.
                </p>
              </div>

              <Button type="submit" className="w-full bg-black text-white hover:bg-black/90" disabled={isProcessing}>
                {isProcessing ? (
                  <span className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay Now
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-4 text-center text-xs text-gray-500">
          <p>By proceeding with the payment, you agree to our terms and conditions.</p>
        </div>
      </div>
    </div>
  )
}
