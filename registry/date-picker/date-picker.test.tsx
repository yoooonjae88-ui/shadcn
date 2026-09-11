import { fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"

import {
  DatePicker,
  formatDate,
  parseDateString,
} from "@/registry/date-picker/date-picker"

// Freeze "today" so the panel always opens on March 2026 and the dates the
// tests click are the ones on screen. Only `Date` is faked, so the real timers
// user-event relies on keep running.
beforeAll(() => {
  vi.useFakeTimers({ toFake: ["Date"], now: new Date(2026, 2, 15, 12) })
})
afterAll(() => {
  vi.useRealTimers()
})

function day(year: number, month: number, date: number) {
  return new Date(year, month - 1, date)
}

/**
 * Click a day cell in the open panel by its accessible date label. The range
 * panel shows two months, so the same date can also appear as an outside day
 * of the neighbouring grid — those copies are skipped.
 */
async function pickDay(user: ReturnType<typeof userEvent.setup>, label: string) {
  await screen.findAllByRole("grid")
  const cell = screen
    .getAllByRole("button", { name: label })
    .find((button) => !button.closest("[data-outside]"))
  expect(cell).toBeDefined()
  await user.click(cell!)
}

describe("formatDate / parseDateString", () => {
  it("formats with dayjs-style tokens", () => {
    const date = day(2026, 3, 7)
    expect(formatDate(date)).toBe("2026-03-07")
    expect(formatDate(date, "DD/MM/YYYY")).toBe("07/03/2026")
    expect(formatDate(date, "D MMMM YYYY")).toBe("7 March 2026")
    expect(formatDate(date, "ddd, MMM D")).toBe("Sat, Mar 7")
  })

  it("reads numbers in the order the format declares", () => {
    expect(
      parseDateString("07/03/2026", { format: "DD/MM/YYYY", base: null })
    ).toEqual(day(2026, 3, 7))
    expect(
      parseDateString("03/07/2026", { format: "MM/DD/YYYY", base: null })
    ).toEqual(day(2026, 3, 7))
  })

  it("reads a spelled-out month and a two-digit year", () => {
    expect(
      parseDateString("7 March 26", { format: "D MMMM YYYY", base: null })
    ).toEqual(day(2026, 3, 7))
  })

  it("rejects text that isn't a real date", () => {
    expect(parseDateString("2026-02-31", { format: "YYYY-MM-DD", base: null })).toBeNull()
    expect(parseDateString("not a date", { format: "YYYY-MM-DD", base: null })).toBeNull()
    expect(parseDateString("   ", { format: "YYYY-MM-DD", base: null })).toBeNull()
  })
})

describe("DatePicker", () => {
  it("renders an input with the placeholder", () => {
    render(<DatePicker />)
    expect(screen.getByRole("textbox", { name: "Select date" })).toHaveValue("")
  })

  it("shows the formatted default value", () => {
    render(<DatePicker defaultValue={day(2026, 3, 7)} format="DD/MM/YYYY" />)
    expect(screen.getByRole("textbox")).toHaveValue("07/03/2026")
  })

  it("opens a calendar panel and commits the clicked day", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DatePicker defaultValue={day(2026, 3, 7)} onChange={onChange} />)

    fireEvent.pointerDown(screen.getByRole("textbox"))
    await pickDay(user, "Wednesday, March 11th, 2026")

    expect(onChange).toHaveBeenCalledTimes(1)
    const [date, dateString] = onChange.mock.calls[0]
    expect(dateString).toBe("2026-03-11")
    expect(date).toEqual(day(2026, 3, 11))
    expect(screen.getByRole("textbox")).toHaveValue("2026-03-11")
    // Picking a day closes the panel.
    await waitFor(() => expect(screen.queryByRole("grid")).not.toBeInTheDocument())
  })

  it("commits typed dates on Enter", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DatePicker onChange={onChange} />)

    // Focus without clicking — a click opens the panel.
    screen.getByRole("textbox").focus()
    await user.keyboard("2026-03-07{Enter}")

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0]).toEqual(day(2026, 3, 7))
    expect(onChange.mock.calls[0][1]).toBe("2026-03-07")
  })

  it("reverts unparseable text to the current value", async () => {
    const user = userEvent.setup()
    render(<DatePicker defaultValue={day(2026, 3, 7)} />)

    const input = screen.getByRole("textbox")
    input.focus()
    await user.clear(input)
    await user.keyboard("nonsense{Enter}")

    expect(input).toHaveValue("2026-03-07")
  })

  it("does not select a disabled date", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <DatePicker
        defaultValue={day(2026, 3, 7)}
        onChange={onChange}
        disabledDate={(date) => date.getDate() === 11}
      />
    )

    fireEvent.pointerDown(screen.getByRole("textbox"))
    const grid = await screen.findByRole("grid")
    expect(
      within(grid).getByRole("button", { name: "Wednesday, March 11th, 2026" })
    ).toBeDisabled()

    // Typing a disabled date is rejected too.
    const input = screen.getByRole("textbox")
    input.focus()
    await user.clear(input)
    await user.keyboard("2026-03-11{Enter}")
    expect(onChange).not.toHaveBeenCalled()
    expect(input).toHaveValue("2026-03-07")
  })

  it("clears the value and fires onClear", async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    const onChange = vi.fn()
    render(
      <DatePicker
        defaultValue={day(2026, 3, 7)}
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
    render(<DatePicker defaultValue={day(2026, 3, 7)} allowClear={false} />)
    expect(screen.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument()
  })

  it("picks a preset and closes", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <DatePicker
        defaultValue={day(2026, 3, 7)}
        onChange={onChange}
        presets={[{ label: "New year", value: day(2026, 1, 1) }]}
      />
    )

    fireEvent.pointerDown(screen.getByRole("textbox"))
    await user.click(await screen.findByRole("button", { name: "New year" }))
    expect(onChange.mock.calls[0][1]).toBe("2026-01-01")
  })

  it("submits the formatted value via a hidden input when named", () => {
    render(<DatePicker name="due" defaultValue={day(2026, 3, 7)} />)
    expect(document.querySelector("input[type='hidden'][name='due']")).toHaveValue(
      "2026-03-07"
    )
  })

  it("does not open while disabled", async () => {
    render(<DatePicker disabled />)
    fireEvent.pointerDown(screen.getByRole("textbox"))
    await new Promise((r) => setTimeout(r, 50))
    expect(screen.queryByRole("grid")).not.toBeInTheDocument()
  })
})

