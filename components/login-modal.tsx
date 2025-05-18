"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/hooks/use-toast"

interface LoginModalProps {
  children: React.ReactNode
  redirectTo?: string
  isCheckout?: boolean
  action?: string
  redirectUrl?: string
}

export default function LoginModal({ children, redirectTo, isCheckout = false, action, redirectUrl }: LoginModalProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const router = useRouter()
  const { login, isTestMode } = useAuth()

  // Store cart items before login
  const [storedCartItems, setStoredCartItems] = useState<any[]>([])

  // Form states
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  // Validation states
  const [emailValid, setEmailValid] = useState<boolean | null>(null)
  const [usernameValid, setUsernameValid] = useState<boolean | null>(null)
  const [passwordStrength, setPasswordStrength] = useState<"weak" | "medium" | "strong" | null>(null)
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null)

  // Store cart items when modal opens
  useEffect(() => {
    if (open) {
      try {
        // Try to get cart items from localStorage directly
        const cartItems = localStorage.getItem("cart")
        if (cartItems) {
          setStoredCartItems(JSON.parse(cartItems))
        }
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error)
      }
    }
  }, [open])

  // Validate email format
  useEffect(() => {
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      setEmailValid(emailRegex.test(email))
    }
  }, [email])

  // Validate username (at least 3 characters)
  useEffect(() => {
    if (username) {
      setUsernameValid(username.length >= 3)
    }
  }, [username])

  // Check password strength
  useEffect(() => {
    if (password) {
      // Simple password strength check
      if (password.length < 6) {
        setPasswordStrength("weak")
      } else if (password.length < 10 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        setPasswordStrength("medium")
      } else {
        setPasswordStrength("strong")
      }
    }
  }, [password])

  // Check if passwords match
  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword)
    }
  }, [password, confirmPassword])

  // Helper function to handle successful login/signup
  const handleSuccessfulAuth = (userData: any) => {
    login({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar || "/user-avatar.png",
    })

    setIsLoading(false)
    setOpen(false)

    // Store user-specific cart in localStorage
    try {
      if (storedCartItems.length > 0) {
        localStorage.setItem(`cart_${userData.id}`, JSON.stringify(storedCartItems))
      }
    } catch (error) {
      console.error("Failed to save user cart", error)
    }

    toast.success("Successfully logged in!")

    // Check for stored redirect URL
    const storedRedirect = localStorage.getItem("redirectAfterLogin")
    if (storedRedirect) {
      localStorage.removeItem("redirectAfterLogin")
      router.push(storedRedirect)
      return
    }

    // Redirect to checkout if that's where the user was headed
    if (isCheckout) {
      router.push("/checkout")
    } else if (redirectTo) {
      // Otherwise redirect to specified page
      router.push(redirectTo)
    } else {
      // Default to dashboard
      router.push("/dashboard")
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful login
      const userData = {
        id: "user123",
        name: username || "Ben Booi",
        email: email || "ben.booi@example.com",
        avatar: "/user-avatar.png",
      }

      handleSuccessfulAuth(userData)
    } catch (error) {
      setIsLoading(false)
      toast.error("Failed to login. Please try again.")
    }
  }

  const handleEmailSignup = async () => {
    // Validate all fields before submission
    if (!emailValid || !usernameValid || passwordStrength === "weak" || !passwordsMatch) {
      toast.error("Please fix the errors in the form before submitting.")
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful signup and login
      const userData = {
        id: "user456",
        name: username,
        email: email,
        avatar: "/user-avatar.png",
      }

      handleSuccessfulAuth(userData)
    } catch (error) {
      setIsLoading(false)
      toast.error("Failed to create account. Please try again.")
    }
  }

  const handleEmailLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter both email and password.")
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful login
      const userData = {
        id: "user123",
        name: "Ben Booi",
        email: email,
        avatar: "/user-avatar.png",
      }

      handleSuccessfulAuth(userData)
    } catch (error) {
      setIsLoading(false)
      toast.error("Invalid email or password. Please try again.")
    }
  }

  // Determine the title based on action
  const getTitle = () => {
    if (isCheckout) return "Sign in to complete your order"
    if (action === "contact") return "Sign in to contact the chef"
    if (action === "booking") return "Sign in to book a private event"
    return "Log in or sign up"
  }

  // If test mode is enabled, clicking the login button should just redirect
  // without showing the modal
  const handleClick = () => {
    if (isTestMode) {
      console.log("🧪 Test mode enabled - Bypassing login modal")

      // Redirect based on the same logic as successful login
      if (isCheckout) {
        router.push("/checkout")
      } else if (redirectTo) {
        router.push(redirectTo)
      } else {
        router.push("/dashboard")
      }

      return
    }

    // Normal behavior - open the modal
    setOpen(true)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // const result = await login(email, password)
      const result = { success: true, message: "" } // Mock result for now

      if (result.success) {
        setIsOpen(false)
        if (redirectUrl) {
          router.push(redirectUrl)
        }
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // If in test mode and there's a redirect URL, go there directly
  const handleOpenChange = (open: boolean) => {
    if (isTestMode && redirectUrl && open) {
      router.push(redirectUrl)
      return
    }
    setIsOpen(open)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log in to your account</DialogTitle>
          <DialogDescription>Enter your email and password to access your account.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
