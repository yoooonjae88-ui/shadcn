"use client"

import { CalendarCheck, PlaneTakeoff } from "lucide-react"

import { DatePicker } from "@/registry/date-picker/date-picker"

// prefix sits at the start of the field; suffixIcon replaces the trailing
// calendar glyph (the clear button still takes its place when there's a value).
export function DatePickerPrefixSuffixExample() {
  return (
    <div className="flex flex-wrap items-start gap-4">
      <DatePicker
        defaultValue={new Date(2026, 2, 7)}
        prefix={<PlaneTakeoff />}
        className="w-52"
        placeholder="Departure"
      />
      <DatePicker suffixIcon={<CalendarCheck />} placeholder="Due date" />
    </div>
  )
}
