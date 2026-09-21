"use client"

import { CircleQuestionMark, Plus } from "lucide-react"

import { FloatButton } from "@/registry/float-button/float-button"

export function FloatButtonTypeExample() {
  return (
    <div className="relative h-56 w-full overflow-hidden rounded-xl bg-muted/40">
      {/* `type` picks the colour: the default raised surface, or primary. */}
      <FloatButton
        position="absolute"
        offset={{ x: 88, y: 16 }}
        icon={<CircleQuestionMark />}
        aria-label="Help"
      />
      <FloatButton
        position="absolute"
        offset={16}
        type="primary"
        icon={<Plus />}
        aria-label="New item"
      />
    </div>
  )
}
