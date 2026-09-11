"use client"

import { Switch } from "@/registry/switch/switch"

export function SwitchInvalidExample() {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2.5">
        <Switch aria-invalid />
        <span className="text-sm font-medium text-destructive">Accept terms</span>
      </label>
      <p className="text-sm text-muted-foreground">
        You must enable this to continue.
      </p>
    </div>
  )
}
