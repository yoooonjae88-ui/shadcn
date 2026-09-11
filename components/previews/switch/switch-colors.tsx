"use client"

import { Switch } from "@/registry/switch/switch"

export function SwitchColorsExample() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Switch variant="primary" defaultChecked aria-label="Primary" />
      <Switch variant="mono" defaultChecked aria-label="Mono" />
      <Switch variant="success" defaultChecked aria-label="Success" />
      <Switch variant="warning" defaultChecked aria-label="Warning" />
      <Switch variant="destructive" defaultChecked aria-label="Destructive" />
    </div>
  )
}
