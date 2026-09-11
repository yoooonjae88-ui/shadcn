import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Checkbox } from "@/registry/checkbox/checkbox"

describe("Checkbox", () => {
  it("renders an unchecked checkbox", () => {
    render(<Checkbox aria-label="Accept terms" />)
    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" })
    expect(checkbox).not.toBeChecked()
  })

  it("toggles on click", async () => {
    const user = userEvent.setup()
    render(<Checkbox aria-label="Accept terms" />)
    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" })

    await user.click(checkbox)
    expect(checkbox).toBeChecked()

    await user.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  it("respects defaultChecked", () => {
    render(<Checkbox aria-label="Accept terms" defaultChecked />)
    expect(screen.getByRole("checkbox")).toBeChecked()
  })

  it("calls onCheckedChange with the new state", async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Checkbox aria-label="Accept terms" onCheckedChange={onCheckedChange} />)

    await user.click(screen.getByRole("checkbox"))
    expect(onCheckedChange).toHaveBeenCalledTimes(1)
    expect(onCheckedChange.mock.calls[0][0]).toBe(true)
  })

  it("cannot be toggled while disabled", async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(
      <Checkbox aria-label="Accept terms" disabled onCheckedChange={onCheckedChange} />
    )
    const checkbox = screen.getByRole("checkbox")

    expect(checkbox).toHaveAttribute("data-disabled")
    await user.click(checkbox)
    expect(onCheckedChange).not.toHaveBeenCalled()
    expect(checkbox).not.toBeChecked()
  })

  it("marks the indeterminate state for styling", () => {
    render(<Checkbox aria-label="Select all" indeterminate />)
    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).toHaveAttribute("aria-checked", "mixed")
    expect(checkbox).toHaveAttribute("data-indeterminate")
  })

  it("applies size variants", () => {
    const { rerender } = render(<Checkbox aria-label="Accept" />)
    expect(screen.getByRole("checkbox").className).toContain("size-4.5")

    rerender(<Checkbox aria-label="Accept" size="sm" />)
    expect(screen.getByRole("checkbox").className).toContain("size-4")

    rerender(<Checkbox aria-label="Accept" size="lg" />)
    expect(screen.getByRole("checkbox").className).toContain("size-5")
  })
})
