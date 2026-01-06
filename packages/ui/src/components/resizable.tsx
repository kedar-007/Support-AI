"use client"

import * as React from "react"
import { GripVerticalIcon } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@workspace/ui/lib/utils"

/* ---------------- Panel Group ---------------- */

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => {
  return (
    <ResizablePrimitive.PanelGroup
      className={cn(
        "flex h-full w-full min-w-0 data-[panel-group-direction=vertical]:flex-col",
        className
      )}
      {...props}
    />
  )
}

/* ---------------- Panel ---------------- */

const ResizablePanel = (
  props: React.ComponentProps<typeof ResizablePrimitive.Panel>
) => {
  return (
    <ResizablePrimitive.Panel
      className="min-w-0 min-h-0"
      {...props}
    />
  )
}

/* ---------------- Resize Handle ---------------- */

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean
}) => {
  return (
    <ResizablePrimitive.PanelResizeHandle
      className={cn(
        "relative flex w-1 bg-border hover:bg-border/80 transition-colors",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center">
          <GripVerticalIcon className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  )
}

export {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
}
