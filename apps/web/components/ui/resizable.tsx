"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Temporary stub - react-resizable-panels removed due to type issues
// Reinstall with: bun add react-resizable-panels
function ResizablePanelGroup({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function ResizablePanel({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="resizable-panel" {...props}>{children}</div>
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  withHandle?: boolean
}) {
  return (
    <div
      data-slot="resizable-handle"
      className={cn(
        "bg-border relative flex w-px items-center justify-center",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="bg-border h-6 w-1 rounded-lg z-10 flex shrink-0" />
      )}
    </div>
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
