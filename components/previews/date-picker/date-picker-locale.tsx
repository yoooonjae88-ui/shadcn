"use client"

import { DatePicker } from "@/registry/date-picker/date-picker"

// The picker speaks en-SG out of the box — dd-MM-yyyy, and month, weekday and
// day labels named in that locale. `locale` switches all of them together;
// `weekStartsOn` moves the first column for locales that start on Monday.
export function DatePickerLocaleExample() {
  const date = new Date(2026, 2, 7)

  return (
    <div className="flex flex-wrap items-start gap-4">
      <DatePicker defaultValue={date} format="dddd, D MMMM YYYY" className="w-56" />
      <DatePicker
        defaultValue={date}
        locale="en-GB"
        weekStartsOn={1}
        format="dddd, D MMMM YYYY"
        className="w-56"
      />
      <DatePicker
        defaultValue={date}
        locale="fr-FR"
        weekStartsOn={1}
        format="dddd D MMMM YYYY"
        className="w-56"
      />
    </div>
  )
}
