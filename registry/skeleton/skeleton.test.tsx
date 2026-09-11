import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  Skeleton,
  SkeletonDialog,
  SkeletonList,
  SkeletonStats,
  SkeletonTable,
} from "@/registry/skeleton/skeleton"

describe("Skeleton", () => {
  it("renders a pulsing placeholder block", () => {
    render(<Skeleton data-testid="skeleton" />)
    const el = screen.getByTestId("skeleton")
    expect(el).toHaveAttribute("data-slot", "skeleton")
    expect(el).toHaveClass("animate-pulse", "bg-skeleton")
  })

  it("merges custom sizing classes", () => {
    render(<Skeleton data-testid="skeleton" className="h-4 w-24 rounded-full" />)
    expect(screen.getByTestId("skeleton")).toHaveClass(
      "h-4",
      "w-24",
      "rounded-full"
    )
  })

  it("SkeletonTable renders a header plus the requested number of rows", () => {
    render(<SkeletonTable data-testid="table" rows={6} />)
    const blocks = screen
      .getByTestId("table")
      .querySelectorAll("[data-slot='skeleton']")
    // 3 header cells + 6 rows × 3 cells
    expect(blocks).toHaveLength(3 + 6 * 3)
  })

  it("SkeletonStats renders the requested number of stat cards", () => {
    render(<SkeletonStats data-testid="stats" count={5} />)
    // Each card holds 3 skeleton blocks.
    expect(
      screen.getByTestId("stats").querySelectorAll("[data-slot='skeleton']")
    ).toHaveLength(5 * 3)
  })

  it("SkeletonList renders one row per requested item", () => {
    render(<SkeletonList data-testid="list" rows={2} />)
    const avatars = Array.from(
      screen.getByTestId("list").querySelectorAll("[data-slot='skeleton']")
    ).filter((el) => el.className.includes("size-9"))
    expect(avatars).toHaveLength(2)
  })

  it("SkeletonDialog announces itself as a loading status", () => {
    render(<SkeletonDialog />)
    expect(screen.getByRole("status", { name: "Loading" })).toHaveAttribute(
      "aria-busy",
      "true"
    )
  })

  it("SkeletonDialog can drop the leading icon", () => {
    const { rerender } = render(<SkeletonDialog data-testid="dialog" />)
    const countBlocks = () =>
      screen.getByTestId("dialog").querySelectorAll("[data-slot='skeleton']")
        .length
    const withIcon = countBlocks()

    rerender(<SkeletonDialog data-testid="dialog" withIcon={false} />)
    expect(countBlocks()).toBe(withIcon - 1)
  })
})
