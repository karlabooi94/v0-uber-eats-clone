import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, Star, Info } from "lucide-react"
import { restaurants } from "@/data/restaurants"
import { menuItems } from "@/data/menu-items"
import MenuSection from "@/components/menu-section"
import CartSidebar from "@/components/cart-sidebar"
import UserHeader from "@/components/user-header"
import FourCourseMeal from "@/components/four-course-meal"

export default function RestaurantPage({ params }: { params: { id: string } }) {
  const restaurantId = params.id
  const restaurant = restaurants.find((r) => r.id === restaurantId)

  if (!restaurant) {
    return <div>Restaurant not found</div>
  }

  // Group menu items by category
  const menuItemsByCategory = menuItems
    .filter((item) => item.restaurantId === restaurantId)
    .reduce(
      (acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = []
        }
        acc[item.category].push(item)
        return acc
      },
      {} as Record<string, typeof menuItems>,
    )

  const categories = Object.keys(menuItemsByCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />

      <div className="relative mx-auto max-w-7xl p-4 md:p-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/restaurants">
            <ArrowLeft className="h-4 w-4" />
            <span className="ml-1">Back to restaurants</span>
          </Link>
        </Button>

        <div className="relative mb-8 aspect-[3/1] w-full overflow-hidden rounded-xl">
          <img
            src={restaurant.heroImage || restaurant.image}
            alt={restaurant.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col lg:flex-row lg:gap-8">
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">{restaurant.name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <div className="flex items-center">
                  <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{restaurant.rating}</span>
                  <span className="ml-1 text-gray-500">(200+ ratings)</span>
                </div>
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
              <p className="mt-3 text-gray-600">{restaurant.description}</p>

              <div className="mt-4 flex items-center">
                <Button variant="outline" size="sm" className="rounded-full">
                  <Info className="mr-1 h-4 w-4" />
                  More info
                </Button>
              </div>
            </div>

            {/* Special 4-Course Meal Section */}
            <div className="mb-8 rounded-lg border-2 border-dashed border-black/10 bg-white p-6">
              <h2 className="mb-4 text-xl font-bold">Special 4-Course Meal</h2>
              <FourCourseMeal restaurantId={restaurantId} />
            </div>

            <div className="sticky top-0 z-10 -mx-4 bg-white px-4 py-3 shadow-sm">
              <div className="flex space-x-4 overflow-x-auto">
                <a href="#four-course" className="whitespace-nowrap text-sm font-medium text-black underline">
                  4-Course Meal
                </a>
                {categories.map((category) => (
                  <a
                    key={category}
                    href={`#${category}`}
                    className="whitespace-nowrap text-sm font-medium hover:text-black hover:underline"
                  >
                    {category}
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-8">
              {categories.map((category) => (
                <MenuSection key={category} id={category} title={category} items={menuItemsByCategory[category]} />
              ))}
            </div>
          </div>

          <CartSidebar restaurant={restaurant} />
        </div>
      </div>
    </div>
  )
}
