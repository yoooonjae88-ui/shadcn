"use client"

import * as React from "react"

import { RadioGroup, RadioGroupItem } from "@/registry/radio-group/radio-group"

const options = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push notification" },
]

export function RadioGroupControlledExample() {
  // Hold the selected value in state; `onValueChange` receives the `value`
  // prop of the item the user picked.
  const [value, setValue] = React.useState("email")

  return (
    <div className="flex w-fit flex-col gap-4">
      <RadioGroup
        value={value}
        onValueChange={(next) => setValue(next as string)}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center gap-2">
            <RadioGroupItem
              value={option.value}
              id={`rg-controlled-${option.value}`}
            />
            <label
              htmlFor={`rg-controlled-${option.value}`}
              className="text-sm font-medium"
            >
              {option.label}
            </label>
          </div>
        ))}
      </RadioGroup>
      <p className="text-sm text-muted-foreground">
        Selected value:{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
          {value}
        </code>
      </p>
    </div>
  )
}
