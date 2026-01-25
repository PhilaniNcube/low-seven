import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

const destinations = [
  {
    name: "Table Mountain",
    image: "/images/table-mountain.jpg",
    photographer: "Magda Ehlers",
    tours: 28,
  },
  {
    name: "Cape Point & Peninsula",
    image: "/images/cape-point.jpg",
    photographer: "op23",
    tours: 22,
  },
  {
    name: "V&A Waterfront",
    image: "/images/va_waterfront.jpg",
    photographer: "Click Shadow",
    tours: 18,
  },
  {
    name: "Robben Island",
    image: "/images/robben-island.jpg",
    photographer: "South African Tourism",
    tours: 15,
  },
  {
    name: "Kirstenbosch Gardens",
    image: "/images/kirstenbosch-gardens.jpg",
    photographer: "Discott",
    tours: 12,
  },
  {
    name: "Cape Winelands",
    image: "/images/cape-winelands.jpg",
    photographer: "Mehrmeerblau",
    tours: 24,
  },
]

export function Destinations() {
  return (
    <section id="destinations" className="py-20 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <p className="text-primary font-medium mb-2 tracking-wide uppercase text-sm">
              Explore
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance">
              Popular Destinations
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md mt-4 md:mt-0 leading-relaxed">
            Discover our most sought-after travel destinations, each offering unique experiences and unforgettable memories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <div
              key={destination.name}
              className="group relative overflow-hidden rounded-2xl aspect-5/4 cursor-pointer"
            >
              <Image
                src={destination.image || "/placeholder.svg"}
                alt={`${destination.name} by ${destination.photographer}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-foreground/80 via-foreground/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-card mb-1">
                      {destination.name}
                    </h3>
                    <p className="text-card/70 text-sm">{destination.tours} tour packages</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-card/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-primary transition-colors">
                    <ArrowUpRight className="h-5 w-5 text-card" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
