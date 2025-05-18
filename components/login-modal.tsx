"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckIcon, XIcon, EyeIcon, EyeOffIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoginModalProps {
  children: React.ReactNode
  redirectTo?: string
  isCheckout?: boolean
  action?: string
}

export default function LoginModal({ children, redirectTo, isCheckout = false, action }: LoginModalProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const router = useRouter()
  const { login } = useAuth()

  // Store cart items before login
  const [storedCartItems, setStoredCartItems] = useState<any[]>([])

  // Form states
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
        name: username || "John Doe",
        email: email || "john.doe@example.com",
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
        name: "John Doe",
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

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">{getTitle()}</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-login">Email</Label>
                  <Input
                    id="email-login"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="password-login">Password</Label>
                    <a href="#" className="text-xs text-blue-600 hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Input
                      id="password-login"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                    </button>
                  </div>
                </div>

                <Button className="w-full" onClick={handleEmailLogin} disabled={isLoading}>
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black"></div>
                  ) : (
                    "Login with Email"
                  )}
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-gray-500">or</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 border-2 py-6"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black"></div>
                ) : (
                  <img src="/google-logo.png" alt="Google" className="h-5 w-5" />
                )}
                <span>Continue with Google</span>
              </Button>

              <p className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <button className="text-blue-600 hover:underline" onClick={() => setActiveTab("signup")}>
                  Sign up
                </button>
              </p>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username-signup">Username</Label>
                  <div className="relative">
                    <Input
                      id="username-signup"
                      type="text"
                      placeholder="johndoe"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={cn(
                        usernameValid === false && "border-red-500",
                        usernameValid === true && "border-green-500",
                      )}
                    />
                    {usernameValid !== null && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {usernameValid ? (
                          <CheckIcon className="h-4 w-4 text-green-500" />
                        ) : (
                          <XIcon className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {usernameValid === false && (
                    <p className="text-xs text-red-500">Username must be at least 3 characters</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-signup">Email</Label>
                  <div className="relative">
                    <Input
                      id="email-signup"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={cn(
                        emailValid === false && "border-red-500",
                        emailValid === true && "border-green-500",
                      )}
                    />
                    {emailValid !== null && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {emailValid ? (
                          <CheckIcon className="h-4 w-4 text-green-500" />
                        ) : (
                          <XIcon className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {emailValid === false && <p className="text-xs text-red-500">Please enter a valid email address</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password-signup">Password</Label>
                  <div className="relative">
                    <Input
                      id="password-signup"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={cn(
                        passwordStrength === "weak" && "border-red-500",
                        passwordStrength === "medium" && "border-yellow-500",
                        passwordStrength === "strong" && "border-green-500",
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                    </button>
                  </div>
                  {passwordStrength && (
                    <div className="space-y-1">
                      <div className="flex gap-1 h-1">
                        <div
                          className={cn(
                            "flex-1 rounded-full",
                            passwordStrength === "weak"
                              ? "bg-red-500"
                              : passwordStrength === "medium"
                                ? "bg-yellow-500"
                                : "bg-green-500",
                          )}
                        />
                        <div
                          className={cn(
                            "flex-1 rounded-full",
                            passwordStrength === "weak"
                              ? "bg-gray-200"
                              : passwordStrength === "medium"
                                ? "bg-yellow-500"
                                : "bg-green-500",
                          )}
                        />
                        <div
                          className={cn(
                            "flex-1 rounded-full",
                            passwordStrength === "strong" ? "bg-green-500" : "bg-gray-200",
                          )}
                        />
                      </div>
                      <p
                        className={cn(
                          "text-xs",
                          passwordStrength === "weak"
                            ? "text-red-500"
                            : passwordStrength === "medium"
                              ? "text-yellow-600"
                              : "text-green-500",
                        )}
                      >
                        {passwordStrength === "weak" && "Password is too weak. Use at least 6 characters."}
                        {passwordStrength === "medium" && "Medium strength. Add uppercase letters and numbers."}
                        {passwordStrength === "strong" && "Strong password!"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={cn(
                        confirmPassword && passwordsMatch === false && "border-red-500",
                        confirmPassword && passwordsMatch === true && "border-green-500",
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showConfirmPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                    </button>
                  </div>
                  {confirmPassword && passwordsMatch === false && (
                    <p className="text-xs text-red-500">Passwords do not match</p>
                  )}
                </div>

                <Button
                  className="w-full"
                  onClick={handleEmailSignup}
                  disabled={
                    isLoading || !emailValid || !usernameValid || passwordStrength === "weak" || !passwordsMatch
                  }
                >
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black"></div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-gray-500">or</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 border-2 py-6"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black"></div>
                ) : (
                  <img src="/google-logo.png" alt="Google" className="h-5 w-5" />
                )}
                <span>Sign up with Google</span>
              </Button>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <button className="text-blue-600 hover:underline" onClick={() => setActiveTab("login")}>
                  Log in
                </button>
              </p>
            </TabsContent>
          </Tabs>

          <div className="mt-4 text-center text-xs text-gray-500">
            By continuing, you agree to Uber's{" "}
            <a href="#" className="underline">
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a href="#" className="underline">
              Privacy Policy
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
