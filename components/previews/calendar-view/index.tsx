import type { PreviewExample } from "@/components/previews/types"
import { CalendarViewDefaultExample } from "./calendar-view-default"
import { CalendarViewFillingExample } from "./calendar-view-filling"
import { CalendarViewSelectionExample } from "./calendar-view-selection"
import { CalendarViewSharedControlsExample } from "./calendar-view-shared-controls"

export const calendarViewExamples: PreviewExample[] = [
  {
    name: "default",
    title: "Default",
    component: CalendarViewDefaultExample,
    file: "components/previews/calendar-view/calendar-view-default.tsx",
  },
  {
    name: "shared-controls",
    title: "Shared controls across calendars",
    component: CalendarViewSharedControlsExample,
    file: "components/previews/calendar-view/calendar-view-shared-controls.tsx",
  },
  {
    name: "selection",
    title: "Date selection & week focus",
    component: CalendarViewSelectionExample,
    file: "components/previews/calendar-view/calendar-view-selection.tsx",
  },
  {
    name: "filling",
    title: "Filling its container",
    component: CalendarViewFillingExample,
    file: "components/previews/calendar-view/calendar-view-filling.tsx",
  },
]
