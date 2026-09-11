import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Calendar } from "@/registry/calendar/calendar"

describe("Calendar", () => {
  it("renders the current month grid", () => {
    render(<Calendar defaultMonth={new Date(2026, 5, 1)} />)
    expect(screen.getByText("June 2026")).toBeInTheDocument()
    expect(screen.getByRole("grid")).toBeInTheDocument()
  })

  it("navigates to the next and previous month", async () => {
    const user = userEvent.setup()
    render(<Calendar defaultMonth={new Date(2026, 5, 1)} />)

    await user.click(
      screen.getByRole("button", { name: /next month/i })
    )
    expect(screen.getByText("July 2026")).toBeInTheDocument()

    await user.click(
      screen.getByRole("button", { name: /previous month/i })
    )
    expect(screen.getByText("June 2026")).toBeInTheDocument()
  })

  it("selects a day in single mode", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <Calendar
        mode="single"
        defaultMonth={new Date(2026, 5, 1)}
        onSelect={onSelect}
      />
    )

    await user.click(screen.getByRole("button", { name: /June 15/i }))
    expect(onSelect).toHaveBeenCalled()
    const selected = onSelect.mock.calls[0][0] as Date
    expect(selected.getDate()).toBe(15)
    expect(selected.getMonth()).toBe(5)
  })

  it("marks the selected day", async () => {
    const user = userEvent.setup()
    render(<Calendar mode="single" defaultMonth={new Date(2026, 5, 1)} />)

    const day = screen.getByRole("button", { name: /June 15/i })
    await user.click(day)
    expect(day).toHaveAttribute("data-selected-single", "true")
  })

  it("disables days outside the allowed range", () => {
    render(
      <Calendar
        mode="single"
        defaultMonth={new Date(2026, 5, 1)}
        disabled={{ before: new Date(2026, 5, 10) }}
      />
    )
    expect(screen.getByRole("button", { name: /June 5/i })).toBeDisabled()
    expect(screen.getByRole("button", { name: /June 15/i })).toBeEnabled()
  })
})
