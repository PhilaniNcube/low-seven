import Link from "next/link"
import { MapPin } from "lucide-react"
import { Suspense } from "react"
import { MobileNav } from "./mobile-nav"
import { AuthButtons } from "./auth-buttons"


function AuthButtonsSkeleton() {
  return (
    <>
      <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
      <div className="h-9 w-24 bg-muted animate-pulse rounded-md" />
    </>
  )
}

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="text-xl font-serif font-bold text-foreground">Low 7</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="#destinations" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Destinations
            </Link>
            <Link 
              href="#packages" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Packages
            </Link>
            <Link 
              href="#build-tour" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Build Your Tour
            </Link>
            <Link 
              href="#about" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Suspense fallback={<AuthButtonsSkeleton />}>
              <AuthButtons />
            </Suspense>
          </div>

          <MobileNav />
        </div>
      </div>
    </header>
  )
}
