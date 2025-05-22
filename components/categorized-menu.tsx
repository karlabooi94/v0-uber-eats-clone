"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DishCarouselWithAddOns from "./dish-carousel-with-addons"
import DynamicCheckoutButton from "./dynamic-checkout-button"
import { onePotMeals, indianDinner, cantoneseDinner, bbqDinner, italianDinner, mealPackages } from "@/data/menu-items"
import type { MenuItem } from "@/types/menu"

interface CategorizedMenuProps {
  onDishSelect?: (dish: MenuItem) => void
}

export default function CategorizedMenu({ onDishSelect }: CategorizedMenuProps) {
  const [activeTab, setActiveTab] = useState("all")

  return (
    <div className="space-y-8 relative pb-20">
      <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
        <div className="mb-6 overflow-x-auto pb-2">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="all">All Menus</TabsTrigger>
            <TabsTrigger value="one-pot">One Pot Meals</TabsTrigger>
            <TabsTrigger value="packages">Complete Dinners</TabsTrigger>
            <TabsTrigger value="indian">Indian</TabsTrigger>
            <TabsTrigger value="cantonese">Cantonese</TabsTrigger>
            <TabsTrigger value="bbq">BBQ</TabsTrigger>
            <TabsTrigger value="italian">Italian</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          <div className="mb-6">
            <p className="text-gray-600">
              Browse our complete selection of meals and dishes, from quick one-pot options to complete dinner
              experiences for four.
            </p>
          </div>

          <DishCarouselWithAddOns
            title="Complete Dinner Experiences"
            description="Full multi-course meals for four people"
            items={mealPackages}
            onDishSelect={onDishSelect}
          />

          <DishCarouselWithAddOns
            title="One Pot Family Meals"
            description="Quick and easy meals perfect for busy weeknights"
            items={onePotMeals}
            onDishSelect={onDishSelect}
          />

          <DishCarouselWithAddOns
            title="Indian Cuisine"
            description="Authentic Indian dishes with Chef Dylan's signature twist"
            items={indianDinner}
            onDishSelect={onDishSelect}
          />

          <DishCarouselWithAddOns
            title="Cantonese Cuisine"
            description="Traditional Cantonese dishes with premium ingredients"
            items={cantoneseDinner}
            onDishSelect={onDishSelect}
          />

          <DishCarouselWithAddOns
            title="Backyard BBQ"
            description="Classic American BBQ favorites for the whole family"
            items={bbqDinner}
            onDishSelect={onDishSelect}
          />

          <DishCarouselWithAddOns
            title="Italian Cuisine"
            description="Authentic Italian dishes made with imported ingredients"
            items={italianDinner}
            onDishSelect={onDishSelect}
          />
        </TabsContent>

        <TabsContent value="one-pot" className="mt-0">
          <div className="mb-6">
            <p className="text-gray-600">
              Quick and easy one-pot meals perfect for busy weeknights. Each meal serves 2-3 people and comes ready to
              heat and enjoy.
            </p>
          </div>

          <DishCarouselWithAddOns
            title="One Pot Family Meals"
            description="Quick and easy meals perfect for busy weeknights"
            items={onePotMeals}
            onDishSelect={onDishSelect}
          />
        </TabsContent>

        <TabsContent value="packages" className="mt-0">
          <div className="mb-6">
            <p className="text-gray-600">
              Complete dinner experiences for four people. Each package includes appetizers, main courses, sides, and
              desserts.
            </p>
          </div>

          <DishCarouselWithAddOns
            title="Complete Dinner Experiences"
            description="Full multi-course meals for four people"
            items={mealPackages}
            onDishSelect={onDishSelect}
          />
        </TabsContent>

        <TabsContent value="indian" className="mt-0">
          <div className="mb-6">
            <p className="text-gray-600">
              Authentic Indian cuisine featuring traditional spices and techniques with Chef Dylan's signature twist.
            </p>
          </div>

          <DishCarouselWithAddOns
            title="Indian Cuisine"
            description="Authentic Indian dishes with Chef Dylan's signature twist"
            items={indianDinner}
            onDishSelect={onDishSelect}
          />
        </TabsContent>

        <TabsContent value="cantonese" className="mt-0">
          <div className="mb-6">
            <p className="text-gray-600">
              Traditional Cantonese dishes made with premium ingredients and authentic techniques.
            </p>
          </div>

          <DishCarouselWithAddOns
            title="Cantonese Cuisine"
            description="Traditional Cantonese dishes with premium ingredients"
            items={cantoneseDinner}
            onDishSelect={onDishSelect}
          />
        </TabsContent>

        <TabsContent value="bbq" className="mt-0">
          <div className="mb-6">
            <p className="text-gray-600">
              Classic American BBQ favorites featuring slow-smoked meats and homemade sides.
            </p>
          </div>

          <DishCarouselWithAddOns
            title="Backyard BBQ"
            description="Classic American BBQ favorites for the whole family"
            items={bbqDinner}
            onDishSelect={onDishSelect}
          />
        </TabsContent>

        <TabsContent value="italian" className="mt-0">
          <div className="mb-6">
            <p className="text-gray-600">
              Authentic Italian dishes made with imported ingredients and traditional recipes.
            </p>
          </div>

          <DishCarouselWithAddOns
            title="Italian Cuisine"
            description="Authentic Italian dishes made with imported ingredients"
            items={italianDinner}
            onDishSelect={onDishSelect}
          />
        </TabsContent>
      </Tabs>

      {/* Dynamic checkout button */}
      <DynamicCheckoutButton />
    </div>
  )
}
