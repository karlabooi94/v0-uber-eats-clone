import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import ChefCard from "@/components/chef-card"
import { chefs } from "@/data/chefs"
import UserHeader from "@/components/user-header"

export default function ChefsPage({ searchParams }: { searchParams: { address?: string; cuisine?: string } }) {
  const address = searchParams.address || "3437 W 2nd Avenue"
  const cuisine = searchParams.cuisine || ""

  // Filter chefs by cuisine if provided
  const filteredChefs = cuisine ? chefs.filter((c) => c.cuisine.includes(cuisine)) : chefs

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
              Chefs available near <span className="font-bold">{decodeURIComponent(address)}</span>
            </h1>
          </div>

          {cuisine && (
            <div className="mt-2 flex items-center">
              <span className="text-lg font-medium">Showing {cuisine} cuisine specialists</span>
              <Button variant="ghost" size="sm" asChild className="ml-2 text-sm text-gray-500">
                <Link href={`/chefs?address=${encodeURIComponent(address)}`}>Clear filter</Link>
              </Button>
            </div>
          )}
        </div>

        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">How It Works</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="mb-2 font-medium">Choose a Chef</h3>
              <p className="text-sm text-gray-600">
                Browse our selection of Vancouver's top chefs and their signature 4-course meals.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="mb-2 font-medium">Select Your Meal</h3>
              <p className="text-sm text-gray-600">
                Choose from three curated 4-course meal options, each priced at $80 per person.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="mb-2 font-medium">Enjoy at Home</h3>
              <p className="text-sm text-gray-600">
                Your meal is prepared fresh and delivered to your door, ready to heat and enjoy.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredChefs.map((chef) => (
            <ChefCard key={chef.id} chef={chef} />
          ))}
        </div>
      </div>
    </div>
  )
}
