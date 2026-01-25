"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { MobileAuthButtons } from "./mobile-auth-buttons"

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85vw] sm:w-[400px] p-0">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col px-6 py-4 space-y-4">
          <Link
            href="#destinations"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
            onClick={() => setIsOpen(false)}
          >
            Destinations
          </Link>
          <Link
            href="#packages"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
            onClick={() => setIsOpen(false)}
          >
            Packages
          </Link>
          <Link
            href="#build-tour"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
            onClick={() => setIsOpen(false)}
          >
            Build Your Tour
          </Link>
          <Link
            href="#about"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <MobileAuthButtons />
        </nav>
      </SheetContent>
    </Sheet>
  )
}
