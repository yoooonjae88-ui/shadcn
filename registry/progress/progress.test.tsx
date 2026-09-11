import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { CircularProgress, Progress } from "@/registry/progress/progress"

describe("Progress", () => {
  it("renders a progressbar with the current value", () => {
    render(<Progress value={40} aria-label="Upload" />)
    const bar = screen.getByRole("progressbar", { name: "Upload" })
    expect(bar).toHaveAttribute("aria-valuenow", "40")
  })

  it("shows the label and formatted value", () => {
    render(<Progress value={40} label="Upload" showValue />)
    expect(screen.getByText("Upload")).toBeInTheDocument()
    expect(screen.getByText("40%")).toBeInTheDocument()
  })

  it("supports a custom value formatter", () => {
    render(
      <Progress
        value={2}
        max={8}
        label="Steps"
        showValue
        formatValue={(value) => `${value} of 8`}
      />
    )
    expect(screen.getByText("2 of 8")).toBeInTheDocument()
  })

  it("marks a null value as indeterminate", () => {
    render(<Progress value={null} aria-label="Loading" />)
    const bar = screen.getByRole("progressbar")
    expect(bar).not.toHaveAttribute("aria-valuenow")
    expect(
      bar.querySelector("[data-slot='progress-indicator']")
    ).toHaveAttribute("data-indeterminate")
  })

  it("applies size and variant classes", () => {
    render(
      <Progress value={10} size="lg" variant="success" aria-label="p" />
    )
    const bar = screen.getByRole("progressbar")
    expect(bar.querySelector("[data-slot='progress-track']")).toHaveClass("h-4")
    expect(bar.querySelector("[data-slot='progress-indicator']")).toHaveClass(
      "bg-progress-success"
    )
  })
})

describe("CircularProgress", () => {
  it("exposes progressbar semantics", () => {
    render(<CircularProgress value={65} aria-label="Storage" />)
    const ring = screen.getByRole("progressbar", { name: "Storage" })
    expect(ring).toHaveAttribute("aria-valuenow", "65")
    expect(ring).toHaveAttribute("aria-valuemin", "0")
    expect(ring).toHaveAttribute("aria-valuemax", "100")
  })

  it("shows the percentage in the center with showValue", () => {
    render(<CircularProgress value={65} showValue />)
    expect(screen.getByText("65%")).toBeInTheDocument()
  })

  it("clamps out-of-range values", () => {
    render(<CircularProgress value={150} showValue />)
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100"
    )
    expect(screen.getByText("100%")).toBeInTheDocument()
  })

  it("spins without a value readout when indeterminate", () => {
    render(<CircularProgress value={null} showValue />)
    const ring = screen.getByRole("progressbar")
    expect(ring).not.toHaveAttribute("aria-valuenow")
    expect(
      ring.querySelector("[data-slot='circular-progress-svg']")
    ).toHaveAttribute("data-status", "indeterminate")
  })

  it("sizes the ring from presets or explicit pixels", () => {
    const { rerender } = render(<CircularProgress value={10} size="lg" />)
    expect(screen.getByRole("progressbar")).toHaveStyle({ width: "80px" })

    rerender(<CircularProgress value={10} size={100} />)
    expect(screen.getByRole("progressbar")).toHaveStyle({ width: "100px" })
  })

  it("renders custom center content", () => {
    render(<CircularProgress value={30}>3/10</CircularProgress>)
    expect(screen.getByText("3/10")).toBeInTheDocument()
  })
})
