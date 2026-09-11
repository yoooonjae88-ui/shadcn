"use client"

import { Switch } from "@/registry/switch/switch"

export function SwitchLabelExample() {
  return (
    <div className="flex flex-col gap-3">
      <label className="flex items-center gap-2.5">
        <Switch defaultChecked />
        <span className="text-sm font-medium select-none">Enable notifications</span>
      </label>
      {/* Label pinned to the left, switch pushed to the far edge. */}
      <label className="flex w-full max-w-xs items-center justify-between gap-4">
        <span className="text-sm font-medium select-none">Marketing emails</span>
        <Switch />
      </label>
    </div>
  )
}
