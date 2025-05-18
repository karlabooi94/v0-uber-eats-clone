"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, Plus, Minus, Trash2, AlertTriangle } from "lucide-react"
import UserHeader from "@/components/user-header"
import { toast } from "@/hooks/use-toast"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { format } from "date-fns"

export default function ModifyOrderPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [modifiedItems, setModifiedItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [isWithin24Hours, setIsWithin24Hours] = useState(false)
  const [chefId, setChefId] = useState<string | null>(null)

  useEffect(() => {
    // Get order details from localStorage
    const storedOrder = localStorage.getItem("lastOrder")
    if (storedOrder) {
      try {
        const parsedOrder = JSON.parse(storedOrder)
        setOrderDetails(parsedOrder)
        setModifiedItems(parsedOrder.items || [])

        // Check if order is within 24 hours
        if (parsedOrder.orderDate) {
          const orderDate = new Date(parsedOrder.orderDate)
          const now = new Date()
          const hoursDiff = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60)
          setIsWithin24Hours(hoursDiff <= 24)
        }

        // Extract chef ID from the first item
        if (parsedOrder.items && parsedOrder.items.length > 0) {
          setChefId(parsedOrder.items[0].chefId || "dylan")
        }
      } catch (error) {
        console.error("Error parsing order details:", error)
      }
    }

    setLoading(false)
  }, [])

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setModifiedItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)),
    )
  }

  const handleRemoveItem = (itemId: string) => {
    setModifiedItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
  }

  const calculateSubtotal = () => {
    return modifiedItems.reduce((sum, item) => {
      const basePrice = item.basePrice || 0
      const addOnsPrice = item.addOnsPrice || 0
      return sum + (basePrice + addOnsPrice) * (item.quantity || 1)
    }, 0)
  }

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.12 // 12% tax
  }

  const calculateServiceCharge = (subtotal: number) => {
    return orderDetails?.serviceType === "service" ? subtotal * 0.15 : 0 // 15% service charge for chef service
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const tax = calculateTax(subtotal)
    const serviceCharge = calculateServiceCharge(subtotal)
    const deliveryFee = orderDetails?.deliveryFee || 0
    return subtotal + tax + serviceCharge + deliveryFee
  }

  const handleSaveChanges = () => {
    if (modifiedItems.length === 0) {
      toast({
        title: "Cannot save empty order",
        description: "Please add at least one item to your order.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    // Update the order details
    const updatedOrder = {
      ...orderDetails,
      items: modifiedItems,
      subtotal: calculateSubtotal(),
      tax: calculateTax(calculateSubtotal()),
      serviceCharge: calculateServiceCharge(calculateSubtotal()),
      total: calculateTotal(),
      modifiedAt: new Date().toISOString(),
    }

    // Save the updated order
    localStorage.setItem("lastOrder", JSON.stringify(updatedOrder))

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Changes saved successfully",
        description: "Your order has been updated with your changes.",
      })
      setSaving(false)
      router.push("/thank-you")
    }, 1500)
  }

  const handleCancelOrder = () => {
    setCancelling(true)

    // Simulate API call
    setTimeout(() => {
      // Clear the order from localStorage
      localStorage.removeItem("lastOrder")

      toast({
        title: "Order cancelled",
        description: "Your order has been cancelled successfully.",
      })

      setCancelling(false)
      setShowCancelDialog(false)

      // Redirect to home page
      router.push("/")
    }, 1500)
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a")
    } catch (error) {
      return "Unknown date"
    }
  }

  if (loading || !orderDetails) {
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

  const subtotal = calculateSubtotal()
  const tax = calculateTax(subtotal)
  const serviceCharge = calculateServiceCharge(subtotal)
  const deliveryFee = orderDetails.deliveryFee || 0
  const total = subtotal + tax + serviceCharge + deliveryFee

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />

      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" asChild className="mr-2">
              <Link href="/thank-you">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Modify Order #{params.id}</h1>
          </div>
          <div className="flex gap-2">
            {isWithin24Hours && (
              <Button
                variant="outline"
                onClick={() => setShowCancelDialog(true)}
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                Cancel Order
              </Button>
            )}
            <Button onClick={handleSaveChanges} disabled={saving || modifiedItems.length === 0}>
              {saving ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        {isWithin24Hours ? (
          <div className="mb-6 rounded-lg bg-blue-50 p-4 text-blue-800">
            <p className="flex items-center">
              <span className="mr-2 rounded-full bg-blue-100 p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              You can modify or cancel this order as it was placed within the last 24 hours.
            </p>
          </div>
        ) : (
          <div className="mb-6 rounded-lg bg-yellow-50 p-4 text-yellow-800">
            <p className="flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4" />
              This order was placed more than 24 hours ago. Some modifications may be limited.
            </p>
          </div>
        )}

        <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Order Details</h2>
            <p className="text-sm text-gray-500">Placed on {formatDate(orderDetails.orderDate || "")}</p>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="mb-1 text-sm font-medium text-gray-500">Delivery Address</h3>
              <p>{orderDetails.address || "No address provided"}</p>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium text-gray-500">Service Type</h3>
              <p className="capitalize">{orderDetails.serviceType || "Delivery"}</p>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium text-gray-500">
                {orderDetails.serviceType === "service" ? "Service Date & Time" : "Delivery Date & Time"}
              </h3>
              <p>
                {orderDetails.serviceType === "service"
                  ? `${orderDetails.serviceDate || "Not specified"} at ${orderDetails.serviceStartTime || "Not specified"}`
                  : `${orderDetails.deliveryDate || "Not specified"} at ${orderDetails.deliveryTime || "Not specified"}`}
              </p>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium text-gray-500">Payment Method</h3>
              <p className="capitalize">{(orderDetails.paymentMethod || "").replace("-", " ")}</p>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Order Items</h2>
            {chefId && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/chefs/${chefId}`}>
                  <Plus className="mr-1 h-4 w-4" />
                  Add New Item
                </Link>
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {modifiedItems.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-gray-500">Your order is empty. Add items to continue.</p>
              </div>
            ) : (
              modifiedItems.map((item) => (
                <div key={item.id} className="flex items-start gap-4 rounded-lg border p-4">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                    <OptimizedImage
                      src={item.image || "/placeholder.svg?height=96&width=96&query=food"}
                      alt={item.name || "Food item"}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{item.name || "Food item"}</h3>
                      <p className="font-medium">
                        ${((item.basePrice || 0) * (item.quantity || 1) + (item.addOnsPrice || 0)).toFixed(2)}
                      </p>
                    </div>

                    {/* Show meal components if available */}
                    {(item.appetizer || item.mainCourse || item.side || item.dessert) && (
                      <div className="mt-2 text-sm text-gray-600">
                        <p className="font-medium">Includes:</p>
                        <ul className="ml-4 list-disc">
                          {item.appetizer && <li>{item.appetizer}</li>}
                          {item.mainCourse && <li>{item.mainCourse}</li>}
                          {item.side && <li>{item.side}</li>}
                          {item.dessert && <li>{item.dessert}</li>}
                        </ul>
                      </div>
                    )}

                    {/* Show add-ons if available */}
                    {item.addOns && item.addOns.length > 0 && (
                      <div className="mt-2 text-sm text-gray-600">
                        <p className="font-medium">Add-ons:</p>
                        <ul className="ml-4 list-disc">
                          {item.addOns.map((addon: any, index: number) => (
                            <li key={index}>
                              {addon.name} (+${addon.price?.toFixed(2) || "0.00"})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {item.specialInstructions && (
                      <div className="mt-2 text-sm text-gray-600">
                        <p className="font-medium">Special Instructions:</p>
                        <p className="italic">{item.specialInstructions}</p>
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => handleUpdateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                          disabled={(item.quantity || 1) <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="mx-3 w-5 text-center">{item.quantity || 1}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {serviceCharge > 0 && (
              <div className="flex justify-between">
                <span>Service Charge (15%)</span>
                <span>${serviceCharge.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>{deliveryFee === 0 ? "Included" : `$${deliveryFee.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (12%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <Button variant="outline" asChild>
              <Link href="/thank-you">Cancel</Link>
            </Button>
            <Button
              onClick={handleSaveChanges}
              disabled={saving || modifiedItems.length === 0}
              className="bg-black text-white hover:bg-black/90"
            >
              {saving ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Cancel Order Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)} disabled={cancelling}>
              Keep Order
            </Button>
            <Button variant="destructive" onClick={handleCancelOrder} disabled={cancelling}>
              {cancelling ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Cancelling...
                </>
              ) : (
                "Yes, Cancel Order"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
