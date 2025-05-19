"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star, MapPin, Clock, Mail, Phone } from "lucide-react"
import { chefs } from "@/data/chefs"
import UserHeader from "@/components/user-header"
import { notFound } from "next/navigation"
import IndianMenu from "@/components/indian-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import OrderSidebar from "@/components/order-sidebar"
import CategorizedMenu from "@/components/categorized-menu"
import ChefContactButton from "@/components/chef-contact-button"
import ChefBookingButton from "@/components/chef-booking-button"
import { useOrder } from "@/hooks/use-order"
import { useEffect, useState } from "react"

// Constants
const MINIMUM_PEOPLE = 2
const MAXIMUM_PEOPLE = 8
const PRICE_PER_PERSON = 80

export default function ChefProfilePage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { cuisine?: string }
}) {
  const { items } = useOrder()
  const [currentPeopleCount, setCurrentPeopleCount] = useState(MINIMUM_PEOPLE)

  // Find the chef by ID
  const chef = chefs.find((c) => c.id === params.id) || chefs.find((c) => c.id === "dylan")

  if (!chef) {
    notFound()
  }

  // Get the current people count from the order
  useEffect(() => {
    const mealPackage = items.find((item) => item.id === "mp1")
    const mainDish = items.find((item) => item.courseType === "main" && !item.isCustomization)

    // Determine the current people count from either the meal package or main dish
    let peopleCount = MINIMUM_PEOPLE

    if (mealPackage && mealPackage.quantity) {
      peopleCount = Math.max(mealPackage.quantity, MINIMUM_PEOPLE)
    } else if (mainDish && mainDish.quantity) {
      peopleCount = Math.max(mainDish.quantity, MINIMUM_PEOPLE)
    }

    setCurrentPeopleCount(peopleCount)
  }, [items])

  const isDylan = chef.id === "dylan"
  const showIndianCuisine = isDylan && (searchParams.cuisine === "indian" || !searchParams.cuisine)

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />

      <div className="relative mx-auto max-w-7xl p-4 md:p-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            <span className="ml-1">Back to home</span>
          </Link>
        </Button>

        {/* Chef Profile Header - Uber Eats Style */}
        <div className="mb-8 overflow-hidden rounded-xl bg-white shadow-sm">
          {/* Cover Image */}
          <div className="relative h-48 w-full overflow-hidden md:h-64">
            <img
              src={chef.coverImage || "/placeholder.svg?height=600&width=1200&query=chef kitchen"}
              alt={`${chef.name}'s kitchen`}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>

          <div className="relative px-6 pb-6">
            {/* Chef Image - Prominently displayed and overlapping the cover image */}
            <div className="absolute -top-16 left-6 h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-white shadow-md">
              <img src={chef.image || "/placeholder.svg"} alt={chef.name} className="h-full w-full object-cover" />
            </div>

            {/* Chef Info - Positioned to account for the overlapping image */}
            <div className="pt-20">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{chef.name}</h1>
                  <p className="text-gray-600">{chef.cuisine}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded-full bg-gray-100 px-3 py-1">
                    <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{chef.rating}</span>
                    <span className="ml-1 text-gray-500">(200+ ratings)</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="mr-1 h-4 w-4" />
                  <span>{chef.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>Delivery: 45-60 min</span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <ChefContactButton chef={chef} />
                <ChefBookingButton chef={chef} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Main Content Area */}
          <div className="md:col-span-2 relative pb-20">
            <Tabs defaultValue={showIndianCuisine ? "indian" : "all"} className="mb-8">
              <TabsList className="mb-6 w-full justify-start">
                {isDylan && <TabsTrigger value="indian">Indian Cuisine</TabsTrigger>}
                <TabsTrigger value="all">All Menus</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
              </TabsList>

              {isDylan && (
                <TabsContent value="indian" className="mt-0">
                  <IndianMenu initialPeopleCount={currentPeopleCount} />
                </TabsContent>
              )}

              <TabsContent value="all" className="mt-0">
                <CategorizedMenu />
              </TabsContent>

              <TabsContent value="about" className="mt-0">
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-xl font-bold">About Chef {chef.name}</h2>
                  <div className="prose max-w-none">
                    <p>{chef.longBio}</p>
                    <p className="mt-4">
                      Chef {chef.name.split(" ")[0]}'s cuisine has earned recognition throughout Vancouver's culinary
                      scene. His innovative approach respects traditional techniques while creating exciting new flavor
                      combinations that surprise and delight.
                    </p>
                    <p className="mt-4">
                      Each meal is prepared with care in Chef {chef.name.split(" ")[0]}'s professional kitchen in{" "}
                      {chef.location}, packaged with eco-friendly materials, and delivered fresh to your door with
                      simple reheating instructions.
                    </p>
                  </div>

                  <div className="mt-8">
                    <h3 className="mb-4 text-lg font-semibold">Frequently Asked Questions</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">How does delivery work?</h4>
                        <p className="text-sm text-gray-600">
                          All meals are prepared fresh and delivered within a 45-60 minute window of your chosen
                          delivery time. Our insulated packaging ensures your food arrives at the perfect temperature.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium">Can I book the chef for a private event?</h4>
                        <p className="text-sm text-gray-600">
                          Yes! Chef {chef.name.split(" ")[0]} is available for private events and in-home dining
                          experiences. Use the "Book Private Event" button to inquire about availability and pricing.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium">How do I handle dietary restrictions?</h4>
                        <p className="text-sm text-gray-600">
                          When placing your order, you can note any allergies or dietary restrictions. Our chefs will
                          accommodate where possible or suggest alternative menu options.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Similar Chefs Section */}
            <div className="mb-8">
              <h2 className="mb-6 text-xl font-bold">You Might Also Like</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {chefs
                  .filter((c) => c.id !== chef.id)
                  .map((otherChef) => (
                    <Link
                      key={otherChef.id}
                      href={`/chefs/${otherChef.id}`}
                      className="group flex overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="w-1/3">
                        <img
                          src={otherChef.image || "/placeholder.svg"}
                          alt={otherChef.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-center p-4">
                        <h3 className="font-semibold">{otherChef.name}</h3>
                        <p className="text-sm text-gray-600">{otherChef.cuisine}</p>
                        <div className="mt-1 flex items-center">
                          <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium">{otherChef.rating}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            <OrderSidebar
              chef={chef}
              initialPeopleCount={currentPeopleCount}
              maxPeopleCount={MAXIMUM_PEOPLE}
              pricePerPerson={PRICE_PER_PERSON}
            />

            <div className="mt-6 rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold">About Chef {chef.name}</h2>
              <p className="text-sm text-gray-600">{chef.bio}</p>

              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500">Specialties</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {chef.specialties.map((specialty, index) => (
                    <span key={index} className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>(604) 555-1234</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>chef.{chef.id}@vancouverchefconnect.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
