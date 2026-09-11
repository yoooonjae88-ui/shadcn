"use client"

import { RadioGroup, RadioGroupItem } from "@/registry/radio-group/radio-group"

export function RadioGroupSizesExample() {
  return (
    <div className="flex flex-wrap items-start gap-8">
      {(["sm", "default", "lg"] as const).map((size) => (
        <RadioGroup key={size} size={size} defaultValue="a" className="w-fit">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="a" id={`rg-size-${size}-a`} />
            <label htmlFor={`rg-size-${size}-a`} className="text-sm font-medium">
              {size === "default" ? "Default" : size === "sm" ? "Small" : "Large"}
            </label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="b" id={`rg-size-${size}-b`} />
            <label htmlFor={`rg-size-${size}-b`} className="text-sm font-medium">
              Option B
            </label>
          </div>
        </RadioGroup>
      ))}
    </div>
  )
}
