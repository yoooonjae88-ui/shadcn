"use client"

import * as React from "react"

import { Switch } from "@/registry/switch/switch"

export function SwitchControlledExample() {
  const [checked, setChecked] = React.useState(true)
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2.5">
        <Switch checked={checked} onCheckedChange={setChecked} />
        <span className="text-sm font-medium select-none">Wi-Fi</span>
      </label>
      <p className="text-sm text-muted-foreground">
        Currently {checked ? "on" : "off"}.
      </p>
    </div>
  )
}
