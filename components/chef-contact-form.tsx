"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FormDialog } from "@/components/ui/form-dialog"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"

interface ChefContactFormProps {
  chef: {
    id: string
    name: string
    email?: string
  }
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function ChefContactForm({ chef, isOpen, onOpenChange }: ChefContactFormProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [message, setMessage] = useState("")

  // Form validation
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    message?: string
  }>({})

  // Generate chef email if not provided
  const chefEmail = chef.email || `chef.${chef.id}@vancouverchefconnect.com`

  const validateForm = () => {
    const newErrors: {
      name?: string
      email?: string
      message?: string
    } = {}

    if (!name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!message.trim()) {
      newErrors.message = "Message is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // In a real application, you would send this data to your backend
      // For this example, we'll simulate a successful API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate sending email
      console.log({
        to: chefEmail,
        from: email,
        subject: `Inquiry for Chef ${chef.name}`,
        name,
        message,
      })

      toast.success("Message sent successfully!")

      // Reset form and close dialog
      setMessage("")
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to send message", error)
      toast.error("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormDialog title={`Contact Chef ${chef.name}`} isOpen={isOpen} onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Your Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            disabled={isSubmitting}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Your Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john.doe@example.com"
            disabled={isSubmitting}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Your Message</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Hello Chef ${chef.name.split(" ")[0]},\n\nI'm interested in learning more about your culinary services.`}
            rows={5}
            disabled={isSubmitting}
            className={errors.message ? "border-red-500" : ""}
          />
          {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </Button>
        </div>
      </form>
    </FormDialog>
  )
}
