"use client"

import { usePathname } from "next/navigation"

export function PageTitle() {
  const pathname = usePathname()

  // Extract the page name from the pathname
  const getPageTitle = () => {
    // Remove leading slash and split by /
    const segments = pathname.split('/').filter(Boolean)
    
    // If we're just on /dashboard, return "Dashboard"
    if (segments.length === 1 && segments[0] === 'dashboard') {
      return 'Dashboard'
    }
    
    // If we're on a specific page like /dashboard/packages
    if (segments.length >= 2) {
      // Capitalize the page name
      const pageName = segments[1].charAt(0).toUpperCase() + segments[1].slice(1)
      
      // If there are additional segments (like /dashboard/packages/1)
      if (segments.length > 2) {
        const remainingPath = segments.slice(2).join('/')
        return `${pageName} /${remainingPath}`
      }
      
      return pageName
    }
    
    return 'Dashboard'
  }

  return (
    <h1 className="text-base font-medium">{getPageTitle()}</h1>
  )
}
