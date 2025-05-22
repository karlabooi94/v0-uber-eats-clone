"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import UserHeader from "@/components/user-header"
import { ChefHat, ArrowLeft, Upload, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function AddDishPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [dishName, setDishName] = useState("")
  const [cuisineTag, setCuisineTag] = useState("")
  const [foodType, setFoodType] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [ingredients, setIngredients] = useState("")
  const [preparationTime, setPreparationTime] = useState("")
  const [servingSize, setServingSize] = useState("")
  const [dishImages, setDishImages] = useState<string[]>([])

  const [hasDeliveryFee, setHasDeliveryFee] = useState(false)
  const [deliveryFee, setDeliveryFee] = useState("")

  // Allergens state
  const [allergens, setAllergens] = useState({
    gluten: false,
    dairy: false,
    nuts: false,
    eggs: false,
    soy: false,
    shellfish: false,
    fish: false,
    wheat: false,
  })

  // Dietary preferences
  const [dietaryPreferences, setDietaryPreferences] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    keto: false,
    paleo: false,
    lowCarb: false,
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    // Convert File objects to URLs for preview
    const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
    setDishImages([...dishImages, ...newImages])

    // Reset the file input
    if (event.target) {
      event.target.value = ""
    }
  }

  const handleRemoveImage = (index: number) => {
    const newImages = [...dishImages]

    // If it's a blob URL, revoke it to prevent memory leaks
    const imageUrl = newImages[index]
    if (imageUrl.startsWith("blob:")) {
      URL.revokeObjectURL(imageUrl)
    }

    newImages.splice(index, 1)
    setDishImages(newImages)
  }

  const handleSaveDish = () => {
    setIsSaving(true)

    // Validate required fields
    if (!dishName || !cuisineTag || !foodType || !price || !description) {
      toast.error("Missing Information", "Please fill in all required fields.")
      setIsSaving(false)
      return
    }

    // Simulate API call to save the dish
    setTimeout(() => {
      setIsSaving(false)
      toast.success("Dish Added", "Your menu dish has been added successfully.")
      router.push("/dashboard?tab=profile")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />

      <div className="mx-auto max-w-4xl p-4 md:p-6">
        <div className="mb-6 flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard?tab=profile")} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Add Menu Dish</h1>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                Dish Information
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Dish Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={dishName}
                    onChange={(e) => setDishName(e.target.value)}
                    placeholder="e.g., Spicy Korean Bibimbap"
                    className="w-full rounded-md border border-gray-300 p-2"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Cuisine Tag <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={cuisineTag}
                    onChange={(e) => setCuisineTag(e.target.value)}
                    placeholder="e.g., Korean, Asian Fusion"
                    className="w-full rounded-md border border-gray-300 p-2"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Food Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={foodType}
                    onChange={(e) => setFoodType(e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2"
                    required
                  >
                    <option value="">Select food type</option>
                    <option value="one-pot-meal">One Pot Meal</option>
                    <option value="appetizer">Appetizer</option>
                    <option value="full-course-dinner">Full Course Dinner</option>
                    <option value="side-dish">Side Dish</option>
                    <option value="dessert">Dessert</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-full rounded-md border border-gray-300 p-2 pl-7"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Estimated Dinner Length (minutes)
                  </label>
                  <input
                    type="number"
                    value={preparationTime}
                    onChange={(e) => setPreparationTime(e.target.value)}
                    placeholder="e.g., 90"
                    min="0"
                    className="w-full rounded-md border border-gray-300 p-2"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Serving Size</label>
                  <input
                    type="text"
                    value={servingSize}
                    onChange={(e) => setServingSize(e.target.value)}
                    placeholder="e.g., Serves 2-4 people"
                    className="w-full rounded-md border border-gray-300 p-2"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your dish, its flavors, and what makes it special"
                rows={4}
                className="w-full rounded-md border border-gray-300 p-2"
                required
              />
            </div>

            {/* Ingredients */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Ingredients</label>
              <textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="List the main ingredients (one per line)"
                rows={3}
                className="w-full rounded-md border border-gray-300 p-2"
              />
              <div className="mt-1 text-xs text-gray-500">Enter each ingredient on a new line</div>
            </div>

            {/* Allergens */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Common Allergens</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {Object.entries(allergens).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`allergen-${key}`}
                      checked={value}
                      onCheckedChange={(checked) => setAllergens({ ...allergens, [key]: checked === true })}
                    />
                    <label htmlFor={`allergen-${key}`} className="text-sm capitalize">
                      {key}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Dietary Preferences */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Dietary Preferences</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {Object.entries(dietaryPreferences).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`diet-${key}`}
                      checked={value}
                      onCheckedChange={(checked) =>
                        setDietaryPreferences({ ...dietaryPreferences, [key]: checked === true })
                      }
                    />
                    <label htmlFor={`diet-${key}`} className="text-sm capitalize">
                      {key === "glutenFree"
                        ? "Gluten-Free"
                        : key === "dairyFree"
                          ? "Dairy-Free"
                          : key === "lowCarb"
                            ? "Low-Carb"
                            : key}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Fee */}
            <div className="flex items-start gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="delivery-fee"
                  checked={hasDeliveryFee}
                  onCheckedChange={(checked) => setHasDeliveryFee(checked === true)}
                />
                <label htmlFor="delivery-fee" className="text-sm font-medium">
                  Delivery Fee
                </label>
              </div>

              {hasDeliveryFee && (
                <div className="flex-1">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                    <input
                      type="number"
                      value={deliveryFee}
                      onChange={(e) => setDeliveryFee(e.target.value)}
                      placeholder="0.00"
                      step="1"
                      min="0"
                      className="w-full rounded-md border border-gray-300 p-2 pl-7"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Dish Images */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Dish Images</label>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                <label className="aspect-square rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center text-gray-500">
                    <Upload className="h-6 w-6 mb-1" />
                    <span className="text-xs">Add Image</span>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} multiple />
                </label>

                {dishImages.map((image, index) => (
                  <div key={index} className="aspect-square rounded-md border overflow-hidden relative group">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Dish image ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 rounded-full bg-black/70 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button className="bg-black text-white hover:bg-black/90" onClick={handleSaveDish} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Menu Dish"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
