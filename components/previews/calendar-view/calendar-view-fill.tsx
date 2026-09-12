"use client"

import {
  CalendarView,
  type CalendarEvent,
} from "@/registry/calendar-view/calendar-view"

const events: CalendarEvent[] = [
  { id: "design-review", title: "Design review", start: "2026-07-02" },
  {
    id: "conference",
    title: "Conference trip",
    start: "2026-07-03",
    end: "2026-07-07",
    status: "out-of-office",
  },
  {
    id: "sprint-planning",
    title: "Sprint planning",
    start: "2026-07-06T09:00",
    end: "2026-07-06T10:00",
  },
  {
    id: "one-on-one",
    title: "1:1",
    start: "2026-07-15T14:00",
    end: "2026-07-15T14:30",
  },
  {
    id: "retro",
    title: "Retro",
    start: "2026-07-22T16:00",
    end: "2026-07-22T17:00",
  },
]

// By default the calendar sizes to its content. `fill` makes it take the width
// AND height of its parent: the month's week rows share the leftover height
// (never dropping below their floor), and in Week view the time grid takes
// what's left and scrolls inside instead of stopping at its usual cap.
//
// The parent supplies the height — a fixed-height box here, but `flex-1` in a
// column or a grid track works the same way. Rows never shrink past a legible
// floor, so a container too short for the whole month scrolls instead.
export function CalendarViewFillExample() {
  return (
    <div className="h-[40rem] w-full rounded-xl border p-3">
      <CalendarView fill defaultMonth={new Date(2026, 6, 1)} events={events} />
    </div>
  )
}
