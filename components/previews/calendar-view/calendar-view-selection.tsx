"use client"

import * as React from "react"

import {
  CalendarView,
  type CalendarEvent,
} from "@/registry/calendar-view/calendar-view"

// Clicking a date selects it (click again to clear). Toggling to Week then
// opens the selected date's week — with nothing selected it falls back to
// today's week. `selected`/`onSelect` make the selection controlled here so
// the caption can echo it; omit them for uncontrolled selection.
const events: CalendarEvent[] = [
  {
    id: "kickoff",
    title: "Project kickoff",
    start: "2026-07-13T10:00",
    end: "2026-07-13T11:00",
  },
  {
    id: "workshop",
    title: "Discovery workshop",
    start: "2026-07-15T13:00",
    end: "2026-07-15T16:00",
  },
  {
    id: "offsite",
    title: "Quarterly offsite",
    start: "2026-07-14",
    end: "2026-07-16",
    status: "out-of-office",
  },
  {
    id: "retro",
    title: "Sprint retro",
    start: "2026-07-24T15:00",
    end: "2026-07-24T15:45",
  },
]

export function CalendarViewSelectionExample() {
  const [selected, setSelected] = React.useState<Date | null>(
    new Date(2026, 6, 15)
  )

  return (
    <div className="flex w-full max-w-3xl flex-col gap-2 rounded-xl bg-background p-3">
      <CalendarView
        defaultMonth={new Date(2026, 6, 1)}
        events={events}
        selected={selected}
        onSelect={setSelected}
      />
      <p className="px-1 text-xs text-muted-foreground">
        {selected
          ? `Selected ${selected.toLocaleDateString(undefined, {
              dateStyle: "long",
            })} — switch to Week to open that week.`
          : "No date selected — switching to Week opens today's week."}
      </p>
    </div>
  )
}
