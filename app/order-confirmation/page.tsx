"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ChefHat, Clock, MapPin, CreditCard, ArrowRight, Check, Info, Settings } from "lucide-react"
import UserHeader from "@/components/user-header"
import { useOrder } from "@/hooks/use-order"
import { chefDylan } from "@/data/chef-dylan"
import { AnimatedProgressBar } from "@/components/animated-progress-bar"
import { motion, AnimatePresence } from "framer-motion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function OrderConfirmationPage() {
  const router = useRouter()
  const { items, subtotal, clearOrder } = useOrder()
  const [isLoading, setIsLoading] = useState(true)
  const [secondsLeft, setSecondsLeft] = useState(8)
  const [showConfetti, setShowConfetti] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, string[]>>({})
  const [specialInstructions, setSpecialInstructions] = useState<Record<string, string>>({})
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  // Sample data - in a real app, this would come from the previous checkout page
  const deliveryDate = "2025-05-18"
  const deliveryTime = "5:00 PM"
  const address = "3437 W 2nd Avenue, Vancouver, BC"
  const paymentMethod = "Credit Card"
  const tax = subtotal * 0.12
  const deliveryFee = 4.99
  const serviceCharge = 0
  const total = subtotal + tax + deliveryFee + serviceCharge

  // Initialize quantities and selected add-ons from order items
  useEffect(() => {
    const initialQuantities: Record<string, number> = {}
    const initialAddOns: Record<string, string[]> = {}
    const initialInstructions: Record<string, string> = {}

    items.forEach((item) => {
      initialQuantities[item.id] = item.quantity || 1
      initialAddOns[item.id] = item.addOns?.map((addon) => addon.id) || []
      initialInstructions[item.id] = item.specialInstructions || ""
    })

    setQuantities(initialQuantities)
    setSelectedAddOns(initialAddOns)
    setSpecialInstructions(initialInstructions)
  }, [items])

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoading && secondsLeft > 0) {
      const timer = setTimeout(() => {
        setSecondsLeft(secondsLeft - 1)
      }, 1000)

      return () => clearTimeout(timer)
    } else if (secondsLeft === 0) {
      // Auto-redirect to payment
      handlePayNow()
    }
  }, [isLoading, secondsLeft])

  const handlePayNow = () => {
    setShowConfetti(true)

    // Simulate payment processing
    setTimeout(() => {
      setOrderComplete(true)
      clearOrder()
    }, 1500)
  }

  const handleAddOnToggle = (itemId: string, addOnId: string) => {
    setSelectedAddOns((prev) => {
      const current = prev[itemId] || []
      if (current.includes(addOnId)) {
        return {
          ...prev,
          [itemId]: current.filter((id) => id !== addOnId),
        }
      } else {
        return {
          ...prev,
          [itemId]: [...current, addOnId],
        }
      }
    })
  }

  const handleQuantityChange = (itemId: string, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) + change),
    }))
  }

  const handleSpecialInstructionsChange = (itemId: string, instructions: string) => {
    setSpecialInstructions((prev) => ({
      ...prev,
      [itemId]: instructions,
    }))
  }

  // Get add-on details by ID for an item
  const getAddOnById = (item: any, id: string) => {
    return item.addOns?.find((addOn: any) => addOn.id === id)
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserHeader />

        <div className="mx-auto max-w-3xl px-4 py-12 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
              <Check className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <h1 className="mb-2 text-3xl font-bold">Order Confirmed!</h1>
          <p className="mb-8 text-lg text-gray-600">
            Your order with Chef Dylan has been booked successfully. You'll receive a confirmation email shortly.
          </p>

          <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="font-medium">Delivery date:</div>
              <div className="text-right">{deliveryDate}</div>

              <div className="font-medium">Delivery time:</div>
              <div className="text-right">{deliveryTime}</div>

              <div className="font-medium">Delivery address:</div>
              <div className="text-right">{address}</div>

              <div className="font-medium">Payment method:</div>
              <div className="text-right">{paymentMethod}</div>

              <div className="font-medium">Order total:</div>
              <div className="text-right">${total.toFixed(2)}</div>
            </div>
          </div>

          <Button asChild className="bg-black text-white hover:bg-black/90">
            <Link href="/dashboard">View order in your account</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />

      <div className="mx-auto max-w-3xl px-4 py-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/checkout">
            <ArrowLeft className="h-4 w-4" />
            <span className="ml-1">Back to checkout</span>
          </Link>
        </Button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold">Order Confirmation</h1>
          <p className="text-gray-600">Please review your order details before proceeding to payment.</p>
        </div>

        {!isLoading && (
          <div className="mb-6">
            <p className="mb-2 text-center font-medium">Proceeding to payment in {secondsLeft} seconds</p>
            <AnimatedProgressBar progress={((8 - secondsLeft) / 8) * 100} duration={1000} />
          </div>
        )}

        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center text-lg font-semibold">
              <ChefHat className="mr-2 h-5 w-5" />
              Chef Details
            </h2>

            <div className="flex items-center">
              <div className="mr-4 h-16 w-16 overflow-hidden rounded-full">
                <Image
                  src={chefDylan.image || "/placeholder.svg?height=64&width=64&query=chef"}
                  alt={chefDylan.name}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{chefDylan.name}</h3>
                <p className="text-sm text-gray-500">{chefDylan.cuisine}</p>
                <div className="mt-1 flex items-center text-sm text-yellow-500">
                  <span>★★★★★</span>
                  <span className="ml-1 text-gray-600">(4.9)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center text-lg font-semibold">Order Items</h2>

            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="overflow-hidden rounded-lg border bg-white">
                  <div className="flex flex-col md:flex-row">
                    <div className="h-48 w-full md:h-auto md:w-1/3">
                      <Image
                        src={item.image || "/placeholder.svg?height=200&width=200&query=food"}
                        alt={item.name}
                        width={300}
                        height={200}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <div className="mb-2 flex justify-between">
                        <h3 className="text-lg font-semibold">
                          {quantities[item.id] || 1}x {item.name}
                        </h3>
                        <p className="font-semibold">
                          ${((item.basePrice || 0) * (quantities[item.id] || 1)).toFixed(2)}
                        </p>
                      </div>

                      {/* Tabbed interface for item details */}
                      <Tabs defaultValue="included" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="included" className="flex items-center">
                            <Check className="mr-1 h-4 w-4" />
                            <span>What's Included</span>
                          </TabsTrigger>
                          <TabsTrigger value="expect" className="flex items-center">
                            <Info className="mr-1 h-4 w-4" />
                            <span>What to Expect</span>
                          </TabsTrigger>
                          <TabsTrigger value="customize" className="flex items-center">
                            <Settings className="mr-1 h-4 w-4" />
                            <span>Customize Item</span>
                          </TabsTrigger>
                        </TabsList>

                        {/* What's Included Tab */}
                        <TabsContent value="included" className="mt-4 space-y-4">
                          <div>
                            <p className="text-gray-700">{item.description}</p>

                            {item.courses ? (
                              // For complete meals with courses
                              <div className="mt-4 space-y-3">
                                {Object.entries(item.courses).map(([courseType, dishes]) => (
                                  <div key={courseType} className="space-y-1">
                                    <h4 className="font-medium capitalize">{courseType}:</h4>
                                    <ul className="list-disc pl-5 space-y-1">
                                      {dishes.map((dish, index) => (
                                        <li key={index} className="text-gray-700">
                                          {dish}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="mt-4">
                                <p className="text-gray-700">Serves: {item.serves || 1} people</p>

                                {item.dietaryInfo && item.dietaryInfo.length > 0 && (
                                  <div className="mt-3">
                                    <h4 className="font-medium">Dietary Information:</h4>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      {item.dietaryInfo.map((info, index) => (
                                        <span key={index} className="rounded-full bg-gray-200 px-3 py-1 text-xs">
                                          {info}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </TabsContent>

                        {/* What to Expect Tab */}
                        <TabsContent value="expect" className="mt-4 space-y-4">
                          <div className="space-y-4">
                            {/* Preparation */}
                            <div>
                              <h4 className="font-medium">Preparation:</h4>
                              <p className="text-gray-700 mt-1">
                                {item.preparation ||
                                  `Our chef will prepare this ${
                                    item.category === "indian"
                                      ? "authentic Indian"
                                      : item.category === "cantonese"
                                        ? "traditional Cantonese"
                                        : item.category === "bbq"
                                          ? "classic BBQ"
                                          : "gourmet"
                                  } meal fresh on the day of delivery. All ingredients are sourced from local suppliers where possible.`}
                              </p>
                            </div>

                            {/* Delivery Time */}
                            <div>
                              <h4 className="font-medium">Estimated Delivery:</h4>
                              <p className="text-gray-700 mt-1">
                                Your order will be delivered on {deliveryDate} at {deliveryTime}. You'll receive a
                                notification when your chef begins preparing your meal.
                              </p>
                            </div>

                            {/* Service */}
                            <div>
                              <h4 className="font-medium">Service:</h4>
                              <p className="text-gray-700 mt-1">
                                {item.service ||
                                  `Your meal will be delivered in temperature-controlled containers to ensure optimal freshness. ${
                                    item.category === "indian"
                                      ? "Each dish is packaged separately to maintain its distinct flavors."
                                      : item.category === "cantonese"
                                        ? "All dishes are arranged for family-style serving."
                                        : item.category === "bbq"
                                          ? "The BBQ items come with heating instructions for the perfect finish."
                                          : "Detailed heating and serving instructions are included."
                                  }`}
                              </p>
                            </div>

                            {/* Customer Instructions */}
                            <div>
                              <h4 className="font-medium">Customer Instructions:</h4>
                              <p className="text-gray-700 mt-1">
                                {specialInstructions[item.id] || "No special instructions provided."}
                              </p>
                            </div>
                          </div>
                        </TabsContent>

                        {/* Customize Item Tab */}
                        <TabsContent value="customize" className="mt-4 space-y-4">
                          {/* Quantity selector */}
                          <div>
                            <h4 className="font-medium">Quantity:</h4>
                            <div className="flex items-center mt-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleQuantityChange(item.id, -1)}
                                disabled={(quantities[item.id] || 1) <= 1}
                                className="h-8 w-8"
                              >
                                <ArrowLeft className="h-4 w-4" />
                              </Button>
                              <span className="mx-3 w-8 text-center">{quantities[item.id] || 1}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleQuantityChange(item.id, 1)}
                                className="h-8 w-8"
                              >
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Add-ons */}
                          {item.addOns && item.addOns.length > 0 && (
                            <div>
                              <h4 className="font-medium">Add-ons:</h4>
                              <div className="space-y-2 mt-2">
                                {item.addOns.map((addOn: any) => (
                                  <div
                                    key={addOn.id}
                                    className="flex items-center justify-between p-3 border rounded-md"
                                  >
                                    <div className="flex items-center gap-2">
                                      <Checkbox
                                        id={`addon-${item.id}-${addOn.id}`}
                                        checked={(selectedAddOns[item.id] || []).includes(addOn.id)}
                                        onCheckedChange={() => handleAddOnToggle(item.id, addOn.id)}
                                      />
                                      <div>
                                        <Label
                                          htmlFor={`addon-${item.id}-${addOn.id}`}
                                          className="font-medium cursor-pointer"
                                        >
                                          {addOn.name}
                                        </Label>
                                        <p className="text-sm text-gray-600">{addOn.description}</p>
                                      </div>
                                    </div>
                                    <span className="font-medium">+${addOn.price.toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Special instructions */}
                          <div>
                            <h4 className="font-medium">Special Instructions:</h4>
                            <textarea
                              className="w-full mt-2 p-3 border rounded-md h-24 resize-none"
                              placeholder="Any special requests or dietary concerns?"
                              value={specialInstructions[item.id] || ""}
                              onChange={(e) => handleSpecialInstructionsChange(item.id, e.target.value)}
                            />
                          </div>
                        </TabsContent>
                      </Tabs>

                      <div className="mt-4">
                        <div className="flex flex-wrap gap-2">
                          {item.dietaryInfo &&
                            item.dietaryInfo.map((tag, i) => (
                              <span key={i} className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                                {tag}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center text-lg font-semibold">
              <Clock className="mr-2 h-5 w-5" />
              Delivery Details
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Delivery Date</p>
                <p>{deliveryDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Delivery Time</p>
                <p>{deliveryTime}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Delivery Address</p>
                <div className="flex items-start">
                  <MapPin className="mr-1 h-4 w-4 text-gray-400" />
                  <p>{address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center text-lg font-semibold">
              <CreditCard className="mr-2 h-5 w-5" />
              Payment Summary
            </h2>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (12%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              {serviceCharge > 0 && (
                <div className="flex justify-between">
                  <span>Service Charge (15%)</span>
                  <span>${serviceCharge.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <p>Payment will be processed using {paymentMethod}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <AnimatePresence>
            {showConfetti && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center"
              >
                <div className="confetti-container">{/* Confetti animation would go here */}</div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div className="w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handlePayNow}
              className="relative w-full overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 py-6 text-lg font-bold text-white hover:from-green-600 hover:to-emerald-700"
              disabled={isLoading}
            >
              <span className="relative z-10 flex items-center justify-center">
                Pay Right Away
                <ArrowRight className="ml-2 h-5 w-5" />
              </span>
            </Button>
          </motion.div>

          <Button variant="ghost" className="mt-4" onClick={() => router.push("/checkout")}>
            Edit Order
          </Button>
        </div>
      </div>
    </div>
  )
}
