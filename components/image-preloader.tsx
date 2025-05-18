"use client"

import { useEffect, useState } from "react"
import { validateImagePaths } from "@/utils/image-helpers"

interface ImagePreloaderProps {
  imagePaths?: string[]
  onComplete?: (results: { loaded: string[]; failed: string[] }) => void
}

export default function ImagePreloader({ imagePaths = [], onComplete }: ImagePreloaderProps) {
  const [loadedImages, setLoadedImages] = useState<string[]>([])
  const [failedImages, setFailedImages] = useState<string[]>([])

  useEffect(() => {
    if (!imagePaths || imagePaths.length === 0) {
      onComplete?.({ loaded: [], failed: [] })
      return
    }

    const validPaths = validateImagePaths(imagePaths)
    let loaded: string[] = []
    let failed: string[] = []

    const preloadImage = (src: string) => {
      return new Promise<void>((resolve) => {
        const img = new Image()

        img.onload = () => {
          loaded = [...loaded, src]
          setLoadedImages((prev) => [...prev, src])
          resolve()
        }

        img.onerror = () => {
          failed = [...failed, src]
          setFailedImages((prev) => [...prev, src])
          console.warn(`Failed to preload image: ${src}`)
          resolve() // Still resolve to continue with other images
        }

        img.src = src
      })
    }

    const preloadAll = async () => {
      try {
        await Promise.all(validPaths.map(preloadImage))
        onComplete?.({ loaded, failed })
      } catch (error) {
        console.error("Error preloading images:", error)
        onComplete?.({ loaded, failed })
      }
    }

    preloadAll()
  }, [imagePaths, onComplete])

  return null // This component doesn't render anything
}
