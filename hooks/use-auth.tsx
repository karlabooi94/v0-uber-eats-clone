"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  isLoading: boolean
  isTestMode: boolean
  toggleTestMode: (value: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user for testing
const testUser: User = {
  id: "test-user-123",
  name: "Ben Booi",
  email: "ben.booi@example.com",
  avatar: "/user-avatar.png",
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isTestMode, setIsTestMode] = useState(false)

  // Check for existing session and test mode on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if test mode is enabled
        const testMode = localStorage.getItem("testMode") === "true"
        setIsTestMode(testMode)

        // If test mode is enabled, set the test user
        if (testMode) {
          setUser(testUser)
          setIsLoading(false)
          return
        }

        // Otherwise check for a real user session
        const savedUser = localStorage.getItem("user")
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simple validation
      if (!email || !password) {
        return { success: false, message: "Email and password are required" }
      }

      // Mock successful login
      const mockUser: User = {
        id: "user-123",
        name: email.split("@")[0],
        email,
        avatar: "/user-avatar.png",
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))

      return { success: true, message: "Login successful" }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, message: "An error occurred during login" }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // Don't log out if in test mode
    if (isTestMode) {
      console.log("Test mode active: logout suppressed")
      return
    }

    setUser(null)
    localStorage.removeItem("user")
  }

  const toggleTestMode = (value: boolean) => {
    setIsTestMode(value)
    localStorage.setItem("testMode", value.toString())

    if (value) {
      // Enable test mode - set test user
      setUser(testUser)
    } else {
      // Disable test mode - restore normal auth state
      const savedUser = localStorage.getItem("user")
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      } else {
        setUser(null)
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isTestMode, toggleTestMode }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
