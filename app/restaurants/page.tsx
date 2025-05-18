import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import RestaurantFilters from "@/components/restaurant-filters"
import RestaurantCard from "@/components/restaurant-card"
import { restaurants } from "@/data/restaurants"
import UserHeader from "@/components/user-header"

export default function RestaurantsPage({ searchParams }: { searchParams: { address?: string; cuisine?: string } }) {
  const address = searchParams.address || "3437 W 2nd Avenue"
  const cuisine = searchParams.cuisine || ""

  // Filter restaurants by cuisine if provided
  const filteredRestaurants = cuisine ? restaurants.filter((r) => r.cuisines.includes(cuisine)) : restaurants

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />

      <div className="mx-auto max-w-7xl p-4 md:p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                <span className="ml-1">Back</span>
              </Link>
            </Button>
            <h1 className="text-xl font-semibold md:text-2xl">
              Delivery to <span className="font-bold">{decodeURIComponent(address)}</span>
            </h1>
          </div>

          {cuisine && (
            <div className="mt-2 flex items-center">
              <span className="text-lg font-medium">Showing results for "{cuisine}"</span>
              <Button variant="ghost" size="sm" asChild className="ml-2 text-sm text-gray-500">
                <Link href={`/restaurants?address=${encodeURIComponent(address)}`}>Clear filter</Link>
              </Button>
            </div>
          )}
        </div>

        <RestaurantFilters />

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </div>
    </div>
  )
}
