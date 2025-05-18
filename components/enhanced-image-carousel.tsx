"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EnhancedImageCarouselProps {
  images: string[]
  alt: string
  className?: string
}

export function EnhancedImageCarousel({ images, alt, className = "" }: EnhancedImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const mainImageRef = useRef<HTMLDivElement>(null)
  const thumbnailsRef = useRef<HTMLDivElement>(null)
  const [canScrollThumbnails, setCanScrollThumbnails] = useState(false)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  // Check if thumbnails are scrollable
  useEffect(() => {
    if (thumbnailsRef.current) {
      setCanScrollThumbnails(thumbnailsRef.current.scrollWidth > thumbnailsRef.current.clientWidth)
    }
  }, [images])

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index)
  }

  // Touch event handlers for main image
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      handleNext()
    }
    if (isRightSwipe) {
      handlePrev()
    }
  }

  // Scroll the thumbnail into view when current index changes
  useEffect(() => {
    if (thumbnailsRef.current) {
      const thumbnailWidth = thumbnailsRef.current.scrollWidth / images.length
      thumbnailsRef.current.scrollTo({
        left: thumbnailWidth * currentIndex - thumbnailWidth,
        behavior: "smooth",
      })
    }
  }, [currentIndex, images.length])

  // If there's only one image, just show it without controls
  if (images.length === 1) {
    return (
      <div className={cn("overflow-hidden rounded-lg", className)}>
        <div className="aspect-[4/3] w-full overflow-hidden">
          <img src={images[0] || "/placeholder.svg"} alt={alt} className="h-full w-full object-cover" />
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Main large image */}
      <div
        ref={mainImageRef}
        className="relative aspect-[4/3] w-full overflow-hidden rounded-lg"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img
          src={images[currentIndex] || "/placeholder.svg"}
          alt={`${alt} - Image ${currentIndex + 1}`}
          className="h-full w-full object-cover transition-opacity duration-300"
        />

        {/* Image counter badge */}
        <div className="absolute bottom-3 right-3 rounded-full bg-black/70 px-2 py-1 text-xs text-white">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Navigation arrows */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-white/80 text-gray-800 opacity-80 shadow-sm hover:bg-white hover:opacity-100"
          onClick={handlePrev}
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous image</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-white/80 text-gray-800 opacity-80 shadow-sm hover:bg-white hover:opacity-100"
          onClick={handleNext}
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next image</span>
        </Button>

        {/* Image navigation dots */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-1">
          {images.map((_, index) => (
            <button
              key={index}
              className={`h-1.5 w-1.5 rounded-full transition-all ${
                currentIndex === index ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail strip with scroll indicators */}
      <div className="relative">
        {/* Left scroll indicator */}
        {canScrollThumbnails && currentIndex > 0 && (
          <div className="absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-white to-transparent pointer-events-none flex items-center">
            <div className="ml-1 bg-white rounded-full p-1 shadow-sm">
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </div>
          </div>
        )}

        {/* Right scroll indicator */}
        {canScrollThumbnails && currentIndex < images.length - 1 && (
          <div className="absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-white to-transparent pointer-events-none flex items-center justify-end">
            <div className="mr-1 bg-white rounded-full p-1 shadow-sm">
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </div>
          </div>
        )}

        <div
          ref={thumbnailsRef}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
          aria-label="Image thumbnails"
        >
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                "flex-shrink-0 overflow-hidden rounded-md transition-all",
                currentIndex === index
                  ? "h-16 w-16 border-2 border-black opacity-100"
                  : "h-14 w-14 border border-gray-200 opacity-70 hover:opacity-100",
              )}
              aria-label={`View image ${index + 1}`}
              aria-current={currentIndex === index}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`${alt} thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Also export as default for backward compatibility
export default EnhancedImageCarousel
