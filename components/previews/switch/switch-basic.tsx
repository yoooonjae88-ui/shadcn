"use client"

import { Switch } from "@/registry/switch/switch"

export function SwitchBasicExample() {
  return (
    <div className="flex items-center gap-6">
      <Switch defaultChecked aria-label="On by default" />
      <Switch aria-label="Off by default" />
    </div>
  )
}
