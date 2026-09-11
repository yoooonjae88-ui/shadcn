"use client"

import * as React from "react"
import {
  BarChart3,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  PanelLeft,
  Settings,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarLink,
  SidebarSeparator,
} from "@/registry/sidebar/sidebar"

type Position = "left" | "right"

export function SidebarDemo() {
  const [collapsed, setCollapsed] = React.useState(false)
  const [position, setPosition] = React.useState<Position>("left")
  const [active, setActive] = React.useState("dashboard")

  const sidebar = (
    <Sidebar position={position} collapsed={collapsed}>
      <SidebarGroup>
        <SidebarGroupLabel>Workspace</SidebarGroupLabel>
        <SidebarLink
          href="#"
          icon={<LayoutDashboard />}
          active={active === "dashboard"}
          onClick={() => setActive("dashboard")}
        >
          Dashboard
        </SidebarLink>
        <SidebarLink
          href="#"
          icon={<Users />}
          active={active === "team"}
          onClick={() => setActive("team")}
        >
          Team
        </SidebarLink>
      </SidebarGroup>

      <SidebarSeparator />

      <SidebarGroup>
        <SidebarGroupLabel>Resources</SidebarGroupLabel>
        <SidebarLink
          href="#"
          icon={<FileText />}
          active={active === "docs"}
          onClick={() => setActive("docs")}
        >
          Documents
        </SidebarLink>
        <SidebarLink
          href="#"
          icon={<BarChart3 />}
          active={active === "reports"}
          onClick={() => setActive("reports")}
        >
          Reports
        </SidebarLink>
      </SidebarGroup>

      <SidebarGroup placement="bottom">
        <SidebarLink
          href="#"
          icon={<LifeBuoy />}
          active={active === "support"}
          onClick={() => setActive("support")}
        >
          Support
        </SidebarLink>
        <SidebarLink
          href="#"
          icon={<Settings />}
          active={active === "settings"}
          onClick={() => setActive("settings")}
        >
          Settings
        </SidebarLink>
      </SidebarGroup>
    </Sidebar>
  )

  return (
    <div className="flex w-full max-w-3xl flex-col gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        <Button size="sm" variant="outline" onClick={() => setCollapsed((c) => !c)}>
          <PanelLeft /> {collapsed ? "Expand" : "Collapse"}
        </Button>
        <Button
          size="sm"
          variant={position === "left" ? "default" : "outline"}
          onClick={() => setPosition("left")}
        >
          Dock left
        </Button>
        <Button
          size="sm"
          variant={position === "right" ? "default" : "outline"}
          onClick={() => setPosition("right")}
        >
          Dock right
        </Button>
      </div>

      <div className="flex h-80 overflow-hidden rounded-xl border bg-background">
        {position === "left" && sidebar}
        <div className="flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground">
          Page content
        </div>
        {position === "right" && sidebar}
      </div>
    </div>
  )
}
