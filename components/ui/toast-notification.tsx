"use client"

import { useState, useEffect } from "react"
import { CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ToastNotificationProps {
  message: string
  type?: "success" | "error" | "info"
  duration?: number
  onClose?: () => void
  action?: {
    label: string
    onClick: () => void
  }
}

export function ToastNotification({
  message,
  type = "success",
  duration = 3000,
  onClose,
  action,
}: ToastNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      if (onClose) onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    if (onClose) onClose()
  }

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 flex w-full max-w-md items-center justify-between rounded-lg p-4 shadow-lg",
        type === "success" && "bg-green-50 text-green-800",
        type === "error" && "bg-red-50 text-red-800",
        type === "info" && "bg-blue-50 text-blue-800",
      )}
    >
      <div className="flex items-center">
        {type === "success" && <CheckCircle className="mr-2 h-5 w-5 text-green-500" />}
        <p className="text-sm font-medium">{message}</p>
      </div>
      <div className="flex items-center gap-2">
        {action && (
          <Button variant="ghost" size="sm" onClick={action.onClick} className="text-sm font-medium hover:bg-white/20">
            {action.label}
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={handleClose} className="rounded-full p-1 hover:bg-white/20">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
