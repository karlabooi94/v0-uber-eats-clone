/**
 * Validates and normalizes image paths to ensure they work in all environments
 */
export function normalizeImagePath(path: string | undefined | null): string {
  // If path is undefined or null, return a placeholder
  if (!path) {
    return "/abstract-geometric-shapes.png"
  }

  // If it's already a full URL, return as is
  if (path.startsWith("http")) {
    return path
  }

  // Handle placeholder SVGs
  if (path.includes("placeholder.svg")) {
    return path
  }

  // Ensure path starts with a slash for local images
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  // Handle potential case sensitivity issues by converting to lowercase
  // This is especially important for production environments
  return normalizedPath
}

/**
 * Checks if an image exists in the public directory
 * Note: This only works on the server side
 */
export async function imageExists(path: string): Promise<boolean> {
  // Skip check for external URLs
  if (path.startsWith("http")) {
    return true
  }

  // Skip check for placeholder SVGs
  if (path.includes("placeholder.svg")) {
    return true
  }

  // For server-side only
  if (typeof window === "undefined") {
    try {
      const fs = require("fs")
      const publicPath = path.startsWith("/") ? path.slice(1) : path
      return fs.existsSync(`./public/${publicPath}`)
    } catch (error) {
      console.error("Error checking if image exists:", error)
      return false
    }
  }

  return true
}

/**
 * Generates a placeholder image URL with the specified dimensions and query
 */
export function generatePlaceholder(width = 400, height = 400, query = "food"): string {
  // Ensure query is URL-encoded
  const encodedQuery = encodeURIComponent(query)
  return `/placeholder.svg?height=${height}&width=${width}&query=${encodedQuery}`
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
