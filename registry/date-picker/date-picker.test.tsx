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
  it("defaults to the en-SG day-month-year order", () => {
    expect(formatDate(day(2026, 3, 7))).toBe("07-03-2026")
  })

  it("accepts the dd-MM-yyyy spelling as well as DD-MM-YYYY", () => {
    const date = day(2026, 3, 7)
    expect(formatDate(date, "dd-MM-yyyy")).toBe("07-03-2026")
    expect(formatDate(date, "dd/MM/yy")).toBe("07/03/26")
    expect(parseDateString("07-03-2026", { format: "dd-MM-yyyy", base: null })).toEqual(
      date
    )
  })

  it("formats the other supported tokens", () => {
    const date = day(2026, 3, 7)
    expect(formatDate(date, "YYYY-MM-DD")).toBe("2026-03-07")
    expect(formatDate(date, "D MMMM YYYY")).toBe("7 March 2026")
    expect(formatDate(date, "ddd, D MMM")).toBe("Sat, 7 Mar")
    // The weekday tokens win over the day-of-month token they start with.
    expect(formatDate(date, "dddd")).toBe("Saturday")
  })

  it("names months and days in the given locale", () => {
    const date = day(2026, 3, 7)
    expect(formatDate(date, "dddd D MMMM", "fr-FR")).toBe("samedi 7 mars")
    expect(
      parseDateString("7 mars 2026", { format: "D MMMM YYYY", base: null, locale: "fr-FR" })
    ).toEqual(date)
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
    expect(parseDateString("31-02-2026", { format: "DD-MM-YYYY", base: null })).toBeNull()
    expect(parseDateString("not a date", { format: "DD-MM-YYYY", base: null })).toBeNull()
    expect(parseDateString("   ", { format: "DD-MM-YYYY", base: null })).toBeNull()
  })
})

