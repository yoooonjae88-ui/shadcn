"use client"

import { Link2, Mail, MessageCircle, Plus } from "lucide-react"

import { FloatButton } from "@/registry/float-button/float-button"

export function FloatButtonMenuExample() {
  return (
    <div className="relative h-64 w-full overflow-hidden rounded-xl bg-muted/40">
      {/* `trigger` hides the buttons behind the group's own button: "hover"
          opens on pointer enter or focus, "click" toggles and closes on an
          outside click or Escape. */}
      <FloatButton.Group
        position="absolute"
        offset={{ x: 88, y: 16 }}
        trigger="hover"
        icon={<MessageCircle />}
        triggerLabel="Share (hover)"
      >
        <FloatButton icon={<Mail />} tooltip="Email" aria-label="Email" />
        <FloatButton icon={<Link2 />} tooltip="Copy link" aria-label="Copy link" />
      </FloatButton.Group>

      <FloatButton.Group
        position="absolute"
        offset={16}
        trigger="click"
        type="primary"
        icon={<Plus />}
        triggerLabel="New (click)"
      >
        <FloatButton icon={<Mail />} tooltip="Email" aria-label="Email" />
        <FloatButton icon={<MessageCircle />} tooltip="Message" aria-label="Message" />
        <FloatButton icon={<Link2 />} tooltip="Copy link" aria-label="Copy link" />
      </FloatButton.Group>
    </div>
  )
}
