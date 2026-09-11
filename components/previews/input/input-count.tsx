"use client"

import { Input } from "@/registry/input/input"

// Clear button, character count and maxLength.
export function InputCountExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Input allowClear placeholder="Type then clear me" defaultValue="Clearable" />
      <Input showCount maxLength={20} placeholder="Max 20 characters" />
      <Input
        count={{
          show: true,
          max: 8,
          exceedFormatter: (value, { max }) => [...value].slice(0, max).join(""),
        }}
        placeholder="Hard-cut at 8 (count config)"
      />
    </div>
  )
}
