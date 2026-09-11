import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  Sidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarLink,
} from "@/registry/sidebar/sidebar"

function renderSidebar(props: React.ComponentProps<typeof Sidebar> = {}) {
  return render(
    <Sidebar {...props}>
      <SidebarGroup>
        <SidebarGroupLabel>Workspace</SidebarGroupLabel>
        <SidebarLink href="/home" icon={<svg />} active>
          Home
        </SidebarLink>
        <SidebarLink href="/projects" icon={<svg />}>
          Projects
        </SidebarLink>
      </SidebarGroup>
      <SidebarGroup placement="bottom">
        <SidebarLink href="/settings" icon={<svg />}>
          Settings
        </SidebarLink>
      </SidebarGroup>
    </Sidebar>
  )
}

describe("Sidebar", () => {
  it("renders links with the group label when expanded", () => {
    renderSidebar()
    expect(screen.getByText("Workspace")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/home"
    )
  })

  it("marks the active link with aria-current", () => {
    renderSidebar()
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page"
    )
    expect(
      screen.getByRole("link", { name: "Projects" })
    ).not.toHaveAttribute("aria-current")
  })

  it("collapses to icon-only mode, keeping labels for screen readers", () => {
    renderSidebar({ collapsed: true })
    const sidebar = document.querySelector("[data-slot='sidebar']")
    expect(sidebar).toHaveAttribute("data-collapsed")
    expect(sidebar).toHaveClass("w-16")

    // The group heading folds away entirely…
    expect(screen.queryByText("Workspace")).not.toBeInTheDocument()
    // …but link labels survive as sr-only text and a native tooltip.
    const home = screen.getByRole("link", { name: "Home" })
    expect(home).toHaveAttribute("title", "Home")
    expect(screen.getByText("Home")).toHaveClass("sr-only")
  })

  it("gives the bottom group its own separator", () => {
    renderSidebar()
    const bottom = document.querySelector(
      "[data-slot='sidebar-group'][data-placement='bottom']"
    )
    expect(bottom).toHaveClass("mt-auto")
    expect(
      bottom?.querySelector("[data-slot='sidebar-separator']")
    ).toBeInTheDocument()
  })

  it("records its docking position", () => {
    renderSidebar({ position: "right" })
    expect(document.querySelector("[data-slot='sidebar']")).toHaveAttribute(
      "data-position",
      "right"
    )
  })
})
