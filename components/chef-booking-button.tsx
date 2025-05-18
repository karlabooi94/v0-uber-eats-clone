"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import ChefBookingForm from "./chef-booking-form"

interface ChefBookingButtonProps {
  chef: {
    id: string
    name: string
    email?: string
  }
}

export default function ChefBookingButton({ chef }: ChefBookingButtonProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleBookingClick = () => {
    if (!user) {
      // Store the current URL to redirect back after login
      const currentPath = `/chefs/${chef.id}`
      localStorage.setItem("redirectAfterLogin", currentPath)

      // Redirect to login page
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}&action=booking`)
      return
    }

    // Open the booking form
    setIsFormOpen(true)
  }

  return (
    <>
      <Button variant="outline" onClick={handleBookingClick}>
        <Calendar className="mr-2 h-4 w-4" />
        Book Private Event
      </Button>

      <ChefBookingForm chef={chef} isOpen={isFormOpen} onOpenChange={setIsFormOpen} />
    </>
  )
}
