"use client"

import { Switch } from "@/registry/switch/switch"

export function SwitchDisabledExample() {
  return (
    <div className="flex flex-col gap-3">
      <label className="flex items-center gap-2.5">
        <Switch disabled defaultChecked />
        <span className="text-sm font-medium select-none">On (disabled)</span>
      </label>
      <label className="flex items-center gap-2.5">
        <Switch disabled />
        <span className="text-sm font-medium select-none">Off (disabled)</span>
      </label>
    </div>
  )
}
