"use client"

import { useState, useEffect } from "react"
import { normalizeImagePath } from "@/utils/image-utils"

interface ImageValidatorProps {
  imagePaths: string[]
  onValidationComplete?: (results: Record<string, boolean>) => void
}

export function ImageValidator({ imagePaths, onValidationComplete }: ImageValidatorProps) {
  const [validationResults, setValidationResults] = useState<Record<string, boolean>>({})
  const [isValidating, setIsValidating] = useState(false)

  useEffect(() => {
    if (imagePaths.length === 0 || isValidating) return

    setIsValidating(true)
    const results: Record<string, boolean> = {}

    const validateImage = (path: string): Promise<boolean> => {
      return new Promise((resolve) => {
        const normalizedPath = normalizeImagePath(path)
        const img = new Image()

        img.onload = () => {
          results[path] = true
          resolve(true)
        }

        img.onerror = () => {
          results[path] = false
          console.warn(`Image failed to load: ${normalizedPath}`)
          resolve(false)
        }

        img.src = normalizedPath
      })
    }

    Promise.all(imagePaths.map(validateImage))
      .then(() => {
        setValidationResults(results)
        setIsValidating(false)
        if (onValidationComplete) {
          onValidationComplete(results)
        }
      })
      .catch((error) => {
        console.error("Error validating images:", error)
        setIsValidating(false)
      })
  }, [imagePaths, onValidationComplete])

  // This component doesn't render anything visible
  return null
}
