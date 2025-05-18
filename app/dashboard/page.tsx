"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Clock, CreditCard, User, LogOut, ChefHat, Truck } from "lucide-react"
import UserHeader from "@/components/user-header"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { chefDylan } from "@/data/chef-dylan"

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("orders")

  const handleLogout = () => {
    logout()
    router.push("/")
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
                <div className="h-20 w-20 overflow-hidden rounded-full">
                  <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="h-full w-full object-cover" />
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
                      <input type="text" value={user.name} className="w-full rounded-md border border-gray-300 p-2" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                      <input type="email" value={user.email} className="w-full rounded-md border border-gray-300 p-2" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="(604) 555-5555"
                        className="w-full rounded-md border border-gray-300 p-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Date of Birth</label>
                      <input type="date" className="w-full rounded-md border border-gray-300 p-2" />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-black text-white hover:bg-black/90">Save Changes</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
