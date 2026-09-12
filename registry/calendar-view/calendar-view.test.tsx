import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import {
  CalendarView,
  CalendarViewControls,
  CalendarViewGrid,
  CalendarViewProvider,
  type CalendarEvent,
} from "@/registry/calendar-view/calendar-view"

const events = [
  { id: "1", title: "Design review", start: "2026-07-06" },
  {
    id: "2",
    title: "Standup",
    start: "2026-07-07T09:00",
    end: "2026-07-07T09:30",
  },
]

// Accessible name of a date's clickable day button.
function dayLabel(date: Date) {
  return date.toLocaleDateString(undefined, { dateStyle: "long" })
}

function renderView(
  props: Partial<React.ComponentProps<typeof CalendarView>> = {}
) {
  return render(
    <CalendarView
      defaultMonth={new Date(2026, 6, 10)}
      events={events}
      {...props}
    />
  )
}

describe("CalendarView", () => {
  it("renders the month grid with its events", () => {
    renderView()
    expect(screen.getByLabelText("Month")).toHaveValue("6")
    expect(screen.getByLabelText("Year")).toHaveValue("2026")
    expect(screen.getByRole("grid")).toBeInTheDocument()
    expect(screen.getByText("Design review")).toBeInTheDocument()
  })

  it("navigates months with the arrows and reports onMonthChange", async () => {
    const user = userEvent.setup()
    const onMonthChange = vi.fn()
    renderView({ onMonthChange })

    await user.click(screen.getByRole("button", { name: "Next month" }))
    expect(screen.getByLabelText("Month")).toHaveValue("7")
    expect(onMonthChange).toHaveBeenCalled()
    expect((onMonthChange.mock.lastCall?.[0] as Date).getMonth()).toBe(7)

    await user.click(
      screen.getByRole("button", { name: "Previous month" })
    )
    expect(screen.getByLabelText("Month")).toHaveValue("6")
  })

  it("jumps via the month and year selects", async () => {
    const user = userEvent.setup()
    renderView()

    await user.selectOptions(screen.getByLabelText("Month"), "11")
    expect(screen.getByLabelText("Month")).toHaveValue("11")

    await user.selectOptions(screen.getByLabelText("Year"), "2027")
    expect(screen.getByLabelText("Year")).toHaveValue("2027")
  })

  it("returns to the current month via the Today button", async () => {
    const user = userEvent.setup()
    renderView()

    await user.click(screen.getByRole("button", { name: "Next month" }))
    await user.click(screen.getByRole("button", { name: "Today" }))

    const now = new Date()
    expect(screen.getByLabelText("Month")).toHaveValue(String(now.getMonth()))
    expect(screen.getByLabelText("Year")).toHaveValue(
      String(now.getFullYear())
    )
  })

  it("switches to the week view", async () => {
    const user = userEvent.setup()
    const onViewChange = vi.fn()
    renderView({ onViewChange })

    await user.click(screen.getByRole("button", { name: "week" }))
    expect(onViewChange).toHaveBeenCalledWith("week")
    expect(screen.getByRole("button", { name: "week" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )
    expect(
      screen.getByRole("button", { name: "Next week" })
    ).toBeInTheDocument()
  })

  it("steps a week at a time in the week view", async () => {
    const user = userEvent.setup()
    const onMonthChange = vi.fn()
    renderView({
      defaultView: "week",
      onMonthChange,
    })

    await user.click(screen.getByRole("button", { name: "Next week" }))
    // Cursor started on July 10, 2026; one week forward is July 17.
    const next = onMonthChange.mock.lastCall?.[0] as Date
    expect(next.getDate()).toBe(17)
    expect(next.getMonth()).toBe(6)
  })

  it("lays timed events on the week view's time grid", () => {
    // The week of July 10, 2026 (Jul 5–11) contains both sample events.
    renderView({ defaultView: "week" })

    // Timed event on the time grid, titled with its time range.
    const standup = screen.getByText("Standup").closest("button")
    expect(standup).toHaveAttribute("data-status", "busy")
    // All-day event in the spanning all-day row.
    expect(screen.getByText("Design review")).toBeInTheDocument()
  })

  it("renders a multi-day event as one bar per week row", () => {
    renderView({
      events: [
        {
          id: "trip",
          title: "Conference trip",
          // Jul 3–7, 2026 crosses the Sat/Sun boundary between the first
          // two week rows, so it renders exactly two spanning segments.
          start: "2026-07-03",
          end: "2026-07-07",
          status: "out-of-office" as const,
        },
      ],
    })
    const bars = screen.getAllByText("Conference trip")
    expect(bars).toHaveLength(2)
    expect(bars[0].closest("button")).toHaveAttribute(
      "data-status",
      "out-of-office"
    )
  })

  it("fires onEventClick with the original event", async () => {
    const user = userEvent.setup()
    const onEventClick = vi.fn()
    renderView({ onEventClick })

    await user.click(screen.getByText("Design review"))
    expect(onEventClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: "1", title: "Design review" })
    )
  })

  it("collapses overflow into a +N more button and expands inline", async () => {
    const user = userEvent.setup()
    const crowded = Array.from({ length: 5 }, (_, i) => ({
      id: `e${i}`,
      title: `Event ${i}`,
      start: "2026-07-06",
    }))
    renderView({ events: crowded, maxVisibleLanes: 2 })

    const more = screen.getByRole("button", { name: /more event/ })
    await user.click(more)
    // All five events become visible once expanded.
    for (let i = 0; i < 5; i++) {
      expect(screen.getByText(`Event ${i}`)).toBeInTheDocument()
    }
  })

  it("hands overflow to onMoreClick instead when provided", async () => {
    const user = userEvent.setup()
    const onMoreClick = vi.fn()
    const crowded = Array.from({ length: 5 }, (_, i) => ({
      id: `e${i}`,
      title: `Event ${i}`,
      start: "2026-07-06",
    }))
    renderView({ events: crowded, maxVisibleLanes: 2, onMoreClick })

    await user.click(screen.getByRole("button", { name: /more event/ }))
    expect(onMoreClick).toHaveBeenCalledTimes(1)
    const [date, dayEvents] = onMoreClick.mock.calls[0]
    expect((date as Date).getDate()).toBe(6)
    expect(dayEvents).toHaveLength(5)
  })
})

