"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Clock,
  ChefHat,
  Truck,
  Edit2,
  ShoppingBag,
  Search,
  ArrowRight,
  PenSquare,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import UserHeader from "@/components/user-header"
import { useAuth } from "@/hooks/use-auth"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { TimeSlotSelector } from "@/components/time-slot-selector"
import { OptimizedImage } from "@/components/ui/optimized-image"
import LoginModal from "@/components/login-modal"

// Default chef data in case chefDylan is not available
const defaultChef = {
  id: "default",
  name: "Chef",
  cuisine: "Various Cuisines",
  image: "/diverse-chef-preparing-food.png",
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items = [], subtotal = 0, clearCart, updateQuantity, removeFromCart, addToCart, isLoading, error } = useCart()
  const { user } = useAuth()
  const { showToast } = useToast()
  const [address, setAddress] = useState("3437 W 2nd Avenue, Vancouver, BC")
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [serviceType, setServiceType] = useState("delivery")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [editedQuantity, setEditedQuantity] = useState(1)
  const [editedAddOns, setEditedAddOns] = useState<any[]>([])
  const [editedSpecialInstructions, setEditedSpecialInstructions] = useState("")
  const [isReviewing, setIsReviewing] = useState(false)
  const [isEditingOrder, setIsEditingOrder] = useState(false)
  const [editedItems, setEditedItems] = useState<any[]>([])
  const [availableItems, setAvailableItems] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [chef, setChef] = useState(defaultChef)
  const [isEditingAll, setIsEditingAll] = useState(false)
  const [allEditedItems, setAllEditedItems] = useState<any[]>([])
  const [pageLoading, setPageLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [cartChecked, setCartChecked] = useState(false)
  const [cartRetryCount, setCartRetryCount] = useState(0)

  // Delivery options
  const [deliveryDate, setDeliveryDate] = useState("")
  const [deliveryTime, setDeliveryTime] = useState("5:00 PM")

  // Service options
  const [serviceDate, setServiceDate] = useState("")
  const [serviceStartTime, setServiceStartTime] = useState("5:00 PM")
  const [serviceDuration, setServiceDuration] = useState(3) // Minimum 3 hours

  const [specialInstructions, setSpecialInstructions] = useState("")

  const tax = subtotal * 0.12 // 12% tax
  const serviceCharge = serviceType === "service" ? subtotal * 0.15 : 0 // 15% service charge for chef service
  const deliveryFee = serviceType === "delivery" ? 4.99 : 0
  const total = subtotal + tax + serviceCharge + deliveryFee

  // Debug cart state
  useEffect(() => {
    console.log("Current cart items:", items)
    console.log("Cart loading state:", isLoading)
    console.log("Cart error:", error)
  }, [items, isLoading, error])

  // Check if cart is empty but should have items
  useEffect(() => {
    if (!isLoading && items.length === 0 && !cartChecked && cartRetryCount < 3) {
      console.log("Cart appears empty, checking localStorage directly...")

      try {
        // Try to load cart directly from localStorage
        const cartKey = user ? `cart_${user.id}` : "cart"
        const storedCart = localStorage.getItem(cartKey)

        if (storedCart) {
          const parsedCart = JSON.parse(storedCart)
          console.log("Found cart in localStorage:", parsedCart)

          if (parsedCart && Array.isArray(parsedCart) && parsedCart.length > 0) {
            console.log("Cart has items but useCart reports empty, attempting to restore...")

            // Force restore cart items
            parsedCart.forEach((item) => {
              addToCart(item)
            })

            showToast("Your cart has been restored", "success")
          }
        }
      } catch (e) {
        console.error("Error checking localStorage cart:", e)
      }

      setCartRetryCount((prev) => prev + 1)
      setCartChecked(true)
    }
  }, [isLoading, items, user, addToCart, showToast, cartChecked, cartRetryCount])

  // Load chef data
  useEffect(() => {
    setPageLoading(true)
    setHasError(false)

    // Try to determine which chef's page the user came from
    const getChefId = () => {
      // Check if we have items in the cart
      if (items.length > 0 && items[0].chefId) {
        return items[0].chefId
      }

      // Check if there's a chef ID in session storage (set when visiting a chef's page)
      const lastViewedChef = sessionStorage.getItem("lastViewedChef")
      if (lastViewedChef) {
        return lastViewedChef
      }

      // Default to Dylan if no other info available
      return "dylan"
    }

    // Only proceed if cart loading is complete
    if (!isLoading) {
      const chefId = getChefId()
      console.log("Loading chef data for:", chefId)

      // In a real app, this would fetch the chef data from an API
      // For now, we'll use a dynamic import to avoid the error
      import(`@/data/chef-${chefId}`)
        .then((module) => {
          const chefData = module[`chef${chefId.charAt(0).toUpperCase() + chefId.slice(1)}`] || defaultChef
          setChef(chefData)
          setPageLoading(false)

          // Also load this chef's menu items
          return import(`@/data/${chefId}-meals`)
        })
        .then((module) => {
          const menuItems = (module[`${chefId}Meals`] || []).flatMap((category: any) => category.items || [])
          setAvailableItems(menuItems)
        })
        .catch((error) => {
          console.error("Failed to load chef data:", error)
          setHasError(true)
          setPageLoading(false)
          // Keep using the default chef data
          setChef(defaultChef)
        })
    }
  }, [items, isLoading])

  // Initialize edited items when the order items change
  useEffect(() => {
    if (!isLoading && items.length > 0) {
      console.log("Updating edited items with current cart items")
      setEditedItems([...items])
      setAllEditedItems([...items])
    }
  }, [items, isLoading])

  // Set up editing item when editingItemId changes
  useEffect(() => {
    if (editingItemId) {
      const item = items.find((item) => item.id === editingItemId) || null
      setEditingItem(item)
      if (item) {
        setEditedQuantity(item.quantity || 1)
        setEditedAddOns(item.addOns || [])
        setEditedSpecialInstructions(item.specialInstructions || "")
      }
    } else {
      setEditingItem(null)
      setEditedQuantity(1)
      setEditedAddOns([])
      setEditedSpecialInstructions("")
    }
  }, [editingItemId, items])

  // Filter available items based on search query
  const filteredAvailableItems = availableItems.filter(
    (item) =>
      (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Calculate service end time based on start time and duration
  const calculateEndTime = (startTime: string, durationHours: number) => {
    if (!startTime) return ""

    const timeMatch = startTime.match(/(\d+):(\d+)\s*(AM|PM)/)
    if (!timeMatch) return ""

    let hours = Number.parseInt(timeMatch[1])
    const minutes = Number.parseInt(timeMatch[2])
    const period = timeMatch[3]

    // Convert to 24-hour format
    if (period === "PM" && hours < 12) hours += 12
    if (period === "AM" && hours === 12) hours = 0

    // Add duration
    let endHours = hours + durationHours

    // Convert back to 12-hour format
    const endPeriod = endHours >= 12 ? "PM" : "AM"
    if (endHours > 12) endHours -= 12
    if (endHours === 0) endHours = 12

    return `${endHours}:${minutes.toString().padStart(2, "0")} ${endPeriod}`
  }

  const serviceEndTime = calculateEndTime(serviceStartTime, serviceDuration)

  const handleReviewOrder = (e: React.FormEvent) => {
    e.preventDefault()

    // Check if user is logged in
    if (!user) {
      showToast("Please sign in to continue with your order", "error")
      return
    }

    // Validate required fields based on service type
    if (serviceType === "delivery" && (!deliveryDate || !deliveryTime)) {
      showToast("Please select a delivery date and time", "error")
      return
    }

    if (serviceType === "service" && (!serviceDate || !serviceStartTime)) {
      showToast("Please select a service date and time", "error")
      return
    }

    // Show review dialog
    setIsReviewing(true)
  }

  const handlePlaceOrder = () => {
    // Check if user is logged in
    if (!user) {
      showToast("Please sign in to complete your order", "error")
      return
    }

    setIsReviewing(false)
    setIsProcessing(true)

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false)

      // Store order details in localStorage for the thank you page
      const orderDetails = {
        items,
        subtotal,
        tax,
        serviceCharge,
        deliveryFee,
        total,
        serviceType,
        address,
        deliveryDate,
        deliveryTime,
        serviceDate,
        serviceStartTime,
        serviceDuration,
        serviceEndTime,
        paymentMethod,
        specialInstructions,
        orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`, // Generate random order ID
        orderDate: new Date().toISOString(),
        chef: {
          id: chef.id,
          name: chef.name,
          cuisine: chef.cuisine,
          image: chef.image,
        },
      }

      localStorage.setItem("lastOrder", JSON.stringify(orderDetails))

      // Clear the cart after successful order
      clearCart()

      // Navigate to thank you page
      router.push("/thank-you")
    }, 2000)
  }

  const handleEditItem = (itemId: string) => {
    setEditingItemId(itemId)
    setIsEditing(true)
  }

  const handleEditAllItems = () => {
    setIsEditingAll(true)
  }

  const handleSaveItemChanges = () => {
    if (!editingItem) return

    // Calculate add-ons price
    const addOnsPrice = editedAddOns.reduce((sum, addon) => sum + (addon.price || 0), 0)

    // Create updated item
    const updatedItem = {
      ...editingItem,
      quantity: editedQuantity,
      addOns: editedAddOns,
      addOnsPrice: addOnsPrice,
      specialInstructions: editedSpecialInstructions,
    }

    // Update the item in the order
    updateQuantity(editingItem.id, editedQuantity)

    // Close the dialog
    setIsEditing(false)
    setEditingItemId(null)

    // Show success message
    showToast(`${editingItem.name || "Item"} updated successfully`, "success")
  }

  const handleSaveAllItemChanges = () => {
    // Clear the current order
    clearCart()

    // Add all edited items back to the order
    allEditedItems.forEach((item) => {
      addToCart(item)
    })

    // Close the dialog
    setIsEditingAll(false)

    // Show success message
    showToast("Order updated successfully", "success")
  }

  const handleEditOrder = () => {
    setIsEditingOrder(true)
  }

  const handleSaveOrderChanges = () => {
    // Clear the current cart
    clearCart()

    // Add all edited items to the cart
    editedItems.forEach((item) => {
      addToCart(item)
    })

    setIsEditingOrder(false)
    showToast("Your order has been updated", "success")
  }

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setEditedItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)),
    )
  }

  const handleUpdateAllItemsQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setAllEditedItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)),
    )
  }

  const handleRemoveItem = (itemId: string) => {
    setEditedItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
  }

  const handleRemoveAllItem = (itemId: string) => {
    setAllEditedItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
  }

  const handleAddNewItem = (item: any) => {
    // Check if item already exists in the edited items
    const existingItem = editedItems.find((i) => i.id === item.id)

    if (existingItem) {
      // If it exists, increment the quantity
      handleUpdateQuantity(item.id, (existingItem.quantity || 1) + 1)
    } else {
      // Otherwise, add it with quantity 1
      setEditedItems((prevItems) => [...prevItems, { ...item, quantity: 1 }])
    }

    showToast(`${item.name || "Item"} added to your order`, "success")
  }

  const handleToggleAddOn = (addon: any) => {
    setEditedAddOns((prevAddOns) => {
      const exists = prevAddOns.some((a) => a.id === addon.id)
      if (exists) {
        return prevAddOns.filter((a) => a.id !== addon.id)
      } else {
        return [...prevAddOns, addon]
      }
    })
  }

  const handleRetryLoadCart = () => {
    // Force reload cart from localStorage
    setCartChecked(false)
    setCartRetryCount(0)

    // Refresh the page as a last resort
    window.location.reload()
  }

  // Calculate the edited subtotal
  const editedSubtotal = editedItems.reduce((sum, item) => {
    const itemPrice = item.price || item.basePrice || 0
    return sum + itemPrice * (item.quantity || 1)
  }, 0)

  // Calculate the edited total
  const editedTax = editedSubtotal * 0.12
  const editedServiceCharge = serviceType === "service" ? editedSubtotal * 0.15 : 0
  const editedTotal = editedSubtotal + editedTax + editedServiceCharge + deliveryFee

  // Calculate the total for the edited item
  const calculateEditedItemTotal = () => {
    if (!editingItem) return 0
    const basePrice = editingItem.basePrice || editingItem.price || 0
    const addOnsPrice = editedAddOns.reduce((sum, addon) => sum + (addon.price || 0), 0)
    return (basePrice + addOnsPrice) * editedQuantity
  }

  // Calculate the all edited items subtotal
  const allEditedSubtotal = allEditedItems.reduce((sum, item) => {
    const basePrice = item.basePrice || item.price || 0
    const addOnsPrice = (item.addOns || []).reduce((sum: number, addon: any) => sum + (addon.price || 0), 0)
    return sum + (basePrice + addOnsPrice) * (item.quantity || 1)
  }, 0)

  // Calculate the all edited items total
  const allEditedTax = allEditedSubtotal * 0.12
  const allEditedServiceCharge = serviceType === "service" ? allEditedSubtotal * 0.15 : 0
  const allEditedTotal = allEditedSubtotal + allEditedTax + allEditedServiceCharge + deliveryFee

  // If user is not logged in, show login prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserHeader />
        <div className="mx-auto max-w-md p-6 flex flex-col items-center justify-center min-h-[80vh]">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Sign in to continue</h1>
            <p className="text-gray-600">Please sign in or create an account to complete your order</p>
          </div>

          <div className="w-full">
            <LoginModal redirectTo="/checkout" isCheckout={true}>
              <Button className="w-full mb-4">Sign in to continue</Button>
            </LoginModal>

            <Button variant="outline" asChild className="w-full">
              <Link href={`/chefs/${chef.id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to menu
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Show loading state
  if (isLoading || pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserHeader />
        <div className="mx-auto max-w-md p-6 flex flex-col items-center justify-center min-h-[80vh]">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black mb-4"></div>
          <p className="text-lg text-gray-600">Loading your order...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error || hasError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserHeader />
        <div className="mx-auto max-w-md p-6 flex flex-col items-center justify-center min-h-[80vh]">
          <div className="text-center mb-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-6">{error || "We couldn't load your order details. Please try again."}</p>
            <Button onClick={handleRetryLoadCart} className="w-full mb-4">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
            <Button asChild className="w-full mb-4">
              <Link href="/">Go to homepage</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/chefs">Browse chefs</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // If there are no items in the cart, show empty cart message
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserHeader />
        <div className="mx-auto max-w-md p-6 flex flex-col items-center justify-center min-h-[80vh]">
          <div className="text-center mb-8">
            <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-gray-600 mb-6">Add some delicious items to your cart to proceed with checkout</p>

            <Button onClick={handleRetryLoadCart} className="w-full mb-4">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Cart
            </Button>

            <Button variant="outline" asChild className="w-full">
              <Link href={`/chefs/${chef.id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Browse menu
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />

      <div className="mx-auto max-w-6xl p-4 md:p-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href={`/chefs/${chef.id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="ml-1">Back to {chef.name}'s menu</span>
          </Link>
        </Button>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">Checkout</h1>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <Button variant="outline" onClick={handleEditAllItems}>
              <PenSquare className="mr-2 h-4 w-4" />
              Edit Items
            </Button>
            <Button variant="outline" onClick={handleEditOrder}>
              <PenSquare className="mr-2 h-4 w-4" />
              Edit Order
            </Button>
          </div>
        </div>

        <form onSubmit={handleReviewOrder}>
          <div className="grid gap-6 md:grid-cols-5">
            <div className="md:col-span-3 md:pr-6">
              {/* Order Items with Images */}
              <div className="mb-6 rounded-lg border bg-white p-6">
                <h2 className="mb-4 flex items-center text-lg font-semibold">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Your Order ({items.length} {items.length === 1 ? "item" : "items"})
                </h2>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 rounded-lg border p-3">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                        <OptimizedImage
                          src={item.image || "/placeholder.svg?height=80&width=80&query=food"}
                          alt={item.name || "Food item"}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">
                            {item.quantity || 1}x {item.name || "Food item"}
                          </h3>
                          <p className="font-medium">
                            ${((item.basePrice || item.price || 0) * (item.quantity || 1)).toFixed(2)}
                          </p>
                        </div>
                        {item.addOns && item.addOns.length > 0 && (
                          <div className="mt-1 text-sm text-gray-500">
                            {item.addOns.map((addon: any, index: number) => (
                              <div key={index}>+ {addon.name || "Add-on"}</div>
                            ))}
                          </div>
                        )}
                        {item.specialInstructions && (
                          <p className="mt-1 text-xs italic text-gray-500">Note: {item.specialInstructions}</p>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="mt-1 h-7 text-xs text-blue-600 hover:text-blue-800"
                          onClick={() => handleEditItem(item.id)}
                        >
                          <Edit2 className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6 rounded-lg border bg-white p-6">
                <h2 className="mb-4 flex items-center text-lg font-semibold">
                  <MapPin className="mr-2 h-5 w-5" />
                  Delivery Address
                </h2>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium">Address</label>
                  <Input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Apartment/Suite/Floor</label>
                    <Input type="text" placeholder="Optional" className="w-full" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Buzzer Code</label>
                    <Input type="text" placeholder="Optional" className="w-full" />
                  </div>
                </div>
              </div>

              <div className="mb-6 rounded-lg border bg-white p-6">
                <h2 className="mb-4 flex items-center text-lg font-semibold">
                  <Clock className="mr-2 h-5 w-5" />
                  Service Options
                </h2>

                <div className="mb-6">
                  <RadioGroup value={serviceType} onValueChange={setServiceType} className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery" className="flex cursor-pointer items-center">
                        <Truck className="mr-2 h-4 w-4" />
                        <div>
                          <div className="font-medium">Delivery</div>
                          <div className="text-sm text-gray-500">{chef.name}'s meals delivered to your door</div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="service" id="service" />
                      <Label htmlFor="service" className="flex cursor-pointer items-center">
                        <ChefHat className="mr-2 h-4 w-4" />
                        <div>
                          <div className="font-medium">Chef Service</div>
                          <div className="text-sm text-gray-500">
                            {chef.name} comes to your location to prepare and serve meals
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Tabs value={serviceType} className="w-full">
                  <TabsContent value="delivery" className="mt-0">
                    <div className="space-y-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium">Delivery Date</label>
                        <Input
                          type="date"
                          className="w-full"
                          value={deliveryDate}
                          onChange={(e) => setDeliveryDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          required={serviceType === "delivery"}
                        />
                      </div>

                      {/* Time Slot Selector for Delivery */}
                      <TimeSlotSelector selectedTime={deliveryTime} onTimeSelect={setDeliveryTime} />
                    </div>
                  </TabsContent>

                  <TabsContent value="service" className="mt-0">
                    <div className="space-y-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium">Service Date</label>
                        <Input
                          type="date"
                          className="w-full"
                          value={serviceDate}
                          onChange={(e) => setServiceDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          required={serviceType === "service"}
                        />
                      </div>

                      {/* Time Slot Selector for Service */}
                      <TimeSlotSelector selectedTime={serviceStartTime} onTimeSelect={setServiceStartTime} />

                      <div>
                        <label className="mb-1 block text-sm font-medium">Duration (minimum 3 hours)</label>
                        <div className="flex items-center">
                          <input
                            type="range"
                            min="3"
                            max="8"
                            step="1"
                            value={serviceDuration}
                            onChange={(e) => setServiceDuration(Number.parseInt(e.target.value))}
                            className="w-full"
                          />
                          <span className="ml-2 w-16 text-center">{serviceDuration} hours</span>
                        </div>
                      </div>

                      {serviceStartTime && (
                        <div className="rounded-md bg-gray-50 p-3">
                          <p className="text-sm">
                            {chef.name} will arrive 30 minutes before the start time to set up and will serve from{" "}
                            <span className="font-medium">
                              {serviceStartTime} to {serviceEndTime}
                            </span>
                          </p>
                        </div>
                      )}

                      <div className="rounded-md bg-yellow-50 p-3">
                        <p className="text-sm text-yellow-800">
                          <span className="font-medium">Note:</span> {chef.name}'s service includes meal preparation,
                          serving, and cleanup. A 15% service charge will be added to your total.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-4">
                  <label className="mb-1 block text-sm font-medium">Special Instructions</label>
                  <Textarea
                    placeholder="Allergies, dietary restrictions, or delivery instructions"
                    className="w-full"
                    rows={3}
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                  />
                </div>
              </div>

              <div className="rounded-lg border bg-white p-6">
                <h2 className="mb-4 flex items-center text-lg font-semibold">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Payment Method
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center rounded-md border p-3 hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="credit-card"
                      checked={paymentMethod === "credit-card"}
                      onChange={() => setPaymentMethod("credit-card")}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">Credit Card</div>
                      <div className="text-sm text-gray-500">Pay with Visa, Mastercard, etc.</div>
                    </div>
                  </label>

                  <label className="flex items-center rounded-md border p-3 hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === "paypal"}
                      onChange={() => setPaymentMethod("paypal")}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">PayPal</div>
                      <div className="text-sm text-gray-500">Pay with your PayPal account</div>
                    </div>
                  </label>

                  <label className="flex items-center rounded-md border p-3 hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="e-transfer"
                      checked={paymentMethod === "e-transfer"}
                      onChange={() => setPaymentMethod("e-transfer")}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">E-Transfer</div>
                      <div className="text-sm text-gray-500">Send payment via email transfer</div>
                    </div>
                  </label>

                  <label className="flex items-center rounded-md border p-3 hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="pay-in-person"
                      checked={paymentMethod === "pay-in-person"}
                      onChange={() => setPaymentMethod("pay-in-person")}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">Pay in Person</div>
                      <div className="text-sm text-gray-500">
                        Pay with cash or card upon {serviceType === "delivery" ? "delivery" : "service"}
                      </div>
                    </div>
                  </label>
                </div>

                {paymentMethod === "credit-card" && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Card Number</label>
                      <Input type="text" placeholder="1234 5678 9012 3456" className="w-full" />
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="md:col-span-2">
                        <label className="mb-1 block text-sm font-medium">Expiration Date</label>
                        <Input type="text" placeholder="MM/YY" className="w-full" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">CVV</label>
                        <Input type="text" placeholder="123" className="w-full" />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "e-transfer" && (
                  <div className="mt-4 rounded-md bg-blue-50 p-4">
                    <p className="text-sm text-blue-800">
                      After placing your order, you'll receive an email with instructions to complete your e-transfer
                      payment to {chef.name}. Please send the payment within 24 hours to confirm your order.
                    </p>
                  </div>
                )}

                {paymentMethod === "pay-in-person" && (
                  <div className="mt-4 rounded-md bg-blue-50 p-4">
                    <p className="text-sm text-blue-800">
                      You'll pay directly to {serviceType === "delivery" ? "the delivery person" : chef.name} upon{" "}
                      {serviceType === "delivery" ? "delivery" : "service completion"}. We accept cash, credit cards,
                      and debit cards.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="sticky top-6 rounded-lg border bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center">
                  <div className="mr-3 h-10 w-10 overflow-hidden rounded-full">
                    <OptimizedImage
                      src={chef.image || "/placeholder.svg?height=40&width=40&query=chef"}
                      alt={chef.name || "Chef"}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{chef.name || "Chef"}</h3>
                    <p className="text-sm text-gray-500">{chef.cuisine || "Various Cuisines"}</p>
                  </div>
                </div>

                <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>

                <div className="mb-4 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="mb-3 flex justify-between">
                      <div>
                        <span className="font-medium">{item.quantity || 1}x</span> {item.name || "Food item"}
                        {item.addOns && item.addOns.length > 0 && (
                          <div className="text-xs text-gray-500">
                            {item.addOns.map((addon: any, index: number) => (
                              <div key={index}>+ {addon.name || "Add-on"}</div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        $
                        {((item.basePrice || item.price || 0) * (item.quantity || 1) + (item.addOnsPrice || 0)).toFixed(
                          2,
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-4 border-t border-dashed pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {serviceType === "service" && (
                    <div className="mt-2 flex justify-between text-sm">
                      <span>Service Charge (15%)</span>
                      <span>${serviceCharge.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="mt-2 flex justify-between text-sm">
                    <span>Delivery Fee</span>
                    <span>{deliveryFee === 0 ? "Included" : `$${deliveryFee.toFixed(2)}`}</span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span>Tax (12%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="mt-3 flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    type="submit"
                    className="w-full bg-black text-white hover:bg-black/90"
                    disabled={isProcessing}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Review Order
                  </Button>

                  <Button
                    type="button"
                    className="w-full bg-green-600 text-white hover:bg-green-700"
                    disabled={isProcessing}
                    onClick={() => handlePlaceOrder()}
                  >
                    Place Order
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                {serviceType === "service" && (
                  <p className="mt-3 text-center text-xs text-gray-500">
                    By placing this booking, you agree to our chef service terms and conditions.
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Dialogs and modals remain the same */}
        {/* ... */}
      </div>
    </div>
  )
}
