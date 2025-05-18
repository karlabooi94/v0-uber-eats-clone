"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import LoginModal from "@/components/login-modal"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const redirect = searchParams.get("redirect") || "/dashboard"
  const action = searchParams.get("action")

  // If user is already logged in, redirect
  useEffect(() => {
    if (user) {
      router.push(redirect)
    }
  }, [user, router, redirect])

  // Store redirect path in localStorage for after login
  useEffect(() => {
    if (redirect && redirect !== "/dashboard") {
      localStorage.setItem("redirectAfterLogin", redirect)
    }
  }, [redirect])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome to Vancouver Chef Connect</h1>
          <p className="mt-2 text-gray-600">
            {action === "contact"
              ? "Sign in to contact the chef"
              : action === "booking"
                ? "Sign in to book a private event"
                : "Sign in to your account"}
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <LoginModal redirectTo={redirect} action={action || undefined}>
            <Button className="w-full">Click here to sign in</Button>
          </LoginModal>
        </div>
      </div>
    </div>
  )
}
