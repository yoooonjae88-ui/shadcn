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

// Give the parent a height and the calendar takes all of it: the week rows
// divide the space between them rather than staying a fixed 6rem each. Nothing
// to switch on — a parent with no height of its own still gets the natural
// size, so the same markup works in a page flow.
export function CalendarViewFillingExample() {
  return (
    <div className="h-[40rem] w-full rounded-xl border p-3">
      <CalendarView defaultMonth={new Date(2026, 6, 1)} events={events} />
    </div>
  )
}
