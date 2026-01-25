import Link from "next/link"
import { MapPin, Mail, Phone, Facebook, Instagram, Twitter, Youtube } from "lucide-react"

const footerLinks = {
  destinations: [
    { name: "Table Mountain", href: "#" },
    { name: "Cape Point", href: "#" },
    { name: "Robben Island", href: "#" },
    { name: "V&A Waterfront", href: "#" },
    { name: "Stellenbosch", href: "#" },
    { name: "Hermanus", href: "#" },
    { name: "Boulders Beach", href: "#" },
    { name: "Cape Winelands", href: "#" },
  ],
  company: [
    { name: "About Us", href: "#" },
    { name: "Our Team", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Press", href: "#" },
    { name: "Partners", href: "#" },
  ],
  support: [
    { name: "Help Center", href: "#" },
    { name: "Contact Us", href: "#" },
    { name: "FAQs", href: "#" },
    { name: "Booking Policy", href: "#" },
    { name: "Cancellation", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer id="about" className="bg-foreground text-background pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="text-xl font-serif font-bold text-background">Low 7</span>
            </Link>
            <p className="text-background/70 mb-6 leading-relaxed max-w-sm">
              Creating unforgettable travel experiences since 2010. Your journey is our passion.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-background/70">
                <Mail className="h-5 w-5" />
                <span>hello@low7.com</span>
              </div>
              <div className="flex items-center gap-3 text-background/70">
                <Phone className="h-5 w-5" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-background mb-4">Destinations</h3>
            <ul className="space-y-3">
              {footerLinks.destinations.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-background/70 hover:text-background transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-background mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-background/70 hover:text-background transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-background mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-background/70 hover:text-background transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-background/60 text-sm">
            2026 Low 7. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-background/60 hover:text-background transition-colors" aria-label="Facebook">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-background/60 hover:text-background transition-colors" aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-background/60 hover:text-background transition-colors" aria-label="Twitter">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-background/60 hover:text-background transition-colors" aria-label="YouTube">
              <Youtube className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
