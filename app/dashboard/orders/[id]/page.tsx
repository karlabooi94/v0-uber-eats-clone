"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, MapPin, CreditCard, ChefHat, Truck, Edit2 } from "lucide-react"
import UserHeader from "@/components/user-header"
import { isWithinModificationWindow } from "@/utils/order-utils"
import { format } from "date-fns"

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isWithin24Hours, setIsWithin24Hours] = useState(false)

  useEffect(() => {
    // In a real app, this would fetch the order from an API
    // For now, we'll use localStorage as a demo
    const storedOrder = localStorage.getItem("lastOrder")
    if (storedOrder) {
      try {
        const parsedOrder = JSON.parse(storedOrder)
        setOrderDetails(parsedOrder)

        // Check if order is within 24 hours
        if (parsedOrder.orderDate) {
          setIsWithin24Hours(isWithinModificationWindow(parsedOrder.orderDate))
        }
      } catch (error) {
        console.error("Error parsing order details:", error)
      }
    }

    setLoading(false)
  }, [])

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "EEEE, MMMM d, yyyy 'at' h:mm a")
    } catch (error) {
      return "Unknown date"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserHeader />
        <div className="flex h-[80vh] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
            <p className="text-lg font-medium">Loading order details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserHeader />
        <div className="mx-auto max-w-3xl px-4 py-12">
          <Button variant="ghost" size="sm" asChild className="mb-6">
            <Link href="/dashboard">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
            <h1 className="mb-4 text-2xl font-bold">Order Not Found</h1>
            <p className="mb-6 text-gray-600">We couldn't find the order you're looking for.</p>
            <Button asChild>
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />

      <div className="mx-auto max-w-3xl px-4 py-8">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/dashboard">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Order #{params.id}</h1>
          {isWithin24Hours && (
            <Button asChild variant="outline">
              <Link href={`/modify-order/${params.id}`}>
                <Edit2 className="mr-2 h-4 w-4" />
                Modify Order
              </Link>
            </Button>
          )}
        </div>

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
        </div>
      </div>
    </div>
  )
}
