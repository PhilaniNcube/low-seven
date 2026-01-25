"use client"

import { Cloud } from "lucide-react"
import { SidebarMenuButton } from "@/components/ui/sidebar"

export function SidebarHeaderContent() {
  return (
    <SidebarMenuButton
      asChild
      className="data-[slot=sidebar-menu-button]:p-1.5!"
    >
      <a href="#">
        <Cloud className="size-5!" />
        <span className="text-base font-semibold">Acme Inc.</span>
      </a>
    </SidebarMenuButton>
  )
}
