"use client"

import * as React from "react"

import { Switch } from "@/registry/switch/switch"

export function SwitchLoadingExample() {
  const [checked, setChecked] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const timeout = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  React.useEffect(() => () => clearTimeout(timeout.current), [])

  return (
    <label className="flex items-center gap-2.5">
      <Switch
        checked={checked}
        loading={loading}
        onCheckedChange={(next) => {
          // Simulate an async save before committing the new value.
          setLoading(true)
          timeout.current = setTimeout(() => {
            setChecked(next)
            setLoading(false)
          }, 1200)
        }}
      />
      <span className="text-sm font-medium select-none">
        {loading ? "Saving…" : checked ? "Connected" : "Disconnected"}
      </span>
    </label>
  )
}