describe("CalendarView selection", () => {
  it("selects a date on click and clears it on a second click", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    renderView({ onSelect })

    const day = screen.getByRole("button", {
      name: dayLabel(new Date(2026, 6, 20)),
    })
    await user.click(day)
    expect(day).toHaveAttribute("aria-pressed", "true")
    expect((onSelect.mock.lastCall?.[0] as Date).getDate()).toBe(20)

    await user.click(day)
    expect(day).toHaveAttribute("aria-pressed", "false")
    expect(onSelect).toHaveBeenLastCalledWith(null)
  })

  it("supports controlled selection", () => {
    renderView({ selected: new Date(2026, 6, 8) })
    expect(
      screen.getByRole("button", { name: dayLabel(new Date(2026, 6, 8)) })
    ).toHaveAttribute("aria-pressed", "true")
  })

  it("opens the selected date's week when toggling to the week view", async () => {
    const user = userEvent.setup()
    renderView()

    await user.click(
      screen.getByRole("button", { name: dayLabel(new Date(2026, 6, 20)) })
    )
    await user.click(screen.getByRole("button", { name: "week" }))

    // The week of July 20, 2026 runs Sun Jul 19 – Sat Jul 25.
    expect(
      screen.getByRole("button", { name: dayLabel(new Date(2026, 6, 19)) })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: dayLabel(new Date(2026, 6, 25)) })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: dayLabel(new Date(2026, 6, 20)) })
    ).toHaveAttribute("aria-pressed", "true")
    expect(
      screen.queryByRole("button", { name: dayLabel(new Date(2026, 6, 5)) })
    ).not.toBeInTheDocument()
  })

  it("falls back to today's week when toggling to week with no selection", async () => {
    const user = userEvent.setup()
    // Focus a month far from today so the fallback jump is observable.
    renderView({ defaultMonth: new Date(2020, 0, 15) })

    await user.click(screen.getByRole("button", { name: "week" }))
    expect(
      screen.getByRole("button", { name: dayLabel(new Date()) })
    ).toBeInTheDocument()
  })

  it("does not change the selection when clicking an event", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    renderView({ onSelect })

    await user.click(screen.getByText("Design review"))
    expect(onSelect).not.toHaveBeenCalled()
  })

  it("also selects from the week view's day headings", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    renderView({ defaultView: "week", onSelect })

    const day = screen.getByRole("button", {
      name: dayLabel(new Date(2026, 6, 7)),
    })
    await user.click(day)
    expect(day).toHaveAttribute("aria-pressed", "true")
    expect((onSelect.mock.lastCall?.[0] as Date).getDate()).toBe(7)
  })
})