describe("DatePicker", () => {
  it("renders an input with the placeholder", () => {
    render(<DatePicker />)
    expect(screen.getByRole("textbox", { name: "Select date" })).toHaveValue("")
  })

  it("shows the default value in dd-MM-yyyy", () => {
    render(<DatePicker defaultValue={day(2026, 3, 7)} />)
    expect(screen.getByRole("textbox")).toHaveValue("07-03-2026")
  })

  it("honours a custom format", () => {
    render(<DatePicker defaultValue={day(2026, 3, 7)} format="YYYY-MM-DD" />)
    expect(screen.getByRole("textbox")).toHaveValue("2026-03-07")
  })

  it("labels the panel days in en-SG", async () => {
    render(<DatePicker defaultValue={day(2026, 3, 7)} />)
    fireEvent.pointerDown(screen.getByRole("textbox"))

    const grid = await screen.findByRole("grid")
    expect(
      within(grid).getByRole("button", { name: "Wednesday, 11 March 2026" })
    ).toBeInTheDocument()
    // The selected and current days carry the usual suffix / prefix.
    expect(
      within(grid).getByRole("button", { name: "Saturday, 7 March 2026, selected" })
    ).toBeInTheDocument()
    expect(
      within(grid).getByRole("button", { name: "Today, Sunday, 15 March 2026" })
    ).toBeInTheDocument()
  })

  it("keeps two-letter weekday headers in every locale", async () => {
    // The weekday row is aria-hidden (the day labels carry the full name), so
    // it is read from the DOM rather than by role.
    const headers = async () => {
      await screen.findAllByRole("grid")
      return [...document.querySelectorAll("thead th")].map((th) => th.textContent)
    }

    const { unmount } = render(<DatePicker />)
    fireEvent.pointerDown(screen.getByRole("textbox"))
    expect(await headers()).toEqual(["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"])
    unmount()

    render(<DatePicker locale="fr-FR" weekStartsOn={1} />)
    fireEvent.pointerDown(screen.getByRole("textbox"))
    expect(await headers()).toEqual(["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"])
  })

  it("opens a calendar panel and commits the clicked day", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DatePicker defaultValue={day(2026, 3, 7)} onChange={onChange} />)

    fireEvent.pointerDown(screen.getByRole("textbox"))
    await pickDay(user, "Wednesday, 11 March 2026")

    expect(onChange).toHaveBeenCalledTimes(1)
    const [date, dateString] = onChange.mock.calls[0]
    expect(dateString).toBe("11-03-2026")
    expect(date).toEqual(day(2026, 3, 11))
    expect(screen.getByRole("textbox")).toHaveValue("11-03-2026")
    // Picking a day closes the panel.
    await waitFor(() => expect(screen.queryByRole("grid")).not.toBeInTheDocument())
  })

  it("commits typed dates on Enter", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DatePicker onChange={onChange} />)

    // Focus without clicking — a click opens the panel.
    screen.getByRole("textbox").focus()
    await user.keyboard("07-03-2026{Enter}")

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0]).toEqual(day(2026, 3, 7))
    expect(onChange.mock.calls[0][1]).toBe("07-03-2026")
  })

  it("reverts unparseable text to the current value", async () => {
    const user = userEvent.setup()
    render(<DatePicker defaultValue={day(2026, 3, 7)} />)

    const input = screen.getByRole("textbox")
    input.focus()
    await user.clear(input)
    await user.keyboard("nonsense{Enter}")

    expect(input).toHaveValue("07-03-2026")
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
      within(grid).getByRole("button", { name: "Wednesday, 11 March 2026" })
    ).toBeDisabled()

    // Typing a disabled date is rejected too.
    const input = screen.getByRole("textbox")
    input.focus()
    await user.clear(input)
    await user.keyboard("11-03-2026{Enter}")
    expect(onChange).not.toHaveBeenCalled()
    expect(input).toHaveValue("07-03-2026")
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
    expect(onChange.mock.calls[0][1]).toBe("01-01-2026")
  })

  it("submits the formatted value via a hidden input when named", () => {
    render(<DatePicker name="due" defaultValue={day(2026, 3, 7)} />)
    expect(document.querySelector("input[type='hidden'][name='due']")).toHaveValue(
      "07-03-2026"
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
  it("renders start and end inputs in dd-MM-yyyy", () => {
    render(
      <DatePicker.RangePicker
        defaultValue={[day(2026, 3, 7), day(2026, 3, 14)]}
      />
    )
    expect(screen.getByRole("textbox", { name: "Start date" })).toHaveValue(
      "07-03-2026"
    )
    expect(screen.getByRole("textbox", { name: "End date" })).toHaveValue(
      "14-03-2026"
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
    await pickDay(user, "Tuesday, 3 March 2026")

    expect(onChange).toHaveBeenCalledTimes(1)
    const [range, strings] = onChange.mock.calls[0]
    expect(strings).toEqual(["03-03-2026", "14-03-2026"])
    expect(range[0]).toEqual(day(2026, 3, 3))
    await waitFor(() => expect(screen.queryByRole("grid")).not.toBeInTheDocument())
  })

  it("stages a half-built range without firing onChange", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DatePicker.RangePicker onChange={onChange} />)

    fireEvent.pointerDown(screen.getByRole("textbox", { name: "Start date" }))
    await pickDay(user, "Tuesday, 3 March 2026")

    // Start staged, panel still open, nothing committed yet.
    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByRole("textbox", { name: "Start date" })).toHaveValue(
      "03-03-2026"
    )
    expect(screen.getAllByRole("grid").length).toBeGreaterThan(0)

    await pickDay(user, "Saturday, 7 March 2026")
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][1]).toEqual(["03-03-2026", "07-03-2026"])
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
    await user.keyboard("07-03-2026{Enter}")

    expect(onChange.mock.calls[0][1]).toEqual(["07-03-2026", "14-03-2026"])
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
    expect(onChange.mock.calls[0][1]).toEqual(["02-03-2026", "08-03-2026"])
  })
})
