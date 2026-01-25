"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "@/lib/auth-client"

export function AuthButtons() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return (
      <>
        <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
        <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
      </>
    )
  }

  if (session?.user) {
    return (
      <>
        <span className="text-sm text-muted-foreground hidden lg:inline">
          {session.user.email}
        </span>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">Dashboard</Link>
        </Button>
        <Button variant="outline" size="sm" onClick={() => signOut()}>
          Sign Out
        </Button>
      </>
    )
  }

  return (
    <>
      <Button variant="ghost" size="sm" asChild>
        <Link href="/signin">Sign In</Link>
      </Button>
      <Button size="sm" asChild>
        <Link href="/signup">Get Started</Link>
      </Button>
    </>
  )
}
