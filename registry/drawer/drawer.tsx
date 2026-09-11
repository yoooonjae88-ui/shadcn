"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Whether the current Drawer is persistent. A persistent drawer ignores
// backdrop clicks and the Escape key, so it can only be dismissed through an
// explicit <DrawerClose> (or by controlling `open` yourself).
const DrawerPersistentContext = React.createContext(false)

function Drawer({
  persistent = false,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root> & {
  /**
   * When true the drawer stays open until an explicit close button is pressed
   * (or `open` is controlled externally): backdrop clicks and the Escape key
   * are ignored.
   * @default false
   */
  persistent?: boolean
}) {
  const handleOpenChange: typeof onOpenChange = (open, eventDetails) => {
    // Block the dismissal gestures while persistent, but still allow the
    // explicit close button and any programmatic/imperative changes.
    if (
      persistent &&
      !open &&
      (eventDetails.reason === "outside-press" ||
        eventDetails.reason === "escape-key")
    ) {
      eventDetails.cancel()
      return
    }
    onOpenChange?.(open, eventDetails)
  }

  return (
    <DrawerPersistentContext.Provider value={persistent}>
      <DialogPrimitive.Root
        data-slot="drawer"
        onOpenChange={handleOpenChange}
        {...props}
      />
    </DrawerPersistentContext.Provider>
  )
}

function DrawerTrigger(
  props: React.ComponentProps<typeof DialogPrimitive.Trigger>
) {
  return <DialogPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerClose(
  props: React.ComponentProps<typeof DialogPrimitive.Close>
) {
  return <DialogPrimitive.Close data-slot="drawer-close" {...props} />
}

const drawerVariants = cva(
  // Surface color comes from the `--drawer-background` CSS variable (shipped via
  // this item's `cssVars` in registry.json) so it can be themed independently of
  // the page background. Edit the value per mode in globals.css :root / .dark.
  "fixed z-50 flex flex-col bg-drawer-background shadow-lg outline-none transition-transform duration-300 ease-out data-ending-style:duration-200",
  {
    variants: {
      side: {
        // The side sets position, the cross-axis full span and the slide
        // transform. The main-axis extent (width for left/right, height for
        // top/bottom) is set per-size below so `size` maps to the axis the
        // drawer actually grows along.
        right:
          "inset-y-0 right-0 h-full w-3/4 data-starting-style:translate-x-full data-ending-style:translate-x-full",
        left: "inset-y-0 left-0 h-full w-3/4 data-starting-style:-translate-x-full data-ending-style:-translate-x-full",
        top: "inset-x-0 top-0 h-3/4 w-full data-starting-style:-translate-y-full data-ending-style:-translate-y-full",
        bottom:
          "inset-x-0 bottom-0 h-3/4 w-full data-starting-style:translate-y-full data-ending-style:translate-y-full",
      },
      // Declared here so cva knows the axis; the actual dimension is applied by
      // the side-aware compoundVariants (max-width vs max-height).
      size: {
        sm: "",
        md: "",
        lg: "",
        xl: "",
        full: "",
      },
    },
    compoundVariants: [
      // Left / right → cap the width. `full` drops the cap and 3/4 clamp.
      { side: ["left", "right"], size: "sm", className: "max-w-xs" },
      { side: ["left", "right"], size: "md", className: "max-w-sm" },
      { side: ["left", "right"], size: "lg", className: "max-w-md" },
      { side: ["left", "right"], size: "xl", className: "max-w-lg" },
      {
        side: ["left", "right"],
        size: "full",
        className: "w-screen max-w-none",
      },
      // Top / bottom → cap the height.
      { side: ["top", "bottom"], size: "sm", className: "max-h-72" },
      { side: ["top", "bottom"], size: "md", className: "max-h-96" },
      { side: ["top", "bottom"], size: "lg", className: "max-h-[32rem]" },
      { side: ["top", "bottom"], size: "xl", className: "max-h-[40rem]" },
      {
        side: ["top", "bottom"],
        size: "full",
        className: "h-screen max-h-none",
      },
    ],
    defaultVariants: {
      side: "right",
      size: "md",
    },
  }
)

function DrawerContent({
  className,
  side = "right",
  size = "md",
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Popup> &
  VariantProps<typeof drawerVariants>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop
        data-slot="drawer-backdrop"
        className="fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0"
      />
      <DialogPrimitive.Popup
        data-slot="drawer-content"
        data-side={side}
        data-size={size}
        className={cn(drawerVariants({ side, size }), className)}
        {...props}
      >
        {children}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        "flex flex-col gap-1 px-5 py-4 text-left",
        className
      )}
      {...props}
    />
  )
}

function DrawerTitle({
  className,
  icon,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title> & {
  /**
   * Optional icon rendered to the left of the title text. Sized and colored to
   * match the title via the `[&_svg]` rules below; pass any element (e.g. a
   * lucide icon).
   */
  icon?: React.ReactNode
}) {
  return (
    <DialogPrimitive.Title
      data-slot="drawer-title"
      className={cn(
        "flex items-center gap-2 text-base font-semibold text-foreground [&_svg]:size-5 [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </DialogPrimitive.Title>
  )
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function DrawerBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-body"
      className={cn("flex-1 overflow-y-auto px-5 py-4", className)}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn(
        "mt-auto flex flex-col-reverse gap-2 px-5 py-4 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
}
