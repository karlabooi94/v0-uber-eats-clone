"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { normalizeImagePath } from "@/utils/image-helpers"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down"
  onLoad?: () => void
  onError?: () => void
  fallbackSrc?: string
}

export function OptimizedImage({
  src,
  alt,
  width = 400,
  height = 400,
  className = "",
  priority = false,
  objectFit = "cover",
  onLoad,
  onError,
  fallbackSrc,
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 2

  // Generate a placeholder URL
  const generatePlaceholder = (width: number, height: number, query = "image") => {
    // Make the placeholder more specific by including a timestamp to prevent caching
    const uniqueId = Date.now().toString().slice(-6)
    return `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(query)}&id=${uniqueId}`
  }

  // Normalize the image path on component mount and when src changes
  useEffect(() => {
    try {
      // Reset states when src changes
      setIsLoading(true)
      setHasError(false)
      setRetryCount(0)

      // Handle empty or undefined src
      if (!src) {
        console.warn("Empty image source provided, using fallback")
        setImgSrc(fallbackSrc || generatePlaceholder(width, height, alt))
        return
      }

      // Generate a unique cache-busting parameter to prevent image reuse
      const cacheBuster = `?v=${Date.now().toString().slice(-6)}`

      // Normalize the path and add cache buster
      const normalized = normalizeImagePath(src) + cacheBuster
      setImgSrc(normalized)
    } catch (error) {
      console.error("Error normalizing image path:", error)
      setImgSrc(fallbackSrc || generatePlaceholder(width, height, alt))
      setHasError(true)
    }
  }, [src, width, height, alt, fallbackSrc])

  const handleError = () => {
    console.warn(`Image load failed: ${imgSrc}`)

    if (retryCount < maxRetries) {
      // Try with a different path format
      const newSrc = src.startsWith("/") ? src.substring(1) : `/${src}`
      const cacheBuster = `?v=${Date.now().toString().slice(-6)}`
      setImgSrc(normalizeImagePath(newSrc) + cacheBuster)
      setRetryCount(retryCount + 1)
    } else {
      console.error(`Failed to load image after ${maxRetries} retries: ${src}`)

      // Use provided fallback or generate a placeholder with more specific alt text
      const fallback = fallbackSrc || generatePlaceholder(width, height, `${alt} (failed to load)`)
      setImgSrc(fallback)
      setHasError(true)
      if (onError) onError()
    }
  }

  const handleLoad = () => {
    setIsLoading(false)
    if (onLoad) onLoad()
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width: "100%", height: "100%" }}>
      {isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse"
          style={{ zIndex: 1 }}
        >
          <span className="sr-only">Loading image...</span>
        </div>
      )}

      {/* Use next/image for optimized images */}
      <Image
        src={imgSrc || generatePlaceholder(width, height, alt)}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          objectFit,
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.3s ease-in-out",
        }}
        className={`${hasError ? "border border-red-300" : ""}`}
        unoptimized={true} // Add this to bypass Next.js image optimization which might be causing caching issues
      />

      {hasError && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-100 text-red-600 text-xs p-1 text-center">
          Failed to load: {src.split("/").pop()}
        </div>
      )}
    </div>
  )
}
