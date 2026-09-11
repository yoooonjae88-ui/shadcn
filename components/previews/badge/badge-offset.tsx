"use client"

import { Mail } from "lucide-react"

import { Badge } from "@/registry/badge/badge"

// offset nudges the badge; title shows a native tooltip on hover.
export function BadgeOffsetExample() {
  return (
    <Badge count={5} offset={[10, -4]} title="5 new messages">
      <Mail className="size-6 text-muted-foreground" />
    </Badge>
  )
}
