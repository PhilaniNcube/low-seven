"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, MapPin } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="text-xl font-serif font-bold text-foreground">Low 7</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#destinations" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Destinations
            </Link>
            <Link href="#packages" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Packages
            </Link>
            <Link href="#build-tour" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Build Your Tour
            </Link>
            <Link href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm">Sign In</Button>
            <Button size="sm">Get Started</Button>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="px-4 py-4 space-y-4">
            <Link href="#destinations" className="block text-sm font-medium text-muted-foreground hover:text-foreground">
              Destinations
            </Link>
            <Link href="#packages" className="block text-sm font-medium text-muted-foreground hover:text-foreground">
              Packages
            </Link>
            <Link href="#build-tour" className="block text-sm font-medium text-muted-foreground hover:text-foreground">
              Build Your Tour
            </Link>
            <Link href="#about" className="block text-sm font-medium text-muted-foreground hover:text-foreground">
              About
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              <Button variant="ghost" size="sm" className="justify-start">Sign In</Button>
              <Button size="sm">Get Started</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
