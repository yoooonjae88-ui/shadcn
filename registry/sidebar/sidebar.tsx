"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type SidebarPosition = "left" | "right"
type SidebarGroupPlacement = "top" | "bottom"

const SidebarContext = React.createContext<{
  // The feature flag: when collapsed, links render their icon only and labels
  // are visually hidden (kept in the DOM for screen readers).
  collapsed: boolean
  position: SidebarPosition
}>({ collapsed: false, position: "left" })

function Sidebar({
  position = "left",
  collapsed = false,
  className,
  ...props
}: React.ComponentProps<"aside"> & {
  position?: SidebarPosition
  collapsed?: boolean
}) {
  return (
    <SidebarContext.Provider value={{ collapsed, position }}>
      <aside
        data-slot="sidebar"
        data-position={position}
        data-collapsed={collapsed ? "" : undefined}
        className={cn(
          "flex h-full flex-col gap-1 bg-background p-2 text-sm transition-[width] duration-200",
          collapsed ? "w-16" : "w-60",
          className
        )}
        {...props}
      />
    </SidebarContext.Provider>
  )
}

function SidebarGroup({
  placement = "top",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { placement?: SidebarGroupPlacement }) {
  return (
    <div
      data-slot="sidebar-group"
      data-placement={placement}
      // A bottom group is pushed to the foot of the sidebar with `mt-auto` and
      // carries its own separator at the top, so the divider always sits next
      // to the bottom group rather than floating in the middle.
      className={cn(
        "flex flex-col gap-0.5",
        placement === "bottom" && "mt-auto",
        className
      )}
      {...props}
    >
      {placement === "bottom" && <SidebarSeparator />}
      {children}
    </div>
  )
}

function SidebarGroupLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { collapsed } = React.useContext(SidebarContext)

  // The group heading only makes sense when labels are visible, so it folds
  // away entirely in icon-only mode.
  if (collapsed) return null

  return (
    <div
      data-slot="sidebar-group-label"
      className={cn(
        "px-2.5 pt-2 pb-1 text-xs font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function SidebarLink({
  icon,
  active,
  className,
  children,
  ...props
}: React.ComponentProps<"a"> & {
  icon?: React.ReactNode
  active?: boolean
}) {
  const { collapsed } = React.useContext(SidebarContext)

  return (
    <a
      data-slot="sidebar-link"
      data-active={active ? "" : undefined}
      aria-current={active ? "page" : undefined}
      // In icon-only mode the label survives as a native tooltip so the link
      // stays identifiable on hover.
      title={collapsed && typeof children === "string" ? children : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg px-2.5 py-2 text-foreground/80 transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 data-active:bg-primary/10 data-active:font-medium data-active:text-primary [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
        collapsed && "justify-center",
        className
      )}
      {...props}
    >
      {icon}
      <span className={cn("truncate", collapsed && "sr-only")}>{children}</span>
    </a>
  )
}

function SidebarSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-separator"
      role="separator"
      aria-orientation="horizontal"
      className={cn("my-1.5 h-px bg-sidebar-separator", className)}
      {...props}
    />
  )
}

export {
  Sidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarLink,
  SidebarSeparator,
}
