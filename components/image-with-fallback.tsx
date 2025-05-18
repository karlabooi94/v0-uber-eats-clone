"use client"

import { useState, useEffect } from "react"
import Image, { type ImageProps } from "next/image"
import { normalizeImagePath } from "@/utils/image-helpers"

interface ImageWithFallbackProps extends Omit<ImageProps, "src"> {
  src: string
  fallbackSrc: string
}

export function ImageWithFallback({ src, fallbackSrc, alt, ...props }: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string>(normalizeImagePath(src))
  const [error, setError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setImgSrc(normalizeImagePath(src))
    setError(false)
    setLoading(true)
  }, [src])

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <span className="sr-only">Loading...</span>
        </div>
      )}
      <Image
        {...props}
        src={error ? fallbackSrc : imgSrc}
        alt={alt}
        onLoadingComplete={() => setLoading(false)}
        onError={() => {
          setError(true)
          setLoading(false)
        }}
      />
    </div>
  )
}
