"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down"
  priority?: boolean
  fallbackSrc?: string
  onLoad?: () => void
  onError?: () => void
}

export function OptimizedImage({
  src,
  alt,
  width = 500,
  height = 300,
  className = "",
  objectFit = "cover",
  priority = false,
  fallbackSrc,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)

  // Reset loading state when src changes
  useEffect(() => {
    setIsLoading(true)
    setError(false)
    setCurrentSrc(src)
  }, [src])

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setError(true)
    setIsLoading(false)
    if (fallbackSrc && fallbackSrc !== currentSrc) {
      setCurrentSrc(fallbackSrc)
    }
    onError?.()
  }

  // Determine object-fit style
  const objectFitClass = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
    none: "object-none",
    "scale-down": "object-scale-down",
  }[objectFit]

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width: "100%", height: "100%" }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse" aria-hidden="true">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-400 rounded-full animate-spin"></div>
        </div>
      )}
      <Image
        src={currentSrc || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          "transition-opacity duration-300",
          objectFitClass,
          isLoading ? "opacity-0" : "opacity-100",
          error && !fallbackSrc ? "hidden" : "block",
          "w-full h-full",
        )}
        onLoad={handleLoad}
        onError={handleError}
        priority={priority}
        data-meal-type="full-indian-fusion-experience"
      />
      {error && !fallbackSrc && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-500 p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-center text-sm">Image could not be loaded</p>
        </div>
      )}
    </div>
  )
}
