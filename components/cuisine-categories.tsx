import Link from "next/link"

const categories = [
  { name: "Pizza", image: "/cuisine/pizza.png" },
  { name: "Sushi", image: "/cuisine/sushi.png" },
  { name: "Burgers", image: "/cuisine/burger.png" },
  { name: "Chinese", image: "/cuisine/chinese.png" },
  { name: "Italian", image: "/cuisine/italian.png" },
  { name: "Mexican", image: "/cuisine/mexican.png" },
  { name: "Dessert", image: "/cuisine/dessert.png" },
  { name: "Healthy", image: "/cuisine/healthy.png" },
]

export default function CuisineCategories() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-8">
      {categories.map((category) => (
        <Link
          key={category.name}
          href={`/restaurants?cuisine=${encodeURIComponent(category.name)}`}
          className="group flex flex-col items-center"
        >
          <div className="mb-2 overflow-hidden rounded-full">
            <img
              src={category.image || "/placeholder.svg"}
              alt={category.name}
              className="h-20 w-20 object-cover transition-transform duration-200 group-hover:scale-110"
            />
          </div>
          <span className="text-sm font-medium">{category.name}</span>
        </Link>
      ))}
    </div>
  )
}
