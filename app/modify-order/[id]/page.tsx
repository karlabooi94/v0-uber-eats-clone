"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, Plus, Minus, Trash2, AlertTriangle, Edit, CreditCard } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Course options for customization
const COURSE_OPTIONS = {
  appetizers: [
    { id: "veg-pakora", name: "Vegetable Pakora", image: "/meals/vegetable-pakora-deluxe.png" },
    { id: "samosa", name: "Samosa", image: "/meals/vegetable-pakora-1.png" },
    { id: "onion-bhaji", name: "Onion Bhaji", image: "/meals/vegetable-pakora-2.png" },
  ],
  mains: [
    { id: "chicken-biryani", name: "Chicken Biryani", image: "/meals/chicken-biryani-deluxe.png" },
    { id: "tandoori-chicken", name: "Tandoori Chicken", image: "/meals/tandoori-chicken-platter-deluxe.png" },
    { id: "butter-chicken", name: "Butter Chicken", image: "/meals/chicken-biryani-2.png" },
  ],
  sides: [
    { id: "garlic-naan", name: "Garlic Naan", image: "/meals/garlic-naan-deluxe.png" },
    { id: "plain-naan", name: "Plain Naan", image: "/meals/garlic-naan-1.png" },
    { id: "rice", name: "Basmati Rice", image: "/meals/garlic-naan-2.png" },
  ],
  desserts: [
    { id: "gulab-jamun", name: "Gulab Jamun", image: "/meals/gulab-jamun-deluxe.png" },
    { id: "kheer", name: "Rice Kheer", image: "/meals/gulab-jamun-1.png" },
    { id: "rasmalai", name: "Rasmalai", image: "/meals/gulab-jamun-2.png" },
  ],
}

