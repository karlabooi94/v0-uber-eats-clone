"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import ChefContactForm from "./chef-contact-form"

interface ChefContactButtonProps {
  chef: {
    id: string
    name: string
    email?: string
  }
}

export default function ChefContactButton({ chef }: ChefContactButtonProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleContactClick = () => {
    if (!user) {
      // Store the current URL to redirect back after login
      const currentPath = `/chefs/${chef.id}`
      localStorage.setItem("redirectAfterLogin", currentPath)

      // Redirect to login page
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}&action=contact`)
      return
    }

    // Open the contact form
    setIsFormOpen(true)
  }

  return (
    <>
      <Button className="bg-black text-white hover:bg-black/90" onClick={handleContactClick}>
        <Mail className="mr-2 h-4 w-4" />
        Contact The Chef
      </Button>

      <ChefContactForm chef={chef} isOpen={isFormOpen} onOpenChange={setIsFormOpen} />
    </>
  )
}
