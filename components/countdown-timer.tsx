"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface CountdownTimerProps {
  seconds: number
  onComplete: () => void
  className?: string
}

export function CountdownTimer({ seconds, onComplete, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds)

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete()
      return
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft, onComplete])

  // Calculate percentage for progress bar
  const progressPercentage = (timeLeft / seconds) * 100

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="mb-1 text-sm font-medium">
        Proceeding to payment in <span className="font-bold">{timeLeft}</span> seconds
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full bg-black transition-all duration-1000 ease-linear"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  )
}
