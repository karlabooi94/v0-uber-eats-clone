import Link from "next/link"
import { MapPin, Star } from "lucide-react"
import { chefs } from "@/data/chefs"

export default function FeaturedChefs() {
  // Show only the first 3 chefs
  const featuredChefs = chefs.slice(0, 3)

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {featuredChefs.map((chef) => (
        <Link
          key={chef.id}
          href={`/chefs/${chef.id}`}
          className="group block overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <img
              src={chef.image || "/placeholder.svg"}
              alt={chef.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {chef.specialty && (
              <div className="absolute bottom-0 left-0 bg-black/80 px-3 py-1 text-sm text-white">{chef.specialty}</div>
            )}
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{chef.name}</h3>
              <div className="flex items-center rounded-full bg-gray-100 px-2 py-1">
                <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{chef.rating}</span>
              </div>
            </div>

            <div className="mt-1 text-sm text-gray-600">{chef.cuisine}</div>

            <div className="mt-2 flex items-center text-sm text-gray-500">
              <MapPin className="mr-1 h-4 w-4" />
              <span>{chef.location}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
