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
import { Loader2, Calendar, Clock, Users } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ChefBookingFormProps {
  chef: {
    id: string
    name: string
    email?: string
  }
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function ChefBookingForm({ chef, isOpen, onOpenChange }: ChefBookingFormProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [eventDate, setEventDate] = useState("")
  const [eventTime, setEventTime] = useState("")
  const [guestCount, setGuestCount] = useState("")
  const [eventType, setEventType] = useState("")
  const [location, setLocation] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")

  // Form validation
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    eventDate?: string
    eventTime?: string
    guestCount?: string
    eventType?: string
    location?: string
  }>({})

  // Generate chef email if not provided
  const chefEmail = chef.email || `chef.${chef.id}@vancouverchefconnect.com`

  const validateForm = () => {
    const newErrors: {
      name?: string
      email?: string
      eventDate?: string
      eventTime?: string
      guestCount?: string
      eventType?: string
      location?: string
    } = {}

    if (!name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!eventDate) {
      newErrors.eventDate = "Event date is required"
    }

    if (!eventTime) {
      newErrors.eventTime = "Event time is required"
    }

    if (!guestCount) {
      newErrors.guestCount = "Number of guests is required"
    }

    if (!eventType) {
      newErrors.eventType = "Event type is required"
    }

    if (!location.trim()) {
      newErrors.location = "Location is required"
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
        subject: `Private Event Booking Request for Chef ${chef.name}`,
        name,
        eventDate,
        eventTime,
        guestCount,
        eventType,
        location,
        specialRequests,
      })

      toast.success("Booking request sent successfully!")

      // Reset form and close dialog
      setEventDate("")
      setEventTime("")
      setGuestCount("")
      setEventType("")
      setLocation("")
      setSpecialRequests("")
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to send booking request", error)
      toast.error("Failed to send booking request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Generate time options
  const generateTimeOptions = () => {
    const options = []
    for (let hour = 8; hour <= 22; hour++) {
      const hourStr = hour % 12 === 0 ? 12 : hour % 12
      const period = hour < 12 ? "AM" : "PM"
      options.push(`${hourStr}:00 ${period}`)
      options.push(`${hourStr}:30 ${period}`)
    }
    return options
  }

  // Generate guest count options
  const generateGuestOptions = () => {
    const options = []
    for (let i = 2; i <= 50; i++) {
      options.push(i.toString())
    }
    return options
  }

  return (
    <FormDialog title={`Book Chef ${chef.name} for a Private Event`} isOpen={isOpen} onOpenChange={onOpenChange}>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="eventDate" className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              Event Date
            </Label>
            <Input
              id="eventDate"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              disabled={isSubmitting}
              className={errors.eventDate ? "border-red-500" : ""}
            />
            {errors.eventDate && <p className="text-xs text-red-500">{errors.eventDate}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventTime" className="flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              Event Time
            </Label>
            <Select value={eventTime} onValueChange={setEventTime}>
              <SelectTrigger id="eventTime" className={errors.eventTime ? "border-red-500" : ""}>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {generateTimeOptions().map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.eventTime && <p className="text-xs text-red-500">{errors.eventTime}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="guestCount" className="flex items-center">
              <Users className="mr-1 h-4 w-4" />
              Number of Guests
            </Label>
            <Select value={guestCount} onValueChange={setGuestCount}>
              <SelectTrigger id="guestCount" className={errors.guestCount ? "border-red-500" : ""}>
                <SelectValue placeholder="Select guest count" />
              </SelectTrigger>
              <SelectContent>
                {generateGuestOptions().map((count) => (
                  <SelectItem key={count} value={count}>
                    {count} {Number.parseInt(count) === 1 ? "guest" : "guests"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.guestCount && <p className="text-xs text-red-500">{errors.guestCount}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventType">Event Type</Label>
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger id="eventType" className={errors.eventType ? "border-red-500" : ""}>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dinner_party">Dinner Party</SelectItem>
                <SelectItem value="birthday">Birthday Celebration</SelectItem>
                <SelectItem value="anniversary">Anniversary</SelectItem>
                <SelectItem value="corporate">Corporate Event</SelectItem>
                <SelectItem value="holiday">Holiday Gathering</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.eventType && <p className="text-xs text-red-500">{errors.eventType}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Event Location</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Your home address or venue"
            disabled={isSubmitting}
            className={errors.location ? "border-red-500" : ""}
          />
          {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
          <Textarea
            id="specialRequests"
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            placeholder="Dietary restrictions, cuisine preferences, or any other special requests"
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Booking Request"
            )}
          </Button>
        </div>
      </form>
    </FormDialog>
  )
}
