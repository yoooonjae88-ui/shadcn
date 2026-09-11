"use client"

import { Badge } from "@/registry/badge/badge"

export function BadgeStatusExample() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Badge status="success" text="Success" />
      <Badge status="processing" text="Processing" />
      <Badge status="default" text="Default" />
      <Badge status="error" text="Error" />
      <Badge status="warning" text="Warning" />
    </div>
  )
}
