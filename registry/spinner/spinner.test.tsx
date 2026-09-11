import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Spinner } from "@/registry/spinner/spinner"

describe("Spinner", () => {
  it("renders a status live region", () => {
    render(<Spinner />)
    const spinner = screen.getByRole("status")
    expect(spinner).toHaveAttribute("aria-live", "polite")
    expect(spinner).toHaveAttribute("aria-busy", "true")
  })

  it("emits a screen-reader-only label when no children are given", () => {
    render(<Spinner />)
    expect(screen.getByText("Loading")).toHaveClass("sr-only")
  })

  it("uses aria-label to override the hidden label text", () => {
    render(<Spinner aria-label="Fetching data" />)
    expect(screen.getByText("Fetching data")).toHaveClass("sr-only")
  })

  it("renders a visible label from children instead of the sr-only one", () => {
    render(<Spinner>Loading users…</Spinner>)
    expect(screen.getByText("Loading users…")).not.toHaveClass("sr-only")
    expect(screen.queryByText("Loading")).not.toBeInTheDocument()
  })

  it("renders three dots for the dots variant", () => {
    render(<Spinner variant="dots" />)
    const visual = screen.getByRole("status").querySelector("[aria-hidden]")
    expect(visual?.children).toHaveLength(3)
  })

  it("renders four bars for the bars variant", () => {
    render(<Spinner variant="bars" />)
    const visual = screen.getByRole("status").querySelector("[aria-hidden]")
    expect(visual?.children).toHaveLength(4)
  })

  it("renders a spinning icon for icon variants", () => {
    render(<Spinner variant="circle" size="lg" />)
    const icon = screen.getByRole("status").querySelector("svg")
    expect(icon).toHaveClass("animate-spin", "size-8")
  })

  it("applies color variants from theme tokens", () => {
    const { rerender } = render(<Spinner />)
    expect(screen.getByRole("status")).toHaveClass("text-foreground")

    rerender(<Spinner color="primary" />)
    expect(screen.getByRole("status")).toHaveClass("text-primary")

    rerender(<Spinner color="success" />)
    expect(screen.getByRole("status")).toHaveClass("text-spinner-success")
  })
})
