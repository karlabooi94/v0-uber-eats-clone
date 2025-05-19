"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Check, Info, ArrowLeft, Minus, Plus, AlertCircle } from "lucide-react"
import { useOrder } from "@/hooks/use-order"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import DishCarouselWithAddOns from "./dish-carousel-with-addons"
import DynamicCheckoutButton from "./dynamic-checkout-button"
import { indianDinner, mealPackages } from "@/data/menu-items"
import { OptimizedImage } from "./ui/optimized-image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

// Define the complete meal package
const indianMealPackage = mealPackages.find((item) => item.name === "Indian Fusion Experience")
const PRICE_PER_PERSON = 80
const MINIMUM_PEOPLE = 2

// Define consistent image paths for each dish
const DISH_IMAGES = {
  "Vegetable Pakora": "/meals/vegetable-pakora-1.png",
  "Chicken Biryani": "/meals/chicken-biryani-2.png",
  "Chicken Tandoori": "/meals/chicken-tandoori-1.png",
  "Garlic Naan Bread": "/meals/garlic-naan-1.png",
  "Gulab Jamun": "/meals/gulab-jamun-1.png",
}

// Helper function to get the correct image for a dish
const getDishImage = (dishName) => {
  return DISH_IMAGES[dishName] || `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(dishName)}`
}

