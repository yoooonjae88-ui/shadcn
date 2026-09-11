"use client"

import { Bell, Clock } from "lucide-react"

import { Badge } from "@/registry/badge/badge"

// A neutral square stand-in for whatever the badge wraps (avatar, icon, …).
function Block() {
  return <span className="inline-block size-11 rounded-md bg-muted" />
}

export function BadgeCountExample() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Badge count={5}>
        <Block />
      </Badge>
      <Badge count={0} showZero>
        <Block />
      </Badge>
      <Badge count={1000} overflowCount={99}>
        <Block />
      </Badge>
      <Badge dot>
        <Bell className="size-6 text-muted-foreground" />
      </Badge>
      <Badge count={<Clock className="size-4 text-badge-status-warning" />}>
        <Block />
      </Badge>
    </div>
  )
}
