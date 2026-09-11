"use client"

import * as React from "react"

import { Checkbox } from "@/registry/checkbox/checkbox"

export function CheckboxIndeterminateExample() {
  const id = React.useId()
  const [indeterminate, setIndeterminate] = React.useState(true)
  const [checked, setChecked] = React.useState(false)
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={id}
        checked={checked}
        indeterminate={indeterminate}
        onCheckedChange={(value) => {
          setIndeterminate(false)
          setChecked(value)
        }}
      />
      <label htmlFor={id} className="cursor-pointer text-sm font-medium leading-none">
        Indeterminate state
      </label>
    </div>
  )
}
