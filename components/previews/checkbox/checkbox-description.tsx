"use client"

import * as React from "react"

import { Checkbox } from "@/registry/checkbox/checkbox"

export function CheckboxDescriptionExample() {
  const id = React.useId()
  return (
    <div className="flex max-w-xs items-start gap-2.5">
      <Checkbox id={id} defaultChecked className="mt-0.5" />
      <div className="flex flex-col gap-1">
        <label htmlFor={id} className="cursor-pointer text-sm font-medium leading-none">
          Enable notifications
        </label>
        <p className="text-sm text-muted-foreground">
          Receive emails about your account activity and security alerts.
        </p>
      </div>
    </div>
  )
}
