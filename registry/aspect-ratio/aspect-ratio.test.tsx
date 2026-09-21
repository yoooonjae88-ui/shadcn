import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { AspectRatio } from "@/registry/aspect-ratio/aspect-ratio"

function box() {
  return document.querySelector("[data-slot='aspect-ratio']") as HTMLElement
}

describe("AspectRatio", () => {
  it("puts the ratio on the --ratio custom property", () => {
    render(<AspectRatio ratio={16 / 9} />)
    expect(box().style.getPropertyValue("--ratio")).toBe(String(16 / 9))
  })

  it("drives the shape through the aspect-(--ratio) utility", () => {
    render(<AspectRatio ratio={1} />)
    // `relative` positions the children the consumer absolutely fills.
    expect(box()).toHaveClass("relative", "aspect-(--ratio)")
  })

  it("writes whole and fractional ratios without a unit", () => {
    const { rerender } = render(<AspectRatio ratio={1 / 1} />)
    expect(box().getAttribute("style")).toContain("--ratio: 1")
    expect(box().getAttribute("style")).not.toContain("px")

    rerender(<AspectRatio ratio={9 / 16} />)
    expect(box().style.getPropertyValue("--ratio")).toBe(String(9 / 16))
  })

  it("merges className instead of replacing it", () => {
    render(<AspectRatio ratio={1} className="max-w-sm rounded-lg" />)
    expect(box()).toHaveClass("relative", "aspect-(--ratio)", "max-w-sm", "rounded-lg")
  })

  it("keeps a caller's own style alongside the ratio", () => {
    render(<AspectRatio ratio={4 / 3} style={{ width: "20rem" }} />)
    expect(box().style.width).toBe("20rem")
    expect(box().style.getPropertyValue("--ratio")).toBe(String(4 / 3))
  })

  it("forwards arbitrary div props and children", () => {
    render(
      <AspectRatio ratio={1} id="cover" aria-label="Cover">
        {/* eslint-disable-next-line @next/next/no-img-element -- asserting prop forwarding, not rendering a page */}
        <img src="/globe.svg" alt="A globe" />
      </AspectRatio>
    )
    expect(box()).toHaveAttribute("id", "cover")
    expect(box()).toHaveAttribute("aria-label", "Cover")
    expect(screen.getByAltText("A globe")).toBeInTheDocument()
  })
})
