"use client"

import { Bell, Wifi } from "lucide-react"

import { Switch } from "@/registry/switch/switch"

const rows = [
  {
    icon: Bell,
    title: "Push notifications",
    description: "Get notified when something happens.",
    defaultChecked: true,
  },
  {
    icon: Wifi,
    title: "Auto-connect",
    description: "Join known networks automatically.",
    defaultChecked: false,
  },
]

export function SwitchSettingsListExample() {
  return (
    <div className="w-full max-w-xs overflow-hidden rounded-xl bg-card text-card-foreground shadow-xs">
      {rows.map((row, index) => (
        <div key={row.title}>
          {index > 0 && <div className="h-px bg-border" aria-hidden="true" />}
          <label className="flex cursor-pointer items-center justify-between gap-4 p-4">
            <span className="flex items-center gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                <row.icon aria-hidden="true" className="size-4" />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{row.title}</span>
                <span className="text-xs text-muted-foreground">{row.description}</span>
              </span>
            </span>
            <Switch defaultChecked={row.defaultChecked} />
          </label>
        </div>
      ))}
    </div>
  )
}
