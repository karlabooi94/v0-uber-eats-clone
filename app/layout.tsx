import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { OrderProvider } from "@/hooks/use-order"
import { AuthProvider } from "@/hooks/use-auth"
import { CartProvider } from "@/hooks/use-cart"
import { ToastProvider } from "@/hooks/use-toast"
import ImagePreloader from "@/components/image-preloader"
import { TestModeToggle } from "@/components/test-mode-toggle"

const inter = Inter({ subsets: ["latin"] })

// Critical images that should be preloaded
const criticalImages = [
  "/table-for-two-hero.png",
  "/meals/indian-fusion.png",
  "/meals/chicken-biryani.png",
  "/meals/biryani-plate.png",
  "/indian-vegetable-pakora.png",
  "/uber-eats-logo.png",
  "/food-background.png",
  "/diverse-food-spread.png",
  "/chefs/chef-dylan-storey.png",
]

export const metadata: Metadata = {
  title: "Table for Two | Premium 4-Course Meals Delivered",
  description:
    "Experience intimate dining at home with curated 4-course meals delivered to your door. Premium ingredients, local flavors, $80 per person.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Add preload link tags for critical images */}
        {criticalImages.map((src, index) => (
          <link key={index} rel="preload" as="image" href={src} />
        ))}
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <ToastProvider>
              <CartProvider>
                <OrderProvider>
                  <ImagePreloader imagePaths={criticalImages} />
                  {children}
                  <TestModeToggle />
                </OrderProvider>
              </CartProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
