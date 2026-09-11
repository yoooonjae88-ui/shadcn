"use client"

import { RadioGroup, RadioGroupItem } from "@/registry/radio-group/radio-group"

const options = [
  {
    value: "default",
    label: "Default",
    description: "Standard spacing for most use cases.",
  },
  {
    value: "comfortable",
    label: "Comfortable",
    description: "More space between elements.",
  },
  {
    value: "compact",
    label: "Compact",
    description: "Minimal spacing for dense layouts.",
  },
]

export function RadioGroupDescriptionExample() {
  return (
    <RadioGroup defaultValue="comfortable" className="w-fit">
      {options.map((option) => (
        <div key={option.value} className="flex items-start gap-2">
          <RadioGroupItem
            value={option.value}
            id={`rg-desc-${option.value}`}
            className="mt-0.5"
          />
          <div className="flex flex-col gap-0.5">
            <label htmlFor={`rg-desc-${option.value}`} className="text-sm font-medium">
              {option.label}
            </label>
            <p className="text-sm text-muted-foreground">{option.description}</p>
          </div>
        </div>
      ))}
    </RadioGroup>
  )
}
