import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  Menu,
  MenuItem,
  MenuLabel,
  MenuLink,
  MenuList,
  MenuSeparator,
} from "@/registry/menu/menu"

function renderMenu() {
  return render(
    <Menu aria-label="Main">
      <MenuLabel>Workspace</MenuLabel>
      <MenuList>
        <MenuItem>
          <MenuLink href="/dashboard" active>
            Dashboard
          </MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink href="/projects">Projects</MenuLink>
        </MenuItem>
      </MenuList>
      <MenuSeparator />
      <MenuList>
        <MenuItem>
          <MenuLink href="/settings">Settings</MenuLink>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

describe("Menu", () => {
  it("renders a navigation landmark", () => {
    renderMenu()
    expect(
      screen.getByRole("navigation", { name: "Main" })
    ).toBeInTheDocument()
  })

  it("renders all links with their targets", () => {
    renderMenu()
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "href",
      "/dashboard"
    )
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute(
      "href",
      "/projects"
    )
    expect(screen.getByRole("link", { name: "Settings" })).toHaveAttribute(
      "href",
      "/settings"
    )
  })

  it("marks only the active link with aria-current and data-active", () => {
    renderMenu()
    const active = screen.getByRole("link", { name: "Dashboard" })
    const inactive = screen.getByRole("link", { name: "Projects" })

    expect(active).toHaveAttribute("aria-current", "page")
    expect(active).toHaveAttribute("data-active")
    expect(inactive).not.toHaveAttribute("aria-current")
    expect(inactive).not.toHaveAttribute("data-active")
  })

  it("renders group labels", () => {
    renderMenu()
    expect(screen.getByText("Workspace")).toBeInTheDocument()
  })

  it("renders separators with a separator role", () => {
    renderMenu()
    expect(screen.getByRole("separator")).toBeInTheDocument()
  })
})
