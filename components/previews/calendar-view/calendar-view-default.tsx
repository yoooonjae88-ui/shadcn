"use client"

import {
  CalendarView,
  type CalendarEvent,
} from "@/registry/calendar-view/calendar-view"

// July 2026: the 1st falls on a Wednesday, so "Conference trip" (Jul 3–7)
// crosses the first week boundary — it renders as one bar with a squared
// right edge in week one that continues, squared-left, into week two.
// Click any date to select it; switching to Week then opens that week.
const events: CalendarEvent[] = [
  { id: "design-review", title: "Design review", start: "2026-07-02" },
  {
    id: "conference",
    title: "Conference trip",
    start: "2026-07-03",
    end: "2026-07-07",
    status: "out-of-office",
  },
  // Five events touch Monday the 6th (including the spanning conference bar),
  // so with the default maxVisibleLanes of 3 that day collapses to "+2 more"
  // in the month view. These are timed, so in the week view they sit on the
  // time grid while the multi-day conference bar stays in the all-day row.
  {
    id: "sprint-planning",
    title: "Sprint planning",
    start: "2026-07-06T09:00",
    end: "2026-07-06T10:00",
  },
  {
    id: "one-on-one",
    title: "1:1 with Alex",
    start: "2026-07-06T10:00",
    end: "2026-07-06T10:30",
  },
  {
    id: "dentist",
    title: "Dentist",
    start: "2026-07-06T11:00",
    end: "2026-07-06T12:00",
    status: "out-of-office",
  },
  {
    id: "focus-block",
    title: "Focus block",
    start: "2026-07-06T13:00",
    end: "2026-07-06T15:00",
  },
  // These two overlap, so the week view splits them side by side.
  {
    id: "crew-standup",
    title: "Crew standup",
    start: "2026-07-08T09:30",
    end: "2026-07-08T10:00",
  },
  {
    id: "studio-sync",
    title: "Experience studio sync",
    start: "2026-07-08T10:00",
    end: "2026-07-08T11:30",
  },
  {
    id: "design-session",
    title: "Design session",
    start: "2026-07-08T10:30",
    end: "2026-07-08T11:30",
  },
  {
    id: "lunch-with-mom",
    title: "Lunch with mom",
    start: "2026-07-08T12:00",
    end: "2026-07-08T13:30",
    status: "out-of-office",
  },
  {
    id: "design-review-week",
    title: "Design review",
    start: "2026-07-10T13:00",
    end: "2026-07-10T14:00",
  },
  {
    id: "offsite",
    title: "Quarterly offsite",
    start: "2026-07-14",
    end: "2026-07-16",
  },
  {
    id: "annual-leave",
    title: "Annual leave",
    start: "2026-07-20",
    end: "2026-07-24",
    status: "out-of-office",
  },
  { id: "team-demo", title: "Team demo", start: "2026-07-30" },
]

export function CalendarViewDefaultExample() {
  return (
    <div className="w-full max-w-3xl rounded-xl bg-background p-3">
      <CalendarView
        defaultMonth={new Date(2026, 6, 1)}
        events={events}
        onEventClick={(event) => console.log("event clicked:", event.title)}
      />
    </div>
  )
}
