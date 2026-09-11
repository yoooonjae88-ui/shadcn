"use client"

import * as React from "react"

import { Checkbox } from "@/registry/checkbox/checkbox"

// Controlled checked state.
export function CheckboxCheckedExample() {
  const id = React.useId()
  const [checked, setChecked] = React.useState(true)
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} checked={checked} onCheckedChange={setChecked} />
      <label htmlFor={id} className="cursor-pointer text-sm font-medium leading-none">
        Subscribe to newsletter
      </label>
    </div>
  )
}
