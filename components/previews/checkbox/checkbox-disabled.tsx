"use client"

import * as React from "react"

import { Checkbox } from "@/registry/checkbox/checkbox"

export function CheckboxDisabledExample() {
  const id1 = React.useId()
  const id2 = React.useId()
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 opacity-60">
        <Checkbox id={id1} disabled />
        <label htmlFor={id1} className="text-sm font-medium leading-none">
          Disabled
        </label>
      </div>
      <div className="flex items-center gap-2 opacity-60">
        <Checkbox id={id2} disabled defaultChecked />
        <label htmlFor={id2} className="text-sm font-medium leading-none">
          Disabled checked
        </label>
      </div>
    </div>
  )
}
