"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"

import { cn } from "@/lib/utils"

// "line" renders underline-style tabs (a track border with the active tab
// underlined) instead of the default segmented pill. It works in both
// orientations via Base UI's data-orientation. The variant is set on TabsList
// and shared to the triggers through context so each trigger styles itself.
type TabsVariant = "default" | "line"

const TabsListContext = React.createContext<TabsVariant>("default")

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn(
        "flex flex-col gap-2 data-[orientation=vertical]:flex-row",
        className
      )}
      {...props}
    />
  )
}

function TabsList({
  className,
  variant = "default",
  activateOnFocus = true,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & {
  variant?: TabsVariant
}) {
  return (
    <TabsListContext.Provider value={variant}>
      <TabsPrimitive.List
        data-slot="tabs-list"
        data-variant={variant}
        activateOnFocus={activateOnFocus}
        className={cn(
          "text-muted-foreground",
          variant === "default"
            ? "inline-flex h-9 w-fit items-center justify-center gap-1 rounded-lg bg-muted p-1 data-[orientation=vertical]:h-auto data-[orientation=vertical]:flex-col"
            : // Line: a thin track along the edge; the active tab draws the line.
              "flex gap-1 data-[orientation=horizontal]:items-center data-[orientation=horizontal]:border-b data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch data-[orientation=vertical]:border-l",
          className
        )}
        {...props}
      />
    </TabsListContext.Provider>
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Tab>) {
  const variant = React.useContext(TabsListContext)

  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      data-variant={variant}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 text-sm font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        variant === "default"
          ? "h-7 flex-1 rounded-md border border-transparent px-2.5 data-active:bg-background data-active:text-primary data-active:shadow-sm"
          : // Line: transparent edge border that turns primary when active,
            // pulled onto the list's track so the two overlap into one line.
            "rounded-none border-transparent px-2.5 text-muted-foreground data-active:text-primary data-active:border-primary data-[orientation=horizontal]:h-9 data-[orientation=horizontal]:-mb-px data-[orientation=horizontal]:border-b-2 data-[orientation=vertical]:justify-start data-[orientation=vertical]:-ml-px data-[orientation=vertical]:border-l-2 data-[orientation=vertical]:py-1.5",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Panel>) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
