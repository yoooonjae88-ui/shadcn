import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Masthead } from "@/registry/masthead/masthead"

describe("Masthead", () => {
  it("renders a horizontal banner with placeholder text by default", () => {
    render(<Masthead />)
    const banner = screen.getByRole("banner")
    expect(banner).toHaveAttribute("data-orientation", "horizontal")
    expect(screen.getByText("Placeholder text")).toBeInTheDocument()
  })

  it("renders custom text via prop or children", () => {
    const { rerender } = render(<Masthead text="Custom" />)
    expect(screen.getByText("Custom")).toBeInTheDocument()

    rerender(<Masthead text="Custom">Children win</Masthead>)
    expect(screen.getByText("Children win")).toBeInTheDocument()
    expect(screen.queryByText("Custom")).not.toBeInTheDocument()
  })

  it("renders the decorative visual strip", () => {
    render(<Masthead />)
    const visual = screen
      .getByRole("banner")
      .querySelector("[data-slot='masthead-visual']")
    expect(visual).toBeInTheDocument()
    // 7 segments: 4 coloured blocks + 3 gaps.
    expect(visual?.children).toHaveLength(7)
  })

  it("keeps text visible when hideText is set horizontally", () => {
    render(<Masthead hideText />)
    expect(screen.getByText("Placeholder text")).toBeInTheDocument()
  })

  it("hides the text only in the vertical orientation", () => {
    render(<Masthead orientation="vertical" hideText />)
    expect(screen.queryByText("Placeholder text")).not.toBeInTheDocument()
    expect(screen.getByRole("banner")).toHaveAttribute(
      "data-orientation",
      "vertical"
    )
  })

  it("records the docking side", () => {
    render(<Masthead orientation="vertical" side="right" />)
    expect(screen.getByRole("banner")).toHaveAttribute("data-side", "right")
  })
})
