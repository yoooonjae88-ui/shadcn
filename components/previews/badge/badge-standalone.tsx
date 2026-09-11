"use client"

import { Badge } from "@/registry/badge/badge"

function Block() {
  return <span className="inline-block size-11 rounded-md bg-muted" />
}

// Small size, and badges used standalone (without wrapping anything).
export function BadgeStandaloneExample() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Badge count={25} size="small">
        <Block />
      </Badge>
      <Badge count={25} />
      <Badge count={109} overflowCount={99} />
      <Badge dot>
        <a className="text-sm text-primary" href="#">
          Notifications
        </a>
      </Badge>
    </div>
  )
}
