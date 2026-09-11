"use client"

import { RadioGroup, RadioGroupItem } from "@/registry/radio-group/radio-group"

const colors = [
  { value: "blue", label: "Blue", className: "data-checked:bg-radio-blue" },
  { value: "green", label: "Green", className: "data-checked:bg-radio-green" },
  { value: "yellow", label: "Yellow", className: "data-checked:bg-radio-yellow" },
]

export function RadioGroupColoredExample() {
  return (
    <RadioGroup defaultValue="blue" className="w-fit">
      {colors.map((color) => (
        <div key={color.value} className="flex items-center gap-2">
          <RadioGroupItem
            value={color.value}
            id={`rg-color-${color.value}`}
            className={color.className}
          />
          <label htmlFor={`rg-color-${color.value}`} className="text-sm font-medium">
            {color.label}
          </label>
        </div>
      ))}
    </RadioGroup>
  )
}