// Add a prop for initialPeopleCount to the component
export default function IndianMenu({ initialPeopleCount = MINIMUM_PEOPLE }) {
  // Ensure we have valid data for each category
  const appetizers = indianDinner.filter((item) => item.name === "Vegetable Pakora") || []
  const mainCourses =
    indianDinner.filter((item) => item.name === "Chicken Biryani" || item.name === "Chicken Tandoori") || []
  const sides = indianDinner.filter((item) => item.name === "Garlic Naan Bread") || []
  const desserts = indianDinner.filter((item) => item.name === "Gulab Jamun") || []

  const [isAdding, setIsAdding] = useState(false)
  const { addToOrder, items } = useOrder()
  const { showToast } = useToast()
  const router = useRouter()

  // Initialize peopleCount with the value from props, ensuring it's at least MINIMUM_PEOPLE
  const [peopleCount, setPeopleCount] = useState(Math.max(initialPeopleCount, MINIMUM_PEOPLE))

  // Update peopleCount when initialPeopleCount changes
  useEffect(() => {
    setPeopleCount(Math.max(initialPeopleCount, MINIMUM_PEOPLE))
  }, [initialPeopleCount])

  // Check if this meal is already in the order
  const isInOrder = items.some((item) => item.id === "mp1")
  const mealPackage = items.find((item) => item.id === "mp1")

  // Sync peopleCount with the order quantity if the meal is already in the order
  useEffect(() => {
    if (isInOrder && mealPackage?.quantity) {
      setPeopleCount(mealPackage.quantity)
    }
  }, [isInOrder, mealPackage])

  const [showSelectionModal, setShowSelectionModal] = useState(false)
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [showPeopleAdjustmentDialog, setShowPeopleAdjustmentDialog] = useState(false)
  const [categoryToAdjust, setCategoryToAdjust] = useState("")

  // Initialize dish quantities - set defaults based on category
  const initializeDishQuantities = () => {
    return {
      // For categories with only one option, pre-select that option for all people
      appetizers:
        appetizers.length === 1
          ? { [appetizers[0].id]: peopleCount }
          : appetizers.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {}),

      // For main courses, always start with 0 quantities to encourage selection
      mainCourses: mainCourses.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {}),

      // For categories with only one option, pre-select that option for all people
      sides:
        sides.length === 1
          ? { [sides[0].id]: peopleCount }
          : sides.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {}),

      // For categories with only one option, pre-select that option for all people
      desserts:
        desserts.length === 1
          ? { [desserts[0].id]: peopleCount }
          : desserts.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {}),
    }
  }

  // Track quantities for each dish option
  const [dishQuantities, setDishQuantities] = useState(initializeDishQuantities())

  // Calculate totals for each category
  const totals = {
    appetizers: Object.values(dishQuantities.appetizers).reduce((sum, qty) => sum + (qty as number), 0),
    mainCourses: Object.values(dishQuantities.mainCourses).reduce((sum, qty) => sum + (qty as number), 0),
    sides: Object.values(dishQuantities.sides).reduce((sum, qty) => sum + (qty as number), 0),
    desserts: Object.values(dishQuantities.desserts).reduce((sum, qty) => sum + (qty as number), 0),
  }

  // Update quantities when people count changes
  useEffect(() => {
    // When people count changes, update the default selections
    if (appetizers.length === 1) {
      setDishQuantities((prev) => ({
        ...prev,
        appetizers: { [appetizers[0].id]: peopleCount },
      }))
    }

    // For main courses, keep the current selections but ensure they don't exceed the new people count
    if (mainCourses.length > 1) {
      const currentMainCourses = { ...dishQuantities.mainCourses }
      const currentTotal = Object.values(currentMainCourses).reduce((sum, qty) => sum + (qty as number), 0)

      // If the current total exceeds the new people count, reset to 0
      if (currentTotal > peopleCount) {
        setDishQuantities((prev) => ({
          ...prev,
          mainCourses: mainCourses.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {}),
        }))
      }
    }

    if (sides.length === 1) {
      setDishQuantities((prev) => ({
        ...prev,
        sides: { [sides[0].id]: peopleCount },
      }))
    }

    if (desserts.length === 1) {
      setDishQuantities((prev) => ({
        ...prev,
        desserts: { [desserts[0].id]: peopleCount },
      }))
    }
  }, [peopleCount])

  // Check if we need to show the selection modal at all
  // Only show if there are multiple options in any category
  const needsSelectionModal = appetizers.length > 1 || mainCourses.length > 1 || sides.length > 1 || desserts.length > 1

  // Update quantity for a specific dish
  const updateDishQuantity = (category, itemId, newQuantity) => {
    const categoryQuantities = { ...dishQuantities[category] }
    const oldQuantity = categoryQuantities[itemId] || 0

    // Calculate what the new total would be for this category
    const currentTotal = Object.values(categoryQuantities).reduce((sum, qty) => sum + (qty as number), 0)
    const totalAfterChange = currentTotal - oldQuantity + Math.max(0, newQuantity)

    // If increasing and would exceed people count, show dialog
    if (newQuantity > oldQuantity && totalAfterChange > peopleCount) {
      setCategoryToAdjust(category)
      setShowPeopleAdjustmentDialog(true)
      return
    }

    // Otherwise proceed with the update
    categoryQuantities[itemId] = Math.max(0, newQuantity)

    setDishQuantities({
      ...dishQuantities,
      [category]: categoryQuantities,
    })
  }

  const handleAddToOrder = () => {
    // If we don't need a selection modal or it's already shown, proceed with adding to order
    if (!needsSelectionModal || showSelectionModal) {
      // Validate that each category has the correct total
      if (
        totals.appetizers !== peopleCount ||
        totals.mainCourses !== peopleCount ||
        totals.sides !== peopleCount ||
        totals.desserts !== peopleCount
      ) {
        showToast("Please ensure each category has exactly " + peopleCount + " selections", "error")
        return
      }

      setIsAdding(true)

      // Get selected items with quantities
      const selectedItems = {
        appetizers: appetizers
          .filter((item) => dishQuantities.appetizers[item.id] > 0)
          .map((item) => ({ ...item, quantity: dishQuantities.appetizers[item.id] })),
        mainCourses: mainCourses
          .filter((item) => dishQuantities.mainCourses[item.id] > 0)
          .map((item) => ({ ...item, quantity: dishQuantities.mainCourses[item.id] })),
        sides: sides
          .filter((item) => dishQuantities.sides[item.id] > 0)
          .map((item) => ({ ...item, quantity: dishQuantities.sides[item.id] })),
        desserts: desserts
          .filter((item) => dishQuantities.desserts[item.id] > 0)
          .map((item) => ({ ...item, quantity: dishQuantities.desserts[item.id] })),
      }

      // Format selections for display
      const formatSelections = (items) => {
        return items.map((item) => `${item.name} (×${item.quantity})`).join(", ")
      }

      // Simulate a small delay for better UX
      setTimeout(() => {
        addToOrder({
          id: "mp1",
          chefId: "dylan",
          name: "Indian Fusion Experience",
          description:
            "A vibrant celebration of Indian flavors with Chef Dylan's signature fusion twist, combining traditional techniques with local ingredients.",
          image: "/meals/indian-fusion.png",
          appetizer: formatSelections(selectedItems.appetizers),
          mainCourse: formatSelections(selectedItems.mainCourses),
          side: formatSelections(selectedItems.sides),
          dessert: formatSelections(selectedItems.desserts),
          dietaryInfo: ["Contains Gluten", "Contains Dairy", "Contains Nuts"],
          quantity: peopleCount,
          basePrice: PRICE_PER_PERSON,
          addOnsPrice: 0,
          addOns: [],
          specialInstructions: specialInstructions,
          selections: selectedItems,
        })

        setIsAdding(false)
        setShowSelectionModal(false)

        showToast(`Indian Fusion Experience for ${peopleCount} people added to your order!`, "success", 3000, {
          label: "View Order",
          onClick: () => router.push("/checkout"),
        })
      }, 500)
    } else {
      // Show the selection modal if needed
      setShowSelectionModal(true)
    }
  }

  // Calculate the total price based on the current people count
  const totalPrice = PRICE_PER_PERSON * peopleCount

  return (
    <div className="space-y-8 relative pb-20">
      {/* Featured meal package with enhanced image carousel */}
      <div className="overflow-hidden rounded-lg border bg-white shadow-md">
        <div className="p-6">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold">Indian Fusion Experience</h2>
              <p className="mt-1 text-gray-600">
                A vibrant celebration of Indian flavors with Chef Dylan's signature fusion twist
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="rounded-full bg-black px-3 py-1 text-sm font-medium text-white">
                  ${PRICE_PER_PERSON.toFixed(2)} per person
                </span>
                <span className="text-sm text-gray-500">Includes delivery</span>
              </div>
              <div className="mt-3 flex items-center">
                <div className="mr-3 text-sm font-medium">Number of people:</div>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-none"
                    onClick={() => setPeopleCount(Math.max(MINIMUM_PEOPLE, peopleCount - 1))}
                    disabled={peopleCount <= MINIMUM_PEOPLE}
                  >
                    <Minus className="h-4 w-4" />
                    <span className="sr-only">Decrease</span>
                  </Button>
                  <div className="w-10 text-center font-medium">{peopleCount}</div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-none"
                    onClick={() => setPeopleCount(peopleCount + 1)}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Increase</span>
                  </Button>
                </div>
                <div className="ml-4 font-medium">Total: ${totalPrice.toFixed(2)}</div>
              </div>
              {peopleCount === MINIMUM_PEOPLE && (
                <div className="mt-2 text-sm text-amber-600">
                  <Info className="inline-block h-3 w-3 mr-1" />
                  Minimum order is for {MINIMUM_PEOPLE} people
                </div>
              )}
            </div>
            <Button
              onClick={handleAddToOrder}
              className={`transition-all duration-200 ${isInOrder ? "bg-green-600 hover:bg-green-700" : "bg-black hover:bg-black/90"}`}
              disabled={isAdding}
              size="lg"
            >
              {isAdding ? (
                <span className="flex items-center">
                  <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Adding...
                </span>
              ) : isInOrder ? (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Added to order
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Add for {peopleCount} people - ${totalPrice.toFixed(2)}
                </>
              )}
            </Button>
          </div>

          {/* Enhanced image carousel for the meal package */}
          <div className="mb-6 h-80 overflow-hidden rounded-lg">
            <OptimizedImage
              src="/meals/indian-fusion.png"
              alt="Indian Fusion Experience"
              width={800}
              height={500}
              className="h-full w-full"
              objectFit="cover"
              priority={true}
              fallbackSrc="/indian-fusion-meal.png"
            />
          </div>

          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold">What's Included</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-3">
                <h4 className="font-medium">Appetizer</h4>
                <p className="text-sm text-gray-600">
                  VEGETABLE PAKORA - Chickpea Batter–Fried Seasonal Vegetables / Tangy Mint Chutney
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <h4 className="font-medium">Main Course</h4>
                <p className="text-sm text-gray-600">
                  CHICKEN BIRYANI - Basmati Rice / Aromatic Spice Blend / Saffron / Crispy Fried Onions
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <h4 className="font-medium">Side</h4>
                <p className="text-sm text-gray-600">
                  GARLIC NAAN BREAD - Leavened Flatbread / Roasted Garlic / Butter / Fresh Cilantro
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <h4 className="font-medium">Dessert</h4>
                <p className="text-sm text-gray-600">
                  GULAB JAMUN - Milk Dumplings / Rose-Scented Syrup / Cardamom / Pistachio Crush
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-500" />
              <div>
                <h4 className="font-medium">Dietary Information</h4>
                <p className="mt-1 text-sm text-gray-600">
                  Contains gluten, dairy, and nuts. Please inform your chef of any allergies or dietary restrictions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dish carousels by category */}
      <DishCarouselWithAddOns
        title="Appetizers"
        description="Start your meal with these flavorful options"
        items={appetizers}
      />

      <DishCarouselWithAddOns
        title="Main Courses"
        description="Signature dishes crafted with authentic spices"
        items={mainCourses}
      />

      <DishCarouselWithAddOns title="Sides" description="Perfect accompaniments to your main course" items={sides} />

      <DishCarouselWithAddOns title="Desserts" description="Sweet endings to your culinary journey" items={desserts} />

      {/* Dynamic checkout button */}
      <DynamicCheckoutButton />

      {/* Simplified Selection Modal - Only shown when there are multiple options */}
      <Dialog open={showSelectionModal} onOpenChange={setShowSelectionModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Select Your Meal Options for {peopleCount} People</DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* People count selector */}
            <div className="space-y-2">
              <h3 className="font-medium">Number of People</h3>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setPeopleCount(Math.max(MINIMUM_PEOPLE, peopleCount - 1))}
                  disabled={peopleCount <= MINIMUM_PEOPLE}
                >
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">Decrease</span>
                </Button>
                <div className="w-12 text-center font-medium">{peopleCount}</div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setPeopleCount(peopleCount + 1)}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Increase</span>
                </Button>
                <div className="ml-4">
                  <span className="font-medium">${PRICE_PER_PERSON.toFixed(2)}</span> per person ×{" "}
                  <span className="font-medium">{peopleCount}</span> ={" "}
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              {peopleCount === MINIMUM_PEOPLE && (
                <div className="text-sm text-amber-600">
                  <Info className="inline-block h-3 w-3 mr-1" />
                  Minimum order is for {MINIMUM_PEOPLE} people
                </div>
              )}
            </div>

            {/* Instructions for mixed selections */}
            <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
                <div>
                  <h4 className="font-medium text-blue-700">Mix and Match Options</h4>
                  <p className="mt-1 text-sm text-blue-600">
                    You can select different options for each person. Make sure the total quantity for each category
                    equals {peopleCount}.
                  </p>
                  <p className="mt-1 text-sm text-blue-600">
                    <strong>Scroll down</strong> to see all options and the "Add to Order" button at the bottom.
                  </p>
                </div>
              </div>
            </div>

            {/* Appetizer Selection - Only if multiple options */}
            {appetizers.length >= 1 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-lg">Select Appetizers</h3>
                  <div className="text-sm">
                    Selected:{" "}
                    <span className={totals.appetizers === peopleCount ? "font-medium" : "font-medium text-red-500"}>
                      {totals.appetizers}/{peopleCount}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  {appetizers.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-start space-x-3 border p-3 rounded-md ${
                        dishQuantities.appetizers[item.id] > 0 ? "bg-gray-50 border-gray-400" : ""
                      }`}
                    >
                      <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                        <OptimizedImage
                          src={getDishImage(item.name)}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                          fallbackSrc={`/placeholder.svg?height=64&width=64&query=${encodeURIComponent(item.name)}`}
                        />
                      </div>
                      <div className="grid gap-1.5 flex-1">
                        <div className="flex justify-between items-center">
                          <Label className="font-medium">{item.name}</Label>
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-none"
                              onClick={() =>
                                updateDishQuantity("appetizers", item.id, (dishQuantities.appetizers[item.id] || 0) - 1)
                              }
                              disabled={(dishQuantities.appetizers[item.id] || 0) <= 0}
                            >
                              <Minus className="h-3 w-3" />
                              <span className="sr-only">Decrease</span>
                            </Button>
                            <div className="w-8 text-center font-medium">{dishQuantities.appetizers[item.id] || 0}</div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-none"
                              onClick={() =>
                                updateDishQuantity("appetizers", item.id, (dishQuantities.appetizers[item.id] || 0) + 1)
                              }
                              disabled={
                                totals.appetizers >= peopleCount && (dishQuantities.appetizers[item.id] || 0) === 0
                              }
                            >
                              <Plus className="h-3 w-3" />
                              <span className="sr-only">Increase</span>
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">{item.description}</p>
                        {dishQuantities.appetizers[item.id] > 0 && (
                          <Badge variant="outline" className="w-fit mt-1">
                            {dishQuantities.appetizers[item.id]} × selected
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {totals.appetizers !== peopleCount && (
                  <div className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Please select exactly {peopleCount} appetizers in total
                  </div>
                )}
              </div>
            )}

            {/* Main Course Selection - Only if multiple options */}
            {mainCourses.length >= 1 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-lg">Select Main Courses</h3>
                  <div className="text-sm">
                    Selected:{" "}
                    <span className={totals.mainCourses === peopleCount ? "font-medium" : "font-medium text-red-500"}>
                      {totals.mainCourses}/{peopleCount}
                    </span>
                  </div>
                </div>

                {/* Prompt to encourage selection when no main courses are selected */}
                {totals.mainCourses === 0 && mainCourses.length > 1 && (
                  <div className="bg-amber-50 p-3 rounded-md border border-amber-200 mb-3">
                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-amber-700">
                        Please select your main courses. You can mix and match different options for your group.
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {mainCourses.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-start space-x-3 border p-3 rounded-md ${
                        dishQuantities.mainCourses[item.id] > 0 ? "bg-gray-50 border-gray-400" : ""
                      }`}
                    >
                      <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                        <OptimizedImage
                          src={getDishImage(item.name)}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                          fallbackSrc={`/placeholder.svg?height=64&width=64&query=${encodeURIComponent(item.name)}`}
                        />
                      </div>
                      <div className="grid gap-1.5 flex-1">
                        <div className="flex justify-between items-center">
                          <Label className="font-medium">{item.name}</Label>
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-none"
                              onClick={() =>
                                updateDishQuantity(
                                  "mainCourses",
                                  item.id,
                                  (dishQuantities.mainCourses[item.id] || 0) - 1,
                                )
                              }
                              disabled={(dishQuantities.mainCourses[item.id] || 0) <= 0}
                            >
                              <Minus className="h-3 w-3" />
                              <span className="sr-only">Decrease</span>
                            </Button>
                            <div className="w-8 text-center font-medium">
                              {dishQuantities.mainCourses[item.id] || 0}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-none"
                              onClick={() =>
                                updateDishQuantity(
                                  "mainCourses",
                                  item.id,
                                  (dishQuantities.mainCourses[item.id] || 0) + 1,
                                )
                              }
                              disabled={
                                totals.mainCourses >= peopleCount && (dishQuantities.mainCourses[item.id] || 0) === 0
                              }
                            >
                              <Plus className="h-3 w-3" />
                              <span className="sr-only">Increase</span>
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">{item.description}</p>
                        {dishQuantities.mainCourses[item.id] > 0 && (
                          <Badge variant="outline" className="w-fit mt-1">
                            {dishQuantities.mainCourses[item.id]} × selected
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {totals.mainCourses !== peopleCount && (
                  <div className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Please select exactly {peopleCount} main courses in total
                  </div>
                )}
              </div>
            )}

            {/* Side Selection - Only if multiple options */}
            {sides.length >= 1 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-lg">Select Sides</h3>
                  <div className="text-sm">
                    Selected:{" "}
                    <span className={totals.sides === peopleCount ? "font-medium" : "font-medium text-red-500"}>
                      {totals.sides}/{peopleCount}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  {sides.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-start space-x-3 border p-3 rounded-md ${
                        dishQuantities.sides[item.id] > 0 ? "bg-gray-50 border-gray-400" : ""
                      }`}
                    >
                      <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                        <OptimizedImage
                          src={getDishImage(item.name)}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                          fallbackSrc={`/placeholder.svg?height=64&width=64&query=${encodeURIComponent(item.name)}`}
                        />
                      </div>
                      <div className="grid gap-1.5 flex-1">
                        <div className="flex justify-between items-center">
                          <Label className="font-medium">{item.name}</Label>
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-none"
                              onClick={() =>
                                updateDishQuantity("sides", item.id, (dishQuantities.sides[item.id] || 0) - 1)
                              }
                              disabled={(dishQuantities.sides[item.id] || 0) <= 0}
                            >
                              <Minus className="h-3 w-3" />
                              <span className="sr-only">Decrease</span>
                            </Button>
                            <div className="w-8 text-center font-medium">{dishQuantities.sides[item.id] || 0}</div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-none"
                              onClick={() =>
                                updateDishQuantity("sides", item.id, (dishQuantities.sides[item.id] || 0) + 1)
                              }
                              disabled={totals.sides >= peopleCount && (dishQuantities.sides[item.id] || 0) === 0}
                            >
                              <Plus className="h-3 w-3" />
                              <span className="sr-only">Increase</span>
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">{item.description}</p>
                        {dishQuantities.sides[item.id] > 0 && (
                          <Badge variant="outline" className="w-fit mt-1">
                            {dishQuantities.sides[item.id]} × selected
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {totals.sides !== peopleCount && (
                  <div className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Please select exactly {peopleCount} sides in total
                  </div>
                )}
              </div>
            )}

            {/* Dessert Selection - Only if multiple options */}
            {desserts.length >= 1 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-lg">Select Desserts</h3>
                  <div className="text-sm">
                    Selected:{" "}
                    <span className={totals.desserts === peopleCount ? "font-medium" : "font-medium text-red-500"}>
                      {totals.desserts}/{peopleCount}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  {desserts.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-start space-x-3 border p-3 rounded-md ${
                        dishQuantities.desserts[item.id] > 0 ? "bg-gray-50 border-gray-400" : ""
                      }`}
                    >
                      <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                        <OptimizedImage
                          src={getDishImage(item.name)}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                          fallbackSrc={`/placeholder.svg?height=64&width=64&query=${encodeURIComponent(item.name)}`}
                        />
                      </div>
                      <div className="grid gap-1.5 flex-1">
                        <div className="flex justify-between items-center">
                          <Label className="font-medium">{item.name}</Label>
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-none"
                              onClick={() =>
                                updateDishQuantity("desserts", item.id, (dishQuantities.desserts[item.id] || 0) - 1)
                              }
                              disabled={(dishQuantities.desserts[item.id] || 0) <= 0}
                            >
                              <Minus className="h-3 w-3" />
                              <span className="sr-only">Decrease</span>
                            </Button>
                            <div className="w-8 text-center font-medium">{dishQuantities.desserts[item.id] || 0}</div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-none"
                              onClick={() =>
                                updateDishQuantity("desserts", item.id, (dishQuantities.desserts[item.id] || 0) + 1)
                              }
                              disabled={totals.desserts >= peopleCount && (dishQuantities.desserts[item.id] || 0) === 0}
                            >
                              <Plus className="h-3 w-3" />
                              <span className="sr-only">Increase</span>
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">{item.description}</p>
                        {dishQuantities.desserts[item.id] > 0 && (
                          <Badge variant="outline" className="w-fit mt-1">
                            {dishQuantities.desserts[item.id]} × selected
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {totals.desserts !== peopleCount && (
                  <div className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Please select exactly {peopleCount} desserts in total
                  </div>
                )}
              </div>
            )}

            {/* Special Instructions */}
            <div className="space-y-2">
              <h3 className="font-medium">Special Instructions</h3>
              <Textarea
                placeholder="Any special requests or dietary concerns?"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
              />
            </div>

            {/* Customization Message */}
            <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
                <div>
                  <h4 className="font-medium text-blue-700">Want to customize your meal?</h4>
                  <p className="mt-1 text-sm text-blue-600">
                    For add-ons and customizations, please close this dialog and browse the individual dishes below. You
                    can add them separately to your order.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-2 border-blue-300 text-blue-700 hover:bg-blue-100"
                    onClick={() => setShowSelectionModal(false)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Browse Individual Dishes
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="sticky bottom-0 bg-white pt-2 border-t">
            <Button variant="outline" onClick={() => setShowSelectionModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddToOrder}
              className="bg-black hover:bg-black/90"
              disabled={
                isAdding ||
                totals.appetizers !== peopleCount ||
                totals.mainCourses !== peopleCount ||
                totals.sides !== peopleCount ||
                totals.desserts !== peopleCount
              }
            >
              {isAdding ? (
                <span className="flex items-center">
                  <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Adding...
                </span>
              ) : (
                `Add for ${peopleCount} people - $${totalPrice.toFixed(2)}`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Floating Add to Order button */}
      {!showSelectionModal && (
        <div className="fixed bottom-4 right-4 z-10">
          <Button onClick={handleAddToOrder} className="bg-black hover:bg-black/90 shadow-lg" size="lg">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add to Order
          </Button>
        </div>
      )}
      {/* People Adjustment Dialog */}
      <Dialog open={showPeopleAdjustmentDialog} onOpenChange={setShowPeopleAdjustmentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adjust Number of People</DialogTitle>
            <DialogDescription>
              You've selected the maximum number of items for {peopleCount} {peopleCount === 1 ? "person" : "people"}.
              Would you like to increase the number of people?
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-center gap-4 py-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPeopleCount(Math.max(MINIMUM_PEOPLE, peopleCount - 1))}
              disabled={peopleCount <= MINIMUM_PEOPLE}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="w-16 text-center text-2xl font-medium">{peopleCount}</div>
            <Button variant="outline" size="icon" onClick={() => setPeopleCount(peopleCount + 1)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500">
            ${PRICE_PER_PERSON.toFixed(2)} per person × {peopleCount} = ${(PRICE_PER_PERSON * peopleCount).toFixed(2)}
          </div>

          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setShowPeopleAdjustmentDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setPeopleCount(peopleCount + 1)
                setShowPeopleAdjustmentDialog(false)
              }}
              className="bg-black hover:bg-black/90"
            >
              Increase to {peopleCount + 1} People
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
