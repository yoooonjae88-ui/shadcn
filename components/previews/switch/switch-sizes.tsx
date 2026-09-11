"use client"

import { Switch } from "@/registry/switch/switch"

export function SwitchSizesExample() {
  return (
    <div className="flex items-center gap-6">
      <Switch size="sm" defaultChecked aria-label="Small" />
      <Switch size="default" defaultChecked aria-label="Default" />
      <Switch size="lg" defaultChecked aria-label="Large" />
    </div>
  )
}
