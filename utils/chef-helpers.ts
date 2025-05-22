import type { Chef } from "@/types"

// This function simulates fetching chef profiles from user accounts
// In a real app, this would query your database for users who:
// 1. Have the "isChef" flag set to true
// 2. Have completed all required chef profile fields
// 3. Have the "findable" option enabled
export function getActiveUserChefs(): Chef[] {
  // Simulated data for Ben's chef profile
  return [
    {
      id: "user-chef-ben",
      name: "Chef Ben Booi",
      image: "/user-avatar.png", // This would be Ben's uploaded profile picture
      cuisine: "West Coast Fusion",
      rating: 4.8,
      reviewCount: "5",
      location: "Downtown Vancouver",
      specialty: "Sustainable Seafood",
      bio: "Specializing in locally-sourced ingredients with a focus on sustainable seafood and seasonal produce.",
      specialties: ["Sustainable Seafood", "Farm-to-Table", "Pacific Northwest"],
    },
  ]
}

// This function would check if a specific user has a findable chef profile
// In a real app, this would check the user's profile in your database
export function hasChefProfile(userId: string): boolean {
  // For demo purposes, we'll say ben.booi@example.com has a chef profile
  return userId === "ben.booi@example.com"
}

// This function would get a specific user's chef profile
// In a real app, this would fetch the user's chef profile from your database
export function getUserChefProfile(userId: string): Chef | null {
  if (userId === "ben.booi@example.com") {
    return {
      id: "user-chef-ben",
      name: "Chef Ben Booi",
      image: "/user-avatar.png",
      cuisine: "West Coast Fusion",
      rating: 4.8,
      reviewCount: "5",
      location: "Downtown Vancouver",
      specialty: "Sustainable Seafood",
      bio: "Specializing in locally-sourced ingredients with a focus on sustainable seafood and seasonal produce.",
      specialties: ["Sustainable Seafood", "Farm-to-Table", "Pacific Northwest"],
    }
  }
  return null
}
