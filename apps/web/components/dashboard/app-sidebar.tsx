import * as React from "react"
import {
  Calendar,
  MapPin,
  LayoutDashboard,
  Package,
  DollarSign,
  Star,
  Users,
  Activity,
} from "lucide-react"

import { NavMain } from '@/components/dashboard/nav-main'
import { NavUser } from '@/components/dashboard/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { SidebarHeaderContent } from './sidebar-header-content'

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Activities",
      url: "/dashboard/activities",
      icon: Activity,
    },
    {
      title: "Packages",
      url: "/dashboard/packages",
      icon: Package,
    },
    {
      title: "Bookings",
      url: "/dashboard/bookings",
      icon: Calendar,
    },
    {
      title: "Guides",
      url: "/dashboard/guides",
      icon: MapPin,
    },
    {
      title: "Reviews",
      url: "/dashboard/reviews",
      icon: Star,
    },
    {
      title: "Payments",
      url: "/dashboard/payments",
      icon: DollarSign,
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: Users,
    },
  ],
  navClouds: [],
  navSecondary: [],
  documents: [],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarHeaderContent />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
