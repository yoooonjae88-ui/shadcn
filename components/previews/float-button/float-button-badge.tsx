"use client"

import { Bell, Inbox } from "lucide-react"

import { FloatButton } from "@/registry/float-button/float-button"

export function FloatButtonBadgeExample() {
  return (
    <div className="relative h-56 w-full overflow-hidden rounded-xl bg-muted/40">
      {/* `badge` takes the Badge item's count / dot props. */}
      <FloatButton
        position="absolute"
        offset={{ x: 88, y: 16 }}
        icon={<Bell />}
        badge={{ dot: true }}
        aria-label="Notifications"
      />
      <FloatButton
        position="absolute"
        offset={16}
        type="primary"
        icon={<Inbox />}
        badge={{ count: 12 }}
        aria-label="Inbox"
      />
    </div>
  )
}
