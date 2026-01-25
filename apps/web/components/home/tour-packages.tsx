import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

const packages = [
  {
    id: "pkg_table_mountain_city",
    name: "Table Mountain & City Explorer",
    description: "Experience the iconic Table Mountain via cable car and explore Cape Town's vibrant city center. This package includes guided tours of historic sites, waterfront attractions, and stunning panoramic views from the summit.",
    imageUrl: "/images/city-bowl.jpg",
    basePrice: "599.00",
    isCustom: false,
  },
  {
    id: "pkg_cape_peninsula",
    name: "Cape Peninsula Adventure",
    description: "Journey to Cape Point and discover the famous Boulders Beach penguin colony. This adventure includes scenic coastal drives, wildlife encounters, and visits to the southernmost tip of the Cape Peninsula.",
    imageUrl: "/images/cape-peninsula.jpg",
    basePrice: "449.00",
    isCustom: false,
  },
  {
    id: "pkg_winelands_tour",
    name: "Winelands Premium Tour",
    description: "Indulge in the Cape Winelands with visits to premium estates in Stellenbosch and Franschhoek. Enjoy wine tastings, gourmet meals, and picturesque vineyard landscapes in South Africa's premier wine region.",
    imageUrl: "/images/winelands.jpg",
    basePrice: "899.00",
    isCustom: false,
  },
  {
    id: "pkg_garden_route",
    name: "Garden Route Escape",
    description: "Explore the stunning Garden Route from Plettenberg Bay to Knysna. This package features coastal adventures, wildlife safaris, forest walks, and visits to the famous Knysna Heads and pristine beaches.",
    imageUrl: "/images/garden-route.jpg",
    basePrice: "1299.00",
    isCustom: false,
  },
]

export function TourPackages() {
  return (
    <section id="packages" className="py-20 md:py-32 bg-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-primary font-medium mb-2 tracking-wide uppercase text-sm">
            Curated Experiences
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Featured Tour Packages
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Handpicked by our travel experts, these packages offer the perfect blend of adventure, relaxation, and cultural immersion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="overflow-hidden group border-0 shadow-lg p-0 flex flex-col h-full">
              <div className="relative aspect-4/3 overflow-hidden">
                <Image
                  src={pkg.imageUrl || "/placeholder.svg"}
                  alt={pkg.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <CardContent className="p-5 grow">
                <h3 className="font-serif text-lg font-bold text-foreground mb-3">
                  {pkg.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {pkg.description}
                </p>
              </CardContent>
              <CardFooter className="p-5 pt-0 flex items-center justify-between mt-auto">
                <div>
                  <p className="text-sm text-muted-foreground">From</p>
                  <p className="text-2xl font-bold text-foreground">R {pkg.basePrice}</p>
                </div>
                <Button>View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Packages
          </Button>
        </div>
      </div>
    </section>
  )
}
