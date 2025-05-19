"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ChefHat, Clock, MapPin, CreditCard, ArrowRight, Check, Info, Settings, Receipt } from "lucide-react"
import { MessageSquare, Phone, Send, HelpCircle } from "lucide-react"
import UserHeader from "@/components/user-header"
import { useOrder } from "@/hooks/use-order"
import { chefDylan } from "@/data/chef-dylan"
import { AnimatedProgressBar } from "@/components/animated-progress-bar"
import { motion, AnimatePresence } from "framer-motion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

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

  // Message dialog state
  const [messageDialogOpen, setMessageDialogOpen] = useState(false)
  const [messageText, setMessageText] = useState("")
  const [sendingMessage, setSendingMessage] = useState(false)

  // Add these state variables after the existing state declarations
  const [expandedPromptIndex, setExpandedPromptIndex] = useState<number | null>(null)
  const [promptDetails, setPromptDetails] = useState<string>("")

  // Sample data - in a real app, this would come from the previous checkout page
  const orderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000)
  const orderDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const deliveryDate = "2025-05-18"
  const deliveryTime = "5:00 PM"
  const address = "3437 W 2nd Avenue, Vancouver, BC"
  const paymentMethod = "Credit Card"
  const tax = subtotal * 0.12
  const deliveryFee = 4.99
  const serviceCharge = 0
  const total = subtotal + tax + deliveryFee + serviceCharge

  // Replace the existing messagePrompts array with this more detailed structure
  const messagePrompts = [
    {
      title: "I have dietary restrictions not mentioned in my order.",
      detailsLabel: "Please specify your dietary restrictions:",
      placeholder: "E.g., severe nut allergy, lactose intolerance, etc.",
    },
    {
      title: "I need to change my delivery time.",
      detailsLabel: "What time would work better for you?",
      placeholder: "E.g., between 6-7 PM instead of 5 PM",
    },
    {
      title: "I'd like to add a special request for my meal.",
      detailsLabel: "What special request would you like to add?",
      placeholder: "E.g., extra spicy, no cilantro, etc.",
    },
    {
      title: "Do you have recommendations for serving this meal?",
      detailsLabel: "Any specific aspects you'd like recommendations for?",
      placeholder: "E.g., wine pairing, serving temperature, etc.",
    },
    {
      title: "I have a question about one of the dishes.",
      detailsLabel: "Which dish and what would you like to know?",
      placeholder: "E.g., ingredients in the Chicken Biryani, etc.",
    },
  ]

  // Add this function before the handleSendMessage function
  const addDetailedPromptToMessage = () => {
    if (!promptDetails.trim() || expandedPromptIndex === null) return

    const prompt = messagePrompts[expandedPromptIndex]
    const formattedMessage = `${prompt.title}\n${promptDetails}`

    setMessageText((prev) => {
      if (prev.trim()) {
        return `${prev}\n\n${formattedMessage}`
      }
      return formattedMessage
    })

    // Reset after adding to message
    setPromptDetails("")
    setExpandedPromptIndex(null)
  }

  // Handle sending the message
  const handleSendMessage = async () => {
    if (!messageText.trim()) {
      toast({
        title: "Message cannot be empty",
        description: "Please enter a message before sending.",
        variant: "destructive",
      })
      return
    }

    setSendingMessage(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Message sent!",
        description: "Chef Dylan will respond to your message shortly.",
        variant: "default",
      })

      setMessageText("")
      setMessageDialogOpen(false)
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again or call Chef Dylan directly.",
        variant: "destructive",
      })
    } finally {
      setSendingMessage(false)
    }
  }

  // Add prompt to message
  const addPromptToMessage = (prompt: string) => {
    setMessageText((prev) => {
      if (prev.trim()) {
        return `${prev}\n\n${prompt}`
      }
      return prompt
    })
  }

  // Calculate total number of servings
  const totalServings = items.reduce((total, item) => {
    return total + (item.quantity || 1) * (item.serves || 1)
  }, 0)

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

  // Calculate item total price including add-ons
  const calculateItemTotal = (item: any) => {
    const basePrice = (item.basePrice || 0) * (item.quantity || 1)
    const addOnsTotal = item.addOns?.reduce((total: number, addon: any) => total + (addon.price || 0), 0) || 0
    return basePrice + addOnsTotal
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserHeader />

        <div className="mx-auto max-w-3xl px-4 py-8">
          {/* Order Confirmation Header */}
          <div className="mb-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <Check className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <h1 className="mb-2 text-3xl font-bold">Order Confirmed!</h1>
            <p className="text-gray-600">Your order #{orderNumber} has been successfully placed with Chef Dylan.</p>
          </div>

          {/* Chef Contact Section - FIRST SECTION */}
          <div className="mb-6 rounded-lg border bg-blue-50 p-5 shadow-md">
            <div className="flex items-center gap-4 mb-3">
              <div className="h-16 w-16 overflow-hidden rounded-full flex-shrink-0">
                <Image
                  src={chefDylan.image || "/placeholder.svg?height=64&width=64&query=chef"}
                  alt={chefDylan.name}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-blue-600" />
                  Need to Contact Chef Dylan?
                </h2>
                <p className="text-blue-700 font-medium">
                  Questions about your order? Special requests? Contact directly!
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
              <Button
                variant="default"
                size="lg"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
                onClick={() => setMessageDialogOpen(true)}
              >
                <MessageSquare className="h-5 w-5" />
                Message Chef Dylan
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50 text-lg py-6"
                onClick={() => {
                  // In a real app, this would open the phone app or show the phone number
                  window.open(`tel:${chefDylan.phone || "+1-555-123-4567"}`)
                }}
              >
                <Phone className="h-5 w-5" />
                Call Chef: +1-555-123-4567
              </Button>
            </div>

            <p className="mt-3 text-sm text-blue-600 text-center">Chef Dylan typically responds within 2 hours</p>
          </div>

          {/* Message Dialog */}
          <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Message Chef Dylan
                </DialogTitle>
                <DialogDescription>
                  Send a message about your order #{orderNumber}. Chef Dylan typically responds within 2 hours.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="message" className="text-base font-medium">
                    Your Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Type your message here..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="h-32 mt-2"
                  />
                </div>

                {/* Replace the existing prompt buttons section with this enhanced version: */}
                <div>
                  <Label className="text-base font-medium flex items-center">
                    <HelpCircle className="h-4 w-4 mr-1" />
                    Common Questions
                  </Label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {messagePrompts.map((prompt, index) => (
                      <div key={index} className="border rounded-md overflow-hidden">
                        <Button
                          variant="outline"
                          className={`w-full justify-start h-auto py-2 px-3 text-left ${
                            expandedPromptIndex === index ? "bg-blue-50 border-blue-200" : ""
                          }`}
                          onClick={() => {
                            setExpandedPromptIndex(expandedPromptIndex === index ? null : index)
                            if (expandedPromptIndex === index) {
                              setPromptDetails("")
                            }
                          }}
                        >
                          <div className="flex justify-between items-center w-full">
                            <span>{prompt.title}</span>
                            <span className="text-gray-400">
                              {expandedPromptIndex === index ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-chevron-up"
                                >
                                  <path d="m18 15-6-6-6 6" />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-chevron-down"
                                >
                                  <path d="m6 9 6 6 6-6" />
                                </svg>
                              )}
                            </span>
                          </div>
                        </Button>

                        {expandedPromptIndex === index && (
                          <div className="p-3 bg-blue-50 border-t border-blue-200">
                            <Label htmlFor={`prompt-details-${index}`} className="text-sm font-medium">
                              {prompt.detailsLabel}
                            </Label>
                            <Textarea
                              id={`prompt-details-${index}`}
                              placeholder={prompt.placeholder}
                              value={promptDetails}
                              onChange={(e) => setPromptDetails(e.target.value)}
                              className="mt-1 h-20"
                            />
                            <div className="flex justify-end mt-2">
                              <Button size="sm" onClick={addDetailedPromptToMessage} disabled={!promptDetails.trim()}>
                                Add to Message
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="ghost" onClick={() => setMessageDialogOpen(false)} disabled={sendingMessage}>
                  Cancel
                </Button>
                <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700" disabled={sendingMessage}>
                  {sendingMessage ? (
                    <>
                      <span className="mr-2">Sending...</span>
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Items Purchased - SECOND SECTION */}
          <div className="mb-6 rounded-lg border bg-white p-5 shadow-md">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Receipt className="mr-2 h-5 w-5" />
              Your Indian Fusion Experience
            </h2>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                A vibrant celebration of Indian flavors with Chef Dylan's signature fusion twist
              </p>
              <div className="mt-3 flex flex-wrap justify-between items-center">
                <div>
                  <p className="font-medium">$80.00 per person</p>
                  <p className="text-sm text-gray-600">Includes delivery</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Number of people: 2</p>
                  <p className="font-bold text-lg">Total: $160.00</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Appetizer */}
              <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                <div className="p-3 border-b bg-gray-50">
                  <h3 className="font-bold">Appetizer</h3>
                </div>
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/3 h-48 md:h-auto relative">
                    <Image
                      src="/meals/vegetable-pakora-deluxe.png"
                      alt="Vegetable Pakora"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 flex-1">
                    <h4 className="font-semibold text-lg">VEGETABLE PAKORA</h4>
                    <p className="text-gray-700 mt-1">Chickpea Batter–Fried Seasonal Vegetables / Tangy Mint Chutney</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="text-xs bg-green-100 px-2 py-1 rounded-full">Vegetarian</span>
                      <span className="text-xs bg-yellow-100 px-2 py-1 rounded-full">Gluten-Free</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Course */}
              <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                <div className="p-3 border-b bg-gray-50">
                  <h3 className="font-bold">Main Course</h3>
                </div>
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/3 h-48 md:h-auto relative">
                    <Image
                      src="/meals/chicken-biryani-deluxe.png"
                      alt="Chicken Biryani"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 flex-1">
                    <h4 className="font-semibold text-lg">CHICKEN BIRYANI</h4>
                    <p className="text-gray-700 mt-1">
                      Basmati Rice / Aromatic Spice Blend / Saffron / Crispy Fried Onions
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="text-xs bg-orange-100 px-2 py-1 rounded-full">Spicy</span>
                      <span className="text-xs bg-yellow-100 px-2 py-1 rounded-full">Gluten-Free</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Side */}
              <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                <div className="p-3 border-b bg-gray-50">
                  <h3 className="font-bold">Side</h3>
                </div>
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/3 h-48 md:h-auto relative">
                    <Image src="/meals/garlic-naan-deluxe.png" alt="Garlic Naan Bread" fill className="object-cover" />
                  </div>
                  <div className="p-4 flex-1">
                    <h4 className="font-semibold text-lg">GARLIC NAAN BREAD</h4>
                    <p className="text-gray-700 mt-1">Leavened Flatbread / Roasted Garlic / Butter / Fresh Cilantro</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="text-xs bg-blue-100 px-2 py-1 rounded-full">Vegetarian</span>
                      <span className="text-xs bg-purple-100 px-2 py-1 rounded-full">Contains Gluten</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dessert */}
              <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                <div className="p-3 border-b bg-gray-50">
                  <h3 className="font-bold">Dessert</h3>
                </div>
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/3 h-48 md:h-auto relative">
                    <Image src="/meals/gulab-jamun-deluxe.png" alt="Gulab Jamun" fill className="object-cover" />
                  </div>
                  <div className="p-4 flex-1">
                    <h4 className="font-semibold text-lg">GULAB JAMUN</h4>
                    <p className="text-gray-700 mt-1">
                      Milk Dumplings / Rose-Scented Syrup / Cardamom / Pistachio Crush
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="text-xs bg-blue-100 px-2 py-1 rounded-full">Vegetarian</span>
                      <span className="text-xs bg-pink-100 px-2 py-1 rounded-full">Contains Nuts</span>
                      <span className="text-xs bg-indigo-100 px-2 py-1 rounded-full">Sweet</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Note:</span> All dishes are prepared fresh on the day of delivery. Heating
                instructions will be included.
              </p>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="mb-6 rounded-lg border bg-white p-5 shadow-md">
            <h2 className="text-lg font-bold mb-3 flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Delivery Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-medium">
                  {deliveryDate} at {deliveryTime}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Serving</p>
                <p className="font-medium">{totalServings} people</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{address}</p>
              </div>
            </div>
          </div>

          {/* Order Summary - THIRD SECTION */}
          <div className="mb-6 rounded-lg border bg-white p-5 shadow-md">
            <div className="flex justify-between items-center mb-4 pb-3 border-b">
              <h2 className="text-xl font-bold flex items-center">
                <Receipt className="mr-2 h-5 w-5" />
                Order Summary
              </h2>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-700">${total.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Paid with {paymentMethod}</p>
              </div>
            </div>

            {/* Price Summary */}
            <div className="pt-3">
              <div className="grid grid-cols-2 gap-y-1 text-sm">
                <div>Subtotal:</div>
                <div className="text-right">${subtotal.toFixed(2)}</div>

                <div>Tax (12%):</div>
                <div className="text-right">${tax.toFixed(2)}</div>

                <div>Delivery Fee:</div>
                <div className="text-right">${deliveryFee.toFixed(2)}</div>

                {serviceCharge > 0 && (
                  <>
                    <div>Service Charge:</div>
                    <div className="text-right">${serviceCharge.toFixed(2)}</div>
                  </>
                )}
              </div>

              <div className="flex justify-between font-bold text-lg mt-3 pt-2 border-t">
                <span>Total Paid:</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <div className="mt-2 text-sm text-gray-600">
                <p>Order placed on {orderDate}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button asChild className="bg-black text-white hover:bg-black/90">
              <Link href="/dashboard">View order in your account</Link>
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
