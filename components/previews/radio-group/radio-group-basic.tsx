"use client"

import { RadioGroup, RadioGroupItem } from "@/registry/radio-group/radio-group"

const options = ["Default", "Comfortable", "Compact"]

export function RadioGroupBasicExample() {
  return (
    <RadioGroup defaultValue="comfortable" className="w-fit">
      {options.map((option) => {
        const value = option.toLowerCase()
        return (
          <div key={value} className="flex items-center gap-2">
            <RadioGroupItem value={value} id={`rg-basic-${value}`} />
            <label htmlFor={`rg-basic-${value}`} className="text-sm font-medium">
              {option}
            </label>
          </div>
        )
      })}
    </RadioGroup>
  )
}
