"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Clock,
  CreditCard,
  User,
  LogOut,
  ChefHat,
  Truck,
  CheckCircle,
  AlertCircle,
  Upload,
  X,
  PlusCircle,
} from "lucide-react"
import UserHeader from "@/components/user-header"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { chefDylan } from "@/data/chef-dylan"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("orders")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // User profile state
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userPhone, setUserPhone] = useState("")
  const [userDob, setUserDob] = useState("")
  const [userAvatar, setUserAvatar] = useState<string | null>(null)

  // Chef profile state
  const [isChef, setIsChef] = useState(false)
  const [chefName, setChefName] = useState("")
  const [cuisineSpecialty, setCuisineSpecialty] = useState("")
  const [yearsExperience, setYearsExperience] = useState("")
  const [shortBio, setShortBio] = useState("")
  const [longBio, setLongBio] = useState("")
  const [specialties, setSpecialties] = useState("")
  const [serviceArea, setServiceArea] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [dishToDelete, setDishToDelete] = useState<string | null>(null)
  const [menuDishes, setMenuDishes] = useState([
    { id: "white-rice", name: "White Rice", available: true },
    { id: "kimchi", name: "Kimchi", available: true },
    { id: "backyard-bbq", name: "Backyard BBQ", available: false },
  ])

  // Profile completeness
  const [isProfileComplete, setIsProfileComplete] = useState(false)
  const [missingFields, setMissingFields] = useState<string[]>([])

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setUserName(user.name || "")
      setUserEmail(user.email || "")
      setUserAvatar(user.avatar || null)

      // Check if user is already a chef (Dylan)
      if (user.email === "dylan@example.com") {
        setIsChef(true)
        setChefName(chefDylan.name)
        setCuisineSpecialty("Indian, Pacific Rim, Fusion")
        setYearsExperience("15")
        setShortBio(chefDylan.shortBio || "")
        setLongBio(chefDylan.bio || "")
        setSpecialties(chefDylan.specialties?.join(", ") || "")
        setServiceArea("Vancouver, BC")
        setPriceRange("$$$")
        setGalleryImages(["/meals/indian-fusion.png", "/meals/chicken-biryani.png"])
      }
    }
  }, [user])

  // Add this near the top of the component with other useEffect hooks
  useEffect(() => {
    // Check for tab query parameter
    const params = new URLSearchParams(window.location.search)
    const tabParam = params.get("tab")
    if (tabParam && ["orders", "addresses", "payment", "profile"].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [])

  // Check profile completeness
  useEffect(() => {
    if (!isChef) {
      setIsProfileComplete(false)
      setMissingFields([])
      return
    }

    const missing: string[] = []

    if (!chefName) missing.push("Chef Name")
    if (!cuisineSpecialty) missing.push("Cuisine Specialty")
    if (!yearsExperience) missing.push("Years of Experience")
    if (!shortBio) missing.push("Short Bio")
    if (!longBio) missing.push("Long Bio")
    if (!specialties) missing.push("Specialties")
    if (!serviceArea) missing.push("Service Area")
    if (!priceRange) missing.push("Price Range")
    if (galleryImages.length === 0) missing.push("Gallery Images")

    setMissingFields(missing)
    setIsProfileComplete(missing.length === 0)
  }, [
    isChef,
    chefName,
    cuisineSpecialty,
    yearsExperience,
    shortBio,
    longBio,
    specialties,
    serviceArea,
    priceRange,
    galleryImages,
  ])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleSaveProfile = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      toast.success("Profile Updated", "Your profile changes have been saved successfully.")
    }, 1000)
  }

  const handleSaveChefProfile = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      if (isProfileComplete) {
        toast.success("Chef Profile Updated", "Your chef profile is now visible to customers.")
      } else {
        toast.info("Chef Profile Updated", "Your chef profile has been saved, but is not yet visible to customers.")
      }
    }, 1000)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    // Convert File objects to URLs for preview
    const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
    setGalleryImages([...galleryImages, ...newImages])

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveImage = (index: number) => {
    const newImages = [...galleryImages]

    // If it's a blob URL, revoke it to prevent memory leaks
    const imageUrl = newImages[index]
    if (imageUrl.startsWith("blob:")) {
      URL.revokeObjectURL(imageUrl)
    }

    newImages.splice(index, 1)
    setGalleryImages(newImages)
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    // Convert File object to URL for preview
    const newAvatar = URL.createObjectURL(files[0])
    setUserAvatar(newAvatar)

    // Reset the file input
    if (event.target) {
      event.target.value = ""
    }
  }

  const handleDeleteDish = (id: string) => {
    setDishToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteDish = () => {
    if (dishToDelete) {
      setMenuDishes(menuDishes.filter((dish) => dish.id !== dishToDelete))
      toast.success("Dish Removed", "The dish has been removed from your menu.")
    }
    setIsDeleteDialogOpen(false)
    setDishToDelete(null)
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p>Please log in to view your dashboard</p>
        <Button asChild className="mt-4">
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />

      <div className="mx-auto max-w-7xl p-4 md:p-6">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Your Account</h1>
            <p className="text-gray-600">Welcome back, {user.name}</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders" className="gap-2">
              <Clock className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="addresses" className="gap-2">
              <MapPin className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Addresses</span>
            </TabsTrigger>
            <TabsTrigger value="payment" className="gap-2">
              <CreditCard className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Payment</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <h2 className="text-xl font-semibold">Order History</h2>

            <div className="rounded-lg border bg-white shadow-sm">
              <div className="border-b p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="font-medium">Order #12345</div>
                      <div className="text-sm text-gray-500">May 15, 2025 • 2 meals</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">$179.20</div>
                    <div className="text-sm font-medium text-green-600">Delivered</div>
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  <span className="font-medium">{chefDylan.name}</span> • Pacific Rim Fusion Experience
                </div>
                <div className="mt-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard/orders/12345">View Details</Link>
                  </Button>
                </div>
              </div>

              <div className="border-b p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ChefHat className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="font-medium">Order #12344</div>
                      <div className="text-sm text-gray-500">May 10, 2025 • 4 meals</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">$358.40</div>
                    <div className="text-sm font-medium text-green-600">Completed</div>
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  <span className="font-medium">{chefDylan.name}</span> • East Meets West Tasting Menu
                </div>
                <div className="mt-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard/orders/12344">View Details</Link>
                  </Button>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="font-medium">Order #12343</div>
                      <div className="text-sm text-gray-500">May 5, 2025 • 2 meals</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">$179.20</div>
                    <div className="text-sm font-medium text-green-600">Delivered</div>
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  <span className="font-medium">{chefDylan.name}</span> • Vegetarian Fusion Feast
                </div>
                <div className="mt-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard/orders/12343">View Details</Link>
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="addresses" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Saved Addresses</h2>
              <Button variant="outline" size="sm">
                Add New Address
              </Button>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Home</span>
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">Default</span>
                    </div>
                    <div className="mt-1 text-gray-600">3437 W 2nd Avenue, Vancouver, BC</div>
                    <div className="mt-1 text-sm text-gray-500">Apt 201</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                      Delete
                    </Button>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">Work</div>
                    <div className="mt-1 text-gray-600">555 Burrard Street, Vancouver, BC</div>
                    <div className="mt-1 text-sm text-gray-500">Suite 1500</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payment" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Payment Methods</h2>
              <Button variant="outline" size="sm">
                Add Payment Method
              </Button>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Visa ending in 4242</span>
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">Default</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-500">Expires 05/26</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                      Delete
                    </Button>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">Mastercard ending in 8888</div>
                    <div className="mt-1 text-sm text-gray-500">Expires 12/27</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <h2 className="text-xl font-semibold">Profile Information</h2>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <div className="relative h-20 w-20 overflow-hidden rounded-full">
                  <img
                    src={userAvatar || user.avatar || "/placeholder.svg?height=80&width=80&query=user"}
                    alt={userName || user.name}
                    className="h-full w-full object-cover"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-black text-white"
                  >
                    <Upload className="h-3 w-3" />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full rounded-md border border-gray-300 p-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="w-full rounded-md border border-gray-300 p-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Phone Number</label>
                      <input
                        type="tel"
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        placeholder="(604) 555-5555"
                        className="w-full rounded-md border border-gray-300 p-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Date of Birth</label>
                      <input
                        type="date"
                        value={userDob}
                        onChange={(e) => setUserDob(e.target.value)}
                        className="w-full rounded-md border border-gray-300 p-2"
                      />
                    </div>
                  </div>

                  {/* Chef Profile Section */}
                  <div className="mt-8 border-t pt-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="chef-profile"
                        checked={isChef}
                        onCheckedChange={(checked) => setIsChef(checked === true)}
                      />
                      <label
                        htmlFor="chef-profile"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I am a chef and want to create a chef profile
                      </label>
                    </div>

                    {isChef && (
                      <div className="mt-6 space-y-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <ChefHat className="h-5 w-5" />
                          Chef Profile Information
                        </h3>

                        {/* Profile Status */}
                        {isProfileComplete ? (
                          <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-green-700">
                            <CheckCircle className="h-5 w-5" />
                            <p>Your chef profile is complete and findable by customers</p>
                          </div>
                        ) : (
                          <div className="space-y-2 rounded-md bg-red-50 p-3 text-red-700">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-5 w-5" />
                              <p>Your chef profile is incomplete and not findable by customers</p>
                            </div>
                            {missingFields.length > 0 && (
                              <div className="ml-7 text-sm">
                                <p>Missing information:</p>
                                <ul className="list-disc pl-5">
                                  {missingFields.map((field) => (
                                    <li key={field}>{field}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Chef Basic Info */}
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Chef Name</label>
                            <input
                              type="text"
                              value={chefName}
                              onChange={(e) => setChefName(e.target.value)}
                              placeholder="How you want to be known professionally"
                              className="w-full rounded-md border border-gray-300 p-2"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Cuisine Specialty</label>
                            <input
                              type="text"
                              value={cuisineSpecialty}
                              onChange={(e) => setCuisineSpecialty(e.target.value)}
                              placeholder="e.g., Italian, French, Fusion"
                              className="w-full rounded-md border border-gray-300 p-2"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Years of Experience</label>
                            <input
                              type="number"
                              value={yearsExperience}
                              onChange={(e) => setYearsExperience(e.target.value)}
                              placeholder="e.g., 5"
                              className="w-full rounded-md border border-gray-300 p-2"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Price Range</label>
                            <select
                              value={priceRange}
                              onChange={(e) => setPriceRange(e.target.value)}
                              className="w-full rounded-md border border-gray-300 p-2"
                            >
                              <option value="">Select a price range</option>
                              <option value="$">$ (Budget-friendly)</option>
                              <option value="$$">$$ (Mid-range)</option>
                              <option value="$$$">$$$ (High-end)</option>
                              <option value="$$$$">$$$$ (Luxury)</option>
                            </select>
                          </div>
                        </div>

                        {/* Chef Bio */}
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Short Bio (50-100 characters)
                          </label>
                          <input
                            type="text"
                            value={shortBio}
                            onChange={(e) => setShortBio(e.target.value)}
                            placeholder="Brief tagline that describes your cooking style"
                            maxLength={100}
                            className="w-full rounded-md border border-gray-300 p-2"
                          />
                          <div className="mt-1 text-xs text-gray-500">{shortBio.length}/100 characters</div>
                        </div>

                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">Full Bio</label>
                          <textarea
                            value={longBio}
                            onChange={(e) => setLongBio(e.target.value)}
                            placeholder="Tell customers about your culinary journey, philosophy, and what makes your cooking special"
                            rows={5}
                            className="w-full rounded-md border border-gray-300 p-2"
                          />
                        </div>

                        {/* Specialties */}
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Specialties (comma separated)
                          </label>
                          <input
                            type="text"
                            value={specialties}
                            onChange={(e) => setSpecialties(e.target.value)}
                            placeholder="e.g., Farm-to-table, Vegan options, Gluten-free"
                            className="w-full rounded-md border border-gray-300 p-2"
                          />
                          <div className="mt-1 text-xs text-gray-500">Enter specialties separated by commas</div>
                        </div>

                        {/* Location */}
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">Service Area</label>
                          <input
                            type="text"
                            value={serviceArea}
                            onChange={(e) => setServiceArea(e.target.value)}
                            placeholder="e.g., Vancouver, BC"
                            className="w-full rounded-md border border-gray-300 p-2"
                          />
                        </div>

                        {/* Gallery */}
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">Gallery Images</label>
                          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                            <div
                              className="aspect-square rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <div className="flex flex-col items-center text-gray-500">
                                <Upload className="h-6 w-6 mb-1" />
                                <span className="text-xs">Add Image</span>
                              </div>
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileSelect}
                                multiple
                              />
                            </div>

                            {galleryImages.map((image, index) => (
                              <div
                                key={index}
                                className="aspect-square rounded-md border overflow-hidden relative group"
                              >
                                <img
                                  src={image || "/placeholder.svg"}
                                  alt={`Gallery image ${index + 1}`}
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

                        {/* Menu Dishes Section */}
                        <div className="mt-6">
                          <h3 className="mb-4 text-lg font-semibold">Menu Dishes</h3>

                          <div className="mb-4 space-y-2 rounded-md border bg-white p-4">
                            {menuDishes.length === 0 ? (
                              <p className="text-center text-gray-500 py-4">No menu dishes added yet.</p>
                            ) : (
                              menuDishes.map((dish) => (
                                <div key={dish.id} className="flex items-center justify-between border-b pb-2 relative">
                                  <button
                                    onClick={() => handleDeleteDish(dish.id)}
                                    className="absolute -left-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                    aria-label={`Delete ${dish.name}`}
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                  <span className="font-medium pl-2">{dish.name}</span>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`available-${dish.id}`}
                                      defaultChecked={dish.available}
                                      onCheckedChange={(checked) => {
                                        setMenuDishes(
                                          menuDishes.map((d) =>
                                            d.id === dish.id ? { ...d, available: checked === true } : d,
                                          ),
                                        )
                                      }}
                                    />
                                    <label htmlFor={`available-${dish.id}`} className="text-sm">
                                      Available
                                    </label>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => router.push("/dashboard/add-dish")}
                            className="gap-1"
                          >
                            <PlusCircle className="h-4 w-4" />
                            Add a Menu Dish
                          </Button>

                          <Button
                            className="bg-black text-white hover:bg-black/90"
                            onClick={handleSaveChefProfile}
                            disabled={isSaving}
                          >
                            {isSaving ? "Saving..." : "Save Chef Profile"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this dish from your menu. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteDish} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
