"use client"

import * as React from "react"

import { DatePicker } from "@/registry/date-picker/date-picker"

// showWeekNumber adds the week column; numberOfMonths pages several months at
// once, which makes a long range easier to span.
export function DatePickerWeekNumbersExample() {
  const [value, setValue] = React.useState<[Date | null, Date | null]>([
    null,
    null,
  ])

  return (
    <div className="flex flex-col items-start gap-1">
      <DatePicker.RangePicker
        value={value}
        onChange={setValue}
        showWeekNumber
        numberOfMonths={3}
        placeholder={["Sprint start", "Sprint end"]}
      />
      <p className="text-xs text-muted-foreground">
        {value[0] && value[1]
          ? `${value[0].toLocaleDateString()} → ${value[1].toLocaleDateString()}`
          : "Three months, with week numbers."}
      </p>
    </div>
  )
}
