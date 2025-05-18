import Link from "next/link"
import { Clock, Star } from "lucide-react"
import { restaurants } from "@/data/restaurants"

export default function FeaturedRestaurants() {
  // Show only the first 3 restaurants
  const featuredRestaurants = restaurants.slice(0, 3)

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {featuredRestaurants.map((restaurant) => (
        <Link
          key={restaurant.id}
          href={`/restaurants/${restaurant.id}`}
          className="group block overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <img
              src={restaurant.image || "/placeholder.svg"}
              alt={restaurant.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {restaurant.promotion && (
              <div className="absolute bottom-0 left-0 bg-black/80 px-3 py-1 text-sm text-white">
                {restaurant.promotion}
              </div>
            )}
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{restaurant.name}</h3>
              <div className="flex items-center rounded-full bg-gray-100 px-2 py-1">
                <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{restaurant.rating}</span>
              </div>
            </div>

            <div className="mt-1 text-sm text-gray-600">{restaurant.cuisines.join(", ")}</div>

            <div className="mt-2 flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4 text-gray-500" />
                <span>{restaurant.deliveryTime} min</span>
              </div>

              <div>
                {restaurant.deliveryFee === 0 ? (
                  <span className="font-medium text-green-600">Free Delivery</span>
                ) : (
                  <span>${restaurant.deliveryFee.toFixed(2)} Delivery</span>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
