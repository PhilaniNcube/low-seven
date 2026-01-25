import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 md:py-32 bg-teal-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 leading-relaxed">
            Subscribe to our newsletter and get exclusive deals, travel tips, and early access to new destinations.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-primary-foreground text-foreground placeholder:text-muted-foreground border-0"
            />
            <Button variant="secondary" className="gap-2 shrink-0">
              Subscribe
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-sm text-primary-foreground/60 mt-4">
            No spam, unsubscribe anytime. Join other travelers.
          </p>
        </div>
      </div>
    </section>
  )
}
