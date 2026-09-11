"use client"

import {
  CalendarViewControls,
  CalendarViewGrid,
  CalendarViewProvider,
  type CalendarEvent,
} from "@/registry/calendar-view/calendar-view"

// One CalendarViewProvider at the outer layer holds the shared state, a
// single CalendarViewControls drives it, and each user gets their own
// CalendarViewGrid — every grid navigates and switches Month/Week in
// lockstep, like a team-scheduling (Outlook-style) side-by-side view.
const calendars: { user: string; events: CalendarEvent[] }[] = [
  {
    user: "Priya Sharma",
    events: [
      {
        id: "priya-standup",
        title: "Standup",
        start: "2026-07-06T09:00",
        end: "2026-07-06T09:15",
      },
      {
        id: "priya-roadmap",
        title: "Roadmap review",
        start: "2026-07-07T10:00",
        end: "2026-07-07T11:30",
      },
      {
        id: "priya-focus",
        title: "Focus block",
        start: "2026-07-08T13:00",
        end: "2026-07-08T15:00",
      },
      {
        id: "priya-conference",
        title: "Design conference",
        start: "2026-07-16",
        end: "2026-07-17",
        status: "out-of-office",
      },
    ],
  },
  {
    user: "Marco Ruiz",
    events: [
      {
        id: "marco-standup",
        title: "Standup",
        start: "2026-07-06T09:00",
        end: "2026-07-06T09:15",
      },
      {
        id: "marco-interview",
        title: "Interview loop",
        start: "2026-07-06T14:00",
        end: "2026-07-06T16:00",
      },
      {
        id: "marco-dentist",
        title: "Dentist",
        start: "2026-07-09T11:00",
        end: "2026-07-09T12:00",
        status: "out-of-office",
      },
      {
        id: "marco-leave",
        title: "Annual leave",
        start: "2026-07-20",
        end: "2026-07-22",
        status: "out-of-office",
      },
    ],
  },
]

export function CalendarViewSharedControlsExample() {
  return (
    <div className="w-full rounded-xl bg-background p-3">
      <CalendarViewProvider defaultMonth={new Date(2026, 6, 6)}>
        <CalendarViewControls className="mb-3" />
        <div className="grid gap-4 lg:grid-cols-2">
          {calendars.map(({ user, events }) => (
            <div key={user} className="flex min-w-0 flex-col gap-1.5">
              <span className="px-1 text-sm font-medium">{user}</span>
              <CalendarViewGrid events={events} maxVisibleLanes={2} />
            </div>
          ))}
        </div>
      </CalendarViewProvider>
    </div>
  )
}
