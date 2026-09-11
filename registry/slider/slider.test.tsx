import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { Slider } from "@/registry/slider/slider"

describe("Slider", () => {
  it("renders a slider with the default value", () => {
    render(<Slider defaultValue={30} aria-label="Volume" />)
    // Base UI renders the root as a group; the slider role lives on the
    // thumb's hidden range input.
    expect(screen.getByRole("group", { name: "Volume" })).toBeInTheDocument()
    expect(screen.getByRole("slider")).toHaveValue("30")
  })

  it("renders one thumb per value for range sliders", () => {
    render(<Slider defaultValue={[20, 80]} aria-label="Range" />)
    expect(document.querySelectorAll("[data-slot='slider-thumb']")).toHaveLength(
      2
    )
  })

  it("moves with arrow keys and reports changes", async () => {
    const onValueChange = vi.fn()
    render(
      <Slider defaultValue={50} onValueChange={onValueChange} aria-label="v" />
    )
    const slider = screen.getByRole("slider")

    fireEvent.keyDown(slider, { key: "ArrowRight" })
    expect(onValueChange).toHaveBeenCalled()
    expect(onValueChange.mock.calls[0][0]).toBe(51)
  })

  it("respects min, max and step", () => {
    render(
      <Slider defaultValue={4} min={0} max={10} step={2} aria-label="v" />
    )
    const slider = screen.getByRole("slider")
    expect(slider).toHaveAttribute("min", "0")
    expect(slider).toHaveAttribute("max", "10")

    fireEvent.keyDown(slider, { key: "ArrowRight" })
    expect(slider).toHaveValue("6")
  })

  it("derives tick marks from step with marks=true", () => {
    render(
      <Slider defaultValue={0} min={0} max={100} step={25} marks aria-label="v" />
    )
    const dots = document.querySelectorAll("[data-slot='slider-marks'] span")
    expect(dots).toHaveLength(5) // 0, 25, 50, 75, 100
  })

  it("renders labelled marks below the track", () => {
    render(
      <Slider
        defaultValue={0}
        marks={[
          { value: 0, label: "Low" },
          { value: 100, label: "High" },
        ]}
        aria-label="v"
      />
    )
    expect(screen.getByText("Low")).toBeInTheDocument()
    expect(screen.getByText("High")).toBeInTheDocument()
  })

  it("shows a formatted tooltip on the thumb", () => {
    render(
      <Slider defaultValue={40} tooltip={(v) => `${v}%`} aria-label="v" />
    )
    expect(
      document.querySelector("[data-slot='slider-tooltip']")
    ).toHaveTextContent("40%")
  })

  it("supports vertical orientation", () => {
    render(<Slider defaultValue={10} orientation="vertical" aria-label="v" />)
    expect(document.querySelector("[data-slot='slider']")).toHaveAttribute(
      "data-orientation",
      "vertical"
    )
  })
})
