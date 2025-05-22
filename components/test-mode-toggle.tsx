"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { AlertTriangle } from "lucide-react"

export function TestModeToggle() {
  const { isTestMode, toggleTestMode, user, login, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(!!user)

  // Keep isLoggedIn state in sync with user state
  useEffect(() => {
    setIsLoggedIn(!!user)
  }, [user])

  // Handle login toggle
  const handleLoginToggle = async (checked: boolean) => {
    if (checked) {
      // Simulate login with test credentials
      await login("test@example.com", "password")
    } else {
      logout()
    }
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Toggle button */}
      <Button
        variant={isTestMode ? "destructive" : "secondary"}
        size="sm"
        className="rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isTestMode ? (
          <>
            <AlertTriangle className="mr-1 h-4 w-4" />
            {user ? "Test Mode (Logged In)" : "Test Mode"}
          </>
        ) : (
          "Test Mode"
        )}
      </Button>

      {/* Settings panel */}
      {isOpen && (
        <div className="absolute bottom-12 left-0 w-64 rounded-lg border bg-white p-4 shadow-xl">
          <div className="mb-4 text-sm font-medium">Testing Settings</div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <div>Test Mode</div>
                <div className="text-xs text-gray-500">Bypass authentication</div>
              </div>
              <Switch checked={isTestMode} onCheckedChange={toggleTestMode} />
            </div>

            {isTestMode && (
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <div>Logged In</div>
                  <div className="text-xs text-gray-500">Simulate logged in user</div>
                </div>
                <Switch checked={isLoggedIn} onCheckedChange={handleLoginToggle} />
              </div>
            )}

            {isTestMode && user && (
              <div className="rounded-md bg-yellow-50 p-2 text-xs text-yellow-800">
                <div className="font-medium">Test User Active:</div>
                <div>
                  {user.name} ({user.email})
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
