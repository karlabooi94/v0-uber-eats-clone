"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, Clock, MapPin, CreditCard, ChefHat, Truck, Edit2 } from "lucide-react"
import UserHeader from "@/components/user-header"
import { format, addHours, isAfter } from "date-fns"

export default function ThankYouPage() {
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [orderId, setOrderId] = useState<string>("")
  const [isWithin24Hours, setIsWithin24Hours] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<string>("")

  useEffect(() => {
    // Get order details from localStorage
    const storedOrder = localStorage.getItem("lastOrder")
    if (storedOrder) {
      try {
        const parsedOrder = JSON.parse(storedOrder)
        setOrderDetails(parsedOrder)
        setOrderId(parsedOrder.orderId || `ORD-${Math.floor(100000 + Math.random() * 900000)}`)

        // Check if order is within 24 hours
        if (parsedOrder.orderDate) {
          const orderDate = new Date(parsedOrder.orderDate)
          const modificationDeadline = addHours(orderDate, 24)
          const now = new Date()

          setIsWithin24Hours(isAfter(modificationDeadline, now))

          // Calculate time remaining
          if (isAfter(modificationDeadline, now)) {
            const diffMs = modificationDeadline.getTime() - now.getTime()
            const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
            const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
            setTimeRemaining(`${diffHrs}h ${diffMins}m`)
          }
        }
      } catch (error) {
        console.error("Error parsing order details:", error)
      }
    }
  }, [])

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "EEEE, MMMM d, yyyy 'at' h:mm a")
    } catch (error) {
      return "Unknown date"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />

      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-8 rounded-lg bg-white p-6 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="mb-2 text-2xl font-bold">Thank You for Your Order!</h1>
          <p className="mb-4 text-gray-600">
            Your order has been received and is being processed. You will receive a confirmation email shortly.
          </p>
          <div className="mb-4 inline-block rounded-md bg-gray-100 px-4 py-2 text-lg font-semibold">
            Order #{orderId}
          </div>

          {isWithin24Hours && (
            <div className="mt-4 rounded-lg bg-blue-50 p-4 text-blue-800">
              <p className="flex items-center justify-center">
                <Clock className="mr-2 h-4 w-4" />
                You can modify or cancel your order for the next {timeRemaining}
              </p>
              <div className="mt-3">
                <Button
                  asChild
                  variant="outline"
                  className="border-blue-300 bg-blue-100 text-blue-800 hover:bg-blue-200"
                >
                  <Link href={`/modify-order/${orderId}`}>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Modify Order
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>

        {orderDetails && (
          <div className="space-y-6">
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">Order Details</h2>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-gray-500" />
                    <h3 className="font-medium">Order Date</h3>
                  </div>
                  <p className="mt-1 text-gray-600">
                    {orderDetails.orderDate ? formatDate(orderDetails.orderDate) : "Not specified"}
                  </p>
                </div>

                <div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5 text-gray-500" />
                    <h3 className="font-medium">Delivery Address</h3>
                  </div>
                  <p className="mt-1 text-gray-600">{orderDetails.address || "Not specified"}</p>
                </div>

                <div>
                  <div className="flex items-center">
                    {orderDetails.serviceType === "service" ? (
                      <ChefHat className="mr-2 h-5 w-5 text-gray-500" />
                    ) : (
                      <Truck className="mr-2 h-5 w-5 text-gray-500" />
                    )}
                    <h3 className="font-medium">
                      {orderDetails.serviceType === "service" ? "Service Details" : "Delivery Details"}
                    </h3>
                  </div>
                  <p className="mt-1 text-gray-600">
                    {orderDetails.serviceType === "service"
                      ? `${orderDetails.serviceDate || "Not specified"} at ${
                          orderDetails.serviceStartTime || "Not specified"
                        } (${orderDetails.serviceDuration || 3} hours)`
                      : `${orderDetails.deliveryDate || "Not specified"} at ${
                          orderDetails.deliveryTime || "Not specified"
                        }`}
                  </p>
                </div>

                <div>
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5 text-gray-500" />
                    <h3 className="font-medium">Payment Method</h3>
                  </div>
                  <p className="mt-1 capitalize text-gray-600">
                    {(orderDetails.paymentMethod || "Not specified").replace("-", " ")}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>

              <div className="mb-6 space-y-4">
                {orderDetails.items &&
                  orderDetails.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-start justify-between border-b pb-4">
                      <div className="flex items-start">
                        <div className="mr-4 h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                          <img
                            src={item.image || "/placeholder.svg?height=64&width=64&query=food"}
                            alt={item.name || "Food item"}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">
                            {item.quantity || 1}x {item.name || "Food item"}
                          </p>
                          {item.addOns && item.addOns.length > 0 && (
                            <div className="mt-1 text-sm text-gray-500">
                              {item.addOns.map((addon: any, idx: number) => (
                                <div key={idx}>+ {addon.name || "Add-on"}</div>
                              ))}
                            </div>
                          )}
                          {item.specialInstructions && (
                            <p className="mt-1 text-xs italic text-gray-500">Note: {item.specialInstructions}</p>
                          )}
                        </div>
                      </div>
                      <p className="font-medium">
                        ${((item.basePrice || 0) * (item.quantity || 1) + (item.addOnsPrice || 0)).toFixed(2)}
                      </p>
                    </div>
                  ))}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${orderDetails.subtotal?.toFixed(2) || "0.00"}</span>
                </div>
                {orderDetails.serviceCharge > 0 && (
                  <div className="flex justify-between">
                    <span>Service Charge (15%)</span>
                    <span>${orderDetails.serviceCharge?.toFixed(2) || "0.00"}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>
                    {orderDetails.deliveryFee === 0 ? "Included" : `$${orderDetails.deliveryFee?.toFixed(2) || "0.00"}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (12%)</span>
                  <span>${orderDetails.tax?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${orderDetails.total?.toFixed(2) || "0.00"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button asChild className="bg-black text-white hover:bg-black/90">
                <Link href="/">
                  Continue Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
