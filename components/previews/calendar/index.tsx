import type { PreviewExample } from "@/components/previews/types"
import { CalendarBookedExample } from "./calendar-booked"
import { CalendarDisabledExample } from "./calendar-disabled"
import { CalendarDropdownExample } from "./calendar-dropdown"
import { CalendarMinMaxExample } from "./calendar-min-max"
import { CalendarMultipleExample } from "./calendar-multiple"
import { CalendarMultipleMonthsExample } from "./calendar-multiple-months"
import { CalendarPresetsExample } from "./calendar-presets"
import { CalendarRangeExample } from "./calendar-range"
import { CalendarSingleExample } from "./calendar-single"
import { CalendarWeekNumbersExample } from "./calendar-week-numbers"

export const calendarExamples: PreviewExample[] = [
  {
    name: "single",
    title: "Single date",
    component: CalendarSingleExample,
    file: "components/previews/calendar/calendar-single.tsx",
  },
  {
    name: "multiple",
    title: "Multiple dates",
    component: CalendarMultipleExample,
    file: "components/previews/calendar/calendar-multiple.tsx",
  },
  {
    name: "range",
    title: "Range",
    component: CalendarRangeExample,
    file: "components/previews/calendar/calendar-range.tsx",
  },
  {
    name: "dropdown",
    title: "Month & year select",
    component: CalendarDropdownExample,
    file: "components/previews/calendar/calendar-dropdown.tsx",
  },
  {
    name: "multiple-months",
    title: "Multiple months",
    component: CalendarMultipleMonthsExample,
    file: "components/previews/calendar/calendar-multiple-months.tsx",
  },
  {
    name: "min-max",
    title: "Min & max range",
    component: CalendarMinMaxExample,
    file: "components/previews/calendar/calendar-min-max.tsx",
  },
  {
    name: "disabled",
    title: "Disabled dates",
    component: CalendarDisabledExample,
    file: "components/previews/calendar/calendar-disabled.tsx",
  },
  {
    name: "booked",
    title: "Booked dates",
    component: CalendarBookedExample,
    file: "components/previews/calendar/calendar-booked.tsx",
  },
  {
    name: "week-numbers",
    title: "Week numbers",
    component: CalendarWeekNumbersExample,
    file: "components/previews/calendar/calendar-week-numbers.tsx",
  },
  {
    name: "presets",
    title: "Presets",
    component: CalendarPresetsExample,
    file: "components/previews/calendar/calendar-presets.tsx",
  },
]
