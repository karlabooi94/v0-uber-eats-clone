"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import AddressSearchForm from "@/components/address-search-form"
import TableForTwoHeader from "@/components/table-for-two-header"
import { chefs } from "@/data/chefs"
import { ArrowRight } from "lucide-react"

export default function HomePage() {
  // Animation states
  const [showContent, setShowContent] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Trigger animations on component mount
  useEffect(() => {
    // Show content with a slight delay after page load
    const contentTimer = setTimeout(() => setShowContent(true), 400)

    // Preload the banner image
    const img = new Image()
    img.src = "/table-for-two-banner.png"
    img.onload = () => setImageLoaded(true)

    return () => {
      clearTimeout(contentTimer)
    }
  }, [])

  // Ensure chefs is defined and has a fallback empty array
  const safeChefs = chefs || []

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <TableForTwoHeader />

      {/* Background Image - Table for Two */}
      <div className="absolute inset-0 z-0 bg-gray-900">
        {/* Show a loading state until the image is loaded */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
        >
          <img
            src="/table-for-two-banner.png"
            alt="Romantic dinner table for two with city view"
            className="h-full w-full object-cover"
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        {/* Semi-opaque overlay for better contrast */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Main Content - Adjusted to account for sticky header */}
        <main className="flex flex-1 flex-col items-start justify-center px-6 pb-20 pt-24 md:px-8 lg:px-10">
          <div
            className={`max-w-3xl transition-all duration-1000 ease-out ${
              showContent ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              Intimate Dining Experiences at Home
            </h1>
            <p className="mb-10 text-xl text-white/90">
              Enjoy curated 4-course meals from Vancouver's celebrated chefs, prepared in your home for a perfect
              evening.
            </p>

            <div className="w-full max-w-2xl">
              <AddressSearchForm defaultAddress="" />

              <div className="mt-6 text-sm text-white/90">
                <span className="mr-1">All meals are $80 per person, with a minimum of 2 people.</span>
              </div>
            </div>
          </div>
        </main>

        {/* Featured Chefs Section */}
        <section className="relative z-10 bg-white py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-3xl font-bold">Meet Our Featured Chefs</h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                Discover Vancouver's culinary talent, each bringing their unique expertise to your table
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {safeChefs.map((chef) => (
                <div
                  key={chef.id}
                  className="overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={chef.image || "/placeholder.svg"}
                      alt={chef.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 text-xl font-bold">{chef.name}</h3>
                    <p className="mb-2 text-gray-600">{chef.cuisine}</p>
                    <div className="mb-4 flex items-center">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1 font-medium">{chef.rating}</span>
                        <span className="ml-1 text-gray-500">({chef.reviewCount || "200+"})</span>
                      </div>
                      <span className="mx-2 text-gray-500">•</span>
                      <span className="text-gray-500">{chef.location}</span>
                    </div>
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {/* Add null check and default empty array for specialties */}
                        {(chef.specialties || []).slice(0, 3).map((specialty, index) => (
                          <span key={index} className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button asChild className="w-full bg-black text-white hover:bg-black/90">
                      <Link href={`/chefs/${chef.id}`} className="flex items-center justify-center">
                        View Menus
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Cuisines Section */}
        <section className="bg-gray-50 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-3xl font-bold">Explore Our Cuisines</h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                From Asian-European fusion to traditional Indian flavors, discover a world of taste
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="group overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:shadow-md">
                <div className="aspect-[16/9] w-full overflow-hidden">
                  <img
                    src="/meals/pacific-rim-fusion.png"
                    alt="Pacific Rim Fusion"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold">Asian-European Fusion</h3>
                  <p className="mb-4 text-gray-600">
                    A harmonious blend of Asian techniques and European traditions, creating innovative flavor profiles
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/chefs/dylan">Explore Fusion Menus</Link>
                  </Button>
                </div>
              </div>

              <div className="group overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:shadow-md">
                <div className="aspect-[16/9] w-full overflow-hidden">
                  <img
                    src="/meals/indian-fusion.png"
                    alt="Indian Cuisine"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold">Indian Cuisine</h3>
                  <p className="mb-4 text-gray-600">
                    Vibrant flavors and aromatic spices come together in our chef's authentic Indian creations
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/chefs/dylan?cuisine=indian">Explore Indian Menus</Link>
                  </Button>
                </div>
              </div>

              <div className="group overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:shadow-md">
                <div className="aspect-[16/9] w-full overflow-hidden">
                  <img
                    src="/bc-seafood.png"
                    alt="West Coast Seafood"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold">West Coast Seafood</h3>
                  <p className="mb-4 text-gray-600">
                    Sustainable seafood from BC's pristine waters, prepared with seasonal local ingredients
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/chefs/c1">Explore Seafood Menus</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
