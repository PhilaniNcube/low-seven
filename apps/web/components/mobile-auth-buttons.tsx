"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "@/lib/auth-client"

export function MobileAuthButtons() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return (
      <div className="flex flex-col gap-3 pt-4 border-t border-border">
        <div className="h-9 w-full bg-muted animate-pulse rounded-md" />
        <div className="h-9 w-full bg-muted animate-pulse rounded-md" />
      </div>
    )
  }

  if (session?.user) {
    return (
      <div className="flex flex-col gap-3 pt-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="justify-start w-full"
          asChild
        >
          <Link href="/dashboard">Dashboard</Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="justify-start w-full"
          onClick={() => signOut()}
        >
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 pt-4 border-t border-border">
      <Button
        variant="ghost"
        size="sm"
        className="justify-start w-full"
        asChild
      >
        <Link href="/signin">Sign In</Link>
      </Button>
      <Button size="sm" className="w-full" asChild>
        <Link href="/signup">Get Started</Link>
      </Button>
    </div>
  )
}
