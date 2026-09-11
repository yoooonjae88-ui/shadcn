import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Badge, BadgeRibbon } from "@/registry/badge/badge"

describe("Badge", () => {
  it("renders a count pill pinned to its child", () => {
    render(
      <Badge count={5} data-testid="badge">
        <button>Inbox</button>
      </Badge>
    )
    const badge = screen.getByTestId("badge")
    expect(badge.querySelector("[data-slot='badge-corner']")).toBeInTheDocument()
    expect(badge.querySelector("[data-slot='badge-count']")).toHaveTextContent(
      "5"
    )
  })

  it("hides a zero count unless showZero is set", () => {
    const { rerender } = render(<Badge count={0} data-testid="badge" />)
    expect(screen.queryByTestId("badge")).not.toBeInTheDocument()

    rerender(<Badge count={0} showZero data-testid="badge" />)
    expect(
      screen.getByTestId("badge").querySelector("[data-slot='badge-count']")
    ).toHaveTextContent("0")
  })

  it("caps the count at overflowCount with a plus suffix", () => {
    render(<Badge count={120} overflowCount={99} data-testid="badge" />)
    // ScrollNumber renders one digit strip per character: "9", "9", "+".
    const count = screen
      .getByTestId("badge")
      .querySelector("[data-slot='badge-count']")
    expect(count?.textContent).toContain("+")
  })

  it("renders a dot instead of a count with the dot prop", () => {
    render(
      <Badge dot data-testid="badge">
        <span>Bell</span>
      </Badge>
    )
    expect(
      screen.getByTestId("badge").querySelector("[data-slot='badge-dot']")
    ).toBeInTheDocument()
  })

  it("renders a standalone status dot with text", () => {
    render(<Badge status="success" text="Online" data-testid="badge" />)
    expect(screen.getByText("Online")).toBeInTheDocument()
    expect(
      screen.getByTestId("badge").querySelector(".bg-badge-status-success")
    ).toBeInTheDocument()
  })

  it("applies preset colors as token classes and custom colors inline", () => {
    const { rerender } = render(
      <Badge count={3} color="purple" data-testid="badge" />
    )
    expect(
      screen.getByTestId("badge").querySelector(".bg-badge-purple")
    ).toBeInTheDocument()

    rerender(<Badge count={3} color="rgb(1, 2, 3)" data-testid="badge" />)
    const pill = screen
      .getByTestId("badge")
      .querySelector("[data-slot='badge-count']") as HTMLElement
    expect(pill.style.backgroundColor).toBe("rgb(1, 2, 3)")
  })

  it("applies the corner offset", () => {
    render(
      <Badge count={1} offset={[4, 8]} data-testid="badge">
        <span>Box</span>
      </Badge>
    )
    const corner = screen
      .getByTestId("badge")
      .querySelector("[data-slot='badge-corner']") as HTMLElement
    expect(corner.style.transform).toBe(
      "translate(calc(50% + 4px), calc(-50% + 8px))"
    )
  })

  it("exposes Ribbon on the Badge namespace", () => {
    expect(Badge.Ribbon).toBe(BadgeRibbon)
  })
})

describe("BadgeRibbon", () => {
  it("renders the ribbon text over its children", () => {
    render(
      <BadgeRibbon text="Recommended" data-testid="ribbon">
        <div>Card body</div>
      </BadgeRibbon>
    )
    expect(screen.getByText("Recommended")).toBeInTheDocument()
    expect(screen.getByText("Card body")).toBeInTheDocument()
  })

  it("hangs from the start corner when requested", () => {
    render(
      <BadgeRibbon text="New" placement="start" data-testid="ribbon">
        <div>Body</div>
      </BadgeRibbon>
    )
    const ribbon = screen
      .getByTestId("ribbon")
      .querySelector("[data-slot='badge-ribbon']")
    expect(ribbon).toHaveClass("start-0")
  })
})
