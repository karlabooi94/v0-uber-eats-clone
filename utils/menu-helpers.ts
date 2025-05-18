/**
 * Ensures a menu item has valid images by providing fallbacks
 * @param item The menu item to check
 * @param category The category of the item for generating appropriate fallbacks
 * @returns The menu item with validated images
 */
export function ensureValidImages(item: any, category = "food") {
  if (!item) return item

  // If no images array or empty images array
  if (!item.images || !Array.isArray(item.images) || item.images.length === 0) {
    // Create a fallback based on the item name and category
    const fallbackImage = `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(item.name || "")} ${category}`
    return {
      ...item,
      images: [fallbackImage],
    }
  }

  // Filter out any null, undefined or empty string images
  const validImages = item.images.filter((img) => img && img.trim() !== "")

  // If no valid images after filtering
  if (validImages.length === 0) {
    const fallbackImage = `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(item.name || "")} ${category}`
    return {
      ...item,
      images: [fallbackImage],
    }
  }

  return {
    ...item,
    images: validImages,
  }
}

/**
 * Ensures a menu item has a valid price
 * @param item The menu item to check
 * @param defaultPrice The default price to use if none is found
 * @returns The menu item with a validated price
 */
export function ensureValidPrice(item: any, defaultPrice = 0) {
  if (!item) return item

  // Check if basePrice exists and is a number
  const hasValidBasePrice = typeof item.basePrice === "number" && !isNaN(item.basePrice)

  // Check if price exists and is a number (fallback for older data structure)
  const hasValidPrice = typeof item.price === "number" && !isNaN(item.price)

  // If neither price is valid, set a default
  if (!hasValidBasePrice && !hasValidPrice) {
    return {
      ...item,
      basePrice: defaultPrice,
    }
  }

  // If only price is valid, copy it to basePrice for consistency
  if (!hasValidBasePrice && hasValidPrice) {
    return {
      ...item,
      basePrice: item.price,
    }
  }

  return item
}

/**
 * Validates a menu item to ensure it has all required properties
 * @param item The menu item to validate
 * @param category The category of the item
 * @returns A validated menu item
 */
export function validateMenuItem(item: any, category = "food") {
  if (!item) return null

  // Ensure the item has a valid ID
  if (!item.id) {
    item.id = `generated-${Math.random().toString(36).substring(2, 9)}`
  }

  // Ensure the item has a name
  if (!item.name) {
    item.name = "Unnamed Item"
  }

  // Ensure the item has a description
  if (!item.description) {
    item.description = "No description available"
  }

  // Validate images and price
  item = ensureValidImages(item, category)
  item = ensureValidPrice(item)

  return item
}
