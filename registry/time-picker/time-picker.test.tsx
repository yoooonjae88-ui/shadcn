import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { TimePicker } from "@/registry/time-picker/time-picker"

function time(h: number, m = 0, s = 0) {
  const d = new Date()
  d.setHours(h, m, s, 0)
  return d
}

describe("TimePicker", () => {
  it("renders an input with the placeholder", () => {
    render(<TimePicker />)
    expect(screen.getByRole("textbox", { name: "Select time" })).toHaveValue("")
  })

  it("shows the formatted default value", () => {
    render(<TimePicker defaultValue={time(9, 5, 0)} />)
    expect(screen.getByRole("textbox")).toHaveValue("09:05:00")
  })

  it("respects a custom format and 12-hour mode", () => {
    const { unmount } = render(
      <TimePicker defaultValue={time(14, 30)} format="HH:mm" />
    )
    expect(screen.getByRole("textbox")).toHaveValue("14:30")
    unmount()

    render(<TimePicker defaultValue={time(14, 30)} use12Hours />)
    expect(screen.getByRole("textbox")).toHaveValue("2:30:00 PM")
  })

  it("commits typed times on Enter", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TimePicker format="HH:mm" onChange={onChange} />)

    // Focus without clicking — a click opens the panel, which grabs focus.
    const input = screen.getByRole("textbox")
    input.focus()
    await user.keyboard("10:45{Enter}")

    expect(onChange).toHaveBeenCalledTimes(1)
    const [date, str] = onChange.mock.calls[0]
    expect(str).toBe("10:45")
    expect((date as Date).getHours()).toBe(10)
    expect((date as Date).getMinutes()).toBe(45)
  })

  it("opens the panel with hour/minute/second columns", async () => {
    render(<TimePicker />)

    fireEvent.pointerDown(screen.getByRole("textbox"))
    await waitFor(() =>
      expect(screen.getByLabelText("hour")).toBeInTheDocument()
    )
    expect(screen.getByLabelText("minute")).toBeInTheDocument()
    expect(screen.getByLabelText("second")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "OK" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Now" })).toBeInTheDocument()
  })

  it("clears the value and fires onClear", async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    const onChange = vi.fn()
    render(
      <TimePicker
        defaultValue={time(9, 0)}
        onClear={onClear}
        onChange={onChange}
      />
    )

    await user.click(screen.getByRole("button", { name: "Clear" }))
    expect(onClear).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(null, "")
    expect(screen.getByRole("textbox")).toHaveValue("")
  })

  it("hides the clear button with allowClear=false", () => {
    render(<TimePicker defaultValue={time(9, 0)} allowClear={false} />)
    expect(
      screen.queryByRole("button", { name: "Clear" })
    ).not.toBeInTheDocument()
  })

  it("submits the formatted value via a hidden input when named", () => {
    render(
      <TimePicker name="start" format="HH:mm" defaultValue={time(8, 15)} />
    )
    expect(
      document.querySelector("input[type='hidden'][name='start']")
    ).toHaveValue("08:15")
  })

  it("does not open while disabled", async () => {
    render(<TimePicker disabled />)
    fireEvent.pointerDown(screen.getByRole("textbox"))
    await new Promise((r) => setTimeout(r, 50))
    expect(screen.queryByLabelText("hour")).not.toBeInTheDocument()
  })
})
