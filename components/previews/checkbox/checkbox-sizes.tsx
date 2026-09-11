"use client"

import { Checkbox } from "@/registry/checkbox/checkbox"

const sizes = [
  { size: "sm", label: "Small" },
  { size: "default", label: "Medium" },
  { size: "lg", label: "Large" },
] as const

export function CheckboxSizesExample() {
  return (
    <div className="flex flex-col gap-4">
      {sizes.map(({ size, label }) => {
        const id = `cb-size-${size}`
        return (
          <div key={size} className="flex items-center gap-2">
            <Checkbox id={id} size={size} defaultChecked />
            <label htmlFor={id} className="cursor-pointer text-sm font-medium leading-none">
              {label}
            </label>
          </div>
        )
      })}
    </div>
  )
}
