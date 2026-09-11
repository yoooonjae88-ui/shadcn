import * as React from "react"

import { cn } from "@/lib/utils"

function Menu({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="menu"
      className={cn("w-full min-w-44 text-sm", className)}
      {...props}
    />
  )
}

function MenuList({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="menu-list"
      className={cn("flex flex-col gap-0.5", className)}
      {...props}
    />
  )
}

function MenuLabel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="menu-label"
      className={cn(
        "px-2.5 pt-3 pb-1 text-xs font-medium text-muted-foreground first:pt-0",
        className
      )}
      {...props}
    />
  )
}

function MenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="menu-item"
      className={cn("flex flex-col", className)}
      {...props}
    />
  )
}

function MenuLink({
  active,
  className,
  ...props
}: React.ComponentProps<"a"> & { active?: boolean }) {
  return (
    <a
      data-slot="menu-link"
      data-active={active ? "" : undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-foreground/80 transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 data-active:bg-primary/10 data-active:font-medium data-active:text-primary [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function MenuSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="menu-separator"
      role="separator"
      aria-orientation="horizontal"
      className={cn("my-2 h-px bg-border", className)}
      {...props}
    />
  )
}

export { Menu, MenuList, MenuLabel, MenuItem, MenuLink, MenuSeparator }