describe("CalendarView composition", () => {
  it("drives multiple grids from one shared control", async () => {
    const user = userEvent.setup()
    render(
      <CalendarViewProvider defaultMonth={new Date(2026, 6, 10)}>
        <CalendarViewControls />
        <CalendarViewGrid
          events={[{ id: "a", title: "Alice planning", start: "2026-08-03" }]}
        />
        <CalendarViewGrid
          events={[{ id: "b", title: "Ben review", start: "2026-08-05" }]}
        />
      </CalendarViewProvider>
    )

    expect(screen.getAllByRole("grid")).toHaveLength(2)
    expect(screen.queryByText("Alice planning")).not.toBeInTheDocument()
    expect(screen.queryByText("Ben review")).not.toBeInTheDocument()

    // One click on the shared controls advances every grid.
    await user.click(screen.getByRole("button", { name: "Next month" }))
    expect(screen.getByText("Alice planning")).toBeInTheDocument()
    expect(screen.getByText("Ben review")).toBeInTheDocument()
  })

  it("switches every grid to the week view together", async () => {
    const user = userEvent.setup()
    render(
      <CalendarViewProvider defaultMonth={new Date(2026, 6, 10)} defaultSelected={new Date(2026, 6, 7)}>
        <CalendarViewControls />
        <CalendarViewGrid
          events={[
            {
              id: "a",
              title: "Alice sync",
              start: "2026-07-07T09:00",
              end: "2026-07-07T09:30",
            },
          ]}
        />
        <CalendarViewGrid
          events={[
            {
              id: "b",
              title: "Ben focus",
              start: "2026-07-08T13:00",
              end: "2026-07-08T15:00",
            },
          ]}
        />
      </CalendarViewProvider>
    )

    await user.click(screen.getByRole("button", { name: "week" }))
    // Both grids now show the selected date's week with their own events.
    expect(screen.queryAllByRole("grid")).toHaveLength(0)
    expect(screen.getByText("Alice sync")).toBeInTheDocument()
    expect(screen.getByText("Ben focus")).toBeInTheDocument()
  })

  it("scrolls sibling week grids together behind one scrollbar", () => {
    const { container } = render(
      <CalendarViewProvider
        defaultMonth={new Date(2026, 6, 10)}
        defaultView="week"
      >
        <CalendarViewControls />
        <CalendarViewGrid />
        <CalendarViewGrid />
      </CalendarViewProvider>
    )

    const [first, second] = Array.from(
      container.querySelectorAll<HTMLDivElement>(
        '[data-slot="calendar-view-scroll"]'
      )
    )
    // All grids but the last hide their scrollbar…
    expect(first).toHaveClass("[scrollbar-width:none]")
    expect(second).not.toHaveClass("[scrollbar-width:none]")

    // …and scrolling one mirrors onto the others.
    first.scrollTop = 240
    fireEvent.scroll(first)
    expect(second.scrollTop).toBe(240)

    second.scrollTop = 96
    fireEvent.scroll(second)
    expect(first.scrollTop).toBe(96)
  })

  it("keeps its own scrollbar when a week grid stands alone", () => {
    const { container } = renderView({ defaultView: "week" })
    const scroll = container.querySelector<HTMLDivElement>(
      '[data-slot="calendar-view-scroll"]'
    )
    expect(scroll).not.toHaveClass("[scrollbar-width:none]")
  })

  it("throws a helpful error when a grid is used without a provider", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<CalendarViewGrid />)).toThrow(
      /within a <CalendarViewProvider>/
    )
    error.mockRestore()
  })
})

describe("CalendarView sizing", () => {
  const sizingEvents: CalendarEvent[] = [
    { id: "a", title: "Design review", start: "2026-07-02" },
  ]

  function root() {
    return document.querySelector("[data-slot='calendar-view']") as HTMLElement
  }
  function grid() {
    return document.querySelector(
      "[data-slot='calendar-view-grid']"
    ) as HTMLElement
  }

  it("stretches to the height its parent gives it", () => {
    render(
      <CalendarView defaultMonth={new Date(2026, 6, 1)} events={sizingEvents} />
    )
    expect(root()).toHaveClass("h-full", "min-h-0")
    expect(grid()).toHaveClass("flex-1", "min-h-0")
  })

  it("sizes week rows from a basis so they divide the height, not a fixed cell", () => {
    render(
      <CalendarView defaultMonth={new Date(2026, 6, 1)} events={sizingEvents} />
    )
    const rows = [...document.querySelectorAll("[role='grid'] > div")]
    expect(rows.length).toBeGreaterThan(0)
    for (const row of rows) {
      // h-24 is the starting size, flex-auto lets it grow or shrink from
      // there, and min-h-12 stops it collapsing. A fixed min-h-24 would pin
      // every cell to 6rem no matter how much room there was.
      expect(row).toHaveClass("h-24", "flex-auto", "min-h-12")
      expect(row).not.toHaveClass("min-h-24")
    }
  })

  it("keeps the month scrollable rather than spilling when space runs out", () => {
    render(
      <CalendarView defaultMonth={new Date(2026, 6, 1)} events={sizingEvents} />
    )
    expect(document.querySelector("[role='grid']")).toHaveClass(
      "overflow-y-auto",
      "min-h-0",
      "flex-1"
    )
  })

  it("treats the week view's 26rem as a basis so it grows and shrinks too", async () => {
    const user = userEvent.setup()
    render(
      <CalendarView defaultMonth={new Date(2026, 6, 1)} events={sizingEvents} />
    )
    await user.click(screen.getByRole("button", { name: "week" }))
    const scroll = document.querySelector(
      "[data-slot='calendar-view-scroll']"
    ) as HTMLElement
    expect(scroll).toHaveClass("h-[26rem]", "flex-auto", "min-h-0")
    // A hard cap would stop it filling a taller parent.
    expect(scroll).not.toHaveClass("max-h-[26rem]")
  })

  it("stretches through the composed provider + grid API too", () => {
    render(
      <CalendarViewProvider defaultMonth={new Date(2026, 6, 1)}>
        <CalendarViewGrid events={sizingEvents} />
      </CalendarViewProvider>
    )
    expect(grid()).toHaveClass("flex-1", "min-h-0")
  })
})
