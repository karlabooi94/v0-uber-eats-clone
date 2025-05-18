"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { ToastNotification } from "@/components/ui/toast-notification"

type ToastType = "success" | "error" | "info"

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number, action?: Toast["action"]) => void
  hideToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

// Store for the toast function outside of React components
let toastHandler: ToastContextType | undefined = undefined

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (message: string, type: ToastType = "success", duration = 3000, action?: Toast["action"]) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type, duration, action }])
  }

  const hideToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  // Store the toast functions for use outside of components
  toastHandler = { showToast, hideToast }

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <ToastNotification
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => hideToast(toast.id)}
            action={toast.action}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

// Direct toast object for imports
export const toast = {
  success: (message: string, duration?: number, action?: Toast["action"]) => {
    if (toastHandler) {
      toastHandler.showToast(message, "success", duration, action)
    } else {
      console.warn("Toast handler not initialized. Make sure ToastProvider is mounted.")
      // Fallback for SSR or when provider isn't mounted yet
      if (typeof window !== "undefined") {
        // Queue the toast to show after provider is mounted
        setTimeout(() => {
          if (toastHandler) {
            toastHandler.showToast(message, "success", duration, action)
          }
        }, 100)
      }
    }
  },
  error: (message: string, duration?: number, action?: Toast["action"]) => {
    if (toastHandler) {
      toastHandler.showToast(message, "error", duration, action)
    } else {
      console.warn("Toast handler not initialized. Make sure ToastProvider is mounted.")
      // Fallback for SSR or when provider isn't mounted yet
      if (typeof window !== "undefined") {
        setTimeout(() => {
          if (toastHandler) {
            toastHandler.showToast(message, "error", duration, action)
          }
        }, 100)
      }
    }
  },
  info: (message: string, duration?: number, action?: Toast["action"]) => {
    if (toastHandler) {
      toastHandler.showToast(message, "info", duration, action)
    } else {
      console.warn("Toast handler not initialized. Make sure ToastProvider is mounted.")
      // Fallback for SSR or when provider isn't mounted yet
      if (typeof window !== "undefined") {
        setTimeout(() => {
          if (toastHandler) {
            toastHandler.showToast(message, "info", duration, action)
          }
        }, 100)
      }
    }
  },
}
