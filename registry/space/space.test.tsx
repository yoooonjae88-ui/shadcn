import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Space, SpaceCompact } from "@/registry/space/space"

describe("Space", () => {
  it("wraps each child in an item element", () => {
    render(
      <Space data-testid="space">
        <button>One</button>
        <button>Two</button>
      </Space>
    )
    const items = screen
      .getByTestId("space")
      .querySelectorAll("[data-slot='space-item']")
    expect(items).toHaveLength(2)
  })

  it("skips null and boolean children entirely", () => {
    render(
      <Space data-testid="space">
        <button>One</button>
        {null}
        {false}
        <button>Two</button>
      </Space>
    )
    expect(
      screen.getByTestId("space").querySelectorAll("[data-slot='space-item']")
    ).toHaveLength(2)
  })

  it("resolves size presets and numbers to a gap style", () => {
    const { rerender } = render(<Space data-testid="space" />)
    expect(screen.getByTestId("space")).toHaveStyle({ gap: "8px" })

    rerender(<Space data-testid="space" size="large" />)
    expect(screen.getByTestId("space")).toHaveStyle({ gap: "24px" })

    rerender(<Space data-testid="space" size={12} />)
    expect(screen.getByTestId("space")).toHaveStyle({ gap: "12px" })
  })

  it("accepts a [horizontal, vertical] size pair", () => {
    render(<Space data-testid="space" size={["small", 32]} />)
    expect(screen.getByTestId("space")).toHaveStyle({
      columnGap: "8px",
      rowGap: "32px",
    })
  })

  it("centers items by default only when horizontal", () => {
    const { rerender } = render(<Space data-testid="space" />)
    expect(screen.getByTestId("space")).toHaveClass("items-center")

    rerender(<Space data-testid="space" direction="vertical" />)
    expect(screen.getByTestId("space")).not.toHaveClass("items-center")
    expect(screen.getByTestId("space")).toHaveClass("flex-col")
  })

  it("renders the split node between items but not before the first", () => {
    render(
      <Space data-testid="space" split="|">
        <span>A</span>
        <span>B</span>
        <span>C</span>
      </Space>
    )
    const splits = screen
      .getByTestId("space")
      .querySelectorAll("[data-slot='space-split']")
    expect(splits).toHaveLength(2)
  })

  it("applies item class and style to every wrapper", () => {
    render(
      <Space
        data-testid="space"
        classNames={{ item: "item-class" }}
        styles={{ item: { opacity: 0.5 } }}
      >
        <span>A</span>
        <span>B</span>
      </Space>
    )
    for (const item of screen
      .getByTestId("space")
      .querySelectorAll("[data-slot='space-item']")) {
      expect(item).toHaveClass("item-class")
      expect(item).toHaveStyle({ opacity: "0.5" })
    }
  })
})

describe("SpaceCompact", () => {
  it("renders a compact group, exposed as Space.Compact too", () => {
    expect(Space.Compact).toBe(SpaceCompact)
    render(
      <SpaceCompact data-testid="compact">
        <button>One</button>
        <button>Two</button>
      </SpaceCompact>
    )
    expect(screen.getByTestId("compact")).toHaveAttribute(
      "data-slot",
      "space-compact"
    )
  })

  it("stretches to the parent width with block", () => {
    const { rerender } = render(<SpaceCompact data-testid="compact" />)
    expect(screen.getByTestId("compact")).toHaveClass("inline-flex")

    rerender(<SpaceCompact data-testid="compact" block />)
    expect(screen.getByTestId("compact")).toHaveClass("w-full")
  })

  it("stacks vertically when direction is vertical", () => {
    render(<SpaceCompact data-testid="compact" direction="vertical" />)
    expect(screen.getByTestId("compact")).toHaveClass("flex-col")
  })
})
