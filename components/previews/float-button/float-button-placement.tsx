"use client"

import { Copy, Pencil, Trash2 } from "lucide-react"

import { FloatButton } from "@/registry/float-button/float-button"

export function FloatButtonPlacementExample() {
  return (
    <div className="relative h-64 w-full overflow-hidden rounded-xl bg-muted/40">
      {/* `placement` is the direction the menu flies out in; `corner` is where
          the group itself sits. */}
      <FloatButton.Group
        position="absolute"
        corner="top-left"
        offset={16}
        trigger="click"
        placement="right"
        icon={<Pencil />}
        triggerLabel="Edit actions"
      >
        <FloatButton icon={<Copy />} aria-label="Duplicate" />
        <FloatButton icon={<Trash2 />} aria-label="Delete" />
      </FloatButton.Group>

      <FloatButton.Group
        position="absolute"
        corner="bottom-right"
        offset={16}
        trigger="click"
        placement="left"
        type="primary"
        icon={<Pencil />}
        triggerLabel="Edit actions"
      >
        <FloatButton icon={<Copy />} aria-label="Duplicate" />
        <FloatButton icon={<Trash2 />} aria-label="Delete" />
      </FloatButton.Group>
    </div>
  )
}
