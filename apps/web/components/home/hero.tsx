import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/cape-town.jpg"
          alt="Cape Town by Andrew harvard"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-foreground/40" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl">
          <p className="text-accent font-medium mb-4 tracking-wide uppercase text-sm">
            Your Journey Begins Here
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold text-card mb-6 leading-tight text-balance">
            Discover the World, Your Way
          </h1>
          <p className="text-lg md:text-xl text-card/90 mb-8 max-w-2xl leading-relaxed">
            Choose from our curated tour packages or build your own custom adventure. 
            From serene beaches to bustling cities, we make your dream vacation a reality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="gap-2">
              Explore Packages
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2 bg-card/10 border-card/30 text-card hover:bg-card/20 hover:text-card">
              <Play className="h-4 w-4" />
              Watch Video
            </Button>
          </div>

          <div className="mt-12 flex items-center gap-8 pt-8 border-t border-card/20">
            <div>
              <p className="text-3xl font-bold text-card">10+</p>
              <p className="text-sm text-card/70">Destinations</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-card">100+</p>
              <p className="text-sm text-card/70">Happy Travelers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-card">4.9</p>
              <p className="text-sm text-card/70">Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
