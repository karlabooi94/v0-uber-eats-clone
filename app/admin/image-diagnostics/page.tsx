"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { normalizeImagePath, attemptImagePathFix } from "@/utils/image-helpers"

export default function ImageDiagnosticsPage() {
  const [imagePath, setImagePath] = useState("/public/meals/chicken-biryani.png")
  const [normalizedPath, setNormalizedPath] = useState("")
  const [possiblePaths, setPossiblePaths] = useState<string[]>([])
  const [testResults, setTestResults] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)

  // Common image paths to test
  const commonPaths = [
    "/public/meals/chicken-biryani.png",
    "public/meals/chicken-biryani.png",
    "/meals/chicken-biryani.png",
    "meals/chicken-biryani.png",
    "/public/meals/chicken-tandoori-1.png",
    "public/meals/chicken-tandoori-1.png",
    "/meals/chicken-tandoori-1.png",
    "meals/chicken-tandoori-1.png",
    "/public/meals/vegetable-pakora-1.png",
    "public/meals/vegetable-pakora-1.png",
    "/meals/vegetable-pakora-1.png",
    "meals/vegetable-pakora-1.png",
    "/public/meals/garlic-naan-1.png",
    "public/meals/garlic-naan-1.png",
    "/meals/garlic-naan-1.png",
    "meals/garlic-naan-1.png",
    "/public/meals/gulab-jamun-1.png",
    "public/meals/gulab-jamun-1.png",
    "/meals/gulab-jamun-1.png",
    "meals/gulab-jamun-1.png",
  ]

  useEffect(() => {
    if (imagePath) {
      try {
        const normalized = normalizeImagePath(imagePath)
        setNormalizedPath(normalized)

        const paths = attemptImagePathFix(imagePath)
        setPossiblePaths(paths)
      } catch (error) {
        console.error("Error processing image path:", error)
      }
    }
  }, [imagePath])

  const handleTestImage = async () => {
    setIsLoading(true)
    const results: Record<string, boolean> = {}

    // Test each possible path
    for (const path of possiblePaths) {
      try {
        const img = new Image()

        // Create a promise to handle the image loading
        const loadPromise = new Promise<boolean>((resolve) => {
          img.onload = () => resolve(true)
          img.onerror = () => resolve(false)
        })

        img.src = path

        // Wait for the image to load or fail
        results[path] = await loadPromise
      } catch (error) {
        results[path] = false
      }
    }

    setTestResults(results)
    setIsLoading(false)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Image Diagnostics</h1>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Test Image Path:</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={imagePath}
            onChange={(e) => setImagePath(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <Button onClick={handleTestImage} disabled={isLoading}>
            {isLoading ? "Testing..." : "Test Image"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Path Information</h2>

          <div className="mb-4">
            <h3 className="font-medium">Normalized Path:</h3>
            <code className="block p-2 bg-gray-100 rounded">{normalizedPath}</code>
          </div>

          <div className="mb-4">
            <h3 className="font-medium">Possible Paths:</h3>
            <ul className="space-y-1 mt-2">
              {possiblePaths.map((path, index) => (
                <li key={index} className="flex items-center gap-2">
                  <code className="p-1 bg-gray-100 rounded">{path}</code>
                  {testResults[path] !== undefined && (
                    <span className={testResults[path] ? "text-green-500" : "text-red-500"}>
                      {testResults[path] ? "✓" : "✗"}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Image Preview</h2>

          <div className="border rounded p-4">
            <OptimizedImage
              src={imagePath}
              alt="Test image"
              width={400}
              height={300}
              className="w-full h-64 object-contain bg-gray-50"
            />
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2">Common Test Images:</h3>
            <div className="grid grid-cols-2 gap-2">
              {commonPaths.slice(0, 8).map((path, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setImagePath(path)}
                  className="text-xs justify-start overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  {path}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Common Test Images</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {commonPaths.slice(0, 8).map((path, index) => (
            <div key={index} className="border rounded overflow-hidden">
              <OptimizedImage
                src={path}
                alt={`Test image ${index + 1}`}
                width={200}
                height={150}
                className="w-full h-32 object-cover"
              />
              <div className="p-2 text-xs truncate bg-gray-50">{path}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
