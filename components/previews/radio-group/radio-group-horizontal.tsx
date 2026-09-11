"use client"

import { RadioGroup, RadioGroupItem } from "@/registry/radio-group/radio-group"

export function RadioGroupHorizontalExample() {
  return (
    <RadioGroup
      defaultValue="viewer"
      className="flex w-auto flex-wrap items-center gap-6"
    >
      {["Admin", "Editor", "Viewer"].map((role) => (
        <div key={role} className="flex items-center gap-2">
          <RadioGroupItem value={role.toLowerCase()} id={`rg-role-${role}`} />
          <label htmlFor={`rg-role-${role}`} className="cursor-pointer text-sm font-medium">
            {role}
          </label>
        </div>
      ))}
    </RadioGroup>
  )
}
