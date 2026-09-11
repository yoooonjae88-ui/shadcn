"use client"

import { RadioGroup, RadioGroupItem } from "@/registry/radio-group/radio-group"

export function RadioGroupDisabledExample() {
  return (
    <RadioGroup defaultValue="comfortable" className="w-fit">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="default" id="rg-disabled-1" />
        <label htmlFor="rg-disabled-1" className="text-sm font-medium">
          Default
        </label>
      </div>
      <div className="flex items-center gap-2 opacity-60">
        <RadioGroupItem value="comfortable" disabled id="rg-disabled-2" />
        <label htmlFor="rg-disabled-2" className="text-sm font-medium">
          Comfortable (disabled)
        </label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="compact" id="rg-disabled-3" />
        <label htmlFor="rg-disabled-3" className="text-sm font-medium">
          Compact
        </label>
      </div>
    </RadioGroup>
  )
}
