import { addHours, isAfter } from "date-fns"

/**
 * Checks if an order is within the modification window (24 hours)
 * @param orderDate The date the order was placed
 * @returns Boolean indicating if the order can be modified
 */
export function isWithinModificationWindow(orderDate: string | Date): boolean {
  try {
    const orderDateTime = typeof orderDate === "string" ? new Date(orderDate) : orderDate
    const modificationDeadline = addHours(orderDateTime, 24)
    const now = new Date()

    return isAfter(modificationDeadline, now)
  } catch (error) {
    console.error("Error checking modification window:", error)
    return false
  }
}

/**
 * Calculates the remaining time for order modification
 * @param orderDate The date the order was placed
 * @returns String representation of remaining time (e.g., "5h 30m")
 */
export function getRemainingModificationTime(orderDate: string | Date): string {
  try {
    const orderDateTime = typeof orderDate === "string" ? new Date(orderDate) : orderDate
    const modificationDeadline = addHours(orderDateTime, 24)
    const now = new Date()

    if (isAfter(modificationDeadline, now)) {
      const diffMs = modificationDeadline.getTime() - now.getTime()
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
      return `${diffHrs}h ${diffMins}m`
    }

    return "0h 0m"
  } catch (error) {
    console.error("Error calculating remaining time:", error)
    return "Unknown"
  }
}
