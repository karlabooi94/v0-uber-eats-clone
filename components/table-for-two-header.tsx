"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, ChevronDown, Clock, MapPin, Menu, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function TableForTwoHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [serviceType, setServiceType] = useState<"chef" | "delivery">("chef")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const [selectedDinnerTime, setSelectedDinnerTime] = useState("Tonight")

  // Handle scroll events to update header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Get available dinner time options
  const getDinnerTimeOptions = () => {
    const now = new Date()
    const currentHour = now.getHours()

    // If it's after 9 PM, don't show "Tonight" option
    const showTonight = currentHour < 21

    return {
      showTonight,
      tonight: "Tonight (7:00 PM)",
      tomorrow: "Tomorrow (7:00 PM)",
      weekend: `This Weekend (${now.getDay() >= 5 ? "Sunday" : "Saturday"}, 6:30 PM)`,
    }
  }

  const timeOptions = getDinnerTimeOptions()

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
        isScrolled ? "bg-white shadow-md" : pathname === "/" ? "bg-transparent" : "bg-white border-b border-gray-100",
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Mobile Menu */}
        <div className="flex items-center md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px]">
              <div className="flex flex-col gap-6 py-4">
                <div className="flex items-center justify-between">
                  <Link href="/" className="text-xl font-bold" onClick={() => setMobileMenuOpen(false)}>
                    Table for Two
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="flex flex-col gap-2">
                  <Link
                    href="/schedule"
                    className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Schedule a Meal
                  </Link>
                  <Link
                    href="/chefs"
                    className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Browse Chefs
                  </Link>
                  <Link
                    href="/bookings"
                    className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                  <Link
                    href="/gift"
                    className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Gift a Dinner
                  </Link>
                  <Link
                    href="/chef-portal"
                    className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Chef Portal
                  </Link>
                  <Link
                    href="/support"
                    className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Support
                  </Link>
                </nav>
                <div className="mt-auto flex flex-col gap-2">
                  <Button variant="outline" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    Sign in
                  </Button>
                  <Button className="w-full">Join</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span
            className={cn(
              "text-xl font-bold transition-colors",
              isScrolled || pathname !== "/" ? "text-black" : "text-white",
            )}
          >
            Table for Two
          </span>
        </Link>

        {/* Main Navigation - Desktop Only */}
        <div className="hidden md:flex md:items-center md:gap-8">
          <Link
            href="/chefs"
            className={cn(
              "font-medium transition-colors hover:text-emerald-700",
              isScrolled || pathname !== "/" ? "text-gray-800" : "text-white",
            )}
          >
            Browse Chefs
          </Link>
          <Link
            href="/meals"
            className={cn(
              "font-medium transition-colors hover:text-emerald-700",
              isScrolled || pathname !== "/" ? "text-gray-800" : "text-white",
            )}
          >
            Meal Packages
          </Link>
          <Link
            href="/how-it-works"
            className={cn(
              "font-medium transition-colors hover:text-emerald-700",
              isScrolled || pathname !== "/" ? "text-gray-800" : "text-white",
            )}
          >
            How It Works
          </Link>
        </div>

        {/* Right Side Group */}
        <div className="flex items-center gap-3">
          {/* Dinner Time Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "hidden md:flex items-center gap-1",
                  isScrolled || pathname !== "/"
                    ? "border-gray-200 bg-white text-gray-800"
                    : "border-white/30 bg-black/20 text-white hover:bg-black/30",
                )}
              >
                <Clock className="mr-1 h-4 w-4" />
                <span>{selectedDinnerTime}</span>
                <ChevronDown className="h-4 w-4 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {timeOptions.showTonight && (
                <DropdownMenuItem onClick={() => setSelectedDinnerTime("Tonight")}>
                  <span className="font-medium">{timeOptions.tonight}</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => setSelectedDinnerTime("Tomorrow")}>
                <span className="font-medium">{timeOptions.tomorrow}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedDinnerTime("This Weekend")}>
                <span className="font-medium">{timeOptions.weekend}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedDinnerTime("Custom Date")}>
                <Calendar className="mr-2 h-4 w-4" />
                <span className="font-medium">Pick a Date & Time...</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Schedule a Meal Button */}
          <Button
            className={cn(
              "hidden md:flex items-center gap-2",
              isScrolled || pathname !== "/"
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-white text-emerald-800 hover:bg-white/90",
            )}
          >
            <span>Schedule a Meal</span>
          </Button>

          {/* Location - Desktop Only */}
          <div className="hidden md:flex md:items-center">
            <div
              className={cn(
                "flex items-center rounded-full border px-3 py-1.5 text-sm",
                isScrolled || pathname !== "/" ? "border-gray-200 bg-white" : "border-white/30 bg-black/20 text-white",
              )}
            >
              <MapPin className="mr-1 h-4 w-4" />
              <span className="mr-2">Vancouver, BC</span>
            </div>
          </div>

          {/* Auth Buttons - Desktop Only */}
          <div className="hidden md:flex md:items-center md:gap-2">
            <Button
              variant="ghost"
              className={cn(
                "font-medium",
                isScrolled || pathname !== "/" ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/20",
              )}
            >
              Sign in
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">Join</Button>
          </div>
        </div>
      </div>
    </header>
  )
}
