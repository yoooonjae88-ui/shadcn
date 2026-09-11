"use client"

import { Badge } from "@/registry/badge/badge"

export function BadgeRibbonExample() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Badge.Ribbon text="Hippies">
        <div className="h-16 w-40 rounded-md bg-muted" />
      </Badge.Ribbon>
      <Badge.Ribbon text="Pushes" color="green" placement="start">
        <div className="h-16 w-40 rounded-md bg-muted" />
      </Badge.Ribbon>
      <Badge.Ribbon text="Sales" color="purple">
        <div className="h-16 w-40 rounded-md bg-muted" />
      </Badge.Ribbon>
    </div>
  )
}