export default function ModifyOrderPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [modifiedItems, setModifiedItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [showCustomizeDialog, setShowCustomizeDialog] = useState(false)
  const [currentItem, setCurrentItem] = useState<any>(null)
  const [customizations, setCustomizations] = useState<any>({
    appetizer: "",
    mainCourse: "",
    side: "",
    dessert: "",
    spiceLevel: "medium",
    specialInstructions: "",
  })

  useEffect(() => {
    // Get order details from localStorage
    const storedOrder = localStorage.getItem("lastOrder")

    if (storedOrder) {
      try {
        const parsedOrder = JSON.parse(storedOrder)
        setOrderDetails(parsedOrder)
        setModifiedItems(parsedOrder.items || [])
      } catch (error) {
        console.error("Error parsing order details:", error)
        // Create a fallback order if there's an error
        createFallbackOrder()
      }
    } else {
      // Create a fallback order if no order exists
      createFallbackOrder()
    }

    // Always set loading to false after attempting to load
    setLoading(false)
  }, [])

  const createFallbackOrder = () => {
    // Create a sample order for testing/demo purposes
    const fallbackOrder = {
      id: params.id || "sample-123",
      orderDate: new Date().toISOString(),
      items: [
        {
          id: "indian-meal-1",
          name: "Indian Fusion Meal",
          image: "/meals/indian-fusion-deluxe.png",
          quantity: 2,
          basePrice: 80,
          chefId: "dylan",
          appetizer: "Vegetable Pakora",
          mainCourse: "Chicken Biryani",
          side: "Garlic Naan",
          dessert: "Gulab Jamun",
          spiceLevel: "medium",
          specialInstructions: "",
        },
      ],
      subtotal: 160,
      tax: 19.2,
      serviceCharge: 0,
      deliveryFee: 0,
      total: 179.2,
      address: "123 Main St, Vancouver, BC",
      serviceType: "delivery",
      deliveryDate: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"), // 7 days from now
      deliveryTime: "18:00",
      paymentMethod: "credit-card",
    }

    setOrderDetails(fallbackOrder)
    setModifiedItems(fallbackOrder.items)
    localStorage.setItem("lastOrder", JSON.stringify(fallbackOrder))
  }

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setModifiedItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)),
    )
  }

  const handleRemoveItem = (itemId: string) => {
    setModifiedItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
  }

  const handleCustomizeItem = (item: any) => {
    setCurrentItem(item)
    setCustomizations({
      appetizer: item.appetizer || "",
      mainCourse: item.mainCourse || "",
      side: item.side || "",
      dessert: item.dessert || "",
      spiceLevel: item.spiceLevel || "medium",
      specialInstructions: item.specialInstructions || "",
    })
    setShowCustomizeDialog(true)
  }

  const handleSaveCustomizations = () => {
    if (!currentItem) return

    setModifiedItems((prevItems) =>
      prevItems.map((item) =>
        item.id === currentItem.id
          ? {
              ...item,
              appetizer: customizations.appetizer,
              mainCourse: customizations.mainCourse,
              side: customizations.side,
              dessert: customizations.dessert,
              spiceLevel: customizations.spiceLevel,
              specialInstructions: customizations.specialInstructions,
            }
          : item,
      ),
    )

    setShowCustomizeDialog(false)
    toast({
      title: "Customizations saved",
      description: "Your meal customizations have been updated.",
    })
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserHeader />
        <div className="flex h-[80vh] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
            <p className="text-lg font-medium">Loading order details...</p>
            <p className="mt-4 text-sm text-gray-500">
              If loading takes too long, please{" "}
              <button onClick={createFallbackOrder} className="text-blue-500 underline">
                click here
              </button>{" "}
              to continue with a sample order.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserHeader />
        <div className="flex h-[80vh] items-center justify-center">
          <div className="text-center max-w-md px-4">
            <div className="mb-4 text-amber-500">
              <AlertTriangle size={48} className="mx-auto" />
            </div>
            <h2 className="text-xl font-bold mb-2">No Order Found</h2>
            <p className="mb-6">We couldn't find your order details. Would you like to continue with a sample order?</p>
            <Button onClick={createFallbackOrder}>Continue with Sample Order</Button>
            <div className="mt-4">
              <Link href="/thank-you" className="text-sm text-gray-500 hover:text-gray-700">
                Return to Previous Page
              </Link>
            </div>
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
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(true)}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              Cancel Order
            </Button>
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

        {/* Payment Notice */}
        <div className="mb-6 rounded-lg bg-green-50 p-4 border border-green-200">
          <div className="flex items-start gap-3">
            <CreditCard className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
            <div>
              <h3 className="font-medium text-green-800">Your card will NOT be charged until the day of your meal</h3>
              <p className="mt-1 text-sm text-green-700">
                Feel free to customize your order as needed. You can modify your order anytime before the scheduled
                delivery date.
              </p>
            </div>
          </div>
        </div>

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
            <h2 className="text-lg font-semibold">Your Meal Items</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/chefs/dylan`}>
                <Plus className="mr-1 h-4 w-4" />
                Add New Item
              </Link>
            </Button>
          </div>

          <div className="space-y-6">
            {modifiedItems.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-gray-500">Your order is empty. Add items to continue.</p>
              </div>
            ) : (
              modifiedItems.map((item) => (
                <div key={item.id} className="rounded-lg border p-4">
                  <div className="flex items-start gap-4">
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

                      <div className="mt-2 grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">Quantity</h4>
                          <div className="mt-1 flex items-center">
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
                        </div>
                        <div className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-1"
                            onClick={() => handleCustomizeItem(item)}
                          >
                            <Edit className="mr-1 h-4 w-4" />
                            Customize Meal
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Course Preview */}
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                    {item.appetizer && (
                      <div className="rounded-md border p-2 bg-gray-50">
                        <div className="aspect-square w-full overflow-hidden rounded-md mb-2">
                          <OptimizedImage
                            src={
                              COURSE_OPTIONS.appetizers.find((a) => a.name === item.appetizer)?.image ||
                              "/meals/vegetable-pakora-deluxe.png"
                            }
                            alt={item.appetizer}
                            width={80}
                            height={80}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="text-xs">
                          <span className="text-gray-500">Appetizer:</span>
                          <p className="font-medium truncate">{item.appetizer}</p>
                        </div>
                      </div>
                    )}
                    {item.mainCourse && (
                      <div className="rounded-md border p-2 bg-gray-50">
                        <div className="aspect-square w-full overflow-hidden rounded-md mb-2">
                          <OptimizedImage
                            src={
                              COURSE_OPTIONS.mains.find((m) => m.name === item.mainCourse)?.image ||
                              "/meals/chicken-biryani-deluxe.png"
                            }
                            alt={item.mainCourse}
                            width={80}
                            height={80}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="text-xs">
                          <span className="text-gray-500">Main:</span>
                          <p className="font-medium truncate">{item.mainCourse}</p>
                        </div>
                      </div>
                    )}
                    {item.side && (
                      <div className="rounded-md border p-2 bg-gray-50">
                        <div className="aspect-square w-full overflow-hidden rounded-md mb-2">
                          <OptimizedImage
                            src={
                              COURSE_OPTIONS.sides.find((s) => s.name === item.side)?.image ||
                              "/meals/garlic-naan-deluxe.png"
                            }
                            alt={item.side}
                            width={80}
                            height={80}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="text-xs">
                          <span className="text-gray-500">Side:</span>
                          <p className="font-medium truncate">{item.side}</p>
                        </div>
                      </div>
                    )}
                    {item.dessert && (
                      <div className="rounded-md border p-2 bg-gray-50">
                        <div className="aspect-square w-full overflow-hidden rounded-md mb-2">
                          <OptimizedImage
                            src={
                              COURSE_OPTIONS.desserts.find((d) => d.name === item.dessert)?.image ||
                              "/meals/gulab-jamun-deluxe.png"
                            }
                            alt={item.dessert}
                            width={80}
                            height={80}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="text-xs">
                          <span className="text-gray-500">Dessert:</span>
                          <p className="font-medium truncate">{item.dessert}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Additional Details */}
                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    {item.spiceLevel && (
                      <div>
                        <span className="font-medium">Spice Level:</span>{" "}
                        {item.spiceLevel.charAt(0).toUpperCase() + item.spiceLevel.slice(1)}
                      </div>
                    )}
                    {item.specialInstructions && (
                      <div className="w-full">
                        <span className="font-medium">Special Instructions:</span>
                        <p className="mt-1 italic text-gray-600">{item.specialInstructions}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex justify-end">
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
              <p className="mt-1 text-sm text-gray-500 italic">
                Your card will not be charged until the day of your meal.
              </p>
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

      {/* Customize Meal Dialog */}
      <Dialog open={showCustomizeDialog} onOpenChange={setShowCustomizeDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customize Your Meal</DialogTitle>
            <DialogDescription>Personalize each course of your meal according to your preferences.</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="appetizer" className="mt-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="appetizer">Appetizer</TabsTrigger>
              <TabsTrigger value="main">Main Course</TabsTrigger>
              <TabsTrigger value="side">Side</TabsTrigger>
              <TabsTrigger value="dessert">Dessert</TabsTrigger>
            </TabsList>

            <TabsContent value="appetizer" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {COURSE_OPTIONS.appetizers.map((option) => (
                  <div
                    key={option.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      customizations.appetizer === option.name ? "border-blue-500 bg-blue-50" : "hover:border-gray-400"
                    }`}
                    onClick={() => setCustomizations({ ...customizations, appetizer: option.name })}
                  >
                    <div className="aspect-square w-full overflow-hidden rounded-md mb-2">
                      <OptimizedImage
                        src={option.image}
                        alt={option.name}
                        width={120}
                        height={120}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex items-center">
                      <RadioGroup value={customizations.appetizer === option.name ? "selected" : ""} className="mr-2">
                        <RadioGroupItem value="selected" id={`appetizer-${option.id}`} />
                      </RadioGroup>
                      <Label htmlFor={`appetizer-${option.id}`} className="font-medium">
                        {option.name}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="main" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {COURSE_OPTIONS.mains.map((option) => (
                  <div
                    key={option.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      customizations.mainCourse === option.name ? "border-blue-500 bg-blue-50" : "hover:border-gray-400"
                    }`}
                    onClick={() => setCustomizations({ ...customizations, mainCourse: option.name })}
                  >
                    <div className="aspect-square w-full overflow-hidden rounded-md mb-2">
                      <OptimizedImage
                        src={option.image}
                        alt={option.name}
                        width={120}
                        height={120}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex items-center">
                      <RadioGroup value={customizations.mainCourse === option.name ? "selected" : ""} className="mr-2">
                        <RadioGroupItem value="selected" id={`main-${option.id}`} />
                      </RadioGroup>
                      <Label htmlFor={`main-${option.id}`} className="font-medium">
                        {option.name}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <Label htmlFor="spice-level" className="mb-2 block font-medium">
                  Spice Level
                </Label>
                <Select
                  value={customizations.spiceLevel}
                  onValueChange={(value) => setCustomizations({ ...customizations, spiceLevel: value })}
                >
                  <SelectTrigger id="spice-level">
                    <SelectValue placeholder="Select spice level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hot">Hot</SelectItem>
                    <SelectItem value="extra-hot">Extra Hot</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="side" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {COURSE_OPTIONS.sides.map((option) => (
                  <div
                    key={option.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      customizations.side === option.name ? "border-blue-500 bg-blue-50" : "hover:border-gray-400"
                    }`}
                    onClick={() => setCustomizations({ ...customizations, side: option.name })}
                  >
                    <div className="aspect-square w-full overflow-hidden rounded-md mb-2">
                      <OptimizedImage
                        src={option.image}
                        alt={option.name}
                        width={120}
                        height={120}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex items-center">
                      <RadioGroup value={customizations.side === option.name ? "selected" : ""} className="mr-2">
                        <RadioGroupItem value="selected" id={`side-${option.id}`} />
                      </RadioGroup>
                      <Label htmlFor={`side-${option.id}`} className="font-medium">
                        {option.name}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="dessert" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {COURSE_OPTIONS.desserts.map((option) => (
                  <div
                    key={option.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      customizations.dessert === option.name ? "border-blue-500 bg-blue-50" : "hover:border-gray-400"
                    }`}
                    onClick={() => setCustomizations({ ...customizations, dessert: option.name })}
                  >
                    <div className="aspect-square w-full overflow-hidden rounded-md mb-2">
                      <OptimizedImage
                        src={option.image}
                        alt={option.name}
                        width={120}
                        height={120}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex items-center">
                      <RadioGroup value={customizations.dessert === option.name ? "selected" : ""} className="mr-2">
                        <RadioGroupItem value="selected" id={`dessert-${option.id}`} />
                      </RadioGroup>
                      <Label htmlFor={`dessert-${option.id}`} className="font-medium">
                        {option.name}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <Label htmlFor="special-instructions" className="mb-2 block font-medium">
              Special Instructions
            </Label>
            <Textarea
              id="special-instructions"
              placeholder="Any allergies, dietary restrictions, or preparation preferences?"
              value={customizations.specialInstructions}
              onChange={(e) => setCustomizations({ ...customizations, specialInstructions: e.target.value })}
              className="min-h-[100px]"
            />
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowCustomizeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCustomizations}>Save Customizations</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
