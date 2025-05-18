"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"

interface AutoCloseToastProps {
  message: string
  duration?: number
  onClose: () => void
}

export function AutoCloseToast({ message, duration = 3000, onClose }: AutoCloseToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300) // Allow time for fade-out animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-black px-4 py-3 text-white shadow-lg transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <p>{message}</p>
      <button
        onClick={() => {
          setVisible(false)
          setTimeout(onClose, 300)
        }}
        className="rounded-full p-1 hover:bg-white/20"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  )
}
