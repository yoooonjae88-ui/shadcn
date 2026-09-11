import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Switch } from "@/registry/switch/switch"

describe("Switch", () => {
  it("renders an unchecked switch", () => {
    render(<Switch aria-label="Notifications" />)
    const el = screen.getByRole("switch", { name: "Notifications" })
    expect(el).not.toBeChecked()
  })

  it("toggles on click", async () => {
    const user = userEvent.setup()
    render(<Switch aria-label="Notifications" />)
    const el = screen.getByRole("switch")

    await user.click(el)
    expect(el).toBeChecked()

    await user.click(el)
    expect(el).not.toBeChecked()
  })

  it("calls onCheckedChange with the new state", async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Switch aria-label="Notifications" onCheckedChange={onCheckedChange} />)

    await user.click(screen.getByRole("switch"))
    expect(onCheckedChange).toHaveBeenCalledTimes(1)
    expect(onCheckedChange.mock.calls[0][0]).toBe(true)
  })

  it("respects defaultChecked", () => {
    render(<Switch aria-label="Notifications" defaultChecked />)
    expect(screen.getByRole("switch")).toBeChecked()
  })

  it("blocks interaction while loading and shows a spinner in the thumb", async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(
      <Switch aria-label="Saving" loading onCheckedChange={onCheckedChange} />
    )
    const el = screen.getByRole("switch")

    expect(el).toHaveAttribute("data-loading")
    expect(
      el.querySelector("[data-slot='switch-thumb'] svg")
    ).toHaveClass("animate-spin")

    await user.click(el)
    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  it("applies size and variant classes", () => {
    const { rerender } = render(<Switch aria-label="s" size="lg" />)
    expect(screen.getByRole("switch").className).toContain("w-11")

    rerender(<Switch aria-label="s" variant="destructive" />)
    expect(screen.getByRole("switch").className).toContain(
      "data-checked:bg-switch-destructive"
    )
  })

  it("renders on/off track indicators", () => {
    render(
      <Switch
        aria-label="Mode"
        indicatorOn={<span data-testid="on">I</span>}
        indicatorOff={<span data-testid="off">O</span>}
      />
    )
    expect(screen.getByTestId("on")).toBeInTheDocument()
    expect(screen.getByTestId("off")).toBeInTheDocument()
  })
})
