"use client"

import * as React from "react"

import { Checkbox } from "@/registry/checkbox/checkbox"

export function CheckboxDefaultExample() {
  const id = React.useId()
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} />
      <label htmlFor={id} className="cursor-pointer text-sm font-medium leading-none">
        Accept terms and conditions
      </label>
    </div>
  )
}
