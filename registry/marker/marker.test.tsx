import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import {
  Marker,
  MarkerContent,
  MarkerIcon,
  markerVariants,
} from "@/registry/marker/marker"

function root() {
  return document.querySelector("[data-slot='marker']") as HTMLElement
}

describe("Marker", () => {
  it("renders a div carrying the marker slot and default variant", () => {
    render(
      <Marker>
        <MarkerContent>Explored 4 files</MarkerContent>
      </Marker>
    )
    expect(root().tagName).toBe("DIV")
    expect(root()).toHaveAttribute("data-variant", "default")
    expect(screen.getByText("Explored 4 files")).toHaveAttribute(
      "data-slot",
      "marker-content"
    )
  })

  it("marks each variant on the element", () => {
    for (const variant of ["default", "separator", "border"] as const) {
      const { unmount } = render(
        <Marker variant={variant}>
          <MarkerContent>Today</MarkerContent>
        </Marker>
      )
      expect(root()).toHaveAttribute("data-variant", variant)
      unmount()
    }
  })

  it("styles the separator with decorative rules and the border with a rule", () => {
    const { unmount } = render(<Marker variant="separator">Today</Marker>)
    // The lines are ::before/::after, so they add nothing announceable.
    expect(root().className).toMatch(/before:bg-border/)
    expect(root().className).toMatch(/after:bg-border/)
    unmount()

    render(<Marker variant="border">Today</Marker>)
    expect(root()).toHaveClass("border-b", "pb-2")
  })

  it("hides the icon slot from assistive tech", () => {
    render(
      <Marker>
        <MarkerIcon>
          <svg data-testid="glyph" />
        </MarkerIcon>
        <MarkerContent>Synced</MarkerContent>
      </Marker>
    )
    const icon = document.querySelector("[data-slot='marker-icon']")!
    expect(icon).toHaveAttribute("aria-hidden", "true")
    expect(icon).toContainElement(screen.getByTestId("glyph"))
  })

  it("renders as a link through the render prop", () => {
    render(
      <Marker render={<a href="/files" />}>
        <MarkerContent>View the pull request</MarkerContent>
      </Marker>
    )
    const link = screen.getByRole("link", { name: "View the pull request" })
    expect(link).toHaveAttribute("href", "/files")
    expect(link).toHaveAttribute("data-slot", "marker")
  })

  it("renders as a button and stays clickable", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Marker render={<button type="button" />} onClick={onClick}>
        <MarkerContent>Retry</MarkerContent>
      </Marker>
    )
    // mergeProps keeps the caller's handler alongside the rendered element.
    await user.click(screen.getByRole("button", { name: "Retry" }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("forwards role so a status marker is announced", () => {
    render(
      <Marker role="status">
        <MarkerContent>Compacting conversation</MarkerContent>
      </Marker>
    )
    expect(screen.getByRole("status")).toHaveAttribute("data-slot", "marker")
  })

  it("merges className rather than replacing the variant classes", () => {
    render(<Marker className="flex-col">Syncing</Marker>)
    expect(root()).toHaveClass("flex-col", "flex", "text-sm")
  })

  it("exports markerVariants, which applies its own default", () => {
    expect(markerVariants()).toBe(markerVariants({ variant: "default" }))
    expect(markerVariants({ variant: "border" })).toContain("border-b")
  })
})
