/**
 * Helper function to generate multiple images for meal options
 */
export function generateMealImages(baseImage: string, count = 3): string[] {
  if (!baseImage) {
    return ["/gourmet-meal.png", "/food-close-up-high-resolution.png", "/placeholder-nkdvx.png"]
  }

  // If we have a real image, use it as the first image
  const images = [baseImage]

  // Add placeholder variations
  for (let i = 1; i < count; i++) {
    // Extract the filename without extension
    const filenameParts = baseImage.split(".")
    const extension = filenameParts.pop()
    const filename = filenameParts.join(".")

    // Try to use numbered variations if they might exist
    images.push(`${filename}-${i + 1}.${extension}`)
  }

  return images
}

/**
 * Generates a placeholder image URL with the specified dimensions and query
 */
export function generatePlaceholder(width = 400, height = 400, query = "food"): string {
  // Ensure query is URL-encoded and doesn't contain problematic characters
  const safeQuery = encodeURIComponent(query.replace(/[^\w\s-]/g, ""))
  return `/placeholder.svg?height=${height}&width=${width}&query=${safeQuery}`
}

/**
 * Attempts to fix common image path issues
 */
export function attemptImagePathFix(path: string): string[] {
  const possiblePaths = [path]

  // Try with and without leading slash
  if (path.startsWith("/")) {
    possiblePaths.push(path.substring(1))
  } else {
    possiblePaths.push(`/${path}`)
  }

  // Try with lowercase (for case-sensitive file systems)
  possiblePaths.push(path.toLowerCase())

  // Try with different common image extensions
  if (!getFileExtension(path)) {
    const extensions = ["jpg", "jpeg", "png", "webp"]
    extensions.forEach((ext) => {
      possiblePaths.push(`${path}.${ext}`)
    })
  }

  return [...new Set(possiblePaths)] // Remove duplicates
}

/**
 * Validates and normalizes image paths
 */
export function validateImagePaths(paths: string[]): string[] {
  if (!paths || !Array.isArray(paths)) return []

  return paths.filter((path) => typeof path === "string" && path.trim() !== "").map((path) => normalizeImagePath(path))
}

/**
 * Normalizes an image path to ensure it's properly formatted
 */
export function normalizeImagePath(path: string): string {
  if (!path) return "/abstract-colorful-swirls.png"

  // If it's already a URL, return it as is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path
  }

  // Ensure path starts with a slash
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  return normalizedPath
}

/**
 * Gets a safe image path with fallback
 */
export function getSafeImagePath(path: string | undefined, fallback = "/abstract-colorful-swirls.png"): string {
  if (!path) return fallback
  return normalizeImagePath(path)
}

/**
 * Extracts the file extension from a path
 */
export function getFileExtension(path: string): string | null {
  const match = path.match(/\.([a-zA-Z0-9]+)(?:\?.*)?$/)
  return match ? match[1].toLowerCase() : null
}

/**
 * Checks if a path is an image
 */
export function isImagePath(path: string): boolean {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg", "avif"]
  const extension = getFileExtension(path)
  return extension ? imageExtensions.includes(extension) : false
}

/**
 * Checks if an image exists
 */
export async function checkImageExists(path: string): Promise<boolean> {
  try {
    const normalizedPath = normalizeImagePath(path)
    const response = await fetch(normalizedPath, { method: "HEAD" })
    return response.ok
  } catch (error) {
    console.error(`Error checking image existence: ${path}`, error)
    return false
  }
}
