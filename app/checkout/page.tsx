"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useOrder } from "@/hooks/use-order"
import UserHeader from "@/components/user-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const { user, isTestMode } = useAuth()
  const { items, subtotal } = useOrder()
  const [isLoading, setIsLoading] = useState(false)

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/")
    }
  }, [items, router])

  // Handle checkout process
  const handleCheckout = async () => {
    setIsLoading(true)

    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirect to confirmation page
      router.push("/order-confirmation")
    } catch (error) {
      console.error("Checkout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate order details
  const tax = subtotal * 0.12 // 12% tax
  const deliveryFee = 5.99
  const total = subtotal + tax + deliveryFee

  // If no user and not in test mode, we would normally redirect to login
  // But in test mode, we'll continue with checkout
  if (!user && !isTestMode) {
    router.push("/login?redirect=/checkout")
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />

      {/* Test Mode Banner */}
      {isTestMode && (
        <div className="bg-yellow-100 p-2 text-center text-sm text-yellow-800">
          <AlertTriangle className="mr-1 inline-block h-4 w-4" />
          Test Mode Active - Using test user: Ben Booi
        </div>
      )}

      <main className="mx-auto max-w-4xl p-4 md:p-6">
        <h1 className="mb-6 text-2xl font-bold md:text-3xl">Checkout</h1>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Order Summary with Images */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 border-b pb-4">
                      {/* Item Image */}
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                        <img
                          src={item.image || "/placeholder.svg?height=80&width=80&query=food"}
                          alt={item.name || item.title || "Food item"}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">
                            {item.quantity || 1}x {item.name || item.title || "Food item"}
                          </h3>
                          <p className="font-medium">${((item.basePrice || 80) * (item.quantity || 1)).toFixed(2)}</p>
                        </div>

                        {/* Item Description */}
                        {item.description && <p className="mt-1 text-sm text-gray-500">{item.description}</p>}

                        {/* Add-ons and Customizations */}
                        {item.addOns && item.addOns.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-gray-700">Customizations:</p>
                            <ul className="mt-1 space-y-1 text-xs text-gray-600">
                              {item.addOns.map((addon, index) => (
                                <li key={index} className="flex justify-between">
                                  <span>+ {addon.name}</span>
                                  <span>${addon.price?.toFixed(2) || "0.00"}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Special Instructions */}
                        {item.specialInstructions && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-gray-700">Special Instructions:</p>
                            <p className="text-xs italic text-gray-600">{item.specialInstructions}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Delivery Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="font-medium">{user?.name || "Ben Booi"}</div>
                  <div className="text-gray-500">123 Main Street</div>
                  <div className="text-gray-500">Vancouver, BC V6B 1A1</div>
                  <div className="text-gray-500">Canada</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div>Subtotal</div>
                    <div>${subtotal.toFixed(2)}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Tax</div>
                    <div>${tax.toFixed(2)}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Delivery Fee</div>
                    <div>${deliveryFee.toFixed(2)}</div>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <div>Total</div>
                    <div>${total.toFixed(2)}</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-black text-white hover:bg-black/90"
                  onClick={handleCheckout}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Complete Order"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
