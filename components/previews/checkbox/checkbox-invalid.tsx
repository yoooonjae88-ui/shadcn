"use client"

import * as React from "react"

import { Checkbox } from "@/registry/checkbox/checkbox"

export function CheckboxInvalidExample() {
  const id = React.useId()
  const [checked, setChecked] = React.useState(false)
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={setChecked}
          aria-invalid={!checked}
        />
        <label
          htmlFor={id}
          className={`cursor-pointer text-sm font-medium leading-none ${
            checked ? "" : "text-destructive"
          }`}
        >
          I accept the terms
        </label>
      </div>
      {!checked && (
        <p className="text-sm text-destructive">
          You must accept before continuing.
        </p>
      )}
    </div>
  )
}