describe("DatePicker.RangePicker", () => {
  it("renders start and end inputs", () => {
    render(
      <DatePicker.RangePicker
        defaultValue={[day(2026, 3, 7), day(2026, 3, 14)]}
      />
    )
    expect(screen.getByRole("textbox", { name: "Start date" })).toHaveValue(
      "2026-03-07"
    )
    expect(screen.getByRole("textbox", { name: "End date" })).toHaveValue(
      "2026-03-14"
    )
  })

  it("commits once both ends are picked", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <DatePicker.RangePicker
        defaultValue={[day(2026, 3, 7), day(2026, 3, 14)]}
        onChange={onChange}
      />
    )

    fireEvent.pointerDown(screen.getByRole("textbox", { name: "Start date" }))
    // A start before the existing end keeps that end and completes the range.
    await pickDay(user, "Tuesday, March 3rd, 2026")

    expect(onChange).toHaveBeenCalledTimes(1)
    const [range, strings] = onChange.mock.calls[0]
    expect(strings).toEqual(["2026-03-03", "2026-03-14"])
    expect(range[0]).toEqual(day(2026, 3, 3))
    await waitFor(() => expect(screen.queryByRole("grid")).not.toBeInTheDocument())
  })

  it("stages a half-built range without firing onChange", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DatePicker.RangePicker onChange={onChange} />)

    fireEvent.pointerDown(screen.getByRole("textbox", { name: "Start date" }))
    await pickDay(user, "Tuesday, March 3rd, 2026")

    // Start staged, panel still open, nothing committed yet.
    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByRole("textbox", { name: "Start date" })).toHaveValue(
      "2026-03-03"
    )
    expect(screen.getAllByRole("grid").length).toBeGreaterThan(0)

    await pickDay(user, "Saturday, March 7th, 2026")
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][1]).toEqual(["2026-03-03", "2026-03-07"])
  })

  it("orders the ends when the end is typed before the start", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <DatePicker.RangePicker
        defaultValue={[day(2026, 3, 14), null]}
        onChange={onChange}
      />
    )

    const end = screen.getByRole("textbox", { name: "End date" })
    end.focus()
    await user.keyboard("2026-03-07{Enter}")

    expect(onChange.mock.calls[0][1]).toEqual(["2026-03-07", "2026-03-14"])
  })

  it("clears both ends", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <DatePicker.RangePicker
        defaultValue={[day(2026, 3, 7), day(2026, 3, 14)]}
        onChange={onChange}
      />
    )

    await user.click(screen.getByRole("button", { name: "Clear" }))
    expect(onChange).toHaveBeenCalledWith([null, null], ["", ""])
    expect(screen.getByRole("textbox", { name: "Start date" })).toHaveValue("")
  })

  it("picks a range preset", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <DatePicker.RangePicker
        onChange={onChange}
        presets={[
          { label: "That week", value: [day(2026, 3, 2), day(2026, 3, 8)] },
        ]}
      />
    )

    fireEvent.pointerDown(screen.getByRole("textbox", { name: "Start date" }))
    await user.click(await screen.findByRole("button", { name: "That week" }))
    expect(onChange.mock.calls[0][1]).toEqual(["2026-03-02", "2026-03-08"])
  })
})
